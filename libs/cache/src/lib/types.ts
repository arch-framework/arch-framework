import type {Nullable} from '@ng-arch/common';

export type ArchCacheOptions = {
    debug: boolean;
    name: Nullable<string>;
    hashFn: (...args: any[]) => any;
};

export enum ArchCacheActionType {
    HIT,
    MISS,
    PUSH,
    PULL,
}

export type ArchCacheActionPayload<TKey, TValue> = {
    key: TKey;
    value: Nullable<TValue>;
    duration: number;
};
