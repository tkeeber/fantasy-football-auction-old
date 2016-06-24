var gulp = require('gulp')
var postcss = require('gulp-postcss')
var autoprefixer = require('autoprefixer')
var mqpacker = require('css-mqpacker')
var sass = require('gulp-sass')
var replace = require('gulp-replace')
var cssnano = require('gulp-cssnano')

gulp
  .task('build', function () {
    var processors = [autoprefixer({
      browsers: ['last 10 Chrome versions']
    }), mqpacker]
    gulp.src('./src/scss/imports.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss(processors))
      .pipe(sass().on('error', sass.logError))
      .pipe(cssnano())
      .pipe(gulp.dest('./dist/css/'))
    gulp.src('src/favicon.ico')
      .pipe(gulp.dest('dist'))
    gulp.src(['src/index.html'])
      .pipe(replace('app/index.js', 'app.js'))
      .pipe(gulp.dest('./dist/'))
    gulp.src('src/assets/**/*.*')
      .pipe(gulp.dest('dist/assets'))
  })
  .task('watch', ['build'], function () {
    return gulp.watch([
      'src/*.js',
      'src/app/**/*.js',
      'src/scss/**/*.scss'
    ], ['build'])
  })
