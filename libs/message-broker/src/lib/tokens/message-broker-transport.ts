import {Observable} from 'rxjs';

import {ArchMessageBrokerTransport} from '../interfaces/message-broker-transport';
import {ArchMessageBrokerEvent} from '../interfaces/message-broker-event';

export abstract class ArchMessageBrokerTransportToken implements ArchMessageBrokerTransport {
    public abstract emit(event: ArchMessageBrokerEvent<unknown>): void;

    public abstract events$(): Observable<ArchMessageBrokerEvent<unknown>>;
}
