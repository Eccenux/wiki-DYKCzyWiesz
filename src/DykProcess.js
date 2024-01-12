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

		// making content
		let input = `== [[${subpage}|${D.wgTitle}]] ==\n`
			+ '<!-- artykuł zgłoszony za pomocą gadżetu CzyWiesz -->\n'
			+ '{{licznik czasu|start={{subst:#timel:Y-m-d H:i:s}}|zdarzenie=Dyskusja|rgz=ż|dni=30}}\n'
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
					prependtext : '{' + '{Czy wiesz do artykułu|p=' + subpageTitle + '}' + '}\n',
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
		var secttitl_a,summary_a;

		if ( !Dv.authorInf ) {
			return;
		}

		try {
			secttitl_a = D.config.secttitl_a.replace('TITLE',D.wgTitle);
			summary_a = D.config.summary_a.replace('TITLE',D.wgTitle);
			await apiAsync({
				url : '/w/api.php',
				type : 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : (debug ? config.debugBase + '/autor' : 'Dyskusja wikipedysty:' + Dv.author),
					section : 'new',
					sectiontitle : secttitl_a,
					text : (debug ? "debug: '''" + Dv.author + "'''\n" : '') + '{' + '{subst:Czy wiesz - autor0|tytuł strony='+D.wgTitle+'}} ~~' + '~~',
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
		var summary_w,secttitl_w;

		if ( Dv.wikiproject.length == 0 ) {
			return;
		}
		else {
			secttitl_w = D.config.secttitl_w.replace('TITLE',D.wgTitle);
			summary_w = D.config.summary_w.replace('TITLE',D.wgTitle);
			var summary_w2 = D.config.summary_w2.replace('TITLE',D.wgTitle);
 
			// recursive inform loop
			for (let i = 0; i < Dv.wikiproject.length; i++) {
				const curWikiproject = Dv.wikiproject[i];
				try {
					await this.inform_wLoop(secttitl_w, summary_w, summary_w2, curWikiproject);
				} catch (error) {
					D.errors.push('Błąd informowania projektu: '+ curWikiproject + ': '+error.toString()+'.');
					D.errors.show();
					console.error('Błąd informowania projektu: '+ curWikiproject + ': '+error.toString()+'.');
					throw new Error(`Błąd informowania projektów (${i} / ${Dv.wikiproject.length}).`);
				}
				this.loadbar.next();
			}
		}
	}

	/** @private . */
	async inform_wLoop (secttitl_w, summary_w, summary_w2, curWikiproject) {
		var D = this.core;
		var debug = D.debugmode;
		
		var wnr = -1;
		//check if wikiproject wants to be informed other way than 'section=new'
		//(wnr=) -1 means 'no' (the wikiproject is not on the list D.wikiprojects.list2), any other number means 'yes' and is a number of the wikiproject in D.wikiprojects.list2
		$(D.wikiprojects.list2).each(function(n){
			if (this.label == curWikiproject) wnr=n;
		});
		D.log('D.wikiprojects.list2',D.wikiprojects.list2);

		var czy_talk;
		var pageToEdit;
		if (wnr<0) {
			pageToEdit = 'Wikiprojekt:'+curWikiproject;
		} else if (D.wikiprojects.list2[wnr].type=='talk') {
			pageToEdit = 'Dyskusja wikiprojektu:' + curWikiproject;
			czy_talk = true;
		} else {
			pageToEdit = D.wikiprojects.list2[wnr].page;
		}

		D.log('czy_talk:',czy_talk,'D.wikiprojects.list2[wnr]:',D.wikiprojects.list2[wnr],'curWikiproject:',curWikiproject,'pageToEdit:',pageToEdit);

		// force talk-page like flow so that we can edit single page multiple times
		if (debug) {
			czy_talk = true;
		}

		let mainCall;
		if (czy_talk) {
			//if report type is 'talk' (D.wikiprojects.list2[wnr].type=='talk' & czy_talk==true) just add new section
			mainCall = {
				url : '/w/api.php',
				type : 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : (debug ? config.debugBase + '/wikiprojekt' : pageToEdit),
					section : 'new',
					sectiontitle : (debug ? secttitl_w + ' • ' + curWikiproject : secttitl_w),
					text : (debug ? "debug: '''" + pageToEdit + "'''\n" : '') +  '{' + '{Czy wiesz - wikiprojekt|' + D.wgTitle + '}} ~~' + '~~',
					summary : summary_w,
					watchlist : 'nochange',
					token : D.edittoken
				}
			};
		}
		//if report type is not 'editsection' or 'subpage' then
		else {

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
			let dykSectionIndicator = '<!-- Nowe zgłoszenia CzyWiesza wstawiaj poniżej tej linii. Nie zmieniaj i nie usuwaj tej linii -->';
			if (!data.match(dykSectionIndicator)) {
				data = data.replace('[[Kategoria:','== Czy wiesz ==\n' + dykSectionIndicator + '\n\n[[Kategoria:');
			}
			data = data.replace(dykSectionIndicator,
				dykSectionIndicator + '\n'
				+ '{' + '{Czy wiesz - wikiprojekt|' + D.wgTitle + '}}');

			D.log('czy_talk (2):',czy_talk,'D.wikiprojects.list2[wnr] (2):',D.wikiprojects.list2[wnr],'curWikiproject (2):',curWikiproject,'pageToEdit (2):',pageToEdit);

			mainCall = {
				url : '/w/api.php',
				type : 'POST',
				data: {
					action: 'edit',
					format: 'json',
					title:  pageToEdit,
					text:   data,
					summary: summary_w2,
					watchlist: 'nochange',
					token:  D.edittoken
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
		$('<div id="CzyWieszSuccess"><div class="floatright">' + D.config.CWicon + '</div>'
			+ '<p style="margin-left: 10px;">Dziękujemy za <a id="CzyWieszLinkAfter" href="//pl.wikipedia.org/wiki/' 
			+ encodeURIComponent(subpageTitle) + '" class="czywiesz-external" target="_blank">zgłoszenie</a>.<br /><br />'
			+ 'Dla pewności możesz sprawdzić <a href="//pl.wikipedia.org/wiki/Specjalna:Wk%C5%82ad/'
			+ encodeURIComponent(Dv.signature)
			+ '" class="czywiesz-external" target="_blank">swój wkład</a> czy wszystko poszło zgodnie z planem.<br />'
			+ '<small><a class="CzyWieszEmailDoAutoraToggle">(Coś nie działa?)</a></small><br />'
			+ '<span class="CzyWieszEmailDoAutoraInfo" style="display:none;">Jeśli coś poszło nie tak to <a href="#" class="CzyWieszEmailDoAutoraWyslij">kliknij tutaj</a>, aby wysłać twórcy gadżetu e-mail z opisem błędu, a gadżet dołączy do niego szczegóły techniczne.<span class="CzyWieszEmailDoAutoraWyslano"></span><br /></span>'
			+ '<br />'
			+ '<a href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojekt Czy wiesz</a></p></div>')
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
		$('#CzyWieszSuccess a.CzyWieszEmailDoAutoraToggle').click( function() {
			$('#CzyWieszSuccess .CzyWieszEmailDoAutoraInfo').toggle();
		});
		$('#CzyWieszSuccess a.CzyWieszEmailDoAutoraWyslij').click( () => { D.emailauthor(); } );

		return true;
	}

}

module.exports = { DykProcess };
