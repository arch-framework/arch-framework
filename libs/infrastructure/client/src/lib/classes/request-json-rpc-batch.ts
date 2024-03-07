import {HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';

import {catchError, filter, finalize, first, map, Observable, ReplaySubject, switchMap, tap, throwError} from 'rxjs';
import {JsonRpcRequest, JsonRpcResponse} from '@arch-framework/infrastructure';
import {JsonRpcParseError} from '../errors/json-rpc-parse.error';
import {isJsonRpcError, isJsonRpcRequest, isJsonRpcResponse} from '../../../../src/lib/utils';

export class RequestJsonRpcBatch {
    static create(capacity: number): RequestJsonRpcBatch {
        return new RequestJsonRpcBatch(capacity);
    }

    private readonly capacity: number;

    private readonly requests: HttpRequest<JsonRpcRequest<unknown>>[] = [];

    private readonly $response = new ReplaySubject<HttpResponse<JsonRpcResponse<unknown>[]>>();

    private readonly response$ = this.$response.asObservable();

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    public handleBatchRequest(
        request: HttpRequest<JsonRpcRequest<unknown>>,
        delegate: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
        const body = this.requests.map(({body}) => body);

        return delegate.handle(this.requests[0].clone({body})).pipe(
            filter(
                (event: HttpEvent<JsonRpcResponse<unknown>[]>): event is HttpResponse<JsonRpcResponse<unknown>[]> =>
                    event instanceof HttpResponse,
            ),
            tap(event => this.$response.next(event)),
            catchError(error => {
                this.$response.error(error);
                return throwError(() => error);
            }),
            switchMap(() => this.handleRequest(request)),
            finalize(() => this.destroy()),
        );
    }

    public handleRequest(request: HttpRequest<JsonRpcRequest<unknown>>): Observable<HttpResponse<unknown>> {
        return this.response$.pipe(
            map(event => {
                if (event.body === null || !Array.isArray(event.body)) {
                    throw new JsonRpcParseError({
                        cause: 'Response body must be an array',
                    });
                }

                if (request.body === null || !isJsonRpcRequest(request.body)) {
                    throw new JsonRpcParseError({
                        cause: 'Request body must be an JSON-RPC data object',
                    });
                }

                return event.clone({
                    body: event.body.find(data => {
                        if (data === null || (!isJsonRpcResponse(data) && !isJsonRpcError(data))) {
                            throw new JsonRpcParseError({
                                cause: 'Response body must be an JSON-RPC data objects',
                            });
                        }

                        return request.body?.id === data.id;
                    }),
                });
            }),
            first(),
        );
    }

    public addRequest(request: HttpRequest<JsonRpcRequest<unknown>>): void {
        if (request.body === null || !isJsonRpcRequest(request.body)) {
            throw new JsonRpcParseError({
                cause: 'Request body must be an JSON-RPC data object',
            });
        }

        this.requests.push(request);
    }

    public isFull(): boolean {
        return this.requests.length === this.capacity;
    }

    private destroy(): void {
        this.$response.complete();
        this.requests.length = 0;
    }
}
