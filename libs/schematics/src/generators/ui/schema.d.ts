import {ComponentGeneratorLocationOptions} from '../../types';

export interface UiGeneratorSchema extends ComponentGeneratorLocationOptions {
    name: string;
    publishable?: boolean;
    buildable?: boolean;
    importPath?: string;
    tags?: string;
}
