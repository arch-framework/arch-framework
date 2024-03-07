import {ModuleWithProviders, NgModule, Type} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {ArchResource, ArchResourceServiceConfig} from '@arch-framework/infrastructure';
import {ArchLoggerToken, ArchLoggerNoop} from '@arch-framework/common';

import {ArchResourceClient} from './resource-client.imp';
import {ArchResourceUrlFactoryToken} from '../../../src/lib/tokens/resource-url-factory';
import {ArchResourceRegexUrlFactory} from '../../../src/lib/resource/resource-regex-url-factory';
import {ARCH_RESOURCE_SERVICE_CONFIG_MAP_TOKEN} from '../../../src/lib/tokens/resource-service-config-map';
import {ArchResourceBatchInterceptor} from './intercepters/resource-batch.interceptor';
import {REQUEST_BATCH_MAP} from './tokens/request-batch-map';

type ArchInfrastructureClientModuleConfig = {
    resources: Type<ArchResource<unknown, unknown>>[];
    gateway: ArchResourceServiceConfig;
};

@NgModule({})
export class ArchInfrastructureClientModule {
    static forRoot({
        resources,
        gateway,
    }: ArchInfrastructureClientModuleConfig): ModuleWithProviders<ArchInfrastructureClientModule> {
        return {
            ngModule: ArchInfrastructureClientModule,
            providers: [
                {
                    provide: REQUEST_BATCH_MAP,
                    useValue: new Map(),
                },
                {
                    provide: ARCH_RESOURCE_SERVICE_CONFIG_MAP_TOKEN,
                    useValue: new Map([['api-gateway', gateway]]),
                },
                {
                    provide: ArchResourceUrlFactoryToken,
                    useClass: ArchResourceRegexUrlFactory,
                },
                {
                    provide: ArchLoggerToken,
                    useClass: ArchLoggerNoop,
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: ArchResourceBatchInterceptor,
                    multi: true,
                },
                ...resources.map(resource => ({
                    provide: resource,
                    useClass: ArchResourceClient,
                })),
            ],
        };
    }
}
