import {strings} from '@angular-devkit/core';
import {libraryGenerator} from '@nx/angular/generators';
import {formatFiles, generateFiles, NxJsonConfiguration, readJsonFile, Tree} from '@nx/devkit';
import {Schema as ComponentSchema} from '@schematics/angular/component/schema';
import {get} from 'lodash';

import * as path from 'node:path';

import {UiGeneratorSchema} from './schema';
import {UI_TYPE_LIBRARY_TAG} from '../../constants';
import setupLintGenerator from '../setup-lint/generator';
import {deleteDefaultGeneratedComponent} from '../../utils';
import {componentGeneratorOptionsValidator} from '../../utils/component-generator-options-validator';

export async function uiGenerator(tree: Tree, options: UiGeneratorSchema) {
    componentGeneratorOptionsValidator(tree, options);

    const nxJsonConfiguration = readJsonFile<NxJsonConfiguration>(`${tree.root}/nx.json`);
    const globalComponentOptions = get(
        nxJsonConfiguration,
        ['generators', '@nx/angular:component'],
        {},
    ) as ComponentSchema;
    const name = strings.dasherize(options.name);
    const libName = `ui-${name}`;
    const domain = options.shared ? 'shared' : strings.dasherize(options.domain);
    const directory = options.directory ? `libs/${domain}/${strings.dasherize(options.directory)}` : `libs/${domain}`;
    const projectRoot = `${directory}/${libName}`;
    const componentSelector = options.shared ? name : `${domain}-${name}`;

    await libraryGenerator(tree, {
        name: libName,
        selector: componentSelector,
        directory,
        projectNameAndRootFormat: 'derived',
        flat: true,
        skipModule: true,
        tags: `domain:${domain},${UI_TYPE_LIBRARY_TAG}`,
        prefix: options.shared ? name : domain,
        standalone: true,
        ...globalComponentOptions,
    });
    deleteDefaultGeneratedComponent(tree, projectRoot);
    generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
        ...options,
        fileName: libName,
        className: strings.classify(`${options.shared ? '' : domain}_${libName}_Component`),
        style: globalComponentOptions.style ?? 'css',
        selector: componentSelector,
    });

    await setupLintGenerator(tree, {});
    await formatFiles(tree);
}

export default uiGenerator;
