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
const port = 3000

gulp.task('clean', gulp.series(function (done) {
  del.sync(['static']);
  return done()
}))

gulp.task('version', gulp.series(async function () {
  return await gitrev.long(async function (str) {
    return await string_src('version.cache', str).pipe(gulp.dest('static'))
  })
}))

gulp.task('content', gulp.series( function () {
  return gulp.src('app/**/*.{xml,json,yml}')
    .pipe(gulp.dest('static'))
}))

gulp.task('scripts', gulp.series( function () {
  return browserify({
      entries: 'app/scripts/main.js',
      debug: true
    })
    .bundle()
    .on('error', notify.onError(function (error) { return error.message; }))
    .pipe(source('main.js'))
    .pipe(gulp.dest('static/scripts/'))
    .pipe(browserSync.stream())
}))

gulp.task('styles', gulp.series( function (done) {
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
}))

gulp.task('default', gulp.series( ['clean', 'version', 'styles', 'scripts', 'content'], async function (done) {
  browserSync({
    proxy: {
      target: `http://localhost:${port}/`,
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

  gulp.watch('webapp/views/**/*', gulp.parallel(reload))
  gulp.watch('app/styles/**/*', gulp.parallel(['styles']))
  gulp.watch('app/scripts/**/*', gulp.parallel(['scripts']))

  return done()
}))

gulp.task('build', gulp.series([
   'clean',
   'version',
   'styles',
   'scripts',
   'content',
   'default']
))

function string_src(filename, string) {
  let src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new File({
      cwd: "",
      base: "base",
      path: filename,
      contents: new Buffer.alloc(0,string)
    }))
    this.push(null)
  }
  return src
}