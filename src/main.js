var { MyGadget } = require("./MyGadget");

// instance
var gadget = new MyGadget();

// hook when object is ready
mw.hook('userjs.yourGadgetNameExample.loaded').fire(gadget);

$(function(){
	// load Mediwiki core dependency
	// (in this case util is for `mw.util.addPortletLink`)
	mw.loader.using(["mediawiki.util"]).then( function() {
		gadget.init();

		// hook when initial elements are ready 
		mw.hook('userjs.yourGadgetNameExample.ready').fire(gadget);
	});
});
