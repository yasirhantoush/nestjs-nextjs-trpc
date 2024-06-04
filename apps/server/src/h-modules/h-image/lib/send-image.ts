import { Image } from '../entities/image.entity';
import { Response } from 'express';

export async function sendImageFile(image: Image, res: Response, disposition: boolean = false) {
    let file = image.fileData;
    let mimeType = image?.mimeType;
    let fileName = image?.fileName;

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
