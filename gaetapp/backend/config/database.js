// backend/config/database.js
const { Pool } = require('pg');

// Crear pool de conexiones reutilizable
const pool = new Pool({
  user: process.env.DB_USER || 'gaet',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gaet_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  // Configuraciones adicionales del pool
  max: 20,                // Máximo 20 conexiones simultáneas
  idleTimeoutMillis: 30000, // Cerrar conexiones inactivas después de 30s
  connectionTimeoutMillis: 2000, // Timeout para obtener conexión
});

// Event listeners para debugging
pool.on('connect', (client) => {
  console.log('✅ Nueva conexión a PostgreSQL establecida');
});

pool.on('error', (err, client) => {
  console.error('❌ Error inesperado en cliente PostgreSQL:', err);
});

pool.on('remove', (client) => {
  console.log('🔌 Conexión a PostgreSQL removida');
});

// Función para verificar la conexión
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Test de conexión exitoso:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Error en test de conexión:', error.message);
    return false;
  }
}

// Función de graceful shutdown
async function closePool() {
  try {
    await pool.end();
    console.log('✅ Pool de conexiones cerrado correctamente');
  } catch (error) {
    console.error('❌ Error cerrando pool:', error);
  }
}

module.exports = {
  pool,
  testConnection,
  closePool
};