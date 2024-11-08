import type {LRUCacheDecoratorOptions} from '../types';
import {CACHE_DECORATOR_DEFAULT_OPTIONS} from '../constants';

export function extendOptions(options: Partial<LRUCacheDecoratorOptions>): LRUCacheDecoratorOptions {
    return Object.assign({}, CACHE_DECORATOR_DEFAULT_OPTIONS, options);
}
