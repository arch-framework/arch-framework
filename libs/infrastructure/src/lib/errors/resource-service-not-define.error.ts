export class ArchResourceServiceNotDefineError extends TypeError {
    constructor(service: string) {
        super(`Configuration for "${service}" service not define`);
    }
}
