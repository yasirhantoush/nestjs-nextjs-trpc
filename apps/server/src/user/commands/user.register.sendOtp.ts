import { doFail, doSuccess, doValidate, getTopicName } from '@server/lib/helpers';
import { EntityManager } from 'typeorm';
import { UserProfile } from '../entities/userProfile.entity';
import { sendHtmlEmail } from '@server/lib/utils/email.util';
import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsEnum, IsInt, IsString, IsStrongPassword, Max, Min } from 'class-validator';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { MODULE_NAME } from '../constants';
import { OTP } from '@server/h-modules/h-otp/entities/otp.entity';

const bcrypt = require('bcryptjs');
var chance = require('chance').Chance();

const topic = getTopicName(__filename);
// const logger = giveMeClassLogger(topic);

export class UserRegisterSendOtpCommandDTO {
    @IsString()
    @ApiProperty()
    firstName: string;

    @IsString()
    @ApiProperty()
    lastName: string;

    @IsString()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @IsStrongPassword()
    @ApiProperty()
    password: string;

    @IsString()
    @ApiProperty()
    country: string;

    @IsString()
    @ApiProperty()
    city: string;

    @IsInt()
    @Min(1900)
    @Max(new Date().getFullYear() - 8)
    @ApiProperty()
    birthYear: number;

    @IsString()
    @IsEnum(['M', 'F'])
    @ApiProperty()
    gender: 'M' | 'F';
}

@ApiTags(MODULE_NAME)
@ApiBearerAuth()
@Controller(`api/${MODULE_NAME}/commands`)
export class UserRegisterSendOtpCommand {
    constructor(
        private readonly manager: EntityManager
    ) { }
    async execute(dto: UserRegisterSendOtpCommandDTO) {
        await doValidate(UserRegisterSendOtpCommandDTO, dto)
        dto.email = (dto.email||'').toLowerCase()

        // check email
        const userExists = await this.manager.exists(UserProfile, { where: { email: dto.email } })
        if (userExists) {
            throw doFail('البريد الإلكتروني مسجل مسبقا', 'EMAIL_EXISTS');
        }

        // encrypt password
        dto.password = await bcrypt.hash(dto.password, 10);

        // create otp
        const otp = await OTP.createOtp(this.manager, dto, 'REGISTER', dto.email, 'EMAIL', 3)

        await sendHtmlEmail(dto.email, `Onebody.sd | كالجسد الواحد | طلب تسجيل حساب جديد`, `
        لقد قمت بطل تسجيل حساب على منصة كالجسد الواحد
        <br />
        رمز التحقق لعملية التسجيل هو ${otp.otpCode}
        `)
        
        return doSuccess('تم إرسال رمز التحقق', 'OTP_SENT', {
            otpUuid: otp.otpUuid,
            otpCode: process.env.NODE_ENV !== 'production' ? otp.otpCode : ''
        })
    }

    @Post(topic)
    handler(@Body() dto: UserRegisterSendOtpCommandDTO) {
        return this.execute(dto);
    }
}
