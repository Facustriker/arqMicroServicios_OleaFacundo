import express from 'express';
import { env } from '../tools/env';

export async function startRestServer() {
  const app = express();
  
  // Middlewares
  app.use(express.json());
  
  // Rutas (las vamos a agregar después)
  // app.use('/api/resenas', resenasRouter);
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  app.listen(env.port, () => {
    console.log(`Servidor REST corriendo en puerto ${env.port}`);
  });
}