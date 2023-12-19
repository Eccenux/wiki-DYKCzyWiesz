import {DeployConfig, WikiployLite, verlib} from 'wikiploy';

//
// init deployment bot
//
import * as botpass from './bot.config.js';
const ployBot = new WikiployLite(botpass);
// mock
// ployBot.mock = true;

// extra if you want to read your version from the package.json
const version = await verlib.readVersion('./package.json');

// custom summary
ployBot.summary = () => {
	//return 'v2.7.0: adding a new cool feature';
	return `v${version}: adding a new cool feature`;
}

/**
 * Deploy test.js and css as user scripts.
 */
(async () => {
	const configs = [];
	configs.push(new DeployConfig({
		src: 'dist/test.js',
		dst: '~/test-wikiploylite--test.js',
	}));
	configs.push(new DeployConfig({
		src: 'dist/test.css',
		dst: '~/test-wikiploylite--test.css',
	}));
	configs.push(new DeployConfig({
		src: 'dist/test.js',
		dst: '~/test-wikiploylite--test.js',
		site: 'en.wikipedia.org',
	}));
	configs.push(new DeployConfig({
		src: 'dist/test.css',
		dst: '~/test-wikiploylite--test.css',
		site: 'en.wikipedia.org',
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});
