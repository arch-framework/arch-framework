import {Tree, readJson} from '@nx/devkit';

export function getNpmScope(tree: Tree): string | void {
    const {name} = tree.exists('package.json') ? readJson(tree, 'package.json') : {name: null};

    return name?.startsWith('@') ? name.split('/')[0].substring(1) : undefined;
}
