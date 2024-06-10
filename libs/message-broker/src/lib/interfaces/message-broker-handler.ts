import {Observable} from 'rxjs';

import {ArchMessageBrokerEvent} from './message-broker-event';

export interface ArchMessageBrokerHandlerEvent<Payload> {
    handle(event: ArchMessageBrokerEvent<Payload>): Observable<void> | void;
}

export interface ArchMessageBrokerHandlerCommand<Result, Payload = void> {
    handle(event: ArchMessageBrokerEvent<Payload>): Observable<Result>;
}
