import {ArchIdGenerator} from '../interfaces/id-generator';

export abstract class ArchIdGeneratorToken implements ArchIdGenerator {
    abstract generateId(): string;
}
