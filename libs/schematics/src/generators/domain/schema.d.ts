export interface DomainGeneratorSchema {
    name: string;
    standalone?: boolean;
    publishable?: boolean;
    buildable?: boolean;
    importPath?: string;
    tags?: string;
}
