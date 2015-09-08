// Include gulp
var gulp = require('gulp');

// Include Plugins
var browserSync  = require('browser-sync'),
    reload       = browserSync.reload;


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
gulp.task('default', [ 'browser-sync']);
