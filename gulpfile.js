const gulp = require('gulp');
const injectSvg = require('gulp-inject-svg');

gulp.task('default', () => gulp.src('./*.html')
  .pipe(injectSvg())
  .pipe(gulp.dest(''))
);