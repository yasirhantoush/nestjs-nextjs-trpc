import { Module } from '@nestjs/common';
import { commands } from './commands/_index';
import { queries } from './queries/_index';

@Module({
    controllers: [
        ...commands,
        ...queries,
    ]
})
export class UserModule {}
