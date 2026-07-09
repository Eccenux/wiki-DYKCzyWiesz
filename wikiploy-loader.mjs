/**
 * Dev/staging deploy.
 */
import {DeployConfig, setupSummary, Wikiploy } from 'wikiploy';

import * as botpass from './bot.config.mjs';
const ployBot = new Wikiploy(botpass);

// default site
ployBot.site = "pl.wikipedia.org"; 
import { versionInfo } from './src/build/version.js';

(async () => {
	// edit summary
	await setupSummary(ployBot, versionInfo.version, 'zmiany z Github');

	// deploy
	let file = `src/CzyWiesz-loader.js`;
	console.log('\nDeploy:', file);
	const configs = [];
	configs.push(new DeployConfig({
		src: file,
		dst: 'MediaWiki:Gadget-CzyWiesz-loader.js',
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});