import {JSON_RPC_PARSE_ERROR_CODE} from '../constants';

type JsonRpcParseErrorData = {
    cause: string;
};

export class JsonRpcParseError extends Error {
    readonly code: number;

    readonly data?: JsonRpcParseErrorData;

    constructor(data?: JsonRpcParseErrorData) {
        super('Parse error');

        this.code = JSON_RPC_PARSE_ERROR_CODE;
        this.data = data;
    }
}
