import {inject, Injectable} from '@angular/core';

import {ArchResourceUrlFactoryToken} from '../tokens/resource-url-factory';
import {ArchResourceServiceConfig, ArchResourceServiceConfigMap} from '../types';
import {ArchResourceServiceParamPropertyError} from '../errors/resource-service-param-property.error';
import {ArchResourceServiceNotDefineError} from '../errors/resource-service-not-define.error';
import {ARCH_RESOURCE_SERVICE_CONFIG_MAP_TOKEN} from '../tokens/resource-service-config-map';

@Injectable()
export class ArchResourceRegexUrlFactory extends ArchResourceUrlFactoryToken {
    private readonly configMap = inject<ArchResourceServiceConfigMap>(ARCH_RESOURCE_SERVICE_CONFIG_MAP_TOKEN);

    create(service: string, endpoint: string, params: void | Record<string, unknown>): string {
        const {protocol, host, port, prefix} = this.getConfig(service);
        endpoint = endpoint.replace(/:([a-zA-z]+)?/g, (_: string, key: string) => {
            const param = (params ?? {})[key];

            if (param === undefined) {
                throw new ArchResourceServiceParamPropertyError(key);
            }

            return String(param);
        });

        return `${protocol}://${host}:${port}${prefix}${endpoint}`;
    }

    private getConfig(service: string): ArchResourceServiceConfig {
        const config = this.configMap.get(service);

        if (config === undefined) {
            throw new ArchResourceServiceNotDefineError(service);
        }

        return config;
    }
}
