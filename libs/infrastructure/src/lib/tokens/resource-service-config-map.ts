import {InjectionToken} from '@angular/core';

import {ArchResourceServiceConfigMap} from '../types';

export const ARCH_RESOURCE_SERVICE_CONFIG_MAP_TOKEN = new InjectionToken<ArchResourceServiceConfigMap>(
    'Resource services config map',
);
