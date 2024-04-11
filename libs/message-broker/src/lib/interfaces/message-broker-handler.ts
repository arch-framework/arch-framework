import {Observable} from 'rxjs';

import {ArchMessageBrokerEvent} from './message-broker-event';

export interface ArchMessageBrokerEventHandler<Payload> {
    handle(event: ArchMessageBrokerEvent<Payload>): void;
}

export interface ArchMessageBrokerCommandHandler<Payload, Result> {
    handle(event: ArchMessageBrokerEvent<Payload>): Observable<Result>;
}
