INSERT INTO perfil_usuario (id_perfil_usuario, descripcion_perfil_usuario) VALUES
(1, 'ADMINISTRADOR'),
(2, 'SUPERVISOR'),
(3, 'RRHH'),
(4, 'TECNICO');

INSERT INTO persona (rut_persona, rut_dv_persona, nombre_persona, apellido_paterno_persona, apellido_materno_persona, fecha_ingreso, email_pesonal, email_corporativo, telefono, id_perfil_usuario) VALUES
(16698513, '7', 'DANIEL', 'PEREIRA', 'CARRASCO', '2012-01-30', 'ABDC@ABCD.CL', 'BBDD@BBDD.CL', '912345678', 2),
(17995534, '2', 'MARIO', 'GARCIA', 'SOTO', '2010-03-15', 'mario@gmail.com', 'mario@empresa.cl', '912341273', 1),
(21659600, '5', 'LUCIA', 'SOTO', 'VILLARROEL', '2011-03-15', 'lucia@gmail.com', 'lucia@empresa.cl', '912349210', 2),
(21698101, '4', 'ESTEBAN', 'VILLARROEL', 'RAMIREZ', '2012-03-15', 'esteban@gmail.com', 'esteban@empresa.cl', '912341012', 3),
(14248497, '8', 'SOFIA', 'RAMIREZ', 'MENDEZ', '2013-03-15', 'sofia@gmail.com', 'sofia@empresa.cl', '912345287', 4),
(12829772, '3', 'RICARDO', 'MENDEZ', 'GARCIA', '2014-03-15', 'ricardo@gmail.com', 'ricardo@empresa.cl', '912341739', 1);

INSERT INTO cliente (rut_cliente, rut_dv_cliente, descripcion_cliente) VALUES
(70000000, '1', 'FALABELLA'),
(70001000, '7', 'VOJIX-WCS'),
(70002000, '2', 'VOJIX-VENTAS'),
(70003000, '8', 'LAB-INFOMAXIS'),
(70004000, '3', 'CRUZVERDE');

INSERT INTO local (id_local, nombre_local, direcction_local, comuna_local, direccion_numero_local, region_local, rut_cliente) VALUES
(100, 'Local 1', 'Calle Falsa 100', 'Comuna 1', 100, 'Región 1', 70000000),
(101, 'Local 2', 'Calle Falsa 200', 'Comuna 2', 200, 'Región 2', 70001000),
(102, 'Local 3', 'Calle Falsa 300', 'Comuna 3', 300, 'Región 3', 70002000),
(103, 'Local 4', 'Calle Falsa 400', 'Comuna 4', 400, 'Región 4', 70003000),
(104, 'Local 5', 'Calle Falsa 500', 'Comuna 5', 500, 'Región 5', 70004000);

INSERT INTO contacto_local (id_contacto, nombre_contacto, apellido_contacto, email_contacto, cargo_contacto, telefono_contacto, id_local) VALUES
(200, 'Contacto1', 'Apellido1', 'contacto1@correo.cl', 'Encargado TI', '912346448', 100),
(201, 'Contacto2', 'Apellido2', 'contacto2@correo.cl', 'Encargado TI', '912344410', 101),
(202, 'Contacto3', 'Apellido3', 'contacto3@correo.cl', 'Encargado TI', '912348345', 102),
(203, 'Contacto4', 'Apellido4', 'contacto4@correo.cl', 'Encargado TI', '912349576', 103),
(204, 'Contacto5', 'Apellido5', 'contacto5@correo.cl', 'Encargado TI', '912348963', 104);

INSERT INTO area_cobro (id_area_cobro, descripcion_area_cobro) VALUES
(1, 'Cobro Cliente 1'),
(2, 'Cobro Cliente 2'),
(3, 'Cobro Cliente 3'),
(4, 'Cobro Cliente 4'),
(5, 'Cobro Cliente 5');

INSERT INTO tipo_tarea (id_tipo_tarea, descripcion_tipo_tarea) VALUES
(1, 'ROLL-OUT'),
(2, 'HOMOLOGACION POS'),
(3, 'TRASLADO EQUIPO'),
(4, 'INSTALACION EQUIPO'),
(5, 'PUNTO DE RED'),
(6, 'COTIZACION TRABAJO');

INSERT INTO estado_tarea (id_estado_tarea, descripcion_estado_tarea) VALUES
(1, 'ASIGNADA'),
(2, 'ENEJECUCION'),
(3, 'FINALIZADA'),
(4, 'CANCELADA'),
(5, 'TAREA FALLIDA'),
(6, 'TAREA ELIMINADA TECNICO'),
(7, 'TAREA ELIMINADA SUPERVISOR');

INSERT INTO tipo_hardware (id_tipo_hw, descripcion_tipo_hw) VALUES
(1, 'ROUTER'),
(2, 'SWITCH'),
(3, 'IMPRESORA POS'),
(4, 'LECTOR CODIGO'),
(5, 'BALANZA'),
(6, 'MONITOR TOUCH'),
(7, 'CPU POS'),
(8, 'SERVIDOR CENTRAL'),
(9, 'PUNTO DE ACCESO'),
(10, 'UPS');

INSERT INTO sistema_operativo (id_so, nombre_so) VALUES
(1, 'Windows 7'),
(2, 'Windows 8'),
(3, 'Windows 10'),
(4, 'Windows 11'),
(5, 'Windows Server 2016'),
(6, 'Windows Server 2019'),
(7, 'Windows Server 2022'),
(8, 'Ubuntu 20.04'),
(9, 'Ubuntu 22.04'),
(10, 'Debian 11'),
(11, 'Debian 12'),
(12, 'CentOS 7'),
(13, 'Rocky Linux 9'),
(14, 'Red Hat 8'),
(15, 'Fedora 39');
