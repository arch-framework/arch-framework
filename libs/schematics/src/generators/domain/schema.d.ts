export interface DomainGeneratorSchema {
    name: string;
    publishable?: boolean;
    buildable?: boolean;
    importPath?: string;
    tags?: string;
}
