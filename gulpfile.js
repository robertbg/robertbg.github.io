const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const inlineSource = require('gulp-inline-source');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const inject = require('gulp-inject');

gulp.task('sass', () => gulp.src('./src/scss/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./dist')));

gulp.task('html', ['sass'], () => gulp.src('./src/*.html')
  .pipe(inlineSource({
      compress: true
  }))
  .pipe(gulp.dest('')));

gulp.task('svg', ['html'], () => {
  const svgs = gulp.src('svg/*.svg')
  .pipe(svgmin((file) => {
    const prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [{
        cleanupIDs: {
          prefix: prefix + '-',
          minify: true
        }
      }]
    }
  }))
  .pipe(svgstore({ inlineSvg: true }));
  
  function fileContents (filePath, file) {
    return file.contents.toString();
  }
  
  return gulp.src('index.html')
  .pipe(inject(svgs, { transform: fileContents }))
  .pipe(gulp.dest(''));
});

gulp.task('watch', () => gulp.watch('./src/**/*.*', ['svg']));

gulp.task('default', ['svg']);