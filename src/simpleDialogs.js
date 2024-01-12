/* global OO */

/**
 * OOui dialogs in async flavour.
 * 
 * Usage (in async function):
 * if (await stdConfirm('<p>test?')) { console.log('confirmed') }
 */
function stdConfirm(html, isText) {
	const message = isText ? html : $('<div>'+html+'</div>');
	return new Promise((resolve) => {
		OO.ui.confirm(message).done(function (confirmed) {
			resolve(confirmed)
		});
	})
}

module.exports = { stdConfirm };