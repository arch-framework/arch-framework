import {ArchResourceUrlFactoryToken} from '../tokens/resource-url-factory';
import {ArchResourceServiceConfig} from '../types';
import {ArchResourceServiceParamPropertyError} from '../errors/resource-service-param-property.error';

export class ArchResourceRegexUrlFactory extends ArchResourceUrlFactoryToken {
    create(
        {protocol, host, port, prefix}: ArchResourceServiceConfig,
        endpoint: string,
        params: void | Record<string, unknown>,
    ): string {
        endpoint = endpoint.replace(/:([a-zA-z]+)?/g, (_: string, key: string) => {
            const param = (params ?? {})[key];

            if (param === undefined) {
                throw new ArchResourceServiceParamPropertyError(key);
            }

            return String(param);
        });

        return `${protocol}://${host}:${port}${prefix}${endpoint}`;
    }
}
