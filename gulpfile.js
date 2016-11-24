// Dependencies
// ------------------------------------------
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    mmq = require('gulp-merge-media-queries'),
    cleancss = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    zip = require('gulp-zip'),
    browsersync = require('browser-sync');

// Compile & Dist files
// ------------------------------------------
gulp.task('compile', () => {
    return gulp.src('src/scss/gridling.scss')
        .pipe(
            sass({
                outputStyle: 'expanded',
                sourcemap: false
            })
            .on('error', sass.logError)
        )
        .pipe(mmq({
            log: true
        }))
        .pipe(gulp.dest('src/css'));
});

// Dist build
gulp.task('dist', ['compile'], () => {
    // SCSS
    gulp.src('src/scss/gridling.scss')
        .pipe(gulp.dest('dist/scss'));
    // CSS
    return gulp.src('src/css/gridling.css')
        .pipe(gulp.dest('dist/css'))
        // Minify CSS
        .pipe(cleancss({
            restructuring: false,
            keepSpecialComments: 1
        }))
        .pipe(rename('gridling.min.css'))
        .pipe(gulp.dest('dist/css'));
});

// ZIP package for splash site
gulp.task('zip', ['dist'], () => {
    gulp.src('dist/*/*')
        .pipe(zip('gridling-v-1.1.0.zip'))
        .pipe(gulp.dest('example'));
});

// Splash page (Example)
// ------------------------------------------
gulp.task('splash', () => {
    gulp.src('src/scss/splash.scss')
        .pipe(
            sass({
                outputStyle: 'expanded',
                sourcemap: false
            })
            .on('error', sass.logError)
        )
        .pipe(mmq({
            log: true
        }))
        .pipe(autoprefixer({
            browsers: ['>1%', 'ie 9']
        }))
        .pipe(gulp.dest('example/css'));
});

// Production tasks
// ------------------------------------------
gulp.task('watch', () => {

    // Start BrowserSync Server
    browsersync.init({
        server: {
            baseDir: "./example/"
        }
    });

    // Watch Files
    gulp.watch('src/scss/**/*.scss', ['splash']);
    gulp.watch('example/css/splash.css').on('change', browsersync.reload);
    gulp.watch('example/index.html').on('change', browsersync.reload);

});
