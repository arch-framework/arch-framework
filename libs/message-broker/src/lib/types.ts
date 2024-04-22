import {Provider} from '@angular/core';

import {ArchMessageBrokerHandlerCommand, ArchMessageBrokerHandlerEvent} from './interfaces/message-broker-handler';

export type ArchMessageBrokerEventMetadata = {
    id: string;
    pattern: string;
    channel: string;
};

export type ArchMessageBrokerClientEvent<Payload = void> = [Payload];

export type ArchMessageBrokerClientCommand<Result, Payload = void> = [Payload, Result];

export type ArchMessageBrokerHandler =
    | ArchMessageBrokerHandlerCommand<unknown, unknown>
    | ArchMessageBrokerHandlerEvent<unknown>;

export enum ArchMessageBrokerHandlerKind {
    Event,
    Command,
}

export type ArchMessageBrokerHandlerParams = {
    pattern: string;
};

export enum ArchMessageBrokerFeatureKind {
    ProvideClient,
    ProvideHandler,
    ProvideExistingHandler,
}

export type ArchMessageBrokerFeature<FeatureKind extends ArchMessageBrokerFeatureKind> = {
    kind: FeatureKind;
    providers: Provider[];
};

export type ArchMessageBrokerClientFeature = ArchMessageBrokerFeature<ArchMessageBrokerFeatureKind.ProvideClient>;

export type ArchMessageBrokerHandlerFeature = ArchMessageBrokerFeature<ArchMessageBrokerFeatureKind.ProvideHandler>;

export type ArchMessageBrokerExistingHandlerFeature =
    ArchMessageBrokerFeature<ArchMessageBrokerFeatureKind.ProvideExistingHandler>;

export type ArchMessageBrokerHandlerFeatures =
    | ((channel: string) => ArchMessageBrokerHandlerFeature)
    | ((channel: string) => ArchMessageBrokerExistingHandlerFeature);
