/**
 * Reads wiki-JSON pages.
 * 
 * @todo cache in LS
 * 
 * @example
	(async () => {
		const configHelper = new ReadJsonCached();
		const data = await configHelper.getConfig();
		console.log(data);
	})();
* 
*/
class ReadJsonCached {
	
	constructor(titles) {
		/** @private Combined data. */
		this.cachedData = null;
		/** @private JS DT. */
		this.cacheTimestamp = null;
		/** Max age in hours. */
		this.cacheMaxAge = 24;

		/** The API url. */
		this.apiUrl = "https://pl.wikipedia.org/w/api.php";
		/** Mapping: page titles to object keys. */
		this.titles = {
			"Wikiprojekt:Czy_wiesz/konfiguracja/opcje.json": "options",
			"Wikiprojekt:Czy_wiesz/konfiguracja/akcje.json": "events",
		};
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

		return combinedData;
	}

	/**
	 * @private Check if there is cache.
	 */
	isCacheValid() {
		if (!this.cachedData || !this.cacheTimestamp) {
			return false;
		}

		let cacheAge = (Date.now() - this.cacheTimestamp) / (1000 * 60 * 60); // convert milliseconds to hours
		return cacheAge < this.cacheMaxAge;
	}

	/**
	 * Get full config.
	 * @returns Config object from cache or wiki.
	 */
	async getConfig() {
		if (this.isCacheValid()) {
			return this.cachedData;
		} else {
			return await this.fetchConfig();
		}
	}
}

async function quickCheck() {
	// Example usage:
	const configHelper = new ReadJsonCached();
	const data = await configHelper.getConfig();
	console.log(data);
	console.log('Done');
}
quickCheck();

module.exports = { ReadJsonCached };