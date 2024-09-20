export interface ArchResourceUrlFactory {
    create(service: string, endpoint: string, params: Record<string, unknown> | void): string;
}
