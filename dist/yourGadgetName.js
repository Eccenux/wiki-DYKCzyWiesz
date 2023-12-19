(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * Wikiploy gadget example.
 * 
 * History and docs:
 * https://github.com/Eccenux/wikiploy-rollout-example
 * 
 * Deployed using: [[Wikipedia:Wikiploy]]
 */
class MyGadget {
	constructor() {
		this.options = {
			createTool: true,
		};
	}

	/** Initialize things when DOM is ready. */
	init() {
		// Example link in the tools sidebar
		if (this.options.createTool) {
			var portletId = mw.config.get('skin') === 'timeless' ? 'p-pagemisc' : 'p-tb';
			var linkLabel = '🧩 My gadget dialog';
			var itemId = 'some-unique-gadget-tool';
			var item = mw.util.addPortletLink(portletId, '#', linkLabel, itemId);
			$(item).on('click', (evt) => {
				evt.preventDefault();
				this.openDialog();
			});
		}
	}

	/** Open some dialog. */
	openDialog() {
		// Open a dialog window here
		alert("We are open for community!");
	}
}

module.exports = { MyGadget };

},{}],2:[function(require,module,exports){
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

},{"./MyGadget":1}]},{},[2]);
