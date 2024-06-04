import { Document } from '../entities/document.entity';
import { Response } from 'express';

export async function sendDocumentFile(document: Document, res: Response, disposition: boolean = false) {
    let file = document.fileData;
    let mimeType = document?.mimeType;
    let fileName = document?.fileName;

    let headers = {
        'Content-Type': mimeType || '',
        'Content-Length': file.length,
        'Content-Disposition': '',
    }

    if(disposition) {
        headers['Content-Disposition'] = 'attachment; filename=' + encodeURI(fileName);
    }

    res.writeHead(200,headers);
    res.write(file);
    res.end();
}
