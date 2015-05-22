var browserSync = require('browser-sync'),
    bump = require('gulp-bump'),
    concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    header = require('gulp-header'),
    pkg = require('./package.json'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

var manifests = ['./bower.json', './package.json'];


gulp.task('bump', function(){
  return gulp.src(manifests)
    .pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
});


gulp.task('bump:minor', function(){
  return gulp.src(manifests)
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});


gulp.task('clean', function clean(done){
  del('./target/*', done);
});


gulp.task('copy', function copy(){
  return gulp.src(['./src/**/*.html', './src/**/*.js'])
    .pipe(gulp.dest('./target'));
});


gulp.task('sync', function server(){
  browserSync
    .create()
    .init({
      browser: "firefox",
      files: ['target/**/*', 'vendor/**/*'],
      port: 7000,
      server: {
        baseDir: '.'
      }
    });
});


gulp.task('build', function(){
  var headerTemplate = '/* <%= name %> v<%= version %> - <%= date %> */\n';
  var headerContent = {name: pkg.name, version: pkg.version, date: new Date()};

  return gulp.src(['./vendor/promise/browser-raw.js', './vendor/promise/core.js', './src/images-ready.js'])
    .pipe(concat('images-ready.js'))
    .pipe(header(headerTemplate, headerContent))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify({mangle: true}))
    .pipe(rename('images-ready.min.js'))
    .pipe(header(headerTemplate, headerContent))
    .pipe(gulp.dest('./dist'));
});


gulp.task('default', gulp.series('clean', 'copy', function watch(){
  gulp.watch(['./src/**/*.html', './src/**/*.js'], gulp.task('copy'));
}));
