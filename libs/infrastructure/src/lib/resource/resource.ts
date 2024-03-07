import {HttpClient, HttpErrorResponse, HttpEvent, HttpRequest, HttpResponse} from '@angular/common/http';
import {catchError, filter, map, Observable, throwError} from 'rxjs';

import {ArchLogger} from '@arch-framework/common';

import {ArchResource} from '../interfaces/resource';
import {ArchResourceUrlFactory} from '../interfaces/resource-url-factory';
import {ArchResourceMethod, ArchResourceServiceConfig, ArchResourceServiceConfigMap} from '../types';
import {ArchResourceServiceNotDefineError} from '../errors/resource-service-not-define.error';

export abstract class ArchResourceAbstract<RequestParams extends Record<string, string | number> | void, ResponseData>
    implements ArchResource<RequestParams, ResponseData>
{
    protected abstract readonly service: string;

    protected abstract readonly method: ArchResourceMethod;

    protected abstract readonly endpoint: string;

    private readonly http: HttpClient;

    private readonly urlFactory: ArchResourceUrlFactory;

    private readonly configMap: ArchResourceServiceConfigMap;

    protected readonly logger: ArchLogger;

    constructor(
        http: HttpClient,
        urlFactory: ArchResourceUrlFactory,
        configMap: ArchResourceServiceConfigMap,
        logger: ArchLogger,
    ) {
        this.http = http;
        this.urlFactory = urlFactory;
        this.configMap = configMap;
        this.logger = logger;
    }

    request(params: RequestParams): Observable<ResponseData> {
        const config = this.getConfig(this.configMap);
        const url = this.urlFactory.create(config, this.endpoint, params);
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

    private getConfig(configMap: ArchResourceServiceConfigMap): ArchResourceServiceConfig {
        const config = configMap.get(this.service);

        if (config === undefined) {
            throw new ArchResourceServiceNotDefineError(this.service);
        }

        return config;
    }
}
