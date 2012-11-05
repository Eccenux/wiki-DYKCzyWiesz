/*

    INSTALACJA:
    do swojego commons.js wkleić obie poniższe linijki

// testowanie skryptu zgłaszania czywiesza [[Wikipedysta:Kaligula/js/CzyWiesz.js]]
importScript('Wikipedysta:Kaligula/js/CzyWiesz.js');

    !! linijka górna pozwoli skontaktować się z użytkownikami skryptu
       w przypadku niektórych zmian w kodzie !!

*/
// @name		test na wiki czywiesz propozycje
// @version		0.9.4 beta
// @description	zgłaszanie czywiesza
// @include		http[s]?://pl.wikipedia.org/wiki/Wikiprojekt:Czy_wiesz/propozycje
// @autor		Kaligula
 
//póki co po wpisaniu w konsoli "DYKnomination('','',true)" aktulane info pokażą si​ę w console.log
//TO DO: pozamieniać taby na spacje, żeby się db wyświetlało na wiki
//TO DO: dorobić wybór obrazków z artykułu przy zgłaszaniu grafiki [?]
//TO DO: encodeURIComponent odpowiednie komponenty zanim wsadzimy do linku! [?]
//TO DO: jeśli skrypt będzie już przetestowany to usunąć wszystkie 'debug' [?]
//TO DO: na końcu spr wszystkie „TODO” i „TO DO” i „console.*”
 
function DYKnomination(mode,params,debug) {

	var wikiprojects = ['Albumy muzyczne',
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
						'Życie codzienne'];

	if ( (typeof mode != 'string') || (mode != 'do') ){

		var debug = (typeof debug == 'boolean') ? debug : false;

		var TYTUL = wgPageName.replace('_',' ');
		var PODPIS = (wgUserName ? {name: wgUserName,disabled: ' disabled'} : {name: '',disabled: ''} ); //TODO: a co kiedy IP?
		//var PODPIS = (wgUserName ? [wgUserName,' disabled'] : ['~' + '~' + '~',''] );
		var WIKIPROJEKT=[];
		var PYTANIE, GRAFIKA, OBRAZKI, AUTOR;

		//workaround for Opera - the textarea must be inserted to a visible element

		var $title_paragraph = $('<p></p>')
			.html('Tytuł artykułu: <input type="text" id="CzyWieszTitle" name="CzyWieszTitle" value="' + TYTUL + '" style="width: 484px;">');

		var $question_paragraph = $('<p><strong>Zaproponuj pytanie:</strong></p>');

		var $question_textarea_paragraph = $('<p></p>')
			.html('<textarea id="CzyWieszQuestion" style="width: 570px;" rows="2" value="" autofocus></textarea>');

		var $file_row = $('<tr></tr>')
			.html('<td style="width: 36%;"><input type="checkbox" id="CzyWieszFile1" name="CzyWieszFile1"> Zaproponuj zdjęcie/grafikę: </td>' // style="width: 36%;
				+ '<td><tt>[[Plik:</tt><input type="text" id="CzyWieszFile2" name="CzyWieszFile2" style="width: 52%;" disabled><tt>|100px|right]]</tt></td>');

		var $images_row = $('<tr></tr>')
			.html('<td>Liczba grafik w artykule: </td>'
				+ '<td><input type="text" id="CzyWieszImages" name="CzyWieszImages" value="' + $('#mw-content-text .thumb').length + '"' 
				+ 'style="width: 8%;text-align: right;margin-left: 2px;" disabled></td>');

		var $author_row = $('<tr></tr>')
			.html('<td>Główny autor artykułu: </td>'
				+ '<td><input type="text" id="CzyWieszAuthor" name="CzyWieszAuthor" style="width: 50%;margin-left: 2px;"></td>');

		var $signature_row = $('<tr></tr>')
			.html('<td>Twój podpis: </td>'
				+ '<td><input type="text" id="CzyWieszSignature" name="CzyWieszSignature" value="' 
				+ PODPIS.name + '" style="width: 50%;margin-left: 2px;"' + PODPIS.disabled + '></td>');

		var $loading_bar = $('<div id="DYK-loader-bar"></div>')
			.css({width: '100%', backgroundColor: 'rgb(220, 220, 220)', border: '1px solid rgb(187, 187, 187)', borderRadius: '3px'})
			.html('<p id="DYK-loader-bar-paragraph" style="margin: 0 0 0 7px; position: absolute;">&nbsp;</p>'
				+ '<div id="DYK-loader-bar-inner" style="width: 0; height: 20px; background-color: #ABEC46; border: none; border-radius: 3px;"></div>');

		//wikiproject row
		$wikiproject_select = $('<select class="czywiesz-wikiproject"></select>').css('vertical-align', 'middle'); // TO DO: !!!zmienna globalna $wikiproject_select
		$wikiproject_select.append('<option value="none">żaden</option>');
		for (i=0;i<wikiprojects.length;i++)
		{
			if (typeof(wikiprojects[i]) == 'function') continue; //on IE wikibits adds indexOf method for arrays. skip it.
			$('<option value="' + i + '">' + wikiprojects[i] + '</option>').appendTo($wikiproject_select);
		}
		var $wikiproject_row = $('<span id="czywiesz-wikiproject-container"></span>').append($wikiproject_select.clone());
 		$wikiproject_row = $('<td></td>').append($wikiproject_row)
			.append('<a href="javascript:$(\'#czywiesz-wikiproject-container\').append($wikiproject_select.clone());' 
			+'$(\'#DYK-loader-bar\')[0].parentNode.style.height = (+$(\'#DYK-loader-bar\')[0].parentNode.style.height.split(\'px\')[0]+24)+\'px\';">(+)</a>');
		$wikiproject_row = $('<tr></tr>').append('<td>Powiadom wikiprojekt(y): </td>').append($wikiproject_row);
 
		//rules paragraph
		var $rules_paragraph = $('<p></p>')
			.html('<small>Zgłaszaj hasła nie później niż 10 dni od powstania lub rozbudowania hasła, posiadające źródła najlepiej w formie przypisów i zawierające co najmniej 2kb samej treści.</small>');
 
		//build the dialog
		var $dialog = $('<table></table>').css('width','100%').append($file_row).append($images_row).append($author_row)
			.append($signature_row).append($wikiproject_row);
		var $dialog = $('<div></div>').append($title_paragraph).append($question_paragraph).append($question_textarea_paragraph)
			.append($dialog).append($rules_paragraph).append($loading_bar);
 
		//main buttons
		var buttons = {
			"Zgłoś": function() {

				//get the question
				TYTUL = $('#CzyWieszTitle').val().replace(/^\s*(.*?)\s*$/,'$1'); //usuwa zbędne spacje na początku i końcu
				PYTANIE = $('#CzyWieszQuestion').val().replace(/(.*?)(--)?~{3,5}\s*$/,'$1').replace(/^\s*(.*?)\s*$/,'$1'); //usuwa zbędne spacje na początku i końcu oraz podpis
				GRAFIKA = ( $('#CzyWieszFile1').attr('checked') ? $('#CzyWieszFile2').val().replace(/^\s*(.*?)\s*$/,'$1') : '' ); //usuwa zbędne spacje na początku i końcu
				OBRAZKI = $('#CzyWieszImages').val().replace(/^\s*(.*?)\s*$/,'$1'); //usuwa zbędne spacje na początku i końcu
				AUTOR = $('#CzyWieszAuthor').val().replace(/^\s*(.*?)\s*$/,'$1'); //usuwa zbędne spacje na początku i końcu
				PODPIS = $('#CzyWieszSignature').val().replace(/^\s*(.*?)\s*$/,'$1'); //usuwa zbędne spacje na początku i końcu

				//validate form
				if (typeof TYTUL != 'string' || TYTUL == '') {console.error('podaj TYTUŁ')}
				if (typeof GRAFIKA == 'string' && GRAFIKA != '') {
					GRAFIKA = '[[Plik:' + (GRAFIKA.match(/^(Plik:|File:)/i) ? GRAFIKA.replace(/^(Plik:|File:)/i,'') : (GRAFIKA)) + '|100px|right]]\n'
				}
				if (typeof PYTANIE != 'string' || PYTANIE === '') {
					console.error('podaj PYTANIE')
				}
				else {
					(PYTANIE.length > 10) ? (PYTANIE = '…' + (PYTANIE.match(/\?[\s]*$/) ? (PYTANIE) : (PYTANIE += '?')) + '\n') : (console.error('zadaj poprawne PYTANIE'))
				}
				if (typeof OBRAZKI != 'string' || OBRAZKI === '') {console.error('podaj OBRAZKI')}
				if (typeof AUTOR != 'string' || AUTOR === '') {console.error('podaj AUTORA')}
				if (typeof PODPIS != 'string' || PODPIS === '') {console.error('podaj AUTORA')}

				//get the wikiprojects
				var $projsel = $('.czywiesz-wikiproject');
				$projsel.each( function(index) {
					var val = $(this).val();
					if (val != 'none') {
						WIKIPROJEKT.push(wikiprojects[val]);
					}
				});
				
				var $params = [TYTUL, PYTANIE, GRAFIKA, OBRAZKI, AUTOR, PODPIS, WIKIPROJEKT];
				DYKnomination('do',$params,debug);

				setInterval(function(){
					//$('#CzyWieszQuestion').remove();
					$(this).dialog("destroy");
					$(this).remove();
				},1000);
			},
			"Anuluj" : function() {
				$(this).dialog("close");
			}
		};
 
		$dialog.dialog({
		  width: 600,
		  modal: true,
		//title: 'Zgłaszanie artykułu do rubryki „Czy wiesz…”' + (debug ? ' <small id="DYKnomination-dialog-debug" style="display:none;">(debug)</small>' : ''),
		  title: 'Zgłaszanie artykułu do rubryki „Czy wiesz…”',
		  draggable: true,
		  dialogClass: "wikiEditor-toolbar-dialog",
		  close: function() { $(this).dialog("destroy"); $(this).remove();},
		  buttons: buttons
		});

		//insert the main textarea
		//$('#title-textarea-paragraph').html('<textarea id="CzyWieszTitle" style="width: 98%;" rows="1" value="">' + TYTUL + '</textarea>');
		//$('#czywiesz-textarea-paragraph').html('<textarea id="CzyWieszQuestion" style="width: 570px;" rows="2" value="" autofocus></textarea>');
		//$('#author-textarea-paragraph').html('<textarea id="CzyWieszAuthor" style="width: 98%;" rows="1" value=""></textarea>');
		//$('#images-textarea-paragraph').html('<textarea id="CzyWieszImages" style="width: 98%;" rows="1" value="" disabled>' + $('#mw-content-text .thumb').length + '</textarea>'); //automatyczne zliczanie obrazków tylko jeśli wgPageName jest niezmieniane p/usera!
		//$('#file-textarea-paragraph').html('<textarea id="CzyWieszFile" style="width: 98%;" rows="1" value=""></textarea>');
		//$('#signature-textarea-paragraph').html('<textarea id="CzyWieszSignature" style="width: 98%;" rows="1" value=""' + PODPIS[1] + '>' + PODPIS[0] + '</textarea>');
 
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
		$('#CzyWieszTitle').change(function(){
			$('#CzyWieszImages').removeAttr('disabled');
			$('#CzyWieszImages').val('');
		});
		$('#CzyWieszFile1').change(function(){
			var a=$('#CzyWieszFile2');
			(a.attr('disabled') ? a.removeAttr('disabled') : a.attr('disabled','true'))
		})
		$('#CzyWieszQuestion').keyup();
		$('#CzyWieszQuestion').focus();

	}
	else if (mode == 'do'){

		//$('#DYK-loader-bar').css({display: 'block'});
		$('#DYK-loader-bar-paragraph').text('Pobieram dane z formularza…');

		if (debug) {
			//dane do debugowania skryptu
			//var TYTUL       = 'Wikipedysta:Kaligula/js/CzyWiesz.js/Wikiprojekt:Czy wiesz/propozycje';
			var TYTUL       =  'Tytul strony';
			var PYTANIE     = '…czy skrypt dobrze działa?\n';
			var GRAFIKA     = '[[Plik:Face-monkey.svg|100px|right]]\n';
			var OBRAZKI     =  999;
			var AUTOR       = 'Autor';
			var PODPIS      = 'Wstawiajacy';
			var WIKIPROJEKT =  [];
		}
		else {
			var TYTUL       = params[0];
			var PYTANIE     = params[1];
			var GRAFIKA     = params[2];
			var OBRAZKI     = params[3];
			var AUTOR       = params[4];
			var PODPIS      = params[5];
			var WIKIPROJEKT = params[6];
		}
		
		//skrypt właściwy
		var NR = 1;

		var miesiacArr = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
		var data = new Date();
		var dzien = data.getDate();
		var miesiac = miesiacArr[data.getMonth()];
		var rok = data.getYear()+1900;
		(debug ? console.log('dzisiaj: ' + dzien + ' ' + miesiac) : {});
		
		var tasks = WIKIPROJEKT.length;

		var uptodate = false;
		
		var edittoken;
		var input;
		var summary = '/* ' + TYTUL + ' */ nowa sekcja';
//		var sectiontitle_author = 'Czy wiesz – zgłoszenie';
//		var sectiontitle_discussion = 'Czy wiesz – zgłoszenie';
		var sectiontitle_wikiproject = 'Czy wiesz – zgłoszenie';
		
		var a,b,i;

		/* przygotowujemy miejsce edycji */
		$('#DYK-loader-bar-inner').css({width: '8%'});
		$('#DYK-loader-bar-paragraph').text('Sprawdzam stronę zgłoszeń…');

		// szuka pierwszego nagłówka w formacie 'dd mmmm', bo mogą być jakieś typu 'Białowieski megaczywiesz na koniec sierpnia (ew. pocz. września)'
		// $.ajax({url: '/w/api.php?action=mobileview&format=json&page=Wikiprojekt%3ACzy%20wiesz%2Fpropozycje&prop=sections&sectionprop=level%7Cline%7Cnumber%7Canchor&noimages=',
		$.ajax({url: '/w/api.php?action=mobileview&format=json&page=' + (debug ? 'Wikipedysta%3AKaligula%2Fjs%2FCzyWiesz.js%2F' : '') + 'Wikiprojekt%3ACzy%20wiesz%2Fpropozycje&prop=sections&sectionprop=level%7Cline%7Cnumber%7Canchor&noimages=',
				cache: false,
				async: false
		}).done(function(data){
			sections = data.mobileview.sections;
			for (i=0; i<sections.length; i++){
				if (sections[i].line) {
					var a = sections[i].line.match(/^\d+/);
					var b = sections[i].line.split(' ');
					if ((sections[i].level == 2) && (a) && ($.inArray(b[1],miesiacArr))) {
						( (a[0] == dzien) && (b[1] == miesiac) ) ? (uptodate = true) : (uptodate = false); //sprawdza czy pierwszy napotkany (najnowszy) datowany nagłówek jest z dzisiejszego dnia
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
		}); // zwraca sections i section
		// mamy pierwszy interesujący nagłówek (section), wiemy też czy jest z dzisiaj (uptodate:boolean)
		// więc tworzymy tekst do wstawienia

		// najpierw, jeśli mamy dostawić podsekcję do istniejące sekcji to trzeba wiedzieć jaki numer porządkowy (NR) ma mieć
		if (uptodate) {
			i = section+1;
			while (sections[i] && sections[i].level != 2) {
				(sections[i].level == 3) ? (NR++) : {};
				i++;
			}
		}
		
		// NR mamy

		/* przygotowujemy dane do edycji */
		$('#DYK-loader-bar-inner').css({width: '16%'});
		$('#DYK-loader-bar-paragraph').text('Przygotowuję dane do wysłania​…');

		// teraz sama zawartość
		
		input = '=== ' + NR + ' (' + TYTUL + ') ===\n'
			+ GRAFIKA
			+ PYTANIE
			+ '{' + '{Wikiprojekt:Czy wiesz/weryfikacja|' + TYTUL + '|+|' + OBRAZKI + '|?|' + AUTOR + '|' + PODPIS + '|?|?|?}}';

		// tekst gotowy
		// określamy czy dodajemy nową sekcję czy nie

		if (uptodate) { // jeśli jest aktualny to dodajemy na końcu jego sekcji nową podsekcję
			input = '\n\n' + input;
		}
		else { // jesli nie  aktualny to dodajemy na początku przed jego sekcją nową sekcję z podsekcją
			input = '== ' + dzien + ' ' + miesiac +' ==\n' + input + '\n\n';
		}
		
		(debug ? console.log(input) : {});
	 
		/* edytujemy */

		// i tutaj dochodzi do rzeczywistej edycji

		/* get edittoken */
		if (typeof mw.user.tokens.values.editToken == "string") {
			edittoken = mw.user.tokens.values.editToken;
		}
		else {
			$.ajax({url:'/w/api.php?action=query&prop=info&format=json&intoken=edit&indexpageids=&titles=' + encodeURI(TYTUL),
				cache: false,
				async: false
			}).done(function(data){
				edittoken = data.query.pages[data.query.pageids[0]].edittoken;
				(debug ? ( console.log('DYK: POST done\nserver response:') && console.log(data) ) : {});
			}).fail(function(data){
				console.error('edittoken: POST error');
				console.error('server response:');
				console.error(data);
			});
		}
		(debug ? console.log(edittoken) : {});

		/* edit and save section */

		// zgłaszanie do CzyWiesza
		$('#DYK-loader-bar-inner').css({width: '24%'});
		$('#DYK-loader-bar-paragraph').text('Zgłaszam propozycję…');
		$.ajax({
			url: '/w/api.php?action=edit&format=json&title=' + encodeURI( (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/' : '') + 'Wikiprojekt:Czy wiesz/propozycje' + '&section=' + section + (uptodate ? '&appendtext=' : '&prependtext=') + input + '&summary=' + summary + '&token=') + mw.util.rawurlencode(edittoken),
			type: 'POST',
			async: false
		}).done(function(data){ //spr czy nie ma erroru
			(debug ? console.log('DYK: POST done\nserver response:') : {});
			(debug ? console.log(data) : {});
			
		}).fail(function(data){
			console.error('DYK: POST error');
			console.error('URI: /w/api.php?action=edit&format=json&title=' + encodeURI( 
				+ (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/' : '') + 'Wikiprojekt:Czy wiesz/propozycje' 
				+ '&section=' + section + (uptodate ? '&appendtext=' : '&prependtext=') + input 
				+ '&summary=' + summary + '&token=') + mw.util.rawurlencode(edittoken));
			console.error('server response:');
			console.error(data);
		});
		
/*		// powiadamianie autora artykułu
		$('#DYK-loader-bar-inner').css({width: 4*(100/tasks) + '%'});
		$('#DYK-loader-bar-paragraph').text('Zgłaszam autorowi…');
		$.ajax({
			url:'/w/api.php?action=edit&format=json&title=' + encodeURI('Dyskusja wikipedysty:' + AUTOR) + '&section=new' 
				+ '&sectiontitle=' + encodeURI(sectiontitle_author) 
				+ '&text=' + encodeURI('{' + '{subst:Czy wiesz - autor|tytuł strony=[[' + TYTUL + ']]|dzień=' + dzien + '|miesiąc=' + miesiac + '|rok=' + rok + '|więcej stron=}}~' + '~' + '~' + '~') 
				+ '&token=' + mw.util.rawurlencode(edittoken),
			type:'POST',
			async: false
		}).done(function(){ //spr czy nie ma erroru
			(debug ? console.log('author: POST done') : {});
			// …
			
		}).fail(function(){
			console.error('author: POST error');
			console.error('URI: /w/api.php?action=edit&format=json&title=' + encodeURI('Dyskusja wikipedysty:' + AUTOR) + '&section=new' 
				+ '&sectiontitle=' + encodeURI(sectiontitle_author) 
				+ '&text=' + encodeURI('{' + '{subst:Czy wiesz - autor|tytuł strony=[[' + TYTUL + ']]|dzień=' + dzien + '|miesiąc=' + miesiac + '|rok=' + rok + '|więcej stron=}}~' + '~' + '~' + '~') 
				+ '&token=' + mw.util.rawurlencode(edittoken));
		});
		
		// wstawianie do dyskusji hasła
		$('#DYK-loader-bar-inner').css({width: 5*(100/tasks) + '%'});
		$('#DYK-loader-bar-paragraph').text('Wklejam do dyskusji artykułu…');
		$.ajax({
			url:'/w/api.php?action=edit&format=json&title=' + encodeURI('Dyskusja:' + TYTUL) + '&section=new' 
			+ '&sectiontitle=' + encodeURI(sectiontitle_discussion) 
			+ '&text=' + encodeURI('{' + '{Czy wiesz - artykuł|data=[[' + dzien + ' ' + miesiac + ']] [[' + rok + ']]}}~' + '~' + '~' + '~') 
			+ '&token=' + mw.util.rawurlencode(edittoken),
			type:'POST',
			async: false
		}).done(function(){ //spr czy nie ma erroru
			(debug ? console.log('discussion: POST done') : {});
			// …
			
		}).fail(function(){
			console.error('discussion: POST error');
			console.error('URI: /w/api.php?action=edit&format=json&title=' + encodeURI('Dyskusja:' + TYTUL) + '&section=new' 
			+ '&sectiontitle=' + encodeURI(sectiontitle_discussion) 
			+ '&text=' + encodeURI('{' + '{Czy wiesz - artykuł|data=[[' + dzien + ' ' + miesiac + ']] [[' + rok + ']]}}~' + '~' + '~' + '~') 
			+ '&token=' + mw.util.rawurlencode(edittoken));
		});
*/

		// powiadamianie wikiprojektu
		$('#DYK-loader-bar-paragraph').text('Zgłaszam do wikiprojektu/ów…');
		for (i=0;i<WIKIPROJEKT.length;i++) {
			$('#DYK-loader-bar-inner').css({width: 50*(1+i/tasks) + '%'});
			$.ajax({
				url:'/w/api.php?action=edit&format=json&title=' + encodeURI('Dyskusja wikiprojektu:' + WIKIPROJEKT[i]) + '&section=new' 
				+ '&sectiontitle=' + encodeURI(sectiontitle_wikiproject) 
				+ '&text=' + encodeURI('{' + '{subst:Czy wiesz - wikiprojekt|' + TYTUL + '}}~' + '~' + '~' + '~') 
				+ '&token=' + mw.util.rawurlencode(edittoken),
				type:'POST',
				async: false
			}).done(function(data){ //spr czy nie ma erroru
				(debug ? ( console.log('wikiproject['+i+']: POST done\nserver response:') && console.log(data) ) : {});
				// …
				
				
			}).fail(function(data){
				console.error('wikiproject: POST error');
				console.error('URI: /w/api.php?action=edit&format=json&title=' + encodeURI('Dyskusja wikiprojektu:' + WIKIPROJEKT[i]) + '&section=new' 
				+ '&sectiontitle=' + encodeURI(sectiontitle_wikiproject) 
				+ '&text=' + encodeURI('{' + '{subst:Czy wiesz - wikiprojekt|' + TYTUL + '}}~' + '~' + '~' + '~') 
				+ '&token=' + mw.util.rawurlencode(edittoken));
				console.error('server response:');
				console.error(data);
			});
		}
		$('#DYK-loader-bar-inner').css({width: '100%'});
		$('#DYK-loader-bar-paragraph').text('Zakończono!');
	}
}

$(document).ready(function() {
	var menulink = '<li id="t-DYKnomination"><a href="javascript:DYKnomination();">Zgłoś do „Czy Wiesz…”</a></li>';
	if ($('#t-ajaxquickdelete')[0]) {$('#t-ajaxquickdelete').after(menulink);}
	else {$('#p-tb ul').append(menulink);}
});