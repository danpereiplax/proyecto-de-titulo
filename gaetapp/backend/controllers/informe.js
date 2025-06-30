import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  const {
    id_informe,
    comentario_informe,
    firma_encargado_recepcion,
    nombre_encargado_recepcion,
    apellido_encargado_recepcion,
    cargo_encargado_recepcion
  } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO informe VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [
        id_informe,
        comentario_informe,
        firma_encargado_recepcion,
        nombre_encargado_recepcion,
        apellido_encargado_recepcion,
        cargo_encargado_recepcion
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
    const result = await db.query('SELECT * FROM informe');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM informe WHERE id_informe=$1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró el informe' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { comentario_informe } = req.body;
  try {
    const result = await db.query(
      'UPDATE informe SET comentario_informe=$1 WHERE id_informe=$2 RETURNING *',
      [comentario_informe, id]
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
    await db.query('DELETE FROM informe WHERE id_informe=$1', [id]);
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
