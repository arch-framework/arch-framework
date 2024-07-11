import {Provider, Type} from '@angular/core';

import {ArchResource} from '@ng-arch/infrastructure';

export type RequestBatchMetadata = {
    id: string;
    capacity: number;
};

export enum ArchInfrastructureClientFeatureKind {
    ProvideGateway,
    ProvideResourceServiceMap,
}

export type ArchInfrastructureClientFeature<FeatureKind extends ArchInfrastructureClientFeatureKind> = {
    kind: FeatureKind;
    providers: Provider[];
};

export type ArchInfrastructureClientGatewayFeature =
    ArchInfrastructureClientFeature<ArchInfrastructureClientFeatureKind.ProvideGateway>;

export type ArchInfrastructureClientResourceServiceMapFeature =
    ArchInfrastructureClientFeature<ArchInfrastructureClientFeatureKind.ProvideResourceServiceMap>;

export type ArchInfrastructureClientFeatures =
    | ((resources: Type<ArchResource<unknown, unknown>>[]) => ArchInfrastructureClientGatewayFeature)
    | ((resources: Type<ArchResource<unknown, unknown>>[]) => ArchInfrastructureClientResourceServiceMapFeature);
