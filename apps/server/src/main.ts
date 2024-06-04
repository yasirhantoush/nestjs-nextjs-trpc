import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrpcRouter } from '@server/trpc/trpc.router';
import { giveMeClassLogger } from './lib/winston.logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SERVICE_HOST, SERVICE_NAME, SERVICE_PORT, SERVICE_TITLE } from './lib/constants';
import { version } from './lib/version';

const logger = giveMeClassLogger('main')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  const trpc = app.get(TrpcRouter);
  trpc.applyMiddleware(app);

  
  // swagger
  const config = new DocumentBuilder()
    .setTitle(SERVICE_NAME)
    .setDescription(SERVICE_TITLE)
    .setVersion(version)
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(SERVICE_PORT, SERVICE_HOST);
  logger.info(`${SERVICE_NAME} started on port ${SERVICE_HOST}:${SERVICE_PORT} on environment ${process.env.NODE_ENV}`);

}
bootstrap();
