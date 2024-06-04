import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities/_index';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [],
  exports: [],
  controllers: [],
})
export class HSerialModule {
}
