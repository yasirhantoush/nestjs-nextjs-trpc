import { doSuccesss, doValidate, getTopicName } from '@server/lib/helpers';
import { EntityManager } from 'typeorm';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsString } from 'class-validator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MODULE_NAME } from '../constants';
import { UserProfile } from '../entities/userProfile.entity';
import { giveMeClassLogger } from '@server/lib/winston.logger';
import { JWTGuard, Roles } from '@server/lib/guards/jwt.guard';
import { User } from '../entities/user.entity';

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

export class AdminUserFindAllQueryDTO {
    @IsString()
    userId: string;
}

@ApiTags(MODULE_NAME)
@ApiBearerAuth()
@Controller(`api/${MODULE_NAME}/queries`)
@UseGuards(JWTGuard)
@Roles('ADMIN')
export class AdminUserFindAllQuery {
    constructor(
        private readonly manager: EntityManager
    ) { }

    async execute(dto: AdminUserFindAllQueryDTO) {
        await doValidate(AdminUserFindAllQueryDTO, dto)
        const users = await this.manager.find(User, {
            relations: { profile: true },
            where: { }
        })

        return doSuccesss({ users })
    }

    @Post(topic)
    handler(@Body() dto: AdminUserFindAllQueryDTO) {
        return this.execute(dto);
    }
}
