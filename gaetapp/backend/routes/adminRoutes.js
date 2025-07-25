// backend/routes/adminRoutes.js
const express = require('express');
const AdminService = require('../services/adminService');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Instancia del servicio
const adminService = new AdminService();

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'gaet_secret_key_2024', (err, user) => {
    if (err) {
      console.error('Error verificando token:', err);
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Middleware para verificar permisos de administrador
const requireAdmin = (req, res, next) => {
  if (req.user.perfil !== 'ADMINISTRADOR') {
    return res.status(403).json({ 
      error: 'Acceso denegado: Se requieren permisos de administrador' 
    });
  }
  next();
};

// 📊 GET /api/admin/stats - Estadísticas de usuarios
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('📊 Obteniendo estadísticas de usuarios...');
    
    const stats = await adminService.getUserStats();
    
    console.log('✅ Estadísticas obtenidas exitosamente');
    res.json(stats);
    
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// 📋 GET /api/admin/users - Listar todos los usuarios
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('📋 Obteniendo lista de usuarios...');
    
    const users = await adminService.getAllUsers();
    
    console.log(`✅ ${users.data.length} usuarios obtenidos exitosamente`);
    res.json(users);
    
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// 👤 GET /api/admin/users/:rut - Obtener usuario específico
router.get('/users/:rut', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { rut } = req.params;
    console.log(`👤 Obteniendo usuario con RUT: ${rut}`);
    
    const user = await adminService.getUserByRut(parseInt(rut));
    
    console.log('✅ Usuario obtenido exitosamente');
    res.json(user);
    
  } catch (error) {
    console.error('❌ Error obteniendo usuario:', error);
    
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// ➕ POST /api/admin/users - Crear nuevo usuario
router.post('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userData = req.body;
    console.log('➕ Creando nuevo usuario:', {
      rut: userData.rut_persona,
      nombre: userData.nombre_persona,
      perfil: userData.id_perfil_usuario
    });

    // Validaciones básicas
    if (!userData.rut_persona || !userData.rut_dv_persona) {
      return res.status(400).json({ error: 'RUT y DV son requeridos' });
    }

    if (!userData.nombre_persona || !userData.apellido_paterno_persona) {
      return res.status(400).json({ error: 'Nombre y apellido paterno son requeridos' });
    }

    if (!userData.email_corporativo) {
      return res.status(400).json({ error: 'Email corporativo es requerido' });
    }

    if (!userData.id_perfil_usuario) {
      return res.status(400).json({ error: 'Perfil de usuario es requerido' });
    }

    const newUser = await adminService.createUser(userData);
    
    console.log('✅ Usuario creado exitosamente:', newUser.data.rut_persona);
    res.status(201).json(newUser);
    
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    
    if (error.message.includes('Ya existe')) {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// ✏️ PUT /api/admin/users/:rut - Actualizar usuario
router.put('/users/:rut', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { rut } = req.params;
    const userData = req.body;
    
    console.log(`✏️ Actualizando usuario RUT: ${rut}`);
    
    const updatedUser = await adminService.updateUser(parseInt(rut), userData);
    
    console.log('✅ Usuario actualizado exitosamente');
    res.json(updatedUser);
    
  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
    
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    
    if (error.message.includes('Ya existe')) {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// 🔐 PUT /api/admin/users/:rut/password - Establecer contraseña
router.put('/users/:rut/password', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { rut } = req.params;
    const { password, requireChange = true } = req.body;
    
    console.log(`🔐 Estableciendo contraseña para usuario RUT: ${rut}`);
    
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }
    
    const result = await adminService.setUserPassword(
      parseInt(rut), 
      password, 
      requireChange
    );
    
    console.log('✅ Contraseña establecida exitosamente');
    res.json(result);
    
  } catch (error) {
    console.error('❌ Error estableciendo contraseña:', error);
    
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// 🎲 POST /api/admin/users/:rut/generate-password - Generar contraseña temporal
router.post('/users/:rut/generate-password', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { rut } = req.params;
    
    console.log(`🎲 Generando contraseña temporal para usuario RUT: ${rut}`);
    
    const result = await adminService.generateTemporaryPassword(parseInt(rut));
    
    console.log('✅ Contraseña temporal generada exitosamente');
    res.json(result);
    
  } catch (error) {
    console.error('❌ Error generando contraseña temporal:', error);
    
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// 🗑️ PUT /api/admin/users/:rut/deactivate - Desactivar usuario
router.put('/users/:rut/deactivate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { rut } = req.params;
    
    console.log(`🗑️ Desactivando usuario RUT: ${rut}`);
    
    const result = await adminService.deactivateUser(parseInt(rut));
    
    console.log('✅ Usuario desactivado exitosamente');
    res.json(result);
    
  } catch (error) {
    console.error('❌ Error desactivando usuario:', error);
    
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// ✅ PUT /api/admin/users/:rut/activate - Activar usuario
router.put('/users/:rut/activate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { rut } = req.params;
    
    console.log(`✅ Activando usuario RUT: ${rut}`);
    
    const result = await adminService.activateUser(parseInt(rut));
    
    console.log('✅ Usuario activado exitosamente');
    res.json(result);
    
  } catch (error) {
    console.error('❌ Error activando usuario:', error);
    
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// 📝 GET /api/admin/profiles - Obtener perfiles disponibles
router.get('/profiles', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('📝 Obteniendo perfiles de usuario...');
    
    const client = await adminService.pool.connect();
    const result = await client.query(
      'SELECT * FROM perfil_usuario ORDER BY id_perfil_usuario'
    );
    client.release();
    
    console.log('✅ Perfiles obtenidos exitosamente');
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo perfiles:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// Manejo de errores global para el router
router.use((error, req, res, next) => {
  console.error('❌ Error no manejado en adminRoutes:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: 'Ha ocurrido un error inesperado'
  });
});

module.exports = router;