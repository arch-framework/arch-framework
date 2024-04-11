import {ArchMessageBrokerEvent} from './interfaces/message-broker-event';
import {ArchMessageBrokerEventMetadata} from './types';

export class ArchMessageBrokerEventImpl<T> implements ArchMessageBrokerEvent<T> {
    private readonly id: string;

    private readonly type: string;

    private readonly channel: string;

    private readonly payload: T;

    constructor(payload: T, metadata: ArchMessageBrokerEventMetadata) {
        this.id = metadata.id;
        this.type = metadata.pattern;
        this.channel = metadata.channel;
        this.payload = payload;
    }

    getMetadata(): ArchMessageBrokerEventMetadata {
        return {
            id: this.id,
            pattern: this.type,
            channel: this.channel,
        };
    }

    getPayload(): T {
        return this.payload;
    }
}
