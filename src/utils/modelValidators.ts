import { ModelUUID } from 'src/types/types';
import { validateId } from './validateId';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export const checkEntityById = <T extends ModelUUID>(id: string, model: T): T => {
    if (!validateId(id)) {
        throw new BadRequestException(`Invalid id: ${id}. ID must be uuid v4`);
    }
    if (!model) {
        throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return model;
};
