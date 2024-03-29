import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class AppLoggingService {
    private readonly logger = new Logger(AppLoggingService.name);
    private readonly logLevel: number;
    private readonly LOG_LEVELS = ['verbose', 'debug', 'log', 'warn', 'error'];

    constructor(private readonly config: ConfigService) {
        this.logLevel = this.getLogLevel();
        console.log(this.logLevel);
    }

    private getLogLevel() {
        const logLevel = this.LOG_LEVELS.indexOf(this.config.get('LOG_LEVEL'));
        return logLevel !== -1 ? logLevel : 0;
    }

    logRequest(req: Request) {
        if (this.logLevel >= 2) {
            const { method, body, baseUrl, params } = req;
            this.logger.log(
                `[REQUEST] - Method: ${method} \n request to url: ${baseUrl} \n with query parameters: ${JSON.stringify(
                    params,
                )} \n and body: ${JSON.stringify(body)}`,
            );
        }
    }

    logResponse(res: Response) {
        if (this.logLevel >= 0) {
            const { statusCode, statusMessage } = res;
            this.logger.verbose(`[RESPONSE] - Status ${statusCode}: ${statusMessage}`);
        }
    }

    logError(error: any) {
        if (this.logLevel >= 4) {
            this.logger.error(`[ERROR] - Path: ${error.path} - ${error.message} with status ${error.statusCode}`);
        }
    }

    logUncaughtException(error: Error): void {
        if (this.logLevel >= 4) {
            this.logger.error(
                `[UNCAUGHT EXCEPTION] - Message: ${error.message}. Application was terminated !!!`,
                error.stack,
            );
        }
    }

    logUnhandledRejection(reason: any): void {
        if (this.logLevel >= 3) {
            this.logger.warn(`[UNHANDLED REJECTION] - Message: ${reason.message}`);
        }
    }
}
