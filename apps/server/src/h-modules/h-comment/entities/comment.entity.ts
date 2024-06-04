import { Column, CreateDateColumn, Entity, EntityManager, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "@server/user/entities/user.entity";

@Entity('h_comment')
export class HComment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    body: string;

    @Column({ default: false })
    edited: boolean;

    @ManyToOne(() => User)
    createdBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
