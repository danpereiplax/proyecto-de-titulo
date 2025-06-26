import axios from 'axios';

const API = 'http://localhost:3000/api/tareas';

export const obtenerTareas = () => axios.get(API);

export const crearTarea = (tarea) => axios.post(API, tarea);

export const actualizarTarea = (id, tarea) => axios.put(`${API}/${id}`, tarea);

export const eliminarTarea = (id) => axios.delete(`${API}/${id}`);
