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

    return gulp.src(['src/**/*.js', 'src/**/*.css', '!src/**/3rd-party/**'])
        .pipe(license(fs.readFileSync('license-header.txt', 'utf8'), headerProperties))
        .pipe(gulp.dest('src'));
});

gulp.task('dataInject', function () {
    const properties = {
        extension: {
            description: packageJson.description,
            version: packageJson.version,
            author: packageJson.author,
            homepage: packageJson.homepage
        }
    };
    gulp.src(['src/**/*.png'])
        .pipe(gulp.dest('build/dataInject'))

    return gulp.src(['src/**', '!src/**/*.png'])
        .pipe(replace({tokens : properties}))
        .pipe(gulp.dest('build/dataInject'))
});

gulp.task('zip', ['dataInject'], function () {
    return gulp.src('build/dataInject/**')
        .pipe(zip('stackoverflow-visitor-' + packageJson.version + '.zip'))
        .pipe(gulp.dest('build/dist'))
});

gulp.task('default', ['license', 'zip']);