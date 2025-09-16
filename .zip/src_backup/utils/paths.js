import path from 'path';
import { register } from '../../../tsconfig-paths.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const baseUrl = path.dirname(path.dirname(path.dirname(__filename)));

register({
    baseUrl,
    paths: {
        '@': [baseUrl],
        '@function/*': [path.join(baseUrl, 'src/api/v1/functions/*')],
        '@core/*': [path.join(baseUrl, 'src/core/*')]
    }
});
