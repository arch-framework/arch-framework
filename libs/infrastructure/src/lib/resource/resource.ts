import {HttpClient, HttpErrorResponse, HttpEvent, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {catchError, filter, map, Observable, throwError} from 'rxjs';

import {ArchLogger} from '@ng-arch/common';

import {ArchResource} from '../interfaces/resource';
import {ArchResourceUrlFactory} from '../interfaces/resource-url-factory';
import {ArchResourceMethod} from '../types';

@Injectable()
export abstract class ArchResourceAbstract<RequestParams extends Record<string, unknown> | void, ResponseData>
    implements ArchResource<RequestParams, ResponseData>
{
    protected abstract readonly service: string;

    protected abstract readonly method: ArchResourceMethod;

    protected abstract readonly endpoint: string;

    private readonly http: HttpClient;

    private readonly urlFactory: ArchResourceUrlFactory;

    protected readonly logger: ArchLogger;

    constructor(http: HttpClient, urlFactory: ArchResourceUrlFactory, logger: ArchLogger) {
        this.http = http;
        this.urlFactory = urlFactory;
        this.logger = logger;
    }

    request(params: RequestParams): Observable<ResponseData> {
        const url = this.urlFactory.create(this.service, this.endpoint, params);
        const baseRequest = new HttpRequest<void>(this.method, url, undefined, {withCredentials: true});
        const request = this.prepare(baseRequest, params) as HttpRequest<void>;

        this.logger.info(request, params);

        return this.http.request<ResponseData>(request).pipe(
            filter(<T>(event: HttpEvent<T>): event is HttpResponse<T> => event instanceof HttpResponse),
            map(response => this.processing(response, params)),
            catchError(error => this.error(error, params)),
        );
    }

    protected prepare(request: HttpRequest<void>, _params: RequestParams): HttpRequest<unknown> {
        return request;
    }

    protected processing(response: HttpResponse<unknown>, params: RequestParams): ResponseData {
        this.logger.info(response, params);
        return response.body as ResponseData;
    }

    protected error(error: HttpErrorResponse, params: RequestParams): Observable<never> {
        this.logger.warn(error, params);
        return throwError(() => error);
    }
}
