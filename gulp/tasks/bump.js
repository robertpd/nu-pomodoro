var gulp = require('gulp');
var bump = require('gulp-bump');
var argv = require('yargs').default({type: 'patch'}).argv;

gulp.task('bump', function () {
  return gulp.src('./package.json')
    .pipe(bump({type: argv.type, indent: 2}))
    .pipe(gulp.dest('./'));
});
