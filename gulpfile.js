const gulp = require('gulp');
const license = require('gulp-header-license');
const zip = require('gulp-zip');
const fs = require('fs');
const replace = require('gulp-token-replace');
const packageJson = require('./package.json');

gulp.task('license', function () {
    const headerProperties = {
        year: new Date().getFullYear(),
        author: packageJson.author,
        webSite: packageJson.homepage,
        license: packageJson.license
    };

    gulp.src(['src/**/*.js', 'src/**/*.css', '!src/**/3rd-party/**'])
        .pipe(license(fs.readFileSync('license-header.txt', 'utf8'), headerProperties))
        .pipe(gulp.dest('src'));
});

gulp.task('injectData', function () {
    const properties = {
        extension: {
            description: packageJson.description,
            version: packageJson.version,
            author: packageJson.author,
            homepage: packageJson.homepage
        }
    };
    return gulp.src(['src/**'])
        .pipe(replace({tokens : properties}))
        .pipe(gulp.dest('build/injectData'))
});

gulp.task('zip', ['injectData'], function () {
    gulp.src('build/injectData/**')
        .pipe(zip('stackoverflow-visitor-' + packageJson.version + '.zip'))
        .pipe(gulp.dest('build/dist'))
});

gulp.task('default', ['license', 'zip']);