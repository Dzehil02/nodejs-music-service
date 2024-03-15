import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { users } from '../../db-store/store';
import { createPassword } from 'src/utils/createPassword';
import { checkModelById } from 'src/utils/modelValidators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}
    getUser(id: string) {
        return checkModelById(id, users);
    }
    create(createUserDto: CreateUserDto) {
        const newUser = {
            id: createPassword(),
            ...createUserDto,
            version: 1,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        users.push(newUser);
        const resUser = { ...newUser };
        delete resUser.password;
        return resUser;
    }

    findAll() {
        // const resUsers = users.map((user) => {
        //     const resUser = { ...user };
        //     delete resUser.password;
        //     return resUser;
        // });
        // return resUsers;

        return this.prismaService.user.findMany();
    }

    findOne(id: string) {
        const user = this.getUser(id);
        const resUser = { ...user };
        delete resUser.password;
        return resUser;
    }

    update(id: string, updatePasswordDto: UpdatePasswordDto) {
        const user = this.getUser(id);
        if (user.password !== updatePasswordDto.oldPassword) {
            throw new ForbiddenException('Old password is wrong');
        }
        user.password = updatePasswordDto.newPassword;
        user.updatedAt = Date.now();
        user.version = user.version + 1;
        const resUser = { ...user };
        delete resUser.password;
        return resUser;
    }

    remove(id: string) {
        const user = this.getUser(id);
        users.splice(users.indexOf(user), 1);
    }
}
