import { ConfigModule } from "@nestjs/config";

ConfigModule.forRoot()

export const SERVICE_NAME = 'safarah-backend';
export const SERVICE_PORT = process.env.PORT || process.env.NODE_PORT || 3000;
export const SERVICE_HOST = process.env.NODE_HOST || '0.0.0.0';
export const SERVICE_TITLE = 'safarah-backend';

export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;
export const JWT_ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_TOKEN_EXPIRY as string;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET as string;
export const JWT_REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_TOKEN_EXPIRY as string;

