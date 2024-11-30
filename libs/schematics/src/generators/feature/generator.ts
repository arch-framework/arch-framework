import {strings} from '@angular-devkit/core';
import {libraryGenerator} from '@nx/angular/generators';
import {
    formatFiles,
    generateFiles,
    NxJsonConfiguration,
    readJsonFile,
    Tree,
    getProjects,
} from '@nx/devkit';
import {Schema as ComponentSchema} from '@schematics/angular/component/schema';
import {get} from 'lodash';
import {IndentationText, NewLineKind, Project, QuoteKind} from 'ts-morph';

import * as path from 'node:path';

import {FeatureGeneratorSchema} from './schema';
import {FEATURE_TYPE_LIBRARY_TAG} from '../../constants';
import setupLintGenerator from '../setup-lint/generator';
import {deleteDefaultGeneratedComponent} from '../../utils';
import {componentGeneratorOptionsValidator} from '../../utils/component-generator-options-validator';
import {getNpmScope} from '../../utils/get-npm-scope';

const ast = new Project({
    manipulationSettings: {
        indentationText: IndentationText.FourSpaces,
        newLineKind: NewLineKind.LineFeed,
        quoteKind: QuoteKind.Single,
        useTrailingCommas: true,
    },
});

export async function featureGenerator(tree: Tree, options: FeatureGeneratorSchema) {
    componentGeneratorOptionsValidator(tree, options);
    const projects = getProjects(tree);
    const domainProject = projects.get(`${options.domain}-domain`);
    const nxJsonConfiguration = readJsonFile<NxJsonConfiguration>(`${tree.root}/nx.json`);
    const globalComponentOptions = get(
        nxJsonConfiguration,
        ['generators', '@nx/angular:component'],
        {},
    ) as ComponentSchema;
    const name = strings.dasherize(options.name);
    const libName = `feature-${name}`;
    const domain = options.shared ? 'shared' : strings.dasherize(options.domain);
    const directory = options.directory ? `libs/${domain}/${strings.dasherize(options.directory)}` : `libs/${domain}`;
    const projectRoot = `${directory}/${libName}`;
    const componentSelector = options.shared ? name : `${domain}-${name}`;

    await libraryGenerator(tree, {
        name: libName,
        selector: componentSelector,
        directory,
        flat: true,
        skipModule: true,
        tags: `domain:${domain},${FEATURE_TYPE_LIBRARY_TAG}`,
        prefix: options.shared ? name : domain,
        standalone: true,
        ...globalComponentOptions,
    });

    deleteDefaultGeneratedComponent(tree, projectRoot);

    generateFiles(tree, path.join(__dirname, 'files', 'feature'), projectRoot, {
        ...options,
        fileName: libName,
        workspaceName: getNpmScope(tree),
        className: strings.classify(`${options.shared ? '' : domain}_${libName}_Component`),
        facadeClassName: strings.classify(`${options.shared ? '' : domain}_${libName}_Facade`),
        style: globalComponentOptions.style ?? 'css',
        selector: componentSelector,
        domain,
    });
    generateFiles(tree, path.join(__dirname, 'files', 'domain'), domainProject.root, {
        ...options,
        fileName: libName,
        facadeClassName: strings.classify(`${options.shared ? '' : domain}_${libName}_Facade`),
    });

    ast.addSourceFilesAtPaths(`${domainProject.sourceRoot}/index.ts`);
    const source = ast.getSourceFile(`${domainProject.sourceRoot}/index.ts`);
    source
        .addExportDeclaration({
            namedExports: [strings.classify(`${options.shared ? '' : domain}_${libName}_Facade`)],
            moduleSpecifier: `./lib/application/facades/${libName}.facade`,
        })
        .prependWhitespace('\n');

    tree.write(`${domainProject.sourceRoot}/index.ts`, source.getText());

    await setupLintGenerator(tree, {});
    await formatFiles(tree);
}

export default featureGenerator;
