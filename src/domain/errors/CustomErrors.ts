export class ResenaYaExisteError extends Error {
  constructor(usuarioID: string, productoID: string) {  
    super(`Ya existe una reseña para usuario ${usuarioID} y producto ${productoID}`);
    this.name = 'ResenaYaExisteError';
  }
}

export class ResenaNoEncontradaError extends Error {
  constructor(resenaID: number) {
    super(`Reseña con ID ${resenaID} no encontrada`);
    this.name = 'ResenaNoEncontradaError';
  }
}