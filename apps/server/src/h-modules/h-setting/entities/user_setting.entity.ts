import { getTopicName } from '@server/lib/helpers';
import { giveMeClassLogger } from '@server/lib/winston.logger';
import { User } from '@server/user/entities/user.entity';
import { Column, CreateDateColumn, UpdateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, PrimaryColumn, EntityManager } from 'typeorm';

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

@Entity('h_user_setting')
export class HUserSetting {
    @PrimaryColumn()
    key: string;

    @Column()
    value: string;

    @Column({ nullable: true })
    desc: string;

    @Column({ default: 0, nullable: true })
    usageCount: number;

    @ManyToOne(() => User)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    static async getSetting(key: string, userId: string | number, em: EntityManager, defaultValue: string = ''): Promise<string> {
        // load settings
        const setting = await em.findOneBy(HUserSetting, { key: key, user: userId as any });
        if (setting) {
            setting.usageCount = (setting.usageCount || 0) + 1;
            return setting.value;
        }

        // create new settigngs and store it
        const newSetting = new HUserSetting();
        newSetting.key = key;
        newSetting.value = defaultValue;
        newSetting.desc = '';
        newSetting.usageCount = 0;
        newSetting.user = userId as any;
        await em.save(newSetting);

        return defaultValue;
    }
    static async getAllUserSetting(userId: string, em: EntityManager, defaultValue: string = ''): Promise<HUserSetting[]> {
        // load settings
        const settings = await em.findBy(HUserSetting, {  user: userId as any });
        return settings;
    }

    static async setSetting(key: string, userId: string, em: EntityManager, value: string = ''): Promise<any> {
        // load settings
        let setting = await em.findOneBy(HUserSetting, { key: key,  user: userId as any });

        // or create new settigns and store it
        if (!setting) {
            setting = new HUserSetting();
            setting.key = key;
            setting.desc = '';
            setting.usageCount = 0;
            setting.user = userId as any;
        }
        setting.value = value;
        await em.save(setting);
    }

}
