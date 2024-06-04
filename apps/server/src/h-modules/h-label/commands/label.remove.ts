import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { transformAndValidate } from 'class-transformer-validator';
import { IsDefined } from 'class-validator';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Label } from '../entities/label.entity';
import { moduleName } from '../constants';
import { doSuccess, getTopicName } from '@server/lib/helpers';
import { giveMeClassLogger } from '@server/lib/winston.logger';
import { JWTGuard } from '@server/lib/guards/jwt.guard';

const topic = getTopicName(__filename)
const logger = giveMeClassLogger(topic);

export class LabelRemoveCommandDTO {
    @IsDefined()
    id: number;
}

@ApiTags(`${moduleName}`)
@ApiBearerAuth()
@UseGuards(JWTGuard)
@Controller(`api/${moduleName}/commands`)
export class LabelRemoveCommand {
    constructor(
        @InjectEntityManager() private manager: EntityManager,
    ) { }

    async execute(dto: LabelRemoveCommandDTO): Promise<any> {
        logger.debug(`command execution started`)
        logger.silly(`command dto`, dto)
        dto = await transformAndValidate(LabelRemoveCommandDTO, dto)
        const isNew = !dto.id;
        const record = await this.manager.findOneOrFail(Label, { where: { id: dto.id } });
        await this.manager.delete(Label, record);
        return doSuccess('ok', 'SUCCESS')
    }

    @Post(topic)
    async httpHandler(@Body() body: LabelRemoveCommandDTO): Promise<any> {
        return this.execute(body)
    }
}