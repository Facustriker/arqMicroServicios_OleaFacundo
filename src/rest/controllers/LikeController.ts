import { Request, Response } from 'express';
import { LikeService } from '../../domain/services/LikeService';

export class LikeController {
  constructor(private likeService: LikeService) {}

  // POST /api/likes/dar
  async darLike(req: Request, res: Response) {
    try {
      const { resenaID, usuarioID } = req.body;

      const usuarioIDStr = String(usuarioID);
      
      await this.likeService.darLike(resenaID, usuarioIDStr);
      
      res.status(200).json({
        message: 'Like agregado exitosamente'
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/likes/quitar
  async quitarLike(req: Request, res: Response) {
    try {
      const { resenaID, usuarioID } = req.body;

      const usuarioIDStr = String(usuarioID);
      
      await this.likeService.quitarLike(resenaID, usuarioIDStr);
      
      res.status(200).json({
        message: 'Like eliminado exitosamente'
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/likes/resena/:resenaID
  async consultarLikes(req: Request, res: Response) {
    try {
      const resenaIDParam = req.params.resenaID;
      if (!resenaIDParam) {
        return res.status(400).json({ error: 'ID de reseña requerido' });
      }
      
      const resenaID = parseInt(resenaIDParam);
      
      const likes = await this.likeService.consultarLikes(resenaID);
      
      res.status(200).json({
        resenaID,
        likes
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}