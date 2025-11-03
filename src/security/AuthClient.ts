import { UserData } from './TokenPayload';

export class AuthClient {
  private authServiceUrl: string;

  constructor() {
    // URL del microservicio de Auth
    this.authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://prod-auth-go:3000';
  }

  async validateToken(token: string): Promise<UserData> {
    try {
      const response = await fetch(`${this.authServiceUrl}/users/current`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token inválido o expirado');
        }
        throw new Error(`Error validando token: ${response.status}`);
      }

      const userData: UserData = await response.json();
      return userData;
    } catch (error: any) {
      console.error('Error llamando al servicio de Auth:', error);
      throw new Error('No se pudo validar el token');
    }
  }
}