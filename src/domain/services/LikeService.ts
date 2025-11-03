import { ILikeRepository } from '../repositories/ILikeRepository';
import { IResenaRepository } from '../repositories/IResenaRepository';
import { Like } from '../entities/Like';
import { ResenaNoEncontradaError } from '../errors/CustomErrors';

export class LikeService {
  constructor(
    private likeRepository: ILikeRepository,
    private resenaRepository: IResenaRepository
  ) {}

  async darLike(resenaID: number, usuarioID: string): Promise<void> { 
    const resena = await this.resenaRepository.findById(resenaID);
    
    if (!resena) {
      throw new ResenaNoEncontradaError(resenaID);
    }

    const likeExistente = await this.likeRepository.findByUsuarioAndResena(usuarioID, resenaID);
    
    if (likeExistente) {
      throw new Error('Este usuario ya dio like a esta reseña');
    }
    
    const like = Like.crear(usuarioID, resenaID);
    await this.likeRepository.save(like);
    
    resena.darLike(usuarioID);
    await this.resenaRepository.save(resena);
  }

  async quitarLike(resenaID: number, usuarioID: string): Promise<void> { 
    const resena = await this.resenaRepository.findById(resenaID);
    
    if (!resena) {
      throw new ResenaNoEncontradaError(resenaID);
    }

    const like = await this.likeRepository.findByUsuarioAndResena(usuarioID, resenaID);
    
    if (!like) {
      throw new Error('Este usuario no ha dado like a esta reseña');
    }

    resena.quitarLike(usuarioID);
    await this.likeRepository.delete(like.getLikeID()!);
    await this.resenaRepository.save(resena);
  }

  async consultarLikes(resenaID: number): Promise<any> {
  const resena = await this.resenaRepository.findById(resenaID);
  
  if (!resena) {
    throw new ResenaNoEncontradaError(resenaID);
  }

  const likesArray = resena.getLikesArray().map(like => ({
    likeID: like.getLikeID(),
    usuarioID: like.getUsuarioID()
  }));

  return {
    resenaID: resena.getResenaID(),
    likes: resena.getLikes(),
    likesArray
  };
}
}