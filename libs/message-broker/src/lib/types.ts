import {ArchMessageBrokerCommandHandler, ArchMessageBrokerEventHandler} from './interfaces/message-broker-handler';

export type ArchMessageBrokerEventMetadata = {
    id: string;
    pattern: string;
    channel: string;
};

export type ArchMessageBrokerClientEvent<Payload = void> = [Payload];

export type ArchMessageBrokerClientCommand<Result, Payload = void> = [Payload, Result];

export type ArchMessageBrokerHandler =
    | ArchMessageBrokerCommandHandler<unknown, unknown>
    | ArchMessageBrokerEventHandler<unknown>;

export enum ArchMessageBrokerHandlerKind {
    Event,
    Command,
}

export type ArchMessageBrokerHandlerParams = {
    channel: string;
    pattern: string;
};
