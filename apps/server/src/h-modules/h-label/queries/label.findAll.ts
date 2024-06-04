import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { transformAndValidate } from 'class-transformer-validator';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Label } from '../entities/label.entity';
import { moduleName } from '../constants';
import { getTopicName } from '@server/lib/helpers';
import { giveMeClassLogger } from '@server/lib/winston.logger';
import { JWTGuard } from '@server/lib/guards/jwt.guard';

const topic = getTopicName(__filename)
const logger = giveMeClassLogger(topic);

export class LabelFindAllQueryDTO {

}

@ApiTags(`${moduleName}`)
@ApiBearerAuth()
@UseGuards(JWTGuard)
@Controller(`api/${moduleName}/queries`)
export class LabelFindAllQuery {
    constructor(
        @InjectEntityManager() private manager: EntityManager,
    ) { }

    async execute(dto: LabelFindAllQueryDTO): Promise<any> {
        logger.debug(`query execution started`)
        logger.silly(`query dto`, dto)
        dto = await transformAndValidate(LabelFindAllQueryDTO, dto)
        const rows = await this.manager.find(Label);
        return rows;
    }

    @Post(topic)
    async httpHandler(@Body() body: LabelFindAllQueryDTO): Promise<any> {
        return this.execute(body)
    }
}