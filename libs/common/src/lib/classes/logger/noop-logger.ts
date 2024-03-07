import {ArchLoggerToken} from '../../tokens/logger';

export class ArchLoggerNoop extends ArchLoggerToken {
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
