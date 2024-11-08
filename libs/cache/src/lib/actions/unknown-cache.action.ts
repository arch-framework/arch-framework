import type {ArchCacheActionPayload} from '../types';
import {BaseCacheAction} from './base-cache.action';

export class UnknownCacheAction<TKey, TValue> extends BaseCacheAction<TKey, TValue> {
    public constructor(payload: ArchCacheActionPayload<TKey, TValue>) {
        super(payload);
    }

    public toString(): string {
        return 'Cache unknown action';
    }
}
