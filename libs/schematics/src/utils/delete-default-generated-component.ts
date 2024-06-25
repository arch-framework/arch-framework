import {Tree} from '@nx/devkit';

import * as path from 'node:path';

export function deleteDefaultGeneratedComponent(tree: Tree, root: string): void {
    const directoryToDelete = path.join(root, 'src', 'lib');

    if (tree.exists(directoryToDelete)) {
        tree.delete(directoryToDelete);
    }
}
