import {Tree, updateJson} from '@nx/devkit';
import {Linter} from 'eslint';
import {DepConstraint} from '@nx/eslint-plugin/src/utils/runtime-lint-utils';
import {set, get, has, wrap, uniqBy} from 'lodash';

const RULE_NAME = '@nx/enforce-module-boundaries';

const getEnforceModuleBoundariesOptions = wrap(get, (fn, group) => {
    return fn(group, ['rules', RULE_NAME], undefined);
});

const findWildcardConstraintsIndex = (constraints: DepConstraint[]): number => {
    return constraints.findIndex(
        constraint =>
            get(constraint, ['sourceTag'], undefined) === '*' &&
            get(constraint, ['onlyDependOnLibsWithTags', 0], undefined),
    );
};

const updateEslintConfig = (config: Linter.Config, constraints: DepConstraint[]): Linter.Config => {
    const group = config.overrides.find(group => getEnforceModuleBoundariesOptions(group));

    if (group === undefined) {
        console.info(`${RULE_NAME}: rule group not found. Configuration will not be updated.`);
        return config;
    }

    const rules = getEnforceModuleBoundariesOptions(group);

    if (!has(rules, [1])) {
        console.info(`${RULE_NAME}: rule params not found. Configuration will not be updated.`);
        return config;
    }

    if (!has(rules, [1, 'depConstraints']) || !Array.isArray(get(rules, [1, 'depConstraints']))) {
        console.info(`${RULE_NAME}: depConstraints must be an array. Configuration will not be updated.`);
        return config;
    }

    const depConstraints = get(rules, [1, 'depConstraints'], []);
    const wildcardConstraintsIndex = findWildcardConstraintsIndex(depConstraints);

    if (wildcardConstraintsIndex !== -1) {
        depConstraints.splice(wildcardConstraintsIndex, 1);
    }

    set(rules, ['1', 'depConstraints'], uniqBy(depConstraints.concat(constraints), 'sourceTag'));

    return config;
};

export function addDepsConstraints(tree: Tree, constraints: DepConstraint[]): void {
    if (tree.exists('.eslintrc.json')) {
        updateJson<Linter.Config, Linter.Config>(tree, '.eslintrc.json', config =>
            updateEslintConfig(config, constraints),
        );
    } else if (tree.exists('.eslintrc')) {
        updateJson<Linter.Config, Linter.Config>(tree, '.eslintrc', config => updateEslintConfig(config, constraints));
    } else {
        console.warn('Support only .eslintrc.json or .eslintrc config file format');
    }
}
