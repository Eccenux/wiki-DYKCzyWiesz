import {DeployConfig, Wikiploy} from 'wikiploy';

//
// init deployment bot
//
const ployBot = new Wikiploy();
// mock
// ployBot.mock = true;
// ployBot.mockSleep = 5_000;

console.log(ployBot);

/**
 * Deploy test.js and css as user scripts.
 */
(async () => {
	const configs = [];
	configs.push(new DeployConfig({
		src: 'dist/test.js',
		dst: 'User:Nux/test-jsbot--test.js',
	}));
	configs.push(new DeployConfig({
		src: 'dist/test.css',
		dst: 'User:Nux/test-jsbot--test.css',
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});
