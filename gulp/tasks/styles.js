var gulp = require('gulp');
var sass = require('gulp-sass');
var rev = require('gulp-rev');
var gulpif = require('gulp-if');
var buffer = require('gulp-buffer');
var sourcemaps = require('gulp-sourcemaps');

var config = require('../config.js').sass;
var isProduction = require('../config').isProduction;

gulp.task('styles', function () {
  return gulp.src(config.src)
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(sass(config.settings))
    .pipe(gulpif(!isProduction, sourcemaps.write()))
    .pipe(buffer())
    .pipe(gulpif(isProduction, rev()))
    .pipe(gulpif(isProduction, gulp.dest(config.dest)))
    .pipe(gulpif(isProduction, rev.manifest({ path: config.manifest })))
    .pipe(gulp.dest(config.dest));
});
