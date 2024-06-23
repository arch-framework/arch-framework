import {strings} from '@angular-devkit/core';
import {formatFiles, Tree, readJsonFile, NxJsonConfiguration, generateFiles} from '@nx/devkit';
import {libraryGenerator} from '@nx/angular/generators';
import {get} from 'lodash';

import * as path from 'node:path';

import {DomainGeneratorSchema} from './schema';
import {deleteDefaultGeneratedComponent} from '../../utils/delete-default-generated-component';

export async function domainGenerator(tree: Tree, options: DomainGeneratorSchema) {
    const nxJsonConfiguration = readJsonFile<NxJsonConfiguration>(`${tree.root}/nx.json`);
    const globalLibraryOptions = get(nxJsonConfiguration, ['generators', '@nx/angular:library'], {});
    const libName = strings.dasherize(options.name);
    const projectRoot = `libs/${libName}/domain`;

    await libraryGenerator(tree, {
        name: `${libName}-domain`,
        directory: projectRoot,
        projectNameAndRootFormat: 'as-provided',
        flat: true,
        skipModule: true,
        tags: `domain:${libName},type:domain-logic`,
        prefix: libName,
        ...globalLibraryOptions,
    });

    deleteDefaultGeneratedComponent(tree, projectRoot);

    generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
        ...options,
        libName,
        dasherize: strings.dasherize,
        classify: strings.classify,
    });
    await formatFiles(tree);
}

export default domainGenerator;
