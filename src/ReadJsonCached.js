/**
 * Reads wiki-JSON pages.
 * 
 * @example
	(async () => {
		var globalKey = "my-gadget-options";
		var titleMap = {
			"Wikiprojekt:Czy_wiesz/konfiguracja/opcje.json": "options",
			"Wikiprojekt:Czy_wiesz/konfiguracja/akcje.json": "events",
		};
		var configHelper = new ReadJsonCached(titleMap, globalKey);
		var data = await configHelper.getConfig();
		console.log(data);
	})();
* 
*/
class ReadJsonCached {
	
	/**
	 * Pre-init.
	 * @param {Object} titles Map: {"Page title" : "objectKey"}.
	 * @param {String} cacheKey Globally unique(!) caching key.
	 */
	constructor(titles, cacheKey) {
		/** @private Combined data. */
		this.cachedData = null;
		/** @private Number from 1970. */
		this.cacheTimestamp = null;

		/** The API url. */
		this.apiUrl = "https://pl.wikipedia.org/w/api.php";
		
		/** Max age in hours. */
		this.cacheMaxAge = 24;

		/** Globally unique caching key. */
		this.cacheKey = cacheKey;

		/** Mapping: page titles to object keys. */
		this.titles = {};
		// optionally from constructor (for other projects)
		if (typeof titles === 'object') {
			this.titles = titles;
		}
	}

	/**
	 * Loads pages specified by `this.titles`.
	 * 
	 * @private
	 * 
	 * @returns Combined JSON.
	 */
	async fetchConfig() {
		const url = this.apiUrl;
		const params = new URLSearchParams({
			action: "query",
			prop: "revisions",
			titles: Object.keys(this.titles).join('|'),
			rvprop: "content",
			format: "json"
		});

		const response = await fetch(`${url}?${params.toString()}`);
		const data = await response.json();

		// Process the fetched data
		const pages = data.query.pages;
		const combinedData = {};

		// De-normalized translation map
		let normalized = {};
		if (data.query.normalized) {
			data.query.normalized.forEach(normalization => {
				normalized[normalization.to] = normalization.from;
			});
		}
		
		for (const pageId in pages) {
			if (pages.hasOwnProperty(pageId)) {
				const page = pages[pageId];
				let title = page.title;
				if (title in this.titles) {
					title = this.titles[title];
				} else if (title in normalized) {
					title = this.titles[normalized[title]];
				} else {
					console.warn('title not found', title);
				}
				let content = page.revisions[0]["*"];
				combinedData[title] = JSON.parse(content);
			}
		}

		// Update cache
		this.cachedData = combinedData;
		this.cacheTimestamp = Date.now();
		this.storageSave();

		return combinedData;
	}

	/** @private Temporary debug. */
	debug(arg1='', arg2='') {
		console.log('[DYK-opt]', arg1, arg2);
	}

	/** @private Store in ~permanent storage. */
	storageSave() {
		if (typeof mw ==='object' && mw.storage) {
			this.debug('store');
			mw.storage.setObject(this.cacheKey, {
				cachedData: this.cachedData,
				cacheTimestamp: this.cacheTimestamp,
			});
		}
	}
	/** @private Restore from ~permanent storage. */
	storageRestore() {
		if (typeof mw ==='object' && mw.storage) {
			let data = mw.storage.getObject(this.cacheKey);
			this.debug('restore', data);
			if (!data || !data.cachedData || !data.cacheTimestamp) {
				return false;
			}
			this.cachedData = data.cachedData;
			this.cacheTimestamp = data.cacheTimestamp;
			return true;
		}
		return false;
	}

	/**
	 * @private Check if there is cache.
	 */
	isCacheValid() {
		// has internal cache
		if (!this.cachedData || !this.cacheTimestamp) {
			this.debug('not in internal');
			// check perma-storage
			let restored = this.storageRestore();
			if (!restored) {
				this.debug('no cache');
				return false;
			}
		}

		let cacheAge = (Date.now() - this.cacheTimestamp) / (1000 * 60 * 60); // convert milliseconds to hours
		this.debug('cache age:', cacheAge);
		return cacheAge < this.cacheMaxAge;
	}

	/**
	 * Get full config.
	 * @returns Config object from cache or wiki.
	 */
	async getConfig() {
		if (this.isCacheValid()) {
			this.debug('from cache');
			return this.cachedData;
		} else {
			this.debug('from wiki api');
			return await this.fetchConfig();
		}
	}
}

// eslint-disable-next-line no-unused-vars
async function quickCheck() {
	// Example usage:
	var globalKey = "test-gadget-options";
	var titleMap = {
		"Wikiprojekt:Czy_wiesz/konfiguracja/opcje.json": "options",
		"Wikiprojekt:Czy_wiesz/konfiguracja/akcje.json": "events",
	};
	var configHelper = new ReadJsonCached(titleMap, globalKey);
	var data = await configHelper.getConfig();
	console.log(data);
	console.log('Done');
}
// quickCheck();

module.exports = { ReadJsonCached };