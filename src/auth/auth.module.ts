import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { options } from './config/jwt-module-options';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
    controllers: [AuthController],
    providers: [AuthService, PrismaService, JwtStrategy, JwtAuthGuard],
    imports: [PassportModule, UserModule, JwtModule.registerAsync(options())],
})
export class AuthModule {}
