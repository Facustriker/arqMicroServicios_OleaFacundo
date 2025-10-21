import { IResenaRepository } from '../repositories/IResenaRepository';
import { Like } from '../entities/Like';
import { ILikeRepository } from '../repositories/ILikeRepository';
import { ResenaNoEncontradaError } from '../errors/CustomErrors';

export class LikeService {
  constructor(
    private likeRepository: ILikeRepository,
    private resenaRepository: IResenaRepository
  ) {}

  async darLike(resenaID: number, usuarioID: number): Promise<void> {
    const resena = await this.resenaRepository.findById(resenaID);
    
    if (!resena) {
      throw new ResenaNoEncontradaError(resenaID);
    }

    const likeExistente = await this.likeRepository.findByUsuarioAndResena(usuarioID, resenaID);
    
    if (likeExistente) {
      throw new Error('Este usuario ya dio like a esta reseña');
    }
    
    // Crear el Like
    const like = Like.crear(usuarioID, resenaID);
    await this.likeRepository.save(like);
    
    // Incrementar contador en la reseña
    resena.darLike(usuarioID);  // No valida duplicados, solo incrementa
    await this.resenaRepository.save(resena);
}

  async quitarLike(resenaID: number, usuarioID: number): Promise<void> {
    const resena = await this.resenaRepository.findById(resenaID);
    
    if (!resena) {
        throw new Error('Reseña no encontrada');
    }

    const like = await this.likeRepository.findByUsuarioAndResena(usuarioID, resenaID);
    
    if (!like) {
        throw new Error('Like no encontrado');
    }

    resena.quitarLike(usuarioID);
    
    await this.likeRepository.delete(like.getLikeID()!);
    
    await this.resenaRepository.save(resena);
    }

  async consultarLikes(resenaID: number): Promise<number> {

    const resena = await this.resenaRepository.findById(resenaID);
    
    if (!resena) {
      throw new Error('Reseña no encontrada');
    }

    return resena.getLikes();
  }

}