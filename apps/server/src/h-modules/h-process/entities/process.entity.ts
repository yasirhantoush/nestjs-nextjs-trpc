import { User } from "@server/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, EntityManager, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('h_process')
export class Process<V extends Record<string, any>, S extends string>  {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('json')
    variables: V;

    @Column()
    status: S;

    @Column()
    processType: string;

    @Column({ nullable: true })
    createdById: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "createdById" })
    createdBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    updatedById: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "updatedById" })
    updatedBy: User;

    @UpdateDateColumn()
    updatedAt: Date;
}
