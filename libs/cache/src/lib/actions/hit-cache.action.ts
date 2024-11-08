import type {ArchCacheActionPayload} from '../types';
import {green} from '../utils/colors';
import {BaseCacheAction} from './base-cache.action';

export class HitCacheAction<TKey, TValue> extends BaseCacheAction<TKey, TValue> {
    public constructor(payload: ArchCacheActionPayload<TKey, TValue>) {
        super(payload);
    }

    public toString(): string {
        return green(`Cache hit: value - ${this.value}, duration - ${this.duration}ms`);
    }
}
