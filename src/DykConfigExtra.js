const { ReadJsonCached } = require("./ReadJsonCached");

/**
 * Reads extra config from wiki (JSON).
 * 
 * Some defaults in 
 */
class DykConfigExtra {
	constructor(coreConfig) {
		this.coreConfig = coreConfig;
		this.configHelper = new ReadJsonCached(coreConfig.wikiConfigTitles, coreConfig.wikiConfigKey);
		this.data = coreConfig.wiki;
		this.parsed = false;
	}

	async getConfig() {
		if (this.parsed) {
			return this.data;
		}
		try {
			const data = await this.configHelper.getConfig();
			this.merge(this.data, data);
			this.parsed = true;
		} catch (error) {
			console.error("Error fetching configuration:", error);
		}
		return this.data;
	}

	/** @private @static Validate and merge into `base` object. */
	merge(base, data) {
		if (!data) {
			return;
		}
		if (Array.isArray(data.events)) {
			for (const event of data.events) {
				if (typeof event.code === 'string' && typeof event.name === 'string') {
					base.events.push({ code: event.code, name: event.name });
				} else {
					console.warn('[DYK] Invalid event:', event);
				}
			}
		}
		if (data.options && typeof data.options === 'object') {
			$.extend(base.options, data.options);
		}
	}
}

// eslint-disable-next-line no-unused-vars
async function quickCheck() {
	const config = {
		wikiConfigKey: 'dyk-extra-options',
		wikiConfigTitles: {
			"Wikiprojekt:Czy_wiesz/konfiguracja/opcje.json": "options",
			"Wikiprojekt:Czy_wiesz/konfiguracja/akcje.json": "events",
		},
		wiki: {
			events: [],
			options: {
				hardLimitDays: 30,
				warnLimitDays: 10,
			},
		},
	};
	var configHelper = new DykConfigExtra(config);
	var extraConfig = await configHelper.getConfig();
	console.log(extraConfig);

	// merge?
	var base = {
		events: [],
		options: {
			hardLimitDays: 123,
			warnLimitDays: 34,
		},
	};
	configHelper.merge(base, {events:[
		{name:"Tytuł"},
		{code:'test', name:"Testowy"},
	]});
	console.log(base);

	configHelper.merge(base, {events:[
		{code:'test1', name:"Testowy1"},
		{code:'test2', name:"Testowy2"},
	]});
	console.log(base);

	console.log('Done');
}
// quickCheck();

module.exports = { DykConfigExtra };