var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);

var config = require('../config').watch;

gulp.task('pre-watch', ['install'], function (cb) {
  runSequence(
    ['fonts', 'images'],
    'styles',
    'watchify',
    'html',
    cb
  )
});

gulp.task('watch-js', function () {
  gulp.watch(config.js.src, config.js.tasks);
});

gulp.task('watch-styles', function () {
  gulp.watch(config.styles.src, config.styles.tasks);
});

gulp.task('watch-assets', function () {
  gulp.watch(config.assets.src, config.assets.tasks);
});

gulp.task('watch', ['pre-watch', 'watch-js', 'watch-styles', 'watch-assets']);
