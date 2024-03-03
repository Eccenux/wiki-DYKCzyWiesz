import { Wikiploy } from 'wikiploy';

import * as botpass from './bot.config.mjs';
const ployBot = new Wikiploy(botpass);

// common deploy function(s)
import { addConfig } from './wikiploy-common.mjs';
import { versionInfo } from './src/build/version.js';

// run asynchronously to be able to wait for results
(async () => {
	// custom summary from a prompt
	// await setupSummary(ployBot);
	// temp for v6 quick tests
	ployBot.summary = () => {
		return `v${versionInfo.version} changes from Github`;
	};

	// push out file(s) to wiki
	const configs = [];
	addConfig(configs, 'pl.wikipedia.org');

	await ployBot.deploy(configs);

})().catch(err => {
	console.error(err);
	process.exit(1);
});
