import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  const {
    id_tarea,
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
    const result = await db.query(
      'INSERT INTO tarea VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',
      [
        id_tarea,
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
    const result = await db.query('SELECT * FROM tarea');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM tarea WHERE id_tarea=$1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró la tarea' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { comentario_tarea, fecha_fin_tarea, hora_fin_tarea, id_estado_tarea } = req.body;
  try {
    const result = await db.query(
      'UPDATE tarea SET comentario_tarea=$1, fecha_fin_tarea=$2, hora_fin_tarea=$3, id_estado_tarea=$4 WHERE id_tarea=$5 RETURNING *',
      [comentario_tarea, fecha_fin_tarea, hora_fin_tarea, id_estado_tarea, id]
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
    await db.query('DELETE FROM tarea WHERE id_tarea=$1', [id]);
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
