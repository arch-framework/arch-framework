import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';

import {
    ArchMessageBrokerTransportToken,
    ArchMessageBrokerHandlerRegisterService,
    ArchMessageBrokerToken,
    ArchMessageBrokerImpl,
} from '@ng-arch/message-broker';

import {ArchMessageBrokerTransportStub} from './message-broker-transport.stub';
import {ArchMessageBrokerHandlerRegisterStub} from './message-broker-handler-register.stub';

export function provideMessageBrokerTesting(): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: ArchMessageBrokerTransportToken,
            useClass: ArchMessageBrokerTransportStub,
        },
        {
            provide: ArchMessageBrokerToken,
            useClass: ArchMessageBrokerImpl,
        },
        {
            provide: ArchMessageBrokerHandlerRegisterService,
            useClass: ArchMessageBrokerHandlerRegisterStub,
        },
    ]);
}
