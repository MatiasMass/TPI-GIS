// index.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import endpointsRouter from './src/routes/endpoints.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas
app.use('/', endpointsRouter);

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
