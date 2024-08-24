import {EnvironmentProviders, makeEnvironmentProviders, Provider, Type} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {
    ARCH_RESOURCE_SERVICE_CONFIG_MAP_TOKEN,
    ArchResource,
    ArchResourceRegexUrlFactory,
    ArchResourceServiceConfig,
    ArchResourceServiceKind,
    ArchResourceUrlFactoryToken,
} from '@ng-arch/infrastructure';
import {ArchLoggerNoop, ArchLoggerToken} from '@ng-arch/common';

import {
    ArchInfrastructureClientFeatureKind,
    ArchInfrastructureClientFeatures,
    ArchInfrastructureClientGatewayFeature,
    ArchInfrastructureClientResourceServiceMapFeature,
} from './types';
import {REQUEST_BATCH_MAP} from './tokens/request-batch-map';
import {ArchResourceBatchInterceptor} from './intercepters/resource-batch.interceptor';
import {ArchResourceClientImpl} from './resource-client.impl';

export function provideArchInfrastructureClient(feature: ArchInfrastructureClientFeatures): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: ArchResourceUrlFactoryToken,
            useClass: ArchResourceRegexUrlFactory,
        },
        {
            provide: ArchLoggerToken,
            useClass: ArchLoggerNoop,
        },
        ...feature().providers,
    ]);
}

export function provideArchResourcesForApiGateway(...resources: Type<ArchResource<unknown, unknown>>[]): Provider[] {
    return resources.map(resource => ({
        provide: resource,
        useClass: ArchResourceClientImpl,
    }));
}

export function provideArchResources(...resources: Type<ArchResource<unknown, unknown>>[]): Provider[] {
    return resources.map(resource => ({
        provide: resource,
        useClass: resource,
    }));
}

export function withApiGateway(gateway: ArchResourceServiceConfig): () => ArchInfrastructureClientGatewayFeature {
    return () => ({
        kind: ArchInfrastructureClientFeatureKind.ProvideGateway,
        providers: [
            {
                provide: REQUEST_BATCH_MAP,
                useValue: new Map(),
            },
            {
                provide: ARCH_RESOURCE_SERVICE_CONFIG_MAP_TOKEN,
                useValue: new Map([[ArchResourceServiceKind.ApiGateway, gateway]]),
            },
            {
                provide: HTTP_INTERCEPTORS,
                useClass: ArchResourceBatchInterceptor,
                multi: true,
            },
        ],
    });
}

export function withResourceServiceMap(
    services: Record<string, ArchResourceServiceConfig>,
): () => ArchInfrastructureClientResourceServiceMapFeature {
    return () => ({
        kind: ArchInfrastructureClientFeatureKind.ProvideResourceServiceMap,
        providers: [
            {
                provide: ARCH_RESOURCE_SERVICE_CONFIG_MAP_TOKEN,
                useValue: new Map(Object.entries(services)),
            },
        ],
    });
}
