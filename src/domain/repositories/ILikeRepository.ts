import { Like } from "../entities/Like";

export interface ILikeRepository{
    save(like: Like): Promise<Like>;
    findById(id: number): Promise<Like | null>;
    delete(id: number): Promise<void>;
    findByUsuarioAndResena(usuarioID: number, resenaID: number): Promise<Like | null>;
}