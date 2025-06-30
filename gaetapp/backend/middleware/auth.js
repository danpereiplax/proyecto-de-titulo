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
        p.email_pesonal,
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

  if (req.user.descripcion_perfil_usuario !== 'Administrador') {
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

  const allowedRoles = ['Administrador', 'Supervisor'];
  
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

  const allowedRoles = ['Administrador', 'Supervisor', 'Técnico'];
  
  if (!allowedRoles.includes(req.user.descripcion_perfil_usuario)) {
    return res.status(403).json({ 
      message: 'Acceso denegado',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  }

  next();
};

/**
 * Middleware para verificar permisos específicos
 */
const requirePermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Usuario no autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Los administradores tienen todos los permisos
    if (req.user.descripcion_perfil_usuario === 'Administrador') {
      return next();
    }

    try {
      // Verificar permisos específicos del usuario
      const client = await pool.connect();
      
      // Aquí puedes implementar una tabla de permisos más granular
      // Por ahora usamos una lógica simple basada en roles
      const hasPermission = await checkUserPermission(client, req.user.rut_persona, permission);
      
      client.release();

      if (!hasPermission) {
        return res.status(403).json({ 
          message: `Acceso denegado. Se requiere el permiso: ${permission}`,
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      next();
    } catch (error) {
      console.error('Error verificando permisos:', error);
      return res.status(500).json({ 
        message: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  };
};

/**
 * Función auxiliar para verificar permisos específicos
 */
const checkUserPermission = async (client, rutPersona, permission) => {
  // Implementar lógica de permisos granulares
  // Por ahora, definimos permisos básicos por rol
  
  const userResult = await client.query(`
    SELECT pu.descripcion_perfil_usuario
    FROM persona p
    JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
    WHERE p.rut_persona = $1
  `, [rutPersona]);

  if (userResult.rows.length === 0) {
    return false;
  }

  const userRole = userResult.rows[0].descripcion_perfil_usuario;

  // Definir permisos por rol
  const rolePermissions = {
    'Administrador': ['*'], // Todos los permisos
    'Supervisor': [
      'view_tasks',
      'create_tasks',
      'edit_tasks',
      'assign_tasks',
      'view_reports',
      'manage_clients',
      'view_users'
    ],
    'Técnico': [
      'view_assigned_tasks',
      'update_task_status',
      'upload_evidence',
      'complete_tasks'
    ]
  };

  const userPermissions = rolePermissions[userRole] || [];
  
  // Los administradores tienen todos los permisos
  if (userPermissions.includes('*')) {
    return true;
  }

  // Verificar permiso específico
  return userPermissions.includes(permission);
};

/**
 * Middleware para verificar si el usuario puede acceder a un recurso específico
 */
const requireOwnershipOrSupervisor = (resourceType) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Usuario no autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Administradores y supervisores pueden acceder a todo
    if (['Administrador', 'Supervisor'].includes(req.user.descripcion_perfil_usuario)) {
      return next();
    }

    try {
      const client = await pool.connect();
      let hasAccess = false;

      switch (resourceType) {
        case 'task':
          // Verificar si la tarea pertenece al usuario
          const taskId = req.params.id || req.params.taskId;
          const taskResult = await client.query(
            'SELECT rut_persona FROM tarea WHERE id_tarea = $1',
            [taskId]
          );
          
          if (taskResult.rows.length > 0) {
            hasAccess = taskResult.rows[0].rut_persona === req.user.rut_persona;
          }
          break;

        case 'profile':
          // Verificar si el perfil pertenece al usuario
          const rutPersona = req.params.rut || req.params.rutPersona;
          hasAccess = rutPersona === req.user.rut_persona.toString();
          break;

        default:
          hasAccess = false;
      }

      client.release();

      if (!hasAccess) {
        return res.status(403).json({ 
          message: 'Acceso denegado. No tienes permisos para acceder a este recurso',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      next();
    } catch (error) {
      console.error('Error verificando propiedad del recurso:', error);
      return res.status(500).json({ 
        message: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  };
};

/**
 * Middleware para logging de actividad
 */
const logActivity = (action) => {
  return (req, res, next) => {
    // Guardar información de la actividad para auditoría
    const activity = {
      user: req.user ? req.user.rut_persona : null,
      action: action,
      resource: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };

    // Log de la actividad (en producción se debería guardar en base de datos)
    console.log('🔍 Activity Log:', activity);

    // Agregar al request para uso posterior si es necesario
    req.activity = activity;

    next();
  };
};

/**
 * Generar token JWT
 */
const generateToken = (user, expiresIn = '24h') => {
  const payload = {
    rut_persona: user.rut_persona,
    email: user.email_corporativo || user.email_pesonal,
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
  requirePermission,
  requireOwnershipOrSupervisor,
  logActivity,
  generateToken,
  verifyToken,
  checkUserPermission
};