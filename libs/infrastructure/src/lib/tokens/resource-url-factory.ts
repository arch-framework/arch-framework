import {ArchResourceUrlFactory} from '../interfaces/resource-url-factory';

export abstract class ArchResourceUrlFactoryToken implements ArchResourceUrlFactory {
    public abstract create(service: string, endpoint: string, params: Record<string, unknown>): string;
}
