import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { appendFile, statSync, existsSync, mkdirSync, writeFileSync, readdirSync, appendFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AppLoggingService {
    private readonly logger = new Logger(AppLoggingService.name);
    private readonly logLevel: number;
    private readonly LOG_LEVELS = ['verbose', 'debug', 'log', 'warn', 'error'];
    private readonly MAX_FILE_SIZE: number = this.config.get('MAX_FILE_SIZE') || 1024;
    private readonly PATH_TO_LOGS = join(process.cwd(), 'logs');
    private readonly PATH_TO_ERROR_LOGS = join(process.cwd(), 'logErrors');

    private currentErrorLogFile: string;
    private currentLogFile: string;

    constructor(private readonly config: ConfigService) {
        this.logLevel = this.getLogLevel();
        this.createLogDir();
        this.currentLogFile = this.setLastLogFile(this.PATH_TO_LOGS, 'log.log');
        this.currentErrorLogFile = this.setLastLogFile(this.PATH_TO_ERROR_LOGS, 'error.log');
    }

    private getLogLevel() {
        const logLevel = this.LOG_LEVELS.indexOf(this.config.get('LOG_LEVEL'));
        return logLevel !== -1 ? logLevel : 0;
    }

    private createLogDir(): void {
        if (!existsSync(this.PATH_TO_LOGS)) {
            mkdirSync(join(this.PATH_TO_LOGS));
        }
        if (!existsSync(this.PATH_TO_ERROR_LOGS)) {
            mkdirSync(join(this.PATH_TO_ERROR_LOGS));
        }
    }

    private setLastLogFile(logsPath: string, logsFileName: string): string {
        const files = readdirSync(logsPath);
        let lastFile = null;
        let timestamp = 0;
        files.forEach((file) => {
            const filePath = join(logsPath, file);
            const stats = statSync(filePath);
            const { mtimeMs } = stats;

            if (mtimeMs > timestamp) {
                timestamp = mtimeMs;
                lastFile = file;
            }
        });

        if (lastFile) {
            const lastLogFilePath = join(logsPath, lastFile);
            return lastLogFilePath;
        } else {
            const logFilePath = join(logsPath, logsFileName);
            writeFileSync(logFilePath, '');
            return logFilePath;
        }
    }

    logRequest(req: Request) {
        if (this.logLevel >= 2) {
            const { method, body, baseUrl, params } = req;
            const message = `[REQUEST] - Method: ${method} \n request to url: ${baseUrl} \n with query parameters: ${JSON.stringify(
                params,
            )} \n and body: ${JSON.stringify(body)} \n`;
            this.logger.log(message);
            this.writeLogToFile(message);
        }
    }

    logResponse(res: Response) {
        if (this.logLevel >= 0) {
            const { statusCode, statusMessage } = res;
            const message = `[RESPONSE] - Status ${statusCode}: ${statusMessage} \n`;
            this.logger.verbose(message);
            this.writeLogToFile(message);
        }
    }

    logError(error: any) {
        if (this.logLevel >= 4) {
            this.logger.error(`[ERROR] - Path: ${error.path} - ${error.message} with status ${error.statusCode}`);
        }
    }

    logUncaughtException(error: Error): void {
        if (this.logLevel >= 4) {
            if (!existsSync(this.currentErrorLogFile)) {
                this.createLogDir();
                this.setLastLogFile(this.PATH_TO_ERROR_LOGS, 'error.log');
            }

            const message = `[UNCAUGHT EXCEPTION] - Message: ${error.message}. Application was terminated! \n`;
            this.logger.error(message, error.stack);
            const valueOfMessage = message.length;
            const newFilePath = this.rotateLogFile(this.currentErrorLogFile, valueOfMessage, true);
            appendFileSync(newFilePath, message + '\n');
            appendFileSync(newFilePath, error.stack + '\n' + '\n');
        }
    }

    logUnhandledRejection(reason: any): void {
        if (this.logLevel >= 3) {
            const message = `[UNHANDLED REJECTION] - Message: ${reason.message} \n`;
            this.logger.warn(message);
            this.writeLogToFile(message);
        }
    }

    private rotateLogFile(filePath: string, value: number, isError: boolean): string {
        if (existsSync(filePath)) {
            const fileStats = statSync(filePath);
            const newSize = fileStats.size + value + 0.05 * this.MAX_FILE_SIZE;

            if (newSize > this.MAX_FILE_SIZE) {
                const timestamp = new Date().toISOString().replace(/:/g, '-').replace('T', '_').replace(/\..*$/, '');
                const fileName = isError ? 'errors' : 'logs';
                const newPathFile = join(filePath, '..', `${fileName}_${timestamp}.log`);
                writeFileSync(newPathFile, '');
                isError ? (this.currentErrorLogFile = newPathFile) : (this.currentLogFile = newPathFile);
                return newPathFile;
            }
        }

        return filePath;
    }

    private writeToFile(filePath: string, message: string, isError: boolean): void {
        const valueOfMessage = message.length;
        const newFilePath = this.rotateLogFile(filePath, valueOfMessage, isError);
        appendFile(newFilePath, message + '\n', 'utf8', (err) => {
            if (err) {
                throw err;
            }
        });
    }

    writeErrorLogToFile(error: string): void {
        this.writeToFile(this.currentErrorLogFile, error, true);
    }

    writeLogToFile(message: string): void {
        this.writeToFile(this.currentLogFile, message, false);
    }
}
