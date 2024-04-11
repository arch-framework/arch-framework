import {filter, Observable} from 'rxjs';

import {ArchMessageBrokerChannel} from './interfaces/message-broker-channel';
import {ArchMessageBrokerEvent} from './interfaces/message-broker-event';
import {ArchMessageBrokerTransport} from './interfaces/message-broker-transport';

export class ArchMessageBrokerChannelImpl implements ArchMessageBrokerChannel {
    private readonly channel: string;

    private readonly transport: ArchMessageBrokerTransport;

    private readonly events$: Observable<ArchMessageBrokerEvent<unknown>>;

    constructor(channel: string, transport: ArchMessageBrokerTransport) {
        this.channel = channel;
        this.transport = transport;
        this.events$ = this.transport.events$();
    }

    emit(event: ArchMessageBrokerEvent<unknown>): void {
        this.transport.emit(event);
    }

    on(pattern: string): Observable<ArchMessageBrokerEvent<unknown>> {
        return this.events$.pipe(
            filter(event => {
                const metadata = event.getMetadata();

                return metadata.channel === this.channel && metadata.pattern === pattern;
            }),
        );
    }

    getChannelName(): string {
        return this.channel;
    }
}
