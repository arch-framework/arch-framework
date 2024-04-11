import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpContext} from '@angular/common/http';

import {faker} from '@faker-js/faker';
import {MockBuilder, ngMocks} from 'ng-mocks';

import {JsonRpcRequestFactory, JsonRpcResponseFactory} from '../../../../src/lib/testing';
import {ArchResourceBatchInterceptor} from './resource-batch.interceptor';
import {REQUEST_BATCH_MAP} from '../tokens/request-batch-map';
import {REQUEST_BATCH_METADATA} from '../tokens/request-batch-metadata';
import {JsonRpcParseError} from '../errors/json-rpc-parse.error';

describe(`${ArchResourceBatchInterceptor.name}`, () => {
    beforeEach(() => {
        return MockBuilder()
            .mock(HttpClientModule)
            .replace(HttpClientModule, HttpClientTestingModule)
            .provide({provide: HTTP_INTERCEPTORS, useClass: ArchResourceBatchInterceptor, multi: true})
            .provide({provide: REQUEST_BATCH_MAP, useValue: new Map()});
    });

    describe('#intercept()', () => {
        describe('Request must be processed without changes', () => {
            it('When is not made to the API gateway', () => {
                const client = ngMocks.findInstance(HttpClient);
                const httpMock = ngMocks.findInstance(HttpTestingController);
                const body = null;

                client.post('/other/path', body).subscribe();

                const req = httpMock.expectOne('/other/path');

                req.flush(body);
                httpMock.verify();

                expect(req.request.body).toEqual(body);
            });

            it('When the method is different from the POST', () => {
                const client = ngMocks.findInstance(HttpClient);
                const httpMock = ngMocks.findInstance(HttpTestingController);
                const body = null;

                client.get('/api/gateway').subscribe();

                const req = httpMock.expectOne('/api/gateway');

                req.flush(body);
                httpMock.verify();

                expect(req.request.body).toEqual(body);
            });

            it('When is not set REQUEST_BATCH_METADATA context', () => {
                const client = ngMocks.findInstance(HttpClient);
                const httpMock = ngMocks.findInstance(HttpTestingController);
                const context = new HttpContext().set(REQUEST_BATCH_METADATA, null);
                const body = null;

                client.post('/api/gateway', body, {context}).subscribe();

                const req = httpMock.expectOne('/api/gateway');

                req.flush(body);
                httpMock.verify();

                expect(req.request.body).toEqual(body);
            });
        });

        describe('Separate requests are combined into a batch request', () => {
            describe('When a single request', () => {
                it('Then request body is wrapped in an array', () => {
                    const client = ngMocks.findInstance(HttpClient);
                    const httpMock = ngMocks.findInstance(HttpTestingController);
                    const context = new HttpContext().set(REQUEST_BATCH_METADATA, {
                        id: faker.string.uuid(),
                        capacity: 1,
                    });
                    const body = JsonRpcRequestFactory.build();

                    client.post('/api/gateway', body, {context}).subscribe();

                    const req = httpMock.expectOne('/api/gateway');

                    req.flush(null);
                    httpMock.verify();

                    expect(Array.isArray(req.request.body)).toBeTruthy();
                    expect(req.request.body).toHaveLength(1);
                    expect(req.request.body).toContainEqual(body);
                });

                it('Then response data is unwrapped from array', done => {
                    const client = ngMocks.findInstance(HttpClient);
                    const httpMock = ngMocks.findInstance(HttpTestingController);
                    const context = new HttpContext().set(REQUEST_BATCH_METADATA, {
                        id: faker.string.uuid(),
                        capacity: 1,
                    });
                    const body = JsonRpcRequestFactory.build();
                    const result = JsonRpcResponseFactory.build({id: body.id});

                    client.post('/api/gateway', body, {context}).subscribe(res => {
                        expect(res).toEqual(result);

                        done();
                    });

                    const req = httpMock.expectOne('/api/gateway');

                    req.flush([result]);
                    httpMock.verify();
                });
            });

            describe('When a multiple request', () => {
                it('Then request not be handled', () => {
                    const client = ngMocks.findInstance(HttpClient);
                    const httpMock = ngMocks.findInstance(HttpTestingController);
                    const context = new HttpContext().set(REQUEST_BATCH_METADATA, {
                        id: faker.string.uuid(),
                        capacity: 2,
                    });
                    const body = JsonRpcRequestFactory.build();

                    client.post('/api/gateway', body, {context}).subscribe();

                    const req = httpMock.expectOne('/api/gateway');

                    httpMock.verify();

                    expect(Array.isArray(req.request.body)).toBeTruthy();
                    expect(req.request.body).toHaveLength(1);
                    expect(req.request.body).toContainEqual(body);
                });
            });
        });

        describe('Server responds with invalid data', () => {
            describe('When the server responds null', () => {
                it('Then error JsonRpcParseError is thrown', done => {
                    const client = ngMocks.findInstance(HttpClient);
                    const httpMock = ngMocks.findInstance(HttpTestingController);
                    const context = new HttpContext().set(REQUEST_BATCH_METADATA, {
                        id: faker.string.uuid(),
                        capacity: 1,
                    });
                    const body = JsonRpcRequestFactory.build();

                    client.post('/api/gateway', body, {context}).subscribe({
                        next: () => fail('should have failed with the JsonRpcParseError'),
                        error: (error: Error) => {
                            expect(error).toBeInstanceOf(JsonRpcParseError);
                            expect(error).toHaveProperty('data.cause', 'Response body must be an array');
                            done();
                        },
                    });

                    const req = httpMock.expectOne('/api/gateway');

                    req.flush(null);
                    httpMock.verify();
                });
            });

            describe('When the server responds invalid JSON-RPC data object', () => {
                it('Then error JsonRpcParseError is thrown', done => {
                    const client = ngMocks.findInstance(HttpClient);
                    const httpMock = ngMocks.findInstance(HttpTestingController);
                    const context = new HttpContext().set(REQUEST_BATCH_METADATA, {
                        id: faker.string.uuid(),
                        capacity: 1,
                    });
                    const body = JsonRpcRequestFactory.build();

                    client.post('/api/gateway', body, {context}).subscribe({
                        next: () => fail('should have failed with the JsonRpcParseError'),
                        error: (error: Error) => {
                            expect(error).toBeInstanceOf(JsonRpcParseError);
                            expect(error).toHaveProperty(
                                'data.cause',
                                'Response body must be an JSON-RPC data objects',
                            );
                            done();
                        },
                    });

                    const req = httpMock.expectOne('/api/gateway');

                    req.flush([null]);
                    httpMock.verify();
                });
            });
        });
    });
});
