export interface ArchLogger {
    log(...data: unknown[]): void;

    info(...data: unknown[]): void;

    warn(...data: unknown[]): void;
}
