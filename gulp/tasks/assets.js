var gulp = require('gulp');

var config = require('../config.js').assets;

gulp.task('assets', function () {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
