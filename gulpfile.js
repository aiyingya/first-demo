/* jshint globalstrict:true, node:true */

'use strict';
var gulp = require('gulp');
var del = require('del');
// gulp-uglify
// used for minify javascript files
var uglify = require('gulp-uglify');
// concat plugin


// img min plugin
// var imagemin = require('gulp-imagemin');
// var pngquant = require('imagemin-pngquant');

// javascript file tasks
gulp.task('js', function() {
    gulp.src('./src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('lib/'));
});

// 清理
gulp.task('clean', function (cb) {
  return del(['./lib']);
});

// default task
gulp.task('build', ['js'], function() {

});
//default 任务
gulp.task('default',['clean'],function() {
  gulp.start('build');
});
