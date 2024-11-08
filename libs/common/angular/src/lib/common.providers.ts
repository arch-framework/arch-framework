import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';

import {ArchIdGeneratorToken, ArchIdGeneratorRandomTimestamp} from '@ng-arch/common';

export function provideArchCommonDependency(): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: ArchIdGeneratorToken,
            useClass: ArchIdGeneratorRandomTimestamp,
        },
    ]);
}
