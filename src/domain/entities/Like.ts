export class Like {
  private likeID?: number;
  private usuarioID: string;
  private resenaID: number;

  private constructor(usuarioID: string, resenaID: number) {
    this.usuarioID = usuarioID;
    this.resenaID = resenaID;
  }

  static crear(usuarioID: string, resenaID: number): Like {
    return new Like(usuarioID, resenaID);
  }

  getLikeID(): number | undefined {
    return this.likeID;
  }

  getUsuarioID(): string {
    return this.usuarioID;
  }

  getResenaID(): number {
    return this.resenaID;
  }

  setLikeID(id: number): void {
    this.likeID = id;
  }
}