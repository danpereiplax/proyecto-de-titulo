// backend/routes/authRoutes.js - Actualizado para username
const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configuración de PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'gaet',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'db_gaet',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// POST /api/auth/login - Login con username
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔐 Intento de login:', { username });

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username y contraseña son requeridos' 
      });
    }

    // Buscar usuario por username
    const userQuery = `
      SELECT 
        p.rut_persona,
        p.rut_dv_persona,
        p.nombre_persona,
        p.apellido_paterno_persona,
        p.apellido_materno_persona,
        p.email_corporativo,
        p.email_personal,
        p.telefono,
        p.username,
        p.password_hash,
        p.activo,
        p.ultimo_acceso,
        pu.id_perfil_usuario,
        pu.descripcion_perfil_usuario
      FROM persona p
      JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
      WHERE p.username = $1 AND p.activo = true
    `;

    const userResult = await pool.query(userQuery, [username.toLowerCase()]);

    if (userResult.rows.length === 0) {
      console.log('❌ Usuario no encontrado:', username);
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    const user = userResult.rows[0];

    // Verificar contraseña
    let passwordValid = false;
    
    if (user.password_hash) {
      // Si tiene password hasheado, verificar con bcrypt
      passwordValid = await bcrypt.compare(password, user.password_hash);
    } else {
      // Si no tiene password (primer login), aceptar cualquier contraseña
      // y generar hash para futuras verificaciones
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      await pool.query(
        'UPDATE persona SET password_hash = $1 WHERE rut_persona = $2',
        [hashedPassword, user.rut_persona]
      );
      
      passwordValid = true;
      console.log('🔑 Password inicial configurado para:', username);
    }

    if (!passwordValid) {
      console.log('❌ Contraseña incorrecta para:', username);
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // Actualizar último acceso
    await pool.query(
      'UPDATE persona SET ultimo_acceso = CURRENT_TIMESTAMP WHERE rut_persona = $1',
      [user.rut_persona]
    );

    // Generar token JWT
    const token = generateToken({
      rut_persona: user.rut_persona,
      username: user.username,
      nombre: user.nombre_persona,
      apellido: user.apellido_paterno_persona,
      email: user.email_corporativo,
      perfil: user.descripcion_perfil_usuario,
      id_perfil: user.id_perfil_usuario
    });

    console.log('✅ Login exitoso:', { username, perfil: user.descripcion_perfil_usuario });

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        rut: `${user.rut_persona}-${user.rut_dv_persona}`,
        username: user.username,
        nombre: user.nombre_persona,
        apellido: user.apellido_paterno_persona,
        email: user.email_corporativo,
        perfil: user.descripcion_perfil_usuario,
        ultimo_acceso: user.ultimo_acceso
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// POST /api/auth/change-password - Cambiar contraseña
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.rut_persona;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Contraseña actual y nueva son requeridas' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'La nueva contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verificar contraseña actual
    const userQuery = 'SELECT password_hash FROM persona WHERE rut_persona = $1';
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = userResult.rows[0];
    const currentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!currentPasswordValid) {
      return res.status(401).json({ message: 'Contraseña actual incorrecta' });
    }

    // Generar nueva contraseña hasheada
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar en base de datos
    await pool.query(
      'UPDATE persona SET password_hash = $1 WHERE rut_persona = $2',
      [hashedNewPassword, userId]
    );

    console.log('✅ Contraseña cambiada exitosamente para usuario:', userId);
    
    res.json({ 
      success: true, 
      message: 'Contraseña actualizada exitosamente' 
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/auth/profile - Obtener perfil del usuario
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.rut_persona;

    const userQuery = `
      SELECT 
        p.rut_persona,
        p.rut_dv_persona,
        p.nombre_persona,
        p.apellido_paterno_persona,
        p.apellido_materno_persona,
        p.email_corporativo,
        p.email_personal,
        p.telefono,
        p.username,
        p.activo,
        p.ultimo_acceso,
        pu.descripcion_perfil_usuario
      FROM persona p
      JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
      WHERE p.rut_persona = $1
    `;

    const result = await pool.query(userQuery, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      user: {
        rut: `${user.rut_persona}-${user.rut_dv_persona}`,
        username: user.username,
        nombre: user.nombre_persona,
        apellido: user.apellido_paterno_persona,
        email_corporativo: user.email_corporativo,
        email_personal: user.email_personal,
        telefono: user.telefono,
        perfil: user.descripcion_perfil_usuario,
        ultimo_acceso: user.ultimo_acceso
      }
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, (req, res) => {
  // En JWT stateless, el logout se maneja en el frontend eliminando el token
  res.json({ 
    success: true, 
    message: 'Logout exitoso' 
  });
});

// GET /api/auth/permissions - Verificar permisos
router.get('/permissions', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
    permissions: {
      canManageUsers: req.user.perfil === 'ADMINISTRADOR' || req.user.perfil === 'RRHH',
      canManageTasks: req.user.perfil === 'SUPERVISOR',
      canExecuteTasks: req.user.perfil === 'TECNICO',
      canViewReports: ['ADMINISTRADOR', 'SUPERVISOR', 'RRHH'].includes(req.user.perfil)
    }
  });
});

module.exports = router;