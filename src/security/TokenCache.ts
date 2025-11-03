import { UserData } from './TokenPayload';

interface CacheEntry {
  userData: UserData;
  timestamp: number;
}

export class TokenCache {
  private cache: Map<string, CacheEntry>;
  private ttl: number; // Tiempo de vida en milisegundos

  constructor(ttlMinutes: number = 30) {
    this.cache = new Map();
    this.ttl = ttlMinutes * 60 * 1000; // Convertir a ms
    
    // Limpiar caché expirado cada 5 minutos
    setInterval(() => this.cleanExpired(), 5 * 60 * 1000);
  }

  set(token: string, userData: UserData): void {
    this.cache.set(token, {
      userData,
      timestamp: Date.now()
    });
  }

  get(token: string): UserData | null {
    const entry = this.cache.get(token);
    
    if (!entry) {
      return null;
    }

    // Verificar si expiró
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(token);
      return null;
    }

    return entry.userData;
  }

  remove(token: string): void {
    this.cache.delete(token);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanExpired(): void {
    const now = Date.now();
    for (const [token, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(token);
      }
    }
  }

  // Para debugging
  size(): number {
    return this.cache.size;
  }
}