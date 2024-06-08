import { User as UserPrismaClient } from '@prisma/client';
import { User } from 'src/types/types';

export const transformUserResponse = (resUser: UserPrismaClient): User => {
    return {
        ...resUser,
        createdAt: new Date(resUser.createdAt).getTime(),
        updatedAt: new Date(resUser.updatedAt).getTime(),
    };
};

export const transformUsersResponse = (resUsers: UserPrismaClient[]): User[] => {
    return resUsers.map((user) => {
        return {
            ...user,
            createdAt: new Date(user.createdAt).getTime(),
            updatedAt: new Date(user.updatedAt).getTime(),
        };
    });
};
