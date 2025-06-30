// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
// const supervisorRoutes = require('./routes/supervisorRoutes');
// const technicianRoutes = require('./routes/technicianRoutes');

// Importar middleware
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================================================
// MIDDLEWARE DE SEGURIDAD
// =============================================================================

// Helmet para seguridad HTTP
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compresión gzip
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por ventana por IP
  message: {
    error: 'Demasiadas peticiones desde esta IP, intenta nuevamente en 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting más estricto para rutas de autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por IP cada 15 minutos
  message: {
    error: 'Demasiados intentos de autenticación, intenta nuevamente en 15 minutos.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  skipSuccessfulRequests: true
});

// Aplicar rate limiting
app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// =============================================================================
// MIDDLEWARE GENERAL
// =============================================================================

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Parsing de JSON y URL encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging de requests
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Middleware para agregar información de tiempo de request
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// =============================================================================
// RUTAS DE HEALTH CHECK
// =============================================================================

// Health check básico
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Health check de base de datos
app.get('/health/db', async (req, res) => {
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'gaet_db',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
    });

    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();

    res.json({
      status: 'OK',
      database: 'Connected',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      database: 'Disconnected',
      error: error.message
    });
  }
});

// =============================================================================
// RUTAS DE LA API
// =============================================================================

// Rutas de autenticación (sin autenticación requerida)
app.use('/api/auth', authRoutes);

// Rutas de administrador (requieren autenticación y permisos de admin)
app.use('/api/admin', adminRoutes);

// Rutas de supervisor (requieren autenticación y permisos de supervisor)
// app.use('/api/supervisor', supervisorRoutes);

// Rutas de técnico (requieren autenticación)
// app.use('/api/technician', technicianRoutes);

// Ruta protegida de prueba
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'Acceso autorizado',
    user: {
      rut: req.user.rut_persona,
      nombre: req.user.nombre_persona,
      perfil: req.user.descripcion_perfil_usuario
    }
  });
});

// =============================================================================
// MIDDLEWARE DE MANEJO DE ERRORES
// =============================================================================

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.originalUrl} no existe`,
    code: 'ENDPOINT_NOT_FOUND'
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('❌ Error no manejado:', error);

  // Errores de validación de JSON
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: 'JSON inválido',
      message: 'El cuerpo de la petición contiene JSON malformado',
      code: 'INVALID_JSON'
    });
  }

  // Errores de validación de esquema
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      message: error.message,
      code: 'VALIDATION_ERROR'
    });
  }

  // Errores de base de datos
  if (error.code && error.code.startsWith('23')) { // PostgreSQL constraint errors
    return res.status(409).json({
      error: 'Error de restricción en base de datos',
      message: 'Los datos enviados violan las restricciones de la base de datos',
      code: 'DATABASE_CONSTRAINT_ERROR'
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'production' 
      ? 'Algo salió mal. Intenta nuevamente más tarde.' 
      : error.message,
    code: 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// =============================================================================
// MIDDLEWARE DE LOGGING DE RESPONSE
// =============================================================================

// Middleware para loggear respuestas y tiempo de procesamiento
app.use((req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    const responseTime = Date.now() - req.startTime;
    
    // Log solo en desarrollo o si el tiempo de respuesta es alto
    if (process.env.NODE_ENV !== 'production' || responseTime > 1000) {
      console.log(`🕐 ${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`);
    }
    
    // Log de errores 4xx y 5xx
    if (res.statusCode >= 400) {
      console.log(`⚠️ Error Response: ${req.method} ${req.originalUrl} - ${res.statusCode}`);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
});

// =============================================================================
// INICIAR SERVIDOR
// =============================================================================

// Función para verificar conexión a base de datos al iniciar
async function checkDatabaseConnection() {
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'gaet_db',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
    });

    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    console.log('✅ Conexión a base de datos establecida');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a base de datos:', error.message);
    return false;
  }
}

// Función para graceful shutdown
function gracefulShutdown(signal) {
  console.log(`\n🛑 Recibida señal ${signal}. Cerrando servidor gracefully...`);
  
  server.close((err) => {
    if (err) {
      console.error('❌ Error cerrando servidor:', err);
      process.exit(1);
    }
    
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
  
  // Forzar cierre después de 10 segundos
  setTimeout(() => {
    console.error('❌ Forzando cierre del servidor');
    process.exit(1);
  }, 10000);
}

// Iniciar servidor
async function startServer() {
  try {
    // Verificar conexión a base de datos
    const dbConnected = await checkDatabaseConnection();
    
    if (!dbConnected && process.env.NODE_ENV === 'production') {
      console.error('❌ No se puede iniciar el servidor sin conexión a base de datos');
      process.exit(1);
    }

    // Iniciar servidor HTTP
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor GAET iniciado en puerto ${PORT}`);
      console.log(`📁 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔧 Documentación API: http://localhost:${PORT}/api/docs`);
      }
    });

    // Configurar timeout del servidor
    server.timeout = 30000; // 30 segundos

    // Configurar graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Exportar app para testing
module.exports = app;

// Iniciar servidor si no estamos en modo test
if (require.main === module) {
  startServer();
}