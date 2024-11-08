import type {ArchLogger, Nullable} from '@ng-arch/common';

import type {ArchCacheStrategy} from '../interfaces';

export class ArchCache<TKey, TValue> {
    readonly #strategy: ArchCacheStrategy<TKey, TValue>;

    readonly #logger: ArchLogger;

    public constructor(strategy: ArchCacheStrategy<TKey, TValue>, logger: ArchLogger) {
        this.#strategy = strategy;
        this.#logger = logger;
    }

    public get(key: TKey): Nullable<TValue> {
        let value: Nullable<TValue> = null;

        for (const action of this.#strategy.get(key)) {
            this.#logger.log(action.toString());
            value = action.getValue();
        }

        return value;
    }

    public set(key: TKey, value: TValue): void {
        for (const action of this.#strategy.set(key, value)) {
            this.#logger.log(action.toString());
        }
    }

    public info(): void {
        this.#logger.log(this.#strategy.toString());
    }
}
