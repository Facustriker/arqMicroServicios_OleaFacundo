import { AppDataSource } from '../../tools/db';
import { ResenaSchema } from '../schemas/ResenaSchema';
import { Resena } from '../../domain/entities/Resena';
import { IResenaRepository } from '../../domain/repositories/IResenaRepository';
import { Like } from '../../domain/entities/Like';

export class ResenaRepository implements IResenaRepository {

  private repository = AppDataSource.getRepository(ResenaSchema);

  async save(resena: Resena): Promise<Resena> {
    const schema = new ResenaSchema();
    //Actualiza el ID para evitar crear duplicados
    const resenaID = resena.getResenaID();
    if (resenaID !== undefined) {
      schema.resenaID = resenaID;
    }
    schema.usuarioID = resena.getUsuarioID();
    schema.productoID = resena.getProductoID();
    schema.resena = resena.getResena() || ''; 
    schema.rating = resena.getRating();
    schema.fhCreacion = resena.getFhCreacion();
    const fhResena = resena.getFhResena();
    if (fhResena !== undefined) {
    schema.fhResena = fhResena;
    }
    schema.estadoResena = resena.getEstadoResena();
    schema.likes = resena.getLikes();

    const saved = await this.repository.save(schema);
    
    return this.toDomain(saved);
  }

  async findById(id: number): Promise<Resena | null> {
    const schema = await this.repository.findOne({ 
      where: { resenaID: id },
      relations: ['likesArray']
    });
    
    if (!schema) return null;
    
    return this.toDomain(schema);
  }

  async findByUsuarioAndProducto(usuarioID: number, productoID: number): Promise<Resena | null> {
    const schema = await this.repository.findOne({
      where: { usuarioID, productoID }
    });
    
    if (!schema) return null;
    return this.toDomain(schema);
  }

  async findByProducto(productoID: number): Promise<Resena[]> {
    const schemas = await this.repository.find({
      where: { productoID },
      relations: ['likesArray'],
      order: { likes: 'DESC' }
    });
    
    return schemas.map(s => this.toDomain(s));
  }

  async findResenasPendientesByUsuario(usuarioID: number): Promise<Resena[]> {
    const schemas = await this.repository.find({
      where: { usuarioID, estadoResena: 'Vacia' },
      order: { fhCreacion: 'ASC' }
    });
    
    return schemas.map(s => this.toDomain(s));
  }

  private toDomain(schema: ResenaSchema): Resena {
  
  const resena = Object.create(Resena.prototype);  // Crea instancia sin constructor
  
  resena['resenaID'] = schema.resenaID;
  resena['usuarioID'] = schema.usuarioID;
  resena['productoID'] = schema.productoID;
  resena['resena'] = schema.resena;
  resena['rating'] = schema.rating;
  resena['fhCreacion'] = schema.fhCreacion; 
  resena['fhResena'] = schema.fhResena;     
  resena['estadoResena'] = schema.estadoResena;
  resena['likes'] = schema.likes;
  resena['likesArray'] = [];
  
  if (schema.likesArray && schema.likesArray.length > 0) {
    schema.likesArray.forEach(likeSchema => {
      const like = Like.crear(likeSchema.usuarioID, likeSchema.resenaID);
      like.setLikeID(likeSchema.likeID);
      resena.likesArray.push(like);
    });
  }
  
  return resena;
}

}