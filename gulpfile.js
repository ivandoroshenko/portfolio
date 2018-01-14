var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    csso         = require('gulp-csso'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    plumber      = require('gulp-plumber'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');



gulp.task('sass', function(){
    return gulp.src('src/sass/**/*.+(scss|sass)')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 9', 'ie 10'], {cascade: true}))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function(){
    return gulp.src([
        'src/libs/jquery/dist/jquery.min.js',
        'src/libs/parallax.js-1.5.0/parallax.min.js',
        'src/libs/countUp.js-master/countUp.js-master/countUp.js',
        'src/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
        'src/libs/slick-carousel/slick/slick.min.js'
    ])
    .pipe(plumber())
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'));
});

gulp.task('css-libs', ['sass'], function(){
    return gulp.src('src/css/libs.css') //сжатие css
    .pipe(plumber())
    .pipe(csso())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('src/css'));
});

gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'src'
    },
    notify: false
});
});

gulp.task('clear', function(){
    return cache.clearAll();
});

gulp.task('clean', function(){
    return del.sync('dist');
});

gulp.task('img', function(){
    return gulp.src('src/img/**/*')
    .pipe(plumber())
        .pipe(cache(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ])))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function(){
    gulp.watch('src/sass/**/*.+(scss|sass)', ['css-libs'], )
    gulp.watch('src/*.html', browserSync.reload)
    gulp.watch('src/js/**/*.js', browserSync.reload)
});

gulp.task('build', ['clean', 'img', 'css-libs', 'scripts'], function(){

var buildCss = gulp.src([
    'src/css/main.css',
    'src/css/libs.min.css',
    'src/libs/slick-carousel/slick/fonts/**/*',
    'src/libs/slick-carousel/slick/ajax-loader.gif'
])
    .pipe(gulp.dest('dist/css'));

var buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

var buildJs = gulp.src('src/js/**/*')
    .pipe(gulp.dest('dist/js'));

var buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});