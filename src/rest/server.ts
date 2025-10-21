import express from 'express';
import { env } from '../tools/env';
import resenaRoutes from './routes/resenaRoutes';
import likeRoutes from './routes/likeRoutes';

export async function startRestServer() {
  const app = express();
  
  // Middlewares
  app.use(express.json());
  
  // Rutas
  app.use('/api/resenas', resenaRoutes);
  app.use('/api/likes', likeRoutes);
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  app.listen(env.port, () => {
    console.log(`Servidor REST corriendo en puerto ${env.port}`);
  });
}