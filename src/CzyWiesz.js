// DEBUG: póki co po wpisaniu w konsoli "DYKnomination.askuser('debug')" aktualne info pokażą się w console.log 
// i zgłoszenie pójdzie nie do projektu, ale na stronę roboczą Wikipedysta:Kaligula/js/CzyWiesz.js/test

// Wersja dev skryptu: https://pl.wikipedia.org/wiki/Wikipedysta:Kaligula/js/CzyWiesz.js

if (wgNamespaceNumber === 0) {


window.DYKnomination = {};

	DYKnomination.about = {
		version    : '2.3.3',
		author     : 'Kaligula',
		authorlink : 'w:pl:user:Kaligula',
		credits    : 'Tomasz Wachowski, Matma Rex'
	}

	DYKnomination.config = {
		summary:	'nowe zgłoszenie przy użyciu [[Wikipedia:Narzędzia/CzyWiesz|gadżetu CzyWiesz]]', // partial, the rest is added when the section is determined
		secttitl_w: 'Czy wiesz – zgłoszenie', // section title for informing the wikiprojects
		styletag:	$('<style id="CzyWieszStyleTag">' 
						+ '.wikiEditor-toolbar-dialog .czy-wiesz-gallery-chosen { border: solid 2px red; }\n' 
						+ '#CzyWieszWikiprojectAdd {cursor: pointer; }\n'
						+ '#CzyWieszGalleryToggler a, #CzyWieszLinkAfter, #CzyWieszRefs a, #CzyWieszAuthorTip a, #CzyWieszErrorDialog a { '
							+ 'color: #0645AD; text-decoration: underline; cursor: pointer; padding-right: 13px; '
							+ 'background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVklEQVR4Xn3PgQkAMQhDUXfqTu7kTtkpd5RA8AInfArtQ2'
							+ 'iRXFWT2QedAfttj2FsPIOE1eCOlEuoWWjgzYaB/IkeGOrxXhqB+uA9Bfcm0lAZuh+YIeAD+cAqSz4kCMUAAAAASUVORK5CYII=) center right no-repeat; '
							+ 'background: url(//bits.wikimedia.org/static-1.21wmf3/skins/vector/images/external-link-ltr-icon.png) center right no-repeat!ie; }'
					+ '</style>'),
		yes:		'<img alt="Crystal Clear app clean.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/20px-Crystal_Clear_app_clean.png" width="20" height="20">',
		no:			'<img alt="Crystal Clear action button cancel.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/20px-Crystal_Clear_action_button_cancel.png" width="20" height="20">'
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

	DYKnomination.debug = false;

/*	DYKnomination.error = function (){
		var i;
		var dialog = $('<ul></ul>');
		for (i=0;i<DYKnomination.errors.length;i++) {
			dialog.append( $('<li></li>').html(DYKnomination.errors[i]) );
		}
		
		dialog.dialog({
		  width: 400,
		  modal: true,
		  title: 'BŁĄD',
		  draggable: true,
		  dialogClass: "wikiEditor-toolbar-dialog",
		  close: function() { $(this).dialog("destroy"); $(this).remove();}
		});
	}*/

	DYKnomination.errors = [function (){
		var dialog = $('<ul></ul>');
		for (var i=1;i<DYKnomination.errors.length;i++) {
			dialog.append( $('<li></li>').html(DYKnomination.errors[i]) );
		}
		dialog = $('<div id="CzyWieszErrorDialog"></div>').append(dialog).append( $('<p>Więcej informacji w konsoli przeglądarki.</p>') );
		
		dialog.dialog({
		  width: 400,
		  modal: true,
		  title: 'Wystąpił błąd',
		  draggable: true,
		  dialogClass: "wikiEditor-toolbar-dialog",
		  close: function() { $(this).dialog("destroy"); $(this).remove();}
		});
	}];

	DYKnomination.askuser = function (debug) {

		debug = (typeof debug == 'string' && debug == 'debug') ? true : false;
			DYKnomination.debug = debug;
		if (DYKnomination.errors.length > 1) { DYKnomination.errors = [DYKnomination.errors[0]]; }
		(debug ? console.log(DYKnomination) : '');

		var TITLE = wgTitle;
		var IMG_ARR = $.merge($('#mw-content-text .infobox a.image img'),$('#mw-content-text .thumb a.image img'));
		var IMAGES = IMG_ARR.length;
		var REFS = {
			warn:	DYKnomination.config.no + '&nbsp;&nbsp;<strong style="color: red;">Brak źródeł dyskwalifikuje artykuł ze zgłoszenia!!</strong> <small>(<a class="external">info</a>)</small>',
			ar1:	[''],
			ar2:	['Bibliografia','Przypisy']
		}
			$('.mw-headline').each(function(i){
				REFS.ar1.push( $(this).html().replace(/<span class="mw-headline-number"[^>]*>\d+<\/span> */,'') );
			});
			REFS.ar1 = REFS.ar1.join('#') + '#';
			DYKnomination.sourced = false;
			for (var i=0; i < REFS.ar2.length; i++) {
				if ( REFS.ar1.match('#' + REFS.ar2[i] + '#') ) {DYKnomination.sourced = true; break;}
			}
		var SIGNATURE = (wgUserName ? {name: wgUserName, disabled: ' disabled'} : {name: '~' + '~' + '~', disabled: ' disabled'} );

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

		var $ref_row = $('<tr id="CzyWieszRefs"></tr>')
			.html('<td>Źródła: </td>'
				+ '<td>' + ( DYKnomination.sourced ? DYKnomination.config.yes : REFS.warn ) + '</td>');
			if (DYKnomination.sourced) {
				$ref_row.css({display: 'none'});
			}

		var $author_row = $('<tr></tr>')
			.html('<td>Główny autor artykułu: </td>'
				+ '<td><input type="text" id="CzyWieszAuthor" name="CzyWieszAuthor" style="width: 50%;margin-left: 2px;"></td>');

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
		for (i=0;i<DYKnomination.wikiprojects.list.length;i++) {
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
		var $dialog = $('<table></table>').css('width','100%').append($ref_row)
			.append($file_row).append($images_row).append($author_row).append($signature_row).append($wikiproject_row);
		var $dialog = $('<div></div>').append($title_paragraph).append($question_paragraph).append($question_textarea_paragraph)
			.append($dialog).append($rules_paragraph).append($loading_bar);
 
		//main buttons
		var buttons = {
			"Zgłoś": function() {
				if (DYKnomination.sourced) {
					DYKnomination.checkForm();
				}
				else {
					alert('Artykuł bez źródeł jest zdyskwalifikowany z nominacji. (Jeśli źródła są to zwróć uwagę czy tytuł sekcji jest prawidłowy, tzn. „Przypisy” lub „Bibliografia”.)');
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
			DYKnomination.config.styletag.appendTo('head');
		}

		// check size of article and make a tip for the possible author
		DYKnomination.pagerevs(TITLE);
		
		// when title changed → user can input number of images (← just in case user wants to nominate another article than current)
		$('#CzyWieszTitle').change(function(){
			$('#CzyWieszImages').removeAttr('disabled');
			$('#CzyWieszImages').val('');
		});

		// when user ticks he wants to nominate with picture → enable picture/file field
		$('#CzyWieszFile1').change(function(){
			var a=$('#CzyWieszFile2');
			(a.attr('disabled') ? a.removeAttr('disabled') : a.attr('disabled','true'));
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

		// if there are no refs (or they're badly named) → append this dialog to a link in $ref_row
		$('#CzyWieszRefs small a').click(function(){
			$('<div><div class="floatright"><img alt="PL Wiki CzyWiesz ikona.svg" src="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/80px-PL_Wiki_CzyWiesz_ikona.svg.png" width="80" height="80" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/120px-PL_Wiki_CzyWiesz_ikona.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/160px-PL_Wiki_CzyWiesz_ikona.svg.png 2x"></div><p style="margin-left: 10px;">Zgodnie z wytycznymi <a href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojektu Czy wiesz</a> zgłaszane hasło powinno posiadać źródła w formie bibliografii lub przypisów. <a href="/wiki/Wikiprojekt:Czy_wiesz/pomoc#Zg.C5.82aszanie_propozycji_i_poprawa_hase.C5.82" title="Wikiprojekt:Czy wiesz/pomoc#Zgłaszanie propozycji i poprawa haseł">(Więcej…)</a><br /><small>Możliwe, że w artykule sekcje ze źródłami są błędnie nazwane – w takim wypadku popraw je.</small></p></div>')
			.dialog({ modal: true, dialogClass: "wikiEditor-toolbar-dialog", close: function() { $(this).dialog("destroy"); $(this).remove();} });
		});

		// click on (+) near wikiprojects combo box → add new combo box and enlarge the dialog window
		$('#CzyWieszWikiprojectAdd').click(function(){
			$('#CzyWieszWikiprojectContainer').append(DYKnomination.wikiproject_select.clone());
			$('#CzyWieszLoaderBar').parent().css({height: '+=24'});
		});

		$('#CzyWieszQuestion').keyup();
		$('#CzyWieszQuestion').focus();
		
	}

	DYKnomination.pagerevs = function (TITLE) {

		if (!TITLE) {TITLE = wgTitle}

		var a,b,c,d0,d,i,aj0,revs0,aj,revs,str,maxdiffsize,maxdiffuser;

		d = new Date();
		a = d.toISOString(); // '2012-08-14T17:43:33Z' OR '2012-08-14T17:43:33.324Z'
		b = new Date(d.setUTCDate(d.getUTCDate()-10)).toISOString().replace(/T.*$/,'T00:00:00Z'); // 10 days before and from 00:00:00 on that day

		$.ajax('/w/api.php?action=query&prop=revisions&format=json&rvprop=timestamp%7Cuser%7Csize&redirects=&indexpageids='
				+ '&rvlimit=max'
				+ '&rvstart=' + encodeURIComponent(a)
				+ '&rvend=' + encodeURIComponent(b)
				+ '&titles=' + encodeURIComponent(TITLE)
		)
		.done(function(d0){
			// number of edits in last 10 days
			revs0 = (d0.query.pages[d0.query.pageids[0]].revisions ? d0.query.pages[d0.query.pageids[0]].revisions.length : 0);

			// get one more revision to check current size and diffsize of last one in 10 days period
			$.ajax('/w/api.php?action=query&prop=revisions&format=json&rvprop=timestamp%7Cuser%7Csize&redirects=&indexpageids='
					+ '&rvlimit=' + (revs0+1)
					+ '&titles=' + encodeURIComponent(TITLE)
			)
			.done(function(d){
				aj = d.query.pages[d.query.pageids[0]].revisions;
				revs = aj.length;
				if (debug) {
					console.log('edits in last 10 days:');
					console.log(aj);
				}

				if (revs0 > 0) {
				// there are edits in last 10 days
					aj0 = d0.query.pages[d0.query.pageids[0]].revisions;
					//revs0 = aj0.length;
					if (debug) {
						console.log('edits in last 10 days, plus one more:');
						console.log(aj0);
					}

					// check the author of the biggest edit in last 10 days
					str=[];
					for (i=0;i<aj.length;i++){
						if (aj[i+1]) {
							str.push(aj[i].size-aj[i+1].size);
						}
						else {
							// (revs0 == revs) means the article was *created* in last 10 days so last edit really diffs from 0
							if (revs0 == revs) {str.push(aj[i].size);}
						}
					}

					maxdiffsize = Math.max.apply(Math,str);
					maxdiffuser = aj[$.inArray(maxdiffsize,str)].user;
					(maxdiffsize > 0) ? (maxdiffsize = '+' + maxdiffsize) : ''

					(debug ? console.log('\"[str,maxdiffsize,maxdiffuser]\":') : '');
					(debug ? console.log([str,maxdiffsize,maxdiffuser]) : '');

					// add a tip about possible author
					$('#CzyWieszAuthor').after(' <small id="CzyWieszAuthorTip">(<a class=external>podpowiedź?</a>)</small>');
					$('#CzyWieszAuthorTip a').click(function(){
						prompt('Autor największej edycji (' + maxdiffsize + ') w ciągu ostatnich 10 dni (skopiuj wciskając Ctrl+C):',maxdiffuser);
					});
				}
				else {
				// there are no edits in last 10 days
					//revs0 = 0;
					(debug ? console.log(d.query.pages[d.query.pageids[0]]) : '');
					alert('W ciągu ostatnich 10 dni nie dokonano żadnej edycji. Jeszcze raz rozważ zgłaszanie tego artykułu, gdyż może to być niezgodne z regulaminem.');
				}
		
				DYKnomination.articlesize = {
					size:	aj[0].size,
					enough:	(aj[0].size > 2047),
					warn:	DYKnomination.config.no + '&nbsp;&nbsp;<strong style="color: red;">Rozmiar ' + aj[0].size + ' b dyskwalifikuje artykuł ze zgłoszenia!!</strong> <!--small>(<a class="external">info</a>)</small-->'
				};

				var $size_row = $('<tr id="CzyWieszSize"></tr>')
					.insertAfter($('#CzyWieszRefs'))
					.html('<td>Rozmiar (>2 kb): </td>'
						+ '<td>' + (DYKnomination.articlesize.enough ? DYKnomination.config.yes : DYKnomination.articlesize.warn) + '</td>')
					.css( DYKnomination.articlesize.enough ? {display: 'none'} : {});
			})
			.fail(function(data){
				DYKnomination.errors.push('Błąd pobierania historii artykułu (funkcja wewnętrzna): $.ajax.fail().');
				DYKnomination.errors[0]();
				console.error('Błąd pobierania historii artykułu (funkcja wewnętrzna): $.ajax.fail().');
				console.error(data);
			});
		})
		.fail(function(data){
			DYKnomination.errors.push('Błąd pobierania historii artykułu (funkcja zewnętrzna): $.ajax.fail().');
			DYKnomination.errors[0]();
			console.error('Błąd pobierania historii artykułu (funkcja zewnętrzna): $.ajax.fail().');
			console.error(data);
		});
	}

	DYKnomination.strToRegExp = function (str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}
	
	DYKnomination.checkForm = function () {

		var debug = DYKnomination.debug;

		//get the question
		var TITLE = $('#CzyWieszTitle').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var QUESTION = $('#CzyWieszQuestion').val().replace(/(.*?)(--)?~{3,5}\s*$/,'$1').replace(/^\s*(.*?)\s*$/,'$1').replace(/^([Cc]zy wiesz)?[\s,\.]*/,''); // remove signature, spaces on beginning and end, beginning of question ("Czy wiesz")
		var FILE = ( $('#CzyWieszFile1').attr('checked') ? $('#CzyWieszFile2').val().replace(/^\s*(.*?)\s*$/,'$1') : '' ); // remove spaces on beginning and end
		var IMAGES = $('#CzyWieszImages').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var REFS = (DYKnomination.sourced ? '+' : ' ');
		var AUTHOR = $('#CzyWieszAuthor').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var SIGNATURE = $('#CzyWieszSignature').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var WIKIPROJECT = [];

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
				else if (( QUESTION.match(RegExp('\\[\\['+DYKnomination.strToRegExp(TITLE)+'(\\]\\]|\\|.*?\\]\\])')) == null ) && ( QUESTION.match('\\[\\['+DYKnomination.strToRegExp(TITLE.charAt(0).toLowerCase()+TITLE.substr(1))+'(\\]\\]|\\|.*?\\]\\])') == null )) {
				// if there isn't any link with title or link with title starting with lowercase
					invalid.is = true;
					invalid.fields.push('Question');
					invalid.alert.push('Pytanie musi zawierać link do artykułu. Pogrubiony.\n Przykład:\n   \'\'\'[['+TITLE+']]\'\'\'\n lub\n   \'\'\'[['+TITLE+'|nazwa do wyświetlenia, jeśli inna niż tytuł]]\'\'\'.');
				}
				else{
					if (!QUESTION.match(RegExp('\'\'\'\\s*\\[\\['+DYKnomination.strToRegExp(TITLE)+'(\\]\\]|\\|.*?\\]\\])\\s*\'\'\''))) { // if needed: bold the link to article
						QUESTION = QUESTION.replace(RegExp('\\[\\['+DYKnomination.strToRegExp(TITLE)+'(\\|.*?)?\\]\\]'),'\'\'\'[['+TITLE+'$1]]\'\'\'');
					}
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
			$('.czywiesz-wikiproject').each( function(index) {
				var val = $(this).val();
				if (val != 'none') {
					WIKIPROJECT.push(DYKnomination.wikiprojects.list[val]);
				}
			});

			// here is the call of editing/ajax function
			var $params = [TITLE, QUESTION, FILE, IMAGES, REFS, AUTHOR, SIGNATURE, WIKIPROJECT];
			DYKnomination.prepare($params);
		}
	}

	DYKnomination.loadbar = function (task) {

		if (!task) task = 0;
		var tasks = DYKnomination.tasks;
		var txt;
		
		switch ((typeof task=='number'&&task)<5?task:4) {
			case 0:
				txt = 'Sprawdzam stronę zgłoszeń…';
				break;
			case 1:
				txt = 'Pobieram dane z formularza…';
				break;
			case 2:
				txt = 'Przygotowuję dane do wysłania​…';
				break;
			case 3:
				txt = 'Zgłaszam propozycję…';
				break;
			case 4:
				txt = 'Zgłaszam do wikiprojektu/ów…';
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

		//$('#CzyWieszLoaderBar').css({display: 'block'});
		$('#CzyWieszLoaderBarParagraph').text(txt);
		if (task != 'error') { // 'error' → task/tasks = NaN
			$('#CzyWieszLoaderBarInner').css({width: 100*task/tasks + '%'});
		}
		else {
			$('#CzyWieszLoaderBarInner').css({backgroundColor: 'red'});
		}

	}

	DYKnomination.prepare = function (params) {

		var debug = DYKnomination.debug;

		/* prepare place for edition */

		var TITLE		= params[0];
		var WIKIPROJECT	= params[7];
		DYKnomination.tasks = 4 + WIKIPROJECT.length;

		DYKnomination.loadbar(0);

		var data = new Date();
			var miesiacArr = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
			var dzisiaj = data.getDate() + ' ' + miesiacArr[data.getMonth()];
			(debug ? console.log('dzisiaj: ' + dzisiaj) : {});
		var uptodate = false;

		var sections,section,NR; // section must be 'undefined' at the beginning!!! (look at the end of function)

		// search for section 'dd mmmm', because there may be a section like 'Białowieski megaczywiesz na koniec sierpnia (ew. pocz. września)'
		$.ajax({url: '/w/api.php?action=mobileview&format=json&page=' + encodeURIComponent(debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy wiesz/propozycje') + '&prop=sections&sectionprop=level%7Cline%7Cnumber%7Canchor&noimages=',
				cache: false
		})
		.done(function(data){
			if (debug) {
				console.log('get sections: komenda POST zakończona\nodpowiedź serwera:');
				console.log(data);
			}
			if (data.error) {
				DYKnomination.errors.push('Błąd sprawdzania sekcji na stronie zgłoszeń: ' + data.error.info + '.');
				DYKnomination.errors[0]();
				console.error('Błąd sprawdzania sekcji na stronie zgłoszeń: ' + data.error.info + '.');
				console.error(data);
			}
			else {
				sections = data.mobileview.sections;
				for (i=0; i<sections.length; i++){
					if ( sections[i].level && (sections[i].level == 2) && sections[i].line && (typeof section == 'undefined') ) { // iterate level 2 headings until 'section' is defined
						var a = sections[i].line.match(/^\d+/);
						var b = sections[i].line.split(' ');
						if (a && ($.inArray(b[1],miesiacArr))) {
							//( (a[0] == dzien) && (b[1] == miesiac) ) ? (uptodate = true) : (uptodate = false); // checks if first section with date is from today (uptodate)
							uptodate = (sections[i].line == dzisiaj); // checks if first section with date is from today (uptodate)
							section = i;
							(debug ? console.log('Najbardziej aktualna sekcja:' + section + '. (uptodate: ' + uptodate + ')') : {});

							// if up-to-date → check NR of section to insert to
							NR = 1;
							if (uptodate) {
								j = i;
								while (sections[j+1] && sections[j+1].level != 2) {
									(sections[j+1].level == 3) ? (NR++) : {};
									j++;
								}
							}

							// break; ← would be fine but we cannot break the loop because in the same loop we check level 3 headings on the whole page to see if the article is already nominated (see below)
						}
					}
					else if ( sections[i].level && (sections[i].level == 3) && sections[i].line ) {
						if ( sections[i].line.match(/^\d+ \((.*?)\)/)[1] == TITLE ) {
							var nominated = true;
							DYKnomination.errors.push('Podany artykuł prawdopodobnie już jest zgłoszony do rubryki „Czy wiesz…”. <br />'
													+ '<a href=\"/wiki/'+(debug?'Wikipedysta:Kaligula/js/CzyWiesz.js/test':'Wikiprojekt:Czy wiesz/propozycje')+'#' + sections[i].anchor + '\" class="external" target=_blank>Sprawdź</a>.');
							DYKnomination.errors[0]();
							console.error('Podany artykuł prawdopodobnie już jest zgłoszony do rubryki „Czy wiesz…”.\n'
										+ 'Sprawdź: '+location.origin+'/wiki/'+(debug?'Wikipedysta:Kaligula/js/CzyWiesz.js/test':'Wikiprojekt:Czy wiesz/propozycje')+'#' + sections[i].anchor);
						}
					}
				}

				if (typeof nominated == 'undefined') {

					var p = [NR,uptodate,dzisiaj,section];

					/* get edittoken */
					if (typeof mw.user.tokens.values.editToken == "string") { // the same happens on else (if no token here) then after ajax done (see below)
						DYKnomination.edittoken = mw.user.tokens.values.editToken;
						DYKnomination.run_nom(params,p);
					}
					else {
						$.ajax({url:'/w/api.php?action=query&prop=info&format=json&intoken=edit&indexpageids=&titles=' + encodeURIComponent(TITLE),
							cache: false
						})
						.done(function(data){
							if (debug) {
								console.log('CzyWiesz: komenda POST zakończona\nodpowiedź serwera:');
								console.log(data);
							}
							if (data.error) {
								DYKnomination.errors.push('Błąd pobierania tokena: ' + data.error.info + '.');
								DYKnomination.errors[0]();
								console.error('Błąd pobierania tokena: ' + data.error.info + '.');
								console.error(data);
							}
							else {
								(debug ? console.log(DYKnomination.edittoken) : {});
								DYKnomination.edittoken = data.query.pages[data.query.pageids[0]].edittoken;
								var p = [NR,uptodate,dzisiaj,section];
								for (i=0;i<p.length;i++){
									params.push(p[i]);
								}
								DYKnomination.run_nom(params,p);
							}
						})
						.fail(function(data){
							DYKnomination.errors.push('Błąd pobierania tokena: $.ajax.fail().');
							DYKnomination.errors[0]();
							console.error('Błąd pobierania tokena: $.ajax.fail().');
							console.error(data);
						});
					}
				}
			}
		})
		.fail(function(data){
			DYKnomination.errors.push('Błąd pobierania listy sekcji: $.ajax.fail().');
			DYKnomination.errors[0]();
			console.error('Błąd pobierania listy sekcji: $.ajax.fail().');
			console.error(data);
		}); // returns sections and section
		// we know the section to edit (section) and if it's up-to-date (uptodate:boolean)

	}

	DYKnomination.run_nom = function (params,p) {
		for (i=0;i<p.length;i++){
			params.push(p[i]);
		}
		DYKnomination.nominate(params);
	}

	DYKnomination.nominate = function (params) {

		var debug = DYKnomination.debug;

		DYKnomination.loadbar(2);

		if (debug) {console.log(arguments)}

		var TITLE		= params[0];
		var QUESTION	= params[1];
		var FILE		= params[2];
		var IMAGES		= params[3];
		var REFS		= params[4];
		var AUTHOR		= params[5];
		var SIGNATURE	= params[6];
		var WIKIPROJECT	= params[7];
		var NR			= params[8];
		var uptodate	= params[9];
		var dzisiaj		= params[10];
		var section		= params[11];

		var summary,input;
		
		var a,i;

		// NR ready, make summary
		summary = '/* ' + NR + ' (' + TITLE + ')' + ' */ ' + DYKnomination.config.summary;

		/* making data ready */
		DYKnomination.loadbar(2);

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
			input = '== ' + dzisiaj +' ==\n' + input + '\n\n';
		}
		
		(debug ? console.log(input) : {});
	 
		/* edit */

		// Wikiprojekt:Czy wiesz
		DYKnomination.loadbar(3);
		
		$.ajax({
			url: '/w/api.php?action=edit&format=json&title=' 
				+ encodeURIComponent( (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy wiesz/propozycje')	) 
				+ '&section=' + section + (uptodate ? '&appendtext=' : '&prependtext=') + encodeURIComponent(input) 
				+ '&summary=' + encodeURIComponent(summary) + '&token=' + encodeURIComponent(DYKnomination.edittoken),
			type: 'POST'
		})
		.done(function(data){
			if (debug) {
				console.log('CzyWiesz: POST done\nserver response:');
				console.log(data);
			}
			if (data.error) {
				DYKnomination.errors.push('Błąd zgłaszania do rubryki: ' + data.error.info + '.');
				DYKnomination.errors[0]();
				console.error('Błąd zgłaszania do rubryki: ' + data.error.info + '.');
				console.error(data);
			}
			else if (WIKIPROJECT.length == 0) {
				DYKnomination.success();
			}
			else {
				// wikiprojects
				var secttitl_w = DYKnomination.config.secttitl_w;
				var a = 1;

				for (i=0;i<WIKIPROJECT.length;i++) {
					$.ajax({
						url:'/w/api.php?action=edit&format=json&title=' + encodeURIComponent('Dyskusja wikiprojektu:' + WIKIPROJECT[i]) + '&section=new' 
							+ '&sectiontitle=' + encodeURIComponent(secttitl_w) 
							+ '&text=' + encodeURIComponent('{' + '{subst:Czy wiesz - wikiprojekt|' + TITLE + '}}~' + '~' + '~' + '~') 
							+ '&summary=' + encodeURIComponent(summary) + '&token=' + encodeURIComponent(DYKnomination.edittoken),
						type:'POST'
					})
					.done(function(data){
						if (debug) {
							console.log('wikiproject['+i+']: komenda POST zakończona\nodpowiedź serwera:');
							console.log(data);
						}
						if (data.error) {
							DYKnomination.errors.push('Błąd zgłaszania do '+(i+1)+'-go wikiprojektu: ' + data.error.info + '.');
							DYKnomination.errors[0]();
							console.error('Błąd zgłaszania do '+(i+1)+'-go wikiprojektu: ' + data.error.info + '.');
							console.error(data);
						}
						else {
							DYKnomination.loadbar(3+a); // if 1st wikiproject informed then loadbar gets '4'
							a++;						// then 'a' increases so the next wikiproject will pass '5' (and increase 'a', and so on…)
						}

						if (a>WIKIPROJECT.length) {
							DYKnomination.success();
						}
					})
					.fail(function(data){
						DYKnomination.errors.push('Błąd zgłaszania do '+(i+1)+'-go wikiprojektu: $.ajax.fail().');
						DYKnomination.errors[0]();
						console.error('Błąd zgłaszania do '+(i+1)+'-go wikiprojektu: $.ajax.fail().');
						console.error('URI: /w/api.php?action=edit&format=json&title=' + encodeURIComponent('Dyskusja wikiprojektu:' + WIKIPROJECT[i]) + '&section=new' 
							+ '&sectiontitle=' + encodeURIComponent(secttitl_w) 
							+ '&text=' + encodeURIComponent('{' + '{subst:Czy wiesz - wikiprojekt|' + TITLE + '}}~' + '~' + '~' + '~') 
							+ '&token=' + encodeURIComponent(DYKnomination.edittoken));
						console.error(data);
					});
				}
			}
		})
		.fail(function(data){
			DYKnomination.errors.push('Błąd zgłaszania do rubryki: $.ajax.fail().');
			DYKnomination.errors[0]();
			console.error('Błąd zgłaszania do rubryki: $.ajax.fail().');
			console.error('URI: /w/api.php?action=edit&format=json&title=' 
				+ encodeURIComponent( (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy wiesz/propozycje') ) 
				+ '&section=' + section + (uptodate ? '&appendtext=' : '&prependtext=') + encodeURIComponent(input) 
				+ '&summary=' + encodeURIComponent(summary) + '&token=' + encodeURIComponent(DYKnomination.edittoken));
			console.error(data);
		});
		
	}

	DYKnomination.success = function () {
		var debug = DYKnomination.debug;

		if (DYKnomination.errors.length == 1) {
			DYKnomination.loadbar('done');

			$(this).dialog("destroy");
			$(this).remove();

			// end dialog: "Finished!"
			$('<div><div class="floatright"><img alt="PL Wiki CzyWiesz ikona.svg" src="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/80px-PL_Wiki_CzyWiesz_ikona.svg.png" width="80" height="80" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/120px-PL_Wiki_CzyWiesz_ikona.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/160px-PL_Wiki_CzyWiesz_ikona.svg.png 2x"></div><p style="margin-top: 10px;"><span class="template-done"><img alt="Crystal Clear app clean.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/20px-Crystal_Clear_app_clean.png" width="20" height="20" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/30px-Crystal_Clear_app_clean.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/40px-Crystal_Clear_app_clean.png 2x"><span style="display:none">T</span> <b>Załatwione</b></span></p><p style="margin-left: 10px;">Dziękujemy za <a id="CzyWieszLinkAfter" href="//pl.wikipedia.org/w/index.php?title=' + (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy_wiesz/propozycje') + '&diff=cur&oldid=0" class="external">zgłoszenie</a>,<br><a href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojekt Czy wiesz</a></p></div>')
			.dialog({ modal: true, dialogClass: "wikiEditor-toolbar-dialog", close: function() { $(this).dialog("destroy"); $(this).remove();} });
		}
		/*else {
			DYKnomination.loadbar('error');

			console.log(DYKnomination.errors);

			// end dialog: "Error!"
			$('<div><div class="floatright"><img alt="PL Wiki CzyWiesz ikona.svg" src="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/80px-PL_Wiki_CzyWiesz_ikona.svg.png" width="80" height="80" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/120px-PL_Wiki_CzyWiesz_ikona.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/160px-PL_Wiki_CzyWiesz_ikona.svg.png 2x"></div><p style="margin-top: 10px;"><span class="template-not-done"><img alt="Crystal Clear action button cancel.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/20px-Crystal_Clear_action_button_cancel.png" width="20" height="20" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/30px-Crystal_Clear_action_button_cancel.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/40px-Crystal_Clear_action_button_cancel.png 2x"><span style="display:none">N</span> <b>Niezałatwione</b></span></p><p style="margin-left: 10px;">Wystąpił błąd. Więcej informacji w konsoli przeglądarki.<br />Przepraszamy,<br /><a href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojekt Czy wiesz</a></p></div>')
			.dialog({ modal: true, dialogClass: "wikiEditor-toolbar-dialog", close: function() { $(this).dialog("destroy"); $(this).remove();} });
		}*/ // this is unnecessary as there's already a window for each error
	}


$(document).ready(function() {
	var menulink = $('<li id="t-DYKnomination"><a onclick="DYKnomination.askuser();">Zgłoś do „Czy Wiesz…”</a></li>').css({cursor: 'pointer'});
	if ($('#t-ajaxquickdelete')[0]) {$('#t-ajaxquickdelete').after(menulink);}
	else {$('#p-tb ul').append(menulink);}
});


}