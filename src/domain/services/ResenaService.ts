import { IResenaRepository } from '../repositories/IResenaRepository';
import { Resena } from '../entities/Resena';
import { ResenaNoEncontradaError, ResenaYaExisteError } from '../errors/CustomErrors';

export class ResenaService {
  constructor(private resenaRepository: IResenaRepository) {}

  async crearResenaVacia(usuarioID: number, productoID: number): Promise<Resena | null> {

    const existente = await this.resenaRepository.findByUsuarioAndProducto(usuarioID, productoID);
    
    if (existente) {
        throw new ResenaYaExisteError(usuarioID, productoID);
    }
    
    const resena = Resena.crearVacia(usuarioID, productoID);
    
    return await this.resenaRepository.save(resena);
  }

  async completarResena(resenaID: number, texto: string, rating: number): Promise<Resena> {

    const resena = await this.resenaRepository.findById(resenaID);

    if(resena==null){
        throw new ResenaNoEncontradaError(resenaID);
    }

    if (resena.getEstadoResena()=='Completa') {
        throw new Error('Error, la reseña ya esta completa');
    }

    resena.completar(texto, rating);

    const guardada = await this.resenaRepository.save(resena);

    return guardada;
  }

  async obtenerResenasPorProducto(productoID: number): Promise<Resena[]> {
    // El repositorio ya las trae ordenadas por likes (DESC)
    const resenas = await this.resenaRepository.findByProducto(productoID);
    
    return resenas;
  }

  async obtenerResenasPendientes(usuarioID: number): Promise<Resena[]> {
    // El repositorio ya las trae ordenadas por fhCreacion (ASC - más antiguas primero)
    const resenasPendientes = await this.resenaRepository.findResenasPendientesByUsuario(usuarioID);
    
    return resenasPendientes;
  }
  
}