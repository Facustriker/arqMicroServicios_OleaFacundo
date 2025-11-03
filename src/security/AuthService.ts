import { AuthClient } from './AuthClient';
import { TokenCache } from './TokenCache';
import { UserData } from './TokenPayload';

export class AuthService {
  private authClient: AuthClient;
  private tokenCache: TokenCache;

  constructor() {
    this.authClient = new AuthClient();
    this.tokenCache = new TokenCache(30); // Caché por 30 minutos
  }

  async validateToken(token: string|undefined): Promise<UserData> {
    if(token==undefined){
        throw Error("El token es undefined");
    }
    //Lo busca en caché
    const cachedUser = this.tokenCache.get(token);
    if (cachedUser) {
      console.log('Token encontrado en caché');
      return cachedUser;
    }

    //No está en caché, validar con Auth
    console.log('Token no está en caché, validando con Auth...');
    const userData = await this.authClient.validateToken(token);

    //Guardar en caché
    this.tokenCache.set(token, userData);
    console.log('Token validado y guardado en caché');

    return userData;
  }

  invalidateToken(token: string): void {
    this.tokenCache.remove(token);
  }

  clearCache(): void {
    this.tokenCache.clear();
  }
}