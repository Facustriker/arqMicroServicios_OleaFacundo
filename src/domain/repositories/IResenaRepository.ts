import { Resena } from '../entities/Resena';

export interface IResenaRepository {
  save(resena: Resena): Promise<Resena>;
  findById(id: number): Promise<Resena | null>;
  findByUsuarioAndProducto(usuarioID: string, productoID: string): Promise<Resena | null>;
  findByUsuario(usuarioID: string): Promise<Resena[]>;
  findByProducto(productoID: string): Promise<Resena[]>;
  findResenasPendientesByUsuario(usuarioID: string): Promise<Resena[]>;
  delete(id: number): Promise<void>;
}