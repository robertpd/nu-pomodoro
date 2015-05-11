'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var _ = require('lodash');

var config = require('../config').browserify;
var isRelease = require('../config').isRelease;

gulp.task('browserify', function () {
  return bundle(false);
});

gulp.task('watchify', function () {
  return bundle(true);
});

function bundle(watch) {
  var bundler;

  if (watch) {
    //bundler = watchify(browserify(config.src,
    //  _.assign(watchify.args, {
    //    delay: 500,
    //    debug: true
    //  })));

    // Watchify is bugging out, don't use it until it's been fixed.
    bundler = browserify(config.src, {
      debug: true
    });
    bundler.on('update', function() {
      rebundle(bundler);
    });
  } else {
    bundler = browserify(config.src, {
      debug: true
    });
  }

  bundler.transform(babelify.configure({
    stage: 1,
    optional: ['runtime'],
    ignore: 'node_modules'
  })).require(config.src, { entry: true });

  return rebundle(bundler);
}

function rebundle(b) {
  if (isRelease) {
    return b.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('App.js'))
      .pipe(buffer())
      .pipe(streamify(uglify()))
      .pipe(rev())
      .pipe(gulp.dest(config.dest))
      .pipe(rev.manifest({ path: config.manifest }))
      .pipe(gulp.dest(config.dest));
  } else {
    return b.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('App.js'))
      .on('data', function() { gutil.log('Bundle updated') })
      .pipe(gulp.dest(config.dest));
  }
}
