import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLoggingService } from 'src/logger/appLoggingService';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly loggingService: AppLoggingService) {}
    use(req: Request, res: Response, next: () => void) {
        this.loggingService.logRequest(req);
        res.on('finish', () => {
            this.loggingService.logResponse(res);
        });
        next();
    }
}
