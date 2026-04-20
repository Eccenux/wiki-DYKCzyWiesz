var config = {
	interp:		'.,:;!?…-–—()[]{}⟨⟩\'"„”«»/\\', // [\s] must be added directly!; ['] & [\] escaped due to js limits, [\s] means [space]
	miesiacArr:	['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'],

	refSectionsArr:	['Bibliografia','Przypisy'],	// this should be ids of the required sections (one from this list is required)

	/** Gloablly unique cache key */
	wikiConfigKey: 'dyk-extra-options',
	/** Pages combined to `wiki` config. */
	wikiConfigTitles: {
		"Wikiprojekt:Czy_wiesz/konfiguracja/opcje.json": "options",
		"Wikiprojekt:Czy_wiesz/konfiguracja/akcje.json": "events",
	},
	/** Options configurable on wiki. */
	wiki: {
		// Akcje edycyjne
		events: [],
		options: {
			// liczba dni, dla których pojawia się silne ostrzeżenie (max rok)
			hardLimitDays: 30,
			// liczba dni, dla których pojawia się ostrzeżenie
			warnLimitDays: 10,
			// duża edycja w bajtach (minimum uznawane za OK)
			bigEdit: 2048,
		},
	},

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
	summary_r:	'Nominacja artykułu do rubryki „[[Szablon:Czy wiesz|Czy wiesz]]” za pomocą [[Wikipedia:Narzędzia/CzyWiesz|gadżetu CzyWiesz]]',
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
	/** [[File:Crystal Clear app clean.png]] (20px) [2012-11-20] */
	yes:		'<img alt="OK" src="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/20px-Crystal_Clear_app_clean.png" width="20" height="20">',
	/** [[File:Crystal Clear action button cancel.png]] (20px) [2012-11-20] */
	no:			'<img alt="Błąd" src="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/20px-Crystal_Clear_action_button_cancel.png" width="20" height="20">',
	/** [[File:PL Wiki CzyWiesz ikona.svg]] (80px) [2012-11-20] */
	okLarge:	'<img alt="OK" src="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/80px-Crystal_Clear_app_clean.png" width="80" height="80">',
	noLarge:	'<img alt="Błąd" src="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/80px-Crystal_Clear_action_button_cancel.png" width="80" height="80">',
};

module.exports = { config };
