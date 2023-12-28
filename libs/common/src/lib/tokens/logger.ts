import {ArchLogger} from '../interfaces/logger';

export abstract class ArchLoggerToken implements ArchLogger {
    public abstract info(...data: unknown[]): void;

    public abstract log(...data: unknown[]): void;

    public abstract warn(...data: unknown[]): void;
}
