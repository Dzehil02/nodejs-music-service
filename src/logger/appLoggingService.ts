import { Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AppLoggingService {
    private readonly logger = new Logger(AppLoggingService.name);

    logRequest(req: Request) {
        const { method, body, baseUrl, params } = req;
        this.logger.log(
            `Incoming ${method} request to ${baseUrl} with query parameters: ${JSON.stringify(
                params,
            )} and body: ${JSON.stringify(body)}`,
        );
    }

    logResponse(res: Response) {
        const { statusCode, statusMessage } = res;
        this.logger.verbose(`Response with status ${statusCode}: ${statusMessage}`);
    }

    logError(error: any) {
        this.logger.error(`Path: ${error.path} - ${error.message} with status ${error.statusCode}`);
    }
}
