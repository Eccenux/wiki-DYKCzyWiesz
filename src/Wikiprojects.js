/* eslint-disable no-useless-escape */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
/* eslint-disable array-bracket-newline */
/**
 * List of wikiprojects.
 */
class Wikiprojects {
	constructor() {
		this.list =  []; // populated by load() from [[Wikipedia:Wikiprojekt/Spis wikiprojektów]]
		/** Dropdown menu (available after load). */
		this.$select = null;
	}
	load () {
		// https://pl.wikipedia.org/wiki/MediaWiki:Gadget-lib-wikiprojects.js
		// eslint-disable-next-line no-undef
		gadget.getWikiprojects()
			.then((data) => {
					const list = data.wikiprojects.map(w => ({"name":w.name,"page":w.page}));

					this.list = list;
			        
			        this.$select = $('<select class="czywiesz-wikiproject"></select>').css('vertical-align', 'middle');
			        this.$select.append('<option value="none">-- (żaden) --</option>');

			        for (var i=0; i<this.list.length; i++) {
			            if (typeof(this.list[i]) == 'function') continue; //on IE wikibits adds indexOf method for arrays. skip it.
			            $('<option>').attr('value',i).text(this.list[i].name).appendTo(this.$select);
			        }

					$('#CzyWieszWikiprojectContainer small').remove();
					$('#CzyWieszWikiprojectContainer').append(this.$select.clone());
				}
			)
		;
	}
}

module.exports = { Wikiprojects };
