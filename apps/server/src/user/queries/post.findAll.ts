import { doSuccesss, doValidate, getTopicName } from '@server/lib/helpers';
import { EntityManager } from 'typeorm';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MODULE_NAME } from '../constants';
import { UserProfile } from '../entities/userProfile.entity';
import { giveMeClassLogger } from '@server/lib/winston.logger';
import { JWTGuard } from '@server/lib/guards/jwt.guard';
import { HPost } from '@server/h-modules/h-blog/entities/post.entity';

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

export class PostsFindAllDTO {
    @IsOptional()
    @IsString()
    postId: string;

    @IsString()
    @IsOptional()
    userId: string;
}

export async function execute(dto: PostsFindAllDTO, manager: EntityManager) {
    await doValidate(PostsFindAllDTO, dto)
    const posts = await this.manager.find(HPost, { relations: { createdBy: true }, where: { id: dto.postId } })
    return doSuccesss<{ posts: HPost[] }>(posts)
}

@ApiTags(MODULE_NAME)
@ApiBearerAuth()
@Controller(`api/${MODULE_NAME}/queries`)
// @UseGuards(JWTGuard)
export class PostsFindAllQuery {
    constructor(
        private readonly manager: EntityManager
    ) { }

    async execute(dto: PostsFindAllDTO) {
        await doValidate(PostsFindAllDTO, dto)
        const posts = await this.manager.find(HPost, { relations: { createdBy: true }, where: { id: dto.postId } })
        return doSuccesss({ posts })
    }

    @Post(topic)
    handler(@Body() dto: PostsFindAllDTO) {
        return this.execute(dto);
    }
}
