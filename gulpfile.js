const gulp = require('gulp');
const license = require('gulp-header-license');
const zip = require('gulp-zip');
const fs = require('fs');
const packageJson = require('./package.json');

gulp.task('license', function () {
    const headerProperties = {
        year: new Date().getFullYear(),
        author: packageJson.author,
        webSite: packageJson.repository.url.slice(0, -4),
        license: packageJson.license
    };

    gulp.src(['src/**/*.js', 'src/**/*.css', '!src/**/3rd-party/**'])
        .pipe(license(fs.readFileSync('license-header.txt', 'utf8'), headerProperties))
        .pipe(gulp.dest('src'));
});

gulp.task('zip', function () {
    gulp.src('src/**')
        .pipe(zip('stackoverflow-visitor-' + packageJson.version + '.zip'))
        .pipe(gulp.dest('build/dist'))
});

gulp.task('default', ['license', 'zip']);