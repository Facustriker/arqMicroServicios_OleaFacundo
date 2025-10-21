import { Like } from "./Like";

export class Resena {
  private resenaID?: number;
  private usuarioID: number;
  private productoID: number;
  private resena?: string;
  private rating: number;
  private fhCreacion: Date;
  private fhResena?: Date;
  private estadoResena: string; // "Vacia" o "Completa"
  private likes: number;
  private likesArray: Like[];

  private constructor(usuarioID: number, productoID: number) {
    this.usuarioID = usuarioID;
    this.productoID = productoID;
    this.rating = 0;
    this.fhCreacion = new Date();
    this.estadoResena = "Vacia";
    this.likes = 0;
    this.likesArray = [];
  }

  static crearVacia(usuarioID: number, productoID: number): Resena {
    return new Resena(usuarioID, productoID);
  }

  completar(texto: string, rating: number): void {
    if (rating < 1 || rating > 5) {
      throw new Error("El rating debe estar entre 1 y 5");
    }
    
    this.resena = texto;
    this.rating = rating;
    this.fhResena = new Date();
    this.estadoResena = "Completa";
  }

  darLike(usuarioID: number): void {
    if (this.estadoResena === "Vacia") {
      throw new Error("No se puede dar like a una reseña vacía");
    }
    
    // Solo incrementar, la validación se hace en el service
    this.likes++;
  }

  quitarLike(usuarioID: number): void {
    const index = this.likesArray.findIndex(like => like.getUsuarioID() === usuarioID);
    if (index === -1) {
      throw new Error("Este usuario no ha dado like a esta reseña");
    }
    
    this.likesArray.splice(index, 1);
    this.likes--;
  }

  isVacia(): boolean {
    return this.estadoResena === "Vacia";
  }

  // Getters

  getResenaID(): number | undefined {
    return this.resenaID;
  }

  getUsuarioID(): number {
    return this.usuarioID;
  }

  getProductoID(): number {
    return this.productoID;
  }

  getResena(): string | undefined {
    return this.resena;
  }

  getRating(): number {
    return this.rating;
  }

  getFhCreacion(): Date {
    return this.fhCreacion;
  }

  getFhResena(): Date | undefined {
    return this.fhResena;
  }

  getEstadoResena(): string {
    return this.estadoResena;
  }

  getLikes(): number {
    return this.likes;
  }

  getLikesArray(): Like[] {
    return this.likesArray;
  }

  setResenaID(id: number): void {
    this.resenaID = id;
  }
}