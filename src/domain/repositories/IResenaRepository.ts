import { Resena } from '../entities/Resena';

export interface IResenaRepository {
  save(resena: Resena): Promise<Resena>;
  findById(id: number): Promise<Resena | null>;
  findByUsuarioAndProducto(usuarioID: number, productoID: number): Promise<Resena | null>;
  findByProducto(productoID: number): Promise<Resena[]>;
  findResenasPendientesByUsuario(usuarioID: number): Promise<Resena[]>;
  
}