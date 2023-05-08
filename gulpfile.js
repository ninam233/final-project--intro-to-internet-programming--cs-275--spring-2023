const { src, dest, series, watch } = require(`gulp`);
const htmlCompressor = require(`gulp-htmlmin`);
const cssLinter = require(`gulp-stylelint`);
const jsTranspiler = require(`gulp-babel`);
const jsLinter = require(`gulp-eslint`);
const jsCompressor = require(`gulp-uglify`);
const cssCompressor = require(`gulp-uglifycss`);
const sync = require(`browser-sync`);

let browserChoice = `default`;

let browserHost = () => {
    sync.init({
        notify: true,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: `./temp`,
        },
        open: true,
    });

    watch(`dev/html/*.html`, series(copyHTML)).on(`change`, sync.reload);
    watch(`dev/js/*.js`, series(lintJS, transpileJS)).on(`change`, sync.reload);
    watch(`dev/css/*.css`, series(lintCSS)).on(`change`, sync.reload);
};

let compressHTML = () => {
    return src(`dev/html/*.html`)
        .pipe(htmlCompressor({collapseWhitespace:true}))
        .pipe(dest(`prod`));
};

let lintCSS = () => {
    return src(`dev/css/style.css`)
        .pipe(cssLinter({
            reporters: [
                {formatter: `string`, console: true}
            ]}))
        .pipe(dest(`temp/css`));
};

let compressCSS = () => {
    return src(`dev/css/*.css`)
        .pipe(cssCompressor())
        .pipe(dest(`prod/css`));
};

let lintJS = () => {
    return src(`dev/js/*.js`)
        .pipe(jsLinter())
        .pipe(jsLinter.result(result => {
            console.log(`JavaScript Linting Result: ${result.filePath}`);
            console.log(`# Messages: ${result.messages.length}`);
            console.log(`# Warnings: ${result.warningCount}`);
            console.log(`# Errors: ${result.errorCount}`);
        }))
        .pipe(dest(`temp/js`));
};

let transpileJS = () => {
    return src(`dev/js/*.js`)
        .pipe(jsTranspiler())
        .pipe(dest(`temp/js`));
};

let minifyJS = () => {
    return src(`dev/js/*.js`)
        .pipe(jsTranspiler())
        .pipe(jsCompressor())
        .pipe(dest(`prod/js`));
};

let lintGulpfile = () => {
    return src(`gulpfile.js`)
        .pipe(jsLinter())
        .pipe(jsLinter.result(result => {
            console.log(`Gulp Linting Result: ${result.filePath}`);
            console.log(`# Messages: ${result.messages.length}`);
            console.log(`# Warnings: ${result.warningCount}`);
            console.log(`# Errors: ${result.errorCount}`);
        }));
};

let copyHTML = () => {
    return src(`dev/html/*html`)
        .pipe(dest(`temp`));
};

let copyCSS = () => {
    return src(`dev/css/reset.css`)
        .pipe(dest(`temp/css`));
};

// Define tasks
exports.default = series(
    lintCSS,
    lintJS,
    transpileJS,
    copyHTML,
    copyCSS,
    browserHost
);

exports.build = series(
    compressHTML,
    compressCSS,
    minifyJS
);

// Define gulp lint task
exports.lint = series(
    lintGulpfile
);

exports.default.description = 'Builds and watches for changes in development mode';
exports.build.description = 'Builds the project for production';
exports.lint.description = 'Lints gulpfile.js using ESLint';
