var { DYKnomination, createFullDyk } = require("./CzyWiesz");

// init in main namespace
if (mw.config.get('wgNamespaceNumber') === 0) {
	createFullDyk(DYKnomination);
	mw.hook('userjs.DYKnomination.loaded').fire(DYKnomination);

	mw.loader.using(["mediawiki.util"]).then(function() {
		$(document).ready(function() {
			mw.util.addPortletLink(
				'p-tb',
				'javascript:DYKnomination.askuser()',
				(window.DYKnomination_is_beta===true?'BETA: ':'') + DYKnomination.config.portlet_title,
				't-DYKnomination'
			);
			mw.hook('userjs.DYKnomination.ready').fire(DYKnomination);
		});
	});
}
//insert current version number while on Wikipedia:Narzędzia/CzyWiesz
else if (mw.config.get('wgPageName')=='Wikipedia:Narzędzia/CzyWiesz') {
	$('.DYKnomination-version').html(DYKnomination.about.version);
}

// expose to others
window.DYKnomination = DYKnomination;
