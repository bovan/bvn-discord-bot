var gulp = require('gulp');
var ts = require('gulp-typescript');
var mocha = require('gulp-mocha');
var typescript =  require('typescript');
var tsProject = ts.createProject('./tsconfig.json', {
    "typescript": typescript,
});

gulp.task('build', () => {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest('build'));
});

gulp.task('test', function() {
    // get tests files
    return gulp.src('./tests/*.ts')
    /* transpile */
    .pipe(ts({
        "typescript": typescript,
        "target": "es6",
        "module": "commonjs",
        "noImplicitAny": true,
        "preserveConstEnums": true,
        "outDir": "build/",
        "noEmitOnError": true,
        "rootDir": "./"
    }))
    /* throw it in with the rest */
    .pipe(gulp.dest('build/'))
    /* does it pass? */
    .pipe(mocha({
        reporter: 'progress'
    }));
});

gulp.task('default', ['build','test']);