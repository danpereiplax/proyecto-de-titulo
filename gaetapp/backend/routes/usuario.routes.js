import { Router } from 'express';
import {
  crearUsuario,
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario
} from '../controllers/usuario.controller.js';


const router = Router();

router.post('/usuarios', crearUsuario);
router.get('/usuarios', listarUsuarios);
router.put('/usuarios/:rut', actualizarUsuario);
router.delete('/usuarios/:rut', eliminarUsuario);

router.get('/usuarios/test', (req, res) => {
  res.json({ ok: true });
});
console.log('📥 usuario.routes.js cargado');
export default router;