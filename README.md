# Wiki:Gadżet CzyWiesz

Nominacje do Czy-Wiesza aka DYKnomination (Did You Know).

## Linki

Wersja dev skryptu:
- https://pl.wikipedia.org/wiki/Wikipedysta:Kaligula/js/CzyWiesz.js
- https://pl.wikipedia.org/wiki/Wikipedysta:Nux/CzyWiesz-dev.js

Instrukcja: [Wikipedia:Narzędzia/CzyWiesz](https://pl.wikipedia.org/wiki/Wikipedia:Narz%C4%99dzia/CzyWiesz)
(na tej stronie wyświetlany jest również *Numer aktualnej wersji*)

## Budowanie gadżetu

Gadżet jest budowany w [Node.js](https://nodejs.org/en) (w miarę dowolny Node, ale pewnie przynajmniej v16).

Do pracy zalecyny jest VSCode, ale można budować wszystko z linii poleceń.
```bash
npm i
npm run test
npm run build
```

Do wdrażania potrzebny jest `bot.config.mjs` (o ile chcesz wdrażać jednym kliknięciem).
- Hasło utworzysz w: https://test.wikipedia.org/wiki/Special:BotPasswords/Wikiploy
- Przykład konfiguracji: https://github.com/Eccenux/Wikiploy/blob/main/assets/public--bot.config.mjs

Więcej info: [*Deploy script* w instrukcji z Wikiploy](https://github.com/Eccenux/Wikiploy/blob/main/README.building%20your%20project.md#deploy-script)

## Debug

Wersja dev z włączonym debug:
```js
// testowa wersja DYK [[Wikipedia:Narzędzia/CzyWiesz]]
if ([0, 2].includes(mw.config.get('wgNamespaceNumber'))) {
	mw.loader.using("mediawiki.util, jquery.ui, ext.gadget.lib-wikiprojects".split(/, ?/)).then(function() {
		window.DYKnomination_is_beta = true;
		mw.hook('userjs.DYKnomination.loaded').add(function (DYKnomination) {
			console.log('[DYKnomination]', 'loaded v' + DYKnomination.about.version);
			DYKnomination.options.enabledClose = true;
			DYKnomination.debugmode = true;
		});
		importScript('Wikipedysta:Nux/CzyWiesz-dev.js');
	});
}
// Możliwość normalnego zamykania zgłoszeń (DoneHandling) i test kodu gadżetu
if ([102].includes(mw.config.get('wgNamespaceNumber'))) {
	mw.loader.using("mediawiki.util, jquery.ui, ext.gadget.lib-wikiprojects".split(/, ?/)).then(function() {
		mw.hook('userjs.DYKnomination.loaded').add(function (DYKnomination) {
			console.log('[DYKnomination]', 'loaded v' + DYKnomination.about.version);
			DYKnomination.options.enabledClose = true;
		});
		importScript('MediaWiki:Gadget-CzyWiesz.js');
	});
}
```

Można też przełączyć się na debug wpisując w konsoli przeglądarki `DYKnomination.debug()` (co od razu uruchomi okienko zgłoszenia). Aczkolwiek lepiej użyć hooka `userjs.DYKnomination.loaded`.

W trybie debug:

- aktualne informacje pokażą się w konsoli przeglądarki;
- zgłoszenie pójdzie na testową podstronę [Nux/CzyWieszTest/propozycje](https://pl.wikipedia.org/wiki/Wikipedysta:Nux/CzyWieszTest/propozycje) (a nie na [[Wikiprojekt:Czy wiesz/propozycje]]);
- informowanie autora – na analogiczną podstronę "…/autor";
- informowanie wikiprojektu – na "…/wikiprojekt".

Bazowa strona do zgłoszeń w trybie debug jest ustawiona w `config.js` (`config.debugBase`).
