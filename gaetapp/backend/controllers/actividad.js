import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  const { id_actividad, descripcion_actividad, id_so, id_tipo_hw } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO actividad VALUES ($1,$2,$3,$4) RETURNING *',
      [id_actividad, descripcion_actividad, id_so, id_tipo_hw]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM actividad');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM actividad WHERE id_actividad=$1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró la actividad' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion_actividad } = req.body;
  try {
    const result = await db.query(
      'UPDATE actividad SET descripcion_actividad=$1 WHERE id_actividad=$2 RETURNING *',
      [descripcion_actividad, id]
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
    await db.query('DELETE FROM actividad WHERE id_actividad=$1', [id]);
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
