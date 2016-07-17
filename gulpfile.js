var gulp = require('gulp'),
    // http://nodemon.io/
    // Nodemon is a utility that will monitor for any changes in your source and automatically restart your server. Perfect for development.
    nodemon = require('gulp-nodemon');

gulp.task('default', function () {
    nodemon({
        script: 'app.js',
        ext: 'js',
        env: {
            PORT: 8000
        },
        ignore: ['./node_modules/**']
    })
        .on('restart', function () {
            console.log('Changes detected. Restarting server..');
        });
});