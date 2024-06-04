import { Controller, Get, Res, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiProperty, ApiBearerAuth } from '@nestjs/swagger';
import { transformAndValidate } from 'class-transformer-validator';
import { IsDefined } from 'class-validator';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MODULE_NAME } from '../constants';
import { Response } from 'express';
import { sendImageFile } from '../lib/send-image';
import { getTopicName } from '@server/lib/helpers';
import { giveMeClassLogger } from '@server/lib/winston.logger';
import { JWTGuard, Roles } from '@server/lib/guards/jwt.guard';
import { UserValue } from '@server/lib/decorators/user.decorator';
import { JWTPayload } from '@server/lib/interfaces/jwt-payload.dto';
import { Image } from '../entities/image.entity';

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

export class AdminImageFindByIdQueryDTO {
    @IsDefined()
    @ApiProperty()
    imageId: string;

    userId: string | number;
}

@ApiTags(MODULE_NAME)
@ApiBearerAuth()
@UseGuards(JWTGuard)
@Controller(`api/${MODULE_NAME}/queries`)
export class AdminImageFindByIdQuery {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager
    ) { }

    async execute(dto: AdminImageFindByIdQueryDTO): Promise<Image> {
        logger.debug(`query execution started`)
        logger.silly(`query dto`, dto)
        dto = await transformAndValidate(AdminImageFindByIdQueryDTO, dto)
        
        // load image
        const image = await this.manager.findOneOrFail(Image, { where: { id: dto.imageId } });
        
        // load data buffer
        await image.loadFileData(this.manager);

        // return
        return image;
    }

    @Get(topic)
    @Roles('ADMIN')
    async readFile(
        @UserValue() jwtPayload: JWTPayload,
        @Res() res: Response,
        @Query() dto: AdminImageFindByIdQueryDTO,
    ) {
        const image = await this.execute({ ...dto, userId: jwtPayload.userId })
        return sendImageFile(image, res);
    }
}

export default AdminImageFindByIdQueryDTO;
