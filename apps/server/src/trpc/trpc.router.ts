import { INestApplication, Injectable } from '@nestjs/common';
import { TrpcService } from '@server/trpc/trpc.service';
import { z } from 'zod';
import * as trpcExpress from '@trpc/server/adapters/express';
import { EntityManager, Raw } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { HPost } from '@server/h-modules/h-blog/entities/post.entity';

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpc: TrpcService, 
    @InjectEntityManager() private readonly manager: EntityManager
  ) {}

  appRouter = this.trpc.router({
    blogs: this.trpc.procedure
      .input( z.object({
        postId: z.string().optional(),
        keyword: z.string().optional(),
        tags: z.string().optional(),
      }))
      .query(async ({input})=> {
        const posts = await this.manager.find(HPost,{
          where: {
            id: input.postId,
            title: Raw(value => `${value} LIKE '%${input.keyword}%'`),
            tags: input.tags
          }
        })
        console.log(posts);
        return posts as HPost[];
      }),
    hello: this.trpc.procedure
      .input(z.object({ name: z.string().optional() }))
      .query(({ input }) => {
        return `Hello ${input.name ? input.name : `Bilbo`}`;
      }),
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({ router: this.appRouter }),
    );
  }
}

export type AppRouter = TrpcRouter['appRouter'];
