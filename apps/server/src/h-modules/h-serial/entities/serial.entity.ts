import { Column, CreateDateColumn, Entity, EntityManager, PrimaryGeneratedColumn } from "typeorm";
import { padStart } from 'lodash';

@Entity('h_serial')
export class HSerial {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    prefix: string;

    @Column()
    nextId: number;

    @Column()
    length: number;

    static async getNextNo(name: string, defaultPrefix: string, em: EntityManager, defaultLength: number,) {

        // load serial
        let serial = await em.findOne(HSerial, { where: { name: name } });

        // if no serial then create serial
        if (!serial) {
            serial = em.create(HSerial, { name: name, prefix: defaultPrefix, length: defaultLength || 6, nextId: 1 });
            await em.save(serial);
        }

        const nextNo = serial.prefix + padStart(String(serial.nextId), serial.length, '0');
        return nextNo
    }

    static async takeNextNo(name: string, defaultPrefix: string, em: EntityManager, defaultLength: number = 6) {

        // load serial
        let serial = await em.findOne(HSerial, { where: { name: name } });

        // if no serial then create serial
        if (!serial) {
            serial = em.create(HSerial, { name: name, prefix: defaultPrefix, length: defaultLength || 6, nextId: 1 });
            await em.save(serial);
        }

        const nextNo = serial.prefix + padStart(String(serial.nextId), serial.length, '0');

        serial.nextId++;
        await em.save(serial);

        return nextNo;
    }
}
