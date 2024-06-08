import { Exclude } from 'class-transformer';
import { User } from 'src/types/types';

export class UserResponse implements User {
    id: string;
    login: string;

    @Exclude()
    password: string;

    version: number;
    createdAt: number;
    updatedAt: number;

    constructor(user: User) {
        Object.assign(this, user);
    }
}
