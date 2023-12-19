import { DeployConfig, userPrompt } from 'wikiploy';

/**
 * Add config.
 * @param {Array} configs DeployConfig array.
 * @param {String} site Domian of a MW site.
 */
export function addConfig(configs, site, isRelease) {
	let deploymentName = isRelease ? '~/yourGadgetName' : '~/yourGadgetName-dev';
	configs.push(new DeployConfig({
		src: 'dist/yourGadgetName.js',
		dst: `${deploymentName}.js`,
		site,
		nowiki: true,
	}));
	configs.push(new DeployConfig({
		src: 'dist/yourGadgetName.css',
		dst: `${deploymentName}.css`,
		site,
	}));
}
export function addConfigRelease(configs, site) {
	addConfig(configs, site, true);
}

/**
 * Read and setup summary.
 * @param {WikiployLite} ployBot 
 */
export async function setupSummary(ployBot) {
	const summary = await userPrompt('Summary of changes (empty for default summary):');
	if (typeof summary === 'string' && summary.length) {
		ployBot.summary = () => {
			return summary;
		};
	}
}
