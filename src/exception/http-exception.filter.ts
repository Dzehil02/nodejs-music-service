import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLoggingService } from 'src/logger/appLoggingService';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly loggingService: AppLoggingService) {}
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const result = {
            statusCode: status,
            message: exception.message,
            path: request.url,
            timestamp: new Date().toISOString(),
        };

        this.loggingService.logError(result);

        response.status(status).json(result);
    }
}
