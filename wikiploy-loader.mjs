/**
 * Dev/staging deploy.
 */
import {DeployConfig, Wikiploy } from 'wikiploy';

import * as botpass from './bot.config.mjs';
const ployBot = new Wikiploy(botpass);

// default site
ployBot.site = "pl.wikipedia.org"; 

(async () => {
	// edit summary
	ployBot.summary = () => {
		return 'również dotykowe';
	};

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