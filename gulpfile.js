const gulp = require('gulp');
const sass = require('gulp-sass');
const inlineSource = require('gulp-inline-source');

gulp.task('sass', () => gulp.src('./src/scss/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./dist')));

gulp.task('html', ['sass'], () => gulp.src('./src/*.html')
  .pipe(inlineSource({
      compress: true
  }))
  .pipe(gulp.dest('')));

gulp.task('watch', () => gulp.watch('./src/**/*.*', ['html']));

gulp.task('default', ['html']);