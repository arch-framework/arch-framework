import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {finalize, Observable} from 'rxjs';

import {JsonRpcRequest} from '@ng-arch/infrastructure';

import {RequestJsonRpcBatch} from '../classes/request-json-rpc-batch';
import {REQUEST_BATCH_METADATA} from '../tokens/request-batch-metadata';
import {REQUEST_BATCH_MAP} from '../tokens/request-batch-map';
import {RequestBatchMetadata} from '../types';

@Injectable()
export class ArchResourceBatchInterceptor implements HttpInterceptor {
    constructor(@Inject(REQUEST_BATCH_MAP) private readonly batches: Map<string, RequestJsonRpcBatch>) {}

    intercept(req: HttpRequest<JsonRpcRequest<unknown>>, delegate: HttpHandler): Observable<HttpEvent<unknown>> {
        const metadata = req.context.get(REQUEST_BATCH_METADATA);

        if (!req.url.includes('/api/gateway') || req.method.toUpperCase() !== 'POST' || metadata === null) {
            return delegate.handle(req);
        }

        const batch = this.makeRequestBatch(metadata);

        batch.addRequest(req);
        return batch.isFull()
            ? batch.handleBatchRequest(req, delegate).pipe(finalize(() => this.batches.delete(metadata.id)))
            : batch.handleRequest(req);
    }

    private makeRequestBatch({id, capacity}: RequestBatchMetadata): RequestJsonRpcBatch {
        if (this.batches.has(id)) {
            return this.batches.get(id) as RequestJsonRpcBatch;
        } else {
            const batch = RequestJsonRpcBatch.create(capacity);

            this.batches.set(id, batch);

            return batch;
        }
    }
}
