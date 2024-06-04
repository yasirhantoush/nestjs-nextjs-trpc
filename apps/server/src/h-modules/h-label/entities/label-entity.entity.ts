import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Label } from "./label.entity";

@Entity('lb_label_entity')
export class LabelEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Label)
    label: Label;

    @Column()
    entityType: string;
    
    @Column()
    entityId: number;
}