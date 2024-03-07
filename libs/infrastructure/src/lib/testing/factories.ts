import {faker} from '@faker-js/faker';
import {Sync as Factory} from 'factory.ts';

import {JsonRpcRequest, JsonRpcResponse} from '../types';

export const JsonRpcRequestFactory = Factory.makeFactory<JsonRpcRequest<unknown>>({
    jsonrpc: '2.0',
    method: Factory.each(() => faker.hacker.verb()),
    params: {
        foo: 'foo',
        bar: 'bar',
        baz: 'baz',
    },
    id: Factory.each(() => faker.string.uuid()),
});
export const JsonRpcResponseFactory = Factory.makeFactory<JsonRpcResponse<unknown>>({
    jsonrpc: '2.0',
    result: null,
    id: Factory.each(() => faker.string.uuid()),
});
