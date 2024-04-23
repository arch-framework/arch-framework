import {Injectable} from '@angular/core';

import {Observable, Subject} from 'rxjs';

import {ArchMessageBrokerEvent, ArchMessageBrokerTransport} from '@ng-arch/message-broker';

@Injectable()
export class ArchMessageBrokerTransportStub implements ArchMessageBrokerTransport {
    private readonly event$ = new Subject<ArchMessageBrokerEvent<unknown>>();

    emit(event: ArchMessageBrokerEvent<unknown>): void {
        this.event$.next(event);
    }

    events$(): Observable<ArchMessageBrokerEvent<unknown>> {
        return this.event$;
    }
}
