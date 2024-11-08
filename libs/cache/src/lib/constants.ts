import type {ArchCacheOptions} from './types';
import {DJBHash} from './utils/DJBHash';

const hashBuilder = new DJBHash();

export const CACHE_DECORATOR_DEFAULT_OPTIONS: ArchCacheOptions = {
    debug: false,
    name: null,
    hashFn: (...args: unknown[]): number => hashBuilder.makeHash(JSON.stringify(args)),
};

export const COLOR_ESCAPE_CODE = {
    RESET: '\x1b[0m',
    BRIGHT: '\x1b[1m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
};
