import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities/_index';
import { commands } from './commands/_index';
import { queries } from './queries/_index';
import { services } from './services/_index';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...queries, ...services],
  exports: [...services],
  controllers: [
    ...commands,
    ...queries
  ],
})
export class LabelModule {
}
