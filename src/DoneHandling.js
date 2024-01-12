/* global OO */

const { DoneDialog } = require("./DoneDialog");
const { apiAsync } = require("./asyncAjax");
const { stdConfirm } = require("./simpleDialogs");
const { htmlspecialchars } = require("./stringOps");
const { endCounter } = require("./timeCounter");

/**
 * Przenoszenie do ocenionych.
 * 
 * Aktywuje się będąc na głównej stronie `/propozycje`, ale również na podstronach.
 * 
 * Pobiera zawartość /propozycje, usuwa nazwę podstrony, dodaje do /ocenione.
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
		this.movedSelector = '.template-done';
	}

	/** Init when ready. */
	init() {
		const items = document.querySelectorAll(this.doneSelector);
		if (items.length) {
			const isSubpage = items.length == 1;
			mw.loader.using( 'oojs-ui-core' ).done(() => {
				for (const item of items) {
					this.initItem(item, isSubpage);
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
	 * @param {Boolean} isSubpage .
	 */
	initItem(item, isSubpage) {
		if (isSubpage) {
			// already moved
			const movedEl = document.querySelector(this.movedSelector);
			if (movedEl) {
				return false;
			}
		}
		// no article link
		const link = item.querySelector('a:not(.new)');
		if (!link) {
			this.core.log('No article link.');
			return false;
		}
		let article = link.textContent;
		this.createButton(item, 'Zakończ', () => {
			this.handle(article);
		});
		return true;
	}
	/** Confirm and execute. */
	async handle(article) {
		let confirmInfo = `
			<p>Czy na pewno chcesz zakończyć dyskusję dla ${htmlspecialchars(article)}?
			<p>Jeśli są wątpliwości, to możesz poczekać na więcej ocen.
		`;

		if (await stdConfirm(confirmInfo)) {

			const dd = new DoneDialog('Przenoszenie wpisu', 'Start...');
			const currentUser = mw.config.get('wgUserName');
			const contribHref = '/wiki/Special:Contributions/'+encodeURIComponent(currentUser);
			try {
				await this.move(article, dd);
			} catch (error) {
				console.error(error);
				dd.update(`
					<p>❌ Przenoszenie nie udało się: ${htmlspecialchars(error)}.</p>
					<p><a href="${contribHref}" class="czywiesz-external" target="_blank">Sprawdź swój wkład</a>.
						W konsoli przeglądarki mogą znajdować się dodatkowe infomacji, które możesz przekazać twórcy lub w <em>WP:BAR:TE</em>.
				`, true);
				return;
			}
			dd.update(`Przenoszenie zakończone. Dla pewności możesz sprawdzić 
				<a href="${contribHref}" class="czywiesz-external" target="_blank">swój wkład</a>.`)
		}
	}
	/**
	 * Done, move it.
	 * @param {String} article Article title.
	 * @param {DoneDialog} dd Dialog for progress info.
	 */
	async move(article, dd) {
		const D = this.core;

		// okienko informacyjne
		dd.open();
		
		// Pobranie /propozycje.
		dd.update('Pobranie wikitekstu propozycji.');
		let nomsTitle = D.getBaseNew();
		let nomsText = await apiAsync({
			url : '/w/index.php?action=raw&title=' + encodeURIComponent(nomsTitle),
			cache : false
		});
		let subpageCode = '';
		// Usunięcie wpisu z wikitekstu.
		D.log('Usunięcie wpisu z wikitekstu.');
		let modifiedNomsText = nomsText.replace(/\{\{.+\/propozycje\/[0-9-]+\/([^}]+)\}\}\s*/g, (a, title) => {
			// console.log(a, title)
			if (title == article) {
				subpageCode = a.trim();
				return "";
			}
			return a;
		});
		if (!subpageCode.length || modifiedNomsText === nomsText) {
			console.log('article:', article);
			console.log('before:', nomsText);
			console.log('after:', modifiedNomsText);
			throw new Error(`Błąd usuwania nominacji. Już przeniesiona?`);
		}
		// Przygotwanie zapisów.
		if (!D.edittoken) {
			D.log('Pobranie tokena.');
			await this.core.getEditToken(false);
		}
		// Zapis zmian w propozycjach.
		dd.update('Usunięcie wpisu z propozycji.');
		let summaryDone = D.config.summary_done.replace('TITLE', article);
		await apiAsync({
			url : '/w/api.php',
			type : 'POST',
			data: {
				action: 'edit',
				format: 'json',
				title:  nomsTitle,
				text:   modifiedNomsText,
				summary: summaryDone,
				watchlist: 'nochange',
				token:  D.edittoken,
			}
		});

		// Oznaczenie jako załatwione.
		dd.update('Oznaczenie jako załatwione.');
		await this.markDone(subpageCode, summaryDone);

		// Dopisanie na koniec /ocenione.
		dd.update('Dopisanie na koniec ocenionych.');
		await apiAsync({
			url : '/w/api.php',
			type: 'POST',
			data : {
				action : 'edit',
				format : 'json',
				title : D.getBaseDone(),
				appendtext : '\n'+subpageCode,
				summary: summaryDone,
				watchlist : 'nochange',
				token : D.edittoken
			}
		});
	}

	/**
	 * Mark subpage as done.
	 * @param {String} subpageCode Subpage wikicode (template style).
	 * @param {String} summaryDone Done info.
	 */
	async markDone(subpageCode, summaryDone) {
		const D = this.core;

		const subpageTitle = subpageCode.replace('{{', '').replace('}}', '').trim();

		// pobranie tekstu
		let wiki = await apiAsync({
			url : '/w/index.php?action=raw&title=' + encodeURIComponent(subpageTitle),
			cache : false
		});

		// zatrzymanie czasu
		wiki = wiki.replace(/\{\{licznik czasu[^}]+\}\}/, (tpl) => {
			return endCounter(tpl);
		});

		// dodanie oznaczenia
		wiki += '\n\n{{Załatwione}} artykuł oceniony ~~~~.';

		await apiAsync({
			url : '/w/api.php',
			type: 'POST',
			data : {
				action : 'edit',
				format : 'json',
				title : subpageTitle,
				text : wiki,
				summary: summaryDone,
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
		// note that adding after is better because it jumps less
		item.insertAdjacentElement('afterend', el);

	}
}

module.exports = { DoneHandling };