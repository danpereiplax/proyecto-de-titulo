import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD), // ¡Fuerza a string!
  port: Number(process.env.DB_PORT),
});
console.log('👉 DB_USER:', process.env.DB_USER);
console.log('👉 DB_PASSWORD:', process.env.DB_PASSWORD);
export default pool;