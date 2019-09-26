'use strict';

const _gulp = require('gulp');
const _execa = require('execa');

/**
 * Sub builder that publishes a project using npm publish.
 *
 * @private
 * @param {Object} project Reference to an object that contains project metadata
 *        that can be used to customize build outputs.
 * @param {Object} options An options object that can be used to customize the
 *        task.
 *
 * @returns {Function} A gulp task.
 */
module.exports = (project, options) => {
    const { name, version, rootDir } = project;

    const packageName = `${name.replace(/\//g, '-')}-${version}.tgz`;

    const npmBin = 'npm';
    const args = ['publish', packageName];

    const publishTask = () =>
        _execa(npmBin, args, {
            stdio: 'inherit',
            cwd: rootDir.getChild('dist').absolutePath
        });

    publishTask.displayName = 'publish-npm';
    publishTask.description =
        'Publish an existing package to an npm repository';

    return publishTask;
};
