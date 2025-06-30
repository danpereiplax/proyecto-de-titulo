import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  const {
    rut_persona,
    rut_dv_persona,
    nombre_persona,
    apellido_paterno_persona,
    apellido_materno_persona,
    fecha_ingreso,
    email_personal,
    email_corporativo,
    telefono,
    id_perfil_usuario
  } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO persona VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
      [
        rut_persona,
        rut_dv_persona,
        nombre_persona,
        apellido_paterno_persona,
        apellido_materno_persona,
        fecha_ingreso,
        email_personal,
        email_corporativo,
        telefono,
        id_perfil_usuario
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
    const result = await db.query('SELECT * FROM persona');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM persona WHERE rut_persona=$1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró la persona' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email_personal, email_corporativo, telefono } = req.body;
  try {
    const result = await db.query(
      'UPDATE persona SET email_personal=$1, email_corporativo=$2, telefono=$3 WHERE rut_persona=$4 RETURNING *',
      [email_personal, email_corporativo, telefono, id]
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
    await db.query('DELETE FROM persona WHERE rut_persona=$1', [id]);
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
