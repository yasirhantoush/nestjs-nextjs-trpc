import { Column, CreateDateColumn, Entity, EntityManager, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@server/user/entities/user.entity";

export enum InteractionType {
    LIKE = "LIKE",
    HEART = "HEART",
}

@Entity('h_interaction')
export class HInteraction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    interactionType: InteractionType;
    
    @Column()
    entityType: string;
    
    @Column()
    entityId: string;

    @ManyToOne(() => User)
    createdBy: User;

    @CreateDateColumn()
    createdAt: string;
}
