import { Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AppLoggingService {
    private readonly logger = new Logger(AppLoggingService.name);

    logRequest(req: Request) {
        const { method, body, baseUrl, params } = req;
        this.logger.log(
            `[REQUEST] - Method: ${method} \n request to url: ${baseUrl} \n with query parameters: ${JSON.stringify(
                params,
            )} \n and body: ${JSON.stringify(body)}`,
        );
    }

    logResponse(res: Response) {
        const { statusCode, statusMessage } = res;
        this.logger.verbose(`[RESPONSE] - Status ${statusCode}: ${statusMessage}`);
    }

    logError(error: any) {
        this.logger.error(`[ERROR] - Path: ${error.path} - ${error.message} with status ${error.statusCode}`);
    }

    logUncaughtException(error: Error): void {
        this.logger.error(
            `[UNCAUGHT EXCEPTION] - Message: ${error.message}. Application was terminated !!!`,
            error.stack,
        );
    }

    logUnhandledRejection(reason: any): void {
        this.logger.warn(`[UNHANDLED REJECTION] - Message: ${reason.message}`);
    }
}
