import {inject, Injectable} from '@angular/core';

import {ArchMessageBroker} from './interfaces/message-broker';
import {ArchMessageBrokerToken} from './tokens/message-broker';
import {ArchMessageBrokerHandler} from './types';
import {ARCH_HANDLER_METADATA} from './constants';
import {ArchMessageBrokerHandlerNoMetadataError} from './errors/message-broker-handler-no-metadata.error';

@Injectable()
export class ArchMessageBrokerHandlerRegisterService {
    private readonly broker = inject<ArchMessageBroker>(ArchMessageBrokerToken);

    registerHandlers(handlers: ArchMessageBrokerHandler[]): void {
        handlers.forEach((handler: ArchMessageBrokerHandler) => {
            const metadata = Reflect.getMetadata(ARCH_HANDLER_METADATA, handler);

            if (!metadata) {
                throw new ArchMessageBrokerHandlerNoMetadataError();
            }

            this.broker.registerHandler(handler);
        });
    }
}
