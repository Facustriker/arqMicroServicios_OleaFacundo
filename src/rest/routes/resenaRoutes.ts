import { Router } from 'express';
import { ResenaController } from '../controllers/ResenaController';
import { ResenaService } from '../../domain/services/ResenaService';
import { ResenaRepository } from '../../infrastructure/repositories/ResenaRepository';

const router = Router();

// Instanciar dependencias
const resenaRepository = new ResenaRepository();
const resenaService = new ResenaService(resenaRepository);
const resenaController = new ResenaController(resenaService);

// Rutas
router.post('/crear-vacia', (req, res) => resenaController.crearResenaVacia(req, res));
router.put('/:id/completar', (req, res) => resenaController.completarResena(req, res));
router.get('/producto/:productoID', (req, res) => resenaController.obtenerResenasPorProducto(req, res));
router.get('/pendientes/:usuarioID', (req, res) => resenaController.obtenerResenasPendientes(req, res));

export default router;