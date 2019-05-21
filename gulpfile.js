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

gulp.task('uglify', function(){
    gulp.src('*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify().on('error', function(e){
            console.log(e, '---------------------------');
        }))
        .pipe(gulp.dest('js'));
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

// gulp.task('watch', function() {
//
//     // gulp.watch('app/img/*', gulp.series('images'));
// });

// gulp.task('default', ['less', 'serve']);

gulp.task('default', gulp.series('less', 'js', 'serve', 'uglify', function() {
    // default task code here
}));


//
//
// // Initialize modules
// // Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
// const { views, dest, series, parallel } = require('gulp');
// // Importing all the Gulp-related packages we want to use
// const sourcemaps = require('gulp-sourcemaps');
// const less = require('gulp-less');
// const concat = require('gulp-concat');
// const uglify = require('gulp-uglify');
// const postcss = require('gulp-postcss');
// const autoprefixer = require('autoprefixer');
// const cssnano = require('cssnano');
// var replace = require('gulp-replace');
// const watch = require('gulp-watch')
//
//
// // File paths
// const files = {
//     jsPath: 'app/js/**/*.js'
// }
//
// // Sass task: compiles the style.scss file into style.scss
// function lessTask(){
//     return views(files.scssPath)
//         .pipe(sourcemaps.init()) // initialize sourcemaps first
//         .pipe(less())
//         // .pipe(concat('dist/styles.css'))
//         .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
//         .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
//         .pipe(dest('dist')
//     ); // put final CSS in dist folder
// }
//
// // JS task: concatenates and uglifies JS files to script.js
// function jsTask(){
//     return views([
//         files.jsPath
//         //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
//         ])
//         .pipe(concat('all.js'))
//         .pipe(uglify())
//         .pipe(dest('dist')
//     );
// }
//
// // Cachebust
// var cbString = new Date().getTime();
//
// function cacheBustTask(){
//     // console.log(cbString)
//     return views(['index.html'])
//         .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
//         .pipe(dest('.'));
// }
//
// // Watch task: watch SCSS and JS files for changes
// // If any change, run scss and js tasks simultaneously
// function watchTask(){
//     watch([files.scssPath, files.jsPath],
//         parallel(lessTask, jsTask));
// }
//
// // Export the default Gulp task so it can be run
// // Runs the scss and js tasks simultaneously
// // then runs cacheBust, then watch task
// exports.default = series(
//     parallel(lessTask, jsTask),
//     cacheBustTask,
//     watchTask
// );