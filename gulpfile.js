const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const inlineSource = require('gulp-inline-source');
const svgmin = require('gulp-svgmin');
const injectSvg = require('gulp-inject-svg');
const htmlmin = require('gulp-htmlmin');

gulp.task('sass', () => gulp.src('./src/scss/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./dist'))
);

gulp.task('inject-html', ['sass'], () => gulp.src('./src/*.html')
  .pipe(inlineSource({ compress: true }))
  .pipe(gulp.dest(''))
);

gulp.task('min-svg', () =>  gulp.src('./svg/*.svg')
  .pipe(svgmin())
  .pipe(gulp.dest('./svg'))
);

gulp.task('inject-svg', ['inject-html'], () => gulp.src('./*.html')
  .pipe(injectSvg())
  .pipe(gulp.dest(''))
);

gulp.task('default', ['inject-svg'], () => gulp.src('./*.html')
  .pipe(htmlmin({ collapseWhitespace: true, minifyJS: true }))
  .pipe(gulp.dest(''))
);

gulp.task('watch', () => gulp.watch('./src/**/*.*', ['default']));
