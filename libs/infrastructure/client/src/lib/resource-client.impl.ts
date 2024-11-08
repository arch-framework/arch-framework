import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpContext, HttpRequest} from '@angular/common/http';

import {v4 as uuid} from 'uuid';

import {ArchLogger, ArchLoggerToken} from '@ng-arch/common';
import {
    ArchResourceAbstract,
    ArchResourceMethod,
    ArchResourceServiceKind,
    ArchResourceUrlFactory,
    ArchResourceUrlFactoryToken,
    JsonRpcRequest,
} from '@ng-arch/infrastructure';

import {REQUEST_BATCH_METADATA} from './tokens/request-batch-metadata';

export type ArchResourceClientParams = {
    __method: string;
    __id: string;
    __capacity: number;
    [p: string]: string | number;
};

export type ArchResourceClientResult = void;

@Injectable()
export class ArchResourceClientImpl extends ArchResourceAbstract<ArchResourceClientParams, ArchResourceClientResult> {
    override service = ArchResourceServiceKind.ApiGateway;

    override method = ArchResourceMethod.Post;

    override endpoint = '';

    constructor() {
        super(
            inject(HttpClient),
            inject<ArchResourceUrlFactory>(ArchResourceUrlFactoryToken),
            inject<ArchLogger>(ArchLoggerToken),
        );
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
