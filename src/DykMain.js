/* eslint-disable no-useless-escape */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
/* eslint-disable array-bracket-newline */
const { DykProcess } = require("./DykProcess");
const { DykForm } = require("./DykForm");
const { Wikiprojects } = require("./Wikiprojects");

/**
 * Nominations main class (~controller).
 * 
 * Could be built and loaded separately... maybe.
 */
class DykMain {
	/**
	 * Setup deps.
	 * @param {DYKnomination} core 
	 */
	constructor(core) {
		this.core = core;
		this.dykProcess = new DykProcess(core);
		this.dykForm = new DykForm(core);
		this.wikiprojects = new Wikiprojects();
		// ~mixin
		this.core.askuser = () => this.askuser();
		this.core.debug = () => this.debug();
		this.core.wikiprojects = this.wikiprojects;
	}

	// for main.js
	askuser () {
		this.dykForm.askuser();
	}

	// backward-compatibility debug mode
	debug () {
		this.core.debugmode = true;
		this.dykForm.askuser();
	}

	/** Check form and continue with nomination. */
	checkForm () {
		const {values, invalid} = this.dykForm.prepareValues();

		if (invalid.is) {
			$(invalid.fields).each(function(){
				$('#CzyWiesz'+this).css({border: 'solid 2px red'}).change(function(){
					$(this).css({border: 'none'});
				});
			});
			alert(invalid.alert.join('\n'));
			$('#CzyWiesz'+invalid.fields[0]).focus();
		}
		else {
			// here is the call of editing/ajax function
			this.dykProcess.prepare(values);
		}
	}
}

module.exports = { DykMain };
