const gulp         = require('gulp');
const sass         = require('gulp-sass')(require('sass'));
const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const terser       = require('gulp-terser');
const csso         = require('gulp-csso');
const rename       = require('gulp-rename');
const del          = require('del').deleteSync;
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant');
const plumber      = require('gulp-plumber');
const cache        = require('gulp-cache');
const autoprefixer = require('gulp-autoprefixer');
const fileinclude  = require('gulp-file-include');

// Clean dist folder
const clean = (done) => {
    del('dist');
    done();
};

// Include HTML components for root level HTML files
const includeHTML = () => {
    return gulp.src('*.html.template')
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './'
        }))
        .pipe(rename(path => {
            path.basename = path.basename.replace('.html', '');
            path.extname = '.html';
        }))
        .pipe(gulp.dest('.'));
};

// Include HTML components for src directory HTML files
const includeHTMLSrc = () => {
    return gulp.src('src/*.html.template')
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src'
        }))
        .pipe(rename(path => {
            path.basename = path.basename.replace('.html', '');
            path.extname = '.html';
        }))
        .pipe(gulp.dest('src'));
};

// Compile SCSS/SASS
const sassCompile = () => {
    return gulp.src('src/sass/**/*.+(scss|sass)')
        .pipe(plumber())
        .pipe(sass({
            quietDeps: true,
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 15 versions', '> 1%'],
            cascade: true
        }))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
};

// Bundle and minify JS libraries
const scripts = () => {
    return gulp.src([
        'src/libs/jquery/dist/jquery.min.js',
        'src/libs/parallax.js-1.5.0/parallax.min.js',
        'src/libs/countUp.js-master/countUp.js-master/countUp.js',
        'src/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
        'src/libs/slick-carousel/slick/slick.min.js'
    ])
        .pipe(plumber())
        .pipe(concat('libs.min.js'))
        .pipe(terser())
        .pipe(gulp.dest('src/js'));
};

// Minify CSS libs
const cssLibs = () => {
    return gulp.src('src/css/libs.css')
        .pipe(plumber())
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('src/css'));
};

// Optimize images
const img = () => {
    return gulp.src('src/img/**/*')
        .pipe(plumber())
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75}),
            imagemin.optipng({optimizationLevel: 5}),
            pngquant({quality: [0.6, 0.8]}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ])))
        .pipe(gulp.dest('src/img'));
};

// Clear cache
const clearCache = () => {
    return cache.clearAll();
};

// Browser sync
const sync = () => {
    browserSync.init({
        server: {
            baseDir: '.'
        },
        notify: false,
        serveStatic: [
            {
                route: '/css',
                dir: 'src/css'
            },
            {
                route: '/js',
                dir: 'src/js'
            },
            {
                route: '/img',
                dir: 'src/img'
            },
            {
                route: '/fonts',
                dir: 'src/fonts'
            },
            {
                route: '/libs',
                dir: 'src/libs'
            },
            {
                route: '/video',
                dir: 'src/video'
            }
        ]
    });
};

// Reload browser
const reload = (done) => {
    browserSync.reload();
    done();
};

// Watch files
const watch = () => {
    gulp.watch('src/sass/**/*.+(scss|sass)', gulp.series(sassCompile, cssLibs));
    gulp.watch('*.html.template', gulp.series(includeHTML, reload));
    gulp.watch('src/*.html.template', gulp.series(includeHTMLSrc, reload));
    gulp.watch('src/components/**/*.html', gulp.series(includeHTML, includeHTMLSrc, reload));
    gulp.watch('src/js/**/*.js', reload);
};

// Build for production
const build = gulp.series(
    clean,
    gulp.parallel(img, cssLibs, scripts),
    () => {
        const buildCss = gulp.src([
            'src/css/main.css',
            'src/css/libs.min.css',
            'src/libs/slick-carousel/slick/fonts/**/*',
            'src/libs/slick-carousel/slick/ajax-loader.gif'
        ])
            .pipe(gulp.dest('dist/css'));

        const buildHtml = gulp.src('src/*.html')
            .pipe(gulp.dest('dist'));

        const buildFonts = gulp.src('src/fonts/**/*')
            .pipe(gulp.dest('dist/fonts'));

        const buildJs = gulp.src('src/js/**/*')
            .pipe(gulp.dest('dist/js'));

        return gulp.src('src/video/**/*')
            .pipe(gulp.dest('dist/video'));
    }
);

// Development task
const dev = gulp.series(
    gulp.parallel(sassCompile, scripts),
    cssLibs,
    gulp.parallel(includeHTML, includeHTMLSrc),
    gulp.parallel(sync, watch)
);

// Exports
exports.sass = sassCompile;
exports.scripts = scripts;
exports.cssLibs = cssLibs;
exports.img = img;
exports.clear = clearCache;
exports.clean = clean;
exports.include = gulp.series(includeHTML, includeHTMLSrc);
exports.build = build;
exports.watch = dev;
exports.default = dev;