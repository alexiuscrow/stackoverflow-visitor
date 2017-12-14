const gulp = require('gulp');
const zip = require('gulp-zip');
const packageJson = require('./package.json');

gulp.task('default', function () {
    gulp.src('src/**')
        .pipe(zip('stackoverflow-visitor-' + packageJson.version + '.zip'))
        .pipe(gulp.dest('dist'))
});