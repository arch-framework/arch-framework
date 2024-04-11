import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpContext, HttpRequest} from '@angular/common/http';

import {v4 as uuid} from 'uuid';

import {
    ArchResourceAbstract,
    ArchResourceMethod,
    ArchResourceServiceConfigMap,
    ArchResourceUrlFactory,
    JsonRpcRequest,
} from '@arch-framework/infrastructure';
import {ArchLogger, ArchLoggerToken} from '@arch-framework/common';

import {ArchResourceUrlFactoryToken} from '../../../src/lib/tokens/resource-url-factory';
import {ARCH_RESOURCE_SERVICE_CONFIG_MAP_TOKEN} from '../../../src/lib/tokens/resource-service-config-map';
import {REQUEST_BATCH_METADATA} from './tokens/request-batch-metadata';

export type ArchResourceClientParams = {
    __method: string;
    __id: string;
    __capacity: number;
    [p: string]: string | number;
};

export type ArchResourceClientResult = void;

@Injectable()
export class ArchResourceClient extends ArchResourceAbstract<ArchResourceClientParams, ArchResourceClientResult> {
    override service = 'api-gateway';

    override method = ArchResourceMethod.Post;

    override endpoint = 'gateway';

    constructor(
        http: HttpClient,
        @Inject(ArchResourceUrlFactoryToken) url: ArchResourceUrlFactory,
        @Inject(ARCH_RESOURCE_SERVICE_CONFIG_MAP_TOKEN) config: ArchResourceServiceConfigMap,
        @Inject(ArchLoggerToken) logger: ArchLogger,
    ) {
        super(http, url, config, logger);
    }

    override prepare(
        request: HttpRequest<void>,
        {__method, __id, __capacity, ...params}: ArchResourceClientParams,
    ): HttpRequest<JsonRpcRequest<unknown>> {
        return request.clone({
            body: {
                jsonrpc: '2.0',
                method: __method,
                params,
                id: uuid(),
            },
            setHeaders: {
                'Content-Type': 'application/json',
            },
            context: new HttpContext().set(REQUEST_BATCH_METADATA, {
                id: __id,
                capacity: __capacity,
            }),
        });
    }
}
