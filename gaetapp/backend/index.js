import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pool from './db.js';
import tareaRoutes from './routes/tarea.routes.js';

// Configuración inicial
dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api', tareaRoutes);

// Función de verificación de conexión
async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Conexión a PostgreSQL establecida:', res.rows[0].now);
    return true;
  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err);
    return false;
  }
}

// Iniciar servidor solo si la conexión a DB es exitosa
async function startServer() {
  const dbConnected = await testConnection();
  
  if (dbConnected) {
    app.get('/', (req, res) => {
      res.send('Backend GAET funcionando');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    });
  } else {
    console.error('No se pudo iniciar el servidor debido a problemas con la base de datos');
    process.exit(1);
  }
}

// Iniciar la aplicación
startServer();