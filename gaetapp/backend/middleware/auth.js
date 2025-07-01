// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Configuración de PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gaet_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

/**
 * Middleware para verificar token JWT
 */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      message: 'Token de acceso requerido',
      code: 'TOKEN_REQUIRED'
    });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Obtener información actualizada del usuario desde la base de datos
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        p.rut_persona,
        p.rut_dv_persona,
        p.nombre_persona,
        p.apellido_paterno_persona,
        p.apellido_materno_persona,
        p.email_corporativo,
        p.email_personal,
        p.telefono,
        p.activo,
        p.fecha_ingreso,
        pu.id_perfil_usuario,
        pu.descripcion_perfil_usuario
      FROM persona p
      JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
      WHERE p.rut_persona = $1
    `, [decoded.rut_persona]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = result.rows[0];

    // Verificar si el usuario está activo
    if (!user.activo) {
      return res.status(401).json({ 
        message: 'Usuario desactivado',
        code: 'USER_INACTIVE'
      });
    }

    // Verificar si el token no ha expirado
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return res.status(401).json({ 
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    // Agregar información del usuario al objeto request
    req.user = user;
    req.token = decoded;
    
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(500).json({ 
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Middleware para verificar que el usuario sea administrador
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Usuario no autenticado',
      code: 'NOT_AUTHENTICATED'
    });
  }

  // CORREGIDO: Usar los nombres de perfil de tu BD
  if (req.user.descripcion_perfil_usuario !== 'ADMINISTRADOR') {
    return res.status(403).json({ 
      message: 'Acceso denegado. Se requiere perfil de administrador',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  }

  next();
};

/**
 * Middleware para verificar que el usuario sea supervisor o administrador
 */
const requireSupervisor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Usuario no autenticado',
      code: 'NOT_AUTHENTICATED'
    });
  }

  // CORREGIDO: Usar los nombres de perfil de tu BD
  const allowedRoles = ['ADMINISTRADOR', 'SUPERVISOR'];
  
  if (!allowedRoles.includes(req.user.descripcion_perfil_usuario)) {
    return res.status(403).json({ 
      message: 'Acceso denegado. Se requiere perfil de supervisor o administrador',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  }

  next();
};

/**
 * Middleware para verificar que el usuario sea técnico, supervisor o administrador
 */
const requireTechnician = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Usuario no autenticado',
      code: 'NOT_AUTHENTICATED'
    });
  }

  // CORREGIDO: Usar los nombres de perfil de tu BD
  const allowedRoles = ['ADMINISTRADOR', 'SUPERVISOR', 'TECNICO'];
  
  if (!allowedRoles.includes(req.user.descripcion_perfil_usuario)) {
    return res.status(403).json({ 
      message: 'Acceso denegado',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  }

  next();
};

/**
 * Generar token JWT
 */
const generateToken = (user, expiresIn = '24h') => {
  const payload = {
    rut_persona: user.rut_persona,
    email: user.email_corporativo || user.email_personal,
    perfil: user.descripcion_perfil_usuario,
    iat: Math.floor(Date.now() / 1000)
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verificar token sin middleware (para uso directo)
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireSupervisor,
  requireTechnician,
  generateToken,
  verifyToken
};