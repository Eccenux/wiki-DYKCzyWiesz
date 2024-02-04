const { DYKnomination, createDyk, createFullDyk } = require("./CzyWiesz");
const { DoneHandling } = require("./DoneHandling");

const namespaceNumber = mw.config.get('wgNamespaceNumber');
const pageName = mw.config.get('wgPageName');

// init in main namespace
if (namespaceNumber === 0) {
	createFullDyk(DYKnomination);
	// this can be used to e.g. setup debugmode
	mw.hook('userjs.DYKnomination.loaded').fire(DYKnomination);

	mw.loader.using(["mediawiki.util"]).then(function() {
		$(document).ready(function() {
			const link = mw.util.addPortletLink(
				'p-tb',
				'#',
				(window.DYKnomination_is_beta===true?'BETA: ':'') + DYKnomination.config.portlet_title,
				't-DYKnomination'
			);
			$(link).click((e) => {
				e.preventDefault();
				DYKnomination.askuser();
			}).attr('title', `Nominacje do WP:CW v${DYKnomination.about.version}`);
			mw.hook('userjs.DYKnomination.ready').fire(DYKnomination);
		});
	});
}
//insert current version number while on Wikipedia:Narzędzia/CzyWiesz
else if (pageName == 'Wikipedia:Narzędzia/CzyWiesz') {
	$('.DYKnomination-version').html(DYKnomination.about.version);
}

// zarządzanie propozycjami
if (pageName.indexOf('/propozycje') > 0 || pageName.indexOf('/ocenione') > 0) {
	createDyk(DYKnomination);
	// this can be used to e.g. setup debugmode
	mw.hook('userjs.DYKnomination.loaded').fire(DYKnomination);

	const doneHandling = new DoneHandling(pageName, DYKnomination);
	$(document).ready(function() {
		doneHandling.init();
	});
}

// expose to others
window.DYKnomination = DYKnomination;
