import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  const {
    id_contacto,
    nombre_contacto,
    apellido_contacto,
    email_contacto,
    cargo_contacto,
    telefono_contacto,
    id_local
  } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO contacto_local VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [
        id_contacto,
        nombre_contacto,
        apellido_contacto,
        email_contacto,
        cargo_contacto,
        telefono_contacto,
        id_local
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
    const result = await db.query('SELECT * FROM contacto_local');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM contacto_local WHERE id_contacto=$1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró el contacto local' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email_contacto, cargo_contacto, telefono_contacto } = req.body;
  try {
    const result = await db.query(
      'UPDATE contacto_local SET email_contacto=$1, cargo_contacto=$2, telefono_contacto=$3 WHERE id_contacto=$4 RETURNING *',
      [email_contacto, cargo_contacto, telefono_contacto, id]
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
    await db.query('DELETE FROM contacto_local WHERE id_contacto=$1', [id]);
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
