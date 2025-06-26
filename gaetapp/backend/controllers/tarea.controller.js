import pool from '../db.js';

export async function obtenerTareas(req, res) {
  try {
    const result = await pool.query('SELECT * FROM tarea');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function obtenerTareaPorId(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        t.id_tarea,
        t.fecha_inicio_tarea,
        t.hora_inicio_tarea,
        p.nombre_persona || ' ' || p.apellido_paterno_persona AS tecnico,
        c.descripcion_cliente AS cliente,
        i.id_informe,
        i.comentatio_informe,
        a.descripcion_actividad AS actividad,
        at.descripcion_area_cobro AS area_cobro,
        et.descripcion_estado_tarea AS estado,
        tt.descripcion_tipo_tarea AS tipo_tarea
      FROM tarea t
      INNER JOIN persona p ON t.rut_persona = p.rut_persona
      INNER JOIN cliente c ON t.rut_cliente = c.rut_cliente
      INNER JOIN informe i ON t.id_informe = i.id_informe
      INNER JOIN actividad a ON t.id_actividad = a.id_actividad
      INNER JOIN area_cobro at ON t.id_area_cobro = at.id_area_cobro
      INNER JOIN estado_tarea et ON t.id_estado_tarea = et.id_estado_tarea
      INNER JOIN tipo_tarea tt ON t.id_tipo_tarea = tt.id_tipo_tarea
      WHERE t.id_tarea = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener tarea con detalles:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function actualizarTarea(req, res) {
  const { id } = req.params;
  const {
    fecha_inicio_tarea,
    fecha_fin_tarea,
    hora_inicio_tarea,
    hora_fin_tarea,
    comentario_tarea,
    rut_persona,
    id_area_cobro,
    id_informe,
    id_actividad,
    rut_cliente,
    id_estado_tarea,
    id_tipo_tarea
  } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE tarea SET
        fecha_inicio_tarea = $1,
        fecha_fin_tarea = $2,
        hora_inicio_tarea = $3,
        hora_fin_tarea = $4,
        comentario_tarea = $5,
        rut_persona = $6,
        id_area_cobro = $7,
        id_informe = $8,
        id_actividad = $9,
        rut_cliente = $10,
        id_estado_tarea = $11,
        id_tipo_tarea = $12
      WHERE id_tarea = $13
      RETURNING *;
      `,
      [
        fecha_inicio_tarea,
        fecha_fin_tarea,
        hora_inicio_tarea,
        hora_fin_tarea,
        comentario_tarea,
        rut_persona,
        id_area_cobro,
        id_informe,
        id_actividad,
        rut_cliente,
        id_estado_tarea,
        id_tipo_tarea,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar tarea:', error);
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
}


export async function crearTarea(req, res) {
  try {
    const {
      fecha_inicio_tarea,
      hora_inicio_tarea,
      rut_persona,
      id_area_cobro,
      id_informe,
      id_actividad,
      rut_cliente,
      id_estado_tarea,
      id_tipo_tarea
    } = req.body;

    const result = await pool.query(
      `INSERT INTO tarea (
        fecha_inicio_tarea,
        hora_inicio_tarea,
        rut_persona,
        id_area_cobro,
        id_informe,
        id_actividad,
        rut_cliente,
        id_estado_tarea,
        id_tipo_tarea
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        fecha_inicio_tarea,
        hora_inicio_tarea,
        rut_persona,
        id_area_cobro,
        id_informe,
        id_actividad,
        rut_cliente,
        id_estado_tarea,
        id_tipo_tarea
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }

}

export async function eliminarTarea(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM tarea WHERE id_tarea = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
}

