import { Request, Response } from 'express';
import { ResenaService } from '../../domain/services/ResenaService';
import { ResenaYaExisteError } from '../../domain/errors/CustomErrors';

export class ResenaController {
  constructor(private resenaService: ResenaService) {}

  // POST /api/resenas/crear-vacia
  async crearResenaVacia(req: Request, res: Response) {
    try {
      const { usuarioID, productoID } = req.body;
      
      const resena = await this.resenaService.crearResenaVacia(usuarioID, productoID);
      
      res.status(201).json({
        message: 'Reseña vacía creada exitosamente',
        data: resena
      });
    } catch (error: any) {
      if (error instanceof ResenaYaExisteError) {
        return res.status(200).json({
          message: error.message,
          alreadyExists: true
        });
      }
      
      console.error('ERROR REAL:', error);
      res.status(500).json({ 
        error: error.message || 'Error interno del servidor'
      });
    }
  }

  // PUT /api/resenas/:id/completar
  async completarResena(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: 'ID de reseña requerido' });
      }
      
      const resenaID = parseInt(id);
      const { texto, rating } = req.body;
      
      const resena = await this.resenaService.completarResena(resenaID, texto, rating);
      
      res.status(200).json({
        message: 'Reseña completada exitosamente',
        data: resena
      });
    } catch (error: any) {
      console.error('ERROR COMPLETO:', error);
      res.status(400).json({ 
        error: error.message,
        stack: error.stack
      });
    }
  }

  // GET /api/resenas/producto/:productoID
  async obtenerResenasPorProducto(req: Request, res: Response) {
    try {
      const productoID = req.params.productoID; 
      if (!productoID) {
        return res.status(400).json({ error: 'ID de producto requerido' });
      }
      
      const resenas = await this.resenaService.obtenerResenasPorProducto(productoID);
      
      res.status(200).json({
        data: resenas
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/resenas/pendientes/:usuarioID
  async obtenerResenasPendientes(req: Request, res: Response) {
    try {
      const usuarioID = req.params.usuarioID; 
      if (!usuarioID) {
        return res.status(400).json({ error: 'ID de usuario requerido' });
      }
      
      const resenas = await this.resenaService.obtenerResenasPendientes(usuarioID);
      
      res.status(200).json({
        data: resenas,
        cantidad: resenas.length
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}