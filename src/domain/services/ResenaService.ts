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

  async obtenerResenasPorProducto(productoID: string, usuarioID?: string): Promise<any[]> {
    const resenas = await this.resenaRepository.findByProducto(productoID);
    
    //BORRAR
    console.log(`\n📋 obtenerResenasPorProducto(${productoID})`);
  console.log(`   Reseñas recibidas: ${resenas.length}`);
  console.log(`   Usuario autenticado: ${usuarioID || 'NO AUTENTICADO'}`);
  console.log(`   Tipo de usuarioID: ${typeof usuarioID}`);
    
    return resenas.map(resena => {
      //BORRAR
      const likesArray = resena.getLikesArray();
    
    console.log(`\n   ➡️ Procesando reseña ${resena.getResenaID()}`);
    console.log(`      likesArray.length: ${likesArray.length}`);
    
    if (likesArray.length > 0) {
      console.log(`      Likes en el array:`);
      likesArray.forEach((like, idx) => {
        const likeUserID = like.getUsuarioID();
        console.log(`         ${idx + 1}. Usuario: "${likeUserID}" (tipo: ${typeof likeUserID})`);
      });
    }






      const userLiked = usuarioID 
      ? likesArray.some(like => {
          const likeUserID = like.getUsuarioID();
          const match = likeUserID === usuarioID;
          console.log(`DEBUG: Comparando: "${likeUserID}" === "${usuarioID}" → ${match}`);
          return match;
        })
      : false;
      
      return {
        resenaID: resena.getResenaID(),
        usuarioID: resena.getUsuarioID(),
        productoID: resena.getProductoID(),
        resena: resena.getResena(),
        rating: resena.getRating(),
        fhCreacion: resena.getFhCreacion(),
        fhResena: resena.getFhResena(),
        estadoResena: resena.getEstadoResena(),
        likes: resena.getLikes(),
        userLiked
      };
    });
  }

  async obtenerResenasPendientes(usuarioID: string): Promise<any[]> {
    const resenasPendientes = await this.resenaRepository.findResenasPendientesByUsuario(usuarioID);
    return resenasPendientes.map(resena => ({
    resenaID: resena.getResenaID(),
    usuarioID: resena.getUsuarioID(),
    productoID: resena.getProductoID(),
    resena: resena.getResena(),
    rating: resena.getRating(),
    fhCreacion: resena.getFhCreacion(),
    fhResena: resena.getFhResena(),
    estadoResena: resena.getEstadoResena(),
    likes: resena.getLikes()
  }));
  }
}