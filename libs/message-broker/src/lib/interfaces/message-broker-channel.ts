import {Observable} from 'rxjs';

import {ArchMessageBrokerEvent} from './message-broker-event';

export interface ArchMessageBrokerChannel {
    emit(event: ArchMessageBrokerEvent<unknown>): void;
    on(pattern: string): Observable<ArchMessageBrokerEvent<unknown>>;
    getChannelName(): string;
}
