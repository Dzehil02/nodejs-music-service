import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { options, options2 } from './config/jwt-module-options';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [PassportModule, UserModule, JwtModule.registerAsync(options()), JwtModule.registerAsync(options2())],
})
export class AuthModule {}
