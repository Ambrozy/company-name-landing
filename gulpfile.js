'use strict';

var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    // css
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    // other
    connect    = require('gulp-connect'),
  	imagemin   = require('gulp-imagemin');

// HTML5
gulp.task('workflow:copy', function() {
  return gulp.src('src/*.html').pipe(gulp.dest('build/'));
});
gulp.task('watch:copy', function() {
  gulp.watch('src/*.html', gulp.series('workflow:copy'));
});

// CSS
gulp.task('workflow:css', function () {
  return gulp
    .src('src/index.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({ errLogToConsole: true, outputStyle: 'expanded', includePaths: ['./node_modules'] }).on('error', sass.logError))
		.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(csso({ restructure: false }))
		.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/'))
});
gulp.task('watch:css', function() {
  gulp.watch('src/**/*.scss', gulp.series('workflow:css'));
});

// IMAGES
gulp.task('workflow:imagemin', function() {
  return gulp.src('src/img/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('build/img'));
});
gulp.task('watch:imagemin', function() {
  gulp.watch('src/img/**/*.{jpg,png,gif}', gulp.series('workflow:imagemin'));
});

// DEV SERVER
gulp.task('connect', function() {
	connect.server({
		root: ['build/'],
		livereload: true
	});
});

gulp.task('watch', gulp.parallel('watch:copy', 'watch:css', 'watch:imagemin'));
gulp.task('build', gulp.parallel('workflow:copy', 'workflow:css', 'workflow:imagemin'));
gulp.task('default', gulp.series('build', gulp.parallel('connect', 'watch')));
