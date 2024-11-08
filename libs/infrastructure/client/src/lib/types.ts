import {Provider} from '@angular/core';

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
    | (() => ArchInfrastructureClientGatewayFeature)
    | (() => ArchInfrastructureClientResourceServiceMapFeature);
