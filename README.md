# Wikiploy example

A rollout/deployment example that includes:
- Recommended setup for building scripts: Bundling multiple files into a single JS file (from `src` to `dist`).
- Visual Studio Code setup: Tasks and command bar for a one-click build.
- Deploy scripts: Separate developer and release deployments.
- Example gadget: Gadget with hooks and a link in the toolbar (*Tool* menu of articles).
- Full setup of unit testing: Simple parser class with a test. VSC is set up for test debugging.

## Testing Wikiploy

As a startup for your project, you can simply clone/fork this repository (treat it as a template). Otherwise, you should follow the [README: building your project, Wikiploy](https://github.com/Eccenux/Wikiploy/blob/main/README.building%20your%20project.md) recommendations.

Quick steps:
1. Clone this repository.
1. Run `npm i` to install libraries.
1. Open the repo folder in [VSCode](https://code.visualstudio.com/).
1. Install recommended extensions.
1. Run test and build commands from the command bar (green buttons, should be on the bottom bar of VSCode).

Note that before running `wikiploy.mjs`, you will have to set up your bot password and bot.config (see below).

## Steps to deploy

Note! It is now recommended to use the `WikiployLite` class (not `Wikiploy`). The older `Wikiploy` class uses Puppeteer and still works, but can be quite slow. **`WikiployLite` is much faster**. In future versions, Puppeteer integration might be removed. Please let me know if you would like to keep Puppeteer integration.


### Wikiploy full (deprecated)

**Step. 1. Create deployment script**. You can start with a basic script below.

**Step. 2. Run Chrome with debug**. Run Chrome Canary with debug mode enabled. I recommend using the Canary edition to ensure that you do not use your main Chrome browser for automation.

  - Example command on Windows:
  - "C:\Users\YOUR_USER_NAME\AppData\Local\Google\Chrome SxS\Application\chrome.exe" --remote-debugging-port=9222

### Wikiploy lite (recommnded)

**Step. 1. Create deployment script**. You can start with a basic script below or with `wikiploy.mjs` and `wikiploy-dev.mjs` provided in this repository.

**Step. 2. Prepare bot password**. 
* Setup you password on Special:BotPasswords. For Wikimedia wikis you can use: https://test.wikipedia.org/wiki/Special:BotPasswords
* Rights you should setup (if you can): https://github.com/Eccenux/Wikiploy/blob/main/assets/Bot%20passwords%20-%20Test%20Wikipedia.png

**Step. 3. Preapre bot.config.js**. 
* Create `bot.config.js` (note that your file MUST NOT be public).
* Example config file in: https://github.com/Eccenux/Wikiploy/blob/main/assets/bot.config.public.js

**Step. 4. Make sure bot.config.js is _not_ public**.

## Basic Wikiploy script

### Code to deploy test.js

This could be your `wikiploy.mjs`
```js
import { DeployConfig, Wikiploy } from 'wikiploy';

const ployBot = new Wikiploy();

// run asynchronusly to be able to wait for results
(async () => {
	const configs = [];
	configs.push(new DeployConfig({
		src: 'test.js',
		dst: 'User:Nux/test-wikiploy--test.js',
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});
```

Note that `wikiploy.mjs` and `wikiploy-dev.mjs` differ from the basic script above. However, the generic concepts are the same.

### Deployment details

Let's walk through above code.

This code is just to import classes defined in the Wikiploy.
```js
import { DeployConfig, Wikiploy } from 'wikiploy';
```

This just creates and instance of the `Wikiploy` class. Note that I'm using `const` from new-ish JavaScript (ES6).
```js
const ployBot = new Wikiploy();
```

This is just a bit fancy way to run asynchronously and catch errors. The `process.exit` here might be needed to finish the puppeteer process.
```js
(async () => {
  ...
})().catch(err => {
	console.error(err);
	process.exit(1);
});
```

This adds a single configuration (deployment specification):
```js
	configs.push(new DeployConfig({
		src: 'test.js',
		dst: 'User:Nux/test-jsbot--test.js',
	}));
```
You can have any number of configurations. Seriously, you could deploy a file to 100 destinations. It should just work. Wikiploy has quite robust caching, which should partially work even if you upload to multiple Wikimedia projects. And if you will use `WikiployLite` then it will be even faster.

And finally this runs deployments:
```js
	await ployBot.deploy(configs);
```


## Destination URL

There are various ways you can specify a URL.

### Explicit
You can specify `dst` explicitly. This would deploy in User:Example space:
```js
	configs.push(new DeployConfig({
		src: 'test.js',
		dst: 'User:Example/test.js',
	}));
```

### Logged in user
This would deploy the same as above for user "Example":
```js
	configs.push(new DeployConfig({
		src: 'test.js',
		dst: '~/test.js',
	}));
```

Or the same , but shorter:
```js
	configs.push(new DeployConfig({
		src: 'test.js',
	}));
```
This is recommended for user scripts when source name and destination name is the same. 

### Non-default site

Default site of Wikiploy is "pl.wikipedia.org".

You can change default globally like so:
```js
const ployBot = new Wikiploy();
ployBot.site = "en.wikipedia.org"; 
```

You can also deploy to multiple sites by changing config:
```js
	// to default/global
	configs.push(new DeployConfig({
		src: 'test.js',
	}));
	// to de.wiki
	configs.push(new DeployConfig({
		src: 'test.js',
		site: "de.wikipedia.org",
	}));
```

## See also
- [README: building your project](https://github.com/Eccenux/Wikiploy/blob/main/README.building%20your%20project.md) recommendation on how to build JS and CSS for your gadgets (includes unit testing setup).
