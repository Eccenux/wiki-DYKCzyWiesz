// Uwaga! Wczytywanie w ten sposób powoduje również ominięcie parser MW, 
// który jest kilka wersji JavaScript do tyłu

// only on devices that can hover (not on touch-only, so not on smartphones)
//if (window.matchMedia && !window.matchMedia("(hover: none)").matches) {
//}
mw.loader.using("ext.gadget.lib-SimpleDragDialog").then(function() {	
	importScript('MediaWiki:Gadget-CzyWiesz.js');
});