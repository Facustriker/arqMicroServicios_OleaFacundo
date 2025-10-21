import { Request, Response } from 'express';
import { ResenaService } from '../../domain/services/ResenaService';

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
      res.status(400).json({ error: error.message });
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
        res.status(400).json({ error: error.message });
    }
  }

  // GET /api/resenas/producto/:productoID
  async obtenerResenasPorProducto(req: Request, res: Response) {
    try {
        const productoIDParam = req.params.productoID;
        if (!productoIDParam) {
        return res.status(400).json({ error: 'ID de producto requerido' });
        }
        
        const productoID = parseInt(productoIDParam);
        
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
        const usuarioIDParam = req.params.usuarioID;
        if (!usuarioIDParam) {
        return res.status(400).json({ error: 'ID de usuario requerido' });
        }
        
        const usuarioID = parseInt(usuarioIDParam);
        
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