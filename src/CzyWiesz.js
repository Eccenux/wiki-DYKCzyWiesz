// DEBUG: po wpisaniu w konsoli "DYKnomination.debug()" skrypt uruchomi siÄ™
// w trybie debug, tzn. aktulane info pokaÅ¼Ä… siÄ™ w konsoli JS a zgÅ‚oszenie
// pÃ³jdzie nie na stronÄ™ [[Wikiprojekt:Czy wiesz/propozycje]] ale na testowÄ…
// [[Wikipedysta:Kaligula/js/CzyWiesz.js/test]], a informowanie autora
// i wikiprojektÃ³w â€“ na odpowiednich stronach "â€¦/autor" i "â€¦/wikiprojekt"

// Wersja dev skryptu:
//  https://pl.wikipedia.org/wiki/Wikipedysta:Kaligula/js/CzyWiesz.js

window.DYKnomination = {
	about : {
		version    : '5.3.1',
		author     : 'Kaligula',
		authorlink : '[[w:pl:user:Kaligula]]',
		homepage   : '[[w:pl:Wikipedia:NarzÄ™dzia/CzyWiesz]]',
		credits    : 'Tomasz Wachowski, Matma Rex'
	}
};

if (wgNamespaceNumber === 0) {



	DYKnomination.config = {
		interp:		'.,:;!?â€¦-â€“â€”()[]{}âŸ¨âŸ©\'"â€žâ€Â«Â»/\\', // [\s] must be added directly!; ['] & [\] escaped due to js limits, [\s] means [space]
		miesiacArr:	['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'wrzeÅ›nia', 'paÅºdziernika', 'listopada', 'grudnia'],
		// â†“ summary template for nomination
		summary:	'/* NR (TITLE) */ nowe zgÅ‚oszenie za pomocÄ… [[Wikipedia:NarzÄ™dzia/CzyWiesz|gadÅ¼etu CzyWiesz]]',
		// â†“ summary for template in the article
		summary_r:	'ArtykuÅ‚ ten zostaÅ‚ zgÅ‚oszony do umieszczenia na [[Wikipedia:Strona gÅ‚Ã³wna|stronie gÅ‚Ã³wnej]] w rubryce â€ž[[Szablon:Czy wiesz|Czy wiesz]]â€ za pomocÄ… [[Wikipedia:NarzÄ™dzia/CzyWiesz|gadÅ¼etu CzyWiesz]]',
		// â†“ summary for template on author's talk page
		summary_a:	'/* Czy wiesz â€“ [[TITLE]] */ nowe zgÅ‚oszenie za pomocÄ… [[Wikipedia:NarzÄ™dzia/CzyWiesz|gadÅ¼etu CzyWiesz]]',
		// â†“ sectiontitle for template on author's talk page
		secttitl_a: 'Czy wiesz â€“ [[TITLE]]',
		// â†“ summary for template in wikiprojects' pages/talk pages
		summary_w:	'/* Czy wiesz â€“ [[TITLE]] */ nowe zgÅ‚oszenie za pomocÄ… [[Wikipedia:NarzÄ™dzia/CzyWiesz|gadÅ¼etu CzyWiesz]]',
		// â†“ sectiontitle for template in wikiprojects' pages/talk pages
		secttitl_w: 'Czy wiesz â€“ [[TITLE]]',
		// â†“ style for this gadget
		styletag:	$('<style id="CzyWieszStyleTag">' 
						+ '.wikiEditor-toolbar-dialog .czy-wiesz-gallery-chosen { border: solid 2px red; }\n' 
						+ '#CzyWieszWikiprojectAdd {cursor: pointer; }\n'
						+ '#CzyWieszGalleryToggler a, #CzyWieszLinkAfter, #CzyWieszRefs a, #CzyWieszErrorDialog a { '
							+ 'color: #0645AD; text-decoration: underline; cursor: pointer; padding-right: 13px; '
							+ 'background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVklEQVR4Xn3PgQkAMQhDUXfqTu7kTtkpd5RA8AInfArtQ2'
							+ 'iRXFWT2QedAfttj2FsPIOE1eCOlEuoWWjgzYaB/IkeGOrxXhqB+uA9Bfcm0lAZuh+YIeAD+cAqSz4kCMUAAAAASUVORK5CYII=) center right no-repeat; '
							+ 'background: url(//bits.wikimedia.org/static-1.21wmf3/skins/vector/images/external-link-ltr-icon.png) center right no-repeat!ie; }'
					+ '</style>'),
		// â†“ [[File:Crystal Clear app clean.png]] (20px) [2012-11-20]
		yes:		'<img alt="Crystal Clear app clean.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/20px-Crystal_Clear_app_clean.png" width="20" height="20">',
		// â†“ [[File:Crystal Clear action button cancel.png]] (20px) [2012-11-20]
		no:			'<img alt="Crystal Clear action button cancel.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/20px-Crystal_Clear_action_button_cancel.png" width="20" height="20">',
		// â†“ [[File:PL Wiki CzyWiesz ikona.svg]] (80px) [2012-11-20]
		CWicon:		'<img alt="PL Wiki CzyWiesz ikona.svg" src="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/80px-PL_Wiki_CzyWiesz_ikona.svg.png" width="80" height="80" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/120px-PL_Wiki_CzyWiesz_ikona.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/160px-PL_Wiki_CzyWiesz_ikona.svg.png 2x">',
		// â†“ = {{zaÅ‚atwione}} [2012-11-20]
		tmpldone:	'<span class="template-done"><img alt="Crystal Clear app clean.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/20px-Crystal_Clear_app_clean.png" width="20" height="20" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/30px-Crystal_Clear_app_clean.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/40px-Crystal_Clear_app_clean.png 2x"><span style="display:none">T</span> <b>ZaÅ‚atwione</b></span>',
		// â†“ = {{niezaÅ‚atwione}} [2012-11-20]
		tmplndone:	'<span class="template-not-done"><img alt="Crystal Clear action button cancel.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/20px-Crystal_Clear_action_button_cancel.png" width="20" height="20" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/30px-Crystal_Clear_action_button_cancel.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/40px-Crystal_Clear_action_button_cancel.png 2x"><span style="display:none">N</span> <b>NiezaÅ‚atwione</b></span>'
	}

	/**
	 * List of wikiprojects
	 * updated 19:48, 12 wrz 2013 from https://pl.wikipedia.org/w/index.php?title=Wikipedia:Wikiprojekt&oldid=37479771
	 */
	DYKnomination.wikiprojects = {
		counter : 1,
		list : ['Albumy muzyczne',
			'Anarchizm',
			'Antropologia',
			'Architektura',
			'Astronautyka',
			'Astronomia',
			'Baseball',
			'BiaÅ‚ystok',
			'Biblia',
			'BieÅ¼Ä…ce wydarzenia',
			'Biografie',
			'Biologia',
			'Bitwy',
			'Botanika',
			'Bydgoszcz',
			'Chemia',
			'Chiny',
			'ChrzeÅ›cijaÅ„stwo',
			'Cmentarze Å¼ydowskie w Polsce',
			'Czechy',
			'CzÄ™stochowa',
			'Dinozaury',
			'Dolny ÅšlÄ…sk',
			'Drogi i autostrady',
			'Dyskografie',
			'Dzielnice Krakowa',
			'Ekonomia',
			'Elektronika',
			'Entomologia',
			'Euro 2012',
			'Eurowizja',
			'Fantastyka',
			'Filmy',
			'Filozofia',
			'Fizyka',
			'FormuÅ‚a 1',
			'Francja',
			'Futbol amerykaÅ„ski',
			'GdaÅ„sk',
			'Gender Studies',
			'Genetyka i biologia molekularna',
			'Geografia',
			'GÃ³rny ÅšlÄ…sk',
			'GÃ³ry Polski',
			'Gry komputerowe',
			'Gwiezdne wrota',
			'Harcerstwo',
			'Harry Potter',
			'Heavy metal',
			'Herby',
			'Hinduizm',
			'Hip-Hop',
			'Historia',
			'Holandia',
			'Igrzyska olimpijskie',
			'Igrzyska WspÃ³lnoty NarodÃ³w',
			'Imiona',
			'Informatyka',
			'Irlandia',
			'Islam',
			'Izrael',
			'Japonia',
			'Kluby sportowe',
			'Kolarstwo',
			'Kompozytorzy',
			'Konflikty wspÃ³Å‚czesne',
			'Korea',
			'KoszykÃ³wka',
			'KrakÃ³w',
			'Kynologia',
			'Lekkoatletyka',
			'LGBT',
			'Linie lotnicze',
			'Linux',
			'Literatura',
			'Literaturoznawstwo',
			'Lotnictwo',
			'ÅÃ³dÅº',
			'Malarstwo',
			'Matematyka',
			'Meblarstwo',
			'Mikrobiologia',
			'Militaria',
			'MineraÅ‚y',
			'Mistrzostwa Åšwiata w PiÅ‚ce NoÅ¼nej 2014',
			'Mitologia grecka',
			'Mitologia rzymska',
			'Mitologia sÅ‚owiaÅ„ska',
			'Motoryzacja',
			'Muzyka i muzykologia',
			'Muzyka powaÅ¼na',
			'Mykologia',
			'National Basketball Association',
			'Nauki medyczne',
			'Nauru',
			'Nazwiska',
			'Niemcy',
			'Nowy SÄ…cz',
			'Numizmatyka',
			'Ochrona przyrody',
			'Olsztyn',
			'Opis polskich wsi i gmin',
			'Paleontologia',
			'Pallotyni',
			'PaÅ„stwa Å›wiata',
			'Petanque',
			'Piastowie',
			'PiÅ‚ka noÅ¼na',
			'PiÅ‚ka siatkowa',
			'Podlaskie',
			'PokÃ©mon',
			'Polityka',
			'Powiat radomski',
			'Powiat szydÅ‚owiecki',
			'Powiat wrzesiÅ„ski',
			'PoznaÅ„',
			'Prawo',
			'Programy telewizyjne',
			'Przeworsk',
			'Psychologia',
			'RacibÃ³rz',
			'Radio',
			'Religioznawstwo',
			'Rock progresywny',
			'Rosja',
			'Saska KÄ™pa w Wikipedii',
			'Seksuologia',
			'Seriale telewizyjne',
			'Skoki narciarskie',
			'SÅ‚owacja',
			'Snooker',
			'Socjologia',
			'Sport',
			'Sporty motorowe',
			'Sporty zimowe',
			'SpÃ³Å‚dzielczoÅ›Ä‡',
			'Stany Zjednoczone',
			'StaroÅ¼ytnoÅ›Ä‡',
			'Stosunki polsko-ukraiÅ„skie',
			'Synagogi w Polsce',
			'SzkoÅ‚a austriacka (ekonomia)',
			'Sztuka wspÃ³Å‚czesna',
			'ÅšrÃ³dziemie',
			'Åšredniowiecze',
			'Technika',
			'Telefony komÃ³rkowe',
			'Tenis ziemny',
			'Transport',
			'Transport szynowy',
			'Turystyka',
			'Tybet',
			'U-Boot',
			'Ukraina',
			'Unia Europejska',
			'Warhammer',
			'Warszawa',
			'Wawel',
			'Wielka Brytania',
			'WojewÃ³dztwo Å›wiÄ™tokrzyskie',
			'WojewÃ³dztwo warmiÅ„sko-mazurskie',
			'Wrestling',
			'Wspinaczka',
			'XML',
			'Zoologia',
			'Å»egluga',
			'Å»uÅ¼el',
			'Å»ycie codzienne'],
		list2 : [
			// these wikiprojects want to be informed via their subpage
			{
				label : 'Biologia',
				page  : 'Wikiprojekt:Biologia/Czy wiesz',
				type  : 'subpage'
			},
			{
				label : 'Warszawa',
				page  : 'Wikiprojekt:Warszawa/Czy wiesz',
				type  : 'subpage'
			},
			// these wikiprojects want to be informed via their talk page
			{
				label : 'Astronomia',
				page  : 'Dyskusja wikiprojektu:Astronomia',
				type  : 'talk',
			},
			{
				label : 'Bitwy',
				page  : 'Dyskusja wikiprojektu:Bitwy',
				type  : 'talk',
			},
			{
				label : 'Botanika',
				page  : 'Dyskusja wikiprojektu:Botanika',
				type  : 'talk',
			},
			{
				label : 'Chemia',
				page  : 'Dyskusja wikiprojektu:Chemia',
				type  : 'talk',
			},
			{
				label : 'ChrzeÅ›cijaÅ„stwo',
				page  : 'Dyskusja wikiprojektu:ChrzeÅ›cijaÅ„stwo',
				type  : 'talk',
			},
			{
				label : 'Dyskografie',
				page  : 'Dyskusja wikiprojektu:Dyskografie',
				type  : 'talk',
			},
			{
				label : 'Filmy',
				page  : 'Dyskusja wikiprojektu:Filmy',
				type  : 'talk',
			},
			{
				label : 'FormuÅ‚a 1',
				page  : 'Dyskusja wikiprojektu:FormuÅ‚a 1',
				type  : 'talk',
			},
			{
				label : 'GÃ³ry Polski',
				page  : 'Dyskusja wikiprojektu:GÃ³ry Polski',
				type  : 'talk',
			},
			{
				label : 'Gry komputerowe',
				page  : 'Dyskusja wikiprojektu:Gry komputerowe',
				type  : 'talk',
			},
			{
				label : 'Irlandia',
				page  : 'Dyskusja wikiprojektu:Irlandia',
				type  : 'talk',
			},
			{
				label : 'Japonia',
				page  : 'Dyskusja wikiprojektu:Japonia',
				type  : 'talk',
			},
			{
				label : 'KoszykÃ³wka',
				page  : 'Dyskusja wikiprojektu:KoszykÃ³wka',
				type  : 'talk',
			},
			{
				label : 'Lekkoatletyka',
				page  : 'Dyskusja wikiprojektu:Lekkoatletyka',
				type  : 'talk',
			},
			{
				label : 'LGBT',
				page  : 'Dyskusja wikiprojektu:LGBT',
				type  : 'talk',
			},
			{
				label : 'Militaria',
				page  : 'Dyskusja wikiprojektu:Militaria',
				type  : 'talk',
			},
			{
				label : 'Muzyka i muzykologia',
				page  : 'Dyskusja wikiprojektu:Muzyka i muzykologia',
				type  : 'talk',
			},
			{
				label : 'Nowy SÄ…cz',
				page  : 'Dyskusja wikiprojektu:Nowy SÄ…cz',
				type  : 'talk',
			},
			{
				label : 'Prawo',
				page  : 'Dyskusja wikiprojektu:Prawo',
				type  : 'talk',
			},
			{
				label : 'Seriale telewizyjne',
				page  : 'Dyskusja wikiprojektu:Seriale telewizyjne',
				type  : 'talk',
			},
			{
				label : 'Skoki narciarskie',
				page  : 'Dyskusja wikiprojektu:Skoki narciarskie',
				type  : 'talk',
			},
			{
				label : 'SÅ‚owacja',
				page  : 'Dyskusja wikiprojektu:SÅ‚owacja',
				type  : 'talk',
			},
			{
				label : 'ÅšrÃ³dziemie',
				page  : 'Dyskusja wikiprojektu:ÅšrÃ³dziemie',
				type  : 'talk',
			},
			{
				label : 'Å»uÅ¼el',
				page  : 'Dyskusja wikiprojektu:Å»uÅ¼el',
				type  : 'talk',
			}
		]
	}

	DYKnomination.errors = [function (){
		var D = DYKnomination;
		var dialog = $('<ul></ul>');
		for (var i=1;i<D.errors.length;i++) {
			dialog.append( $('<li></li>').html(D.errors[i]) );
		}
		dialog = $('<div id="CzyWieszErrorDialog"></div>').append(dialog).append( $('<p>WiÄ™cej informacji w konsoli przeglÄ…darki.</p>') );
		
		dialog.dialog({
		  width: 400,
		  modal: true,
		  title: 'WystÄ…piÅ‚ bÅ‚Ä…d',
		  draggable: true,
		  dialogClass: "wikiEditor-toolbar-dialog",
		  close: function() { $(this).dialog("destroy"); $(this).remove();}
		});
	}];

	DYKnomination.log = function (permission){
		//omit (i-1) first argument which is a permission
		if( permission && typeof(console) !== 'undefined' ) for(i=1;i<arguments.length;console.log(arguments[i]),i++);
	}

	DYKnomination.debugmode = false;

	DYKnomination.debug = function () {
		DYKnomination.debugmode = true;
		DYKnomination.askuser();
	}

	DYKnomination.askuser = function () {

		var D = DYKnomination;
		var debug = D.debugmode;
		if (D.errors.length > 1) { D.errors = [D.errors[0]]; }
		D.log(debug,D);

		var IMG_ARR = $.merge($('#mw-content-text .infobox a.image img'),$('#mw-content-text .thumb a.image img'));
		var IMAGES = IMG_ARR.length;
		var REFS = {
			warn:	D.config.no + '&nbsp;&nbsp;<strong style="color: red;">Brak ÅºrÃ³deÅ‚ dyskwalifikuje artykuÅ‚ ze zgÅ‚oszenia!!</strong> <small>(<a class="external">info</a>)</small>',
			ar1:	[''],
			ar2:	['Bibliografia','Przypisy']
		}
			$('.mw-headline').each(function(i){
				REFS.ar1.push( $(this).html().replace(/<span class="mw-headline-number"[^>]*>\d+<\/span> */,'') );
			});
			REFS.ar1 = REFS.ar1.join('#') + '#';
			D.sourced = false;
			for (var i=0; i < REFS.ar2.length; i++) {
				if ( REFS.ar1.match('#' + REFS.ar2[i] + '#') ) {D.sourced = true; break;}
			}
		var SIGNATURE = (wgUserName ? {name: wgUserName, disabled: ' disabled'} : {name: '~~' + '~', disabled: ' disabled'} );

		//workaround for Opera - the textarea must be inserted to a visible element

		var $title_paragraph = $('<p></p>')
			.html('TytuÅ‚ artykuÅ‚u: &nbsp;&nbsp;<input type="text" id="CzyWieszTitle" name="CzyWieszTitle" value="' + wgTitle + '" style="width: 476px;" disabled>');

		var $question_paragraph = $('<p><strong>Zaproponuj pytanie:</strong></p>');
		var $question_textarea_paragraph = $('<p></p>')
			.html('<textarea id="CzyWieszQuestion" style="width: 570px;" rows="2" value="" autofocus></textarea>');

		var $ref_row = $('<tr id="CzyWieszRefs"></tr>')
			.html('<td>Å¹rÃ³dÅ‚a: </td>'
				+ '<td>' + ( D.sourced ? D.config.yes : REFS.warn ) + '</td>');
			if (D.sourced) {
				$ref_row.css({display: 'none'});
			}

		var $images_row = $('<tr></tr>')
			.html('<td>Liczba grafik w artykule: </td>'
				+ '<td><input type="text" id="CzyWieszImages" name="CzyWieszImages" value="' + IMAGES + '"' 
				+ 'style="width: 8%;text-align: right;margin-left: 2px;">'
				+ '<span id="CzyWieszGalleryToggler" style="display: none;"> &nbsp;<small>(<a class="external">zaproponuj grafikÄ™ z artykuÅ‚u</a>)</small></span>');

		var $file_row = $('<tr></tr>')
			.html('<td style="width: 28%;"><input type="checkbox" id="CzyWieszFile1" name="CzyWieszFile1" style="vertical-align: middle;"> Zaproponuj grafikÄ™: </td>' // style="width: 36%;
				+ '<td><tt>[[Plik:</tt><input type="text" id="CzyWieszFile2" name="CzyWieszFile2" style="width: 52%; vertical-align: middle;" disabled><tt>|100px|right]]</tt></td>');

		//author row
		var $author_row = $('<tr></tr>')
			.html('<td>GÅ‚Ã³wny autor artykuÅ‚u: </td>'
				+ '<td><input type="text" id="CzyWieszAuthor" name="CzyWieszAuthor" style="width: 50%;margin-left: 2px;vertical-align: middle;">'
				+ '&nbsp;&nbsp;<input type="checkbox" id="CzyWieszAuthorInf" name="CzyWieszAuthorInf" style="vertical-align: middle;">poinformuj go</td>');

		D.author2_input = $('<input type="text" class="CzyWieszAuthor2" name="CzyWieszAuthor2" style="width: 50%;margin-left: 2px;vertical-align: middle;">');
		var $author2_row = $('<span id="CzyWieszAuthor2Container"></span>').append(D.author2_input.clone());
		$author2_row = $('<td></td>').append($author2_row)
			.append('<a id="CzyWieszAuthor2Add">(+)</a>');
		$author2_row = $('<tr id="CzyWieszAuthor2" style="display: none;" title="Dodaj *tylko* jeÅ›li jego wkÅ‚ad w obecnÄ… rozbudowÄ™ artykuÅ‚u byÅ‚ rÃ³wnie duÅ¼y jak autora podanego powyÅ¼ej!"></tr>').append('<td>Kolejny autor: </td>').append($author2_row);

		var $date_row = $('<tr></tr>')
			.html('<td>Data utw./rozbud. artykuÅ‚u: </td>'
				+ '<td><input type="text" id="CzyWieszDate" name="CzyWieszDate" style="width: 50%;margin-left: 2px;vertical-align: middle;"></td>');

		var $signature_row = $('<tr></tr>')
			.html('<td>TwÃ³j podpis: </td>'
				+ '<td><input type="text" id="CzyWieszSignature" name="CzyWieszSignature" value="' 
				+ SIGNATURE.name + '" style="width: 50%;margin-left: 2px;"' + SIGNATURE.disabled + '></td>');

		//wikiproject row
		D.wikiproject_select = $('<select class="czywiesz-wikiproject"></select>').css('vertical-align', 'middle');
		D.wikiproject_select.append('<option value="none">-- (Å¼aden) --</option>');
		for (var i=0;i<D.wikiprojects.list.length;i++) {
			if (typeof(D.wikiprojects.list[i]) == 'function') continue; //on IE wikibits adds indexOf method for arrays. skip it.
			$('<option value="' + i + '">' + D.wikiprojects.list[i] + '</option>').appendTo(D.wikiproject_select);
		}
		var $wikiproject_row = $('<span id="CzyWieszWikiprojectContainer"></span>').append(D.wikiproject_select.clone());
		$wikiproject_row = $('<td></td>').append($wikiproject_row)
			.append('<a id="CzyWieszWikiprojectAdd">(+)</a>');
		$wikiproject_row = $('<tr></tr>').append('<td>Powiadom wikiprojekt(y): </td>').append($wikiproject_row);
 
		var $comment_paragraph = $('<p><input type="checkbox" id="CzyWieszCommentCheckbox" name="CzyWieszCommentCheckbox" style="vertical-align: middle;">Potrzebujesz zamieÅ›ciÄ‡ dodatkowy komentarz?</p>');
		var $comment_textarea_paragraph = $('<p id="CzyWieszCommentContainer" style="display: none;"></p>')
			.html('<textarea id="CzyWieszComment" style="width: 570px;" rows="2" value=""></textarea>');

		//rules paragraph
		var $rules_paragraph = $('<p id="CzyWieszRules"></p>')
			.html('<small>ZgÅ‚aszaj hasÅ‚a nie pÃ³Åºniej niÅ¼ 10 dni od powstania lub rozbudowania hasÅ‚a, '
				+ 'posiadajÄ…ce ÅºrÃ³dÅ‚a najlepiej w formie przypisÃ³w i zawierajÄ…ce co najmniej 2 kB samej treÅ›ci.</small>')
			.css({border: '1px solid #F0F080', backgroundColor: '#FFFFE0', paddingLeft: '5px'});
 
		var $loading_bar = $('<div id="CzyWieszLoaderBar"></div>')
			.css({width: '100%', backgroundColor: 'rgb(220, 220, 220)', border: '1px solid rgb(187, 187, 187)', borderRadius: '3px'})
			.html('<p id="CzyWieszLoaderBarParagraph" style="margin: 0 0 0 7px; position: absolute;">&nbsp;</p>'
				+ '<div id="CzyWieszLoaderBarInner" style="width: 0; height: 20px; background-color: #ABEC46; border: none; border-radius: 3px;"></div>');

		//build the dialog
		var $dialog = $('<table></table>').css('width','100%').append($ref_row).append($images_row).append($file_row)
			.append($author_row).append($author2_row).append($date_row).append($signature_row).append($wikiproject_row);
		var $dialog = $('<div id="CzyWieszGadget"></div>').append($title_paragraph).append($question_paragraph).append($question_textarea_paragraph)
			.append($dialog).append($comment_paragraph).append($comment_textarea_paragraph).append($rules_paragraph).append($loading_bar);
 
		//main buttons
		var buttons = {
			"ZgÅ‚oÅ›": function() {
				if (D.sourced) {
					D.checkForm();
				}
				else {
					alert('ArtykuÅ‚ bez ÅºrÃ³deÅ‚ jest zdyskwalifikowany z nominacji. (JeÅ›li ÅºrÃ³dÅ‚a sÄ… to zwrÃ³Ä‡ uwagÄ™ czy tytuÅ‚ sekcji jest prawidÅ‚owy, tzn. â€žPrzypisyâ€ lub â€žBibliografiaâ€.)');
				}
			},
			"Anuluj" : function() {
				$(this).dialog("close");
			}
		};
 
		$dialog.dialog({
		  width: 600,
		  modal: true,
		  title: 'ZgÅ‚aszanie artykuÅ‚u do rubryki â€žCzy wieszâ€¦â€' + (debug ? ' &nbsp; (<small id="CzyWieszDialogDebug" style="color: red;">TRYB DEBUG</small>)' : ''),
		  draggable: true,
		  dialogClass: "wikiEditor-toolbar-dialog",
		  close: function() { $(this).dialog("destroy"); $(this).remove();},
		  buttons: buttons
		});

		// autofill today's date
		$('#CzyWieszDate').val(function(){
			var a = new Date();
			var y = a.getFullYear();
			var m = a.getMonth()+1; m=(m<10?'0'+m:m);
			var d = a.getDate();    d=(d<10?'0'+d:d);
			str = y + '-' + m + '-' + d;
			return str;
		});

		// check size of article and make a tip for the possible author
		D.pagerevs();
		
		if ($('#CzyWieszStyleTag').length == 0) {
			D.config.styletag.appendTo('head');
		}

		// when user ticks he wants to nominate with picture â†’ enable picture/file field
		$('#CzyWieszFile1').change(function(){
			var a=$('#CzyWieszFile2');
			(a.attr('disabled') ? a.removeAttr('disabled') : a.attr('disabled','true'));
		});

		// if there are images in article â†’ add link to small gallery to quickly choose an image from article
		if (IMAGES > 0) {
			$('#CzyWieszGalleryToggler').toggle();
			$('#CzyWieszGalleryToggler a').click(function(){
				var GALLERY = '<div id="CzyWieszGalleryHolder">'
						+ '<div id="CzyWieszGallery" style="background-color: #F2F5F7;">'
						+ '<table><tbody>';
						for (var i=0; i<IMG_ARR.length; i++) {
							if (i%5 == 0) {GALLERY += '<tr>';}
							GALLERY += '<td>';
							GALLERY += IMG_ARR[i].outerHTML.replace(/ width=\"\d+\"/,' width="100"').replace(/ height=\"[^\"]*\"/,'').replace(/ class=\"[^\"]*\"/g,'');
							GALLERY += '</td>';
							if (i%5 == 4) {GALLERY += '</tr>';}
						}
				GALLERY	+= '</tbody></table> </div> </div>';

				$(GALLERY).dialog({
					width: 547,
					modal: true,
					title: 'Wybierz grafikÄ™:',
					draggable: true,
					dialogClass: "wikiEditor-toolbar-dialog",
					close: function() { $(this).dialog("destroy"); $(this).remove();},
					buttons: {
						"Wybierz": function() {
							if ($('#CzyWieszFile1').length > 0) {
								$('#CzyWieszFile1').attr('checked',true);
								$('#CzyWieszFile2').removeAttr('disabled');
								$('#CzyWieszFile2').val( $('.czy-wiesz-gallery-chosen').length == 0 ? '' : decodeURIComponent($('.czy-wiesz-gallery-chosen')[0].src.match(/\/\/upload\.wikimedia\.org\/wikipedia\/commons(\/thumb)?\/.\/..\/([^\/]+)\/?/)[2]).replace(/_/g,' ') ); // â† extract file name
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

		// if there are no refs (or they're badly named) â†’ append this dialog to a link in $ref_row
		$('#CzyWieszRefs small a').click(function(){
			$('<div><div class="floatright">' + D.config.CWicon + '</div><p style="margin-left: 10px;">Zgodnie z wytycznymi <a href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojektu Czy wiesz</a> zgÅ‚aszane hasÅ‚o powinno posiadaÄ‡ ÅºrÃ³dÅ‚a w formie bibliografii lub przypisÃ³w. <a href="/wiki/Wikiprojekt:Czy_wiesz/pomoc#Zg.C5.82aszanie_propozycji_i_poprawa_hase.C5.82" title="Wikiprojekt:Czy wiesz/pomoc#ZgÅ‚aszanie propozycji i poprawa haseÅ‚">(WiÄ™cejâ€¦)</a><br /><small>MoÅ¼liwe, Å¼e w artykule sekcje ze ÅºrÃ³dÅ‚ami sÄ… bÅ‚Ä™dnie nazwane â€“ w takim wypadku popraw je.</small></p></div>')
			.dialog({ modal: true, dialogClass: "wikiEditor-toolbar-dialog", close: function() { $(this).dialog("destroy"); $(this).remove();} });
		});

		// click on (+) near wikiprojects combo box â†’ add new combo box and enlarge the dialog window
		$('#CzyWieszWikiprojectAdd').click(function(){
			$('#CzyWieszWikiprojectContainer').append(D.wikiproject_select.clone());
			$('#CzyWieszLoaderBar').parent().css({height: '+=24'});
		});

		// click on (+) near authors input field â†’ add new input field and enlarge the dialog window
		$('#CzyWieszAuthor2Add').click(function(){
			if ($('#CzyWieszAuthor2').css('display') == 'none') {
				$('#CzyWieszAuthor2').removeAttr('style');
//				$('#CzyWieszLoaderBar').parent().css({height: '+=24'});
			}
			else {
				$('#CzyWieszAuthor2Container').append(D.author2_input.clone());
				$('#CzyWieszLoaderBar').parent().css({height: '+=24'});
			}
		});

		$('#CzyWieszCommentCheckbox').change(function(){
			$('#CzyWieszCommentContainer').toggle();
		});

		//$('#CzyWieszQuestion').keyup();
		$('#CzyWieszQuestion').focus();
		
	}

	DYKnomination.pagerevs = function () {

		var D = DYKnomination;
		var a,b,c,d0,d,i,aj0,revs0,aj,revs,str,maxdiffsize,maxdiffrev,maxdiffuser,maxdiffdate,g;

		d = new Date();
		a = d.toISOString(); // '2012-08-14T17:43:33Z' OR '2012-08-14T17:43:33.324Z'
			//date after toISOString() is in UTC = without TimezoneOffset
		d.setDate(d.getDate()-10); // 10 days before and from 00:00:00 on that day
		d.setHours(0); d.setMinutes(0); d.setSeconds(0); d.setMilliseconds(0);
		b = d.toISOString();

		$.ajax('/w/api.php?action=query&prop=revisions&format=json&rvprop=timestamp%7Cuser%7Csize&redirects=&indexpageids='
				+ '&rvlimit=max'
				+ '&rvstart=' + encodeURIComponent(a)
				+ '&rvend=' + encodeURIComponent(b)
				+ '&titles=' + encodeURIComponent(wgTitle)
		)
		.done(function(d0){
			// number of edits in last 10 days
			revs0 = (d0.query.pages[d0.query.pageids[0]].revisions ? d0.query.pages[d0.query.pageids[0]].revisions.length : 0);

			// get one more revision to check current size and diffsize of last one in 10 days period
			$.ajax('/w/api.php?action=query&prop=revisions&format=json&rvprop=timestamp%7Cuser%7Csize&redirects=&indexpageids='
					+ '&rvlimit=' + (revs0+1)
					+ '&titles=' + encodeURIComponent(wgTitle)
			)
			.done(function(d){
				aj = d.query.pages[d.query.pageids[0]].revisions;
				revs = aj.length;
				D.log(debug,'edits in last 10 days:',aj);

				if (revs0 > 0) {
				// there are edits in last 10 days
					aj0 = d0.query.pages[d0.query.pageids[0]].revisions;
					//revs0 = aj0.length;
					D.log(debug,'edits in last 10 days, plus one more:',aj0);

					// check the author of the biggest edit in last 10 days
					str=[];
					for (var i=0;i<aj.length;i++){
						if (aj[i+1]) {
							str.push(aj[i].size-aj[i+1].size);
						}
						else {
							// (revs0 == revs) means the article was *created* in last 10 days so last edit really diffs from 0
							if (revs0 == revs) {str.push(aj[i].size);}
						}
					}

					maxdiffsize = Math.max.apply(Math,str);
					maxdiffrev = $.inArray(maxdiffsize,str); //if the same size is more than once it brings the most recent revision!
					(maxdiffsize > 0) ? (maxdiffsize = '+' + maxdiffsize) : '';
					maxdiffuser = aj[maxdiffrev].user;
					//maxdiffdate; get this in format YYYY-MM-DD but in local time (with TimezoneOffset)
					//this way is quicker than converting (g.getFullYear() +'-'+ g.getMonth() +'-'+ g.getDate()) from YYYY-M-D into YYYY-MM-DD
					//toISOString converts time to UTC for display so if we remove TimezoneOffset then the result after toISOString is good
						g = new Date(Date.parse( aj[maxdiffrev].timestamp ));
						g.setMinutes(g.getMinutes()-g.getTimezoneOffset());
						maxdiffdate = g.toISOString().split('T')[0];

					D.log(debug,'\"[str,maxdiffrev,maxdiffsize,maxdiffuser]\":',[str,maxdiffrev,maxdiffsize,maxdiffuser]);

/* OLD VER |START|
					// add a tip about possible authorâ€¦
					$('#CzyWieszAuthor').after('&nbsp;<small id="CzyWieszAuthorTip">(<a class=external>sugestia?</a>)</small>&nbsp;');
					$('#CzyWieszAuthorTip a').click(function(){
						prompt('Autor najwiÄ™kszej edycji (' + maxdiffsize + ') w ciÄ…gu ostatnich 10 dni (skopiuj wciskajÄ…c Ctrl+C):',maxdiffuser);
						$('#CzyWieszAuthor').select();
					});
					// â€¦and about date
					$('#CzyWieszDate').after('&nbsp;<small id="CzyWieszDateTip">(<a class=external>sugestia?</a>)</small>&nbsp;');
					$('#CzyWieszDateTip a').click(function(){
						prompt('Data najwiÄ™kszej edycji (' + maxdiffsize + ') w ciÄ…gu ostatnich 10 dni (skopiuj wciskajÄ…c Ctrl+C):',maxdiffdate);
						$('#CzyWieszDate').select();
					});
   OLD VER |END| */
/* NEW VER |START| */
					// add a possible authorâ€¦
					$('#CzyWieszAuthor').val(maxdiffuser);
					$('#CzyWieszAuthor').after('&nbsp;<small id="CzyWieszAuthorTip">(<span class="external" title="Autor najwiÄ™kszej edycji (' + maxdiffsize + ') w ciÄ…gu ostatnich 10 dni.">upewnij siÄ™!</span>)</small>&nbsp;');
					// â€¦and date
					$('#CzyWieszDate').val(maxdiffdate);
					$('#CzyWieszDate').after('&nbsp;<small id="CzyWieszDateTip">(<span class="external" title="Data najwiÄ™kszej edycji (' + maxdiffsize + ') w ciÄ…gu ostatnich 10 dni.">upewnij siÄ™!</span>)</small>&nbsp;');
/* NEW VER |END| */
				}
				else {
				// there are no edits in last 10 days
					//revs0 = 0;
					D.log(debug,d.query.pages[d.query.pageids[0]]);
					alert('W ciÄ…gu ostatnich 10 dni nie dokonano Å¼adnej edycji. Jeszcze raz rozwaÅ¼ zgÅ‚aszanie tego artykuÅ‚u, gdyÅ¼ moÅ¼e to byÄ‡ niezgodne z regulaminem.');
				}
		
				D.articlesize = {
					size:	aj[0].size,
					enough:	(aj[0].size > 2047),
					warn:	( (aj[0].size > 2047) ? '' : (D.config.no + '&nbsp;&nbsp;<strong style="color: red;">Rozmiar ' + aj[0].size + ' b dyskwalifikuje artykuÅ‚ ze zgÅ‚oszenia!!</strong> <!--small>(<a class="external">info</a>)</small-->') )
				};

				var $size_row = $('<tr id="CzyWieszSize"></tr>')
					.insertAfter($('#CzyWieszRefs'))
					.html('<td>Rozmiar (>2 kb): </td>'
						+ '<td>' + (D.articlesize.enough ? D.config.yes : D.articlesize.warn) + '</td>')
					.css( D.articlesize.enough ? {display: 'none'} : {});
			})
			.fail(function(data){
				D.errors.push('BÅ‚Ä…d pobierania historii artykuÅ‚u (funkcja wewnÄ™trzna): $.ajax.fail().');
				D.errors[0]();
				console.error('BÅ‚Ä…d pobierania historii artykuÅ‚u (funkcja wewnÄ™trzna): $.ajax.fail().');
				console.error(data);
			});
		})
		.fail(function(data){
			D.errors.push('BÅ‚Ä…d pobierania historii artykuÅ‚u (funkcja zewnÄ™trzna): $.ajax.fail().');
			D.errors[0]();
			console.error('BÅ‚Ä…d pobierania historii artykuÅ‚u (funkcja zewnÄ™trzna): $.ajax.fail().');
			console.error(data);
		});
	}

	if (!String.toRegExp){
		String.prototype.toRegExp = function () {
			return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		}
	}
/*	DYKnomination.strToRegExp = function (str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}*/
	
	DYKnomination.values = {}

	DYKnomination.checkForm = function () {

		var D = DYKnomination;
		var debug = D.debugmode;

		//get the question
		var QUESTION = $('#CzyWieszQuestion').val().replace(/(.*?)(--)?~{3,5}\s*$/,'$1').replace(/^\s*(.*?)\s*$/,'$1').replace(/^([Cc]zy wiesz)?[\s,\.]*/,''); // remove signature, spaces on beginning and end, beginning of question ("Czy wiesz")
		var FILE = ( $('#CzyWieszFile1').attr('checked') ? $('#CzyWieszFile2').val().replace(/^\s*(.*?)\s*$/,'$1') : '' ); // remove spaces on beginning and end
		var IMAGES = $('#CzyWieszImages').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var REFS = (D.sourced ? '+' : ' ');
		var AUTHOR = $('#CzyWieszAuthor').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var AUTHOR2 = [];
			//get authors
			$('.CzyWieszAuthor2').each( function(index) {
				var val = $(this).val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
				if (val != '') {
					AUTHOR2.push(val);
				}
			});
		var AUTHOR_INF = ( $('#CzyWieszAuthorInf').attr('checked') ? true : false );
		var DATE = $('#CzyWieszDate').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var SIGNATURE = $('#CzyWieszSignature').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var WIKIPROJECT = [];
			if (!debug) {
				//get the wikiprojects
				$('.czywiesz-wikiproject').each( function(index) {
					var val = $(this).val();
					if (val != 'none') {
						WIKIPROJECT.push(D.wikiprojects.list[val]);
					}
				});
			}
			else {
				WIKIPROJECT = ['Wikipedysta:Kaligula/js/CzyWiesz.js/wikiprojekt'];
			}
		var COMMENT = ( $('#CzyWieszCommentCheckbox').attr('checked') ? $('#CzyWieszComment').val().replace(/^\s*(.*?)\s*$/,'$1') : false );

		//validate form
		var invalid = {is: false, fields: [], alert: []};
			if (typeof QUESTION != 'string' || QUESTION === '') {
				invalid.is = true;
				invalid.fields.push('Question');
				invalid.alert.push('Wpisz pytanie.');
			}
			else {
				var tITLE = wgTitle.charAt(0).toLowerCase()+wgTitle.substr(1); //title in link starting with lowercase
				if (QUESTION.length < 10) {
					invalid.is = true;
					invalid.fields.push('Question');
					invalid.alert.push('Zadaj poprawne pytanie.');
				}
				else if (!QUESTION.match(RegExp('\'\'\'\\s*\\[\\[('+wgTitle.toRegExp()+'|'+tITLE.toRegExp()+')(\\]\\]|\\|.*?\\]\\])\\s*\'\'\''))) {
				// if there isn't any bold (a) link with title or (b) link with title starting with lowercase
					invalid.is = true;
					invalid.fields.push('Question');
					invalid.alert.push('Pytanie musi zawieraÄ‡ link do artykuÅ‚u. Pogrubiony.\n PrzykÅ‚ad:\n   \'\'\'[['+tITLE+']]\'\'\'\n lub\n   \'\'\'[['+wgTitle+'|nazwa do wyÅ›wietlenia, jeÅ›li inna niÅ¼ tytuÅ‚]]\'\'\'.');
				}
				else {
					QUESTION = (QUESTION.match(/^(â€¦|\.\.\.)/) ? '' : 'â€¦') + QUESTION.replace(/\.\.\./g,'â€¦') + (QUESTION.match(/\?[\s]*$/) ? '' : '?');
					QUESTION = QUESTION.replace(/\n+/g,'\n\n') + '\n';
				}
			}
			if (typeof FILE == 'string' && FILE != '') {
				FILE = '[[Plik:' + (FILE.match(/^(Plik:|File:)/i) ? FILE.replace(/^(Plik:|File:)/i,'') : (FILE)) + '|100px|right]]\n';
			}
			if (typeof IMAGES != 'string' || IMAGES === '') {
				invalid.is = true;
				invalid.fields.push('Images');
				invalid.alert.push('Podaj liczbÄ™ grafik w artykule.');
			}
			if (typeof AUTHOR != 'string' || AUTHOR === '') {
				invalid.is = true;
				invalid.fields.push('Author');
				invalid.alert.push('Podaj autora artykuÅ‚u.');
			}
			if (typeof DATE != 'string' || DATE === '' || DATE.match(/\d\d\d\d-\d\d-\d\d/).length==0) {
				invalid.is = true;
				invalid.fields.push('Date');
				invalid.alert.push('Podaj datÄ™ utworzenia/rozbudowy artykuÅ‚u (w formacie rrrr-mm-dd).');
			}
			if (typeof SIGNATURE != 'string' || SIGNATURE === '') {
				invalid.is = true;
				invalid.fields.push('Signature');
				invalid.alert.push('Podpisz siÄ™.');
			}
			if ( (typeof COMMENT!='string'&&typeof COMMENT!='boolean') || (typeof COMMENT=='string' && (COMMENT===''||COMMENT.match(/^[^A-ZÄ˜Ã“Ä„ÅšÅÅ»Å¹Ä†Åƒa-zÄ™Ã³Ä…Å›Å‚Å¼ÅºÄ‡Å„]+$/)) ) || (typeof COMMENT=='string'&&COMMENT==true) ) {
				invalid.is = true;
				invalid.fields.push('Comment');
				invalid.alert.push('JeÅ›li musisz podaÄ‡ jakiÅ› komentarz to podaj jakiÅ› sensowny, jeÅ›li nie â€“ wyÅ‚Ä…cz to pole. Nie wstawiaj w tym polu samego podpisu (lecz po komentarzu podpisz siÄ™).');
			}

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
			D.values = {
				question:    QUESTION,
				file:        FILE,
				images:      IMAGES,
				refs:        REFS,
				author:      AUTHOR,
				date:        DATE,
				signature:   SIGNATURE,
				commment:    COMMENT,
				authorInf:   AUTHOR_INF,
				wikiproject: WIKIPROJECT
			}
			// here is the call of editing/ajax function
			D.prepare();
		}
	}

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
				txt = 'Sprawdzam stronÄ™ zgÅ‚oszeÅ„â€¦';
				break;
			case 1:
				txt = 'Pobieram dane z formularzaâ€¦';
				break;
			case 2:
				txt = 'PrzygotowujÄ™ dane do wysÅ‚aniaâ€¦';
				break;
			case 3:
				txt = 'ZgÅ‚aszam propozycjÄ™â€¦';
				break;
			case 4:
				txt = 'InformujÄ™ o zgÅ‚oszeniuâ€¦';
				break;
			case 'done':
				txt = 'ZakoÅ„czono!';
				task = tasks;
				break;
			case 'error':
				txt = 'WystÄ…piÅ‚ bÅ‚Ä…d!';
				break;
			default:
				txt = '';
		}

		$('#CzyWieszLoaderBarParagraph').text(txt);
		if (task != 'error') { // 'error' â†’ task/tasks = NaN
			$('#CzyWieszLoaderBarInner').css({width: 100*task/tasks + '%'});
		}
		else {
			$('#CzyWieszLoaderBarInner').css({backgroundColor: 'red'});
		}

	}

	DYKnomination.getEditToken = function (callback,force) {
 
		var D = DYKnomination;
		var debug = D.debugmode;

		var tmpToken = mw.user.tokens.values.editToken;
		if (!force && typeof tmpToken == 'string' && tmpToken.length == 34) {
			D.edittoken = tmpToken;
			D.log(debug,'DYKnomination.edittoken :',D.edittoken);
			//runs callback function with all given parameters except two first ones
			window.DYKnomination[callback].apply(null, Array.prototype.slice.call(arguments, 2));
		}
		else {
			/* get edittoken */
			$.ajax({
				url:'/w/api.php?action=tokens&format=json&type=edit',
				cache: false
			})
			.done(function(data){
				D.log(debug,'CzyWiesz edittoken: komenda GET zakoÅ„czona\nodpowiedÅº serwera:',data);
				if (data.error) {
					D.errors.push('BÅ‚Ä…d pobierania tokena: ' + data.error.info + '.');
					D.errors[0]();
					console.error('BÅ‚Ä…d pobierania tokena: ' + data.error.info + '.');
					console.error(data);
				}
				else {
					D.log(debug,'DYKnomination.edittoken :',D.edittoken,'data.tokens.edittoken :',data.tokens.edittoken);
					D.edittoken = data.tokens.edittoken;
					D.log(debug,'DYKnomination.edittoken :',D.edittoken);
					//runs callback function with all given parameters except two first ones
					window.DYKnomination[callback].apply(null, Array.prototype.slice.call(arguments, 2));
				}
			})
			.fail(function(data){
				D.errors.push('BÅ‚Ä…d pobierania tokena: $.ajax.fail().');
				D.errors[0]();
				console.error('BÅ‚Ä…d pobierania tokena: $.ajax.fail().');
				console.error(data);
			});
		}
	}

	DYKnomination.prepare = function () {

		var D = DYKnomination;
		var Dv = D.values;
		var debug = D.debugmode;

		/* prepare place for edition */

		D.tasks = 4 + Dv.wikiproject.length + (Dv.authorInf?1:0);

		D.loadbar();

			var miesiacArr = D.config.miesiacArr;
			DATE = Dv.date.match(/\d+/g);
			var dzisiaj = DATE[2].replace(/^0/,'') + ' ' + miesiacArr[(+(DATE[1])-1)]; //reading localmonthnamegen, but DATE[1]is a string since we could've added leading zero before
			D.log(debug,'dzisiaj: ' + dzisiaj);
		var updatesection = false;

		var sections,section,NR,updatesection; // section must be 'undefined' at the beginning!!! (look at the end of function)

		// search for section 'dd mmmm', because there may be a section like 'BiaÅ‚owieski megaczywiesz na koniec sierpnia (ew. pocz. wrzeÅ›nia)'
		$.ajax({
			url: '/w/api.php?action=mobileview&format=json&page=' + encodeURIComponent(debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy wiesz/propozycje') + '&prop=sections&sectionprop=level%7Cline%7Cnumber%7Canchor&noimages=',
			cache: false
		})
		.done(function(data){
			D.log(debug,
				'get sections: komenda GET zakoÅ„czona',
				'URI: /w/api.php?action=mobileview&format=json&page=' + encodeURIComponent(debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy wiesz/propozycje') + '&prop=sections&sectionprop=level%7Cline%7Cnumber%7Canchor&noimages=',
				'get sections: odpowiedÅº serwera:',
				data
			);
			if (data.error) {
				D.errors.push('BÅ‚Ä…d sprawdzania sekcji na stronie zgÅ‚oszeÅ„: ' + data.error.info + '.');
				D.errors[0]();
				console.error('BÅ‚Ä…d sprawdzania sekcji na stronie zgÅ‚oszeÅ„: ' + data.error.info + '.');
				console.error(data);
			}
			else {
				sections = data.mobileview.sections;
				D.log(debug,sections);
				var m0 = +(DATE[1]) - 1; //it was a string since we could've added leading zero
				var d0 = +(DATE[2]); //it was a string since we could've added leading zero
				var mt = 99; //shorthand for 'Month - Temporary variable' - in January the previous months have bigger nr than one of the sections so if the nomination has a date that is earlier than the first date in this year then the script will go through all sections and save the nomination as last one
				D.log(debug,'current month [m0]:',m0,', current day [d0]:',d0);
				section = 0;
				updatesection = -1;
				NR = 1;
				var nominated = false;

				$(sections).each(function(){
					if ( this.level && (this.level == 2) && this.line && (updatesection < 0) ) { //sekcja nagÅ‚Ã³wkowa (nie zgÅ‚oszenia) i ma nazwÄ™ i wciÄ…Å¼ nie okreÅ›lono msc wstawienia
						var d = this.line.split(' ')[0];
						var m = $.inArray(this.line.split(' ')[1],miesiacArr);
						if ( d.match(/^\d+$/) && (m>-1) ) { //date format is 'd mmmm'
							if (m0 == m && d0 == d) { //the date is equal to section
								section = this.id;
								updatesection = 1;
								//â†‘dla obecnej juÅ¼ sekcji updatesection==1 (yes) â†’ edit section
									var j = section;
									while (sections[j+1] && sections[j+1].level == 3) {
										NR++; j++;
									} //spr jaki nr zgÅ‚oszenia daÄ‡
							}
							else if (m0>m || (m0==m && d0>d) ) { //the date is newer than the section
								section = (this.id-1);
								updatesection = 0;
								//â†‘dla nieobecnej updatesection==0 (no) â†’ append section
							}
							else if (mt<m) { //we went to previous year dates so STOP //TO DO: !
								if (m0 < 6) { //if first half of the year then as above
									section = (this.id-1);
									updatesection = 0;
									//â†‘dla nieobecnej updatesection==0 (no) â†’ append section
								}
								else { //then as below (=we go on and check next)
									section = this.id;
									//â†‘dla nieobecnej najstarszej updatesection<0 (unset) â†’ new section
								}
							}
							else {
							//jeÅ›li nie nastÄ…piÄ… powyÅ¼sze to ten bÄ™dzie zapisywaÅ‚ kolejne id aÅ¼ do _ost._sekcji_
								section = this.id;
								//â†‘dla nieobecnej najstarszej updatesection<0 (unset) â†’ new section
							}
							mt = m;
						}
						D.log(debug,'section:',section,', month [m]:',m,', day [d]:',d,'new section number would be here [NR]:',NR,', updatesection:',updatesection);
					}
					if ( this.level && (this.level == 3) && this.line && this.line.match(/^\d+ \((.*?)\)/) ) { //sekcja zgÅ‚oszenia (nie nagÅ‚Ã³wek) i ma nazwÄ™ z nr na poczÄ…tku
						if ( this.line.match(/^\d+ \((.*?)\)/)[1] == wgTitle ) {
							nominated = true;
							D.errors.push('Podany artykuÅ‚ prawdopodobnie juÅ¼ jest zgÅ‚oszony do rubryki â€žCzy wieszâ€¦â€. <br />'
								+ '<a href=\"/wiki/'+(debug?'Wikipedysta:Kaligula/js/CzyWiesz.js/test':'Wikiprojekt:Czy wiesz/propozycje')+'#' + this.anchor + '\" class="external" target=_blank>SprawdÅº</a>.');
							D.errors[0]();
							console.error('Podany artykuÅ‚ prawdopodobnie juÅ¼ jest zgÅ‚oszony do rubryki â€žCzy wieszâ€¦â€.\n'
								+ 'SprawdÅº: '+location.origin+'/wiki/'+(debug?'Wikipedysta:Kaligula/js/CzyWiesz.js/test':'Wikiprojekt:Czy wiesz/propozycje')+'#' + this.anchor);
						}
					}
				});

				if (nominated === false) {
					Dv.nr = NR
					Dv.updatesection = updatesection;
					Dv.dzisiaj = dzisiaj;
					Dv.section = section;
					D.getEditToken(
					    'runNominate',
						false
					);
				}
			}
		})
		.fail(function(data){
			D.errors.push('BÅ‚Ä…d pobierania listy sekcji: $.ajax.fail().');
			D.errors[0]();
			console.error('BÅ‚Ä…d pobierania listy sekcji: $.ajax.fail().');
			console.error(data);
		}); // returns sections and section
		// we know the section to edit (section) and if it's up-to-date (updatesection:boolean)

	}

	DYKnomination.runNominate = function () {

		var D = DYKnomination;
		var Dv = D.values;
		var debug = D.debugmode;
		var summary,input;

		// NR ready, make summary
		summary = D.config.summary.replace('NR (TITLE)',Dv.nr+' ('+wgTitle+')');

		/* making data ready */
		D.loadbar();

		// making content
		
		input = '=== ' + Dv.nr + ' (' + wgTitle + ') ===\n'
			+ '<!-- artykuÅ‚ zgÅ‚oszony za pomocÄ… gadÅ¼etu CzyWiesz -->\n'
			+ Dv.file         //FILE is already with \n at the end
			+ Dv.question     //QUESTION is already with \n at the end
			+ '{' + '{Wikiprojekt:Czy wiesz/weryfikacja|' + wgTitle + '|' + Dv.refs + '|' + Dv.images + '|' + Dv.author + '|' + Dv.signature + '|?|?|?}}'
			+ (Dv.comment ? '\n'+Dv.comment : '');

		// text ready
		// â†“ new section or not? if updatesection =
		// =  1 then add only the nomination (to a section)
		// =  0 then add whole new section (to a section)
		// = -1 then add whole new section (at the end)

		if (Dv.updatesection == 1) { // if up-to-date â†’ new subsection inside date section
			input = '\n\n' + input;
		}
		else if (Dv.updatesection < 1) { // if not up-to-date â†’ new section with date + new subsection inside date section
			input = '\n\n== ' + Dv.dzisiaj +' ==\n' + input + '\n\n';
		}
		
		D.log(debug,'input:',input);

		Dv.input = input;
		Dv.summary = summary;
		D.nominate();
	}

	DYKnomination.nominate = function () {

		var D = DYKnomination;
		var Dv = D.values;
		var debug = D.debugmode;

		D.loadbar();

		/* edit */

		// Wikiprojekt:Czy wiesz
		D.loadbar();
		
		$.ajax({
			url : '/w/api.php',
			type: 'POST',
			data : {
				action : 'edit',
				format : 'json',
				title : (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy wiesz/propozycje'),
				section : Dv.section,
				appendtext : Dv.input,
				summary : Dv.summary,
				watchlist : 'nochange',
				token : D.edittoken
			}
		})
		.done(function(data){
			D.log(debug,'CzyWiesz nominate: POST done\nserver response:',data);
			if (data.error) {
				D.errors.push('BÅ‚Ä…d zgÅ‚aszania do rubryki: ' + data.error.info + '.');
				D.errors[0]();
				console.error('BÅ‚Ä…d zgÅ‚aszania do rubryki: ' + data.error.info + '.');
				console.error(data);
			}
			else {
				D.inform_r();
			}
		})
		.fail(function(data){
			D.errors.push('BÅ‚Ä…d zgÅ‚aszania do rubryki: $.ajax.fail().');
			D.errors[0]();
			console.error('BÅ‚Ä…d zgÅ‚aszania do rubryki: $.ajax.fail().');
			console.error('URI: /w/api.php?action=edit&format=json&title=' 
				+ encodeURIComponent( (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy wiesz/propozycje') ) 
				+ '&section=' + Dv.section + '&appendtext=' + encodeURIComponent(Dv.input) 
				+ '&summary=' + encodeURIComponent(Dv.summary) + '&token=' + encodeURIComponent(D.edittoken));
			console.error(data);
		});
		
	}

	DYKnomination.inform_r = function () {
 
		var D = DYKnomination;
		var Dv = D.values;
		var debug = D.debugmode;

		/* inform readers (=insert template to nominated article) */

		if ( debug ) {
			D.inform_a();
		}
		else {
			$.ajax({
				url : '/w/api.php',
				type : 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : wgTitle,
					prependtext : '{' + '{Szablon:Czy wiesz do artykuÅ‚u|' + Dv.nr + '}' + '}\n',
					summary : D.config.summary_r,
					watchlist : 'nochange',
					token : D.edittoken
				}
			})
			.done(function(data){
				D.log(debug,'inform_r: komenda POST zakoÅ„czona\nodpowiedÅº serwera:',data);
				if (data.error) {
					D.errors.push('BÅ‚Ä…d informowania w artykule: ' + data.error.info + '.');
					D.errors[0]();
					console.error('BÅ‚Ä…d informowania w artykule: ' + data.error.info + '.');
					console.error(data);
				}
				else {
					if (Dv.authorInf) {
						D.inform_a();
					}
					else {
						D.inform_w();
					}
				}
			})
			.fail(function(data){
				D.errors.push('BÅ‚Ä…d informowania w artykule: $.ajax.fail().');
				D.errors[0]();
				console.error('BÅ‚Ä…d informowania w artykule: $.ajax.fail().');
				console.error('URI: /w/api.php?action=edit&format=json&title='
					+ encodeURIComponent(wgTitle)
					+ '&prependtext=' + encodeURIComponent('{' + '{Szablon:Czy wiesz do artykuÅ‚u|' + Dv.nr + '}' + '}\n') 
					+ '&summary=' + encodeURIComponent(D.config.summary_r) + '&watchlist=nochange&token=' + encodeURIComponent(D.edittoken));
				console.error(data);
			});
		}
	}

	DYKnomination.inform_a = function () {
 
		var D = DYKnomination;
		var Dv = D.values;
		var debug = D.debugmode;
		var secttitl_a,summary_a;

		/* inform author */

		if ( !Dv.authorInf ) {
			D.inform_w();
		}
		else {
			secttitl_a = D.config.secttitl_a.replace('TITLE',wgTitle);
			summary_a = D.config.summary_a.replace('TITLE',wgTitle);
			$.ajax({
				url : '/w/api.php',
				type : 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/autor' : 'Dyskusja wikipedysty:' + Dv.author),
					section : 'new',
					sectiontitle : secttitl_a,
					text : '{' + '{subst:Czy wiesz - autor0|tytuÅ‚ strony='+wgTitle+'}} ~~' + '~~',
					summary : summary_a,
					watchlist : 'nochange',
					token : D.edittoken
				}
			})
			.done(function(data){
				D.log(debug,'autor_inf: komenda POST zakoÅ„czona\nodpowiedÅº serwera:',data);
				if (data.error) {
					D.errors.push('BÅ‚Ä…d informowania autora: ' + data.error.info + '.');
					D.errors[0]();
					console.error('BÅ‚Ä…d informowania autora: ' + data.error.info + '.');
					console.error(data);
				}
				else {
					D.inform_w();
				}
			})
			.fail(function(data){
				D.errors.push('BÅ‚Ä…d informowania autora: $.ajax.fail().');
				D.errors[0]();
				console.error('BÅ‚Ä…d informowania autora: $.ajax.fail().');
				console.error('URI: /w/api.php?action=edit&format=json&title='
					+ encodeURIComponent(debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/autor' : 'Dyskusja wikipedysty:' + Dv.author)
					+ '&section=new' 
					+ '&sectiontitle=' + encodeURIComponent(secttitl_a) 
					+ '&text=' + encodeURIComponent('{' + '{subst:Czy wiesz - autor0|tytuÅ‚ strony='+wgTitle+'}}~~' + '~~') 
					+ '&summary=' + encodeURIComponent(summary_a) + '&token=' + encodeURIComponent(D.edittoken));
				console.error(data);
			});
		}
	}

	DYKnomination.inform_w = function () {
 
		var D = DYKnomination;
		var Dv = D.values;
		var debug = D.debugmode;
		var summary_w,secttitl_w;

		/* inform chosen wikiprojects */
 
		if ( Dv.wikiproject.length == 0 ) {
			D.success();
		}
		else {
			// chosen wikiprojects
			D.wikiprojects.counter = 1; //declared again in case user wants to try nominating again the article without reloading (e.g. after an error)
			summary_w = D.config.summary_w.replace('TITLE',wgTitle);
			secttitl_w = D.config.secttitl_w.replace('TITLE',wgTitle);
 
			for (var i=0;i<Dv.wikiproject.length;i++) {
				var curWikiproject = Dv.wikiproject[i];

				var wnr = -1;
				//check if wikiproject wants to be informed other way than 'section=new'
				//(wnr=) -1 means 'no', any other number means 'yes' and is a number of the wikiproject in D.wikiprojects.list2
				$(D.wikiprojects.list2).each(function(n){
					if (this.label == curWikiproject) wnr=n;
				});
				D.log(debug,'D.wikiprojects.list2',D.wikiprojects.list2);

				var czy_talk;
				var pageToEdit;
				if (debug) {
					pageToEdit = 'Wikipedysta:Kaligula/js/CzyWiesz.js/wikiprojekt';
					D.wikiprojects.list2.push({
						label : 'Wikipedysta:Kaligula/js/CzyWiesz.js/wikiprojekt',
						page  : 'Wikipedysta:Kaligula/js/CzyWiesz.js/wikiprojekt',
						type  : 'talk'
					}); 
					czy_talk = true;
				} else if (wnr<0) {
					pageToEdit = 'Wikiprojekt:'+curWikiproject;
				} else if (D.wikiprojects.list2[wnr].type=='talk') {
					pageToEdit = 'Dyskusja wikiprojektu:' + curWikiproject;
					czy_talk = true;
				} else {
					pageToEdit = D.wikiprojects.list2[wnr].page;
				}

				D.log(debug,'czy_talk:',czy_talk,'D.wikiprojects.list2[wnr]:',D.wikiprojects.list2[wnr],'curWikiproject:',curWikiproject,'pageToEdit:',pageToEdit);

				var obj;
				if (czy_talk) {
				//if report type is 'section=new' then add new section
				//DEBUG: debug page 'Wikipedysta:Kaligula/js/CzyWiesz.js/wikiprojekt' gets here, because now it's on list2
					obj = {
						url : '/w/api.php',
						type : 'POST',
						data : {
							action : 'edit',
							format : 'json',
							title : pageToEdit,
							section : 'new',
							sectiontitle : secttitl_w,
							text : '{' + '{Czy wiesz - wikiprojekt|' + wgTitle + '}} ~~' + '~~',
							summary : summary_w,
							watchlist : 'nochange',
							token : D.edittoken
						}
					}
				} else {
				//if report type is not 'section=new' then get page source [to edit]
					obj = {
						url : '/w/index.php?action=raw&title=' + encodeURIComponent(pageToEdit),
						cache : false
					}
					summary_w = '/* Czy wiesz */ nowe zgÅ‚oszenie: [[' + wgTitle + ']]';
				}
 
				D.log(debug,'obj:',obj);
 
				$.ajax(obj)
				.done(function(data){
					D.log(debug,pageToEdit+': komenda POST' + (czy_talk?'':'(cz. 1.)') + ' zakoÅ„czona\nodpowiedÅº serwera:',data);
					if (data.error) {
						D.errors.push('BÅ‚Ä…d informowania '+ pageToEdit + (czy_talk?'':'(cz. 1.)') + ': ' + data.error.info + '.');
						D.errors[0]();
						console.error('BÅ‚Ä…d informowania '+ pageToEdit + (czy_talk?'':'(cz. 1.)') + ': ' + data.error.info + '.');
						console.error(data);
					}
					else {
						if (czy_talk) {
						//if report type is 'section=new' then this wikiproject is done
							D.loadbar();
							D.wikiprojects.counter++;
							if (D.wikiprojects.counter>Dv.wikiproject.length) D.success();
						}
						else {
						//if report type is not 'section=new' then now we need to save the page
							if (!data.match('<!-- Nowe zgÅ‚oszenia CzyWiesza wstawiaj poniÅ¼ej tej linii. Nie zmieniaj i nie usuwaj tej linii -->')) {
								data = data.replace('[[Kategoria:','== Czy wiesz ==\n<!-- Nowe zgÅ‚oszenia CzyWiesza wstawiaj poniÅ¼ej tej linii. Nie zmieniaj i nie usuwaj tej linii -->\n\n[[Kategoria:');
							}
							data = data.replace('<!-- Nowe zgÅ‚oszenia CzyWiesza wstawiaj poniÅ¼ej tej linii. Nie zmieniaj i nie usuwaj tej linii -->',
								'<!-- Nowe zgÅ‚oszenia CzyWiesza wstawiaj poniÅ¼ej tej linii. Nie zmieniaj i nie usuwaj tej linii -->\n'
								+ '{' + '{Czy wiesz - wikiprojekt|' + wgTitle + '}}');

							D.log(debug,'czy_talk (2):',czy_talk,'D.wikiprojects.list2[wnr] (2):',D.wikiprojects.list2[wnr],'curWikiproject (2):',curWikiproject,'pageToEdit (2):',pageToEdit);

							$.ajax({
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
							})
							.done(function(data2){
								D.log(debug,pageToEdit+': komenda POST' + (czy_talk?'':'(cz. 2.)') + ' zakoÅ„czona\nodpowiedÅº serwera:',data2);
								if (data2.error) {
									D.errors.push('BÅ‚Ä…d informowania '+ pageToEdit + (czy_talk?'':'(cz. 2.)') + ': ' + data2.error.info + '.');
									D.errors[0]();
									console.error('BÅ‚Ä…d informowania '+ pageToEdit + (czy_talk?'':'(cz. 2.)') + ': ' + data2.error.info + '.');
									console.error(data2);
								}
								else {
									D.loadbar();
									D.wikiprojects.counter++;
									if (D.wikiprojects.counter>Dv.wikiproject.length) D.success();
								}
							})
							.fail(function(data2){
								D.errors.push('BÅ‚Ä…d informowania '+ pageToEdit + (czy_talk?'':'(cz. 2.)') + ': $.ajax.fail().');
								D.errors[0]();
								console.error('BÅ‚Ä…d informowania '+ pageToEdit + (czy_talk?'':'(cz. 2.)') + ': $.ajax.fail().');
								console.error('URI: ' + obj.url);
								console.error(data2);
							});
						}
					}
				})
				.fail(function(data){
					D.errors.push('BÅ‚Ä…d informowania '+ pageToEdit + (czy_talk?'':'(cz. 1.)') + ': $.ajax.fail().');
					D.errors[0]();
					console.error('BÅ‚Ä…d informowania '+ pageToEdit + (czy_talk?'':'(cz. 1.)') + ': $.ajax.fail().');
					console.error('URI: ' + obj.url);
					console.error(data);
				});
			}
		}
	}

	DYKnomination.success = function () {
		var D = DYKnomination;
		var debug = D.debugmode;

		if (D.errors.length == 1) { //first element in errors is a nested function
			D.loadbar('done');

			// end dialog: "Finished!"
			$('<div><div class="floatright">' + D.config.CWicon + '</div><p style="margin-top: 10px;">' + D.config.tmpldone + '</p>'
				+ '<p style="margin-left: 10px;">DziÄ™kujemy za <a id="CzyWieszLinkAfter" href="//pl.wikipedia.org/wiki/' 
				+ (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test#' : 'Wikiprojekt:Czy_wiesz/propozycje#') + encodeURIComponent(wgTitle.replace(/ /g,'_')).replace(/%/g,'.').replace(/\()/g,'.28').replace(/\)/g,'.29') + '" class="external">zgÅ‚oszenie</a>,<br />'
				+ '<a href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojekt Czy wiesz</a></p></div>')
			.dialog({ modal: true, dialogClass: "wikiEditor-toolbar-dialog", close: function() { $(this).dialog("destroy"); $(this).remove(); $('#CzyWieszGadget').dialog("destroy"); $('#CzyWieszGadget').remove();} });
		}
	}


$(document).ready(function() {
	var menulink = $('<li id="t-DYKnomination"><a onclick="DYKnomination.askuser();">ZgÅ‚oÅ› do â€žCzy wieszâ€¦â€</a></li>').css({cursor: 'pointer'});
	if ($('#t-ajaxquickdelete')[0]) {$('#t-ajaxquickdelete').after(menulink);}
	else {$('#p-tb ul').append(menulink);}
});



}
else {
	DYKnomination.error = 'The page is not an article. You cannot nominate this page.';
}