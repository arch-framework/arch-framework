import type {ArchCacheActionPayload} from '../types';
import {yellow} from '../utils/colors';
import {BaseCacheAction} from './base-cache.action';

export class MissCacheAction<TKey, TValue> extends BaseCacheAction<TKey, TValue> {
    public constructor(payload: ArchCacheActionPayload<TKey, TValue>) {
        super(payload);
    }

    public toString(): string {
        return yellow(`Cache miss, duration ${this.duration}ms`);
    }
}
