// backend/config/database-mappings.js
// Mapeo de los estados y tipos que están en tu base de datos actual

const ESTADOS_TAREA = {
  ASIGNADA: 1,
  EN_EJECUCION: 2,
  FINALIZADA: 3,
  CANCELADA: 4,
  TAREA_FALLIDA: 5,
  TAREA_ELIMINADA_TECNICO: 6,
  TAREA_ELIMINADA_SUPERVISOR: 7
};

const TIPOS_TAREA = {
  ROLL_OUT: 1,
  HOMOLOGACION_POS: 2,
  TRASLADO_EQUIPO: 3,
  INSTALACION_EQUIPO: 4,
  PUNTO_DE_RED: 5,
  COTIZACION_TRABAJO: 6
};

const PERFILES_USUARIO = {
  ADMINISTRADOR: 1,
  SUPERVISOR: 2,
  RRHH: 3,
  TECNICO: 4
};

const AREAS_COBRO = {
  COBRO_CLIENTE_1: 1,
  COBRO_CLIENTE_2: 2,
  COBRO_CLIENTE_3: 3,
  COBRO_CLIENTE_4: 4,
  COBRO_CLIENTE_5: 5
};

// Mapeo para el frontend (nombres amigables)
const ESTADO_TAREA_LABELS = {
  1: 'Asignada',
  2: 'En Ejecución', 
  3: 'Finalizada',
  4: 'Cancelada',
  5: 'Fallida',
  6: 'Eliminada por Técnico',
  7: 'Eliminada por Supervisor'
};

const TIPO_TAREA_LABELS = {
  1: 'Roll-out',
  2: 'Homologación POS',
  3: 'Traslado de Equipo',
  4: 'Instalación de Equipo',
  5: 'Punto de Red',
  6: 'Cotización de Trabajo'
};

const PERFIL_USUARIO_LABELS = {
  1: 'Administrador',
  2: 'Supervisor',
  3: 'RRHH',
  4: 'Técnico'
};

module.exports = {
  ESTADOS_TAREA,
  TIPOS_TAREA,
  PERFILES_USUARIO,
  AREAS_COBRO,
  ESTADO_TAREA_LABELS,
  TIPO_TAREA_LABELS,
  PERFIL_USUARIO_LABELS
};