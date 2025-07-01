// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Configuración de PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gaet_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Middleware para todas las rutas de admin
router.use(authenticateToken);
router.use(requireAdmin);

// =============================================================================
// DASHBOARD STATS
// =============================================================================

// GET /api/admin/stats - Obtener estadísticas del dashboard
router.get('/stats', async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Obtener estadísticas en paralelo
    const [
      totalUsuarios,
      tareasActivas,
      totalClientes,
      tecnicosActivos
    ] = await Promise.all([
      client.query('SELECT COUNT(*) as count FROM persona WHERE activo = true'),
      client.query(`
        SELECT COUNT(*) as count 
        FROM tarea t 
        JOIN estado_tarea et ON t.id_estado_tarea = et.id_estado_tarea 
        WHERE et.descripcion_estado_tarea IN ('ENEJECUCION', 'ASIGNADA')
      `),
      client.query('SELECT COUNT(*) as count FROM cliente'),
      client.query(`
        SELECT COUNT(*) as count 
        FROM persona p 
        JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario 
        WHERE pu.descripcion_perfil_usuario = 'TECNICO' AND p.activo = true
      `)
    ]);

    client.release();

    const stats = {
      totalUsuarios: parseInt(totalUsuarios.rows[0].count),
      tareasActivas: parseInt(tareasActivas.rows[0].count),
      totalClientes: parseInt(totalClientes.rows[0].count),
      tecnicosActivos: parseInt(tecnicosActivos.rows[0].count)
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/admin/activity - Obtener actividad reciente
router.get('/activity', async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Obtener actividad reciente (últimas 10 acciones)
    const result = await client.query(`
      SELECT 
        'user' as type,
        'Usuario ' || p.nombre_persona || ' ' || p.apellido_paterno_persona || ' creado' as description,
        p.fecha_ingreso as fecha_creacion
      FROM persona p
      WHERE p.fecha_ingreso >= NOW() - INTERVAL '30 days'
      
      UNION ALL
      
      SELECT 
        'task' as type,
        'Nueva tarea asignada a ' || p.nombre_persona || ' ' || p.apellido_paterno_persona as description,
        t.fecha_inicio_tarea as fecha_creacion
      FROM tarea t
      JOIN persona p ON t.rut_persona = p.rut_persona
      WHERE t.fecha_inicio_tarea >= NOW() - INTERVAL '30 days'
      
      ORDER BY fecha_creacion DESC
      LIMIT 10
    `);

    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// =============================================================================
// USER MANAGEMENT
// =============================================================================

// GET /api/admin/users - Obtener todos los usuarios
router.get('/users', async (req, res) => {
  try {
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        p.rut_persona,
        p.rut_dv_persona,
        p.nombre_persona,
        p.apellido_paterno_persona,
        p.apellido_materno_persona,
        p.fecha_ingreso,
        p.email_personal,
        p.email_corporativo,
        p.telefono,
        p.activo,
        pu.descripcion_perfil_usuario,
        p.id_perfil_usuario
      FROM persona p
      JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
      ORDER BY p.fecha_ingreso DESC
    `);

    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/admin/perfiles - Obtener perfiles de usuario
router.get('/perfiles', async (req, res) => {
  try {
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT id_perfil_usuario, descripcion_perfil_usuario 
      FROM perfil_usuario 
      ORDER BY descripcion_perfil_usuario
    `);

    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching perfiles:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /api/admin/users - Crear nuevo usuario
router.post('/users', async (req, res) => {
  const {
    rut_persona,
    rut_dv_persona,
    nombre_persona,
    apellido_paterno_persona,
    apellido_materno_persona,
    email_corporativo,
    email_personal,
    telefono,
    id_perfil_usuario
  } = req.body;

  // Validaciones básicas
  if (!rut_persona || !rut_dv_persona || !nombre_persona || !apellido_paterno_persona || !email_corporativo || !id_perfil_usuario) {
    return res.status(400).json({ 
      message: 'Todos los campos obligatorios deben ser completados' 
    });
  }

  try {
    const client = await pool.connect();
    
    // Verificar si el RUT ya existe
    const existingUser = await client.query(
      'SELECT rut_persona FROM persona WHERE rut_persona = $1',
      [rut_persona]
    );

    if (existingUser.rows.length > 0) {
      client.release();
      return res.status(409).json({ message: 'Ya existe un usuario con este RUT' });
    }

    // Verificar si el email corporativo ya existe
    const existingEmail = await client.query(
      'SELECT rut_persona FROM persona WHERE email_corporativo = $1',
      [email_corporativo]
    );

    if (existingEmail.rows.length > 0) {
      client.release();
      return res.status(409).json({ message: 'Ya existe un usuario con este email corporativo' });
    }

    // Insertar nuevo usuario
    const result = await client.query(`
      INSERT INTO persona (
        rut_persona, rut_dv_persona, nombre_persona, apellido_paterno_persona,
        apellido_materno_persona, fecha_ingreso, email_personal, email_corporativo,
        telefono, id_perfil_usuario, activo
      ) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, $6, $7, $8, $9, true)
      RETURNING *
    `, [
      rut_persona, rut_dv_persona, nombre_persona, apellido_paterno_persona,
      apellido_materno_persona, email_personal, email_corporativo, telefono, id_perfil_usuario
    ]);

    // Obtener los datos completos del usuario creado incluyendo el perfil
    const userWithProfile = await client.query(`
      SELECT 
        p.*,
        pu.descripcion_perfil_usuario
      FROM persona p
      JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
      WHERE p.rut_persona = $1
    `, [rut_persona]);

    client.release();

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: userWithProfile.rows[0]
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT /api/admin/users/:rut - Actualizar usuario
router.put('/users/:rut', async (req, res) => {
  const { rut } = req.params;
  const {
    nombre_persona,
    apellido_paterno_persona,
    apellido_materno_persona,
    email_corporativo,
    email_personal,
    telefono,
    id_perfil_usuario
  } = req.body;

  try {
    const client = await pool.connect();
    
    // Verificar si el usuario existe
    const existingUser = await client.query(
      'SELECT rut_persona FROM persona WHERE rut_persona = $1',
      [rut]
    );

    if (existingUser.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el email corporativo ya existe en otro usuario
    if (email_corporativo) {
      const existingEmail = await client.query(
        'SELECT rut_persona FROM persona WHERE email_corporativo = $1 AND rut_persona != $2',
        [email_corporativo, rut]
      );

      if (existingEmail.rows.length > 0) {
        client.release();
        return res.status(409).json({ message: 'Ya existe otro usuario con este email corporativo' });
      }
    }

    // Actualizar usuario
    const result = await client.query(`
      UPDATE persona SET
        nombre_persona = $1,
        apellido_paterno_persona = $2,
        apellido_materno_persona = $3,
        email_corporativo = $4,
        email_personal = $5,
        telefono = $6,
        id_perfil_usuario = $7
      WHERE rut_persona = $8
      RETURNING *
    `, [
      nombre_persona, apellido_paterno_persona, apellido_materno_persona,
      email_corporativo, email_personal, telefono, id_perfil_usuario, rut
    ]);

    // Obtener los datos completos del usuario actualizado
    const userWithProfile = await client.query(`
      SELECT 
        p.*,
        pu.descripcion_perfil_usuario
      FROM persona p
      JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
      WHERE p.rut_persona = $1
    `, [rut]);

    client.release();

    res.json({
      message: 'Usuario actualizado exitosamente',
      user: userWithProfile.rows[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PATCH /api/admin/users/:rut/status - Cambiar estado del usuario
router.patch('/users/:rut/status', async (req, res) => {
  const { rut } = req.params;
  const { activo } = req.body;

  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'UPDATE persona SET activo = $1 WHERE rut_persona = $2 RETURNING *',
      [activo, rut]
    );

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    client.release();

    res.json({
      message: `Usuario ${activo ? 'activado' : 'desactivado'} exitosamente`,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// =============================================================================
// CONFIGURATION MANAGEMENT
// =============================================================================

// Tipos de Tarea
router.get('/tipos-tarea', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM tipo_tarea ORDER BY descripcion_tipo_tarea');
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tipos tarea:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/tipos-tarea', async (req, res) => {
  const { descripcion_tipo_tarea } = req.body;

  if (!descripcion_tipo_tarea) {
    return res.status(400).json({ message: 'La descripción es requerida' });
  }

  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'INSERT INTO tipo_tarea (descripcion_tipo_tarea) VALUES ($1) RETURNING *',
      [descripcion_tipo_tarea]
    );

    client.release();
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating tipo tarea:', error);
    if (error.code === '23505') { // Unique violation
      res.status(409).json({ message: 'Ya existe un tipo de tarea con esta descripción' });
    } else {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

router.delete('/tipos-tarea/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'DELETE FROM tipo_tarea WHERE id_tipo_tarea = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: 'Tipo de tarea no encontrado' });
    }

    client.release();
    res.json({ message: 'Tipo de tarea eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting tipo tarea:', error);
    if (error.code === '23503') { // Foreign key violation
      res.status(409).json({ message: 'No se puede eliminar: hay tareas asociadas a este tipo' });
    } else {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

// Estados de Tarea
router.get('/estados-tarea', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM estado_tarea ORDER BY descripcion_estado_tarea');
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching estados tarea:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/estados-tarea', async (req, res) => {
  const { descripcion_estado_tarea } = req.body;

  if (!descripcion_estado_tarea) {
    return res.status(400).json({ message: 'La descripción es requerida' });
  }

  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'INSERT INTO estado_tarea (descripcion_estado_tarea) VALUES ($1) RETURNING *',
      [descripcion_estado_tarea]
    );

    client.release();
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating estado tarea:', error);
    if (error.code === '23505') {
      res.status(409).json({ message: 'Ya existe un estado con esta descripción' });
    } else {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

router.delete('/estados-tarea/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'DELETE FROM estado_tarea WHERE id_estado_tarea = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: 'Estado de tarea no encontrado' });
    }

    client.release();
    res.json({ message: 'Estado de tarea eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting estado tarea:', error);
    if (error.code === '23503') {
      res.status(409).json({ message: 'No se puede eliminar: hay tareas asociadas a este estado' });
    } else {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

// Áreas de Cobro
router.get('/areas-cobro', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM area_cobro ORDER BY descripcion_area_cobro');
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching areas cobro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/areas-cobro', async (req, res) => {
  const { descripcion_area_cobro } = req.body;

  if (!descripcion_area_cobro) {
    return res.status(400).json({ message: 'La descripción es requerida' });
  }

  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'INSERT INTO area_cobro (descripcion_area_cobro) VALUES ($1) RETURNING *',
      [descripcion_area_cobro]
    );

    client.release();
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating area cobro:', error);
    if (error.code === '23505') {
      res.status(409).json({ message: 'Ya existe un área con esta descripción' });
    } else {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

router.delete('/areas-cobro/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'DELETE FROM area_cobro WHERE id_area_cobro = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: 'Área de cobro no encontrada' });
    }

    client.release();
    res.json({ message: 'Área de cobro eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting area cobro:', error);
    if (error.code === '23503') {
      res.status(409).json({ message: 'No se puede eliminar: hay tareas asociadas a esta área' });
    } else {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

// =============================================================================
// CLIENT MANAGEMENT
// =============================================================================

// GET /api/admin/clients - Obtener clientes
router.get('/clients', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        c.rut_cliente,
        c.rut_dv_cliente,
        c.descripcion_cliente,
        COUNT(l.id_local) as total_locales
      FROM cliente c
      LEFT JOIN local l ON c.rut_cliente = l.rut_cliente
      GROUP BY c.rut_cliente, c.rut_dv_cliente, c.descripcion_cliente
      ORDER BY c.descripcion_cliente
    `);
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;