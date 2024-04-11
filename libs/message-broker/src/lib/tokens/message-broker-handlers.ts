import {InjectionToken} from '@angular/core';

import {ArchMessageBrokerHandler} from '../types';

export const ARCH_MESSAGE_BROKER_HANDLERS_TOKEN = new InjectionToken<ArchMessageBrokerHandler[]>(
    'Message broker event handlers collection',
);
