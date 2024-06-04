import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';;
import { Reflector } from '@nestjs/core';
import { doFail } from '../helpers';
import { JWTPayload } from '../interfaces/jwt-payload.dto';
import { verifyAccessToken } from '../jwt';

/*
    Roles decorator
    ==============
    useage example:

    @Post()
    @Roles('admin')
    async create(@Body() createCatDto: CreateCatDto) {
        this.catsService.create(createCatDto);
    }
*/
export const Roles = (...roles: string[]) => {
    return SetMetadata('roles', roles)
  };
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user : JWTPayload = request.user as JWTPayload; 
      return user && Array.isArray(user.roles) && roles.every((role) => user.roles.includes(role))
    }
  }
  

@Injectable()
export class JWTGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader: string = req.body.authorization || req.headers?.authorization || req.query.authorization || '';
        const token = authHeader.replace('Bearer ', '').trim();

        if (token == '') {
            throw doFail('No JWT Token', 'NO_JWT_ERROR')
        }

        const jwtPayload = verifyAccessToken(token);

        if (!jwtPayload) {
            throw doFail('Could not get JWT Payload', 'NO_JWT_ERROR')
        }

        return true;
    }
}