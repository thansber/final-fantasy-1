// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jsonConcat = require('gulp-json-concat');

var mapJson = 'src/ff-maps/map-data/**/*.json';

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
    gulp.watch(mapJson, ['maps']);
});

gulp.task('json', function() {
  return gulp.src(mapJson)
    .pipe(jsonConcat('map-data.json', function(data){
      return new Buffer(JSON.stringify(data, null, '  '));
    }))
    .pipe(gulp.dest('src/ff-maps'));
});

// Default Task
gulp.task('default', ['watch']);
gulp.task('maps', ['json']);