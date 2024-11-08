import type {ArchLogger} from '@ng-arch/common';

export class ConsoleCacheLogger implements ArchLogger {
    public static dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
    };

    public static locales: string | Array<string> = 'en-US';

    public static get formatter(): Intl.DateTimeFormat {
        if (this._formatter !== undefined) {
            return this._formatter;
        }

        this._formatter = new Intl.DateTimeFormat(this.locales, this.dateTimeFormatOptions);

        return this._formatter;
    }

    private static _formatter: Intl.DateTimeFormat;

    readonly #scope: string;

    public constructor(scope: string) {
        this.#scope = scope;
    }

    public log(message: string): void {
        const time = ConsoleCacheLogger.formatter.format(new Date());

        // eslint-disable-next-line no-console
        console.log(`${time} [${this.#scope}] ${message}`);
    }

    public info(message: string): void {
        this.log(message);
    }

    public warn(message: string): void {
        this.log(message);
    }
}
