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

/** About (meta). */
DYKnomination.about = {
	version    : '6.0.0' + (window.DYKnomination_is_beta===true?'beta':''),
	beta	   : (window.DYKnomination_is_beta===true?true:false),
	author     : 'Kaligula',
	authorlink : '[[w:pl:user:Kaligula]]',
	homepage   : '[[w:pl:Wikipedia:Narzędzia/CzyWiesz]]',
	credits    : 'Matma Rex (for HUGE help), Tomasz Wachowski (for testing)'
}

/** Init the DYK object. */
function createFullDyk(DYKnomination) {
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

	/**
	 * List of wikiprojects.
	 */
	DYKnomination.wikiprojects = {
		list :  [], // populated on askuser() from [[Wikipedia:Wikiprojekt/Spis wikiprojektów]] by DYKnomination.wikiprojects.load() (see below)
		list2 : [   /*****
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
			],
		load : function () {
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
			);
		}
	};

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

	DYKnomination.debug = function () {
		DYKnomination.debugmode = true;
		DYKnomination.askuser();
	};


	DYKnomination.strToRegExp = function (str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}
	
	DYKnomination.values = {};

	/** Check form and continue with nomination. */
	DYKnomination.checkForm = function () {
		const invalid = this.prepareValues();

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
			this.prepare();
		}
	};

	DYKnomination.task = -1;
	DYKnomination.loadbar = function (task) {

		var D = DYKnomination;
		if (task == false) {
			D.task = -1;
			return;
		}
		else if (typeof task == 'undefined'){
			D.task++;
			task = Math.min(D.task,4);
		}
		var tasks = D.tasks;
		
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

	};

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

	/** Prepare nomination. */
	DYKnomination.prepare = async function () {
		var Dv = this.values;

		// clear errors
		this.errors.clear();

		// main tasks count
		this.tasks = 4 + Dv.wikiproject.length + (Dv.authorInf?1:0);

		// init progress
		this.loadbar();

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
			await this.getEditToken(false);
			await this.runNominate();
		}
	}

	/** Setup or read name for the nomination page. */
	DYKnomination.setupNominationPage = function () {
		var Dv = this.values;

		if (!Dv.nominationDate) {
			Dv.nominationDate = new Date();
		}
		Dv.nominationPage = this.getNominationPage(Dv.nominationDate, this.wgTitle);

		return Dv.nominationPage;
	}

	/** Check for active nominations and nominations this month. */
	DYKnomination.checkNominationExists = async function () {

		// search existing sections on nomination page
		let data = await apiAsync({
			url: '/w/api.php?action=parse&format=json&page=' + encodeURIComponent(this.getBaseNew()) + '&prop=sections',
			cache: false
		});
		let sections = data.parse.sections;
		this.log('Sekcje na stronie nominacji:', sections);
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
	};

	DYKnomination.runNominate = async function () {

		var D = DYKnomination;
		var Dv = D.values;

		// make summary
		let subpage = D.setupNominationPage();
		let summary = D.config.summary.replace('TITLE', `[[${subpage}|${D.wgTitle}]]`);

		/* making data ready */
		D.loadbar();

		// making content
		let input = `== [[${subpage}|${D.wgTitle}]] ==\n`
			+ '<!-- artykuł zgłoszony za pomocą gadżetu CzyWiesz -->\n'
			+ '{{licznik czasu|start={{subst:#timel:Y-m-d H:i:s}}|dni=30}}\n'
			+ Dv.file         //FILE is already with \n at the end
			+ Dv.question     //QUESTION is already with \n at the end
			+ '{' + '{Wikiprojekt:Czy wiesz/weryfikacja|' + D.wgTitle + '|' + Dv.refs + '|' + Dv.images + '|' + Dv.author + '|' + Dv.signature + '|?|?|?}}\n'
			+ (Dv.comment ? Dv.comment + ' ' : '') + '~~' + '~~'
		;

		D.log('input:',input);

		await D.createNomination(input, summary);
		await D.inform_r();
		await D.inform_a();
		await D.inform_w();

		D.success();
	};

	/* Add nomination. */
	DYKnomination.createNomination = async function (input, summary) {

		var D = DYKnomination;
		var Dv = D.values;
		
		D.log('DYKnomination.values:',Dv);

		D.loadbar();

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
			D.loadbar();

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
	};

	/**
	 * Inform readers.
	 * 
	 * Inserts a template to the nominated article.
	 * 
	 * @returns Promise.
	 */
	DYKnomination.inform_r = async function () {
 
		var D = DYKnomination;
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
	};

	/** Inform author. */
	DYKnomination.inform_a = async function () {
		var D = DYKnomination;
		var Dv = D.values;
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

	};

	/** Inform wikiprojects. */
	DYKnomination.inform_w = async function () {
		var D = DYKnomination;
		var Dv = D.values;
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
					await D.inform_wLoop(secttitl_w, summary_w, summary_w2, curWikiproject);
				} catch (error) {
					D.errors.push('Błąd informowania projektu: '+ curWikiproject + ': '+error.toString()+'.');
					D.errors.show();
					console.error('Błąd informowania projektu: '+ curWikiproject + ': '+error.toString()+'.');
					throw new Error(`Błąd informowania projektów (${i} / ${Dv.wikiproject.length}).`);
				}
				D.loadbar();
			}
		}
	};

	DYKnomination.inform_wLoop = async function (secttitl_w, summary_w, summary_w2, curWikiproject) {
		var D = DYKnomination;
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
	};

	/** Finalize nomination (might actually show errors if there were any). */
	DYKnomination.success = function () {
		var D = DYKnomination;
		var Dv = D.values;

		if (!D.errors.isEmpty()) {
			D.errors.show();
			return false;
		}

		D.loadbar('done');
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
	};

	DYKnomination.emailauthor = async function () {
		var D = DYKnomination;

        var opis = prompt('Opisz co się stało. Bez tego twórca nie będzie wiedział co naprawiać.','');
        if (!opis) {
            alert('Nic nie wyślę twórcy, dopóki nie opiszesz błędu swoimi słowami. Bez Twojego opisu twórca nie będzie wiedział co naprawiać.');
            return;
        }
        D.log('DYKnomination.errors: ', D.errors); //add potential errors, before stringifying all logs
        var emailbody = opis + '\n\n' + JSON.stringify(DYKnomination.logs);
		
		//throbber and cursor-wait – until e-mail sent
		$('.CzyWieszEmailDoAutoraWyslano').html('<img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Denken.gif" width="10" height="10">');
		$('#CzyWieszErrorDialog, #CzyWieszSuccess').addClass('wait-im-sending-email');

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
				$('.CzyWieszEmailDoAutoraWyslano').text(' Wysłano!');
			})
			.catch(function(info){
				D.errors.push(`Błąd wysyłania e-maila do twórcy: ${info}.`);
				D.errors.show();
				console.error('Błąd wysyłania e-maila do twórcy: ', info);
			})
		;
	};

	/**
	 * @type {ErrorInfo}
	 */
	DYKnomination.errors = new ErrorInfo(DYKnomination.emailauthor, config.supportUser);
}

module.exports = { createFullDyk, DYKnomination };
