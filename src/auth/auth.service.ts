import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Token, TokenPayload, UserTokens } from 'src/types/types';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) {}

    async signup(dto: CreateUserDto) {
        const user = await this.userService.create(dto);
        return user;
    }

    async login(dto: CreateUserDto): Promise<UserTokens> {
        const user = await this.userService.findOneByLogin(dto.login);

        if (!user || !compareSync(dto.password, user.password)) {
            throw new ForbiddenException('Invalid login or password');
        }

        const tokens = this.generateTokens(user);
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        return {
            userId: user.id,
            login: user.login,
            ...tokens,
        };
    }

    async saveRefreshToken(userId: string, refreshToken: string) {
        const token = await this.prismaService.userTokens.findUnique({
            where: {
                userId,
            },
        });
        if (!token) {
            await this.prismaService.userTokens.create({
                data: {
                    userId,
                    refreshToken,
                },
            });
        } else {
            await this.prismaService.userTokens.update({
                where: {
                    userId,
                },
                data: {
                    refreshToken,
                },
            });
        }
    }

    async refresh(refreshTokenDto: RefreshTokenDto): Promise<Omit<UserTokens, 'userId' | 'login'>> {
        const { refreshToken } = refreshTokenDto;

        const token = await this.prismaService.userTokens.findUnique({
            where: {
                refreshToken,
            },
        });

        if (!token) {
            throw new ForbiddenException('Invalid refresh token');
        }

        if (this.isTokenExpired(refreshToken)) {
            throw new ForbiddenException('Refresh token is expired');
        }

        await this.prismaService.userTokens.delete({
            where: {
                refreshToken,
            },
        });

        const user = await this.userService.getUser(token.userId);

        return this.generateTokens(user);
    }

    private generateTokens(user: User): Token {
        const payload: TokenPayload = { userId: user.id, login: user.login };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.config.get('TOKEN_REFRESH_EXPIRE_TIME'),
            secret: this.config.get('JWT_SECRET_REFRESH_KEY'),
        });
        return {
            accessToken,
            refreshToken,
        };
    }

    private isTokenExpired(token: string): boolean {
        const jwt = this.jwtService.decode(token);
        return jwt['exp'] < Date.now() / 1000;
    }
}
