import {createTreeWithEmptyWorkspace} from '@nx/devkit/testing';
import {Tree, readProjectConfiguration} from '@nx/devkit';

import {uiGenerator} from './generator';
import {UiGeneratorSchema} from './schema';

describe.skip('ui generator', () => {
    let tree: Tree;
    const options: UiGeneratorSchema = {name: 'test'};

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should run successfully', async () => {
        await uiGenerator(tree, options);
        const config = readProjectConfiguration(tree, 'test');
        expect(config).toBeDefined();
    });
});
