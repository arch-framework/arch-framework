import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';

import {ArchIdGeneratorToken} from './tokens/id-generator';
import {ArchIdGeneratorRandomTimestamp} from './classes/id-generator/id-generator-random-timestamp';

export function provideArchCommonDependency(): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: ArchIdGeneratorToken,
            useClass: ArchIdGeneratorRandomTimestamp,
        },
    ]);
}
