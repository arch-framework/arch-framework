import {ArchIdGeneratorToken} from '../../tokens/id-generator';

export class ArchIdGeneratorRandomTimestamp extends ArchIdGeneratorToken {
    generateId(): string {
        return String(Math.floor(Math.random() * Date.now()));
    }
}
