import {Injectable} from '@angular/core';

import {asapScheduler, Observable, observeOn, share, Subject} from 'rxjs';

import {ArchMessageBrokerTransport} from './interfaces/message-broker-transport';
import {ArchMessageBrokerEvent} from './interfaces/message-broker-event';

@Injectable()
export class ArchMessageBrokerTransportImpl
    extends Subject<ArchMessageBrokerEvent<unknown>>
    implements ArchMessageBrokerTransport
{
    private readonly event$ = this.asObservable().pipe(observeOn(asapScheduler), share());

    emit(event: ArchMessageBrokerEvent<unknown>): void {
        super.next(event);
    }

    events$(): Observable<ArchMessageBrokerEvent<unknown>> {
        return this.event$;
    }
}
