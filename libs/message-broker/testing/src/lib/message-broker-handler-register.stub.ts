import {Injectable} from '@angular/core';

import {ArchMessageBrokerHandler} from '@ng-arch/message-broker';

@Injectable()
export class ArchMessageBrokerHandlerRegisterStub {
    registerHandlers(_: ArchMessageBrokerHandler[]): void {
        return undefined;
    }
}
