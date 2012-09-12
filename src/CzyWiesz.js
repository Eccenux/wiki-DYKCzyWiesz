// ==UserScript==
// @name		test na wiki czywiesz propozycje
// @version		0.6.3
// @description	zgłaszanie czywiesza
// @include		http://pl.wikipedia.org/wiki/Wikiprojekt:Czy_wiesz/propozycj*
// @autor		Kaligula
// ==/UserScript==

//póki co (po załdowaniu strony) przy kliknięciu na tytuł strony wyświetla komunikat z linkiem (gdy dzisiejsza sekscja istnieje) lub dzisiejszą datą (gdzy nie ma dzisiejszej sekcji) i przechodzi do edycji najnowszej sekcji starając się ją najpierw wypełnić
//TO DO: dorobić okienko, w które user wpisze dane do wypełnienia przez skrypt
//TO DO: skrypt ma powiadamiać inne projekty i autora artykułu

var testscript = function test() {
	//dane do testowania skryptu (podawane potem przez uzytkownika)
	var TYTUL = 'testtitle';
	var GRAFIKA = '$grafika';
	var PYTANIE = 'pytanie?';
	var OBRAZKI = '0';
	var AUTOR = 'Autor';
	var WSTAWIAJACY = 'Wstawiajacy';
	var NR = '0'; //jedyna nie podawana przez użytkownika, tu trzeba sprawdzić ile podsekcji już jest; ostatecznie może być do uzupełnienia przez użytkownika

	//skrypt właściwy
	var miesiacArr = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
	var miesiac = miesiacArr[new Date().getMonth()]
	var dzien = new Date().getDate();
	var h2Arr = $('h2.modifiedSectionTitle > .mw-headline');
	var h2Title = '';
	var h2Nr = '';
	var uptodate = false;

	// szuka pierwszego nagłówka w formacie 'dd mmmm', bo mogą być jakieś typu 'Białowieski megaczywiesz na koniec sierpnia (ew. pocz. września)'
	for (i=0;i<h2Arr.length;i++) {
		h2Nr = i;
		h2Title = h2Arr[i].innerText;
		(mw.user.options.values.numberheadings == 1) && (h2Title = h2Title.replace(/^\d+ /,'')); // jeśli włączone jest automatyczne numerowanie nagłówków to usuwa numer
		if ((h2Title.split(' ')[0].match(/\d+/)) && (miesiacArr.indexOf(h2Title.split(' ')[1]))) { break; }
	}
	//sprawdza czy pierwszy napotkany (najnowszy) nagłówek jest z dzisiejszego dnia
	(( h2Title.split(' ')[0].match(/\d+/) == dzien ) && ( miesiacArr.indexOf(h2Title.split(' ')[1]) > -1 )) ? (uptodate = true) : (uptodate = false);
	
	console.log('uptodate:'+uptodate);

	if (GRAFIKA != '') {GRAFIKA = '[[Plik:'+GRAFIKA+'|100px|right]]\\n'} //TODO: spr czy nie trzeba obciąć "Plik:"/"File:"
	if (AUTOR != '') {AUTOR = '[[Wikipedysta|'+AUTOR+'|'+AUTOR+']]'} //TODO: spr czy podano AUTOR
	if (WSTAWIAJACY != '') {WSTAWIAJACY = '[[Wikipedysta:'+WSTAWIAJACY+'|'+WSTAWIAJACY+']]'} //TODO: a co kiedy IP?
	
	var editlinkPart1 = 'http://pl.wikipedia.org/w/index.php?title=Wikiprojekt:Czy_wiesz/propozycje&action=edit&section=1'
		+'&autoedit=s'
		+'~$'
		+'~\\n\\n'
	var editlinkPart2 = '=== ' + NR + ' (' + TYTUL + ') ===\\n'
		+ GRAFIKA
		+'…' + PYTANIE + '\\n'
		+'\\n'
		+'{{Wikiprojekt:Czy wiesz/weryfikacja|' + TYTUL + '|+|' + OBRAZKI + '|?|' + AUTOR + '|' + WSTAWIAJACY + '|?|?|?}}'
		+'~g'
		+'&autoclick=wpDiff'
		+'&autosummary=/* ' + NR + ' (' + TYTUL + ') */ nowa propozycja: ' + TYTUL;

	//TODO: encodeURIComponent odpowiednie komponenty zanim wsadzimy do linku!

	if (uptodate) {
		var editlink = editlinkPart1 + editlinkPart2;
		var msg = editlink; //jak nagłówek jest dzisiejszy to mi wyskoczy alert z tym linkiem		 
	}
	else {
		//tutaj link będzie podobny tylko na począktu trzeba dopisać nagłówek '== dzien miesiac ==\n'
		var editlink = editlinkPart1
			+'== '+dzien+' '+miesiac+' ==\\n'
			+ editlinkPart2;
		var msg = dzien + ' ' + miesiac; //jak nagłówek nie jest dzisiejszy to mi wyskoczy alert z dzisiejszą datą
	}
	console.log(msg);
	//location.href=editlink;
}

if ((document.location.href.indexOf('://pl.wikipedia.org/wiki/Wikiprojekt:Czy_wiesz/propozycje')) > -1) { //http i https
	var scr = document.createElement('script');
	scr.appendChild(document.createTextNode(testscript));
	document.body.appendChild(scr);

	document.getElementById('firstHeading').firstChild.setAttribute('onclick','test()')
}