import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  const { id_tipo_tarea, descripcion_tipo_tarea } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO tipo_tarea VALUES ($1,$2) RETURNING *',
      [id_tipo_tarea, descripcion_tipo_tarea]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tipo_tarea');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM tipo_tarea WHERE id_tipo_tarea=$1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró el tipo de tarea' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion_tipo_tarea } = req.body;
  try {
    const result = await db.query(
      'UPDATE tipo_tarea SET descripcion_tipo_tarea=$1 WHERE id_tipo_tarea=$2 RETURNING *',
      [descripcion_tipo_tarea, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tipo_tarea WHERE id_tipo_tarea=$1', [id]);
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
