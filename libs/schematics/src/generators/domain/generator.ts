import {strings} from '@angular-devkit/core';
import {formatFiles, Tree, readJsonFile, NxJsonConfiguration, generateFiles} from '@nx/devkit';
import {libraryGenerator} from '@nx/angular/generators';
import {get} from 'lodash';

import * as path from 'node:path';

import {DomainGeneratorSchema} from './schema';
import {deleteDefaultGeneratedComponent, addDepsConstraints} from '../../utils';
import {DOMAIN_TYPE_LIBRARY_TAG, SHARED_DOMAIN_LIBRARY_TAG} from '../../constants';
import setupLintGenerator from '../setup-lint/generator';

export async function domainGenerator(tree: Tree, options: DomainGeneratorSchema) {
    const nxJsonConfiguration = readJsonFile<NxJsonConfiguration>(`${tree.root}/nx.json`);
    const globalLibraryOptions = get(nxJsonConfiguration, ['generators', '@nx/angular:library'], {});
    const libName = strings.dasherize(options.name);
    const directory = `libs/${libName}`;
    const projectRoot = `${directory}/domain`;

    await libraryGenerator(tree, {
        name: `domain`,
        directory,
        flat: true,
        skipModule: true,
        tags: `domain:${libName},${DOMAIN_TYPE_LIBRARY_TAG}`,
        prefix: libName,
        ...globalLibraryOptions,
    });
    await setupLintGenerator(tree, {});

    deleteDefaultGeneratedComponent(tree, projectRoot);
    addDepsConstraints(tree, [
        {
            sourceTag: `domain:${libName}`,
            onlyDependOnLibsWithTags: [`domain:${libName}`, SHARED_DOMAIN_LIBRARY_TAG],
        },
    ]);

    generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
        ...options,
        libName,
        dasherize: strings.dasherize,
        classify: strings.classify,
    });
    await formatFiles(tree);
}

export default domainGenerator;
