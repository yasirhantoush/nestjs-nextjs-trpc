import { getTopicName } from '@server/lib/helpers';
import { giveMeClassLogger } from '@server/lib/winston.logger';
import { Column, CreateDateColumn, UpdateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, PrimaryColumn, EntityManager } from 'typeorm';

const topic = getTopicName(__filename);
const logger = giveMeClassLogger(topic);

@Entity('h_system_setting')
export class HSystemSetting {
    @PrimaryColumn()
    key: string;

    @Column()
    value: string;

    @Column({ nullable: true })
    desc: string;

    @Column({ default: 0, nullable: true })
    usageCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    static async getSetting(key: string, em: EntityManager, defaultValue: string = ''): Promise<string> {
        // load settings
        const setting = await em.findOneBy(HSystemSetting, { key: key });
        if (setting) {
            setting.usageCount = (setting.usageCount || 0) + 1;
            return setting.value;
        }

        // create new settigngs and store it
        const newSetting = new HSystemSetting();
        newSetting.key = key;
        newSetting.value = defaultValue;
        newSetting.desc = '';
        newSetting.usageCount = 0;
        await em.save(newSetting);
        
        return defaultValue;
    }

    static async setSetting(key: string, em: EntityManager, value: string = ''): Promise<any> {
        // load settings
        let setting = await em.findOneBy(HSystemSetting, { key: key });
        
        // or create new settigns and store it
        if (!setting) {
            setting = new HSystemSetting();
            setting.key = key;
            setting.desc = '';
            setting.usageCount = 0;
        }
        setting.value = value;
        await em.save(setting);
    }

    static async syncSettings(em: EntityManager) {
        const loadedSettings = await em.find(HSystemSetting)
        const missingSettings = masterSettings.filter(ms => !loadedSettings.find(lp => lp.key === ms.key))
        for (const mp of missingSettings) {
            if(mp.key && mp.desc && mp.value){
                const newSetting = em.create(HSystemSetting);
                newSetting.key = mp.key;
                newSetting.value = mp.value;
                newSetting.desc = mp.desc;
                newSetting.usageCount = 0;
                await em.save(newSetting)
            }
        }
        logger.info(`loaded ${missingSettings.length} settings to database`)
    }
}

export const masterSettings: Partial<HSystemSetting>[] = [
    { key: 'sample-settings', value: '', desc: '' },
]