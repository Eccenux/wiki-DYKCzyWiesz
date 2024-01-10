const { apiAsync } = require("./asyncAjax");

/**
 * Przenoszenie do ocenionych.
 * 
 * Aktywuje się będąc na głównej stronie `/propozycje`, ale również na podstronach.
 * 
 * Pobiera zawartość /propozycje, usuwa nazwę podstrony, dodaje do this.getBaseDone().
 */
class DoneHandling {
	/**
	 * @param {String} pageName .
	 * @param {DYKnomination} core .
	 */
	constructor(pageName, core) {
		this.pageName = pageName;
		this.core = core;
		// jeśli są 3 oceny (lub więcej)
		this.doneSelector = '.dyk-done';
	}

	/** Init when ready. */
	init() {
		const items = document.querySelectorAll(this.doneSelector);
		if (items.length) {
			mw.loader.using( 'oojs-ui-core' ).done( function () {
				for (const item of items) {
					this.initItem(item);
				}
				mw.hook('userjs.DYKnomination.DoneHandling.ready').fire(this);
			});
		} else {
			mw.hook('userjs.DYKnomination.DoneHandling.ready').fire(this);
		}
	}

	/**
	 * Init done table.
	 * [[Wikiprojekt:Czy wiesz/weryfikacja]]
	 * @param {Element} item .
	 */
	initItem(item) {
		const link = item.querySelector('a:not(.new)');
		if (!link) {
			return false;
		}
		let article = link.textContent;
		this.createButton(item, 'Zakończ', () => {
			this.handle(article);
		});
		return true;
	}
	/** Confirm and execute. */
	handle(article) {
		if (confirm(`Czy na pewno chcesz zakończyć dyskusję dla ${article}?
Jeśli są wątpliwości, to możesz poczekać na więcej ocen.`)) {
			this.move(article);
		}
	}
	/** Done, move it. */
	async move(article) {
		const D = this.core;

		// Pobranie /propozycje.
		let nomTitle = D.getBaseNew();
		let nomText = await apiAsync({
			url : '/w/index.php?action=raw&title=' + encodeURIComponent(nomTitle),
			cache : false
		});
		let subpageCode = '';
		// Usunięcie artykułu.
		nomText.replace(/\{\{.+\/propozycje\/[0-9-]+\/([^}]+)\}\}\s*/, (a, title) => {
			if (title == article) {
				subpageCode = a.trim();
				return "";
			}
			return a;
		});
		if (!subpageCode.length) {
			throw new Error(`Błąd usuwania nominacji. Już przeniesiona?`);
		}
		// Zapis zmian.
		let summary_done = D.config.summary_done.replace('TITLE', article);
		await apiAsync({
			url : '/w/api.php',
			type : 'POST',
			data: {
				action: 'edit',
				format: 'json',
				title:  nomTitle,
				text:   nomText,
				summary: summary_done,
				watchlist: 'nochange',
				token:  D.edittoken,
			}
		});

		// Dopisanie na koniec /ocenione.
		await apiAsync({
			url : '/w/api.php',
			type: 'POST',
			data : {
				action : 'edit',
				format : 'json',
				title : D.getBaseDone(),
				appendtext : '\n'+subpageCode,
				summary: summary_done,
				watchlist : 'nochange',
				token : D.edittoken
			}
		});
	}
	
	/**
	 * Create a button before item.
	 * 
	 * @param {Element} item .
	 * @param {String} label .
	 * @param {Function} handler .
	 */
	createButton(item, label, handler) {
		// https://doc.wikimedia.org/oojs-ui/master/js/#!/api/OO.ui.ButtonWidget
		const button = new OO.ui.ButtonWidget( {
			label: label,
			flags: [
				'primary',
				'progressive'
			]
		} );
		const el = button.$element[0];
		el.addEventListener('click', handler);
		item.insertAdjacentElement('beforebegin', el);

	}
}

/**
- [ ] Test na stronie /propozycje.
- [ ] Test na podstronie.
/**/

module.exports = { DoneHandling };