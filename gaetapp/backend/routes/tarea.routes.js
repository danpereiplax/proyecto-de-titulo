import { Router } from 'express';
import { obtenerTareas } from '../controllers/tarea.controller.js';

const router = Router();

router.get('/tareas', obtenerTareas);

export default router;
