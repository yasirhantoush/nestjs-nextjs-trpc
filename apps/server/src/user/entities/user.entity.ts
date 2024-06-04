import { Entity, Column, Generated, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { UserProfile } from './userProfile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @OneToOne(() => UserProfile, (entity) => entity.user)
  profile?: UserProfile;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;
  
  @Column()
  lastLogin?: Date;
}
