import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  const {
    id_local,
    nombre_local,
    direccion_local,
    comuna_local,
    direccion_numero_local,
    region_local,
    rut_cliente
  } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO local VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [
        id_local,
        nombre_local,
        direccion_local,
        comuna_local,
        direccion_numero_local,
        region_local,
        rut_cliente
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM local');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM local WHERE id_local=$1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró el local' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nombre_local,
    direccion_local,
    comuna_local,
    direccion_numero_local,
    region_local
  } = req.body;
  try {
    const result = await db.query(
      'UPDATE local SET nombre_local=$1, direccion_local=$2, comuna_local=$3, direccion_numero_local=$4, region_local=$5 WHERE id_local=$6 RETURNING *',
      [
        nombre_local,
        direccion_local,
        comuna_local,
        direccion_numero_local,
        region_local,
        id
      ]
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
    await db.query('DELETE FROM local WHERE id_local=$1', [id]);
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
