import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  const { id_perfil_usuario, descripcion_perfil_usuario } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO perfil_usuario VALUES ($1, $2) RETURNING *',
      [id_perfil_usuario, descripcion_perfil_usuario]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM perfil_usuario');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM perfil_usuario WHERE id_perfil_usuario=$1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró el perfil de usuario' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion_perfil_usuario } = req.body;
  try {
    const result = await db.query(
      'UPDATE perfil_usuario SET descripcion_perfil_usuario = $1 WHERE id_perfil_usuario = $2 RETURNING *',
      [descripcion_perfil_usuario, id]
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
    await db.query('DELETE FROM perfil_usuario WHERE id_perfil_usuario = $1', [id]);
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
