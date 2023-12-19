(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * Wikiploy gadget example.
 * 
 * History and docs:
 * https://github.com/Eccenux/wikiploy-rollout-example
 * 
 * Deployed with love using Wikiploy: [[Wikipedia:Wikiploy]]
 */
function MyGadget() {
	/** Initialize things when DOM is ready. */
	this.init = function() {
		console.log("init done");
	}
}

module.exports = { MyGadget };

},{}],2:[function(require,module,exports){
var { MyGadget } = require("./MyGadget");

// instance
var gadget = new MyGadget();

// init elements
$(function(){
	gadget.init();
});

},{"./MyGadget":1}]},{},[2]);
