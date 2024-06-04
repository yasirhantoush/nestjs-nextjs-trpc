import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { transformAndValidate } from 'class-transformer-validator';
import { IsDefined, IsOptional, Matches } from 'class-validator';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Label } from '../entities/label.entity';
import { moduleName } from '../constants';
import { doSuccess, getTopicName } from '@server/lib/helpers';
import { giveMeClassLogger } from '@server/lib/winston.logger';
import { JWTGuard } from '@server/lib/guards/jwt.guard';

const topic = getTopicName(__filename)
const logger = giveMeClassLogger(topic);

export class LabelSaveCommandDTO {
    @IsOptional()
    id: number;

    @IsDefined()
    labelName: string;

    @IsDefined()
    @Matches(/#\d{6,6}/)
    labelColor: string;

    @IsOptional()
    targetEntityType: string;

    @IsOptional()
    attributes: any;
}

@ApiTags(`${moduleName}`)
@ApiBearerAuth()
@UseGuards(JWTGuard)
@Controller(`api/${moduleName}/commands`)
export class LabelSaveCommand {
    constructor(
        @InjectEntityManager() private manager: EntityManager,
    ) { }

    async execute(dto: LabelSaveCommandDTO): Promise<any> {
        logger.debug(`command execution started`)
        logger.silly(`command dto`, dto)
        dto = await transformAndValidate(LabelSaveCommandDTO, dto)
        const isNew = !dto.id;
        const record = isNew ? this.manager.create(Label) : await this.manager.findOne(Label, { where: { id: dto.id } });
        const savedRecord = await this.manager.save(record);
        return doSuccess('ok', 'SUCCESS', { savedRecord })
    }

    @Post(topic)
    async httpHandler(@Body() body: LabelSaveCommandDTO): Promise<any> {
        return this.execute(body)
    }
}