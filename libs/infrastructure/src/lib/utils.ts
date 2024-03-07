import {JsonRpcData, JsonRpcError, JsonRpcRequest, JsonRpcResponse} from './types';

/**
 * Checks if the given data is a JSON-RPC request.
 *
 * @param {JsonRpcData<T>} data - the data to be checked
 * @return {data is JsonRpcRequest<T>} true if the data is a JSON-RPC request, false otherwise
 */
export function isJsonRpcRequest<T>(data: JsonRpcData<T>): data is JsonRpcRequest<T> {
    return data.jsonrpc === '2.0' && data.id !== undefined && (data as JsonRpcRequest<T>).method !== undefined;
}

/**
 * Checks if the given data is a JSON-RPC response.
 *
 * @param {JsonRpcData<T>} data - the data to be checked
 * @return {data is JsonRpcResponse<T>} true if the data is a JSON-RPC response, false otherwise
 */
export function isJsonRpcResponse<T>(data: JsonRpcData<T>): data is JsonRpcResponse<T> {
    return data.jsonrpc === '2.0' && data.id !== undefined && (data as JsonRpcResponse<T>).result !== undefined;
}

/**
 * Checks if the provided JSON-RPC data is an error response.
 *
 * @param {JsonRpcData<T>} data - The JSON-RPC data to be checked
 * @return {data is JsonRpcError<T>} Whether the provided data is a JSON-RPC error
 */
export function isJsonRpcError<T>(data: JsonRpcData<T>): data is JsonRpcError<T> {
    return data.jsonrpc === '2.0' && data.id !== undefined && (data as JsonRpcError<T>).error !== undefined;
}

/**
 * Checks if the provided data is a valid JSON-RPC data object.
 *
 * @param {JsonRpcData<unknown>} data - The JSON-RPC data object to be checked.
 * @return {boolean} Whether the provided data is valid JSON-RPC data.
 */
export function isJsonRpcData(data: JsonRpcData<unknown>): boolean {
    return data.jsonrpc === '2.0' && data.id !== undefined;
}
