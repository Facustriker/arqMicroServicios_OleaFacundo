import { Request, Response } from 'express';
import { ResenaService } from '../../domain/services/ResenaService';
import { ResenaYaExisteError } from '../../domain/errors/CustomErrors';
import { LikeService } from '../../domain/services/LikeService';

export class ResenaController {
  constructor(
    private resenaService: ResenaService, 
    private likeService: LikeService
  ) {}

  // POST /api/resenas/crear-vacia
  async crearResenaVacia(req: Request, res: Response) {
    try {
      const { productoID } = req.body;
      
      const usuarioID = req.userData?.id;
      if (!usuarioID) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }
      
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

  // PUT /api/resenas/:id
  async completarResena(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: 'ID de reseña requerido' });
      }
      
      const resenaID = parseInt(id);
      const { texto, rating } = req.body;
      
      const usuarioAutenticado = req.userData?.id;
      if (!usuarioAutenticado) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }
      
      const resena = await this.resenaService.completarResena(resenaID, texto, rating);
      
      // Validar que la reseña pertenece al usuario
      if (resena.getUsuarioID() !== usuarioAutenticado) {
        return res.status(403).json({ 
          error: 'No tenés permiso para modificar esta reseña' 
        });
      }
      
      res.status(200).json({
        message: 'Reseña completada exitosamente',
        data: resena
      });
    } catch (error: any) {
      console.error('ERROR COMPLETO:', error);
      res.status(400).json({ 
        error: error.message
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
      
      const usuarioID = req.userData?.id;
      
      const resenas = await this.resenaService.obtenerResenasPorProducto(
        productoID,
        usuarioID // Puede ser undefined si no está autenticado
      );
      
      res.status(200).json({
        data: resenas
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/resenas/pendientes
  async obtenerResenasPendientes(req: Request, res: Response) {
    try {
      const usuarioID = req.userData?.id;
      if (!usuarioID) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
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

  // POST /api/resenas/:id/like
  async darLike(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: 'ID de reseña requerido' });
      }
      
      const resenaID = parseInt(id);
    
      const usuarioID = req.userData?.id;
      if (!usuarioID) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }
      
      await this.likeService.darLike(resenaID, usuarioID);
      
      res.status(200).json({
        message: 'Like agregado exitosamente'
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/resenas/:id/dislike
  async quitarLike(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: 'ID de reseña requerido' });
      }
      
      const resenaID = parseInt(id);
    
      const usuarioID = req.userData?.id;
      if (!usuarioID) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }
      
      await this.likeService.quitarLike(resenaID, usuarioID);
      
      res.status(200).json({
        message: 'Like eliminado exitosamente'
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/resenas/:id/consultarLikes
  async consultarLikes(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID de reseña requerido' });
    }
    
    const resenaID = parseInt(id);
    
    const result = await this.likeService.consultarLikes(resenaID);
    
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
}