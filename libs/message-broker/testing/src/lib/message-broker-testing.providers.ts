import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';

import {ArchIdGeneratorRandomTimestamp, ArchIdGeneratorToken} from '@ng-arch/common';
import {
    ArchMessageBrokerTransportToken,
    ArchMessageBrokerHandlerRegisterService,
    ArchMessageBrokerToken,
    ArchMessageBrokerImpl,
} from '@ng-arch/message-broker';

import {ArchMessageBrokerTransportStub} from './message-broker-transport.stub';
import {ArchMessageBrokerHandlerRegisterStub} from './message-broker-handler-register.stub';

export function provideArchMessageBrokerTesting(): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: ArchIdGeneratorToken,
            useClass: ArchIdGeneratorRandomTimestamp,
        },
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
