import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { ModelUUID } from 'src/types/types';
import { validateId } from '../../utils/validateId';

export const checkEntityById = <T extends ModelUUID>(id: string, models: Array<T>): T => {
    if (!validateId(id)) {
        throw new BadRequestException(`Invalid id: ${id}. ID must be uuid v4`);
    }
    const model = models.find((model) => model.id === id);
    if (!model) {
        throw new UnprocessableEntityException(`Entity with id ${id} does not exist`);
    }
    return model;
};
