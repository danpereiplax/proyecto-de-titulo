import express from 'express';
import dotenv from 'dotenv';
import basicas from './routes/basicas.js';
import complejas from './routes/complejas.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/basicas', basicas);
app.use('/api/complejas', complejas);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${process.env.PROTOCOLO}://localhost:${PORT}`);
});
