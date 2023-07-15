import {DeployConfig, Wikiploy, verlib} from 'wikiploy';

//
// init deployment bot
//
const ployBot = new Wikiploy();
// mock
// ployBot.mock = true;
// ployBot.mockSleep = 5_000;

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
		dst: '~/test-wikiploy--test.js',
	}));
	configs.push(new DeployConfig({
		src: 'dist/test.css',
		dst: '~/test-wikiploy--test.css',
	}));
	configs.push(new DeployConfig({
		src: 'dist/test.js',
		dst: '~/test-wikiploy--test.js',
		site: 'en.wikipedia.org',
	}));
	configs.push(new DeployConfig({
		src: 'dist/test.css',
		dst: '~/test-wikiploy--test.css',
		site: 'en.wikipedia.org',
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});
