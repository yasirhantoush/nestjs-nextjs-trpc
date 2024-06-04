import { doSuccesss, doValidate, getTopicName } from '@server/lib/helpers';
import { EntityManager } from 'typeorm';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsString } from 'class-validator';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { MODULE_NAME } from '../constants';
import { UserProfile } from '../entities/userProfile.entity';
import { giveMeClassLogger } from '@server/lib/winston.logger';
import { JWTGuard, Roles } from '@server/lib/guards/jwt.guard';
import { User } from '../entities/user.entity';

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

export class AdminUserFindByIdQueryDTO {
    @IsString()
    @ApiProperty()
    targetUserId: string;

    @IsString()
    userId: string;
}

@ApiTags(MODULE_NAME)
@ApiBearerAuth()
@Controller(`api/${MODULE_NAME}/queries`)
@UseGuards(JWTGuard)
@Roles('ADMIN')
export class AdminUserFindByIdQuery {
    constructor(
        private readonly manager: EntityManager
    ) { }

    async execute(dto: AdminUserFindByIdQueryDTO) {
        await doValidate(AdminUserFindByIdQueryDTO, dto)
        const user = await this.manager.findOneOrFail(User, {
            relations: { profile: true },
            where: { id: dto.targetUserId }
        })
        user.profile.password = undefined as any;
        return doSuccesss({ user })
    }

    @Post(topic)
    handler(@Body() dto: AdminUserFindByIdQueryDTO) {
        return this.execute(dto);
    }
}
