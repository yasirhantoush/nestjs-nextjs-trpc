import { doFail, doSuccess, doValidate, getTopicName } from '@server/lib/helpers';
import { OTP } from '../../h-modules/h-otp/entities/otp.entity';
import { EntityManager } from 'typeorm';
import { UserProfile } from '../entities/userProfile.entity';
import { sendHtmlEmail } from '@server/lib/utils/email.util';
import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsInt, IsString } from 'class-validator';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { MODULE_NAME } from '../constants';
import { giveMeClassLogger } from '@server/lib/winston.logger';

var chance = require('chance').Chance();

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

export class UserResetPasswordSendOtpCommandDTO {
    @IsString()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsInt()
    @ApiProperty()
    birthYear: number;
}

@ApiTags(MODULE_NAME)
@ApiBearerAuth()
@Controller(`api/${MODULE_NAME}/commands`)
export class UserResetPasswordSendOtpCommand {
    constructor(
        private readonly manager: EntityManager
    ) { }
    async execute(dto: UserResetPasswordSendOtpCommandDTO) {
        await doValidate(UserResetPasswordSendOtpCommandDTO, dto)
        dto.email = (dto.email||'').toLowerCase()

        // find user
        let profile = await this.manager.findOne(UserProfile, { relations: { user: true }, where: { email: dto.email } });
        if (!profile) {
            throw doFail('هذا البريد الإلكتروني غير مسجل لدينا', 'NOT_FOUND');
        }

        if (profile.birthYear != dto.birthYear) {
            throw doFail('عام الميلاد غير مطابق', 'NOT_FOUND');
        }

        // create otp
        const otp = await OTP.createOtp(this.manager, dto, 'RESET', dto.email, 'EMAIL', 3)

        await sendHtmlEmail(dto.email, 'Onebody.sd | كالجسد الواحد | إعادة ضبط كلمة المرور', `
        جاءنا طلب لإعادة ضبط كلمة المرور لحسابك
        <br />
        رمز التحقق لإكمال هذه العملية هو ${otp.otpCode}
        `)

        // return otp code
        return doSuccess('تم إرسال رمز التحقق', 'OTP_SENT', {
            otpUuid: otp.otpUuid,
            otpCode: process.env.NODE_ENV !== 'production' ? otp.otpCode : ''
        })
    }

    @Post(topic)
    handler(@Body() dto: UserResetPasswordSendOtpCommandDTO) {
        return this.execute(dto);
    }
}
