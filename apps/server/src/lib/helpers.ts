import { ClassType, transformAndValidate } from "class-transformer-validator"
import * as path from 'path';

export function getTopicName(fileName: string) {
    return path.basename(fileName, path.extname(fileName));
}

export type ApiResponseProps<D = Record<string, any>> = {
    success: boolean;
    message: string;
    responseCode: string;
    data: D;
    statusCode: number;
    debug: string;
    timestamp: string;
};

export function doSuccess<T>(message: string, responseCode: string, data?: T, statusCode = 201) {
    return {
        timestamp: new Date().toISOString(),
        success: true,
        message,
        responseCode,
        statusCode,
        data: data || {} as T,
    };
}

export function doSuccesss<T>(data: T, statusCode = 201) {
    return {
        timestamp: new Date().toISOString(),
        success: true,
        message: 'done',
        responseCode: 'SUCCESS',
        statusCode,
        data: data,
    };
}

export function doFail(message: string, responseCode: string, data: any = {}, debug: any = {}, statusCode = 500) {
    return {
        timestamp: new Date().toISOString(),
        success: false,
        message,
        responseCode,
        data,
        statusCode,
        debug: process.env.NODE_ENV == 'development' ? debug : undefined,
    }
}

export async function doValidate<T extends object>(type: ClassType<T>, dto: T) {
    try {
        dto = await transformAndValidate(type, dto)
    } catch (error) {
        console.log(error)
        doFail('خطأ في شكل البيانات المرسلة', 'INVALID_PAYLOAD', { error }, null, 422);
    }
}
