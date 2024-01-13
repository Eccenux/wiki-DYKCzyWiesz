/**
 * Revision list reader and parser.
 */
class RevisionList {
	constructor() {
		this.api = false;
		this.readLimit = 100; // number of records to read
	}

	/** @private */
	getApi() {
		if (!this.api) {
			this.api = new mw.Api();
		}
		return this.api;
	}
	/** @private */
	firstPage(data) {
		let id;
		for (id in data.query.pages) {
			break;
		}
		return data.query.pages[id];
	}

	/**
	 * Read revisions data.
	 * @param {String} title Article.
	 * @param {Number} days Number of days.
	 */
	async readRevs(title, days) {
		const dt = new Date();
		dt.setDate(dt.getDate() - days);
		const from = dt.toISOString();
		console.log({from});
	
		let data;
		// get ids to figure out correct limit
		data = await this.getApi().get({
			action: 'query',
			prop: "revisions",
			format: "json",
			rvprop: ['ids'],
			rvend: from,
			rvlimit: 'max',
			titles: title,
		});
		const ids = this.firstPage(data).revisions;
	
		// get data of +1 edits (need one more edit to get size)
		data = await this.getApi().get({
			action: 'query',
			prop: "revisions",
			format: "json",
			rvprop: ['timestamp', 'user', 'size'],
			rvlimit: !ids ? 1 : ids.length + 1,
			titles: title,
		});
		const revisions = this.firstPage(data).revisions;
		if (ids && ids.length) {
			const records = this.prepareData(revisions, dt);
			console.log({data, revisions, records});
			return {revisions, records};
		} else {
			// no recent edits, old article
			return {revisions, records:[]};
		}
	}

	/**
	 * Prepare revision records.
	 * 
	 * @param {Array} revisions prepare data.
	 * @param {Date|Number} limit Limit in days from now or sepcific date.
	 * @returns Daily edit stats by each user.
	 */
	prepareData(revisions, limit) {
		// Sort revisions by date (latest first)
		revisions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
	
		// Keep all revisions or within the last X days
		let dtLimit = 0;
		if (limit) {
			if (limit instanceof Date) {
				dtLimit = limit;
			} else {
				dtLimit = new Date();
				dtLimit.setDate(dtLimit.getDate() - limit);
			}
		}
	
		const records = {};
	
		let limitReached = false;
		let futureRev = false; // revision in future
		let futureRecord = false; // record in future
		revisions.some(rev => {
			const dt = new Date(rev.timestamp);
	
			// now we can calculate size for the record in future
			if (futureRev) {
				const diffSize = futureRev.size - rev.size;
				if (diffSize > 0) {
					futureRecord.added += diffSize;
				} else {
					futureRecord.removed += Math.abs(diffSize);
				}
				futureRecord.edits++;
			}
	
			// date limit overflow, break
			if (futureRev && dt < dtLimit) {
				limitReached = true;
				return true; // break
			}
	
			// prepare record
			const day = rev.timestamp.split('T')[0];
			const key = `${day}:${rev.user}`;
			if (!records[key]) {
				records[key] = { day, user: rev.user, added: 0, removed: 0, edits: 0 };
			}
			const record = records[key];
			
			// save for next loop
			futureRev = rev;
			futureRecord = record;
		});
		// add for last record
		if (!limitReached) {
			futureRecord.added += futureRev.size;
			futureRecord.edits++;
			futureRecord.isNew = true;
		}
	
		// Convert records object to an array
		const recordsArray = Object.values(records);
	
		return recordsArray;
	}

	/** Find a winner record. */
	findWinner(records, bigEdit) {
		// check for the latest, big edit
		for (const record of records) {
			if (record.added >= bigEdit) {
				return {record, size:record.added};
			}
		}
		// check acumulated edits
		let biggestRecord;
		let biggestSize = 0;
		let size = 0;
		for (const record of records) {
			if (record.added > 0) {
				if (record.added > biggestSize) {
					biggestSize = record.added;
					biggestRecord = record;
				}
				size += record.added;
				if (size >= bigEdit) {
					return {record:biggestRecord, size};
				}
			}
		}
		return {record:false, size};
	}
}

module.exports = { RevisionList };