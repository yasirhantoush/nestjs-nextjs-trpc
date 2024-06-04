import { Entity, Column, Generated, PrimaryGeneratedColumn, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserProfile {
    @PrimaryColumn('uuid')
    id?: string;

    @OneToOne(() => User)
    @JoinColumn({ referencedColumnName: 'id' })
    user?: User;

    @Column({ default: true })
    isActive?: boolean;

    @Column({ default: false })
    isAdmin?: boolean;

    @Column({ default: false })
    canAddFamily?: boolean;

    @Column({ default: false })
    canTransfer?: true;

    @Column('json', {})
    roles?: string[];

    @Column({ unique: true })
    email?: string;

    @Column('text', { select: false })
    password?: string;

    @Column({ nullable: true })
    country?: string;

    @Column({ nullable: true })
    city?: string;

    @Column({ default: 'ar' })
    language?: string;

    @Column({ nullable: true })
    birthYear?: number;

    @Column({ nullable: true })
    gender?: string;
}
