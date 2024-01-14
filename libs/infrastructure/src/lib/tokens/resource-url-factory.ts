import {ArchResourceUrlFactory} from '../interfaces/resource-url-factory';
import {ArchResourceServiceConfig} from '../types';

export abstract class ArchResourceUrlFactoryToken implements ArchResourceUrlFactory {
    public abstract create(
        service: ArchResourceServiceConfig,
        endpoint: string,
        params: Record<string, string | number>,
    ): string;
}
