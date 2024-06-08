import { validate as uuidValidate } from 'uuid';

export const validateId = (id: string): boolean => uuidValidate(id);
