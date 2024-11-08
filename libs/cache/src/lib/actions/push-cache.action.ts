import type {ArchCacheActionPayload} from '../types';
import {blue} from '../utils/colors';
import {BaseCacheAction} from './base-cache.action';

export class PushCacheAction<TKey, TValue> extends BaseCacheAction<TKey, TValue> {
    public constructor(payload: ArchCacheActionPayload<TKey, TValue>) {
        super(payload);
    }

    public toString(): string {
        return blue(`Cache push, duration ${this.duration}ms`);
    }
}
