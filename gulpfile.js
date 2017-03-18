const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const inlineSource = require('gulp-inline-source');
const svgmin = require('gulp-svgmin');
const injectSvg = require('gulp-inject-svg');
const htmlmin = require('gulp-htmlmin');

const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');

function compile(watch) {
  var bundler = watchify(browserify('./src/js/app.js', { debug: true }).transform(babel));
  bundler.bundle()
    .on('error', function(err) { console.error(err); this.emit('end'); })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
}

function watch() {
  return compile(true);
};

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

gulp.task('browserify', () => compile());

gulp.task('default', ['inject-svg', 'browserify'], () => gulp.src('./*.html')
  .pipe(htmlmin({ collapseWhitespace: true, minifyJS: true }))
  .pipe(gulp.dest(''))
);

gulp.task('watch', () => gulp.watch('./src/**/*.*', ['default', 'browserify']));
