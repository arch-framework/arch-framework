export enum ArchResourceMethod {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Patch = 'PATCH',
    Delete = 'DELETE',
}

export enum ArchResourceServiceKind {
    ApiGateway = 'api-gateway',
}

export type ArchResourceServiceConfig = {
    protocol: 'http' | 'https';
    host: string;
    port: number;
    prefix: string;
};

export type ArchResourceServiceConfigMap = Map<string, ArchResourceServiceConfig>;

export type JsonRpcRequest<T> = {
    jsonrpc: '2.0';
    method: string;
    params?: T;
    id: string;
};

export type JsonRpcResponse<T> = {
    jsonrpc: '2.0';
    result: T;
    id: string;
};

export type JsonRpcError<T> = {
    jsonrpc: '2.0';
    error: {
        code: number;
        message: string;
        data?: T;
    };
    id: string;
};

export type JsonRpcData<T> = JsonRpcRequest<T> | JsonRpcResponse<T> | JsonRpcError<T>;
