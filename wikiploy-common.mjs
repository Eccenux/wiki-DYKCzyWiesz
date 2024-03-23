import { DeployConfig } from 'wikiploy';

/**
 * Add config.
 * @param {Array} configs DeployConfig array.
 * @param {String} site Domian of a MW site.
 */
export function addConfig(configs, site, isRelease = false) {
	let deploymentName = isRelease ? 'MediaWiki:Gadget-CzyWiesz' : '~/CzyWiesz-dev';
	let ext = isRelease ? '.prod.js' : '.min.js';
	configs.push(new DeployConfig({
		src: 'dist/CzyWiesz' + ext,
		dst: `${deploymentName}.js`,
		site,
		nowiki: true,
	}));
	configs.push(new DeployConfig({
		src: 'dist/CzyWiesz.css',
		dst: `${deploymentName}.css`,
		site,
	}));
}
export function addConfigRelease(configs, site) {
	addConfig(configs, site, true);
}
