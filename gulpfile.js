'use strict';
const { src, dest, series, watch, parallel } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const fileinclude = require('gulp-file-include');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync').create();
const svgSprite = require('gulp-svg-sprite');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const notify = require('gulp-notify');
const image = require('gulp-image');
const concat = require('gulp-concat');
const gulpFont = require('gulp-font');

const clean = () => {
  return del(['dev', 'build']);
};

//dev

const pages = () => {
  return src(['src/**/*.html'])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(dest('dev'))
    .pipe(browserSync.stream());
};

const styles = () => {
  return src('src/css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(
      cleanCSS({
        level: 2,
        format: {
          breaks: {
            afterAtRule: true,
            afterBlockBegins: true,
            afterBlockEnds: true,
            afterComment: true,
            afterProperty: true,
            afterRuleBegins: true,
            afterRuleEnds: true,
            beforeBlockEnds: true,
            betweenSelectors: true,
          },
          breakWith: '\n',
          indentBy: 2,
          indentWith: 'space',
          spaces: {
            aroundSelectorRelation: true,
            beforeBlockBegins: true,
            beforeValue: true,
          },
          semicolonAfterLastProperty: true,
        },
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest('dev/css'))
    .pipe(browserSync.stream());
};

const scss = () => {
  return (
    src('src/sass/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass.sync())
      //.pipe(autoprefixer({ browsers: ['last 3 versions'], cascade: false }))
      // .pipe(concat('index.css'))
      .pipe(sourcemaps.write())
      .pipe(dest('src/css/'))
      .pipe(browserSync.stream())
  );
};

const scripts = () => {
  return src(['src/js/components/**.js', './src/js/main.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify().on('error', notify.onError()))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dev/js'))
    .pipe(browserSync.stream());
};

const images = () => {
  return src([
    './src/img/**/*.svg',
    './src/img/**/*.jpg',
    './src/img/**/*.png',
    './src/img/**/*.jpeg',
  ])
    .pipe(sourcemaps.init())
    .pipe(image())
    .pipe(sourcemaps.write())
    .pipe(dest('dev/img'))
    .pipe(browserSync.stream());
};

const svgSprites = () => {
  return src('./src/img/svg/**.svg')
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
          },
        },
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest('dev/img'))
    .pipe(browserSync.stream());
};

const fonts = ()=> {
  return src('src/fonts/**/*.{woff, woff2}', { read: false })
      // .pipe(gulpFont({
      //      ext: '.css',
      //      fontface: 'src/fonts',
      //      relative: '/fonts',
      //      dest: 'dev/fonts',
      //      embed: ['woff2','woff'],
      //      collate: false
      // }))
      .pipe(dest('dev/fonts'))
      .pipe(browserSync.stream());
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dev',
    },
    port: 9500,
  });
};

watch('src/**/*.html', pages);
watch('src/css/**/*.css', styles);
watch('src/js/**/*.js', scripts);
watch(
  [
    'src/img/**/*.jpg',
    'src/img/**/*.jpeg',
    'src/img/**/*.png',
    'src/img/**/*.svg',
  ],
  images
);
watch('src/img/sprite/**/*.svg', svgSprites);
watch('./src/sass/**/*.scss', scss);
watch('./src/fonts/*.woff2, ./src/fonts/*.woff', scss);

//build

const minifyHTML = () => {
  return src('dev/**/*.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest('build'));
};

const resources = () => {
  return src('src/resources/**').pipe(dest('build/resources/'));
};

const buildStyles = () => {
  return src('dev/**/*.css')
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(dest('build'));
};

const buildImages = () => {
  return src([
    'dev/img/**/*.jpg',
    'dev/img/**/*.jpeg',
    'dev/img/**/*.png',
    'dev/img/**/*.svg',
  ]).pipe(dest('build/img'));
};

const buildScripts = () => {
  return src('dev/**/*.js')
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(uglify().on('error', notify.onError()))
    .pipe(dest('build'));
};

exports.scss = scss;
exports.clean = clean;
exports.default = series(
  clean,
  pages,
  scss,
  styles,
  scripts,
  images,
  fonts,
  svgSprites,
  watchFiles
);
exports.build = series(
  minifyHTML,
  buildStyles,
  buildImages,
  buildScripts,
  resources
);

exports.fonts = fonts;
