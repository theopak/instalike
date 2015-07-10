var gulp = require('gulp');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
// var deploy = require('gulp-gh-pages');

gulp.task('scripts', function() {
  return gulp.src(['public/**/*.js'])
    .pipe(concat({ path: 'min.js', stat: { mode: 0666 }}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('styles', function () {
  gulp.src('public/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('dist'))
});

gulp.task('html', function() {
  return gulp.src('public/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
});

gulp.task('copy', function() {
  return gulp.src('public/icons.*')
    .pipe(gulp.dest('dist'))
});

/**
 * Push build to gh-pages.
 */
gulp.task('deploy', ['build'], function () {
  return gulp.src('./dist/**/*')
    .pipe(deploy())
});

gulp.task('default', ['scripts', 'styles', 'html', 'copy']);
