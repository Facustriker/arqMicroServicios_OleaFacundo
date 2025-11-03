import { AppDataSource } from '../../tools/db';
import { ResenaSchema } from '../schemas/ResenaSchema';
import { Resena } from '../../domain/entities/Resena';
import { IResenaRepository } from '../../domain/repositories/IResenaRepository';
import { Like } from '../../domain/entities/Like';

export class ResenaRepository implements IResenaRepository {

  private repository = AppDataSource.getRepository(ResenaSchema);

  async save(resena: Resena): Promise<Resena> {
    const schema = new ResenaSchema();
    
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

  async findByUsuarioAndProducto(usuarioID: string, productoID: string): Promise<Resena | null> {
    const schema = await this.repository.findOne({
      where: { usuarioID, productoID }
    });
    
    if (!schema) return null;
    return this.toDomain(schema);
  }

  async findByUsuario(usuarioID: string): Promise<Resena[]> {
    const schemas = await this.repository.find({
      where: { usuarioID }
    });
    
    return schemas.map(s => this.toDomain(s));
  }

  async findByProducto(productoID: string): Promise<Resena[]> {
    const schemas = await this.repository.find({
      where: { 
        productoID,
        estadoResena: 'Completa'
      },
      relations: ['likesArray'],
      order: { likes: 'DESC' }
    });


    //DEBUG BORRAR
  console.log(`\n📦 findByProducto(${productoID})`);
  console.log(`   Reseñas encontradas: ${schemas.length}`);
  
  schemas.forEach(s => {
    console.log(`\n   Reseña ID: ${s.resenaID}`);
    console.log(`   Usuario dueño: ${s.usuarioID}`);
    console.log(`   Likes totales: ${s.likes}`);
    console.log(`   likesArray.length: ${s.likesArray?.length || 0}`);
    
    if (s.likesArray && s.likesArray.length > 0) {
      s.likesArray.forEach((like, idx) => {
        console.log(`      Like ${idx + 1}: ID=${like.likeID}, Usuario=${like.usuarioID}`);
      });
    }
  });



    
    return schemas.map(s => this.toDomain(s));
  }

  async findResenasPendientesByUsuario(usuarioID: string): Promise<Resena[]> {
    const schemas = await this.repository.find({
      where: { usuarioID, estadoResena: 'Vacia' },
      order: { fhCreacion: 'ASC' }
    });
    
    return schemas.map(s => this.toDomain(s));
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(schema: ResenaSchema): Resena {
    const resena = Object.create(Resena.prototype);
    
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

    // ⬅️ AGREGAR LOGS
  console.log(`\n   🔄 toDomain() - Reseña ${schema.resenaID}`);
  console.log(`      Schema likesArray: ${schema.likesArray?.length || 0} elementos`);
  
    
    if (schema.likesArray && schema.likesArray.length > 0) {
      schema.likesArray.forEach(likeSchema => {
        //BORRAR LOG
        console.log(`      Reconstruyendo like: ID=${likeSchema.likeID}, Usuario=${likeSchema.usuarioID}`);
        const like = Like.crear(likeSchema.usuarioID, likeSchema.resenaID);
        like.setLikeID(likeSchema.likeID);
        resena['likesArray'].push(like);
      });
    }

    //BORRAR
    console.log(`      Resultado: ${resena['likesArray'].length} likes reconstruidos`);

    
    return resena;
  }
}