# Wiki:Gadżet CzyWiesz

Nominacje do Czy-Wiesza aka DYKnomination (Did You Know).

## Linki

Wersja dev skryptu:
- https://pl.wikipedia.org/wiki/Wikipedysta:Kaligula/js/CzyWiesz.js
- https://pl.wikipedia.org/wiki/Wikipedysta:Nux/CzyWiesz-dev.js

## Debug

Wersja dev z włączonym debug:
```js
// testowa wersja DYK [[Wikipedia:Narzędzia/CzyWiesz]]
if (mw.config.get('wgNamespaceNumber') === 0 || mw.config.get('wgPageName')=='Wikipedia:Narzędzia/CzyWiesz') {
	mw.loader.using("mediawiki.util, jquery.ui, ext.gadget.lib-wikiprojects".split(/, ?/)).then(function() {
		window.DYKnomination_is_beta = true;
		mw.hook('userjs.DYKnomination.loaded').add(function (DYKnomination) {
			console.log('[DYKnomination]', 'loaded v' + DYKnomination.version);
			DYKnomination.debugmode = true;
		});
		importScript('Wikipedysta:Nux/CzyWiesz-dev.js');
	});
}
```

Można też przełączyć się na debug wpisując w konsoli przeglądarki `DYKnomination.debug()` (co od razu uruchomi okienko zgłoszenia).

W trybie debug:
	– aktualne informacje pokażą się w konsoli przeglądarki;
	– zgłoszenie pójdzie na testową podstronę [[Wikipedysta:Kaligula/js/CzyWiesz.js/test]] (a nie na [[Wikiprojekt:Czy wiesz/propozycje]]);
	– informowanie autora – na analogiczną podstronę "…/autor";
	– informowanie wikiprojektu – na "…/wikiprojekt".
