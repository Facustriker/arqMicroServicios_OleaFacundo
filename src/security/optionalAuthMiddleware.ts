import { Request, Response, NextFunction } from 'express';
import { AuthService } from './AuthService';

const authService = new AuthService();

export async function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log('Usuario: ANÓNIMO (sin token)');
      delete req.userData;
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.log('Usuario: ANÓNIMO (formato de token inválido)');
      delete req.userData;
      return next();
    }

    const token = parts[1];

    const userData = await authService.validateToken(token);

    if (!userData.enabled) {
      console.log('Usuario: ANÓNIMO (usuario deshabilitado)');
      delete req.userData;
      return next();
    }

    req.userData = userData;
    console.log(`Usuario: ${userData.name} (${userData.id})`);
    
    next();

  } catch (error: any) {
    console.log('Usuario: ANÓNIMO (error validando token)');
    delete req.userData;
    next();
  }
}