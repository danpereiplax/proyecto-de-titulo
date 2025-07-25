// backend/services/adminService.js
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

class AdminService {
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || '38.242.237.107',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'db_gaet',
      user: process.env.DB_USER || 'gaet',
      password: process.env.DB_PASSWORD,
    });
  }

  // 📋 Listar todos los usuarios con información completa
  async getAllUsers() {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT 
          p.rut_persona,
          p.rut_dv_persona,
          p.nombre_persona,
          p.apellido_paterno_persona,
          p.apellido_materno_persona,
          p.email_corporativo,
          p.email_personal,
          p.telefono,
          p.fecha_ingreso,
          p.activo,
          p.username,
          p.password_hash,
          p.requiere_cambio_password,
          p.fecha_ultimo_cambio_password,
          pu.id_perfil_usuario,
          pu.descripcion_perfil_usuario
        FROM persona p
        LEFT JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
        ORDER BY p.nombre_persona, p.apellido_paterno_persona
      `;
      
      const result = await client.query(query);
      
      return {
        success: true,
        data: result.rows,
        total: result.rows.length
      };
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw new Error('Error al obtener usuarios');
    } finally {
      client.release();
    }
  }

  // 👤 Obtener usuario por RUT
  async getUserByRut(rutPersona) {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT 
          p.*,
          pu.descripcion_perfil_usuario
        FROM persona p
        LEFT JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
        WHERE p.rut_persona = $1
      `;
      
      const result = await client.query(query, [rutPersona]);
      
      if (result.rows.length === 0) {
        throw new Error('Usuario no encontrado');
      }
      
      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ➕ Crear nuevo usuario
  async createUser(userData) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Validar que el RUT no exista
      const existingUser = await client.query(
        'SELECT rut_persona FROM persona WHERE rut_persona = $1',
        [userData.rut_persona]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('Ya existe un usuario con este RUT');
      }

      // Validar que el username no exista
      if (userData.username) {
        const existingUsername = await client.query(
          'SELECT username FROM persona WHERE username = $1',
          [userData.username]
        );

        if (existingUsername.rows.length > 0) {
          throw new Error('Ya existe un usuario con este nombre de usuario');
        }
      }

      // Generar username automático si no se proporciona
      const username = userData.username || this.generateUsername(
        userData.nombre_persona,
        userData.apellido_paterno_persona
      );

      // Hash de la contraseña si se proporciona
      let passwordHash = null;
      if (userData.password) {
        const saltRounds = 10;
        passwordHash = await bcrypt.hash(userData.password, saltRounds);
      }

      // Insertar nuevo usuario
      const insertQuery = `
        INSERT INTO persona (
          rut_persona,
          rut_dv_persona,
          nombre_persona,
          apellido_paterno_persona,
          apellido_materno_persona,
          email_corporativo,
          email_personal,
          telefono,
          fecha_ingreso,
          id_perfil_usuario,
          activo,
          username,
          password_hash,
          requiere_cambio_password
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;

      const values = [
        userData.rut_persona,
        userData.rut_dv_persona,
        userData.nombre_persona,
        userData.apellido_paterno_persona,
        userData.apellido_materno_persona || null,
        userData.email_corporativo,
        userData.email_personal || userData.email_corporativo,
        userData.telefono || null,
        userData.fecha_ingreso || new Date(),
        userData.id_perfil_usuario,
        userData.activo !== undefined ? userData.activo : true,
        username,
        passwordHash,
        userData.requiere_cambio_password !== undefined ? userData.requiere_cambio_password : true
      ];

      const result = await client.query(insertQuery, values);
      
      await client.query('COMMIT');

      // Obtener usuario completo con información del perfil
      const completeUser = await this.getUserByRut(result.rows[0].rut_persona);

      return {
        success: true,
        message: 'Usuario creado exitosamente',
        data: completeUser.data
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creando usuario:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ✏️ Actualizar usuario existente
  async updateUser(rutPersona, userData) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Verificar que el usuario existe
      const existingUser = await client.query(
        'SELECT * FROM persona WHERE rut_persona = $1',
        [rutPersona]
      );

      if (existingUser.rows.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      // Si se actualiza el username, verificar que no exista
      if (userData.username && userData.username !== existingUser.rows[0].username) {
        const existingUsername = await client.query(
          'SELECT username FROM persona WHERE username = $1 AND rut_persona != $2',
          [userData.username, rutPersona]
        );

        if (existingUsername.rows.length > 0) {
          throw new Error('Ya existe un usuario con este nombre de usuario');
        }
      }

      // Construir query de actualización dinámicamente
      const updateFields = [];
      const values = [];
      let paramCount = 1;

      const allowedFields = [
        'nombre_persona',
        'apellido_paterno_persona', 
        'apellido_materno_persona',
        'email_corporativo',
        'email_personal',
        'telefono',
        'id_perfil_usuario',
        'activo',
        'username'
      ];

      allowedFields.forEach(field => {
        if (userData[field] !== undefined) {
          updateFields.push(`${field} = $${paramCount}`);
          values.push(userData[field]);
          paramCount++;
        }
      });

      if (updateFields.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      // Agregar RUT al final para la cláusula WHERE
      values.push(rutPersona);

      const updateQuery = `
        UPDATE persona 
        SET ${updateFields.join(', ')}
        WHERE rut_persona = $${paramCount}
        RETURNING *
      `;

      const result = await client.query(updateQuery, values);
      
      await client.query('COMMIT');

      // Obtener usuario completo actualizado
      const updatedUser = await this.getUserByRut(rutPersona);

      return {
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: updatedUser.data
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error actualizando usuario:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // 🔐 Establecer contraseña para un usuario
  async setUserPassword(rutPersona, password, requireChange = true) {
    const client = await this.pool.connect();
    try {
      // Verificar que el usuario existe
      const existingUser = await client.query(
        'SELECT rut_persona, nombre_persona, apellido_paterno_persona FROM persona WHERE rut_persona = $1',
        [rutPersona]
      );

      if (existingUser.rows.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      // Hash de la contraseña
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Actualizar contraseña
      const updateQuery = `
        UPDATE persona 
        SET 
          password_hash = $1,
          requiere_cambio_password = $2,
          fecha_ultimo_cambio_password = CURRENT_TIMESTAMP
        WHERE rut_persona = $3
        RETURNING rut_persona, nombre_persona, apellido_paterno_persona
      `;

      const result = await client.query(updateQuery, [passwordHash, requireChange, rutPersona]);

      return {
        success: true,
        message: `Contraseña establecida para ${result.rows[0].nombre_persona} ${result.rows[0].apellido_paterno_persona}`,
        data: result.rows[0]
      };

    } catch (error) {
      console.error('Error estableciendo contraseña:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // 🎲 Generar contraseña temporal automática
  async generateTemporaryPassword(rutPersona) {
    try {
      // Generar contraseña temporal segura
      const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
      let tempPassword = 'GAET';
      for (let i = 0; i < 6; i++) {
        tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // Establecer la contraseña temporal
      await this.setUserPassword(rutPersona, tempPassword, true);

      return {
        success: true,
        temporaryPassword: tempPassword,
        message: 'Contraseña temporal generada exitosamente'
      };

    } catch (error) {
      console.error('Error generando contraseña temporal:', error);
      throw error;
    }
  }

  // 🗑️ Desactivar usuario (no eliminar físicamente)
  async deactivateUser(rutPersona) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `UPDATE persona 
         SET activo = false 
         WHERE rut_persona = $1 
         RETURNING nombre_persona, apellido_paterno_persona`,
        [rutPersona]
      );

      if (result.rows.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      return {
        success: true,
        message: `Usuario ${result.rows[0].nombre_persona} ${result.rows[0].apellido_paterno_persona} desactivado`,
        data: result.rows[0]
      };

    } catch (error) {
      console.error('Error desactivando usuario:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // ✅ Activar usuario
  async activateUser(rutPersona) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `UPDATE persona 
         SET activo = true 
         WHERE rut_persona = $1 
         RETURNING nombre_persona, apellido_paterno_persona`,
        [rutPersona]
      );

      if (result.rows.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      return {
        success: true,
        message: `Usuario ${result.rows[0].nombre_persona} ${result.rows[0].apellido_paterno_persona} activado`,
        data: result.rows[0]
      };

    } catch (error) {
      console.error('Error activando usuario:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // 📊 Obtener estadísticas de usuarios
  async getUserStats() {
    const client = await this.pool.connect();
    try {
      const queries = await Promise.all([
        // Total usuarios
        client.query('SELECT COUNT(*) as total FROM persona'),
        
        // Usuarios activos
        client.query('SELECT COUNT(*) as activos FROM persona WHERE activo = true'),
        
        // Usuarios por perfil
        client.query(`
          SELECT 
            pu.descripcion_perfil_usuario as perfil,
            COUNT(*) as cantidad
          FROM persona p
          JOIN perfil_usuario pu ON p.id_perfil_usuario = pu.id_perfil_usuario
          WHERE p.activo = true
          GROUP BY pu.descripcion_perfil_usuario
        `),
        
        // Usuarios creados este mes
        client.query(`
          SELECT COUNT(*) as nuevos_mes
          FROM persona 
          WHERE DATE_TRUNC('month', fecha_ingreso) = DATE_TRUNC('month', CURRENT_DATE)
        `)
      ]);

      const [totalResult, activosResult, perfilesResult, nuevosMesResult] = queries;

      return {
        success: true,
        data: {
          total: parseInt(totalResult.rows[0].total),
          activos: parseInt(activosResult.rows[0].activos),
          inactivos: parseInt(totalResult.rows[0].total) - parseInt(activosResult.rows[0].activos),
          nuevos_este_mes: parseInt(nuevosMesResult.rows[0].nuevos_mes),
          por_perfil: perfilesResult.rows
        }
      };

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw new Error('Error al obtener estadísticas de usuarios');
    } finally {
      client.release();
    }
  }

  // 🛠️ Métodos auxiliares
  generateUsername(nombre, apellido) {
    // Generar username en formato nombre.apellido
    const nombreClean = nombre.toLowerCase().trim().replace(/\s+/g, '');
    const apellidoClean = apellido.toLowerCase().trim().replace(/\s+/g, '');
    return `${nombreClean}.${apellidoClean}`;
  }

  // 🧹 Cerrar conexiones
  async close() {
    await this.pool.end();
  }
}

module.exports = AdminService;