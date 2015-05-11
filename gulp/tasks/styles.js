var gulp = require('gulp');
var sass = require('gulp-sass');
var rev = require('gulp-rev');
var gulpif = require('gulp-if');
var buffer = require('gulp-buffer');
var sourcemaps = require('gulp-sourcemaps');

var config = require('../config.js').sass;
var isRelease = require('../config').isRelease;

gulp.task('styles', function () {
  return gulp.src(config.src)
    .pipe(gulpif(!isRelease, sourcemaps.init()))
    .pipe(sass(config.settings))
    .pipe(gulpif(!isRelease, sourcemaps.write()))
    .pipe(buffer())
    .pipe(gulpif(isRelease, rev()))
    .pipe(gulpif(isRelease, gulp.dest(config.dest)))
    .pipe(gulpif(isRelease, rev.manifest({ path: config.manifest })))
    .pipe(gulp.dest(config.dest));
});
