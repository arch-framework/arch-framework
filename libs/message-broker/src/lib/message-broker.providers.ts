import {
    EnvironmentProviders,
    FactoryProvider,
    importProvidersFrom,
    makeEnvironmentProviders,
    Provider,
    Type,
} from '@angular/core';

import {ArchIdGenerator, ArchIdGeneratorRandomTimestamp, ArchIdGeneratorToken} from '@arch-framework/common';

import {ArchMessageBrokerToken} from './tokens/message-broker';
import {ArchMessageBrokerTransportToken} from './tokens/message-broker-transport';
import {ArchMessageBrokerTransportImpl} from './message-broker-transport.impl';
import {ArchMessageBrokerImpl} from './message-broker.impl';
import {ArchMessageBroker} from './interfaces/message-broker';
import {ArchMessageBrokerClientImpl} from './message-broker-client.impl';
import {ARCH_MESSAGE_BROKER_HANDLERS_TOKEN} from './tokens/message-broker-handlers';
import {ArchMessageBrokerHandlerRegisterModule} from './message-broker-handler-register.module';
import {ArchMessageBrokerHandler} from './types';

export function provideMessageBroker(): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: ArchIdGeneratorToken,
            useClass: ArchIdGeneratorRandomTimestamp,
        },
        {
            provide: ArchMessageBrokerTransportToken,
            useClass: ArchMessageBrokerTransportImpl,
        },
        {
            provide: ArchMessageBrokerToken,
            useClass: ArchMessageBrokerImpl,
        },
    ]);
}

export function provideMessageBrokerHandlers(handlers: Type<ArchMessageBrokerHandler>[]): EnvironmentProviders {
    return makeEnvironmentProviders([
        ...handlers.map(Handler => ({
            provide: ARCH_MESSAGE_BROKER_HANDLERS_TOKEN,
            useClass: Handler,
            multi: true,
        })),
        importProvidersFrom(ArchMessageBrokerHandlerRegisterModule),
    ]);
}

export function provideMessageBrokerClients(...clients: Provider[]): EnvironmentProviders {
    return makeEnvironmentProviders(clients);
}

export function withClient(name: string): FactoryProvider {
    return {
        provide: name,
        useFactory: (generator: ArchIdGenerator, broker: ArchMessageBroker) => {
            return new ArchMessageBrokerClientImpl(name, broker, generator);
        },
        deps: [ArchIdGeneratorToken, ArchMessageBrokerToken],
    };
}
