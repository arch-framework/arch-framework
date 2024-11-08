import type {Nullable} from '@ng-arch/common';

export interface ArchCacheAction<T> {
    getValue(): Nullable<T>;

    toString(): string;
}

export interface ArchCacheStrategy<TKey, TValue> {
    get(key: TKey): Generator<ArchCacheAction<TValue>, void, undefined>;

    set(key: TKey, value: TValue): Generator<ArchCacheAction<TValue>, void, undefined>;

    clear(): void;

    toString(): string;
}

export interface HashBuilder {
    makeHash(key: string): number;
}
