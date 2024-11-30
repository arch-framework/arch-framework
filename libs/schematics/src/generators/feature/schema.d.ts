import {ComponentGeneratorLocationOptions} from '../../types';

export interface FeatureGeneratorSchema extends ComponentGeneratorLocationOptions {
    name: string;
    publishable?: boolean;
    buildable?: boolean;
    importPath?: string;
    tags?: string;
}
