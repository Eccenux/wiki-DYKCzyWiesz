/* eslint-disable no-useless-escape */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
/* eslint-disable array-bracket-newline */
/**
 * List of wikiprojects.
 */
class Wikiprojects {
	constructor() {
		this.list =  []; // populated on askuser() from [[Wikipedia:Wikiprojekt/Spis wikiprojektów]] by DYKnomination.wikiprojects.load() (see below)
		this.list2 = [   /*****
				 * List of wikiprojects which aren't on above list and should appear on the list of wikiprojects to be notified.
				 *
				 * Objects containing following fields:
				 * label - text which will appear in the dropdown menu
				 * page - location of the wikiproject. If type is 'talk', page should point to the
				 *        wikiproject talk page
				 * type - 'section' or 'talk'
				 *        - 'section' - the template will be put on the wikiproject main page, after a line
				 *                    "<!-- Nowe zgłoszenia CzyWiesza wstawiaj poniżej tej linii. Nie zmieniaj i nie usuwaj tej linii -->" (without quotes)
				 *        - 'talk' - the template will be placed in a new section on the wikiproject talk page.
				 */
		];
	}
	load () {
		var D = DYKnomination;
			
		// https://pl.wikipedia.org/wiki/MediaWiki:Gadget-lib-wikiprojects.js
		// eslint-disable-next-line no-undef
		gadget.getWikiprojects()
			.then(function(data){

					var list = data.wikiprojects.map(
						function (wikiproject) {
							return wikiproject.name;
						}
					);

					D.wikiprojects.list = list;
			        
			        D.wikiproject_select = $('<select class="czywiesz-wikiproject"></select>').css('vertical-align', 'middle');
			        D.wikiproject_select.append('<option value="none">-- (żaden) --</option>');

			        for (var i=0;i<D.wikiprojects.list.length;i++) {
			            if (typeof(D.wikiprojects.list[i]) == 'function') continue; //on IE wikibits adds indexOf method for arrays. skip it.
			            $('<option>').attr('value',i).text(D.wikiprojects.list[i]).appendTo(D.wikiproject_select);
			        }

					$('#CzyWieszWikiprojectContainer small').remove();
					$('#CzyWieszWikiprojectContainer').append(D.wikiproject_select.clone());
				}
			)
		;
	}
}

module.exports = { Wikiprojects };
