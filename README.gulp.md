# Gulp

Gulp is used for building JS. Technically, it runs tasks, some of which are used to build JS.

## Why Gulp

Gulp is much faster than running multiple `npm run` commands. Starting Node can take a second or two, while running a task can take milliseconds. So, running all tasks in a single Node call just makes sense.

## Running gulp

You can use `npm i` and then `npm run build`. That should always work.

Another good option is to use:
```
node ./node_modules/gulp/bin/gulp.js
```

## Gulp tasks

Since Gulp 4 any function you export is a gulp task.

Tasks should either use `cb` callback to indicate they are done:
```   
function defaultTask(cb) {
	compilation.then(()=>{
		cb();
	});
}
exports.default = defaultTask
```

Or they can use Promises:
```
function promiseTask() {
  return Promise.resolve('the value is ignored');
}

exports.default = promiseTask;
```

Or just use `async` (which technically is equivalent to returning a promise).
```
async function promiseTask() {
  	const text = await Promise.resolve('we are done');
	console.log(text);
}

exports.default = promiseTask;
```

## Multiple tasks in one

See: https://gulpjs.com/docs/en/getting-started/creating-tasks/#compose-tasks

In short use `gulp.series(step1Task, step2Task)` or `gulp.parallel(jsTask, cssTask)`.

## Babel in Gulp

Notes on using Babel.

Install all things BabelJS ([docs on Babelify](https://github.com/babel/babelify?tab=readme-ov-files)):
```bash
npm install --save-dev babelify @babel/core @babel/preset-env gulp-uglify
```

Well *uglify* is not required, but it would probably be worth to minify code as babel make it quite large... Or maybe MW minifier would be good enough and we can skip that? In any case Babel's output is not really readable, even when targeting ES2016 (async is ES2017).

Note that you might need to adjust browser config in `babel.config.json`. Note that this has nothing to do with the browsers you want to support really... You need to support the MW minifier. See [T277675#9526588, WMF phabricator](https://phabricator.wikimedia.org/T277675#9526588).