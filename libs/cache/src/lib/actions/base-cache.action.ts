import type {Nullable} from '@ng-arch/common';

import type {ArchCacheActionPayload} from '../types';
import type {ArchCacheAction} from '../interfaces';

export abstract class BaseCacheAction<TKey, TValue> implements ArchCacheAction<TValue> {
    protected readonly key: TKey;

    protected readonly value: Nullable<TValue>;

    protected readonly duration: number;

    protected constructor({key, value, duration}: ArchCacheActionPayload<TKey, TValue>) {
        this.key = key;
        this.value = value;
        this.duration = duration;
    }

    public getValue(): Nullable<TValue> {
        return this.value;
    }

    public abstract toString(): string;
}
