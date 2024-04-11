import {ArchMessageBrokerEventMetadata} from '../types';

export interface ArchMessageBrokerEvent<T> {
    getPayload(): T;
    getMetadata(): ArchMessageBrokerEventMetadata;
}
