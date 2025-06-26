import { Router } from 'express';
import { obtenerTareas } from '../controllers/tarea.controller.js';
import { crearTarea } from '../controllers/tarea.controller.js';
import { obtenerTareaPorId} from '../controllers/tarea.controller.js';
import { actualizarTarea} from '../controllers/tarea.controller.js';
import { eliminarTarea} from '../controllers/tarea.controller.js';

const router = Router();

router.get('/tareas', obtenerTareas);
router.post('/tareas', crearTarea);
router.get('/tareas/:id', obtenerTareaPorId);
router.put('/tareas/:id', actualizarTarea);
router.delete('/tareas/:id', eliminarTarea);
export default router;
