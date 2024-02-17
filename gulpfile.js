/**
	Building DYK with Gulp.

	Notes on using Babel in: README.babel.md.
*/

const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
// const watchify = require('watchify');
// const babel = require('babelify');
//const uglify = require('gulp-uglify');
const { replaceVersionDay } = require('./build/versionStamp.js');
const { stripJs } = require('./build/strip.js');

// "build": "npm run build-stamp && npm run build-js && npm run build-strip && node -e \"console.log('Build done');\" ",
/** Timestamp build in code. */
async function stamp(cb) {
	console.log(replaceVersionDay);
	await replaceVersionDay(); // Assuming replaceVersionDay is an async function
	cb();
}
/** Dev minify. */
async function stripDev(cb) {
	await stripJs('dist/CzyWiesz', 'src/_header.js');
	cb();
}
/** Pro minify. */
async function stripPro(cb) {
	const dev = false;
	await stripJs('dist/CzyWiesz', 'src/_header.js', dev);
	cb();
}

/** Main compilation process (merge and basic transform of files). */
function compile(watch, cb) {
	const mainjs = './src/main.js';
	const destinationjs = 'CzyWiesz.js';
	const destinationDir = './dist';

	// browserify conf
	const config = {
		entries: [mainjs],
		cache: {},
		packageCache: {},
	}
	if (watch) {
		// config.plugin = [watchify];
		console.error('Watch is disabled. If you really need it use:')
		console.warn('npm install --save-dev gulp watchify')
	}
	const bundler = browserify(config);
	// 	.transform("babelify", {presets: ["@babel/preset-env"]})
	// ;

	function rebundle() {
		bundler.bundle()
			.on('error', function (err) {
				console.error(err);
				cb(); // Signal completion
			})
			.pipe(source(destinationjs))
			.pipe(buffer())
			// .pipe(uglify())
			.pipe(gulp.dest(destinationDir))
			.on('end', cb); // Signal completion
	}

	if (watch) {
		bundler.on('update', function () {
			console.log('-> bundling...');
			rebundle();
		});
	}

	rebundle();
}

function watchTask(cb) {
	return compile(true, cb);
}
function compileTask(cb) {
	return compile(false, cb);
}

const buildDev = gulp.series(stamp, compileTask, stripDev);
const buildPro = gulp.series(stamp, compileTask, stripPro);
const build = gulp.series(stamp, compileTask, stripDev, stripPro);
// Babel+uglify
// const buildPro = gulp.series(stamp, compileTask);

exports.watch = gulp.series(stamp, watchTask);
exports.buildDev = buildDev;
exports.buildPro = buildPro;
exports.build = build;
exports.default = build;