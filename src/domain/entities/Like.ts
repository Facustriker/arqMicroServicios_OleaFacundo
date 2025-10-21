export class Like {
  private likeID?: number;
  private usuarioID: number;
  private resenaID: number;

  private constructor(usuarioID: number, resenaID: number) {
    this.usuarioID = usuarioID;
    this.resenaID = resenaID;
  }

  // Factory method
  static crear(usuarioID: number, resenaID: number): Like {
    return new Like(usuarioID, resenaID);
  }

  // Getters
  getLikeID(): number | undefined {
    return this.likeID;
  }

  getUsuarioID(): number {
    return this.usuarioID;
  }

  getResenaID(): number {
    return this.resenaID;
  }

  setLikeID(id: number): void {
    this.likeID = id;
  }
}