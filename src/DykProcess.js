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
		let tpl = `{{CW/weryfikacja
		| artykuł        = ${D.wgTitle}
		| przypisy       = ${Dv.refs}
		| ilustracje     = ${Dv.images}
		| 1. autorstwo   = ${Dv.author}
		| 2. autorstwo   = ${Dv.author2}
		| strona         = ${subpage}
		| akcja kod      = ${Dv.specialEvent.code}
		| akcja          = ${Dv.specialEvent.name}
		| nominacja      = ${Dv.signature}
		| status         = 
		| 1. sprawdzenie = 
		| 2. sprawdzenie = 
		| 3. sprawdzenie = 
		| 4. sprawdzenie = 
		}}`.replace(/\n\t+/g, '\n')
		let input = `== [[${subpage}|${D.wgTitle}]] ==\n`
			+ '<!-- artykuł zgłoszony za pomocą gadżetu CzyWiesz -->\n'
			+ `{{licznik czasu|start=${clockStart}|zdarzenie=Dyskusja|rgz=ż|dni=30|nie archiwizuj=tak}}\n`
			+ Dv.file         //FILE is already with \n at the end
			+ Dv.question     //QUESTION is already with \n at the end
			+ tpl + '\n'
			+ '<!--\n'
			+ '	Uwaga! Jeśli artykuł ma istotne błędy, to w CW/weryfikacja ustaw:\n'
			+ '	status = problemy \n'
			+ '-->\n'
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

	/** @private Inform author(s). */
	async inform_a () {
		var D = this.core;
		var Dv = this.values;
		var debug = D.debugmode;

		if ( !Dv.authorInf ) {
			return;
		}

		let subpageTitle = this.setupNominationPage();
		try {
			let sectionTitle_a = D.config.sectionTitle_a.replace('TITLE',D.wgTitle);
			let summary_a = D.config.summary_a.replace('TITLE',D.wgTitle);
			let text = `
					{{Czy wiesz - informacja o zgłoszeniu dla autora
					|tytuł strony = [[${D.wgTitle}]]
					|data = {{subst:#timel:Y-m-d}}
					|s = ${subpageTitle}
					}}
					Dziękujemy i prosimy o więcej, ~~~~
				`
				.trim()
				.replace(/[\r\n]+[ \t]+([|}])/g, ' $1')	// zwiń szablon
				.replace(/[\r\n]+[ \t]+/g, '\n')	// zwiń indent
			;
			const requestData = (author) => ({
				url : '/w/api.php',
				type : 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : (debug ? config.debugBase + '/autor' : 'Dyskusja wikipedysty:' + author),
					section : 'new',
					sectiontitle : sectionTitle_a,
					text : (debug ? "debug: '''" + author + "'''\n" : '') + text,
					summary : summary_a,
					watchlist : 'nochange',
					token : D.edittoken
				},
			});
			if (Dv.author.length > 1) {
				await apiAsync(requestData(Dv.author));
			}
			if (Dv.author2.length > 1) {
				await apiAsync(requestData(Dv.author2));
			}
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
