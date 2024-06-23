import {formatFiles, Tree} from '@nx/devkit';

import {SetupLintGeneratorSchema} from './schema';
import {addDepsConstraints} from '../../utils';
import {
    DOMAIN_TYPE_LIBRARY_TAG,
    FEATURE_TYPE_LIBRARY_TAG,
    SHARED_DOMAIN_LIBRARY_TAG,
    UI_TYPE_LIBRARY_TAG,
    UTIL_TYPE_LIBRARY_TAG,
} from '../../constants';

export async function setupLintGenerator(tree: Tree, _: SetupLintGeneratorSchema) {
    addDepsConstraints(tree, [
        {
            sourceTag: FEATURE_TYPE_LIBRARY_TAG,
            onlyDependOnLibsWithTags: [UI_TYPE_LIBRARY_TAG, DOMAIN_TYPE_LIBRARY_TAG, UTIL_TYPE_LIBRARY_TAG],
        },
        {
            sourceTag: UI_TYPE_LIBRARY_TAG,
            onlyDependOnLibsWithTags: [DOMAIN_TYPE_LIBRARY_TAG, UTIL_TYPE_LIBRARY_TAG],
        },
        {
            sourceTag: DOMAIN_TYPE_LIBRARY_TAG,
            onlyDependOnLibsWithTags: [UTIL_TYPE_LIBRARY_TAG],
        },
        {
            sourceTag: SHARED_DOMAIN_LIBRARY_TAG,
            onlyDependOnLibsWithTags: [SHARED_DOMAIN_LIBRARY_TAG],
        },
    ]);
    await formatFiles(tree);
}

export default setupLintGenerator;
