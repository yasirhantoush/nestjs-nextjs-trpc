import { doSuccesss, doValidate, getTopicName } from '@server/lib/helpers';
import { EntityManager } from 'typeorm';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsString } from 'class-validator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MODULE_NAME } from '../constants';
import { UserProfile } from '../entities/userProfile.entity';
import { giveMeClassLogger } from '@server/lib/winston.logger';
import { JWTGuard } from '@server/lib/guards/jwt.guard';

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

export class UserGetProfileQueryDTO {
    @IsString()
    userId: string;
}

@ApiTags(MODULE_NAME)
@ApiBearerAuth()
@Controller(`api/${MODULE_NAME}/queries`)
@UseGuards(JWTGuard)
export class UserGetProfileQuery {
    constructor(
        private readonly manager: EntityManager
    ) { }

    async execute(dto: UserGetProfileQueryDTO) {
        await doValidate(UserGetProfileQueryDTO, dto)
        const profile = await this.manager.findOne(UserProfile, { relations: { user: true }, where: { id: dto.userId } })
        return doSuccesss({ 
            firstName: profile?.user.firstName,
            lastName: profile?.user.lastName,
            isAdmin: profile?.isAdmin,
            canAddFamily: profile?.canAddFamily,
            canTransfer: profile?.canTransfer,
            roles: profile?.roles,
        })
    }

    @Post(topic)
    handler(@Body() dto: UserGetProfileQueryDTO) {
        return this.execute(dto);
    }
}
