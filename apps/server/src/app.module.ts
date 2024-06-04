import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrpcModule } from '@server/trpc/trpc.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { allEntities } from './all-entities';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',

      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,

      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
      ],
      // entities: [...allEntities],

      synchronize: process.env.DB_SYNC === '1',
      logging: process.env.DB_LOGGING === '1',
    }),
    TrpcModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
