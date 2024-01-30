var config = {
	interp:		'.,:;!?…-–—()[]{}⟨⟩\'"„”«»/\\', // [\s] must be added directly!; ['] & [\] escaped due to js limits, [\s] means [space]
	miesiacArr:	['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'],

	/** Debug base page. */
	// debugBase: 'Wikipedysta:Kaligula/js/CzyWiesz.js',
	debugBase: 'Wikipedysta:Nux/CzyWieszTest',
	/** E-mail debug info to this user. */
	supportUser: 'Nux',
	/** E-mail topic (debug info). */
	supportEmailTopic: 'Błąd w Gadżecie Czy wiesz',

	/** name of the link in menu */
	portlet_title: 'Zgłoś do „Czy wiesz…”',
	/** line that should be at the beginning of „Czy wiesz” section in each Wikiproject – helps gadget finding the right spot */
	dykSectionIndicator: '<!-- Nowe zgłoszenia CzyWiesza wstawiaj poniżej tej linii. Nie zmieniaj i nie usuwaj tej linii -->',
	/** summary template for nomination */
	summary:	'TITLE nowe zgłoszenie za pomocą [[Wikipedia:Narzędzia/CzyWiesz|gadżetu CzyWiesz]]',
	/** summary template for done */
	summary_done:	'TITLE ozn. jako ocenione za pomocą [[Wikipedia:Narzędzia/CzyWiesz|gadżetu CzyWiesz]]',
	summary_rollback:	'TITLE wraca do propozycji za pomocą [[Wikipedia:Narzędzia/CzyWiesz|gadżetu CzyWiesz]]',
	/** summary for template in the article */
	summary_r:	'Nominacja do umieszczenia na [[Wikipedia:Strona główna|stronie głównej]] w rubryce „[[Szablon:Czy wiesz|Czy wiesz]]” za pomocą [[Wikipedia:Narzędzia/CzyWiesz|gadżetu CzyWiesz]]',
	/** summary for template on author's talk page */
	summary_a:	'/* Czy wiesz – [[TITLE]] */ nowe zgłoszenie za pomocą [[Wikipedia:Narzędzia/CzyWiesz|gadżetu CzyWiesz]]',
	/** new section title for template on author's talk page */
	sectionTitle_a: 'Czy wiesz – [[TITLE]]',
	/** summary for template in wikiprojects (append to section) */
	summary_w:	'/* Czy wiesz */ [[TITLE]] – nowe zgłoszenie za pomocą [[Wikipedia:Narzędzia/CzyWiesz|gadżetu CzyWiesz]]',
	/** summary for template in wikiprojects (new section) */
	summary_w_newsection:	'/* Czy wiesz – [[TITLE]] */ nowe zgłoszenie za pomocą [[Wikipedia:Narzędzia/CzyWiesz|gadżetu CzyWiesz]]',
	/** new section title for template in wikiprojects */
	sectionTitle_w: 'Czy wiesz – [[TITLE]]',
	/** style for this gadget */
	styletag:	$('<style id="CzyWieszStyleTag">'
					+ /* css */`
						.wikiEditor-toolbar-dialog .czy-wiesz-gallery-chosen { border: solid 2px red; }
						#CzyWieszWikiprojectAdd {cursor: pointer; }
						#CzyWieszGadget .czywiesz-tip {
							cursor: help;
							color: #d05700;
						}
						a.czywiesz-external { 
							color: #0645AD;
							text-decoration: underline;
							cursor: pointer;
							padding-right: 13px; 
							background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVklEQVR4Xn3PgQkAMQhDUXfqTu7kTtkpd5RA8AInfArtQ2iRXFWT2QedAfttj2FsPIOE1eCOlEuoWWjgzYaB/IkeGOrxXhqB+uA9Bfcm0lAZuh+YIeAD+cAqSz4kCMUAAAAASUVORK5CYII=)
								center right no-repeat; 
						}
						.dyk-button-off {
							pointer-events: none;
							opacity: .5;
						}
						#CzyWieszErrorDialog.wait-im-sending-email, #CzyWieszSuccess.wait-im-sending-email {
							cursor: wait; 
						}
					`
				+ '</style>'),
	/** [[File:Crystal Clear app clean.png]] (20px) [2012-11-20] */
	yes:		'<img alt="Crystal Clear app clean.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/20px-Crystal_Clear_app_clean.png" width="20" height="20">',
	/** [[File:Crystal Clear action button cancel.png]] (20px) [2012-11-20] */
	no:			'<img alt="Crystal Clear action button cancel.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/20px-Crystal_Clear_action_button_cancel.png" width="20" height="20">',
	/** [[File:PL Wiki CzyWiesz ikona.svg]] (80px) [2012-11-20] */
	CWicon:		'<img alt="PL Wiki CzyWiesz ikona.svg" src="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/80px-PL_Wiki_CzyWiesz_ikona.svg.png" width="80" height="80" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/120px-PL_Wiki_CzyWiesz_ikona.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/160px-PL_Wiki_CzyWiesz_ikona.svg.png 2x">',
	/** = {{załatwione}} [2012-11-20] */
	tmpldone:	'<span class="template-done"><img alt="Crystal Clear app clean.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/20px-Crystal_Clear_app_clean.png" width="20" height="20" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/30px-Crystal_Clear_app_clean.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/40px-Crystal_Clear_app_clean.png 2x"><span style="display:none">T</span> <b>Załatwione</b></span>',
	/** = {{niezałatwione}} [2012-11-20] */
	tmplndone:	'<span class="template-not-done"><img alt="Crystal Clear action button cancel.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/20px-Crystal_Clear_action_button_cancel.png" width="20" height="20" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/30px-Crystal_Clear_action_button_cancel.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/40px-Crystal_Clear_action_button_cancel.png 2x"><span style="display:none">N</span> <b>Niezałatwione</b></span>'
};

module.exports = { config };
