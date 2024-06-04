import { doFail, doValidate, getTopicName } from '@server/lib/helpers';
import { EntityManager } from 'typeorm';
import { Body, Controller, Post } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MODULE_NAME } from '../constants';
import { generateJWT, verifyRefreshToken } from '../../lib/jwt';
import { UserProfile } from '../entities/userProfile.entity';
import { giveMeClassLogger } from '@server/lib/winston.logger';

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

export class UserRefreshTokenCommandDTO {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}

@ApiTags(MODULE_NAME)
@ApiBearerAuth()
@Controller(`api/${MODULE_NAME}/commands`)
export class UserRefreshTokenCommand {
    constructor(
        private readonly manager: EntityManager
    ) { }

    async execute(dto: UserRefreshTokenCommandDTO) {
        await doValidate(UserRefreshTokenCommandDTO, dto)
        const jwtPayload = verifyRefreshToken(dto.refreshToken)

        if (!jwtPayload) {
            throw doFail('عفوا ، تعذر التحقق من الجلسة', 'NO_JWT_ERROR')
        }
        
        // load user
        let profile = await this.manager.findOne(UserProfile, { relations: { user: true }, where: { id: jwtPayload.userId } });
        if (!profile) {
            throw doFail('عفوا ، تعذر الحصول على جلسة المستخدم', 'NOT_FOUND');
        }

        // generate jwt tokens and send response
        const returnData = await generateJWT(profile)
        returnData.data.refreshToken = undefined as any;
        return returnData;
    }

    @Post(topic)
    handler(@Body() dto: UserRefreshTokenCommandDTO) {
        return this.execute(dto);
    }
}
