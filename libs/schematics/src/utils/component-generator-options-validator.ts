import {getProjects, Tree} from '@nx/devkit';

import {ComponentGeneratorLocationOptions} from '../types';

export function componentGeneratorOptionsValidator(tree: Tree, options: ComponentGeneratorLocationOptions): void {
    if (options.shared && options.domain) {
        throw new Error('A UI library should either belong to a specific domain or be shared globally');
    }

    if (!options.shared && !options.domain) {
        throw new Error(
            `A UI library should either belong to a domain or be shared globally. Please provide either of these two options: --domain / --shared`,
        );
    }

    const projects = getProjects(tree);
    const domain = projects.get(`${options.domain}-domain`);

    if (options.domain && domain === undefined) {
        throw new Error(
            `A UI library belongs to '${options.domain}' domain which does not exist. Please before create UI library create domain run 'nx generate @ng-arch/schematics:domain ${options.domain}'`,
        );
    }
}
