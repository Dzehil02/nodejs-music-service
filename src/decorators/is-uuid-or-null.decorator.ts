import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { validateId } from '../utils/validateId';

export function IsUuidOrNull(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isUuidOrNull',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (value === null || value === undefined) {
                        return true;
                    }
                    return typeof value === 'string' && validateId(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid UUID v4 or null.`;
                },
            },
        });
    };
}
