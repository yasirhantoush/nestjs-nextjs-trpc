import { Column, CreateDateColumn, Entity, EntityManager, Equal, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import uuid from 'uuidv4';
import { doFail } from "@server/lib/helpers";

@Entity('h_otp')
export class OTP {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    otpUuid: string;

    @Column({ nullable: true })
    otpType: 'SMS' | 'EMAIL';

    @Column()
    otpCode: string;


    @Column()
    actionType: string;

    @Column('json')
    payload: Record<string, any>;

    @Column({ nullable: true })
    to: string;

    @Column({ default: false })
    isConsumed: boolean;

    @Column({ default: 5 })
    allowedTrials: number;

    @Column({ default: 0 })
    failures: number;

    @Column({ nullable: true })
    consumedAt: Date;

    @Column({ nullable: true })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    static async createOtp(em: EntityManager, payload: Object, actionType: string, to: string, otpType: 'SMS' | 'EMAIL', allowedTrials: number = 5) {
        const otp = em.create(OTP);
        otp.payload = payload;
        otp.actionType = actionType;
        otp.to = to;
        otp.otpType = otpType; 
        otp.otpCode = this.generateRandomNumber(6);
        otp.otpUuid = uuid.uuid();
        otp.isConsumed = false;
        otp.allowedTrials = allowedTrials;
        await em.save(otp);
        return otp;
    }

    static async verifyOtp(em: EntityManager, otpUuid: string, actionType: string, otpCode: string) {
        const otp = await em.findOneOrFail(OTP, {
            where: {
                otpUuid: Equal(otpUuid),
            },
        });

        
        if (!otp) {
            em.save(otp);
            throw doFail('SMS OTP UUID not found', 'OTP_UUID_NOT_FOUND');
        }
        
        if (otp.actionType != actionType) {
            otp.failures ++;
            em.save(otp);
            throw doFail('OTP wrong action type', 'OTP_WRONG_ACTION_TYPE');
        }
        
        if (otp.isConsumed) {
            otp.failures ++;
            em.save(otp);
            throw doFail('OTP is already consumed', 'OTP_CONSUMED');
        }
        
        if (otp.otpCode != otpCode) {
            otp.failures ++;
            em.save(otp);
            throw doFail('Otp token is incorrect', 'OTP_WRONG_TOKEN');
        }

        return otp
    }

    static async verifyAndConsumeOtp(em: EntityManager, otpUuid: string, actionType: string, otpCode: string) {
        const otp = await this.verifyOtp(em, otpUuid, actionType, otpCode)
        otp.isConsumed = true;
        otp.consumedAt = new Date();
        await em.save(otp);
        return otp;
    }

    static generateRandomNumber(n: number): string {
        var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

        if (n > max) {
            return this.generateRandomNumber(max) + this.generateRandomNumber(n - max);
        }

        max = Math.pow(10, n + add);
        var min = max / 10; // Math.pow(10, n) basically
        var number = Math.floor(Math.random() * (max - min + 1)) + min;

        return ("" + number).substring(add);
    }
}