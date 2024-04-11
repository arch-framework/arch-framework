import {Inject, NgModule} from '@angular/core';

import {ARCH_MESSAGE_BROKER_HANDLERS_TOKEN} from './tokens/message-broker-handlers';
import {ArchMessageBroker} from './interfaces/message-broker';
import {ArchMessageBrokerToken} from './tokens/message-broker';
import {ArchMessageBrokerHandler} from './types';
import {ARCH_HANDLER_METADATA} from './constants';
import {ArchMessageBrokerHandlerNoMetadataError} from './errors/message-broker-handler-no-metadata.error';

@NgModule()
export class ArchMessageBrokerHandlerRegisterModule {
    constructor(
        @Inject(ARCH_MESSAGE_BROKER_HANDLERS_TOKEN) private readonly handlers: ArchMessageBrokerHandler[],
        @Inject(ArchMessageBrokerToken) private readonly broker: ArchMessageBroker,
    ) {
        this.handlers.forEach((handler: ArchMessageBrokerHandler) => {
            const metadata = Reflect.getMetadata(ARCH_HANDLER_METADATA, handler);

            if (!metadata) {
                throw new ArchMessageBrokerHandlerNoMetadataError();
            }

            this.broker.registerHandler(handler);
        });
    }
}
