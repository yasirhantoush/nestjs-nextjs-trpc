import { doFail, doValidate, getTopicName } from '@server/lib/helpers';
import { EntityManager } from 'typeorm';
import { Body, Controller, Post } from '@nestjs/common';
import { IsString, IsStrongPassword } from 'class-validator';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { MODULE_NAME } from '../constants';
import { generateJWT } from '../../lib/jwt';
import { UserProfile } from '../entities/userProfile.entity';
import { UserResetPasswordSendOtpCommandDTO } from './user.resetPassword.sendOtp';
import { giveMeClassLogger } from '@server/lib/winston.logger';
import { OTP } from '@server/h-modules/h-otp/entities/otp.entity';

const bcrypt = require('bcryptjs');
var chance = require('chance').Chance();

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

export class UserResetPasswordVerifyOtpCommandDTO {
    @IsString()
    @ApiProperty()
    otpUuid: string;

    @IsString()
    @ApiProperty()
    otpCode: string;

    @IsString()
    @IsStrongPassword()
    @ApiProperty()
    password: string;
}

@ApiTags(MODULE_NAME)
@ApiBearerAuth()
@Controller(`api/${MODULE_NAME}/commands`)
export class UserResetPasswordVerifyOtpCommand {
    constructor(
        private readonly manager: EntityManager
    ) { }
    async execute(dto: UserResetPasswordVerifyOtpCommandDTO) {
        await doValidate(UserResetPasswordVerifyOtpCommandDTO, dto)
        return this.manager.transaction(async (em) => {

            // load and validate otp
            const otp = await OTP.verifyAndConsumeOtp(this.manager, dto.otpUuid, 'RESET', dto.otpCode);

            // reset password user
            const resetDto = otp.payload as UserResetPasswordSendOtpCommandDTO;
            let profile = await this.manager.findOne(UserProfile, { relations: { user: true }, where: { email: resetDto.email } });
            if (!profile) {
                return doFail('لم يتم العثور على المستخدم', 'UNKOWN_ERROR', {}, {});
            }

            // profile
            profile.password = await bcrypt.hash(dto.password, 10);
            await this.manager.save(profile);
            
            profile.user.lastLogin = new Date();
            await this.manager.save(profile.user);

            // create jwt payload
            return generateJWT(profile)
        })

    }

    @Post(topic)
    handler(@Body() dto: UserResetPasswordVerifyOtpCommandDTO) {
        return this.execute(dto);
    }
}
