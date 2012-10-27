// @name		test na wiki czywiesz propozycje
// @version		0.8.0
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
	var NR = 1;

	var miesiacArr = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
	var miesiac = miesiacArr[new Date().getMonth()]
	var dzien = new Date().getDate();
	console.log('dzisiaj: ' + dzien + ' ' + miesiac);
	
//	var h2Arr = $('h2.modifiedSectionTitle > .mw-headline');
	var h2Nr = '';
	var uptodate = false;
	
	var input;
	var summary = '/* ' + TYTUL + ': */ nowa sekcja';
	
	var a,b;
 
	// szuka pierwszego nagłówka w formacie 'dd mmmm', bo mogą być jakieś typu 'Białowieski megaczywiesz na koniec sierpnia (ew. pocz. września)'
	$.ajax({url: '/w/api.php?action=mobileview&format=json&page=Wikiprojekt%3ACzy%20wiesz%2Fpropozycje&prop=sections&sectionprop=level%7Cline%7Cnumber%7Canchor&noimages=',
			async: false})
	.done(function(data){
		sections = data.mobileview.sections;
		for (var i=0; i<sections.length; i++){
			var a = sections[i].line.match(/^\d+/);
			var b = sections[i].line.split(' ');
			if ((sections[i].level == 2) && (a) && ($.inArray(b[1],miesiacArr))) {
				( (a[0] == dzien) && (b[1] == miesiac) ) ? (uptodate = true) : (uptodate = false); //sprawdza czy pierwszy napotkany (najnowszy) datowany nagłówek jest z dzisiejszego dnia
				h2Nr = i;
				console.log(h2Nr + ' (uptodate: ' + uptodate + ')');
				break;
			}
		}	
	}) // zwraca sections i h2Nr
	// mamy pierwszy interesujący nagłówek (h2Nr), wiemy też czy jest z dzisiaj (uptodate:boolean)
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
		_h2Nr = h2Nr+1;
		while (sections[_h2Nr] && sections[_h2Nr].level != 2) {
			(sections[_h2Nr].level == 3) ? (NR++) : {};
			_h2Nr++;
		}
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
 
			/* edit and save section */
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

	return input;

}
 
//if ((document.location.pathname == '/wiki/Wikiprojekt:Czy_wiesz/propozycje' ) || (wgNamespaceNumber == 0)){ //http i https
//	document.getElementById('firstHeading').firstChild.setAttribute('onclick','test()')
//}