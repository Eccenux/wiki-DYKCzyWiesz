/* global OO */

/**
 * OOui dialogs in async flavour.
 * 
 * Usage (in async function):
 * if (await stdConfirm('<p>test?')) { console.log('confirmed') }
 */
function stdConfirm(html) {
	return new Promise((resolve) => {
		OO.ui.confirm(html).done(function (confirmed) {
			resolve(confirmed)
		});
	})
}

module.exports = { stdConfirm };