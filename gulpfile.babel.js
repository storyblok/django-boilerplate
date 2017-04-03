const autoprefixer = require('gulp-autoprefixer')
const browserify = require('browserify')
const browserSync = require('browser-sync')
const buffer = require('vinyl-buffer')
const del = require('del')
const File = require('vinyl')
const fs = require('fs')
const globbing = require('gulp-css-globbing')
const gulp = require('gulp')
const gitrev = require('git-rev')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const reload = browserSync.reload
const sass = require('gulp-sass')
const source = require('vinyl-source-stream')

gulp.task('clean', function () {
  del.sync(['static']);
});

gulp.task('version', function () {
  return gitrev.long(function (str) {
    return string_src('version.cache', str).pipe(gulp.dest('static'))
  })
})

gulp.task('content', function () {
  return gulp.src('app/**/*.{xml,json,yml}')
    .pipe(gulp.dest('static'))
})

gulp.task('scripts', function () {
  return browserify({
      entries: 'app/scripts/main.js',
      debug: true
    })
    .bundle()
    .pipe(source('main.js'))
    .on('error', notify.onError(function (error) { return error.message; }))
    .pipe(gulp.dest('static/scripts/'))
    .pipe(browserSync.stream())
})

gulp.task('styles', function () {
  return gulp.src('app/styles/**/*.{sass,scss}')
    .pipe(plumber())
    .pipe(globbing({
      extensions: ['.scss']
    }))
    .on('error', notify.onError(function (error) { return 'There is an error in your stylesheet.'; }))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .on('error', notify.onError(function (error) { return error.message; }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('static/styles'))
    .pipe(browserSync.stream())
})

gulp.task('default', ['clean', 'version', 'styles', 'scripts', 'content'], function () {
  browserSync({
    proxy: {
      target: 'http://localhost:8000',
      reqHeaders: function (config) {
        return {
          'accept-encoding': 'identity',
          'agent': false
        }
      }
    },
    serveStatic: [
      {
        route: '/static',
        dir: 'static'
      }
    ],
    reloadDelay: 1000,
    notify: true,
    open: true,
    logLevel: 'silent'
  })

  gulp.watch('webapp/views/**/*', reload)
  gulp.watch('app/styles/**/*', ['styles'])
  gulp.watch('app/scripts/**/*', ['scripts'])
});

gulp.task('build', ['clean', 'version', 'styles', 'scripts', 'content']);

function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true });
  src._read = function () {
    this.push(new File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }))
    this.push(null)
  }
  return src;
}
