// backend/routes/supervisorRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, requireSupervisor } = require('../middleware/auth'); // Cambiar esta línea
const { pool } = require('../config/database');

// Middleware para todas las rutas de supervisor
router.use(authenticateToken);
router.use(requireSupervisor); // Cambiar esta línea


// ========================================
// DASHBOARD Y ESTADÍSTICAS
// ========================================

// GET /api/supervisor/stats - Estadísticas del dashboard
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 Obteniendo estadísticas del supervisor...');
    
    // Estadísticas de tareas
    const tasksQuery = `
      SELECT 
        COUNT(*) as total_tareas,
        COUNT(*) FILTER (WHERE et.descripcion_estado_tarea = 'PENDIENTE') as tareas_pendientes,
        COUNT(*) FILTER (WHERE et.descripcion_estado_tarea = 'EN_PROGRESO') as tareas_en_progreso,
        COUNT(*) FILTER (WHERE et.descripcion_estado_tarea = 'COMPLETADA' AND DATE(t.fecha_creacion_tarea) = CURRENT_DATE) as completadas_hoy
      FROM tarea t
      LEFT JOIN estado_tarea et ON t.id_estado_tarea = et.id_estado_tarea
      WHERE t.activo = true
    `;
    
    const tasksResult = await pool.query(tasksQuery);
    const taskStats = tasksResult.rows[0];
    
    // Estadísticas de técnicos
    const techniciansQuery = `
      SELECT 
        COUNT(*) as total_tecnicos,
        COUNT(*) FILTER (WHERE p.activo = true) as tecnicos_activos
      FROM persona p
      JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
      WHERE pu.descripcion_perfil_usuario = 'TECNICO'
    `;
    
    const techniciansResult = await pool.query(techniciansQuery);
    const techStats = techniciansResult.rows[0];
    
    // Estadísticas de clientes
    const clientsQuery = `
      SELECT COUNT(*) as total_clientes
      FROM cliente 
      WHERE activo = true
    `;
    
    const clientsResult = await pool.query(clientsQuery);
    const clientStats = clientsResult.rows[0];
    
    const stats = {
      tasksActive: parseInt(taskStats.tareas_en_progreso) || 0,
      tasksPending: parseInt(taskStats.tareas_pendientes) || 0,
      tasksCompleted: parseInt(taskStats.completadas_hoy) || 0,
      techniciansActive: parseInt(techStats.tecnicos_activos) || 0,
      totalClients: parseInt(clientStats.total_clientes) || 0
    };
    
    console.log('✅ Estadísticas obtenidas:', stats);
    res.json(stats);
    
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ========================================
// GESTIÓN DE TAREAS
// ========================================

// GET /api/supervisor/tasks - Obtener todas las tareas
router.get('/tasks', async (req, res) => {
  try {
    console.log('📋 Obteniendo tareas para supervisor...');
    
    const { status, technician, search, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        t.id_tarea as id,
        t.descripcion_tarea as descripcion,
        et.descripcion_estado_tarea as estado,
        tt.descripcion_tipo_tarea as tipo,
        c.nombre_cliente as cliente,
        lc.direccion_local as direccion,
        p.nombre_persona || ' ' || p.apellido_paterno_persona as tecnico_asignado,
        t.rut_persona_asignada,
        t.fecha_creacion_tarea as fecha_creacion,
        t.fecha_programada_tarea as fecha_programada,
        t.prioridad_tarea as prioridad,
        t.id_tipo_tarea,
        t.id_local_cliente
      FROM tarea t
      LEFT JOIN estado_tarea et ON t.id_estado_tarea = et.id_estado_tarea
      LEFT JOIN tipo_tarea tt ON t.id_tipo_tarea = tt.id_tipo_tarea
      LEFT JOIN local_cliente lc ON t.id_local_cliente = lc.id_local_cliente
      LEFT JOIN cliente c ON lc.id_cliente = c.id_cliente
      LEFT JOIN persona p ON t.rut_persona_asignada = p.rut_persona
      WHERE t.activo = true
    `;
    
    const params = [];
    let paramCount = 1;
    
    if (status) {
      query += ` AND et.descripcion_estado_tarea = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    
    if (technician) {
      query += ` AND p.rut_persona = $${paramCount}`;
      params.push(technician);
      paramCount++;
    }
    
    if (search) {
      query += ` AND (t.descripcion_tarea ILIKE $${paramCount} OR c.nombre_cliente ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }
    
    query += ` ORDER BY t.fecha_creacion_tarea DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    console.log(`✅ ${result.rows.length} tareas obtenidas`);
    res.json(result.rows);
    
  } catch (error) {
    console.error('❌ Error obteniendo tareas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/supervisor/tasks - Crear nueva tarea
router.post('/tasks', async (req, res) => {
  try {
    console.log('📝 Creando nueva tarea:', req.body);
    
    const {
      descripcion,
      id_tipo_tarea,
      id_local_cliente,
      rut_persona_asignada,
      fecha_programada,
      prioridad = 'MEDIA'
    } = req.body;
    
    // Validaciones
    if (!descripcion || !id_tipo_tarea || !id_local_cliente) {
      return res.status(400).json({
        success: false,
        message: 'Descripción, tipo de tarea y local son obligatorios'
      });
    }
    
    const query = `
      INSERT INTO tarea (
        descripcion_tarea,
        id_tipo_tarea,
        id_local_cliente,
        rut_persona_asignada,
        fecha_programada_tarea,
        prioridad_tarea,
        id_estado_tarea,
        fecha_creacion_tarea,
        activo
      ) VALUES (
        $1, $2, $3, $4, $5, $6, 
        (SELECT id_estado_tarea FROM estado_tarea WHERE descripcion_estado_tarea = 'PENDIENTE'),
        NOW(),
        true
      ) RETURNING id_tarea
    `;
    
    const result = await pool.query(query, [
      descripcion,
      id_tipo_tarea,
      id_local_cliente,
      rut_persona_asignada,
      fecha_programada,
      prioridad
    ]);
    
    const taskId = result.rows[0].id_tarea;
    
    console.log('✅ Tarea creada con ID:', taskId);
    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      taskId
    });
    
  } catch (error) {
    console.error('❌ Error creando tarea:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/supervisor/tasks/:id - Actualizar tarea
router.put('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log(`📝 Actualizando tarea ${taskId}:`, req.body);
    
    const {
      descripcion,
      id_tipo_tarea,
      id_local_cliente,
      rut_persona_asignada,
      fecha_programada,
      prioridad,
      id_estado_tarea
    } = req.body;
    
    const query = `
      UPDATE tarea SET
        descripcion_tarea = COALESCE($1, descripcion_tarea),
        id_tipo_tarea = COALESCE($2, id_tipo_tarea),
        id_local_cliente = COALESCE($3, id_local_cliente),
        rut_persona_asignada = COALESCE($4, rut_persona_asignada),
        fecha_programada_tarea = COALESCE($5, fecha_programada_tarea),
        prioridad_tarea = COALESCE($6, prioridad_tarea),
        id_estado_tarea = COALESCE($7, id_estado_tarea),
        fecha_modificacion_tarea = NOW()
      WHERE id_tarea = $8 AND activo = true
      RETURNING id_tarea
    `;
    
    const result = await pool.query(query, [
      descripcion,
      id_tipo_tarea,
      id_local_cliente,
      rut_persona_asignada,
      fecha_programada,
      prioridad,
      id_estado_tarea,
      taskId
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    console.log('✅ Tarea actualizada exitosamente');
    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error actualizando tarea:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/supervisor/tasks/:id - Eliminar tarea (soft delete)
router.delete('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log(`🗑️ Eliminando tarea ${taskId}`);
    
    const query = `
      UPDATE tarea SET
        activo = false,
        fecha_modificacion_tarea = NOW()
      WHERE id_tarea = $1 AND activo = true
      RETURNING id_tarea
    `;
    
    const result = await pool.query(query, [taskId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    console.log('✅ Tarea eliminada exitosamente');
    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error eliminando tarea:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ========================================
// GESTIÓN DE TÉCNICOS
// ========================================

// GET /api/supervisor/technicians - Obtener técnicos
router.get('/technicians', async (req, res) => {
  try {
    console.log('👨‍🔧 Obteniendo técnicos...');
    
    const query = `
      SELECT 
        p.rut_persona as rut,
        p.nombre_persona as nombre,
        p.apellido_paterno_persona as apellido,
        p.email_corporativo as email,
        p.telefono,
        p.activo,
        COUNT(t.id_tarea) FILTER (WHERE et.descripcion_estado_tarea IN ('PENDIENTE', 'EN_PROGRESO')) as tareas_asignadas,
        COUNT(t.id_tarea) FILTER (WHERE et.descripcion_estado_tarea = 'COMPLETADA' AND DATE(t.fecha_modificacion_tarea) = CURRENT_DATE) as completadas_hoy
      FROM persona p
      JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
      LEFT JOIN tarea t ON p.rut_persona = t.rut_persona_asignada AND t.activo = true
      LEFT JOIN estado_tarea et ON t.id_estado_tarea = et.id_estado_tarea
      WHERE pu.descripcion_perfil_usuario = 'TECNICO'
      GROUP BY p.rut_persona, p.nombre_persona, p.apellido_paterno_persona, p.email_corporativo, p.telefono, p.activo
      ORDER BY p.nombre_persona
    `;
    
    const result = await pool.query(query);
    
    // Agregar estado dinámico basado en tareas
    const technicians = result.rows.map(tech => ({
      ...tech,
      estado: tech.tareas_asignadas > 0 ? 'EN_TERRENO' : 'DISPONIBLE',
      tareas_asignadas: parseInt(tech.tareas_asignadas) || 0,
      completadas_hoy: parseInt(tech.completadas_hoy) || 0
    }));
    
    console.log(`✅ ${technicians.length} técnicos obtenidos`);
    res.json(technicians);
    
  } catch (error) {
    console.error('❌ Error obteniendo técnicos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ========================================
// GESTIÓN DE CLIENTES
// ========================================

// GET /api/supervisor/clients - Obtener clientes
router.get('/clients', async (req, res) => {
  try {
    console.log('🏢 Obteniendo clientes...');
    
    const query = `
      SELECT 
        c.id_cliente as id,
        c.nombre_cliente as nombre,
        c.rut_cliente as rut,
        c.email_cliente as email,
        c.telefono_cliente as telefono,
        c.activo,
        COUNT(lc.id_local_cliente) as locales_count,
        COUNT(t.id_tarea) FILTER (WHERE et.descripcion_estado_tarea IN ('PENDIENTE', 'EN_PROGRESO')) as tareas_activas
      FROM cliente c
      LEFT JOIN local_cliente lc ON c.id_cliente = lc.id_cliente AND lc.activo = true
      LEFT JOIN tarea t ON lc.id_local_cliente = t.id_local_cliente AND t.activo = true
      LEFT JOIN estado_tarea et ON t.id_estado_tarea = et.id_estado_tarea
      WHERE c.activo = true
      GROUP BY c.id_cliente, c.nombre_cliente, c.rut_cliente, c.email_cliente, c.telefono_cliente, c.activo
      ORDER BY c.nombre_cliente
    `;
    
    const result = await pool.query(query);
    
    const clients = result.rows.map(client => ({
      ...client,
      locales_count: parseInt(client.locales_count) || 0,
      tareas_activas: parseInt(client.tareas_activas) || 0
    }));
    
    console.log(`✅ ${clients.length} clientes obtenidos`);
    res.json(clients);
    
  } catch (error) {
    console.error('❌ Error obteniendo clientes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/supervisor/clients - Crear cliente
router.post('/clients', async (req, res) => {
  try {
    console.log('🏢 Creando nuevo cliente:', req.body);
    
    const {
      nombre,
      rut,
      email,
      telefono,
      direccion
    } = req.body;
    
    // Validaciones
    if (!nombre || !rut) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y RUT son obligatorios'
      });
    }
    
    await pool.query('BEGIN');
    
    try {
      // Crear cliente
      const clientQuery = `
        INSERT INTO cliente (
          nombre_cliente,
          rut_cliente,
          email_cliente,
          telefono_cliente,
          activo
        ) VALUES ($1, $2, $3, $4, true)
        RETURNING id_cliente
      `;
      
      const clientResult = await pool.query(clientQuery, [nombre, rut, email, telefono]);
      const clientId = clientResult.rows[0].id_cliente;
      
      // Si hay dirección, crear local principal
      if (direccion) {
        const localQuery = `
          INSERT INTO local_cliente (
            id_cliente,
            nombre_local,
            direccion_local,
            activo
          ) VALUES ($1, $2, $3, true)
        `;
        
        await pool.query(localQuery, [clientId, `${nombre} - Principal`, direccion]);
      }
      
      await pool.query('COMMIT');
      
      console.log('✅ Cliente creado con ID:', clientId);
      res.status(201).json({
        success: true,
        message: 'Cliente creado exitosamente',
        clientId
      });
      
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error('❌ Error creando cliente:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/supervisor/clients/:id - Actualizar cliente
router.put('/clients/:id', async (req, res) => {
  try {
    const clientId = req.params.id;
    console.log(`🏢 Actualizando cliente ${clientId}:`, req.body);
    
    const { nombre, rut, email, telefono } = req.body;
    
    const query = `
      UPDATE cliente SET
        nombre_cliente = COALESCE($1, nombre_cliente),
        rut_cliente = COALESCE($2, rut_cliente),
        email_cliente = COALESCE($3, email_cliente),
        telefono_cliente = COALESCE($4, telefono_cliente)
      WHERE id_cliente = $5 AND activo = true
      RETURNING id_cliente
    `;
    
    const result = await pool.query(query, [nombre, rut, email, telefono, clientId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    console.log('✅ Cliente actualizado exitosamente');
    res.json({
      success: true,
      message: 'Cliente actualizado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error actualizando cliente:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ========================================
// DATOS AUXILIARES
// ========================================

// GET /api/supervisor/task-types - Tipos de tarea
router.get('/task-types', async (req, res) => {
  try {
    const query = 'SELECT * FROM tipo_tarea WHERE activo = true ORDER BY descripcion_tipo_tarea';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error obteniendo tipos de tarea:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// GET /api/supervisor/task-states - Estados de tarea
router.get('/task-states', async (req, res) => {
  try {
    const query = 'SELECT * FROM estado_tarea ORDER BY id_estado_tarea';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error obteniendo estados de tarea:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// GET /api/supervisor/client-locations/:clientId - Locales de un cliente
router.get('/client-locations/:clientId', async (req, res) => {
  try {
    const query = `
      SELECT * FROM local_cliente 
      WHERE id_cliente = $1 AND activo = true 
      ORDER BY nombre_local
    `;
    const result = await pool.query(query, [req.params.clientId]);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error obteniendo locales:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// ========================================
// DATOS AUXILIARES PARA FORMULARIOS
// ========================================

// GET /api/supervisor/task-types - Tipos de tarea para formularios
router.get('/task-types', async (req, res) => {
  try {
    console.log('📋 Obteniendo tipos de tarea...');
    
    const query = 'SELECT * FROM tipo_tarea WHERE activo = true ORDER BY descripcion_tipo_tarea';
    const result = await pool.query(query);
    
    console.log(`✅ ${result.rows.length} tipos de tarea obtenidos`);
    res.json(result.rows);
    
  } catch (error) {
    console.error('❌ Error obteniendo tipos de tarea:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/supervisor/task-states - Estados de tarea para formularios
router.get('/task-states', async (req, res) => {
  try {
    console.log('📊 Obteniendo estados de tarea...');
    
    const query = 'SELECT * FROM estado_tarea ORDER BY id_estado_tarea';
    const result = await pool.query(query);
    
    console.log(`✅ ${result.rows.length} estados de tarea obtenidos`);
    res.json(result.rows);
    
  } catch (error) {
    console.error('❌ Error obteniendo estados de tarea:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/supervisor/client-locations/:clientId - Locales de un cliente
router.get('/client-locations/:clientId', async (req, res) => {
  try {
    const clientId = req.params.clientId;
    console.log(`📍 Obteniendo locales del cliente ${clientId}...`);
    
    const query = `
      SELECT * FROM local_cliente 
      WHERE id_cliente = $1 AND activo = true 
      ORDER BY nombre_local
    `;
    const result = await pool.query(query, [clientId]);
    
    console.log(`✅ ${result.rows.length} locales obtenidos`);
    res.json(result.rows);
    
  } catch (error) {
    console.error('❌ Error obteniendo locales:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;