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
		this.statusSelector = '.dyk-status';
		this.statusMovedRe = /zako.{1,2}czone/;
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
	 * Check if moved to rated.
	 * @param {Element} item .
	 * @param {Boolean} isSubpage .
	 */
	checkItemDone(item, isSubpage) {
		if (isSubpage) {
			// already moved
			const movedEl = document.querySelector(this.movedSelector);
			if (movedEl) {
				return true;
			}
		}
		// already moved (by inner status)
		const itemStatus = item.querySelector(this.statusSelector);
		if (itemStatus && itemStatus.textContent.search(this.statusMovedRe) >= 0) {
			return true;
		}
		return false;
	}

	/**
	 * Init done table.
	 * [[Wikiprojekt:Czy wiesz/weryfikacja]]
	 * @param {Element} item .
	 * @param {Boolean} isSubpage .
	 */
	initItem(item, isSubpage) {
		let alreadyMoved = this.checkItemDone(item, isSubpage);
		let isAdmin = mw.config.get('wgUserGroups').includes('sysop');
		let addRollback = isSubpage && isAdmin;
		if (alreadyMoved && !addRollback) {
			return false;
		}

		// check article link
		const link = item.querySelector('a:not(.new)');
		if (!link) {
			this.core.log('No article link.');
			return false;
		}
		// move action
		let article = link.textContent;
		if (!alreadyMoved) {
			this.createButton(item, 'Zakończ', () => {
				this.handleDone(article);
			});
		} else if (addRollback) {
			this.createButton(item, 'Cofnij do nominacji', () => {
				this.handleRollback(article);
			});
		}
		return true;
	}
	/** Confirm and execute move. */
	async handleDone(article) {
		const D = this.core;

		let confirmInfo = `
			<p>Czy na pewno chcesz zakończyć dyskusję dla ${htmlspecialchars(article)}?
			<p>Jeśli są wątpliwości, to możesz poczekać na więcej ocen.
		`;

		if (await stdConfirm(confirmInfo)) {

			const dd = new DoneDialog('Przenoszenie wpisu', 'Start...');
			const currentUser = mw.config.get('wgUserName');
			const contribHref = '/wiki/Special:Contributions/'+encodeURIComponent(currentUser);
			let subpageTitle = '';
			try {
				subpageTitle = await this.move(article, dd);
			} catch (error) {
				console.error(error);
				let errorInfo = typeof error == 'string' ? htmlspecialchars(error) : '<code>'+htmlspecialchars(error)+'</code>';
				dd.update(`
					<p>❌ Przenoszenie nie udało się: ${errorInfo}</p>
					<p><a href="${contribHref}" class="czywiesz-external" target="_blank">Sprawdź swój wkład</a>, żeby obejrzeć co już zostało zrobione (czy w ogóle coś).
					<p>Możesz wejść na stronę zgłoszenia lub ją odświeżyć i spróbować ponownie.
						Jeśli zgłoszenie nadal nie jest zakończone i nie da się go zakończyć, to być <strong>może musisz zakończyć zgłoszenie ręcznie</strong>:
					<ol>
						<li>Usuń zgłoszenie <a href="${mw.util.getUrl(D.getBaseNew(), {action:'edit'})}" class="czywiesz-external" target="_blank">z listy propozycji</a>.
						<li>Dodaj zgłoszenie <a href="${mw.util.getUrl(D.getBaseDone(), {action:'edit'})}" class="czywiesz-external" target="_blank">do listy ocenionych</a>.
						<li>W treści zgłoszenia:
							<ul>
								<li>W szablonie <code>Wikiprojekt:Czy wiesz/weryfikacja</code> dodaj parametr <code>status=zakończone</code>.
								<li>W szablonie <code>licznik czasu</code> zmniejsz liczbę dni (możesz ustawić <code>dni=1</code>).
								<li>Dopisz komentarz wpisując <code>{{Załatwione}}</code>.
							</ul>
					</ol>
				`, true);
				return;
			}
			dd.update(`
				<p>✅ Przenoszenie <a href="${mw.util.getUrl(subpageTitle)}">strony zgłoszenia</a> zakończone.
				<p><small>Dla pewności możesz sprawdzić <a href="${contribHref}" class="czywiesz-external" target="_blank">swój wkład</a>.</small>
			`);
			dd.forceResize();
		}
	}

	/** Confirm and execute rollback. */
	async handleRollback(article) {
		let confirmInfo = `
			<p>Czy na pewno chcesz cofnąć ${htmlspecialchars(article)} do bieżących nominacji?
		`;

		if (await stdConfirm(confirmInfo)) {

			const dd = new DoneDialog('Cofnięcie do propozycji', 'Start...');
			const currentUser = mw.config.get('wgUserName');
			const contribHref = '/wiki/Special:Contributions/'+encodeURIComponent(currentUser);
			let subpageTitle = '';
			try {
				subpageTitle = await this.unmove(article, dd);
			} catch (error) {
				console.error(error);
				let errorInfo = typeof error == 'string' ? htmlspecialchars(error) : '<code>'+htmlspecialchars(error)+'</code>';
				dd.update(`
					<p>❌ Wycofanie nie udało się: ${errorInfo}</p>
					<p><a href="${contribHref}" class="czywiesz-external" target="_blank">Sprawdź swój wkład</a>, żeby obejrzeć co już zostało zrobione (czy w ogóle coś).
				`, true);
				return;
			}
			dd.update(`
				<p>✅ Cofnięcie udane. <a href="${mw.util.getUrl(subpageTitle, {action:'edit'})}">Zmień licznik i dodaj powód otwarcia zgłoszenia</a>.</p>
				<p><small>Możesz też sprawdzić <a href="${contribHref}" class="czywiesz-external" target="_blank">swój wkład</a></small>.</p>
			`);
			dd.forceResize();
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

		// steps for dd.update
		const stepTpl = (no) => `🚴 Krok ${no}/${totalSteps}: `;
		const totalSteps = 4;
		let stepNo = 1;
		
		// Pobranie /propozycje.
		dd.update(stepTpl(stepNo++) + 'Pobranie wikitekstu listy propozycji.');
		let nomsTitle = D.getBaseNew();
		let nomsText = await apiAsync({
			url : '/w/index.php?action=raw&title=' + encodeURIComponent(nomsTitle),
			cache : false
		});
		let subpageCode = '';
		// Usunięcie wpisu z wikitekstu.
		D.log('Usunięcie wpisu z wikitekstu listy propozycji.');
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
			if (modifiedNomsText !== nomsText) {
				console.log('after:', modifiedNomsText);
			}
			throw `Nie udało się znaleźć nominacji „${article}” w wikikodzie strony „${nomsTitle}”. 
				Nominacja mogła zostać już przeniesiona lub jest zgłoszona z nietypową nazwą podstrony.
			`.replace(/\s{2,}/g, ' ');
		}
		// Przygotwanie zapisów.
		if (!D.edittoken) {
			D.log('Pobranie tokena.');
			await this.core.getEditToken(false);
		}
		// Zapis zmian w propozycjach.
		dd.update(stepTpl(stepNo++) + 'Usunięcie wpisu z propozycji.');
		let subpageLink = subpageCode.replace(/\{\{/,'[[').replace(/\}\}/,`|${article}]]`);
		let summaryDone = D.config.summary_done.replace('TITLE', subpageLink);
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
		dd.update(stepTpl(stepNo++) + 'Oznaczenie jako załatwione.');
		let subpageTitle = await this.markDone(subpageCode, summaryDone);

		// Dopisanie na koniec /ocenione.
		dd.update(stepTpl(stepNo++) + 'Dopisanie na koniec ocenionych.');
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

		return subpageTitle;
	}

	/**
	 * Move back to nominations.
	 * 
	 * Note! It is assumed unmove is done on a subpage.
	 * 
	 * @param {String} article Article title.
	 * @param {DoneDialog} dd Dialog for progress info.
	 */
	async unmove(article, dd) {
		const D = this.core;

		// okienko informacyjne
		dd.open();

		// steps for dd.update
		const stepTpl = (no) => `🚴 Krok ${no}/${totalSteps}: `;
		const totalSteps = 4;
		let stepNo = 1;
		
		// Pobranie /ocenione.
		dd.update(stepTpl(stepNo++) + 'Pobranie wikitekstu listy ocenionych.');
		let nomsTitle = D.getBaseDone();
		let nomsText = await apiAsync({
			url : '/w/index.php?action=raw&title=' + encodeURIComponent(nomsTitle),
			cache : false
		});
		let subpageTitle = mw.config.get('wgPageName').replace(/_/g, ' ');
		// Usunięcie wpisu z wikitekstu.
		D.log('Usunięcie wpisu z wikitekstu listy propozycji.');
		let modifiedNomsText = nomsText.replace(/\{\{(.+\/propozycje\/[0-9-]+\/([^}]+))\}\}\s*/g, (a, fullTitle, title) => {
			if (title == article || fullTitle == subpageTitle) {
				return "";
			}
			return a;
		});
		if (modifiedNomsText === nomsText) {
			console.log('article:', article);
			console.log('before:', nomsText);
			D.log(`Nie udało się znaleźć nominacji „${article}” w wikikodzie strony „${nomsTitle}”. Pomijam.`);
		}
		// Przygotwanie zapisów.
		if (!D.edittoken) {
			D.log('Pobranie tokena.');
			await this.core.getEditToken(false);
		}
		// Zapis zmian w propozycjach.
		dd.update(stepTpl(stepNo++) + 'Usunięcie wpisu z listy.');
		let summaryDone = D.config.summary_rollback.replace('TITLE', article);
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
		dd.update(stepTpl(stepNo++) + 'Usunięcie oznaczenia jako załatwione.');
		await this.markUnDone(subpageTitle, summaryDone);

		// Dopisanie na koniec /propozycji.
		dd.update(stepTpl(stepNo++) + 'Dopisanie na koniec propozycji.');
		await apiAsync({
			url : '/w/api.php',
			type: 'POST',
			data : {
				action : 'edit',
				format : 'json',
				title : D.getBaseNew(),
				appendtext : `\n{{${subpageTitle}}}`,
				summary: summaryDone,
				watchlist : 'nochange',
				token : D.edittoken
			}
		});

		return subpageTitle;
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
		// oznaczenie zakończenia w tabeli
		wiki = wiki.replace(/(\{\{Wikiprojekt:Czy wiesz\/weryfikacja)([^}]+)(\}\})/g, (a, start, body, end) => {
			body = body.replace(/ *\| *status *=[^|}]+/g, '');
			return `${start}|status=zakończone${body}${end}`;
		});

		// dodanie oznaczenia dyskusji
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

		return subpageTitle;
	}

	/**
	 * Mark subpage as not-done.
	 * @param {String} subpageTitle Subpage wikicode (template style).
	 * @param {String} summaryDone Done info.
	 */
	async markUnDone(subpageTitle, summaryDone) {
		const D = this.core;

		// pobranie tekstu
		let wiki = await apiAsync({
			url : '/w/index.php?action=raw&title=' + encodeURIComponent(subpageTitle),
			cache : false
		});

		// usunięcie statusu zakończenia w tabeli
		wiki = wiki.replace(/(\{\{Wikiprojekt:Czy wiesz\/weryfikacja)([^}]+)(\}\})/g, (a, start, body, end) => {
			body = body.replace(/ *\| *status *=[^|}]+/g, '');
			return `${start}${body}${end}`;
		});

		// usunięcie oznaczenia dyskusji
		wiki = wiki.replace(/\{\{(Załatwione|Zrobione)\}\}/i, '{{s|$1}}');

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