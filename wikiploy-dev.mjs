import { WikiployLite } from 'wikiploy';

import * as botpass from './bot.config.mjs';
const ployBot = new WikiployLite(botpass);

// common deploy function(s)
import { addConfig, setupSummary } from './wikiploy-common.mjs';

// run asynchronously to be able to wait for results
(async () => {
	// custom summary from a prompt
	await setupSummary(ployBot);
	// temp for v6 quick tests
	// ployBot.summary = () => {
	// 	return 'v6 test';
	// };

	// push out file(s) to wiki
	const configs = [];
	addConfig(configs, 'pl.wikipedia.org');

	await ployBot.deploy(configs);

})().catch(err => {
	console.error(err);
	process.exit(1);
});
