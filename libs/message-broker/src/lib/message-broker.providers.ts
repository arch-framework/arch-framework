import {
    ENVIRONMENT_INITIALIZER,
    EnvironmentProviders,
    forwardRef,
    inject,
    makeEnvironmentProviders,
    Provider,
    Type,
} from '@angular/core';

import {ArchIdGenerator, ArchIdGeneratorRandomTimestamp, ArchIdGeneratorToken} from '@ng-arch/common';

import {ArchMessageBrokerToken} from './tokens/message-broker';
import {ArchMessageBrokerTransportToken} from './tokens/message-broker-transport';
import {ARCH_MESSAGE_BROKER_HANDLERS_TOKEN} from './tokens/message-broker-handlers';
import {ArchMessageBrokerTransportImpl} from './message-broker-transport.impl';
import {ArchMessageBrokerImpl} from './message-broker.impl';
import {ArchMessageBrokerHandlerRegisterService} from './message-broker-handler-register.service';
import {ArchMessageBrokerClientImpl} from './message-broker-client.impl';
import {ArchMessageBroker} from './interfaces/message-broker';
import {
    ArchMessageBrokerClientFeature,
    ArchMessageBrokerExistingHandlerFeature,
    ArchMessageBrokerFeatureKind,
    ArchMessageBrokerHandler,
    ArchMessageBrokerHandlerFeature,
    ArchMessageBrokerHandlerFeatures,
} from './types';
import {ARCH_HANDLER_CHANNEL} from './constants';

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
        ArchMessageBrokerHandlerRegisterService,
    ]);
}

export function provideMessageBrokerHandlers(
    channel: string,
    ...features: ArchMessageBrokerHandlerFeatures[]
): EnvironmentProviders {
    return makeEnvironmentProviders([
        ...features.map(feature => feature(channel)).map(({providers}) => providers),
        {
            provide: ENVIRONMENT_INITIALIZER,
            multi: true,
            useValue: () => {
                const handlers = inject(ARCH_MESSAGE_BROKER_HANDLERS_TOKEN, {
                    optional: true,
                });
                const register = inject(ArchMessageBrokerHandlerRegisterService);

                register.registerHandlers(handlers === null ? [] : handlers);
            },
        },
    ]);
}

export function provideMessageBrokerClients(...features: ArchMessageBrokerClientFeature[]): Provider[] {
    return features.flatMap(({providers}) => providers);
}

export function withExistingHandlerFromDi(
    handler: Type<ArchMessageBrokerHandler>,
): (channel: string) => ArchMessageBrokerExistingHandlerFeature {
    return (channel: string) => {
        Reflect.defineMetadata(ARCH_HANDLER_CHANNEL, channel, handler.prototype);

        return {
            kind: ArchMessageBrokerFeatureKind.ProvideExistingHandler,
            providers: [
                {
                    provide: ARCH_MESSAGE_BROKER_HANDLERS_TOKEN,
                    useExisting: forwardRef(() => handler),
                    multi: true,
                },
            ],
        };
    };
}

export function withHandler(
    handler: Type<ArchMessageBrokerHandler>,
): (channel: string) => ArchMessageBrokerHandlerFeature {
    return (channel: string) => {
        Reflect.defineMetadata(ARCH_HANDLER_CHANNEL, channel, handler.prototype);

        return {
            kind: ArchMessageBrokerFeatureKind.ProvideHandler,
            providers: [
                {
                    provide: ARCH_MESSAGE_BROKER_HANDLERS_TOKEN,
                    useClass: handler,
                    multi: true,
                },
            ],
        };
    };
}

export function withClient(name: string): ArchMessageBrokerClientFeature {
    return {
        kind: ArchMessageBrokerFeatureKind.ProvideClient,
        providers: [
            {
                provide: name,
                useFactory: (generator: ArchIdGenerator, broker: ArchMessageBroker) => {
                    return new ArchMessageBrokerClientImpl(name, broker, generator);
                },
                deps: [ArchIdGeneratorToken, ArchMessageBrokerToken],
            },
        ],
    };
}
