import type {ArchCacheActionPayload} from '../types';
import {blue} from '../utils/colors';
import {BaseCacheAction} from './base-cache.action';

export class PullCacheAction<TKey, TValue> extends BaseCacheAction<TKey, TValue> {
    public constructor(payload: ArchCacheActionPayload<TKey, TValue>) {
        super(payload);
    }

    public toString(): string {
        return blue(`Cache pull, duration ${this.duration}ms`);
    }
}
