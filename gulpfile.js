var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var gulpIf = require('gulp-if');
var browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');

var config = {
    paths: {
        less: 'app/less/**/*.less',
        js: 'app/js/**/*.js',
        html: 'index.html'
    },
    output: {
        path: './dist',
        cssName: 'styles.css',
        jsName: 'all.js'
    },
    isDevelop: true
};

gulp.task('less', function() {
    return gulp.src(config.paths.less)
        .pipe(gulpIf(config.isDevelop, sourcemaps.init()))
        .pipe(less())
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer())
        .pipe(gulpIf(!config.isDevelop, cleanCss()))
        .pipe(gulpIf(config.isDevelop, sourcemaps.write()))
        .pipe(gulp.dest(config.output.path))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    return gulp.src(config.paths.js)
        .pipe(concat(config.output.jsName))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: config.output.path
        }
    });
    gulp.watch(config.paths.less, gulp.parallel('less'));
    gulp.watch(config.paths.js, gulp.series('js'));
    gulp.watch(config.paths.html).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('less', 'js', 'serve', function() {
    // default task code here
}));
