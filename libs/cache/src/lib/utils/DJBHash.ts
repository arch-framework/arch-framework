import type {HashBuilder} from '../interfaces';

export class DJBHash implements HashBuilder {
    public static START_HASH = 5381;

    public makeHash(key: string): number {
        const length = key.length;
        let hash: number = DJBHash.START_HASH;

        if (length === 0) {
            return hash;
        }

        for (let i = 0; i < length; i++) {
            hash = (hash << 5) + hash + this.getCodeAt(key, i);
        }

        return hash;
    }

    private getCodeAt(str: string, position: number): number {
        if (String.prototype.codePointAt !== undefined) {
            return str.codePointAt(position) || 0;
        }

        return str.charCodeAt(position);
    }
}
