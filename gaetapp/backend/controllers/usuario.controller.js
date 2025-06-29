import pool from '../db.js';

export async function crearUsuario(req, res) {
  try {
    const {
      rut,
      dv,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      email,              // correo corporativo
      emailPersonal,      // <-- nuevo campo
      telefono,
      perfil,
      clave
    } = req.body;

    const result = await pool.query(`
      INSERT INTO persona (
        rut_persona, rut_dv_persona, nombre_persona, apellido_paterno_persona,
        apellido_materno_persona, fecha_ingreso, email_personal, email_corporativo,
        telefono, id_perfil_usuario
      ) VALUES ($1,$2,$3,$4,$5,CURRENT_DATE,$6,$7,$8,$9)
      RETURNING *`,
      [rut, dv, nombre, apellidoPaterno, apellidoMaterno, emailPersonal, email, telefono, perfil]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
}

// GET /api/usuarios
export async function listarUsuarios(req, res) {
  try {
    const result = await pool.query('SELECT * FROM persona');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al listar usuarios:', error);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
}
// PUT /api/usuarios/:rut
export async function actualizarUsuario(req, res) {
  try {
    const rut = req.params.rut;

    // Obtener datos actuales
    const resultActual = await pool.query('SELECT * FROM persona WHERE rut_persona = $1', [rut]);
    if (resultActual.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuarioActual = resultActual.rows[0];

    const {
      nombre = usuarioActual.nombre_persona,
      apellidoPaterno = usuarioActual.apellido_paterno_persona,
      apellidoMaterno = usuarioActual.apellido_materno_persona,
      email = usuarioActual.email_corporativo,
      telefono = usuarioActual.telefono,
      perfil = usuarioActual.id_perfil_usuario,
      dv = usuarioActual.rut_dv_persona
    } = req.body;

    const result = await pool.query(`
      UPDATE persona SET
        rut_dv_persona = $1,
        nombre_persona = $2,
        apellido_paterno_persona = $3,
        apellido_materno_persona = $4,
        email_corporativo = $5,
        telefono = $6,
        id_perfil_usuario = $7
      WHERE rut_persona = $8
      RETURNING *`,
      [dv, nombre, apellidoPaterno, apellidoMaterno, email, telefono, perfil, rut]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
}

// DELETE /api/usuarios/:rut
export async function eliminarUsuario(req, res) {
  try {
    const rut = req.params.rut;
    const result = await pool.query('DELETE FROM persona WHERE rut_persona = $1 RETURNING *', [rut]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente', usuario: result.rows[0] });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
}
