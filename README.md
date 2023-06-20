# Wikiploy example

A basic rollout/deployment example.

## Steps to deploy

Create a script from scratch:

1. **Prepare JS and CSS**. This can be just raw, vanilla test.js and test.css.
2. **Install Wikiploy**. Run `npm install wikiploy` (or `npm i ...`). Obviously you need [Node.JS](https://nodejs.org/en) for that. Node 12+ should be fine (you can use NVM if you need some old Node.js as well).
3. **Enable import/export modules**. If you want to use newer syntax for importing Node modules remeber to add `"type": "module",` in `package.json` (see example `package.json`).
4. **Create deployment script**. Basic script below.
5. **Run Chrome with debug**. Run Chrome Canary with debug. I recomend Canary edition so that you make sure not to use your main Chrome for automation.
  - Example commond on Windows:
  - "C:\Users\YOUR_USER_NAME\AppData\Local\Google\Chrome SxS\Application\chrome.exe" --remote-debugging-port=9222

## Basic script

### Code to deploy test.js
```
import DeployConfig from 'wikiploy/DeployConfig.js';
import Wikiploy from 'wikiploy/Wikiploy.js';

const ployBot = new Wikiploy();

// run asynchronusly to be able to wait for results
(async () => {
	const configs = [];
	configs.push(new DeployConfig({
		src: 'test.js',
		dst: 'User:Nux/test-jsbot--test.js',
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});
```

### Deployment details

This is just to import classes defined in the Wikiploy.
```
import DeployConfig from 'wikiploy/DeployConfig.js';
import Wikiploy from 'wikiploy/Wikiploy.js';
```

This just creates and instance of the `Wikiploy` class. Note that I'm using const from new-ish Javascript.
```
const ployBot = new Wikiploy();
```

This is just a bit fancy way to run asynchronusly and catch errors. The `process.exit` here might be needed to finish the puppeteer process.
```
(async () => {
  ...
})().catch(err => {
	console.error(err);
	process.exit(1);
});
```

This adds a single configuration (deployment specification):
```
	configs.push(new DeployConfig({
		src: 'test.js',
		dst: 'User:Nux/test-jsbot--test.js',
	}));
```
You can have any number of configuration. Seriously, you could deploy a file to 100 destinations. It should just work.

And finally this runs deployments:
```
	await ployBot.deploy(configs);
```
