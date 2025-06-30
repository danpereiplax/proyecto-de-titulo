import express from 'express';

// Importar controladores de CRUD por tabla
import perfilUsuario from '../controllers/perfil_usuario.js';
import persona from '../controllers/persona.js';
import cliente from '../controllers/cliente.js';
import local from '../controllers/local.js';
import contactoLocal from '../controllers/contacto_local.js';
import informe from '../controllers/informe.js';
import areaCobro from '../controllers/area_cobro.js';
import tipoTarea from '../controllers/tipo_tarea.js';
import estadoTarea from '../controllers/estado_tarea.js';
import tipoHardware from '../controllers/tipo_hardware.js';
import sistemaOperativo from '../controllers/sistema_operativo.js';
import actividad from '../controllers/actividad.js';
import tarea from '../controllers/tarea.js';

const router = express.Router();

// Asignar rutas a cada tabla
router.use('/perfil_usuario', perfilUsuario);
router.use('/persona', persona);
router.use('/cliente', cliente);
router.use('/local', local);
router.use('/contacto_local', contactoLocal);
router.use('/informe', informe);
router.use('/area_cobro', areaCobro);
router.use('/tipo_tarea', tipoTarea);
router.use('/estado_tarea', estadoTarea);
router.use('/tipo_hardware', tipoHardware);
router.use('/sistema_operativo', sistemaOperativo);
router.use('/actividad', actividad);
router.use('/tarea', tarea);

export default router;
