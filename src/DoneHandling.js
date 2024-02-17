/* global OO */

const { DoneDialog } = require("./DoneDialog");
const { apiAsync } = require("./asyncAjax");
const { stdConfirm } = require("./simpleDialogs");
const { htmlspecialchars } = require("./stringOps");

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
		this.doneSelector = '.dyk-done'; // template items (main element, inside which other elements reside)
		this.movedSelector = '.template-done';
		this.statusSelector = '.dyk-status';
		this.statusMovedRe = /zako.{1,2}czone/;
	}

	/** Init when ready. */
	init() {
		const items = document.querySelectorAll(this.doneSelector);
		let prepare = false;
		let isSubpage;

		// check where are we
		if (items.length) {
			isSubpage = items.length == 1 && this.canBeSubpage(this.pageName);
			prepare = true;
			if (isSubpage && this.setupArchived()) {
				prepare = false;
			}
		}

		// fire when ready
		if (prepare) {
			mw.loader.using( 'oojs-ui-core' ).done(() => {
				for (const item of items) {
					this.initItem(item, isSubpage);
				}
				mw.hook('userjs.DYKnomination.DoneHandling.ready').fire(this);
			});
		}
	}

	/** @private Check if it seems like a subpage. */
	canBeSubpage(pageName) {
		// should we actually check for current+previous year? (don't allow edits for old stuff?)
		// make sure we don't treat single nomination on /ocenione as a subpage.
		return pageName.includes('/propozycje/2');
	}

	/** @private Check if subpage was archived and setup. */
	setupArchived() {
		if (document.querySelector('.dyk-arch')) {
			$('.dyk-end-return, .dyk-end-info').hide();
			return true;
		}
		return false;
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
	 * 
	 * @param {Element} item Main template element [[Szablon:CW/weryfikacja]].
	 * @param {Boolean} isSubpage .
	 */
	initItem(item, isSubpage) {
		let alreadyMoved = this.checkItemDone(item, isSubpage);
		let isAdmin = mw.config.get('wgUserGroups').includes('sysop');
		//let addRollback = isSubpage && isAdmin;
		let addRollback = isAdmin && alreadyMoved;
		let addClose = this.core.options.enabledClose && !alreadyMoved;
		if (!addClose && !addRollback) {
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
		if (addClose) {
			let button = this.createButton(item, 'Zakończ', () => {
				if (button.isDisabled()) {
					OO.ui.alert('Akcja już wykonana. Możesz spróbować ponownie po odświeżeniu strony.');
					return;
				}
				this.handleDone(item, article, isSubpage).then((done)=>{
					if (done) {
						button.setDisabled(true);
					}
				});
			});
		}
		if (addRollback) {
			let button = this.createButton(item, 'Cofnij do nominacji', () => {
				if (button.isDisabled()) {
					OO.ui.alert('Akcja już wykonana. Możesz spróbować ponownie po odświeżeniu strony.');
					return;
				}
				this.handleRollback(item, article, isSubpage).then((done)=>{
					if (done) {
						button.setDisabled(true);
					}
				});
			});
		}
		return true;
	}
	/**
	 * Get sub page title from a marker element in the tpl.
	 * @param {Element} item Main template element [[Szablon:CW/weryfikacja]].
	 * @param {Boolean} isSubpage .
	 */
	getSubpageTitle(item, isSubpage) {
		if (isSubpage) {
			return mw.config.get('wgPageName');
		}
		const el = item.querySelector('.dyk-self-page');
		let subpageTitle = el ? el.textContent.trim() : '';
		return subpageTitle;
	}
	/**
	 * Confirm and execute move.
	 * 
	 * @param {Element} item Main template element [[Szablon:CW/weryfikacja]].
	 * @param {String} article Article title.
	 * @param {Boolean} isSubpage .
	 */
	async handleDone(item, article, isSubpage) {
		const D = this.core;

		let confirmInfo = `
			<p>Czy na pewno chcesz zakończyć dyskusję dla ${htmlspecialchars(article)}?
			<p>Jeśli są wątpliwości, to możesz poczekać na więcej ocen.
		`;

		if (await stdConfirm(confirmInfo)) {

			const dd = new DoneDialog('Przenoszenie wpisu', 'Start...');
			const currentUser = mw.config.get('wgUserName');
			const contribHref = '/wiki/Special:Contributions/'+encodeURIComponent(currentUser);

			let subpageTitle = this.getSubpageTitle(item, isSubpage);
			if (!subpageTitle.length) {
				console.error('subpageTitle failed', {isSubpage, item});
				dd.update(`
					<p>❌ Przenoszenie zostało przerwane (nie wykonano żadnych zmian).</p>
					<p>Wygląda na to, że szablon weryfikacji dla „${article}” jest nieprawidłowo wypełniony.
					Wejdź na podstronę zgłoszenia i dodaj parametr <code>| strona = {{subst:FULLPAGENAME}}</code>.</p>
				`, true);
				return;
			}

			try {
				await this.move(article, subpageTitle, dd);
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
								<li>W szablonie <code>CW/weryfikacja</code> ustaw parametr <code>status=zakończone</code>.
								<li>W szablonie <code>licznik czasu</code> zmniejsz liczbę dni (możesz ustawić <code>dni=1</code>).
								<li>Dopisz komentarz wpisując <code>{{Załatwione}}</code>.
							</ul>
						</li>
					</ol>
				`, true);
				return;
			}
			dd.update(`
				<p>✅ Przenoszenie <a href="${mw.util.getUrl(subpageTitle)}">strony zgłoszenia</a> zakończone.</p>
				<p><small>Dla pewności możesz sprawdzić <a href="${contribHref}" class="czywiesz-external" target="_blank">swój wkład</a>.</small></p>
			`);
			dd.forceResize();
			return true;
		}
	}

	/**
	 * Confirm and execute rollback.
	 * 
	 * @param {Element} item Main template element [[Szablon:CW/weryfikacja]].
	 * @param {String} article Article title.
	 * @param {Boolean} isSubpage .
	 */
	async handleRollback(item, article, isSubpage) {
		let confirmInfo = `
			<p>Czy na pewno chcesz cofnąć ${htmlspecialchars(article)} do bieżących nominacji?
		`;

		if (await stdConfirm(confirmInfo)) {

			const dd = new DoneDialog('Cofnięcie do propozycji', 'Start...');
			const currentUser = mw.config.get('wgUserName');
			const contribHref = '/wiki/Special:Contributions/'+encodeURIComponent(currentUser);
			
			let subpageTitle = this.getSubpageTitle(item, isSubpage);
			if (!subpageTitle.length) {
				console.error('subpageTitle failed', {isSubpage, item});
				dd.update(`
					<p>❌ Przenoszenie zostało przerwane (nie wykonano żadnych zmian).</p>
					<p>Wygląda na to, że szablon weryfikacji dla „${article}” jest nieprawidłowo wypełniony.
					Wejdź na podstronę zgłoszenia i dodaj parametr <code>| strona = {{subst:FULLPAGENAME}}</code>.</p>
				`, true);
				return;
			}

			try {
				await this.unmove(article, subpageTitle, dd);
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
				<p>✅ Cofnięcie udane. <a href="${mw.util.getUrl(subpageTitle, {action:'edit'})}">Dodaj powód otwarcia zgłoszenia</a> (możesz też ustawić status na „problemy”).</p>
				<p><small>Możesz też sprawdzić <a href="${contribHref}" class="czywiesz-external" target="_blank">swój wkład</a></small>.</p>
			`);
			dd.forceResize();
			return true;
		}
	}

	/** Remove nomination from a transclusions list. */
	removeNomination(wiki, subpageTitle) {
		const cleanup = (t) => t.replace(/_/g, ' ').trim()
		let title = cleanup(subpageTitle);
		let after = wiki.replace(/\{\{(.+\/propozycje\/[0-9-]+\/([^}]+))\}\}\s*/g, (a, fullTitle) => title === cleanup(fullTitle) ? "" : a);
		return (after === wiki) ? false : after;
	}

	/**
	 * Remove step.
	 * @param {DoneDialog} dd .
	 * @param {String} listPage Listing of transclusions.
	 * @param {String} subpageTitle A transcluded page.
	 * @param {String} summaryDone Change summary.
	 */
	async stepRemove(dd, listPage, subpageTitle, summaryDone) {
		const D = this.core;

		// Pobranie listy
		D.log('Pobranie wikitekstu listy zgłoszeń.');
		let listText = await apiAsync({
			url : '/w/index.php?action=raw&title=' + encodeURIComponent(listPage),
			cache : false
		});
		// Usunięcie wpisu z wikitekstu.
		D.log('Usunięcie wpisu z wikitekstu listy zgłoszeń.');
		let modifiedListText = this.removeNomination(listText, subpageTitle);
		if (!modifiedListText) {
			dd.warn(`Nie udało się znaleźć nominacji „${subpageTitle}” na stronie „${listPage}”. Pominięto usuwanie wpisu.`);
		} else {
			// Zapis zmian w propozycjach.
			D.log('Usunięcie wpisu ze zgłoszeń.');
			await apiAsync({
				url : '/w/api.php',
				type : 'POST',
				data: {
					action: 'edit',
					format: 'json',
					title:  listPage,
					text:   modifiedListText,
					summary: summaryDone,
					watchlist: 'nochange',
					token:  D.edittoken,
				}
			});
		}
	}

	/**
	 * Append step.
	 * @param {DoneDialog} dd .
	 * @param {String} listPage Listing of transclusions.
	 * @param {String} subpageTitle A transcluded page.
	 * @param {String} summaryDone Change summary.
	 */
	async stepAppend(dd, listPage, subpageTitle, summaryDone) {
		const D = this.core;

		// spr.
		let listText = await apiAsync({
			url : '/w/index.php?action=raw&title=' + encodeURIComponent(listPage),
			cache : false
		});
		let modified = this.removeNomination(listText, subpageTitle);
		if (modified) {
			dd.warn(`Nominacja „${subpageTitle}” jest już na stronie „${listPage}”. Pominięto dodawanie wpisu.`);
			return false;
		}
		await apiAsync({
			url : '/w/api.php',
			type: 'POST',
			data : {
				action : 'edit',
				format : 'json',
				title : listPage,
				appendtext : `\n{{${subpageTitle}}}`,
				summary: summaryDone,
				watchlist : 'nochange',
				token : D.edittoken
			}
		});
		return true;
	}

	/**
	 * Done, move it.
	 * @param {String} article Article title.
	 * @param {String} subpageTitle Nomination page.
	 * @param {DoneDialog} dd Dialog for progress info.
	 */
	async move(article, subpageTitle, dd) {
		const D = this.core;

		// okienko informacyjne
		dd.open();

		// steps for dd.update
		const stepTpl = (no) => `🚴 Krok ${no}/${totalSteps}: `;
		const totalSteps = 3;
		let stepNo = 1;

		// Przygotwanie zapisów od razu
		if (!D.edittoken) {
			D.log('Pobranie tokena.');
			await this.core.getEditToken(false);
		}
		let subpageLink = `[[${subpageTitle}|${article}]]`;
		let summaryDone = D.config.summary_done.replace('TITLE', subpageLink);
		
		// Usunięcie wpisu
		dd.update(stepTpl(stepNo++) + 'Usunięcie z listy propozycji.');
		await this.stepRemove(dd, D.getBaseNew(), subpageTitle, summaryDone);

		// Oznaczenie jako załatwione.
		dd.update(stepTpl(stepNo++) + 'Oznaczenie jako załatwione.');
		await this.markDone(subpageTitle, summaryDone);

		// Dopisanie na koniec /ocenione.
		dd.update(stepTpl(stepNo++) + 'Dopisanie na koniec ocenionych.');
		await this.stepAppend(dd, D.getBaseDone(), subpageTitle, summaryDone);

		return subpageTitle;
	}

	/**
	 * Move back to nominations.
	 * @param {String} article Article title.
	 * @param {String} subpageTitle Nomination page.
	 * @param {DoneDialog} dd Dialog for progress info.
	 */
	async unmove(article, subpageTitle, dd) {
		const D = this.core;

		// okienko informacyjne
		dd.open();

		// steps for dd.update
		const stepTpl = (no) => `🚴 Krok ${no}/${totalSteps}: `;
		const totalSteps = 3;
		let stepNo = 1;

		// Przygotwanie zapisów.
		if (!D.edittoken) {
			D.log('Pobranie tokena.');
			await this.core.getEditToken(false);
		}
		let subpageLink = `[[${subpageTitle}|${article}]]`;
		let summaryDone = D.config.summary_rollback.replace('TITLE', subpageLink);
		
		// Usunięcie wpisu
		dd.update(stepTpl(stepNo++) + 'Usunięcie z listy propozycji.');
		await this.stepRemove(dd, D.getBaseDone(), subpageTitle, summaryDone);

		// Oznaczenie jako załatwione.
		dd.update(stepTpl(stepNo++) + 'Usunięcie oznaczenia jako załatwione.');
		await this.markUnDone(subpageTitle, summaryDone);

		// Dopisanie na koniec /propozycji.
		dd.update(stepTpl(stepNo++) + 'Dopisanie na koniec propozycji.');
		await this.stepAppend(dd, D.getBaseNew(), subpageTitle, summaryDone);

		return subpageTitle;
	}

	/**
	 * Change status in main tpl.
	 * @private
	 * @param {String} wiki Wiki code with the template(s).
	 * @param {String} newStatus .
	 */
	statusChange(wiki, newStatus) {
		// oznaczenie zakończenia w tabeli
		wiki = wiki.replace(/(\{\{CW\/weryfikacja)([^}]+)(\}\})/g, (a, start, body, end) => {
			body = body.replace(/ *\| *status *=[^|}]+/g, '');
			let posPipe = body.indexOf('|');
			let posEq = body.indexOf('=', posPipe);
			let padLen = posEq - posPipe;
			let status = '| status'.padEnd(padLen, ' ') + '= ' + newStatus;
			let posCheck = body.indexOf('| 1. sprawdzenie');
			if (posCheck > 0) {
				body = body.slice(0, posCheck) + status + '\n' + body.slice(posCheck);
			} else {
				body = body.replace(/\n+$/, '') + '\n' + status + '\n';
			}
			return `${start}${body}${end}`;
		});
		return wiki;
	}

	/**
	 * Mark subpage as done.
	 * @param {String} subpageTitle Subpage name / title.
	 * @param {String} summaryDone Done info.
	 */
	async markDone(subpageTitle, summaryDone) {
		const D = this.core;

		// pobranie tekstu
		let wiki = await apiAsync({
			url : '/w/index.php?action=raw&title=' + encodeURIComponent(subpageTitle),
			cache : false
		});

		// zatrzymanie czasu
		wiki = wiki.replace(/(\{\{licznik czasu)([^/][^}]+)(\}\})/, (a, start, body, end) => {
			body = body.replace(/\|\s*koniec\s*=[^|}]*/, '');
			return `${start}/koniec${body}|koniec={{subst:#timel:Y-m-d H:i:s}}${end}`;
		});
		// oznaczenie zakończenia w tabeli
		wiki = this.statusChange(wiki, 'zakończone');

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
		wiki = this.statusChange(wiki, '');

		// wznowienie czasu
		wiki = wiki.replace(/(\{\{licznik czasu)\/koniec([^}]+)(\}\})/, (a, start, body, end) => {
			body = body.replace(/\|\s*koniec\s*=[^|}]*/, '');
			return `${start}${body}${end}`;
		});
		// usunięcie oznaczenia dyskusji
		wiki = wiki.replace(/\{\{(Załatwione|Zrobione)\}\}/ig, '{{s|$1}}');

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
		return button;
	}
}

module.exports = { DoneHandling };