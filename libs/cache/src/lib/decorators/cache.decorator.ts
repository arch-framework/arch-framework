import {of, tap} from 'rxjs';

import {ArchLoggerNoop, type Type} from '@ng-arch/common';

import type {ArchCacheOptions} from '../types';
import {ConsoleCacheLogger} from '../loggers/console-cache-logger';
import {ArchCache} from '../classes/cache';
import {isPromise} from '../utils/is-promise';
import {isObservable} from '../utils/is-observable';
import {CACHE_DECORATOR_DEFAULT_OPTIONS} from '../constants';
import type {ArchCacheStrategy} from '../interfaces';

export function ArchCacheDecorator(
    capacity: number,
    strategy: Type<ArchCacheStrategy<unknown, unknown>>,
    options: Partial<ArchCacheOptions> = {},
): MethodDecorator {
    const {debug, name, hashFn} = Object.assign({}, CACHE_DECORATOR_DEFAULT_OPTIONS, options);

    return (
        target: any,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<any>,
    ): TypedPropertyDescriptor<any> => {
        if (typeof target[key] !== 'function') {
            throw new Error('Object to be decorated must be a function');
        }

        const origin = target[key];
        const scope = name || origin.name;
        const logger = debug ? new ConsoleCacheLogger(scope) : new ArchLoggerNoop();
        const cache = new ArchCache<number, unknown>(new strategy(capacity), logger);
        let isReturnPromise = false;
        let isReturnObservable = false;

        descriptor.value = function (...args: any[]): any {
            const hash = hashFn(args);
            const hit = cache.get(hash);

            if (hit !== null) {
                if (isReturnPromise) {
                    return Promise.resolve(hit);
                } else if (isReturnObservable) {
                    return of(hit);
                }

                return hit;
            }

            const result = origin.apply(this, args);

            if (isPromise(result)) {
                isReturnPromise = true;

                return result.then(value => {
                    cache.set(hash, value);

                    return value;
                });
            } else if (isObservable(result)) {
                isReturnObservable = true;

                return result.pipe(
                    tap(value => {
                        cache.set(hash, value);
                    }),
                );
            }

            return result;
        };

        return descriptor;
    };
}
