var gulp = require('gulp');
var eventStream = require('event-stream');
var del = require('del');
var config = require('../config').clean;

gulp.task('clean', function(cb) {
  del(config.paths, cb);
});
