import { doFail } from "@server/lib/helpers";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, EntityManager, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('h_document')
export class Document {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true, default: '' })
    note: string;

    @Column({ nullable: true })
    entityType: string;

    @Column({ nullable: true })
    entityId: string;

    @Column({ nullable: true })
    entityField: string;

    @Column({ nullable: true })
    createdById: string;

    @DeleteDateColumn()
    deletedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    fileName: string;

    // @Column('mediumblob', { nullable: true, select: false }) // postgresql
    @Column('blob', { nullable: true, select: false }) // mysql
    fileData: Buffer;

    @Column({ nullable: true })
    fileSize: number;

    @Column({ nullable: true })
    mimeType: string;

    async loadFileData(em: EntityManager) {
        const document = await em.createQueryBuilder(Document, 'd')
            .select('d.fileData')
            .where('id = :id', { id: this.id })
            .getOne();
        if (!document) {
            throw doFail('document not found', 'DOC_NOT_FOUND')
        }
        this.fileData = document.fileData;
    }

    /** set document properties form file Object */
    copyValuesfromFile(file: Express.Multer.File) {
        this.fileData = file.buffer;
        this.fileSize = file.size;
        this.mimeType = file.mimetype;
        this.fileName = file.originalname;
    }

} 