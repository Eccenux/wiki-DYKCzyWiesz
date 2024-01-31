(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* eslint-disable no-useless-escape */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
/* eslint-disable array-bracket-newline */

/**
 * Nominacje do Czy-Wiesza aka DYKnomination (Did You Know).
 * 
 * Instrukcja:
 * [[Wikipedia:Narzędzia/CzyWiesz]]
 * 
 * Historia zmian:
 * https://pl.wikipedia.org/w/index.php?title=MediaWiki:Gadget-CzyWiesz.js&action=history
 * 
 * Repozytorium:
 * https://github.com/Eccenux/wiki-DYKCzyWiesz
 * 
 * Wdrożone za pomocą: [[Wikipedia:Wikiploy]]
 */
var DYKnomination = {};

const { versionInfo } = require("./build/version");

/** About (meta). */
DYKnomination.about = {
	version    : `${versionInfo.version}-${versionInfo.buildDay}` + (window.DYKnomination_is_beta===true?'beta':''),
	beta	   : (window.DYKnomination_is_beta===true?true:false),
	author     : 'Kaligula',
	authorlink : '[[w:pl:user:Kaligula]]',
	homepage   : '[[w:pl:Wikipedia:Narzędzia/CzyWiesz]]',
	credits    : 'Matma Rex (for HUGE help), Tomasz Wachowski (for testing)'
}

/** Init the DYK object. */
function createDyk(DYKnomination) {
	const { ErrorInfo } = require("./ErrorInfo");
	const { apiAsync } = require("./asyncAjax");
	const { config } = require("./config");
	
	DYKnomination.config = config;

	/** Base page for nominations. */
	DYKnomination.getBaseNew = function () {
		return this.debugmode ? config.debugBase + '/propozycje' : 'Wikiprojekt:Czy wiesz/propozycje';
	}
	/** Page for rated. */
	DYKnomination.getBaseDone = function () {
		return this.debugmode ? config.debugBase + '/ocenione' : 'Wikiprojekt:Czy wiesz/ocenione';
	}
	/** Nomination subpage. */
	DYKnomination.getNominationPage = function (currentDate, title) {
		const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
		const base = this.getBaseNew();
		return base + '/' + formattedDate + '/' + title;
	}

	DYKnomination.logs = [];
	DYKnomination.log = function (){
		// could also ...spread, but that would require explicit ES6
		var args = Array.from(arguments);

		// gather debug info in case of an error
		var dt = new Date().toISOString();
		DYKnomination.logs.push({dt:dt, log:args});

		// show debug info only in debug mode
		if( this.debugmode && typeof(console) !== 'undefined' ) {
			args.unshift('[DYK]');	// tag
			console.log.apply(console, args);
		}
	};

	DYKnomination.debugmode = false;

	DYKnomination.getEditToken = async function (force) {
		var D = DYKnomination;

		var tmpToken = mw.user.tokens.get('csrfToken');
		if (!force && typeof tmpToken === 'string' && tmpToken.length === 34) {
			D.edittoken = tmpToken;
			D.log('DYKnomination.edittoken :',D.edittoken);
			return D.edittoken;
		}

		/* get edittoken */
		try {
			let data = await apiAsync({
				url:'/w/api.php?action=query&meta=tokens&format=json&type=csrf',
				cache: false
			});
			D.log('DYKnomination.edittoken :',D.edittoken,'data token :',data.query.tokens.csrftoken);
			D.edittoken = data.query.tokens.csrftoken;
		} catch (error) {
			D.errors.push('Błąd pobierania tokena: '+error+'.');
			D.errors.show();
			console.error('Błąd pobierania tokena: ', error);
		}

		return D.edittoken;
	};

	/**
	 * Send support e-mail.
	 * @param {Element} button Link/button used to trigger this request.
	 */
	DYKnomination.emailauthor = async function (button) {
		var D = DYKnomination;

        var opis = prompt('Opisz, co się stało. Bez tego twórca nie będzie wiedział, co naprawiać.','');
        if (!opis) {
            alert('Nic nie wyślę twórcy, dopóki nie opiszesz błędu swoimi słowami. Bez Twojego opisu twórca nie będzie wiedział co naprawiać.');
            return;
        }
        D.log('DYKnomination.errors: ', D.errors); //add potential errors, before stringifying all logs
        var emailbody = opis + '\n\n' + JSON.stringify(D.logs);
		
		//throbber and cursor-wait – until e-mail sent
		$('.CzyWieszEmailDoAutoraWyslano').html('<img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Denken.gif" width="10" height="10">');
		$('#CzyWieszErrorDialog, #CzyWieszSuccess').addClass('wait-im-sending-email');

		// disable
		button.classList.add('dyk-button-off');

		if (!D.edittoken) {
			D.log('Pobranie tokena.');
			await D.getEditToken(false);
		}

		apiAsync({
			url : '/w/api.php',
			type: 'POST',
			data : {
				action : 'emailuser',
				format : 'json',
				target : config.supportUser,
				subject : config.supportEmailTopic,
				text : emailbody,
				token : D.edittoken
			},
		})
			.then(function(){
				$('#CzyWieszErrorDialog, #CzyWieszSuccess').removeClass('wait-im-sending-email');
				$('.CzyWieszEmailDoAutoraWyslano').html(' <strong>Wysłano!</strong>');
			})
			.catch(function(info){
				button.classList.remove('dyk-button-off');
				D.errors.push(`Błąd wysyłania e-maila do twórcy: ${info}.`);
				D.errors.show();
				console.error('Błąd wysyłania e-maila do twórcy: ', info);
			})
		;
	};

	/**
	 * @type {ErrorInfo}
	 */
	DYKnomination.errors = new ErrorInfo((arg1) => {DYKnomination.emailauthor(arg1)}, config.supportUser);
}

function createFullDyk(DYKnomination) {
	createDyk(DYKnomination);
	const { DykMain } = require("./DykMain");
	DYKnomination.main = new DykMain(DYKnomination);
}

module.exports = { DYKnomination, createDyk, createFullDyk };

},{"./DykMain":5,"./ErrorInfo":7,"./asyncAjax":11,"./build/version":12,"./config":13}],2:[function(require,module,exports){
/* global OO */

/**
 * Done-move progress and info dialog.
 */
class DoneDialog {
	/**
	 * @param {String} title Title.
	 * @param {String} content Startup HTML.
	 */
	constructor(title, info) {
		this.title = title;
		this.info = info;
		/** @private OO.ui.Dialog placeholder. */
		this.doneDialogInternal = false;
	}
	/** Show dialog. */
	open() {
		if (!this.doneDialogInternal) {
			this.init();
		}
		this.windowManager.openWindow( this.doneDialogInternal );
	}
	/**
	 * Update main content.
	 * @param {String} info HTML info.
	 * @param {Boolean} append Option to append info (e.g. to append errors).
	 */
	update(info, append) {
		if (append) {
			info = `<div>${this.elInfo.innerHTML}</div>` + info;
		}
		this.elInfo.innerHTML = info;
		if (append) {
			this.forceResize();
		}
	}
	/** Force resize (e.g. after update). */
	forceResize() {
		// this.doneDialogInternal.close();
		// this.doneDialogInternal.open();
		this.windowManager.updateWindowSize(this.doneDialogInternal);
	}

	/** @private init OO boilerplate.*/
	init() {
		const me = this;

		function DoneDialogInternal( config ) {
			DoneDialogInternal.super.call( this, config );
		}
		OO.inheritClass( DoneDialogInternal, OO.ui.ProcessDialog ); 
	
		// Name for .addWindows()
		DoneDialogInternal.static.name = 'doneDialogInternal';
		// Startup title.
		DoneDialogInternal.static.title = this.title;
		// Button(s).
		DoneDialogInternal.static.actions = [
			{ action: 'save', label: 'Zamknij', flags: 'primary' },
		];
	
		// Add content to the dialog body.
		DoneDialogInternal.prototype.initialize = function () {
			DoneDialogInternal.super.prototype.initialize.call( this );

			// base layout
			this.content = new OO.ui.PanelLayout( { 
				padded: true,
				expanded: false 
			} );
			this.content.$element.append( `<div class="info">${me.info}</div>` );
			this.$body.append( this.content.$element );

			// cache
			me.elInfo = this.content.$element[0].querySelector('.info');
		};

		DoneDialogInternal.prototype.getActionProcess = function ( action ) {
			var dialog = this;
			if ( action ) {
				return new OO.ui.Process( function () {
					dialog.close( { action: action } );
				} );
			}
			return DoneDialogInternal.super.prototype.getActionProcess.call( this, action );
		};		
	
		var doneDialogInternal = new DoneDialogInternal();
	
		// Setup OO.oo window manager.
		var windowManager = new OO.ui.WindowManager();
		$( document.body ).append( windowManager.$element );
		windowManager.addWindows( [ doneDialogInternal ] );
	
		// Keep internals
		this.windowManager = windowManager;
		this.doneDialogInternal = doneDialogInternal;
	}
}

module.exports = { DoneDialog };
},{}],3:[function(require,module,exports){
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
		let subpageTitle = '';
		// Usunięcie wpisu z wikitekstu.
		D.log('Usunięcie wpisu z wikitekstu listy propozycji.');
		let modifiedNomsText = nomsText.replace(/\{\{(.+\/propozycje\/[0-9-]+\/([^}]+))\}\}\s*/g, (a, fullTitle, title) => {
			// console.log(a, title)
			if (title == article) {
				subpageTitle = fullTitle.trim();
				return "";
			}
			return a;
		});
		if (!subpageTitle.length || modifiedNomsText === nomsText) {
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
		let subpageLink = `[[${subpageTitle}|${article}]]`;
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
		await this.markDone(subpageTitle, summaryDone);

		// Dopisanie na koniec /ocenione.
		dd.update(stepTpl(stepNo++) + 'Dopisanie na koniec ocenionych.');
		await apiAsync({
			url : '/w/api.php',
			type: 'POST',
			data : {
				action : 'edit',
				format : 'json',
				title : D.getBaseDone(),
				appendtext : `\n{{${subpageTitle}}}`,
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
		let subpageLink = `[[${subpageTitle}|${article}]]`;
		let summaryDone = D.config.summary_rollback.replace('TITLE', subpageLink);
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
},{"./DoneDialog":2,"./asyncAjax":11,"./simpleDialogs":15,"./stringOps":16,"./timeCounter":17}],4:[function(require,module,exports){
/* eslint-disable no-useless-escape */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
/* eslint-disable array-bracket-newline */
const { RevisionList } = require("./RevisionList");

function strToRegExp (str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * Nomination form (dialog).
 */
class DykForm {
	/**
	 * Setup deps.
	 * @param {DYKnomination} core 
	 */
	constructor(core) {
		this.core = core;
		this.revisionList = new RevisionList();
	}

	/**
	 * Function called when user clicks the link of the gadget.
	 */
	askuser () {
		var D = this.core;
		
		var debug = D.debugmode;
		D.errors.clear();
		//D.log(D); //creates circular structure when trying to stringify DYKnimination.logs at the end
		
		D.wgUserName = mw.config.get('wgUserName');
		D.wgTitle = mw.config.get('wgTitle');

		var IMG_ARR = $.merge($('#mw-content-text .infobox span[typeof="mw:File"] a.mw-file-description img'),$('#mw-content-text figure[typeof="mw:File/Thumb"] img'));
		var IMAGES = IMG_ARR.length;
		var REFS = {
			warn:	D.config.no + '&nbsp;&nbsp;<strong style="color: red;">Brak źródeł dyskwalifikuje artykuł ze zgłoszenia!</strong> <small>(<a href="#" role="button">info</a>)</small>',
			ar1:	[''],
			ar2:	['Bibliografia','Przypisy']
		};
			$('.mw-headline').each(function(){
				REFS.ar1.push( $(this).html().replace(/<span class="mw-headline-number"[^>]*>\d+<\/span> */,'') );
			});
			REFS.ar1 = REFS.ar1.join('#') + '#';
			D.sourced = false;
			for (var i=0; i < REFS.ar2.length; i++) {
				if ( REFS.ar1.match('#' + REFS.ar2[i] + '#') ) {D.sourced = true; break;}
			}
		var SIGNATURE = (D.wgUserName ? {name: D.wgUserName, disabled: ' disabled'} : {name: '~~' + '~', disabled: ' disabled'} );

		//workaround for Opera - the textarea must be inserted to a visible element

		var $title_paragraph = $('<p></p>')
			.html('Tytuł artykułu: &nbsp;&nbsp;<input type="text" id="CzyWieszTitle" name="CzyWieszTitle" value="' + D.wgTitle + '" style="width: 476px;" disabled>');

		// Trzeba zasugerować zgłaszającym, żeby podać różne formy pytania, żeby dodający ekspozycję mieli więcej możliwości
		var $question_paragraph = $(`<p><strong>Dokończ pytanie: „Czy wiesz…”</strong></p>
			<p style="font-size:90%">Zalecamy zadanie 2-3 pytań, żeby łatwiej było wybrać ekspozycję (jedno pytanie per wiersz). 
			Pytania zacznij od: „…ile”, „…kto”, „…jak”, „…co”, „…po co”, „…kiedy”, „…dlaczego”, „…gdzie”, „…skąd”, „…że” itp.</p>
		`);
		var $question_textarea_paragraph = $('<p></p>')
			.html(`
				<textarea id="CzyWieszQuestion" style="width: 570px;" rows="2" value="" 
					placeholder="Możesz wpisać kilka pytań, każde w osobnej linijce. Pamiętaj, żeby w każdym dodać pogrubiony link."
					autofocus
				></textarea>
			`)
		;

		var $ref_row = $('<tr id="CzyWieszRefs"></tr>')
			.html('<td>Źródła: </td>'
				+ '<td>' + ( D.sourced ? D.config.yes : REFS.warn ) + '</td>');
			if (D.sourced) {
				$ref_row.css({display: 'none'});
			}

		var $images_row = $('<tr></tr>')
			.html('<td>Liczba grafik w artykule: </td>'
				+ '<td><input type="number" min="0" id="CzyWieszImages" name="CzyWieszImages" value="' + IMAGES + '"' 
				+ 'style="width: 3.5em;">'
				+ '<span id="CzyWieszGalleryToggler" style="display: none;"> &nbsp;<small><a href="#" role="button">(zaproponuj grafikę z artykułu)</a></small></span>');

		var $file_row = $('<tr></tr>')
			.html('<td style="width: 30%;"><input type="checkbox" id="CzyWieszFile1" name="CzyWieszFile1" style="vertical-align: middle;"><label for="CzyWieszFile1"> Zaproponuj grafikę: </label></td>' // style="width: 36%;
				+ '<td><tt>[[Plik:</tt><input type="text" id="CzyWieszFile2" name="CzyWieszFile2" style="width: 52%; vertical-align: middle;" disabled><tt>|100px|right]]</tt></td>');

		//author row
		var $author_row = $('<tr id="CzyWieszAuthorRow"></tr>')
			.html('<td>Główny autor artykułu<span class="czywiesz-tip" title="Gadżet wstawia autora największej edycji w ciągu ostatnich 10 dni (sprawdź zmiany w ostatnich dniach)."><sup>(?)</sup></span>: </td>'
				+ '<td><input type="text" id="CzyWieszAuthor" name="CzyWieszAuthor" style="width: 50%;margin-left: 2px;vertical-align: middle;">'
				+ '&nbsp;&nbsp;<input type="checkbox" id="CzyWieszAuthorInf" name="CzyWieszAuthorInf" style="vertical-align: middle;"><label for="CzyWieszAuthorInf"> poinformować go?</label></td>');

		var $signature_row = $('<tr></tr>')
			.html('<td>Twój podpis: </td>'
				+ '<td><input type="text" id="CzyWieszSignature" name="CzyWieszSignature" value="' 
				+ SIGNATURE.name + '" style="width: 50%;margin-left: 2px;"' + SIGNATURE.disabled + '></td>');

		//wikiproject row (filled later by D.wikiprojects.load())
		var $wikiproject_row = $('<span id="CzyWieszWikiprojectContainer"><small>(trwa ładowanie…)</small></span>');
		$wikiproject_row = $('<td></td>').append($wikiproject_row)
			.append('<a id="CzyWieszWikiprojectAdd">(+)</a>');
		$wikiproject_row = $('<tr></tr>').append('<td>Powiadom wikiprojekt(y): </td>').append($wikiproject_row);

		/* need addidtional comment?
		 *  check → #CzyWieszGadget.height+30, #CzyWieszGadget.parent.height+20
		 *  uncheck → #CzyWieszGadget.height-30, #CzyWieszGadget.parent.height-20
		 */
		var $comment_paragraph_checkbox = $('<input type="checkbox" id="CzyWieszCommentCheckbox" name="CzyWieszCommentCheckbox" style="vertical-align: middle;">')
		.click(function(){
			var el = $('#CzyWieszGadget');
			if ( $(this).prop('checked') ) {
				el.height(el.height+30);
				el.parent().height(el.parent().height+20);
			} else {
				el.height(el.height-30);
				el.parent().height(el.parent().height-20);
			}
		});
		var $comment_paragraph = $('<p></p>').append($comment_paragraph_checkbox).append('<label for="CzyWieszCommentCheckbox"> Potrzebujesz zamieścić dodatkowy komentarz? (Twój podpis zostanie dodany automatycznie)</label>');
		var $comment_textarea_paragraph = $('<p id="CzyWieszCommentContainer" style="display: none;"></p>')
			.html('<textarea id="CzyWieszComment" style="width: 570px;" rows="2" value=""></textarea>');

		//rules paragraph
		var $rules_paragraph = $('<p id="CzyWieszRules"></p>')
			.html(`<small>Reguły: Zgłaszaj hasła, które powstały lub zostały rozbudowane nie dawniej niż 10 dni temu.
				Hasła muszą posiadać źródła (najlepiej w formie przypisów) oraz muszą zawierać co najmniej 2 kB samej treści.</small>`)
			.css({border: '1px solid #F0F080', backgroundColor: '#FFFFE0', paddingLeft: '5px'});
 
		var $loading_bar = $('<div id="CzyWieszLoaderBar"></div>')
			.css({width: '100%', backgroundColor: 'rgb(220, 220, 220)', border: '1px solid rgb(187, 187, 187)', borderRadius: '3px', boxSizing: 'border-box'})
			.html('<p id="CzyWieszLoaderBarParagraph" style="margin: 0 0 0 7px; position: absolute;">&nbsp;</p>'
				+ '<div id="CzyWieszLoaderBarInner" style="width: 0; height: 20px; background-color: #ABEC46; border: none; border-radius: 3px;"></div>');

		//build the dialog
		var $dialog = $('<table></table>').css('width','100%').append($ref_row).append($images_row).append($file_row)
			.append($author_row).append($signature_row).append($wikiproject_row);
		$dialog = $('<div id="CzyWieszGadget"></div>').append($title_paragraph).append($question_paragraph).append($question_textarea_paragraph)
			.append($dialog).append($comment_paragraph).append($comment_textarea_paragraph).append($rules_paragraph).append($loading_bar);
 
		//main buttons
		var buttons = {
			"Zgłoś": function() {
				if (D.sourced) {
					D.main.checkForm();
				}
				else {
					alert('Artykuł bez źródeł jest zdyskwalifikowany z nominacji. (Jeśli źródła są, to zwróć uwagę, czy tytuł sekcji jest prawidłowy, tzn. „Przypisy” lub „Bibliografia”.)');
				}
			},
			"Anuluj" : function() {
				$(this).dialog("close");
			}
		};
 
		$dialog.dialog({
		  width: 600,
		  modal: true,
		  title: (window.DYKnomination_is_beta===true?'BETA: ':'')+'Zgłoszenie artykułu do rubryki „Czy wiesz…”' + (debug ? ' &nbsp; (<small id="CzyWieszDialogDebug" style="color: red;">TRYB DEBUG</small>)' : ''),
		  draggable: true,
		  dialogClass: "wikiEditor-toolbar-dialog",
		  close: function() { $(this).dialog("destroy"); $(this).remove();},
		  buttons: buttons
		});

		// debug quicky
		if (D.debugmode) {
			$('#CzyWieszQuestion').val(`jak testować '''[[${D.wgTitle}]]'''?`);
			$('#CzyWieszAuthor').parent().append(`
				<p style="padding:2px;margin:0;font-size:80%;background:wheat"
						title="Autor dostanie powiadomienie o utworzonej podstronie." 
					>Uwaga! Dla testów lepiej wpisz siebie (autor dostanie pinga).
				</p>
			`);
		}

		//fill wikiprojects list
		D.wikiprojects.load();

		// check size of article and make a tip for the possible author
		this.pagerevs();
		
		if ($('#CzyWieszStyleTag').length == 0) {
			D.config.styletag.appendTo('head');
		}

		// when user ticks he wants to nominate with picture → enable picture/file field
		$('#CzyWieszFile1').change(function(){
			var a=$('#CzyWieszFile2');
			a.prop('disabled', !a.prop('disabled'));
		});

		// if there are images in article → add link to small gallery to quickly choose an image from article
		if (IMAGES > 0) {
			$('#CzyWieszGalleryToggler').toggle();
			$('#CzyWieszGalleryToggler a').click(function(){
				var GALLERY = '<div id="CzyWieszGalleryHolder">'
						+ '<div id="CzyWieszGallery" style="background-color: #F2F5F7;">'
						+ '<table><tbody>';
						for (var i=0; i<IMG_ARR.length; i++) {
							if (i%5 == 0) {GALLERY += '<tr>';}
							GALLERY += '<td>';
							GALLERY += IMG_ARR[i].outerHTML.replace(/\swidth=\"\d+\"/,' width="100"').replace(/\sheight=\"[^\"]*\"/,'').replace(/\sclass=\"[^\"]*\"/g,'');
							GALLERY += '</td>';
							if (i%5 == 4) {GALLERY += '</tr>';}
						}
				GALLERY	+= '</tbody></table> </div> </div>';

				$(GALLERY).dialog({
					width: 547,
					modal: true,
					title: 'Wybierz grafikę:',
					draggable: true,
					dialogClass: "wikiEditor-toolbar-dialog",
					close: function() { $(this).dialog("destroy"); $(this).remove();},
					buttons: {
						"Wybierz": function() {
							if ($('#CzyWieszFile1').length > 0) {
								$('#CzyWieszFile1').prop('checked',true);
								$('#CzyWieszFile2').prop('disabled', false);
								$('#CzyWieszFile2').val( $('.czy-wiesz-gallery-chosen').length == 0 ? '' : decodeURIComponent($('.czy-wiesz-gallery-chosen')[0].src.match(/\/\/upload\.wikimedia\.org\/wikipedia\/commons(\/thumb)?\/.\/..\/([^\/]+)\/?/)[2]).replace(/_/g,' ') ); // ← extract file name
							}

							$(this).dialog("destroy");
							$(this).remove();
						},
						"Anuluj" : function() {
							$(this).dialog("close");
						}
					}
				});
				$('#CzyWieszGallery img').each(function(){
					$(this).click(function(){
						$('.czy-wiesz-gallery-chosen').each(function(){
							$(this).toggleClass('czy-wiesz-gallery-chosen');
						});
						$(this).toggleClass('czy-wiesz-gallery-chosen');
					});
				});
			});
		}

		// if there are no refs (or they're badly named) → append this dialog to a link in $ref_row
		$('#CzyWieszRefs small a').click(function(){
			$(/*html*/`<div>
				<div class="floatright">${D.config.CWicon}</div>
				<p style="margin-left: 10px;">Zgodnie z wytycznymi <a class="czywiesz-external" target="_blank" href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojektu Czy wiesz</a> zgłaszane hasło powinno posiadać źródła w formie bibliografii lub przypisów.
				<a class="czywiesz-external" target="_blank" href="/wiki/Wikiprojekt:Czy_wiesz/pomoc#Zg.C5.82aszanie_propozycji_i_poprawa_hase.C5.82" title="Wikiprojekt:Czy wiesz/pomoc#Zgłaszanie propozycji i poprawa haseł">Więcej informacji w instrukcji</a>
				<br /><small>Możliwe, że w artykule sekcje ze źródłami są błędnie nazwane – w takim wypadku popraw je.</small></p>
			</div>`)
			.dialog({ modal: true, dialogClass: "wikiEditor-toolbar-dialog", close: function() { $(this).dialog("destroy"); $(this).remove();} });
		});

		// click on (+) near wikiprojects combo box → add new combo box and enlarge the dialog window
		$('#CzyWieszWikiprojectAdd').click(function(){
			$('#CzyWieszWikiprojectContainer').append(D.wikiprojects.$select.clone());
			$('#CzyWieszLoaderBar').parent().css({height: '+=24'});
		});

		$('#CzyWieszCommentCheckbox').change(function(){
			$('#CzyWieszCommentContainer').toggle();
		});

		//$('#CzyWieszQuestion').keyup();
		$('#CzyWieszQuestion').focus();
		
	}

	/** Page revisions and author data. */
	async pagerevs () {
		const D = this.core;
		const bigEdit = 2048; // big/min edit

		const {revisions, records} = await this.revisionList.readRevs(D.wgTitle, 10);
		D.log('revisions in last 10 days + 1 edit:', revisions.length);
		D.log('day-users in last 10 days:', records.length);
		let editSize = 0;
		// found edits
		if (records.length > 0) {
			// find a winner edit/author
			let {record:winner, size} = this.revisionList.findWinner(records, bigEdit);
			D.log(JSON.stringify(winner), size);

			// find size on the day of edit
			editSize = size;

			// add a possible author…
			if (winner) {
				$('#CzyWieszAuthor').val(winner.user);
				$('#CzyWieszAuthor').after('&nbsp;<small id="CzyWieszAuthorTip"><span class="czywiesz-tip" title="Autor największej lub najnowszej dużej edycji z ostatnich 10 dni (dodane ' + winner.added + ' znaków, data: ' + winner.day + ').">(!)</span></small>&nbsp;');
				if (D.debugmode) {
					$('#CzyWieszAuthor').width('25%').val(D.wgUserName);
					$('#CzyWieszAuthor').after(winner.user);
				}
			} else {
				alert(`
					⚠️ W ciągu ostatnich 10 dni ''nie dokonano wystarczająco dużych zmian''.
					Skumulowany rozmiar: ${editSize} bajtów, edycje: ${revisions.length-1}.

					Jeszcze raz rozważ zgłaszanie tego artykułu, gdyż może to być niezgodne z regulaminem.
				`.replace(/\n\t+/g, '\n'));
			}
		}
		// there are no edits in last 10 days
		else {
			// we should still get one revision
			D.log(JSON.stringify(revisions));
			editSize = revisions[0].size;
			alert(`
				⚠️ W ciągu ostatnich 10 dni ''nie wykonano żadnych zmian''.

				Jeszcze raz rozważ zgłaszanie tego artykułu, gdyż może to być niezgodne z regulaminem.
			`.replace(/\n\t+/g, '\n'));
		}

		D.articlesize = {
			size:	editSize,
			enough:	(editSize >= bigEdit),
			warn:	(editSize >= bigEdit ? '' : (D.config.no + '&nbsp;&nbsp;<strong style="color: red;">Rozmiar ' + editSize + ' b dyskwalifikuje artykuł ze zgłoszenia!</strong> <!--small>(<a class="czywiesz-external">info</a>)</small-->') )
		};

		// autor/edit info: when, who, what changed
		if (records && records.length) {
			let infoTable = `<table class="wikitable">`;
			infoTable += `<tr>
				<th>Data</th>
				<th>Dodane</th>
				<th>Usunięte</th>
				<th>Edycje</th>
				<th>Autor(ka)</th>
			</tr>`;
			for (const record of records) {
				infoTable += `<tr>
					<td>${record.day}</td>
					<td>+${record.added}</td>
					<td>-${record.removed}</td>
					<td>${record.edits}${record.isNew ? ' (nowy art.)' : ''}</td>
					<td>${record.user}</td>
				</tr>`;
			}
			infoTable += `</table>`;
			const historyHref = mw.util.getUrl(null, {action:'history'});
			const $tr = $('<tr id="CzyWieszAuthorInfo"></tr>')
				.insertAfter($('#CzyWieszAuthorRow'))
				.html(`
					<td colspan=2>
						<a class="dyk-toggle" role="button" href="#">(pokaż zmiany w ostatnich dniach)</a>
						<div style="display:none" class="dyk-toggle-content">
							${infoTable}
							<a href="${historyHref}" class="czywiesz-external" target="_blank">zobacz historię</a>
						</div>
					</td>
				`)
			;
			// toggle action
			const $toggleContent = $('.dyk-toggle-content', $tr);
			$('.dyk-toggle', $tr).click(function(e) {
				e.preventDefault();
				$toggleContent.toggle();
			});
		}

		// size warning
		$('<tr id="CzyWieszSize"></tr>')
			.insertAfter($('#CzyWieszRefs'))
			.html('<td>Rozmiar (>2 kb): </td>'
				+ '<td>' + (D.articlesize.enough ? D.config.yes : D.articlesize.warn) + '</td>')
			.css( D.articlesize.enough ? {display: 'none'} : {})
		;

		// tooltips
		$('#CzyWieszGadget .czywiesz-tip').click(function () {
			alert(this.title);
		});
	}

	/** Prepare and validate values. */
	prepareValues () {
		var D = this.core;

		//get the question
		var QUESTION = $('#CzyWieszQuestion').val();
		var FILE = ( $('#CzyWieszFile1').prop('checked') ? $('#CzyWieszFile2').val().trim() : '' );
		var IMAGES = $('#CzyWieszImages').val().trim();
		var REFS = (D.sourced ? '+' : ' ');
		var AUTHOR = $('#CzyWieszAuthor').val().trim();
		var AUTHOR_INF = ( $('#CzyWieszAuthorInf').prop('checked') ? true : false );
		var SIGNATURE = $('#CzyWieszSignature').val().trim();
		//get the wikiprojects
		var wikiprojectSet = new Set();
		$('.czywiesz-wikiproject').each( function() {
			var val = $(this).val();
			if (val != 'none') {
				wikiprojectSet.add(val);
			}
		});
		var WIKIPROJECT = Array.from(wikiprojectSet).map(v=>D.wikiprojects.list[v]);

		var COMMENT = ( $('#CzyWieszCommentCheckbox').prop('checked') ? $('#CzyWieszComment').val().trim() : false );

		//validate form
		var invalid = {is: false, fields: [], alert: []};

			const tITLE = D.wgTitle[0].toLowerCase()+D.wgTitle.substr(1); //title in link starting with lowercase
			const egQuestion = 'Przykład:\n   \'\'\'[['+D.wgTitle+']]\'\'\' lub \'\'\'[['+tITLE+']]\'\'\'\n lub\n   \'\'\'[['+D.wgTitle+'|nazwa do wyświetlenia, jeśli inna niż tytuł]]\'\'\'.';

			if (typeof QUESTION != 'string' || QUESTION === '') {
				invalid.is = true;
				invalid.fields.push('Question');
				invalid.alert.push('Wpisz pytanie.');
			}
			else {
				QUESTION = QUESTION.trim()
					.replace(/[\r\n]/g, '\n')		// normalize new lines
					.replace(/\n\s+/g, '\n')		// remove extra spaces
					.replace(/(--)?~{3,5}$/, '')	// remove signature
					.trim()
					.replace(/(^|\n)[.…]+/g, '$1')	// remove leading dots
					.replace(/(^|\n)czy wiesz[\s,\.]*/ig, '$1')	// remove leading DYK
					.replace(/\?($|\n)/g, '$1')		// remove?
					.trim()
				;

				if (QUESTION.length < 10) {
					invalid.is = true;
					invalid.fields.push('Question');
					invalid.alert.push('Zadaj poprawne pytanie – to jest za krótkie.\n'+egQuestion);

					return invalid;
				}

				// if there isn't any bold (a) link with title or (b) link with title starting with lowercase
				const findQ = new RegExp('\'\'\'\\s*\\[\\[('+strToRegExp(D.wgTitle)+'|'+strToRegExp(tITLE)+')(\\]\\]|\\|.*?\\]\\])\\s*\'\'\'');
				const missingQ = QUESTION.split('\n').some(q=>!q.match(findQ));
				if (missingQ) {
					invalid.is = true;
					invalid.fields.push('Question');
					invalid.alert.push('Pytanie musi zawierać link do artykułu. Pogrubiony.\n'+egQuestion);
				}
				else {
					// final prep
					QUESTION = QUESTION.split('\n').map(q=>`…${q}?`).join('\n\n') + '\n';
				}
			}
			if (typeof FILE == 'string' && FILE != '') {
				FILE = '[[Plik:' + (FILE.match(/^(Plik:|File:)/i) ? FILE.replace(/^(Plik:|File:)/i,'') : (FILE)) + '|100px|right]]\n';
			}
			if (typeof IMAGES != 'string' || IMAGES === '') {
				invalid.is = true;
				invalid.fields.push('Images');
				invalid.alert.push('Podaj liczbę grafik w artykule.');
			}
			if (typeof AUTHOR != 'string' || AUTHOR === '') {
				invalid.is = true;
				invalid.fields.push('Author');
				invalid.alert.push('Podaj autora artykułu.');
			}
			if (typeof SIGNATURE != 'string' || SIGNATURE === '') {
				invalid.is = true;
				invalid.fields.push('Signature');
				invalid.alert.push('Podpisz się.');
			}
			if ( (typeof COMMENT!='string'&&typeof COMMENT!='boolean') || (typeof COMMENT=='string' && (COMMENT===''||COMMENT.match(/^[^A-ZĘÓĄŚŁŻŹĆŃa-zęóąśłżźćń]+$/)) ) || (typeof COMMENT=='string'&&COMMENT==true) ) {
				invalid.is = true;
				invalid.fields.push('Comment');
				invalid.alert.push('Jeśli musisz podać jakiś komentarz to podaj jakiś sensowny, jeśli nie – wyłącz to pole. Nie wstawiaj w tym polu samego podpisu (lecz w przypadku komentarza – podpisz się).');
			}

		const values = {
			question:    QUESTION,
			file:        FILE,
			images:      IMAGES,
			refs:        REFS,
			author:      AUTHOR,
			signature:   SIGNATURE,
			comment:    COMMENT,
			authorInf:   AUTHOR_INF,
			wikiproject: WIKIPROJECT
		};

		return {invalid, values};
	}

}

module.exports = { DykForm };

},{"./RevisionList":9}],5:[function(require,module,exports){
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

},{"./DykForm":4,"./DykProcess":6,"./Wikiprojects":10}],6:[function(require,module,exports){
/* eslint-disable no-useless-escape */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
/* eslint-disable array-bracket-newline */
const { Loadbar } = require("./Loadbar");
const { apiAsync } = require("./asyncAjax");
const { config } = require("./config");

/**
 * Nomination process (after initial form check).
 */
class DykProcess {
	/**
	 * Setup deps.
	 * @param {DYKnomination} core 
	 */
	constructor(core) {
		this.core = core;
		this.values = {};	// values from DykForm
	}

	/** Prepare nomination. */
	async prepare (values) {
		this.values = values;
		this.wgTitle = this.core.wgTitle;
		var Dv = this.values;
		this.errors = this.core.errors;

		// clear errors
		this.errors.clear();

		// main tasks count
		this.loadbar = new Loadbar(4 + Dv.wikiproject.length + (Dv.authorInf?1:0));

		// init progress
		this.loadbar.next();

		// init nomination date
		this.setupNominationPage();

		let nominated;	// already nominated
		try {
			nominated = await this.checkNominationExists();
		} catch (error) {
			this.errors.push('Błąd sprawdzania istniejących zgłoszeń: ' + error + '.');
			this.errors.show();
			console.error('Błąd sprawdzania istniejących zgłoszeń: ', error);
		}

		if (nominated) {
			this.errors.show();
		} else {
			await this.core.getEditToken(false);
			await this.runNominate();
		}
	}

	/** @private Setup or read name for the nomination page. */
	setupNominationPage () {
		if (!this.nominationDate) {
			this.nominationDate = new Date();
		}
		this.nominationPage = this.core.getNominationPage(this.nominationDate, this.wgTitle);

		return this.nominationPage;
	}

	/** @private Check for active nominations and nominations this month. */
	async checkNominationExists () {

		// search existing sections on nomination page
		let data = await apiAsync({
			url: '/w/api.php?action=parse&format=json&page=' + encodeURIComponent(this.core.getBaseNew()) + '&prop=sections',
			cache: false
		});
		let sections = data.parse.sections;
		this.core.log('Sekcje na stronie nominacji:', sections);
		let exisiting = sections.filter(s => s.level==2 && s.line == this.wgTitle);
		if (exisiting.length) {
			const href = '/wiki/'+encodeURIComponent(this.setupNominationPage()) + '#' + exisiting[0].anchor;
			this.errors.push(`
				Podany artykuł jest zgłoszony do rubryki „Czy wiesz…”.<br />
				<a href="${href}" class="czywiesz-external" target="_blank">Sprawdź</a>.
			`);
			return true;
		}

		// check for existing nomination page
		let subpageTitle = this.setupNominationPage();
		let subpageData = await apiAsync({
			url: '/w/api.php?action=query&format=json&prop=&titles=' + encodeURIComponent(subpageTitle) + '&formatversion=2',
			cache: false
		});
		let pageInfo = subpageData.query.pages.pop();
		if (!pageInfo.missing) {
			const href = '/wiki/'+encodeURIComponent(subpageTitle);
			this.errors.push(`
				Podany artykuł był już zgłoszony do rubryki „Czy wiesz…” w tym miesiącu.<br />
				<a href="${href}" class="czywiesz-external" target="_blank">Sprawdź</a>.
			`);
			return true;
		}

		// nomination doesn't exist yet
		return false;
	}

	/** @private . */
	async runNominate () {

		var D = this.core;
		var Dv = this.values;

		// make summary
		let subpage = this.setupNominationPage();
		let summary = D.config.summary.replace('TITLE', `[[${subpage}|${D.wgTitle}]]`);

		/* making data ready */
		this.loadbar.next();

		// start: end of day of edit XOR current time (whatever is smaller)
		let clockStart = '{{subst:#timel:Y-m-d H:i:s}}';
		// vide: Zmiany w stosowaniu terminów #10 
		// const editDate = new Date(Dv.date + 'T23:59:59');
		// if (editDate < new Date()) {
		// 	clockStart = editDate.toISOString().slice(0, 10) + ' 23:59:59';
		// }
		// making content
		let input = `== [[${subpage}|${D.wgTitle}]] ==\n`
			+ '<!-- artykuł zgłoszony za pomocą gadżetu CzyWiesz -->\n'
			+ `{{licznik czasu|start=${clockStart}|zdarzenie=Dyskusja|rgz=ż|dni=30}}\n`
			+ Dv.file         //FILE is already with \n at the end
			+ Dv.question     //QUESTION is already with \n at the end
			+ '{' + '{Wikiprojekt:Czy wiesz/weryfikacja|' + D.wgTitle + '|' + Dv.refs + '|' + Dv.images + '|' + Dv.author + '|' + Dv.signature + '|?|?|?}}\n'
			+ (Dv.comment ? Dv.comment + ' ' : '') + '~~' + '~~'
		;

		D.log('input:',input);

		await this.createNomination(input, summary);
		await this.inform_r();
		await this.inform_a();
		await this.inform_w();

		this.success();
	}

	/** @private Add nomination. */
	async createNomination (input, summary) {

		var D = this.core;
		var Dv = this.values;
		
		D.log('DYKnomination.values:',Dv);

		this.loadbar.next();

		try {
			// create subpage
			let subpageTitle = this.setupNominationPage();
			await apiAsync({
				url : '/w/api.php',
				type: 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : subpageTitle,
					text : input,
					summary : summary,
					watchlist : 'watch',
					token : D.edittoken
				}
			});
			this.loadbar.next();

			// append subpage
			await apiAsync({
				url : '/w/api.php',
				type: 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : D.getBaseNew(),
					appendtext : '\n{'+'{' + subpageTitle + '}}',
					summary : summary,
					watchlist : 'nochange',
					token : D.edittoken
				}
			});
		} catch (error) {
			D.errors.push('Błąd zgłaszania do rubryki: ' + error + '.');
			D.errors.show();
			console.error('Błąd zgłaszania do rubryki: ', error);
		}
	}

	/**
	 * @private Inform readers.
	 * 
	 * Inserts a template to the nominated article.
	 * 
	 * @returns Promise.
	 */
	async inform_r () {
 
		var D = this.core;
		var debug = D.debugmode;

		let subpageTitle = this.setupNominationPage();

		// skip for debug
		if ( debug ) {
			D.log(`edit: ${D.wgTitle}, subpage: ${subpageTitle}`);
			return;
		}

		try {
			await apiAsync({
				url : '/w/api.php',
				type : 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : D.wgTitle,
					prependtext : '{' + '{Czy wiesz do artykułu|s=' + subpageTitle + '}' + '}\n',
					summary : D.config.summary_r,
					watchlist : 'nochange',
					token : D.edittoken
				}
			});
		} catch (info) {
			D.errors.push('Błąd informowania w artykule: ' + info);
			D.errors.show();
			console.error('Błąd informowania w artykule:', info);
		}
	}

	/** @private Inform author. */
	async inform_a () {
		var D = this.core;
		var Dv = this.values;
		var debug = D.debugmode;
		var sectionTitle_a,summary_a;

		if ( !Dv.authorInf ) {
			return;
		}

		let subpageTitle = this.setupNominationPage();
		try {
			sectionTitle_a = D.config.sectionTitle_a.replace('TITLE',D.wgTitle);
			summary_a = D.config.summary_a.replace('TITLE',D.wgTitle);
			await apiAsync({
				url : '/w/api.php',
				type : 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : (debug ? config.debugBase + '/autor' : 'Dyskusja wikipedysty:' + Dv.author),
					section : 'new',
					sectiontitle : sectionTitle_a,
					text : (debug ? "debug: '''" + Dv.author + "'''\n" : '') + '{' + '{subst:Czy wiesz - autor0|tytuł strony='+D.wgTitle+'|s='+subpageTitle+'}} ~~' + '~~',
					summary : summary_a,
					watchlist : 'nochange',
					token : D.edittoken
				},
			})
		} catch (info) {
			D.errors.push('Błąd informowania autora: ' + info);
			D.errors.show();
			console.error('Błąd informowania autora:',  info);
		}

	}

	/** @private Inform wikiprojects. */
	async inform_w () {
		var D = this.core;
		var Dv = this.values;
		var summary_w_newsection,summary_w,sectionTitle_w;

		if ( Dv.wikiproject.length == 0 ) {
			return;
		}
		else {
			sectionTitle_w = D.config.sectionTitle_w.replace('TITLE',D.wgTitle);
			summary_w_newsection = D.config.summary_w_newsection.replace('TITLE',D.wgTitle);
			summary_w = D.config.summary_w.replace('TITLE',D.wgTitle);
 
			// recursive inform loop
			for (let i = 0; i < Dv.wikiproject.length; i++) {
				const curWikiproject = Dv.wikiproject[i];
				try {
					await this.inform_wLoop(sectionTitle_w, summary_w_newsection, summary_w, curWikiproject);
				} catch (error) {
					D.errors.push('Błąd informowania projektu: '+ curWikiproject.name + ': '+error.toString()+'.');
					D.errors.show();
					console.error('Błąd informowania projektu: '+ curWikiproject.name + ': '+error.toString()+'.');
					throw new Error(`Błąd informowania projektów (${i} / ${Dv.wikiproject.length}).`);
				}
				this.loadbar.next();
			}
		}
	}

	/**
	 * @private Inform a wikiproject.
	 * @param {String} secttitl_w 
	 * @param {String} summary_w 
	 * @param {String} summary_w2 
	 * @param {Object} curWikiproject 
	 */
	async inform_wLoop (sectionTitle_w, summary_w_newsection, summary_w, /* object */ curWikiproject) {
		var D = this.core;
		var debug = D.debugmode;
		
		var pageToEdit = curWikiproject.page;

		D.log('curWikiproject:',curWikiproject,'pageToEdit:',pageToEdit);

		let mainCall;
		let subpageTitle = this.setupNominationPage();
		let infoTpl = `{{Czy wiesz - wikiprojekt|${D.wgTitle}|s=${subpageTitle}}}`;
		if (!debug) {
			// get page source [to edit]
			let data;
			try {
				data = await apiAsync({
					url : '/w/index.php?action=raw&title=' + encodeURIComponent(pageToEdit),
					cache : false
				});
			} catch (error) {
				throw new Error(`Nieudany odczyt strony '${pageToEdit}' (${error}).`);
			}

			// now we need to prepare data for page edit operation
			if (!data.match(D.config.dykSectionIndicator)) {
				data = data.replace('[[Kategoria:','== Czy wiesz ==\n' + D.config.dykSectionIndicator + '\n\n[[Kategoria:');
			}
			data = data.replace(D.config.dykSectionIndicator,
				D.config.dykSectionIndicator + '\n'
				+ infoTpl);

			D.log('curWikiproject (2):',curWikiproject,'pageToEdit (2):',pageToEdit);

			mainCall = {
				url : '/w/api.php',
				type : 'POST',
				data: {
					action: 'edit',
					format: 'json',
					title:  pageToEdit,
					text:   data,
					summary: summary_w,
					watchlist: 'nochange',
					token:  D.edittoken
				}
			};
		}
		else {
			// force talk-page like flow so that we can edit single page multiple times
			// just add new section
			mainCall = {
				url : '/w/api.php',
				type : 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : config.debugBase + '/wikiprojekt',
					section : 'new',
					sectiontitle : sectionTitle_w + ' • ' + curWikiproject.name,
					text : "debug: '''" + pageToEdit + "'''\n" +  infoTpl,
					summary : summary_w_newsection,
					watchlist : 'nochange',
					token : D.edittoken
				}
			};
		}

		// add section or modify page
		await apiAsync(mainCall);
	}

	/** Finalize nomination (might actually show errors if there were any). */
	success () {
		var D = this.core;
		var Dv = this.values;

		if (!D.errors.isEmpty()) {
			D.errors.show();
			return false;
		}

		this.loadbar.next('done');
		D.log('Zgłoszenie zakończone sukcesem!');

		let subpageTitle = this.setupNominationPage();

		// end dialog: "Finished!"
		$(/* html */`
			<div id="CzyWieszSuccess">
				<div class="floatright">${D.config.CWicon}</div>
				<p style="margin-left: 10px;">Dziękujemy za 
				<a id="CzyWieszLinkAfter" href="/wiki/${encodeURIComponent(subpageTitle)}" class="czywiesz-external" target="_blank">zgłoszenie</a>.
				<br /><br />
				Dla pewności możesz sprawdzić 
				<a href="/wiki/Specjalna:Wk%C5%82ad/${encodeURIComponent(Dv.signature)}" class="czywiesz-external" target="_blank">swój wkład</a>,
				czy wszystko poszło zgodnie z planem.<br />
				<small><a class="CzyWieszEmailDoAutoraToggle">(Coś nie działa?)</a></small>
				<div class="CzyWieszEmailDoAutoraInfo" style="display:none;">
					Jeśli coś poszło nie tak, to <a href="#" role="button" class="CzyWieszEmailDoAutoraWyslij">kliknij tutaj</a>,
					aby wysłać twórcy gadżetu e-mail z opisem błędu, a gadżet dołączy do niego szczegóły techniczne.
					<span class="CzyWieszEmailDoAutoraWyslano"></span>
				</div>
			<br />
			<a href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojekt Czy wiesz</a></p></div>
		`)
		.dialog({
			modal: true,
			dialogClass: "wikiEditor-toolbar-dialog",
			title: D.config.tmpldone,
			close: function() {
				$(this).dialog("destroy");
				$(this).remove();
				$('#CzyWieszGadget').dialog("destroy");
				$('#CzyWieszGadget').remove();
			}
		});
		$('#CzyWieszSuccess a.CzyWieszEmailDoAutoraToggle').click(function() {
			$('#CzyWieszSuccess .CzyWieszEmailDoAutoraInfo').toggle();
		});
		$('#CzyWieszSuccess a.CzyWieszEmailDoAutoraWyslij').click(function(e) {
			e.preventDefault();
			D.emailauthor(this);
		});

		return true;
	}

}

module.exports = { DykProcess };

},{"./Loadbar":8,"./asyncAjax":11,"./config":13}],7:[function(require,module,exports){
/**
 * D.errors info.
 */
class ErrorInfo {
	/**
	 * Init.
	 * @param {Function} emailSupport Function to inform gadget support about problems.
	 * @param {String} supportUser User to inform about problems.
	 */
	constructor(emailSupport, supportUser) {
		this.emailSupport = emailSupport;
		this.supportUser = supportUser;
		this.errors = [];
	}

	/** Clear messages. */
	clear() {
		this.errors.length = 0;
	}

	/** Add error message. */
	push(message) {
		this.errors.push(message);
	}

	/** No messages. */
	isEmpty() {
		return this.errors.length < 1;
	}
	
	/** Show errors. */
	show() {
		let list = $('<ul></ul>');
		for (let i=0; i < this.errors.length; i++) {
			list.append( $('<li></li>').html(this.errors[i]) );
		}
		let dialog = $('<div id="CzyWieszErrorDialog"></div>')
			.append(list)
			.append( $(/* html */`
				<p>Coś poszło nie tak. Jeśli powyższa lista nie wyjaśnia problemu, to więcej informacji jest w konsoli przeglądarki.</p>
				<p>Jeśli problem jest nietypowy, to <a href="#" role="button" class="CzyWieszEmailDoAutoraWyslij">wyślij e-mail programiście z danymi błędu</a> (szybka wysyłka logów mailem).<span class="CzyWieszEmailDoAutoraWyslano"></span></p>
				<p>Możesz też opisać co się stało na <a href="https://pl.wikipedia.org/wiki/WP:BAR:TE" class="czywiesz-external" target="_blank">w kawiarence technicznej</a>.</p>
			`) )
		;
		
		dialog.dialog({
			width: 400,
			modal: true,
			title: 'Wystąpił błąd',
			draggable: true,
			dialogClass: "wikiEditor-toolbar-dialog",
			close: function() { $(this).dialog("destroy"); $(this).remove();}
		});
		const D = this;
		$('#CzyWieszErrorDialog a.CzyWieszEmailDoAutoraWyslij').click(function(e) {
			e.preventDefault();
			D.emailSupport(this);
		});
	}
}

module.exports = { ErrorInfo };

},{}],8:[function(require,module,exports){
/* eslint-disable no-useless-escape */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
/* eslint-disable array-bracket-newline */
/**
 * Nominacje do Czy-Wiesza aka DYKnomination (Did You Know).
 * 
 * Instrukcja:
 * [[Wikipedia:Narzędzia/CzyWiesz]]
 * 
 * Historia zmian:
 * https://pl.wikipedia.org/w/index.php?title=MediaWiki:Gadget-CzyWiesz.js&action=history
 * 
 * Repozytorium:
 * https://github.com/Eccenux/wiki-DYKCzyWiesz
 * 
 * Wdrożone za pomocą: [[Wikipedia:Wikiploy]]
 */
class Loadbar {
	/**
	 * @param {Number} tasks Expected number of tasks.
	 */
	constructor(tasks) {
		this.task = -1;
		this.tasks = tasks;
	}
	next (task) {
		if (typeof task != 'string'){
			this.task++;
			task = Math.min(this.task,4);
		}
		var tasks = this.tasks;
		
		var txt;
		switch (task) {
			case 0:
				txt = 'Sprawdzam stronę zgłoszeń…';
				break;
			case 1:
				txt = 'Pobieram dane z formularza…';
				break;
			case 2:
				txt = 'Przygotowuję dane do wysłania…';
				break;
			case 3:
				txt = 'Zgłaszam propozycję…';
				break;
			case 4:
				txt = 'Informuję o zgłoszeniu…';
				break;
			case 'done':
				txt = 'Zakończono!';
				task = tasks;
				break;
			case 'error':
				txt = 'Wystąpił błąd!';
				break;
			default:
				txt = '';
		}

		$('#CzyWieszLoaderBarParagraph').text(txt);
		if (task != 'error') { // 'error' → task/tasks = NaN
			$('#CzyWieszLoaderBarInner').css({width: 100*task/tasks + '%'});
		}
		else {
			$('#CzyWieszLoaderBarInner').css({backgroundColor: 'red'});
		}
	}
}

module.exports = { Loadbar };

},{}],9:[function(require,module,exports){
/**
 * Revision list reader and parser.
 */
class RevisionList {
	constructor() {
		this.api = false;
		this.readLimit = 100; // number of records to read
	}

	/** @private */
	getApi() {
		if (!this.api) {
			this.api = new mw.Api();
		}
		return this.api;
	}
	/** @private */
	firstPage(data) {
		let id;
		for (id in data.query.pages) {
			break;
		}
		return data.query.pages[id];
	}

	/**
	 * Read revisions data.
	 * @param {String} title Article.
	 * @param {Number} days Number of days.
	 */
	async readRevs(title, days) {
		const dt = new Date();
		dt.setDate(dt.getDate() - days);
		const from = dt.toISOString();
		console.log({from});
	
		let data;
		// get ids to figure out correct limit
		data = await this.getApi().get({
			action: 'query',
			prop: "revisions",
			format: "json",
			rvprop: ['ids'],
			rvend: from,
			rvlimit: 'max',
			titles: title,
		});
		const ids = this.firstPage(data).revisions;
	
		// get data of +1 edits (need one more edit to get size)
		data = await this.getApi().get({
			action: 'query',
			prop: "revisions",
			format: "json",
			rvprop: ['timestamp', 'user', 'size'],
			rvlimit: !ids ? 1 : ids.length + 1,
			titles: title,
		});
		const revisions = this.firstPage(data).revisions;
		if (ids && ids.length) {
			const records = this.prepareData(revisions, dt);
			console.log({data, revisions, records});
			return {revisions, records};
		} else {
			// no recent edits, old article
			return {revisions, records:[]};
		}
	}

	/**
	 * Prepare revision records.
	 * 
	 * @param {Array} revisions prepare data.
	 * @param {Date|Number} limit Limit in days from now or sepcific date.
	 * @returns Daily edit stats by each user.
	 */
	prepareData(revisions, limit) {
		// Sort revisions by date (latest first)
		revisions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
	
		// Keep all revisions or within the last X days
		let dtLimit = 0;
		if (limit) {
			if (limit instanceof Date) {
				dtLimit = limit;
			} else {
				dtLimit = new Date();
				dtLimit.setDate(dtLimit.getDate() - limit);
			}
		}
	
		const records = {};
	
		let limitReached = false;
		let futureRev = false; // revision in future
		let futureRecord = false; // record in future
		revisions.some(rev => {
			const dt = new Date(rev.timestamp);
	
			// now we can calculate size for the record in future
			if (futureRev) {
				const diffSize = futureRev.size - rev.size;
				if (diffSize > 0) {
					futureRecord.added += diffSize;
				} else {
					futureRecord.removed += Math.abs(diffSize);
				}
				futureRecord.edits++;
			}
	
			// date limit overflow, break
			if (futureRev && dt < dtLimit) {
				limitReached = true;
				return true; // break
			}
	
			// prepare record
			const day = rev.timestamp.split('T')[0];
			const key = `${day}:${rev.user}`;
			if (!records[key]) {
				records[key] = { day, user: rev.user, added: 0, removed: 0, edits: 0 };
			}
			const record = records[key];
			
			// save for next loop
			futureRev = rev;
			futureRecord = record;
		});
		// add for last record
		if (!limitReached) {
			futureRecord.added += futureRev.size;
			futureRecord.edits++;
			futureRecord.isNew = true;
		}
	
		// Convert records object to an array
		const recordsArray = Object.values(records);
	
		return recordsArray;
	}

	/** Find a winner record. */
	findWinner(records, bigEdit) {
		// check for the latest, big edit
		for (const record of records) {
			if (record.added >= bigEdit) {
				return {record, size:record.added};
			}
		}
		// check acumulated edits
		let biggestRecord;
		let biggestSize = 0;
		let size = 0;
		for (const record of records) {
			if (record.added > 0) {
				if (record.added > biggestSize) {
					biggestSize = record.added;
					biggestRecord = record;
				}
				size += record.added;
				if (size >= bigEdit) {
					return {record:biggestRecord, size};
				}
			}
		}
		return {record:false, size};
	}
}

module.exports = { RevisionList };
},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
/**
 * MW API call.
 * 
 * Assumes `data.error.info` is provided for API errors (like e.g. edit conflicts).
 * 
 * @param {Object} call Configuration object for `$.ajax`.
 * @returns jQuery promise.
 */
function apiAjax(call) {
	var deferred = $.Deferred();

	$.ajax(call)
		.done(function(data){
			if (data.error) {
				deferred.reject(data.error.info, data);
			}
			else {
				deferred.resolve(data);
			}
		})
		.fail(function(data){
			deferred.reject('$.ajax.fail()', data);
		})
	;

	return deferred.promise();
}

/**
 * MW API call.
 * 
 * Can be used with `await` (2018+ browsers).
 * 
 * @param {Object} call Configuration object for `$.ajax`.
 * @returns ES6 promise.
 */
function apiAsync(call) {
	return new Promise((resolve, reject) => {
		apiAjax(call)
			.done(function(data){
				resolve(data);
			})
			.fail(function(info, data){
				console.error(info, data);
				reject(info);
			})
		;
	})
}

module.exports = { apiAjax, apiAsync };

},{}],12:[function(require,module,exports){
let versionInfo = {
	version:'6.1.1',
	buildDay:'2024-01-31',
}

module.exports = { versionInfo };

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
const { DYKnomination, createDyk, createFullDyk } = require("./CzyWiesz");
const { DoneHandling } = require("./DoneHandling");

const namespaceNumber = mw.config.get('wgNamespaceNumber');
const pageName = mw.config.get('wgPageName');

// init in main namespace
if (namespaceNumber === 0) {
	createFullDyk(DYKnomination);
	// this can be used to e.g. setup debugmode
	mw.hook('userjs.DYKnomination.loaded').fire(DYKnomination);

	mw.loader.using(["mediawiki.util"]).then(function() {
		$(document).ready(function() {
			const link = mw.util.addPortletLink(
				'p-tb',
				'#',
				(window.DYKnomination_is_beta===true?'BETA: ':'') + DYKnomination.config.portlet_title,
				't-DYKnomination'
			);
			$(link).click((e) => {
				e.preventDefault();
				DYKnomination.askuser();
			}).attr('title', `Nominacje do WP:CW v${DYKnomination.about.version}`);
			mw.hook('userjs.DYKnomination.ready').fire(DYKnomination);
		});
	});
}
//insert current version number while on Wikipedia:Narzędzia/CzyWiesz
else if (pageName == 'Wikipedia:Narzędzia/CzyWiesz') {
	$('.DYKnomination-version').html(DYKnomination.about.version);
}

// zarządzanie propozycjami
if (pageName.indexOf('/propozycje') > 0) {
	createDyk(DYKnomination);
	// this can be used to e.g. setup debugmode
	mw.hook('userjs.DYKnomination.loaded').fire(DYKnomination);

	const doneHandling = new DoneHandling(pageName, DYKnomination);
	$(document).ready(function() {
		doneHandling.init();
	});
}

// expose to others
window.DYKnomination = DYKnomination;

},{"./CzyWiesz":1,"./DoneHandling":3}],15:[function(require,module,exports){
/* global OO */

/**
 * OOui dialogs in async flavour.
 * 
 * Usage (in async function):
 * if (await stdConfirm('<p>test?')) { console.log('confirmed') }
 */
function stdConfirm(html, isText) {
	const message = isText ? html : $('<div>'+html+'</div>');
	return new Promise((resolve) => {
		OO.ui.confirm(message).done(function (confirmed) {
			resolve(confirmed)
		});
	})
}

module.exports = { stdConfirm };
},{}],16:[function(require,module,exports){
/** Encode user string for JS. */
function htmlspecialchars(text) {
	return text.toString()
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;")
	;
}

module.exports = { htmlspecialchars };
},{}],17:[function(require,module,exports){
/**
 * ISO-like date interpreter.
 * 
 * Mostly for dates created like this:
 * {{licznik czasu|start={{subst:#timel:Y-m-d H:i:s}}|dni=...}}
 * 
 * @param {String} startDateString Y-m-d H:i:s or Y-m-dTH:i:s... or similar.
 * @param {Date} now (optional) Fake "now".
 * @returns Days since now or since dt.
 */
function timeCounter(startDateString, now) {
	if (!(now instanceof Date)) {
		now = new Date();
	}
	const d = startDateString.split(/[^0-9]+/).map(d=>parseInt(d,10));
	const startDate = new Date(d[0], d[1]-1, d[2], d[3], d[4], d[5]); // d[1] is month
	const diffInMs = now - startDate;
	const daysPassed = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	return daysPassed;
}

/**
 * End the counter tpl.
 * 
 * End the count now (today).
 * {{licznik czasu|start=2024-01-08 00:58:00|dni=30}}
 * 
 * @param {String} tpl The template call.
 * @param {Date} now (optional) Fake "now".
 */
function endCounter(tpl, now) {
	let body = tpl.replace('{{', '').replace('}}', '').trim();
	// remove days
	body = body.replace(/\| *dni *= *[0-9]+/, '');
	const nvalues = body.split(/ *\| */);
	let days = -1;
	// 0 is tpl name
	for (let i = 1; i < nvalues.length; i++) {
		const param = nvalues[i];
		const [name,val] = param.split(/ *= */);
		if (name == 'start') {
			days = timeCounter(val, now);
			break;
		}
	}
	if (days < 0) {
		return tpl;
	}
	return `{{${body}|dni=${days}}}`;
}

module.exports = { timeCounter, endCounter };

},{}]},{},[14]);
