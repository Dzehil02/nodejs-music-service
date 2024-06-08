import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
    secret: config.get('JWT_SECRET_KEY'),
    signOptions: {
        expiresIn: config.get('TOKEN_EXPIRE_TIME', '5m'),
    },
});

export const options = (): JwtModuleAsyncOptions => ({
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => jwtModuleOptions(config),
});
