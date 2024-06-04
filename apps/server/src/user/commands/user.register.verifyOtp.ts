import { doValidate, getTopicName } from '@server/lib/helpers';
import { EntityManager } from 'typeorm';
import { Body, Controller, Post } from '@nestjs/common';
import { IsString } from 'class-validator';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { MODULE_NAME } from '../constants';
import { UserRegisterSendOtpCommandDTO } from './user.register.sendOtp';
import { User } from '../entities/user.entity';
import { generateJWT } from '../../lib/jwt';
import { UserProfile } from '../entities/userProfile.entity';
import { HSerial } from '@server/h-modules/h-serial/entities/serial.entity';
import { OTP } from '@server/h-modules/h-otp/entities/otp.entity';
import { giveMeClassLogger } from '@server/lib/winston.logger';

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

export class UserRegisterVerifyOtpCommandDTO {
    @IsString()
    @ApiProperty()
    otpUuid: string;

    @IsString()
    @ApiProperty()
    otpCode: string;
}

@ApiTags(MODULE_NAME)
@ApiBearerAuth()
@Controller(`api/${MODULE_NAME}/commands`)
export class UserRegisterVerifyOtpCommand {
    constructor(
        private readonly manager: EntityManager
    ) { }
    async execute(dto: UserRegisterVerifyOtpCommandDTO) {
        await doValidate(UserRegisterVerifyOtpCommandDTO, dto)
        
        return this.manager.transaction(async (em) => {
            // load and validate otp
            const otp = await OTP.verifyAndConsumeOtp(this.manager, dto.otpUuid, 'REGISTER', dto.otpCode);
            
            // create user
            const createDto: UserRegisterSendOtpCommandDTO = otp.payload as UserRegisterSendOtpCommandDTO;
    
            const docNo = await HSerial.takeNextNo(User.name, '', em, 6);
            const year = new Date().getFullYear();
            const month = new Date().getMonth() + 1;
    
            const user = await em.create(User, {
                firstName: createDto.firstName,
                lastName: createDto.lastName,
                userNo: `${year - 2000}${String(month).padStart(2, '0')}${docNo}`,
                lastLogin: new Date(),
            });
            await em.save(user);
                
            // create user profile
            const profile = await em.create(UserProfile, {
                id: user.id,
                user: user,
    
                email: createDto.email,
                password: createDto.password,
    
                isActive: true,
                country: createDto.country,
                city: createDto.city,
                
                birthYear: createDto.birthYear,
                gender: createDto.gender,
    
                roles: []
            });
    
            await em.save(profile);
    
            // return jwt
            return generateJWT(profile)

        })
    }

    @Post(topic)
    handler(@Body() dto: UserRegisterVerifyOtpCommandDTO) {
        return this.execute(dto);
    }
}
