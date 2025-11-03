import { Request, Response, NextFunction } from 'express';
import { AuthService } from './AuthService';

const authService = new AuthService();

declare global {
  namespace Express {
    interface Request {
      userData?: {
        id: string;
        name: string;
        login: string;
        permissions: string[];
        enabled: boolean;
      };
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'No se proporcionó token de autenticación' 
      });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ 
        error: 'Formato de token inválido. Use: Bearer <token>' 
      });
    }

    const token = parts[1];

    const userData = await authService.validateToken(token);

    if (!userData.enabled) {
      return res.status(401).json({ 
        error: 'Usuario deshabilitado' 
      });
    }

    req.userData = userData;

    next();

  } catch (error: any) {
    console.error('Error en authMiddleware:', error);
    return res.status(401).json({ 
      error: error.message || 'Token inválido o expirado' 
    });
  }
}