import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

export const getSwaggerDocument = () => {
    const pathToApiYaml = join(__dirname, '../../doc/api.yaml');
    const file = readFileSync(pathToApiYaml, 'utf8');
    return parse(file);
};
