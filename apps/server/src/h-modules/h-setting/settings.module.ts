import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { commands } from './commands/_index';
import { queries } from './queries/_index';
import { entities } from './entities/_index';

@Module({
  imports: [
    TypeOrmModule.forFeature(entities)
  ],
  providers: [],
  exports: [],
  controllers: [...commands, ...queries],
})
export class SettingModule {
}
