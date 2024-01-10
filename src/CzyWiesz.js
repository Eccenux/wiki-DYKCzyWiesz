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

	const { DykProcess } = require("./DykProcess");
	const { DykForm } = require("./DykForm");
	const dykProcess = new DykProcess(DYKnomination);
	const dykForm = new DykForm(DYKnomination);

	/** Check form and continue with nomination. */
	DYKnomination.checkForm = function () {
		const invalid = dykForm.prepareValues();

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
			dykProcess.prepare();
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

	DYKnomination.emailauthor = async function () {
		var D = DYKnomination;

        var opis = prompt('Opisz co się stało. Bez tego twórca nie będzie wiedział co naprawiać.','');
        if (!opis) {
            alert('Nic nie wyślę twórcy, dopóki nie opiszesz błędu swoimi słowami. Bez Twojego opisu twórca nie będzie wiedział co naprawiać.');
            return;
        }
        D.log('DYKnomination.errors: ', D.errors); //add potential errors, before stringifying all logs
        var emailbody = opis + '\n\n' + JSON.stringify(D.logs);
		
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
