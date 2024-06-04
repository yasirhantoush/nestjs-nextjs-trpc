import { doFail, doValidate, getTopicName } from '@server/lib/helpers';
import { EntityManager } from 'typeorm';
import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { MODULE_NAME } from '../constants';
import { generateJWT } from '../../lib/jwt';
import { UserProfile } from '../entities/userProfile.entity';
import { giveMeClassLogger } from '@server/lib/winston.logger';

const bcrypt = require('bcryptjs');

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

export class UserLoginCommandDTO {
    @IsString()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @ApiProperty()
    password: string;
}

@ApiTags(MODULE_NAME)
@ApiBearerAuth()
@Controller(`api/${MODULE_NAME}/commands`)
export class UserLoginCommand {
    constructor(
        private readonly manager: EntityManager
    ) { }

    async execute(dto: UserLoginCommandDTO) {
        await doValidate(UserLoginCommandDTO, dto)
        dto.email = (dto.email||'').toLowerCase()

        let profile = await this.manager.findOne(UserProfile, { relations: { user: true }, where: { email: dto.email } });
        if (!profile) {
            throw doFail('عفوا ، هذا البريد الإلكتروني غير مسجل لدينا', 'NOT_FOUND');
        }

        const [{ password }] = await this.manager.query('SELECT password FROM user_profile WHERE id = ?', [profile.id]);
        const isPasswordMatching = await bcrypt.compare(dto.password, password);
        if (!isPasswordMatching) {
            throw doFail('كلمة المرور خطأ', 'WRONG_PASSWORD');
        }

        if (!profile.isActive) {
            throw doFail('عفوا ، هذا الحساب مغلق', 'WRONG_PASSWORD');
        }

        profile.user.lastLogin = new Date();
        await this.manager.save(profile.user);

        // generate JWT token
        return generateJWT(profile)
    }

    @Post(topic)
    handler(@Body() dto: UserLoginCommandDTO) {
        return this.execute(dto);
    }
}
