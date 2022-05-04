'use strict';

const _gulp = require('gulp');

/**
 * Sub builder that creates a task that will copy javascript files from source
 * to build directories. This method will return a watcher if the watch option
 * is set to true.
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
    const { watch } = Object.assign({ watch: false }, options);
    const rootDir = project.rootDir;
    const workingDir = rootDir.getChild('working');

    const dirs = ['src', 'test'];
    if (project.projectType === 'aws-microservice') {
        dirs.push('infra');
    }

    const extras = [
        project.configFileName,
        'package.json',
        '.npmignore',
        '.npmrc',
    ];

    if (project.hasDocker) {
        extras.push('Dockerfile*');
    }

    const paths = dirs
        .map((dir) => rootDir.getChild(dir))
        .map((dir) =>
            ['js', 'json', 'html'].map((ext) => dir.getAllFilesGlob(ext))
        )
        .reduce((result, arr) => result.concat(arr), [])
        .concat(extras.map((item) => rootDir.getFileGlob(item)));

    const task = () =>
        _gulp
            .src(paths, { allowEmpty: true, base: rootDir.globPath })
            .pipe(_gulp.dest(workingDir.absolutePath));

    task.displayName = 'build-js';
    task.description = 'Copy javascript files from source to build directory';

    if (watch) {
        const watchTask = () => _gulp.watch(paths, task);
        watchTask.displayName = 'watch-build-js';
        watchTask.description =
            'Automatically copy javascript files to build directory on change';

        return watchTask;
    }
    return task;
};
