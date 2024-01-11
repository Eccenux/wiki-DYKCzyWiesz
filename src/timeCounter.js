/**
 * ISO-like date interpreter.
 * 
 * Mostly for dates created like this:
 * {{licznik czasu|start={{subst:#timel:Y-m-d H:i:s}}|dni=...}}
 * 
 * @param {String} startDateString Y-m-d H:i:s or Y-m-dTH:i:s... or similar.
 * @param {Date} now (optional) Fake "now".
 * @returns Days since now or since dt.
 */
function timeCounter(startDateString, now) {
	if (!(now instanceof Date)) {
		now = new Date();
	}
	const d = startDateString.split(/[^0-9]+/).map(d=>parseInt(d,10));
	const startDate = new Date(d[0], d[1]-1, d[2], d[3], d[4], d[5]); // d[1] is month
	const diffInMs = now - startDate;
	const daysPassed = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	return daysPassed;
}

/**
 * End the counter tpl.
 * 
 * End the count now (today).
 * {{licznik czasu|start=2024-01-08 00:58:00|dni=30}}
 * 
 * @param {String} tpl The template call.
 * @param {Date} now (optional) Fake "now".
 */
function endCounter(tpl, now) {
	let body = tpl.replace('{{', '').replace('}}', '').trim();
	// remove days
	body = body.replace(/\| *dni *= *[0-9]+/, '');
	const nvalues = body.split(/ *\| */);
	let days = -1;
	// 0 is tpl name
	for (let i = 1; i < nvalues.length; i++) {
		const param = nvalues[i];
		const [name,val] = param.split(/ *= */);
		if (name == 'start') {
			days = timeCounter(val, now);
			break;
		}
	}
	if (days < 0) {
		return tpl;
	}
	return `{{${body}|dni=${days}}}`;
}

module.exports = { timeCounter, endCounter };
