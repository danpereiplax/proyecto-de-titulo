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
        WHERE et.descripcion_estado_tarea IN ('Pendiente', 'En Progreso')
      `),
      client.query('SELECT COUNT(*) as count FROM cliente'),
      client.query(`
        SELECT COUNT(*) as count 
        FROM persona p 
        JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario 
        WHERE pu.descripcion_perfil_usuario = 'Técnico' AND p.activo = true
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
        p.email_pesonal,
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
    email_pesonal,
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
        apellido_materno_persona, fecha_ingreso, email_pesonal, email_corporativo,
        telefono, id_perfil_usuario, activo
      ) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, $6, $7, $8, $9, true)
      RETURNING *
    `, [
      rut_persona, rut_dv_persona, nombre_persona, apellido_paterno_persona,
      apellido_materno_persona, email_pesonal, email_corporativo, telefono, id_perfil_usuario
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
    email_pesonal,
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
        email_pesonal = $5,
        telefono = $6,
        id_perfil_usuario = $7
      WHERE rut_persona = $8
      RETURNING *
    `, [
      nombre_persona, apellido_paterno_persona, apellido_materno_persona,
      email_corporativo, email_pesonal, telefono, id_perfil_usuario, rut
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

// DELETE /api/admin/users/:rut - Eliminar usuario (desactivar)
router.delete('/users/:rut', async (req, res) => {
  const { rut } = req.params;

  try {
    const client = await pool.connect();
    
    // En lugar de eliminar, desactivamos el usuario
    const result = await client.query(
      'UPDATE persona SET activo = false WHERE rut_persona = $1 RETURNING *',
      [rut]
    );

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    client.release();

    res.json({
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
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

// POST /api/admin/clients - Crear cliente
router.post('/clients', async (req, res) => {
  const { rut_cliente, rut_dv_cliente, descripcion_cliente } = req.body;

  if (!rut_cliente || !rut_dv_cliente || !descripcion_cliente) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    const client = await pool.connect();
    
    // Verificar si el RUT ya existe
    const existingClient = await client.query(
      'SELECT rut_cliente FROM cliente WHERE rut_cliente = $1',
      [rut_cliente]
    );

    if (existingClient.rows.length > 0) {
      client.release();
      return res.status(409).json({ message: 'Ya existe un cliente con este RUT' });
    }

    const result = await client.query(
      'INSERT INTO cliente (rut_cliente, rut_dv_cliente, descripcion_cliente) VALUES ($1, $2, $3) RETURNING *',
      [rut_cliente, rut_dv_cliente, descripcion_cliente]
    );

    client.release();
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT /api/admin/clients/:rut - Actualizar cliente
router.put('/clients/:rut', async (req, res) => {
  const { rut } = req.params;
  const { descripcion_cliente } = req.body;

  if (!descripcion_cliente) {
    return res.status(400).json({ message: 'La descripción del cliente es requerida' });
  }

  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'UPDATE cliente SET descripcion_cliente = $1 WHERE rut_cliente = $2 RETURNING *',
      [descripcion_cliente, rut]
    );

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    client.release();
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// DELETE /api/admin/clients/:rut - Eliminar cliente
router.delete('/clients/:rut', async (req, res) => {
  const { rut } = req.params;

  try {
    const client = await pool.connect();
    
    const result = await client.query(
      'DELETE FROM cliente WHERE rut_cliente = $1 RETURNING *',
      [rut]
    );

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    client.release();
    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting client:', error);
    if (error.code === '23503') {
      res.status(409).json({ message: 'No se puede eliminar: hay locales o tareas asociadas a este cliente' });
    } else {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

// =============================================================================
// REPORTS
// =============================================================================

// POST /api/admin/reports/:type - Generar reportes
router.post('/reports/:type', async (req, res) => {
  const { type } = req.params;
  const filters = req.body;

  try {
    const client = await pool.connect();
    let query = '';
    let params = [];

    switch (type) {
      case 'users':
        query = `
          SELECT 
            p.rut_persona || '-' || p.rut_dv_persona as rut,
            p.nombre_persona || ' ' || p.apellido_paterno_persona as nombre_completo,
            p.email_corporativo,
            pu.descripcion_perfil_usuario as perfil,
            CASE WHEN p.activo THEN 'Activo' ELSE 'Inactivo' END as estado,
            p.fecha_ingreso
          FROM persona p
          JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
          ORDER BY p.fecha_ingreso DESC
        `;
        break;

      case 'tasks-by-technician':
        query = `
          SELECT 
            p.nombre_persona || ' ' || p.apellido_paterno_persona as tecnico,
            COUNT(t.id_tarea) as total_tareas,
            COUNT(CASE WHEN et.descripcion_estado_tarea = 'Completada' THEN 1 END) as tareas_completadas,
            COUNT(CASE WHEN et.descripcion_estado_tarea IN ('Pendiente', 'En Progreso') THEN 1 END) as tareas_pendientes
          FROM persona p
          JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
          LEFT JOIN tarea t ON p.rut_persona = t.rut_persona
          LEFT JOIN estado_tarea et ON t.id_estado_tarea = et.id_estado_tarea
          WHERE pu.descripcion_perfil_usuario = 'Técnico'
          GROUP BY p.rut_persona, p.nombre_persona, p.apellido_paterno_persona
          ORDER BY total_tareas DESC
        `;
        break;

      case 'monthly-productivity':
        query = `
          SELECT 
            EXTRACT(MONTH FROM t.fecha_inicio_tarea) as mes,
            EXTRACT(YEAR FROM t.fecha_inicio_tarea) as año,
            COUNT(t.id_tarea) as total_tareas,
            COUNT(CASE WHEN et.descripcion_estado_tarea = 'Completada' THEN 1 END) as tareas_completadas,
            ROUND(
              COUNT(CASE WHEN et.descripcion_estado_tarea = 'Completada' THEN 1 END)::numeric / 
              NULLIF(COUNT(t.id_tarea), 0) * 100, 2
            ) as porcentaje_completado
          FROM tarea t
          JOIN estado_tarea et ON t.id_estado_tarea = et.id_estado_tarea
          WHERE t.fecha_inicio_tarea >= NOW() - INTERVAL '12 months'
          GROUP BY EXTRACT(YEAR FROM t.fecha_inicio_tarea), EXTRACT(MONTH FROM t.fecha_inicio_tarea)
          ORDER BY año DESC, mes DESC
        `;
        break;

      case 'task-status':
        query = `
          SELECT 
            et.descripcion_estado_tarea as estado,
            COUNT(t.id_tarea) as cantidad,
            ROUND(
              COUNT(t.id_tarea)::numeric / 
              (SELECT COUNT(*) FROM tarea)::numeric * 100, 2
            ) as porcentaje
          FROM estado_tarea et
          LEFT JOIN tarea t ON et.id_estado_tarea = t.id_estado_tarea
          GROUP BY et.id_estado_tarea, et.descripcion_estado_tarea
          ORDER BY cantidad DESC
        `;
        break;

      default:
        client.release();
        return res.status(400).json({ message: 'Tipo de reporte no válido' });
    }

    const result = await client.query(query, params);
    client.release();

    // Por ahora retornamos los datos JSON
    // En el futuro se puede implementar generación de PDF/Excel
    res.json({
      type,
      data: result.rows,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generando el reporte' });
  }
});

// =============================================================================
// SYSTEM LOGS
// =============================================================================

// GET /api/admin/logs - Obtener logs del sistema
router.get('/logs', async (req, res) => {
  const { limit = 100, offset = 0, level, date_from, date_to } = req.query;

  try {
    // Por ahora retornamos logs mock
    // En el futuro se puede implementar un sistema de logs real
    const mockLogs = [
      {
        id: 1,
        level: 'INFO',
        message: 'Usuario admin inició sesión',
        timestamp: new Date().toISOString(),
        user_id: req.user.rut_persona
      },
      {
        id: 2,
        level: 'WARNING',
        message: 'Intento de acceso denegado',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user_id: null
      }
    ];

    res.json({
      logs: mockLogs,
      total: mockLogs.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Error obteniendo logs del sistema' });
  }
});

// =============================================================================
// BACKUP OPERATIONS
// =============================================================================

// POST /api/admin/backup - Crear backup
router.post('/backup', async (req, res) => {
  try {
    // Implementar lógica de backup
    // Por ahora retornamos una respuesta mock
    const backupId = `backup_${Date.now()}`;
    
    res.json({
      message: 'Backup creado exitosamente',
      backup_id: backupId,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({ message: 'Error creando backup' });
  }
});

// GET /api/admin/backups - Listar backups
router.get('/backups', async (req, res) => {
  try {
    // Por ahora retornamos backups mock
    const mockBackups = [
      {
        id: 'backup_1640995200000',
        name: 'Backup 2024-01-01',
        size: '2.5 MB',
        created_at: '2024-01-01T00:00:00.000Z'
      }
    ];

    res.json(mockBackups);
  } catch (error) {
    console.error('Error fetching backups:', error);
    res.status(500).json({ message: 'Error obteniendo lista de backups' });
  }
});

// =============================================================================
// BULK OPERATIONS
// =============================================================================

// POST /api/admin/users/bulk - Crear múltiples usuarios
router.post('/users/bulk', async (req, res) => {
  const { users } = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ message: 'Se debe proporcionar un array de usuarios' });
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const results = [];
    const errors = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      try {
        // Validar datos del usuario
        if (!user.rut_persona || !user.nombre_persona || !user.email_corporativo) {
          errors.push({
            row: i + 1,
            error: 'Datos incompletos'
          });
          continue;
        }

        // Insertar usuario
        const result = await client.query(`
          INSERT INTO persona (
            rut_persona, rut_dv_persona, nombre_persona, apellido_paterno_persona,
            apellido_materno_persona, fecha_ingreso, email_pesonal, email_corporativo,
            telefono, id_perfil_usuario, activo
          ) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, $6, $7, $8, $9, true)
          RETURNING rut_persona, nombre_persona, apellido_paterno_persona
        `, [
          user.rut_persona, user.rut_dv_persona, user.nombre_persona, user.apellido_paterno_persona,
          user.apellido_materno_persona, user.email_pesonal, user.email_corporativo, 
          user.telefono, user.id_perfil_usuario
        ]);

        results.push(result.rows[0]);
      } catch (userError) {
        errors.push({
          row: i + 1,
          error: userError.message
        });
      }
    }

    await client.query('COMMIT');
    
    res.json({
      message: `Proceso completado. ${results.length} usuarios creados, ${errors.length} errores`,
      created: results,
      errors: errors
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in bulk user creation:', error);
    res.status(500).json({ message: 'Error en la creación masiva de usuarios' });
  } finally {
    client.release();
  }
});

// GET /api/admin/users/export - Exportar usuarios
router.get('/users/export', async (req, res) => {
  const { format = 'json' } = req.query;

  try {
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        p.rut_persona || '-' || p.rut_dv_persona as rut,
        p.nombre_persona,
        p.apellido_paterno_persona,
        p.apellido_materno_persona,
        p.email_corporativo,
        p.email_pesonal,
        p.telefono,
        pu.descripcion_perfil_usuario as perfil,
        CASE WHEN p.activo THEN 'Activo' ELSE 'Inactivo' END as estado,
        p.fecha_ingreso
      FROM persona p
      JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
      ORDER BY p.fecha_ingreso DESC
    `);

    client.release();

    if (format === 'csv') {
      // Generar CSV
      const csv = [
        'RUT,Nombre,Apellido Paterno,Apellido Materno,Email Corporativo,Email Personal,Teléfono,Perfil,Estado,Fecha Ingreso',
        ...result.rows.map(row => 
          `${row.rut},"${row.nombre_persona}","${row.apellido_paterno_persona}","${row.apellido_materno_persona || ''}","${row.email_corporativo}","${row.email_pesonal || ''}","${row.telefono || ''}","${row.perfil}","${row.estado}","${row.fecha_ingreso}"`
        )
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="usuarios.csv"');
      res.send(csv);
    } else {
      // Retornar JSON por defecto
      res.json(result.rows);
    }

  } catch (error) {
    console.error('Error exporting users:', error);
    res.status(500).json({ message: 'Error exportando usuarios' });
  }
});

module.exports = router;