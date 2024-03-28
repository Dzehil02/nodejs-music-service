import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getSwaggerDocument } from './utils/getSwaggerDoc';
import { config } from 'dotenv';
import { serve, setup } from 'swagger-ui-express';
import { AppLoggingService } from './logger/appLoggingService';

config();
const PORT = process.env.PORT || 4000;

async function bootstrap() {
    const swaggerDocument = getSwaggerDocument();
    const app = await NestFactory.create(AppModule);
    app.use('/doc', serve, setup(swaggerDocument));
    const loggingService = app.get(AppLoggingService);

    process.on('unhandledRejection', (err) => {
        loggingService.logUnhandledRejection(err);
    });

    process.on('uncaughtException', (err) => {
        loggingService.logUncaughtException(err);
        process.exit(1);
    });

    await app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}
bootstrap();
