import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, SERVICE_NAME } from '../constants';
import { JWTPayload } from '../interfaces/jwt-payload.dto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const authHeader: string = req.body.authorization || req.headers?.authorization || req.query.authorization || '';
        const token = authHeader.replace('Bearer ', '');

        if (token == '') {
            next()
            return;
        }

        let jwtPayload: JWTPayload | null = null;

        try {
            jwtPayload = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET, { algorithms: ['HS256'], audience: SERVICE_NAME, issuer: SERVICE_NAME }) as JWTPayload;
        } catch (err) {

        }

        if (!jwtPayload) {
            next()
            return;
        }

        (req as any).user = jwtPayload;
        req.body.userId = jwtPayload.userId;
        next();
    }
}
