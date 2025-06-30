import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  const { rut_cliente, rut_dv_cliente, descripcion_cliente } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO cliente VALUES ($1, $2, $3) RETURNING *',
      [rut_cliente, rut_dv_cliente, descripcion_cliente]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM cliente');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM cliente WHERE rut_cliente=$1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró el cliente' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion_cliente } = req.body;
  try {
    const result = await db.query(
      'UPDATE cliente SET descripcion_cliente=$1 WHERE rut_cliente=$2 RETURNING *',
      [descripcion_cliente, id]
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
    await db.query('DELETE FROM cliente WHERE rut_cliente=$1', [id]);
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
