var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);

var config = require('../config').watch;

gulp.task('build', function (cb) {
  runSequence(
    ['fonts', 'images'],
    'styles',
    'browserify',
    'html',
    cb
  );
});
