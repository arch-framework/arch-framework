import {ArchResourceServiceConfig} from '../types';

export interface ArchResourceUrlFactory {
    create(service: ArchResourceServiceConfig, endpoint: string, params: Record<string, unknown> | void): string;
}
