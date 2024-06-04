import { Controller, Get, Res, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiProperty, ApiBearerAuth } from '@nestjs/swagger';
import { transformAndValidate } from 'class-transformer-validator';
import { IsDefined } from 'class-validator';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MODULE_NAME } from '../constants';
import { Response } from 'express';
import { sendDocumentFile } from '../lib/send-document-file';
import { getTopicName } from '@server/lib/helpers';
import { giveMeClassLogger } from '@server/lib/winston.logger';
import { JWTGuard, Roles } from '@server/lib/guards/jwt.guard';
import { UserValue } from '@server/lib/decorators/user.decorator';
import { JWTPayload } from '@server/lib/interfaces/jwt-payload.dto';
import { Document } from '../entities/document.entity';

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

export class AdminDocumentFindByIdQueryDTO {
    @IsDefined()
    @ApiProperty()
    documentId: string;

    userId: string | number;
}

@ApiTags(MODULE_NAME)
@ApiBearerAuth()
@UseGuards(JWTGuard)
@Controller(`api/${MODULE_NAME}/queries`)
export class AdminDocumentFindByIdQuery {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager
    ) { }

    async execute(dto: AdminDocumentFindByIdQueryDTO): Promise<Document> {
        logger.debug(`query execution started`)
        logger.silly(`query dto`, dto)
        dto = await transformAndValidate(AdminDocumentFindByIdQueryDTO, dto)
        
        // load document
        const document = await this.manager.findOneOrFail(Document, { where: { id: dto.documentId } });
        
        // load data buffer
        await document.loadFileData(this.manager);

        // return
        return document;
    }

    @Get(topic)
    @Roles('ADMIN')
    async readFile(
        @UserValue() jwtPayload: JWTPayload,
        @Res() res: Response,
        @Query() dto: AdminDocumentFindByIdQueryDTO,
    ) {
        const document = await this.execute({ ...dto, userId: jwtPayload.userId })
        return sendDocumentFile(document, res);
    }
}

export default AdminDocumentFindByIdQueryDTO;
