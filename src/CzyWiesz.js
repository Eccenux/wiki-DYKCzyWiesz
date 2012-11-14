// DEBUG: póki co po wpisaniu w konsoli "DYKnomination.askuser('debug')" aktualne info pokażą się w console.log 
// i zgłoszenie pójdzie nie do projektu, ale na stronę roboczą Wikipedysta:Kaligula/js/CzyWiesz.js/test

// Wersja dev skryptu: https://pl.wikipedia.org/wiki/Wikipedysta:Kaligula/js/CzyWiesz.js

if (wgNamespaceNumber === 0) {


window.DYKnomination = {};

	DYKnomination.about = {
		version    : '2.1.8',
		author     : 'Kaligula',
		authorlink : 'w:pl:user:Kaligula',
		credits    : 'Tomasz Wachowski, Matma Rex'
	}

	DYKnomination.wikiprojects = {
		list : ['Albumy muzyczne',
			'Anarchizm',
			'Antropologia',
			'Architektura',
			'Astronautyka',
			'Astronomia',
			'Białystok',
			'Biathlon',
			'Biblia',
			'Bieżące wydarzenia',
			'Biografie',
			'Biologia',
			'Bitwy',
			'Botanika',
			'Bydgoszcz',
			'Chemia',
			'Chiny',
			'Chrześcijaństwo',
			'Cmentarze żydowskie w Polsce',
			'Częstochowa',
			'Czechy',
			'Dinozaury',
			'Dolny Śląsk',
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
			'Formuła 1',
			'Francja',
			'Futbol amerykański',
			'Górny Śląsk',
			'Góry Polski',
			'Gdańsk',
			'Gender Studies',
			'Genetyka i biologia molekularna',
			'Geografia',
			'Gry komputerowe',
			'Gwiezdne wrota',
			'Harcerstwo',
			'Harry Potter',
			'Herby',
			'Hinduizm',
			'Hip-Hop',
			'Historia',
			'Igrzyska olimpijskie',
			'Imiona',
			'Informatyka',
			'Irlandia',
			'Islam',
			'Izrael',
			'Japonia',
			'Kluby sportowe',
			'Kolarstwo',
			'Kolej',
			'Kompozytorzy',
			'Komputerowe gry fabularne',
			'Komunikacja miejska',
			'Konflikty współczesne',
			'Korea',
			'Koszykówka',
			'Kraków',
			'Kynologia',
			'Lekkoatletyka',
			'LGBT',
			'Linie lotnicze',
			'Linux',
			'Literatura',
			'Literaturoznawstwo',
			'Lotnictwo',
			'Łódź',
			'Malarstwo',
			'Matematyka',
			'Meblarstwo',
			'Metro',
			'Mikrobiologia',
			'Militaria',
			'Minerały',
			'Mistrzostwa Świata w Piłce Nożnej 2014',
			'Mitologia grecka',
			'Mitologia rzymska',
			'Mitologia słowiańska',
			'Motoryzacja',
			'Muzyka i muzykologia',
			'Muzyka poważna',
			'National Basketball Association',
			'Nauki medyczne',
			'Nauru',
			'Nazwiska',
			'Niemcy',
			'Nowy Sącz',
			'Olsztyn',
			'Opis polskich wsi i gmin',
			'Państwa świata',
			'Paleontologia',
			'Pallotyni',
			'Parki narodowe, krajobrazowe i rezerwaty przyrody',
			'Petanque',
			'Piłka nożna',
			'Piłka siatkowa',
			'Piastowie',
			'Podlaskie',
			'Pokémon',
			'Polityka',
			'Powiat radomski',
			'Powiat szydłowiecki',
			'Powiat wrzesiński',
			'Poznań',
			'Prawo',
			'Programy telewizyjne',
			'Psychologia',
			'Racibórz',
			'Radio',
			'Radio',
			'Religioznawstwo',
			'Rock progresywny',
			'Rosja',
			'Słowacja',
			'Seksuologia',
			'Seriale telewizyjne',
			'Skoki narciarskie',
			'Snooker',
			'Socjologia',
			'Spółdzielczość',
			'Sport',
			'Sporty motorowe',
			'Sporty zimowe',
			'Stany Zjednoczone',
			'Starożytność',
			'Stosunki polsko-ukraińskie',
			'Synagogi w Polsce',
			'Szkoła austriacka (ekonomia)',
			'Sztuka współczesna',
			'Śródziemie',
			'Średniowiecze',
			'Technika',
			'Telefony komórkowe',
			'Tenis ziemny',
			'Transport',
			'Turystyka',
			'Tybet',
			'U-Boot',
			'Ukraina',
			'Unia Europejska',
			'Warhammer',
			'Warszawa',
			'Wawel',
			'Wielka Brytania',
			'Województwo świętokrzyskie',
			'Województwo warmińsko-mazurskie',
			'Wrestling',
			'Wspinaczka',
			'XML',
			'Zoologia',
			'Żegluga',
			'Żużel',
			'Życie codzienne'],
		list2 : [
			{
				label : 'Anarchizm',
				page : 'Dyskusja Wikiprojektu:Anarchizm',
				type : 'talk'
			},
			{
				label : 'Astronomia',
				page : 'Wikiprojekt:Astronomia',
				type : 'section'
			},
			{
				label : 'Biblia',
				page : 'Wikiprojekt:Biblia',
				type : 'section'
			},
			{
				label : 'Botanika',
				page : 'Wikiprojekt:Botanika',
				type : 'section'
			},
			{
				label : 'Chemia',
				page : 'Wikiprojekt:Chemia',
				type : 'section'
			},
			{
				label : 'Chiny',
				page : 'Wikiprojekt:Chiny',
				type : 'section'
			},
			{
				label : 'Chrześcijaństwo',
				page : 'Wikiprojekt:Chrześcijaństwo',
				type : 'section'
			},
			{
				label : 'Dinozaury',
				page : 'Wikiprojekt:Dinozaury',
				type : 'section'
			},
			{
				label : 'Euro 2012',
				page : 'Dyskusja Wikiprojektu:Euro 2012',
				type : 'talk'
			},
			{
				label : 'Filmy',
				page : 'Wikiprojekt:Filmy',
				type : 'section'
			},
			{
				label : 'Fizyka',
				page : 'Wikiprojekt:Fizyka',
				type : 'section'
			},
			{
				label : 'Formuła 1',
				page : 'Dyskusja Wikiprojektu:Formuła 1',
				type : 'talk'
			},
			{
				label : 'Genetyka i biologia molekularna',
				page : 'Wikiprojekt:Genetyka i biologia molekularna',
				type : 'section'
			},
			{
				label : 'Geografia',
				page : 'Wikiprojekt:Geografia',
				type : 'section'
			},
			{
				label : 'Gry komputerowe',
				page : 'Dyskusja Wikiprojektu:Gry komputerowe',
				type : 'talk'
			},
			{
				label : 'Góry Polski',
				page : 'Wikiprojekt:Góry Polski',
				type : 'section'
			},
			{
				label : 'Hinduizm',
				page : 'Wikiprojekt:Hinduizm',
				type : 'section'
			},
			{
				label : 'Igrzyska olimpijskie',
				page : 'Dyskusja Wikiprojektu:Igrzyska olimpijskie',
				type : 'talk'
			},
			{
				label : 'Ilustrowanie',
				page : 'Wikiprojekt:Ilustrowanie',
				type : 'section'
			},
			{
				label : 'Infoboksy',
				page : 'Wikiprojekt:Infoboksy',
				type : 'section'
			},
			{
				label : 'Informatyka',
				page : 'Dyskusja Wikiprojektu:Informatyka',
				type : 'talk'
			},
			{
				label : 'Kategoryzacja',
				page : 'Dyskusja Wikiprojektu:Kategoryzacja',
				type : 'talk'
			},
			{
				label : 'Kolej',
				page : 'Wikiprojekt:Kolej',
				type : 'section'
			},
			{
				label : 'Koszykówka',
				page : 'Dyskusja Wikiprojektu:Koszykówka',
				type : 'talk'
			},
			{
				label : 'Kraków',
				page : 'Dyskusja Wikiprojektu:Kraków',
				type : 'talk'
			},
			{
				label : 'LGBT',
				page : 'Wikiprojekt:LGBT',
				type : 'section'
			},
			{
				label : 'Literatura',
				page : 'Dyskusja Wikiprojektu:Literatura',
				type : 'section'
			},
			{
				label : 'Literaturoznawstwo',
				page : 'Wikiprojekt:Literaturoznawstwo',
				type : 'section'
			},
			{
				label : 'Łódź',
				page : 'Wikiprojekt:Łódź',
				type : 'section'
			},
			{
				label : 'Matematyka',
				page : 'Dyskusja Wikiprojektu:Matematyka',
				type : 'talk'
			},
			{
				label : 'Mikrobiologia',
				page : 'Wikiprojekt:Mikrobiologia',
				type : 'section'
			},
			{
				label : 'Militaria',
				page : 'Wikiprojekt:Militaria',
				type : 'section'
			},
			{
				label : 'Muzyka i muzykologia',
				page : 'Dyskusja Wikiprojektu:Muzyka i muzykologia',
				type : 'talk'
			},
			{
				label : 'Nauki medyczne',
				page : 'Wikiprojekt:Nauki medyczne',
				type : 'section'
			},
			{
				label : 'Nowy Sącz',
				page : 'Wikiprojekt:Nowy Sącz',
				type : 'section'
			},
			{
				label : 'Olsztyn',
				page : 'Wikiprojekt:Olsztyn',
				type : 'section'
			},
			{
				label : 'Paleontologia',
				page : 'Wikiprojekt:Paleontologia',
				type : 'section'
			},
			{
				label : 'Pallotyni',
				page : 'Wikiprojekt:Pallotyni',
				type : 'section'
			},
			{
				label : 'Piłka nożna',
				page : 'Dyskusja Wikiprojektu:Piłka nożna',
				type : 'talk'
			},
			{
				label : 'Piłka siatkowa',
				page : 'Wikiprojekt:Piłka siatkowa',
				type : 'section'
			},
			{
				label : 'Polityka',
				page : 'Wikiprojekt:Polityka',
				type : 'section'
			},
			{
				label : 'Prawo',
				page : 'Wikiprojekt:Prawo',
				type : 'section'
			},
			{
				label : 'Racibórz',
				page : 'Dyskusja Wikiprojektu:Racibórz',
				type : 'talk'
			},
			{
				label : 'Sport',
				page : 'Wikiprojekt:Sport',
				type : 'section'
			},
			{
				label : 'Sporty zimowe',
				page : 'Wikiprojekt:Sporty zimowe',
				type : 'section'
			},
			{
				label : 'Synagogi w Polsce',
				page : 'Wikiprojekt:Synagogi w Polsce',
				type : 'section'
			},
			{
				label : 'Tenis ziemny',
				page : 'Wikiprojekt:Tenis ziemny',
				type : 'section'
			},
			{
				label : 'Unia Europejska',
				page : 'Wikiprojekt:Unia Europejska',
				type : 'section'
			},
			{
				label : 'Warszawa',
				page : 'Wikiprojekt:Warszawa',
				type : 'talk'
			},
			{
				label : 'Zoologia',
				page : 'Wikiprojekt:Zoologia',
				type : 'section'
			}
		]
	}

	DYKnomination.askuser = function (debug) {

		var debug = (typeof debug == 'string' && debug == 'debug') ? true : false;

		var TITLE = wgTitle;
		var IMG_ARR = $.merge($('#mw-content-text .infobox a.image img'),$('#mw-content-text .thumb a.image img'));
		var IMAGES = IMG_ARR.length;
		var REFS = {
			yes:	'<img alt="Crystal Clear app clean.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/20px-Crystal_Clear_app_clean.png" width="20" height="20">',
			no:		'<img alt="Crystal Clear action button cancel.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/20px-Crystal_Clear_action_button_cancel.png" width="20" height="20">'
					+ '&nbsp;&nbsp;<strong style="color: red;">Brak źródeł dyskwalifikuje artykuł ze zgłoszenia!!</strong> <small>(<a class="external">info</a>)</small>',
			ar1:	[''],
			ar2:	['Bibliografia','Przypisy']
		}
			$('.mw-headline').each(function(i){
				REFS.ar1.push( $(this).html().replace(/<span class="mw-headline-number"[^>]*>\d+<\/span> */,'') );
			});
			REFS.ar1 = REFS.ar1.join('#') + '#';
			this.sourced = false;
			for (var i=0; i < REFS.ar2.length; i++) {
				if ( REFS.ar1.match('#' + REFS.ar2[i] + '#') ) {this.sourced = true; break;}
			}
		var SIGNATURE = (wgUserName ? {name: wgUserName, disabled: ' disabled'} : {name: '~' + '~' + '~', disabled: ' disabled'} );
		var WIKIPROJECT=[];
		var QUESTION, FILE, AUTHOR;

		//workaround for Opera - the textarea must be inserted to a visible element

		var $title_paragraph = $('<p></p>')
			.html('Tytuł artykułu: &nbsp;&nbsp;<input type="text" id="CzyWieszTitle" name="CzyWieszTitle" value="' + TITLE + '" style="width: 476px;">');

		var $question_paragraph = $('<p><strong>Zaproponuj pytanie:</strong></p>');

		var $question_textarea_paragraph = $('<p></p>')
			.html('<textarea id="CzyWieszQuestion" style="width: 570px;" rows="2" value="" autofocus></textarea>');

		var $file_row = $('<tr></tr>')
			.html('<td style="width: 28%;"><input type="checkbox" id="CzyWieszFile1" name="CzyWieszFile1"> Zaproponuj grafikę: </td>' // style="width: 36%;
				+ '<td><tt>[[Plik:</tt><input type="text" id="CzyWieszFile2" name="CzyWieszFile2" style="width: 52%;" disabled><tt>|100px|right]]</tt></td>');

		var $images_row = $('<tr></tr>')
			.html('<td>Liczba grafik w artykule: </td>'
				+ '<td><input type="text" id="CzyWieszImages" name="CzyWieszImages" value="' + IMAGES + '"' 
				+ 'style="width: 8%;text-align: right;margin-left: 2px;" disabled>'
				+ '<span id="CzyWieszGalleryToggler" style="display: none;"> → (<a class="external">wybierz grafikę z artykułu</a>)</span>');

		var $ref_row = $('<tr></tr>')
			.html('<td>Źródła: </td>'
				+ '<td id="CzyWieszRefs">' + (this.sourced ? REFS.yes : REFS.no) + '</td>');

		var $author_row = $('<tr></tr>')
			.html('<td>Główny autor artykułu: </td>'
				+ '<td><input type="text" id="CzyWieszAuthor" name="CzyWieszAuthor" style="width: 50%;margin-left: 2px;">'
				+ '<small>(<a id="CzyWieszAuthorLink" class=external onclick=\"this.innerHTML=\'czekaj…\';if(!DYKnomination.maxdiffuser){DYKnomination.pagerevs();};prompt(\'Autor największej edycji w ciągu ostatnich 10 dni (skopiuj wciskając Ctrl+C):\',DYKnomination.maxdiffuser);this.innerHTML=\'podpowiedź?\';\">podpowiedź?</a>)</small></td>');

		var $signature_row = $('<tr></tr>')
			.html('<td>Twój podpis: </td>'
				+ '<td><input type="text" id="CzyWieszSignature" name="CzyWieszSignature" value="' 
				+ SIGNATURE.name + '" style="width: 50%;margin-left: 2px;"' + SIGNATURE.disabled + '></td>');

		var $loading_bar = $('<div id="CzyWieszLoaderBar"></div>')
			.css({width: '100%', backgroundColor: 'rgb(220, 220, 220)', border: '1px solid rgb(187, 187, 187)', borderRadius: '3px'})
			.html('<p id="CzyWieszLoaderBarParagraph" style="margin: 0 0 0 7px; position: absolute;">&nbsp;</p>'
				+ '<div id="CzyWieszLoaderBarInner" style="width: 0; height: 20px; background-color: #ABEC46; border: none; border-radius: 3px;"></div>');

		//wikiproject row
		DYKnomination.wikiproject_select = $('<select class="czywiesz-wikiproject"></select>').css('vertical-align', 'middle');
		DYKnomination.wikiproject_select.append('<option value="none">-- (żaden) --</option>');
		for (i=0;i<DYKnomination.wikiprojects.list.length;i++)
		{
			if (typeof(DYKnomination.wikiprojects.list[i]) == 'function') continue; //on IE wikibits adds indexOf method for arrays. skip it.
			$('<option value="' + i + '">' + DYKnomination.wikiprojects.list[i] + '</option>').appendTo(DYKnomination.wikiproject_select);
		}
		var $wikiproject_row = $('<span id="CzyWieszWikiprojectContainer"></span>').append(DYKnomination.wikiproject_select.clone());
		$wikiproject_row = $('<td></td>').append($wikiproject_row)
			.append('<a id="CzyWieszWikiprojectAdd">(+)</a>');
		$wikiproject_row = $('<tr></tr>').append('<td>Powiadom wikiprojekt(y): </td>').append($wikiproject_row);
 
		//rules paragraph
		var $rules_paragraph = $('<p id="CzyWieszRules"></p>')
			.html('<small>Zgłaszaj hasła nie później niż 10 dni od powstania lub rozbudowania hasła, '
				+ 'posiadające źródła najlepiej w formie przypisów i zawierające co najmniej 2kb samej treści.</small>')
			.css({border: '1px solid #F0F080', backgroundColor: '#FFFFE0', paddingLeft: '5px'});
 
		//build the dialog
		var $dialog = $('<table></table>').css('width','100%').append($file_row).append($images_row).append($ref_row)
			.append($author_row).append($signature_row).append($wikiproject_row);
		var $dialog = $('<div></div>').append($title_paragraph).append($question_paragraph).append($question_textarea_paragraph)
			.append($dialog).append($rules_paragraph).append($loading_bar);
 
		//main buttons
		var buttons = {
			"Zgłoś": function() {
				if (DYKnomination.sourced) {

					//get the question
					TITLE = $('#CzyWieszTitle').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
					QUESTION = $('#CzyWieszQuestion').val().replace(/(.*?)(--)?~{3,5}\s*$/,'$1').replace(/^\s*(.*?)\s*$/,'$1').replace(/^([Cc]zy wiesz)?[\s,\.]*/,''); // remove signature, spaces on beginning and end, beginning of question ("Czy wiesz")
					FILE = ( $('#CzyWieszFile1').attr('checked') ? $('#CzyWieszFile2').val().replace(/^\s*(.*?)\s*$/,'$1') : '' ); // remove spaces on beginning and end
					IMAGES = $('#CzyWieszImages').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
					REFS = (DYKnomination.sourced ? '+' : ' ');
					AUTHOR = $('#CzyWieszAuthor').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
					SIGNATURE = $('#CzyWieszSignature').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end

					//validate form
					var invalid = {is: false, fields: [], alert: []};
						if (typeof TITLE != 'string' || TITLE == '') {
							invalid.is = true;
							invalid.fields.push('Title');
							invalid.alert.push('Podaj tytuł artykułu.');
						}
						if (typeof QUESTION != 'string' || QUESTION === '') {
							invalid.is = true;
							invalid.fields.push('Question');
							invalid.alert.push('Wpisz pytanie.');
						}
						else {
							if (QUESTION.length < 10) {
								invalid.is = true;
								invalid.fields.push('Question');
								invalid.alert.push('Zadaj poprawne pytanie.');
							}
							else if (( QUESTION.replace('[['+TITLE,'') == QUESTION ) && ( QUESTION.replace('[['+TITLE.charAt(0).toLowerCase()+TITLE.substr(1),'') == QUESTION )) {
							// if there isn't any link with title or link with title starting with lowercase
								invalid.is = true;
								invalid.fields.push('Question');
								invalid.alert.push('Pytanie musi zawierać link do artykułu.');
							}
							else{
								/* autobold link in QUESTION doesn't work when TITLE contains (,),[,],{,},… (=RegExp special characters)
								if (!QUESTION.match(' \'\'\'\\[\\['+TITLE+'(\\|.*?)?\\]\\][^\\s\\?\\,\\;\\:\\"\\”\\!]*\'\'\'')) { // if needed: bold the link to article
									QUESTION.replace(RegExp(' \\[\\['+TITLE+'(\\|.*?)?\\]\\]([^\\s\\?\\,\\;\\:\\"\\”\\!]*)'),' \'\'\'[['+TITLE+'$1]]$2\'\'\'');
								}*/
								QUESTION = '…' + (QUESTION.match(/\?[\s]*$/) ? (QUESTION) : (QUESTION += '?')) + '\n';
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

					if (invalid.is) {
						$(invalid.fields).each(function(){
							$('#CzyWiesz'+this).css({border: 'solid 2px red'}).change(function(){
								$(this).css({border: 'none'});
							});
						});
						alert(invalid.alert.join('\n'));
					}
					else {
						//get the wikiprojects
						var $projsel = $('.czywiesz-wikiproject');
						$projsel.each( function(index) {
							var val = $(this).val();
							if (val != 'none') {
								WIKIPROJECT.push(DYKnomination.wikiprojects.list[val]);
							}
						});
						
						var $params = [TITLE, QUESTION, FILE, IMAGES, REFS, AUTHOR, SIGNATURE, WIKIPROJECT];
						var errors = DYKnomination.nominate($params,debug);

						if (!errors) {
							$(this).dialog("destroy");
							$(this).remove();

							// end dialog: "Finished!"
							$('<div><div class="floatright"><img alt="PL Wiki CzyWiesz ikona.svg" src="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/80px-PL_Wiki_CzyWiesz_ikona.svg.png" width="80" height="80" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/120px-PL_Wiki_CzyWiesz_ikona.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/160px-PL_Wiki_CzyWiesz_ikona.svg.png 2x"></div><p style="margin-top: 10px;"><span class="template-done"><img alt="Crystal Clear app clean.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/20px-Crystal_Clear_app_clean.png" width="20" height="20" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/30px-Crystal_Clear_app_clean.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/40px-Crystal_Clear_app_clean.png 2x"><span style="display:none">T</span> <b>Załatwione</b></span></p><p style="margin-left: 10px;">Dziękujemy za <a id="CzyWieszLinkAfter" href="' + location.protocol + '//pl.wikipedia.org/w/index.php?title=' + (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy_wiesz/propozycje') + '&diff=cur&oldid=0" class="external">zgłoszenie</a>,<br><a href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojekt Czy wiesz</a></p></div>')
							.dialog({ modal: true, dialogClass: "wikiEditor-toolbar-dialog", close: function() { $(this).dialog("destroy"); $(this).remove();} });
						}
						else {
							// end dialog: "Error!"
							$('<div><div class="floatright"><img alt="PL Wiki CzyWiesz ikona.svg" src="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/80px-PL_Wiki_CzyWiesz_ikona.svg.png" width="80" height="80" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/120px-PL_Wiki_CzyWiesz_ikona.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/160px-PL_Wiki_CzyWiesz_ikona.svg.png 2x"></div><p style="margin-top: 10px;"><span class="template-not-done"><img alt="Crystal Clear action button cancel.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/20px-Crystal_Clear_action_button_cancel.png" width="20" height="20" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/30px-Crystal_Clear_action_button_cancel.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/40px-Crystal_Clear_action_button_cancel.png 2x"><span style="display:none">N</span> <b>Niezałatwione</b></span></p><p style="margin-left: 10px;">Wystąpił błąd. Więcej informacji w konsoli przeglądarki.<br />Przepraszamy,<br /><a href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojekt Czy wiesz</a></p></div>')
							.dialog({ modal: true, dialogClass: "wikiEditor-toolbar-dialog", close: function() { $(this).dialog("destroy"); $(this).remove();} });
						}
					}
				}
				else {
					alert('Artykuł bez źródeł jest zdyskwalifikowany z nominacji. (Jeśli źródła są to zwróć uwagę czy tytuł sekcji jest prawidłowy, tzn. „Przypisy” lub „Bibliografia”.)')
				}
			},
			"Anuluj" : function() {
				$(this).dialog("close");
			}
		};
 
		$dialog.dialog({
		  width: 600,
		  modal: true,
		  title: 'Zgłaszanie artykułu do rubryki „Czy wiesz…”' + (debug ? ' &nbsp; (<small id="CzyWieszDialogDebug">TRYB DEBUG</small>)' : ''),
		  draggable: true,
		  dialogClass: "wikiEditor-toolbar-dialog",
		  close: function() { $(this).dialog("destroy"); $(this).remove();},
		  buttons: buttons
		});

		/*var submitButton = $('.ui-dialog-buttonpane button:first');
		$('#AjaxQuestion').keyup(function(event) {
		  if ($(this).val().length < 4 && noEmpty) {
			  submitButton.addClass('ui-state-disabled');
		  }
		  else {
			  submitButton.removeClass('ui-state-disabled');
		  }
		  if (event.keyCode == '13') submitButton.click();
		});*/

		if ($('#CzyWieszStyleTag').length == 0) {
			$('<style id="CzyWieszStyleTag">' 
			+ '.wikiEditor-toolbar-dialog .czy-wiesz-gallery-chosen { border: solid 2px red; }\n' 
			+ '#CzyWieszGalleryToggler a, #CzyWieszLinkAfter, #CzyWieszRefs a, #CzyWieszAuthorLink { color: #0645AD; text-decoration: underline; cursor: pointer; padding-right: 13px; '
			+ 'background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVklEQVR4Xn3PgQkAMQhDUXfqTu7kTtkpd5RA8AInfArtQ2'
			+ 'iRXFWT2QedAfttj2FsPIOE1eCOlEuoWWjgzYaB/IkeGOrxXhqB+uA9Bfcm0lAZuh+YIeAD+cAqSz4kCMUAAAAASUVORK5CYII=) center right no-repeat; '
			+ 'background: url(//bits.wikimedia.org/static-1.21wmf3/skins/vector/images/external-link-ltr-icon.png) center right no-repeat!ie; }'
			+ '</style>').appendTo('head');
		}

		// when title changed → user can input number of images (← just in case user wants to nominate another article than current)
		$('#CzyWieszTitle').change(function(){
			$('#CzyWieszImages').removeAttr('disabled');
			$('#CzyWieszImages').val('');
		});

		// when user ticks he wants to nominate with picture → enable picture/file field
		$('#CzyWieszFile1').change(function(){
			var a=$('#CzyWieszFile2');
			(a.attr('disabled') ? a.removeAttr('disabled') : a.attr('disabled','true'))
		});

		// in there's no refs (or they're badly named) → append this dialog to a link in $ref_row
		$('#CzyWieszRefs small a').click(function(){
			$('<div><div class="floatright"><img alt="PL Wiki CzyWiesz ikona.svg" src="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/80px-PL_Wiki_CzyWiesz_ikona.svg.png" width="80" height="80" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/120px-PL_Wiki_CzyWiesz_ikona.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/160px-PL_Wiki_CzyWiesz_ikona.svg.png 2x"></div><p style="margin-left: 10px;">Zgodnie z wytycznymi <a href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojektu Czy wiesz</a> zgłaszane hasło powinno posiadać źródła w formie bibliografii lub przypisów. <a href="/wiki/Wikiprojekt:Czy_wiesz/pomoc#Zg.C5.82aszanie_propozycji_i_poprawa_hase.C5.82" title="Wikiprojekt:Czy wiesz/pomoc#Zgłaszanie propozycji i poprawa haseł">(Więcej…)</a><br /><small>Możliwe, że w artykule sekcje ze źródłami są błędnie nazwane.</small></p></div>')
			.dialog({ modal: true, dialogClass: "wikiEditor-toolbar-dialog", close: function() { $(this).dialog("destroy"); $(this).remove();} });
		});

		// click on (+) near wikiprojects combo box → add new combo box and enlarge the dialog window
		$('CzyWieszWikiprojectAdd').click(function(){
			$('#CzyWieszWikiprojectContainer').append(DYKnomination.wikiproject_select.clone());
			$('#CzyWieszLoaderBar').parent().css({height: '+=24'});
		});

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
					title: 'Wybierz grafikę:',
					draggable: true,
					dialogClass: "wikiEditor-toolbar-dialog",
					close: function() { $(this).dialog("destroy"); $(this).remove();},
					buttons: {
						"Wybierz": function() {
							if ($('#CzyWieszFile1').length > 0) {
								$('#CzyWieszFile1').attr('checked',true);
								$('#CzyWieszFile2').removeAttr('disabled');
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
		
		$('#CzyWieszQuestion').keyup();
		$('#CzyWieszQuestion').focus();
		
	}

	DYKnomination.nominate = function (params,debug) {

		//$('#CzyWieszLoaderBar').css({display: 'block'});
		$('#CzyWieszLoaderBarParagraph').text('Pobieram dane z formularza…');

		if (debug) {console.log(arguments)}

		var TITLE       = params[0];
		var QUESTION     = params[1];
		var FILE     = params[2];
		var IMAGES     = params[3];
		var REFS		= params[4];
		var AUTHOR       = params[5];
		var SIGNATURE      = params[6];
		var WIKIPROJECT = params[7];

		var NR = 1;

		var miesiacArr = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
		var data = new Date();
		var dzien = data.getDate();
		var miesiac = miesiacArr[data.getMonth()];
		var rok = data.getYear()+1900;
		(debug ? console.log('dzisiaj: ' + dzien + ' ' + miesiac) : {});
		
		var tasks = 4 + WIKIPROJECT.length;

		var uptodate = false;
		
		var edittoken;
		var input;
		var summary = 'nowe zgłoszenie przy użyciu [[Wikipedia:Narzędzia/CzyWiesz|gadżetu CzyWiesz]]'; // partial, the rest is added when the section is determined
		var sectiontitle_wikiproject = 'Czy wiesz – zgłoszenie';
		
		var server_error = false;
		
		var a,b,i;

		/* prepare place for edition */
		$('#CzyWieszLoaderBarInner').css({width: 100*1/tasks + '%'});
		$('#CzyWieszLoaderBarParagraph').text('Sprawdzam stronę zgłoszeń…');

		// search for section 'dd mmmm', because there may be a section like 'Białowieski megaczywiesz na koniec sierpnia (ew. pocz. września)'
		$.ajax({url: '/w/api.php?action=mobileview&format=json&page=' + encodeURIComponent(debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy wiesz/propozycje') + '&prop=sections&sectionprop=level%7Cline%7Cnumber%7Canchor&noimages=',
				cache: false,
				async: false
		}).done(function(data){
			if (debug) {
				console.log('get sections: komenda POST zakończona\nodpowiedź serwera:');
				console.log(data)
			}
			if (data.error) {
				server_error = data.error.info;
				console.log(data);
				alert('Wystąpił błąd przy sprawdzaniu sekcji na stronie zgłoszeń. Odpowiedź serwera: ' + data.error.info + '. Więcej informacji w konsoli przeglądarki.');
			}
			sections = data.mobileview.sections;
			for (i=0; i<sections.length; i++){
				if (sections[i].line) {
					var a = sections[i].line.match(/^\d+/);
					var b = sections[i].line.split(' ');
					if ((sections[i].level == 2) && (a) && ($.inArray(b[1],miesiacArr))) {
						( (a[0] == dzien) && (b[1] == miesiac) ) ? (uptodate = true) : (uptodate = false); // checks if first section with date is from today (uptodate)
						section = i;
						(debug ? console.log('Najbardziej aktualna sekcja:' + section + '. (uptodate: ' + uptodate + ')') : {});
						break;
					}
				}
			}	
		}).fail(function(data){
			console.error('getsections: POST error');
			console.error('server response:');
			console.error(data);
		}); // returns sections and section
		// we know the section to edit (section) and if it's up-to-date (uptodate:boolean)

		// if up-to-date → check NR of section to insert to
		if (uptodate) {
			i = section+1;
			while (sections[i] && sections[i].level != 2) {
				(sections[i].level == 3) ? (NR++) : {};
				i++;
			}
		}
		
		// NR ready, make summary
		summary = '/* ' + NR + ' (' + TITLE + ')' + ' */ ' + summary;

		/* making data ready */
		$('#CzyWieszLoaderBarInner').css({width: 100*2/tasks + '%'});
		$('#CzyWieszLoaderBarParagraph').text('Przygotowuję dane do wysłania​…');

		// making content
		
		input = '=== ' + NR + ' (' + TITLE + ') ===\n'
			+ FILE
			+ QUESTION
			+ '{' + '{Wikiprojekt:Czy wiesz/weryfikacja|' + TITLE + '|' + REFS + '|' + IMAGES + '|?|' + AUTHOR + '|' + SIGNATURE + '|?|?|?}}';

		// text ready
		// ↓ new section or not?

		if (uptodate) { // if up-to-date → new subsection inside date section
			input = '\n\n' + input;
		}
		else { // if not up-to-date → new section with date + new subsection inside date section
			input = '== ' + dzien + ' ' + miesiac +' ==\n' + input + '\n\n';
		}
		
		(debug ? console.log(input) : {});
	 
		/* get edittoken */
		if (typeof mw.user.tokens.values.editToken == "string") {
			edittoken = mw.user.tokens.values.editToken;
		}
		else {
			$.ajax({url:'/w/api.php?action=query&prop=info&format=json&intoken=edit&indexpageids=&titles=' + encodeURIComponent(TITLE),
				cache: false,
				async: false
			}).done(function(data){
				edittoken = data.query.pages[data.query.pageids[0]].edittoken;
				if (debug) {
					console.log('CzyWiesz: komenda POST zakończona\nodpowiedź serwera:');
					console.log(data);
				}
				if (data.error) {
					server_error = data.error.info;
					console.log(data);
					alert('Wystąpił błąd. Odpowiedź serwera: ' + data.error.info + '. Więcej informacji w konsoli przeglądarki.');
				}
			}).fail(function(data){
				console.error('edittoken: błąd POST\nodpowiedź serwera:');
				console.error(data);
			});
		}
		(debug ? console.log(edittoken) : {});

		/* edit */

		// Wikiprojekt:Czy wiesz
		$('#CzyWieszLoaderBarInner').css({width: 100*3/tasks + '%'});
		$('#CzyWieszLoaderBarParagraph').text('Zgłaszam propozycję…');
		$.ajax({
			url: '/w/api.php?action=edit&format=json&title=' 
				+ encodeURIComponent( (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy wiesz/propozycje')	) 
				+ '&section=' + section + (uptodate ? '&appendtext=' : '&prependtext=') + encodeURIComponent(input) 
				+ '&summary=' + encodeURIComponent(summary) + '&token=' + encodeURIComponent(edittoken),
			type: 'POST',
			async: false
		}).done(function(data){
			if (debug) {
				console.log('CzyWiesz: POST done\nserver response:');
				console.log(data);
			}
			if (data.error) {
				server_error = data.error.info;
				console.log(data);
				alert('Wystąpił błąd przy zgłaszaniu do rubryki. Odpowiedź serwera: ' + data.error.info + '. Więcej informacji w konsoli przeglądarki.');
			}
		}).fail(function(data){
			console.error('CzyWiesz: błąd POST');
			console.error('/w/api.php?action=edit&format=json&title=' 
				+ encodeURIComponent( (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy wiesz/propozycje') ) 
				+ '&section=' + section + (uptodate ? '&appendtext=' : '&prependtext=') + encodeURIComponent(input) 
				+ '&summary=' + encodeURIComponent(summary) + '&token=' + encodeURIComponent(edittoken))
			console.error('odpowiedź serwera:');
			console.error(data);
			alert('Wystąpił problem przy zgłaszaniu do rubryki. Więcej informacji w konsoli przeglądarki.')
		});
		
		// wikiprojects
		$('#CzyWieszLoaderBarParagraph').text('Zgłaszam do wikiprojektu/ów…');
		for (i=0;i<WIKIPROJECT.length;i++) {
			$('#CzyWieszLoaderBarInner').css({width: 100*(3+(i+1)/tasks) + '%'});
			$.ajax({
				url:'/w/api.php?action=edit&format=json&title=' + encodeURIComponent('Dyskusja wikiprojektu:' + WIKIPROJECT[i]) + '&section=new' 
					+ '&sectiontitle=' + encodeURIComponent(sectiontitle_wikiproject) 
					+ '&text=' + encodeURIComponent('{' + '{subst:Czy wiesz - wikiprojekt|' + TITLE + '}}~' + '~' + '~' + '~') 
					+ '&token=' + encodeURIComponent(edittoken),
				type:'POST',
				async: false
			}).done(function(data){
				if (debug) {
					console.log('wikiproject['+i+']: komenda POST zakończona\nodpowiedź serwera:');
					console.log(data)
				}
				if (data.error) {
					server_error = data.error.info;
					console.log(data);
					alert('Wystąpił błąd przy zgłaszaniu ' + (i+1) + '-go wikiprojektu. Odpowiedź serwera: ' + data.error.info + '. Więcej informacji w konsoli przeglądarki.');
				}
			}).fail(function(data){
				console.error('wikiproject: błąd POST');
				console.error('URI: /w/api.php?action=edit&format=json&title=' + encodeURIComponent('Dyskusja wikiprojektu:' + WIKIPROJECT[i]) + '&section=new' 
					+ '&sectiontitle=' + encodeURIComponent(sectiontitle_wikiproject) 
					+ '&text=' + encodeURIComponent('{' + '{subst:Czy wiesz - wikiprojekt|' + TITLE + '}}~' + '~' + '~' + '~') 
					+ '&token=' + encodeURIComponent(edittoken));
				console.error('odpowiedź serwera:');
				console.error(data);
				alert('Wystąpił problem przy zgłaszaniu ' + (i+1) + '-go wikiprojektu. Więcej informacji w konsoli przeglądarki.')
			});
		}

		if (!server_error) {
			$('#CzyWieszLoaderBarInner').css({width: '100%'});
			$('#CzyWieszLoaderBarParagraph').text('Zakończono!');
		}
		else {
			$('#CzyWieszLoaderBarParagraph').text('Wystąpił błąd');
		}

		return server_error;
	}

	DYKnomination.pagerevs = function (TITLE) {

		if (!TITLE) {TITLE = wgTitle}

		var a,b,c,d,i,aj0,revs0,aj,revs,str,maxdiffsize,maxdiffuser;

		d=new Date();
		a=d.toISOString(); // '2012-08-14T17:43:33Z' OR '2012-08-14T17:43:33.324Z'
		//b=new Date(d.setUTCDate(d.getUTCDate()-10)).toISOString();
		b=new Date(d.setUTCDate(d.getUTCDate()-10)).toISOString().replace(/T.*$/,'T00:00:00Z'); // 10 days before and from 00:00:00

		$.ajax({url: '/w/api.php?action=query&prop=revisions&format=json&rvprop=timestamp%7Cuser%7Csize&redirects=&indexpageids='
				+ '&rvlimit=max'
				+ '&rvstart=' + encodeURIComponent(a)
				+ '&rvend=' + encodeURIComponent(b)
				+ '&titles=' + encodeURIComponent(TITLE),
				async: false})
			.done(function(d){
				aj0 = d.query.pages[d.query.pageids[0]].revisions;
				revs0 = aj0.length;
				console.log(aj0);
			})
		$.ajax({url: '/w/api.php?action=query&prop=revisions&format=json&rvprop=timestamp%7Cuser%7Csize&redirects=&indexpageids='
				+ '&rvlimit=' + (revs0+1)
				+ '&titles=' + encodeURIComponent(TITLE),
				async: false})
			.done(function(d){
				aj = d.query.pages[d.query.pageids[0]].revisions;
				revs = aj.length;
				console.log(aj);
			})

		// sprawdzanie kto największy wkład
		// TO DO: tylko że maxdiffsize traktuje najstarszą wymienioną edycję jako utworzenie art. i porównuje do size=0
		str=[];
		for (i=0;i<aj.length;i++){
			if (aj[i+1]) {
				str.push(aj[i].size-aj[i+1].size);
			}
			else {
				if (revs0 == revs) {str.push(aj[i].size);}
			}
		}
		maxdiffsize = Math.max.apply(Math,str);
		maxdiffuser = aj[$.inArray(maxdiffsize,str)].user;
		
		console.log('\"[str,maxdiffsize,maxdiffuser]\":');
		console.log([str,(maxdiffsize>0?'+'+maxdiffsize:maxdiffsize),maxdiffuser]);
		
		this.maxdiffuser = maxdiffuser;
	}


$(document).ready(function() {
	var menulink = $('<li id="t-DYKnomination"><a onclick="DYKnomination.askuser();">Zgłoś do „Czy Wiesz…”</a></li>');
	if ($('#t-ajaxquickdelete')[0]) {$('#t-ajaxquickdelete').after(menulink);}
	else {$('#p-tb ul').append(menulink);}
});


}