import { HttpException, HttpStatus } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsInvalidRefreshToken(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsInvalidRefreshToken',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (
                        value === null ||
                        value === undefined ||
                        typeof value !== 'string' ||
                        value.trim().length === 0
                    ) {
                        throw new HttpException(
                            `${propertyName} must be a string and must not be empty.`,
                            HttpStatus.UNAUTHORIZED,
                        );
                    }
                    return true;
                },
            },
        });
    };
}
