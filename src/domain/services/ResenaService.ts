import { IResenaRepository } from '../repositories/IResenaRepository';
import { Resena } from '../entities/Resena';
import { ResenaYaExisteError } from '../errors/CustomErrors';

export class ResenaService {
  constructor(private resenaRepository: IResenaRepository) {}

  async crearResenaVacia(usuarioID: string, productoID: string): Promise<Resena | null> {  
    const existente = await this.resenaRepository.findByUsuarioAndProducto(usuarioID, productoID);
    
    if (existente) {
      throw new ResenaYaExisteError(usuarioID, productoID);
    }
    
    const resena = Resena.crearVacia(usuarioID, productoID);
    const resenaGuardada = await this.resenaRepository.save(resena);
    
    return resenaGuardada;
  }

  async completarResena(resenaID: number, texto: string, rating: number): Promise<Resena> {
    const resena = await this.resenaRepository.findById(resenaID);

    if (!resena) {
      throw new Error('Error, la reseña seleccionada no existe');
    }

    resena.completar(texto, rating);

    return await this.resenaRepository.save(resena);
  }

  async obtenerResenasPorProducto(productoID: string): Promise<Resena[]> {  
    const resenas = await this.resenaRepository.findByProducto(productoID);
    return resenas;
  }

  async obtenerResenasPendientes(usuarioID: string): Promise<Resena[]> {
    const resenasPendientes = await this.resenaRepository.findResenasPendientesByUsuario(usuarioID);
    return resenasPendientes;
  }
}