const gulp = require('gulp');
const mocha = require('gulp-mocha');
const livereload = require('gulp-livereload');
 
gulp.task('less', function() {
  gulp.src('less/*.less')
    .pipe(less())
    .pipe(gulp.dest('css'))
    .pipe(livereload());
});
 
gulp.task('watch', function() {
  
  gulp.watch('less/*.less', ['less']);
});

const watchList = ['index.js', 'test/**', 'lib/**'];
const tests = 'test/*.js';

exports.test = () => (
  gulp.src(['test/**/*.js'], {read: false})
      .pipe(mocha({reporter: 'list', exit: true}))
      .on('error', console.error));

exports.watch = () => {
  livereload.listen();
  gulp.watch(watchList, () => {
    return gulp.src(tests)
        .pipe(livereload())
        .pipe(mocha({reporter: 'list'}))
        .on('error', (err) => {
          console.log(err.stack);
        });
  });
};

