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
