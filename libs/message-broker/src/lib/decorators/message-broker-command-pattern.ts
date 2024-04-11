import 'reflect-metadata';

import {ArchMessageBrokerHandlerParams, ArchMessageBrokerHandlerKind} from '../types';
import {ARCH_HANDLER_METADATA, ARCH_HANDLER_KIND} from '../constants';

export function ArchCommandPattern(params: ArchMessageBrokerHandlerParams): ClassDecorator {
    return target => {
        Reflect.defineMetadata(ARCH_HANDLER_METADATA, params, target.prototype);
        Reflect.defineMetadata(ARCH_HANDLER_KIND, ArchMessageBrokerHandlerKind.Command, target.prototype);

        return target;
    };
}
