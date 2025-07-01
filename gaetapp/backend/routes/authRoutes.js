// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const { generateToken, authenticateToken, verifyToken } = require('../middleware/auth');

const router = express.Router();

// Configuración de PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gaet_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

/**
 * POST /api/auth/login - Iniciar sesión
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validación básica
  if (!email || !password) {
    return res.status(400).json({
      message: 'Email y contraseña son requeridos',
      code: 'MISSING_CREDENTIALS'
    });
  }

  try {
    const client = await pool.connect();

    // Buscar usuario por email (corporativo o personal) - CORREGIDO
    const userResult = await client.query(`
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
        p.password_hash,
        pu.id_perfil_usuario,
        pu.descripcion_perfil_usuario
      FROM persona p
      JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
      WHERE (p.email_corporativo = $1 OR p.email_personal = $1)
    `, [email]);

    if (userResult.rows.length === 0) {
      client.release();
      return res.status(401).json({
        message: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const user = userResult.rows[0];

    // Verificar si el usuario está activo
    if (!user.activo) {
      client.release();
      return res.status(401).json({
        message: 'Usuario desactivado. Contacta al administrador',
        code: 'USER_INACTIVE'
      });
    }

    // Verificar contraseña
    let isValidPassword = false;

    if (!user.password_hash) {
      // Primera vez - crear hash de la contraseña
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      await client.query(
        'UPDATE persona SET password_hash = $1 WHERE rut_persona = $2',
        [hashedPassword, user.rut_persona]
      );
      
      isValidPassword = true;
    } else {
      // Verificar contraseña existente
      isValidPassword = await bcrypt.compare(password, user.password_hash);
    }

    if (!isValidPassword) {
      client.release();
      return res.status(401).json({
        message: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Actualizar último acceso
    await client.query(
      'UPDATE persona SET ultimo_acceso = NOW() WHERE rut_persona = $1',
      [user.rut_persona]
    );

    client.release();

    // Generar token JWT
    const token = generateToken(user, '24h');

    // Remover información sensible antes de enviar
    const userResponse = {
      rut_persona: user.rut_persona,
      rut_dv_persona: user.rut_dv_persona,
      nombre_persona: user.nombre_persona,
      apellido_paterno_persona: user.apellido_paterno_persona,
      apellido_materno_persona: user.apellido_materno_persona,
      email_corporativo: user.email_corporativo,
      email_personal: user.email_personal, // CORREGIDO
      telefono: user.telefono,
      fecha_ingreso: user.fecha_ingreso,
      id_perfil_usuario: user.id_perfil_usuario,
      descripcion_perfil_usuario: user.descripcion_perfil_usuario
    };

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /api/auth/refresh - Renovar token
 */
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    // Generar nuevo token
    const newToken = generateToken(req.user, '24h');

    res.json({
      message: 'Token renovado exitosamente',
      token: newToken
    });
  } catch (error) {
    console.error('Error renovando token:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/auth/verify - Verificar token
 */
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    // El middleware ya verificó el token y cargó el usuario
    const userResponse = {
      rut_persona: req.user.rut_persona,
      rut_dv_persona: req.user.rut_dv_persona,
      nombre_persona: req.user.nombre_persona,
      apellido_paterno_persona: req.user.apellido_paterno_persona,
      apellido_materno_persona: req.user.apellido_materno_persona,
      email_corporativo: req.user.email_corporativo,
      email_personal: req.user.email_personal, // CORREGIDO
      telefono: req.user.telefono,
      fecha_ingreso: req.user.fecha_ingreso,
      id_perfil_usuario: req.user.id_perfil_usuario,
      descripcion_perfil_usuario: req.user.descripcion_perfil_usuario
    };

    res.json({
      message: 'Token válido',
      user: userResponse
    });
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /api/auth/logout - Cerrar sesión
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    res.json({
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * PUT /api/auth/profile - Actualizar perfil de usuario
 */
router.put('/profile', authenticateToken, async (req, res) => {
  const {
    nombre_persona,
    apellido_paterno_persona,
    apellido_materno_persona,
    email_personal, // CORREGIDO
    telefono
  } = req.body;

  try {
    const client = await pool.connect();

    // Actualizar perfil del usuario
    const result = await client.query(`
      UPDATE persona SET
        nombre_persona = COALESCE($1, nombre_persona),
        apellido_paterno_persona = COALESCE($2, apellido_paterno_persona),
        apellido_materno_persona = COALESCE($3, apellido_materno_persona),
        email_personal = COALESCE($4, email_personal),
        telefono = COALESCE($5, telefono)
      WHERE rut_persona = $6
      RETURNING 
        rut_persona, rut_dv_persona, nombre_persona, apellido_paterno_persona,
        apellido_materno_persona, email_corporativo, email_personal, telefono,
        fecha_ingreso
    `, [
      nombre_persona, apellido_paterno_persona, apellido_materno_persona,
      email_personal, telefono, req.user.rut_persona // CORREGIDO
    ]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * PUT /api/auth/change-password - Cambiar contraseña
 */
router.put('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validaciones
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: 'Todos los campos son requeridos',
      code: 'MISSING_FIELDS'
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: 'Las contraseñas no coinciden',
      code: 'PASSWORD_MISMATCH'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: 'La contraseña debe tener al menos 6 caracteres',
      code: 'PASSWORD_TOO_SHORT'
    });
  }

  try {
    const client = await pool.connect();

    // Obtener hash actual
    const userResult = await client.query(
      'SELECT password_hash FROM persona WHERE rut_persona = $1',
      [req.user.rut_persona]
    );

    if (userResult.rows.length === 0) {
      client.release();
      return res.status(404).json({
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = userResult.rows[0];

    // Verificar contraseña actual
    if (user.password_hash) {
      const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.password_hash);
      
      if (!isValidCurrentPassword) {
        client.release();
        return res.status(401).json({
          message: 'Contraseña actual incorrecta',
          code: 'INVALID_CURRENT_PASSWORD'
        });
      }
    }

    // Generar hash de la nueva contraseña
    const saltRounds = 12;
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await client.query(
      'UPDATE persona SET password_hash = $1 WHERE rut_persona = $2',
      [newHashedPassword, req.user.rut_persona]
    );

    client.release();

    res.json({
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/auth/permissions - Obtener permisos del usuario
 */
router.get('/permissions', authenticateToken, async (req, res) => {
  try {
    // Definir permisos basados en el perfil del usuario
    const rolePermissions = {
      'ADMINISTRADOR': [
        'admin.*',
        'users.*',
        'tasks.*',
        'clients.*',
        'reports.*',
        'config.*'
      ],
      'SUPERVISOR': [
        'tasks.view',
        'tasks.create',
        'tasks.edit',
        'tasks.assign',
        'reports.view',
        'clients.view',
        'clients.create',
        'clients.edit',
        'users.view'
      ],
      'TECNICO': [
        'tasks.view_assigned',
        'tasks.update_status',
        'tasks.upload_evidence',
        'tasks.complete',
        'profile.edit'
      ],
      'RRHH': [
        'users.view',
        'users.create',
        'users.edit',
        'reports.hr'
      ]
    };

    const userPermissions = rolePermissions[req.user.descripcion_perfil_usuario] || [];

    res.json({
      permissions: userPermissions,
      role: req.user.descripcion_perfil_usuario
    });

  } catch (error) {
    console.error('Error obteniendo permisos:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /api/auth/forgot-password - Solicitar restablecimiento de contraseña
 */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: 'Email es requerido',
      code: 'MISSING_EMAIL'
    });
  }

  try {
    const client = await pool.connect();

    // Verificar si el usuario existe
    const userResult = await client.query(`
      SELECT rut_persona, nombre_persona, apellido_paterno_persona
      FROM persona 
      WHERE (email_corporativo = $1 OR email_personal = $1) AND activo = true
    `, [email]);

    client.release();

    // Por seguridad, siempre retornamos el mismo mensaje
    res.json({
      message: 'Si el email existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña'
    });

    // Si el usuario existe, aquí se podría enviar un email
    if (userResult.rows.length > 0) {
      console.log('Email de restablecimiento enviado a:', email);
    }

  } catch (error) {
    console.error('Error en forgot password:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;