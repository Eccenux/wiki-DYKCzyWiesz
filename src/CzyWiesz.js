// @name		test na wiki czywiesz propozycje
// @version		0.7.6
// @description	zgłaszanie czywiesza
// @include		http[s]?://pl.wikipedia.org/wiki/Wikiprojekt:Czy_wiesz/propozycje
// @autor		Kaligula
 
//póki co po wpisaniu w konsoli "test()" aktulane info pokażą si​ę w console.log
//TO DO: dorobić okienko, w które user wpisze dane do wypełnienia przez skrypt
//TO DO: skrypt ma powiadamiać inne projekty i autora artykułu
//TO DO: link w menu lewym Wikipedii, dodaje w pole tytułu domyślnie tytuł aktualnie oglądanego artykułu, można tam wpisać jednak inny
//TO DO: encodeURIComponent odpowiednie komponenty zanim wsadzimy do linku!
//TO DO: na końcu spr wszystkie „TODO” i „TO DO” i „console.*”
 
function test() {
	//dane do testowania skryptu (podawane potem przez uzytkownika)
	var GRAFIKA = '$grafika';
	var PYTANIE = 'moje pytanie?';
	var OBRAZKI = 0;
	var AUTOR = 'Autor';
	var PODPIS = 'Wstawiajacy';
 	
	//skrypt właściwy
	var TYTUL = wgTitle;
	var NR = 0;

	var miesiacArr = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
	var miesiac = miesiacArr[new Date().getMonth()]
	var dzien = new Date().getDate();
	console.log('dzisiaj: ' + dzien + ' ' + miesiac);
	
	var h2Arr = $('h2.modifiedSectionTitle > .mw-headline');
	var h2Title = '';
	var h2Nr = '';
	var uptodate = false;
	
	var input;
	var summary;
	
	var a,b;
 
	// szuka pierwszego nagłówka w formacie 'dd mmmm', bo mogą być jakieś typu 'Białowieski megaczywiesz na koniec sierpnia (ew. pocz. września)'
	for (i=0;i<h2Arr.length;i++) {
		h2Nr = i;
		h2Title = h2Arr[i].innerText;
		(mw.user.options.values.numberheadings == 1) && (h2Title = h2Title.replace(/^\d+ /,'')); // jeśli włączone jest automatyczne numerowanie nagłówków to usuwa numer
		if ((a = h2Title.match(/^\d+/)) && ($.inArray(h2Title.split(' ')[1],miesiacArr))) {
			( a[0] == dzien ) ? (uptodate = true) : (uptodate = false); //sprawdza czy pierwszy napotkany (najnowszy) nagłówek jest z dzisiejszego dnia
			console.log('uptodate:'+uptodate);
			break;
		}
	}	
	// mamy pierwszy interesujący nagłówek (h2Arr[h2Nr]), wiemy też czy jest z dzisiaj (uptodate:boolean)
	// sprawdzamy wszystkie parametry formularza
	
	if (typeof TYTUL == "undefined") {console.error('podaj TYTUŁ')}
	if (typeof GRAFIKA == "undefined") {GRAFIKA = '[[Plik:' + (GRAFIKA.match(/^(Plik:|File:)/i) ? GRAFIKA.replace(/^(Plik:|File:)/i,'') : {}) + '|100px|right]]\n'}
	if (typeof PYTANIE == "undefined") {
		console.error('podaj PYTANIE')
	} else {
		(PYTANIE.length > 10) ? (PYTANIE = '…' + (PYTANIE.match(/\?[\s]*$/) ? {} : (PYTANIE += '?')) + '\n') : (console.error('zadaj poprawne PYTANIE'))
	}
	if (typeof OBRAZKI == "undefined") {console.error('podaj OBRAZKI')}
	if (typeof AUTOR == "undefined") {console.error('podaj AUTORA')}
	if ( !mw.user.anonymous() ) { PODPIS = wgUserName } else { PODPIS += ' ~~' + '~~' } //TODO: a co kiedy IP?
	
	// parametry sprawdzone
	// więc tworzymy tekst do wstawienia
	// najpierw, jeśli mamy dostawić podsekcję do istniejące sekcji to trzeba wiedzieć jaki numer porządkowy (NR) ma mieć
	
	if (uptodate) {
		a = h2Arr[h2Nr].parentNode;
		while (a.nextSibling && a.nextSibling.nodeName.toLowerCase() != 'h2') {
			(a.nextSibling.nodeName.toLowerCase() == 'h3') ? (NR++) : {};
			a = a.nextSibling;
		}
	} else {
		NR++;
	}
	
	// NR mamy
	// teraz sama zawartość
	
	input = '=== ' + NR + ' (' + TYTUL + ') ===\n'
		+ GRAFIKA
		+ PYTANIE
		+ '{{Wikiprojekt:Czy wiesz/weryfikacja|' + TYTUL + '|+|' + OBRAZKI + '|?|' + AUTOR + '|' + PODPIS + '|?|?|?}}';

	// tekst gotowy
	// określamy czy dodajemy nową sekcję czy nie

	if (uptodate) { // jeśli jest aktualny to dodajemy na końcu jego sekcji nową podsekcję
		input = '\n\n' + input
	} else { // jesli nie  aktualny to dodajemy na początku przed jego sekcją nową sekcję z podsekcją
		input = '== ' + dzien + ' ' + miesiac +' ==\n' + input + '\n\n';
	}
 
	// i tutaj dochodzi do rzeczywistej edycji

	if (b) {
	/* get raw section code */
	$.ajax({
		url: '/w/index.php?action=raw&title=' + mw.util.wikiUrlencode(wgPageName) + '&section=' + section,
		cache: false
		}).done(function(rawsection){
 
		/* get edittoken */
		$.ajax('/w/api.php?action=query&prop=info&format=json&intoken=edit&indexpageids=&titles=' + encodeURI(wgPageName)).done(function(token_data){
			var edittoken = token_data.query.pages[token_data.query.pageids[0]].edittoken;
 
			/* edit section – mark it as done with {{załatwione}} */
			$.ajax({
				url: '/w/api.php?action=edit&format=json&title=' + encodeURI(wgPageName + '&section=' + section + '&text=' + (uptodate ? (rawsection + input) : (input + rawsection)) + '&summary=' + summary + '&token=') + mw.util.rawurlencode(edittoken),
				type: 'POST'
			}).done(function(data){
			var newrevid = data.edit.newrevid;
 
				/* reload section – get changed section raw code 
				$.ajax({
					url: '/w/index.php?action=raw&title=' + mw.util.wikiUrlencode(wgPageName) + '&section=' + section + '&oldid=' + newrevid,
					cache: false
					}).done(function(text_after){
 
					/* reload section – parse code to html 
					$.ajax('/w/api.php?action=parse&format=json&title=' + encodeURI(wgPageName + '&text=' + text_after) + '&prop=text').done(function(html_after){
 
						/* reload section – update html of the section
						var j = $('.editsection')[section].parentNode;
						while ((j.nextElementSibling) && (j.nextElementSibling.tagName.charAt(0).toLowerCase() != 'h')) {$(j.nextElementSibling).remove()}
						j.outerHTML = html_after.parse.text['*'];
					});
				});*/
			});
		});
	});
	}
	
	// powiadamianie autora artykułu
	// …
	
	// powiadamianie wikiprojektu
	// …

}
 
//if ((document.location.pathname == '/wiki/Wikiprojekt:Czy_wiesz/propozycje' ) || (wgNamespaceNumber == 0)){ //http i https
//	document.getElementById('firstHeading').firstChild.setAttribute('onclick','test()')
//}