var gulp = require('gulp');
var ts = require('gulp-typescript');
var mocha = require('gulp-mocha');

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('build', () => {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest('build'));
});

gulp.task('test', function() {
    //find test code - note use of 'base'
    return gulp.src('./tests/*.ts')
    /*transpile*/
    .pipe(ts({
        "target": "es6",
        "module": "commonjs",
        "noImplicitAny": true,
        "preserveConstEnums": true,
        "outDir": "build/",
        "noEmitOnError": true,
        "rootDir": "./"
    }))
    /*flush to disk*/
    .pipe(gulp.dest('build/'))
    /*execute tests*/
    .pipe(mocha({
        reporter: 'progress'
    }));
});
/* single command to hook into VS Code */
gulp.task('default', ['build','test']);