import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @UsePipes(new ValidationPipe())
    async signup(@Body() dto: CreateUserDto) {
        const user = await this.authService.signup(dto);
        if (!user) {
            throw new BadRequestException(`Failed to create user with ${JSON.stringify(dto)}`);
        }
        return user;
    }

    @Post('login')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    async login(@Body() dto: CreateUserDto) {
        const tokens = await this.authService.login(dto);
        if (!tokens) {
            throw new BadRequestException(`Can't login with credentials ${JSON.stringify(dto)}`);
        }
        return tokens;
    }

    @Post('refresh')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    async refresh(@Body() dto: RefreshTokenDto) {
        const tokens = await this.authService.refresh(dto);
        return tokens;
    }
}
