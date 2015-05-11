'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var revReplace = require('gulp-rev-replace');

var baseConfig = require('../config');
var htmlConfig = baseConfig.html;
var jsConfig = baseConfig.browserify;
var cssConfig = baseConfig.sass;
var isProduction = baseConfig.isProduction;

gulp.task('html', function () {
  var jsManifest = gulp.src(jsConfig.dest + '/' + jsConfig.manifest);
  var cssManifest = gulp.src(cssConfig.dest + '/' + cssConfig.manifest);

  return gulp.src(htmlConfig.src)
    .pipe(gulpif(isProduction, revReplace({
      replaceInExtensions: ['.html'],
      manifest: jsManifest
    })))
    .pipe(gulpif(isProduction, revReplace({
      replaceInExtensions: ['.html'],
      manifest: cssManifest
    })))
    .pipe(gulp.dest(htmlConfig.dest));
});
