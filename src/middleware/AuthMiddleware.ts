import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthMiddleware {
  // Validate JWT token
  static async validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: number };
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        res.status(401).json({ error: 'Invalid token.' });
        return
      }

      // Attach the user to the request object
      (req as any).user = user;
      next(); // Pass control to the next middleware or route handler
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  }
}