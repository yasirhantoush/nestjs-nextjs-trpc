import { Column, CreateDateColumn, Entity, EntityManager, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "@server/user/entities/user.entity";

@Entity('h_post')
export class HPost {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    summary: string;

    @Column({ nullable: true })
    body: string;

    @Column({ default: false })
    edited: boolean;

    @Column('json')
    tags: string[];

    @ManyToOne(() => User)
    createdBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor() {
        this.tags = [];
        this.edited = false;
        this.summary = '';
        this.body = '';
    }
}
