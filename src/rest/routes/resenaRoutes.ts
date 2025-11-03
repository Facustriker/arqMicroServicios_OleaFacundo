import { Router } from 'express';
import { ResenaController } from '../controllers/ResenaController';
import { ResenaService } from '../../domain/services/ResenaService';
import { LikeService } from '../../domain/services/LikeService';
import { LikeRepository } from '../../infrastructure/repositories/LikeRepository';
import { ResenaRepository } from '../../infrastructure/repositories/ResenaRepository';
import { authMiddleware } from '../../security/authMiddleware';
import { optionalAuthMiddleware } from '../../security/optionalAuthMiddleware';

const router = Router();

const resenaRepository = new ResenaRepository();
const likeRepository = new LikeRepository();

const resenaService = new ResenaService(resenaRepository);
const likeService = new LikeService(likeRepository, resenaRepository);

const resenaController = new ResenaController(resenaService, likeService);

// PUBLICAS
router.get('/producto/:productoID', optionalAuthMiddleware, (req, res) => 
  resenaController.obtenerResenasPorProducto(req, res)
);

router.get('/:id/consultarLikes', (req, res) => 
  resenaController.consultarLikes(req, res)
);

// PRIVADAS
router.post('/crear-vacia', authMiddleware, (req, res) => 
  resenaController.crearResenaVacia(req, res)
);

router.put('/:id', authMiddleware, (req, res) => 
  resenaController.completarResena(req, res)
);

router.get('/pendientes', authMiddleware, (req, res) => 
  resenaController.obtenerResenasPendientes(req, res)
);

router.post('/:id/like', authMiddleware, (req, res) => 
  resenaController.darLike(req, res)
);

router.delete('/:id/dislike', authMiddleware, (req, res) => 
  resenaController.quitarLike(req, res)
);

export default router;