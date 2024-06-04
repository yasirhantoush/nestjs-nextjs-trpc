import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('lb_label')
export class Label {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    labelName: string;

    @Column()
    labelColor: string;
    
    @Column()
    entityType: string;
    
    @Column('json')
    attributes: any;
}