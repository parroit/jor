/*
 * jor
 * https://github.com/parroit/jor
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var debug = require('gulp-debug');

gulp.task('test', function () {
  return gulp.src('./test/*.js')
    .pipe(debug())
    .pipe(mocha({
      ui: 'bdd',
      reporter: 'spec'
    }).on('err',function(err){
        console.log(err.stack);
    }));
});

gulp.task('watch', function () {
  gulp.watch(['./**/*.js'], ['test']);
});

gulp.task('default', ['test', 'watch']);
