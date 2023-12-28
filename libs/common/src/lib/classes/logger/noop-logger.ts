import {ArchLoggerToken} from '../../tokens/logger';

export class NoopArchLogger extends ArchLoggerToken {
    info(): void {
        return undefined;
    }

    log(): void {
        return undefined;
    }

    warn(): void {
        return undefined;
    }
}
