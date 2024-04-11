import {Observable} from 'rxjs';

import {ArchMessageBrokerEvent} from './message-broker-event';

export interface ArchMessageBrokerTransport {
    emit(event: ArchMessageBrokerEvent<unknown>): void;
    events$(): Observable<ArchMessageBrokerEvent<unknown>>;
}
