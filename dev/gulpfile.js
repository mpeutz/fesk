// Include gulp
var gulp = require('gulp');

// Include Plugins
var sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync'),
    reload       = browserSync.reload;

gulp.task('scss', function () {
    gulp.src('.css/partials/styles.scss')
        .pipe(sass())
        .on('error', function (err) { console.log(err.message); })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('./css'));
});

// browser-sync task for starting the server for chrome only.
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './'
        },
        startPath: 'styleguide/index.html'
    });
});


// Default Task compile Only (pass)
gulp.task('default', [ 'scss']);

// Default Task compile Only (pass)
gulp.task('server', [ 'browser-sync']);




