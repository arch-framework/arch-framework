import {ComponentGeneratorLocationOptions} from '../types';

export function componentGeneratorOptionsValidator(options: ComponentGeneratorLocationOptions): void {
    if (options.shared && options.domain) {
        throw new Error('A UI library should either belong to a specific domain or be shared globally');
    }

    if (!options.shared && !options.domain) {
        throw new Error(`A UI library should either belong to a domain or be shared globally.
      Please provide either of these two options: --domain / --shared`);
    }
}
