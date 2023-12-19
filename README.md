# Wiki:Gadżet CzyWiesz

Nominacje do Czy-Wiesza aka DYKnomination (Did You Know).

## Linki

Wersja dev skryptu:
https://pl.wikipedia.org/wiki/Wikipedysta:Kaligula/js/CzyWiesz.js

## Debug

Wersja dev z włączonym debug:
```js
window.DYKnomination_is_beta = true;
mw.hook('userjs.DYKnomination.ready').add(function (DYKnomination) {
	DYKnomination.debugmode = true;
	console.log('[wp_sk] wp_sk.ready', wp_sk.version);
});
importScript('Wikipedysta:Kaligula/js/CzyWiesz.js');
```

Można też przełączyć się na debug wpisując w konsoli przeglądarki `DYKnomination.debug()` (co od razu uruchomi okienko zgłoszenia).

W trybie debug:
	– aktualne informacje pokażą się w konsoli przeglądarki;
	– zgłoszenie pójdzie na testową podstronę [[Wikipedysta:Kaligula/js/CzyWiesz.js/test]] (a nie na [[Wikiprojekt:Czy wiesz/propozycje]]);
	– informowanie autora – na analogiczną podstronę "…/autor";
	– informowanie wikiprojektu – na "…/wikiprojekt".
