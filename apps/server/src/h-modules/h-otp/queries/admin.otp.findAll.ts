import { Body, Controller, Get, HttpException, Inject, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { transformAndValidate } from 'class-transformer-validator';
import { IsDefined, IsOptional, Min } from 'class-validator';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MODULE_NAME } from '../constants';
import { OTP } from '../entities/otp.entity';
import { paginate } from 'nestjs-typeorm-paginate';
import { getTopicName } from '@server/lib/helpers';
import { giveMeClassLogger } from '@server/lib/winston.logger';
import { JWTGuard, Roles } from '@server/lib/guards/jwt.guard';

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

export class AdminOtpFindAllQueryDTO {
    @IsOptional()
    @ApiProperty({ default: 20, description: 'items per page' })
    limit: number = 20;

    @IsOptional()
    @Min(1)
    @ApiProperty({ default: 1, description: 'page number' })
    page: number = 1;

    @IsDefined()
    userId: number;
}

@ApiTags(MODULE_NAME)
@ApiBearerAuth()
@UseGuards(JWTGuard)
@Roles('ADMIN')
@Controller(`api/${MODULE_NAME}/queries`)
export class AdminOtpFindAllQuery {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager
    ) { }

    async execute(dto: AdminOtpFindAllQueryDTO): Promise<any> {
        logger.debug(`query execution started`)
        logger.silly(`query dto`, dto)
        dto = await transformAndValidate(AdminOtpFindAllQueryDTO, dto)
        
        const qb = this.manager.createQueryBuilder(OTP, 'o').orderBy('id', 'DESC')
        const paginated = await paginate<OTP>(qb, dto);
        return paginated;
    }

    @Post(topic)
    async httpHandler(@Body() body: AdminOtpFindAllQueryDTO): Promise<any> {
        return this.execute(body)
    }
}

export default AdminOtpFindAllQuery;