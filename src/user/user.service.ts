import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { createPassword } from 'src/utils/createPassword';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkEntityById } from 'src/utils/modelValidators';
import { transformUserResponse, transformUsersResponse } from 'src/utils/transformUsersResponse';
import { User } from 'src/types/types';
import { User as UserPrismaClient } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService, private readonly config: ConfigService) {}
    async getUser(id: string): Promise<UserPrismaClient> {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
        });
        return checkEntityById(id, user);
    }
    async create(createUserDto: CreateUserDto): Promise<User> {
        const { login, password } = createUserDto;
        const hashedPassword = await this.hashPassword(password);

        const newUser = {
            id: createPassword(),
            login,
            password: hashedPassword,
        };

        const resUser = await this.prismaService.user.create({ data: newUser });
        return transformUserResponse(resUser);
    }

    async findAll(): Promise<User[]> {
        const users = await this.prismaService.user.findMany();
        return transformUsersResponse(users);
    }

    async findOne(id: string): Promise<User> {
        const user = await this.getUser(id);
        const resUser = { ...user };
        return transformUserResponse(resUser);
    }

    async update(id: string, updatePasswordDto: UpdatePasswordDto): Promise<User> {
        const user = await this.getUser(id);

        const { password } = user;
        const { oldPassword, newPassword } = updatePasswordDto;
        const passwordEquals = await compare(oldPassword, password);

        if (!passwordEquals) {
            throw new ForbiddenException('Old password is wrong');
        }

        const hashedNewPassword = await this.hashPassword(newPassword);

        const updatedUser = await this.prismaService.user.update({
            where: { id },
            data: {
                password: hashedNewPassword,
                version: user.version + 1,
            },
        });

        const resUser = { ...updatedUser };
        return transformUserResponse(resUser);
    }

    async remove(id: string): Promise<{ id: string }> {
        const user = await this.getUser(id);
        return await this.prismaService.user.delete({ where: { id: user.id }, select: { id: true } });
    }

    async findOneByLogin(login: string): Promise<UserPrismaClient> | null {
        const user = await this.prismaService.user.findFirst({
            where: {
                login: login,
            },
            select: {
                id: true,
                login: true,
                password: true,
                version: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return null;
        }

        return user;
    }

    private hashPassword(password: string): Promise<string> {
        return hash(password, Number(this.config.get('CRYPT_SALT')));
    }
}
