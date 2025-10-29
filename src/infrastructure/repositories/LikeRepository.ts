import { Like } from "../../domain/entities/Like";
import { ILikeRepository } from "../../domain/repositories/ILikeRepository";
import { AppDataSource } from "../../tools/db";
import { LikeSchema } from "../schemas/LikeSchema";

export class LikeRepository implements ILikeRepository {

    private repository = AppDataSource.getRepository(LikeSchema);

    async save(like: Like): Promise<Like> {
        const schema = new LikeSchema();
        
        const idLike = like.getLikeID();
        if (idLike !== undefined) {
          schema.likeID = idLike;
        }
        
        schema.usuarioID = like.getUsuarioID();
        schema.resenaID = like.getResenaID();

        const saved = await this.repository.save(schema);
    
        return this.toDomain(saved);
    }

    async findById(id: number): Promise<Like | null> {
      const schema = await this.repository.findOne({ 
        where: { likeID: id }
      });
      
      if (!schema) return null;
      
      return this.toDomain(schema);
    }

    async findByUsuarioAndResena(usuarioID: string, resenaID: number): Promise<Like | null> {
      const schema = await this.repository.findOne({
        where: { usuarioID, resenaID }
      });
      
      if (!schema) return null;
      
      return this.toDomain(schema);
    }

    async delete(id: number): Promise<void> {
      await this.repository.delete(id);
    }

    private toDomain(schema: LikeSchema): Like {
      const like = Like.crear(schema.usuarioID, schema.resenaID);
      
      const likeID = schema.likeID;
      if (likeID !== undefined) {
        like.setLikeID(likeID);
      }
      
      return like;
    }
}