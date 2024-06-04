import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "@server/user/entities/user.entity";
import { HComment } from "./comment.entity";

@Entity('h_comment_reply')
export class HCommentReply {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    body: string;

    @Column({ default: false })
    edited: boolean;

    @ManyToOne(() => HComment)
    comment: HComment;

    @ManyToOne(() => User)
    createdBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
