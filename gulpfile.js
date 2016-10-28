var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
  sass: ['./src/**/**/*.scss' ],
  js: ['./src/app/**/**/*.js'],
  vendor: ['./vendor/**/*.js', './vendor.json'],
  img : ['./src/assets/img/*']
};

/*
 | --- SASS -----------------------------------------------
 */

gulp.task('sass', function(done) {
  gulp.src('./src/scss/main.scss')
    .pipe(concat('main.css'))
    .pipe(sass())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./public/css/'))
    .pipe(connect.reload())
    .on('end', done);
});

/*
 | --- JS -------------------------------------------------
 */

gulp.task('vendor', function(done) {

  var vendorFiles = require('./vendor.json');

  gulp.src(vendorFiles)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./public/js/'))
    .pipe(connect.reload())
    .on('end', done);
});

gulp.task('js', function(done) {
  gulp.src(paths.js)
    //.pipe(babel())
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./public/js/'))
    .pipe(connect.reload())
    .on('end', done);
});

gulp.task('images', function() {
  return gulp.src(paths.img)
    .pipe(gulp.dest('./public/assets/img'));
});

gulp.task('default', ['sass', 'js', 'vendor', 'images']);

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.vendor, ['vendor']);
  gulp.watch(paths.img, ['images']);
});

gulp.task('serve', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.vendor, ['vendor']);
  gulp.watch(paths.img, ['images']);

  connect.server({
    root: 'public',
    port: 3000,
    host: 'localhost',
    livereload: true,
    fallback: 'public/index.html'
  });
});
