import {type ArchCacheActionPayload, ArchCacheActionType} from '../types';
import type {BaseCacheAction} from './base-cache.action';
import {HitCacheAction} from './hit-cache.action';
import {MissCacheAction} from './miss-cache.action';
import {PushCacheAction} from './push-cache.action';
import {PullCacheAction} from './pull-cache.action';
import {UnknownCacheAction} from './unknown-cache.action';

export class ActionFactory {
    public create<TKey, TValue>(
        type: ArchCacheActionType,
        payload: ArchCacheActionPayload<TKey, TValue>,
    ): BaseCacheAction<TKey, TValue> {
        const {HIT, MISS, PUSH, PULL} = ArchCacheActionType;
        switch (type) {
            case HIT:
                return new HitCacheAction(payload);
            case MISS:
                return new MissCacheAction(payload);
            case PUSH:
                return new PushCacheAction(payload);
            case PULL:
                return new PullCacheAction(payload);
            default:
                return new UnknownCacheAction(payload);
        }
    }
}
