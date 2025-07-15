-- Crear la base de datos
CREATE DATABASE DB_GAET;

-- Conectarse a la base
\c DB_GAET;

-- Crear tablas
CREATE TABLE perfil_usuario (
    id_perfil_usuario INT PRIMARY KEY,
    descripcion_perfil_usuario VARCHAR(80) NOT NULL
);

CREATE TABLE persona (
    rut_persona INT PRIMARY KEY,
    rut_dv_persona VARCHAR(1) NOT NULL,
    nombre_persona VARCHAR(30) NOT NULL,
    apellido_paterno_persona VARCHAR(30) NOT NULL,
    apellido_materno_persona VARCHAR(30) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    email_pesonal VARCHAR(100),
    email_corporativo VARCHAR(100) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    id_perfil_usuario INT REFERENCES perfil_usuario(id_perfil_usuario)
);

CREATE TABLE cliente (
    rut_cliente INT PRIMARY KEY,
    rut_dv_cliente VARCHAR(1) NOT NULL,
    descripcion_cliente VARCHAR NOT NULL
);

CREATE TABLE local (
    id_local INT PRIMARY KEY,
    nombre_local VARCHAR(100) NOT NULL,
    direcction_local VARCHAR(100) NOT NULL,
    comuna_local VARCHAR(50) NOT NULL,
    direccion_numero_local INT NOT NULL,
    region_local VARCHAR NOT NULL,
    rut_cliente INT REFERENCES cliente(rut_cliente)
);

CREATE TABLE contacto_local (
    id_contacto INT PRIMARY KEY,
    nombre_contacto VARCHAR(30) NOT NULL,
    apellido_contacto VARCHAR(30) NOT NULL,
    email_contacto VARCHAR(120),
    cargo_contacto VARCHAR(30) NOT NULL,
    telefono_contacto VARCHAR(15),
    id_local INT REFERENCES local(id_local)
);

CREATE TABLE informe (
    id_informe VARCHAR PRIMARY KEY,
    comentatio_informe VARCHAR(250),
    firma_encargado_recepcion VARCHAR(30) NOT NULL,
    nombre_encargado_recepcion VARCHAR(30) NOT NULL,
    apellido_encargado_recepcion VARCHAR(30) NOT NULL,
    cargo_encargado_recepcion VARCHAR(30) NOT NULL
);

CREATE TABLE area_cobro (
    id_area_cobro INT PRIMARY KEY,
    descripcion_area_cobro VARCHAR NOT NULL
);

CREATE TABLE tipo_tarea (
    id_tipo_tarea INT PRIMARY KEY,
    descripcion_tipo_tarea VARCHAR(100) NOT NULL
);

CREATE TABLE estado_tarea (
    id_estado_tarea INT PRIMARY KEY,
    descripcion_estado_tarea VARCHAR(50) NOT NULL
);

CREATE TABLE tipo_hardware (
    id_tipo_hw INT PRIMARY KEY,
    descripcion_tipo_hw VARCHAR(80) NOT NULL
);

CREATE TABLE sistema_operativo (
    id_so INT PRIMARY KEY,
    nombre_so VARCHAR(80) NOT NULL
);

CREATE TABLE actividad (
    id_actividad INT PRIMARY KEY,
    descripcion_actividad VARCHAR(80) NOT NULL,
    id_so INT REFERENCES sistema_operativo(id_so),
    id_tipo_hw INT REFERENCES tipo_hardware(id_tipo_hw)
);

CREATE TABLE tarea (
    id_tarea INT PRIMARY KEY,
    fecha_inicio_tarea DATE NOT NULL,
    fecha_fin_tarea DATE,
    hora_inicio_tarea TIME NOT NULL,
    hora_fin_tarea TIME,
    comentario_tarea VARCHAR(250),
    rut_persona INT REFERENCES persona(rut_persona),
    id_area_cobro INT REFERENCES area_cobro(id_area_cobro),
    id_informe VARCHAR REFERENCES informe(id_informe),
    id_actividad INT REFERENCES actividad(id_actividad),
    rut_cliente INT REFERENCES cliente(rut_cliente),
    id_estado_tarea INT REFERENCES estado_tarea(id_estado_tarea),
    id_tipo_tarea INT REFERENCES tipo_tarea(id_tipo_tarea)
);
