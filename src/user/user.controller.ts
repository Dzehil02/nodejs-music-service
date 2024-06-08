import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    HttpCode,
    HttpStatus,
    UsePipes,
    ValidationPipe,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserResponse } from './responses/user.response';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe())
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.create(createUserDto);
        return new UserResponse(user);
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll() {
        const users = await this.userService.findAll();
        const usersResponse = users.map((user) => new UserResponse(user));
        return usersResponse;
    }

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id') id: string) {
        const user = await this.userService.findOne(id);
        return new UserResponse(user);
    }

    @Put(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe())
    async update(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
        const user = await this.userService.update(id, updatePasswordDto);
        return new UserResponse(user);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
