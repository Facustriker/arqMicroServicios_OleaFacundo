import { Router } from 'express';
import { LikeController } from '../controllers/LikeController';
import { LikeService } from '../../domain/services/LikeService';
import { LikeRepository } from '../../infrastructure/repositories/LikeRepository';
import { ResenaRepository } from '../../infrastructure/repositories/ResenaRepository';

const router = Router();

// Instanciar dependencias
const likeRepository = new LikeRepository();
const resenaRepository = new ResenaRepository();
const likeService = new LikeService(likeRepository, resenaRepository);
const likeController = new LikeController(likeService);

// Rutas
router.post('/dar', (req, res) => likeController.darLike(req, res));
router.delete('/quitar', (req, res) => likeController.quitarLike(req, res));
router.get('/resena/:resenaID', (req, res) => likeController.consultarLikes(req, res));

export default router;