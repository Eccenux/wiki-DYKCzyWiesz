/* eslint-disable no-useless-escape */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
/* eslint-disable array-bracket-newline */
/**
 * Nominacje do Czy-Wiesza aka DYKnomination (Did You Know).
 * 
 * Instrukcja:
 * [[Wikipedia:Narzędzia/CzyWiesz]]
 * 
 * Historia zmian:
 * https://pl.wikipedia.org/w/index.php?title=MediaWiki:Gadget-CzyWiesz.js&action=history
 * 
 * Repozytorium:
 * https://github.com/Eccenux/wiki-DYKCzyWiesz
 * 
 * Wdrożone za pomocą: [[Wikipedia:Wikiploy]]
 */
var DYKnomination = {};

/** About (meta). */
DYKnomination.about = {
	version    : '6.0.0' + (window.DYKnomination_is_beta===true?'beta':''),
	beta	   : (window.DYKnomination_is_beta===true?true:false),
	author     : 'Kaligula',
	authorlink : '[[w:pl:user:Kaligula]]',
	homepage   : '[[w:pl:Wikipedia:Narzędzia/CzyWiesz]]',
	credits    : 'Matma Rex (for HUGE help), Tomasz Wachowski (for testing)'
}

/** Init the DYK object. */
function createFullDyk(DYKnomination) {
	const { ErrorInfo } = require("./ErrorInfo");
	const { apiAsync } = require("./asyncAjax");
	const { config } = require("./config");
	
	DYKnomination.config = config;

	/** Base page for nominations. */
	DYKnomination.getBaseNew = function () {
		return this.debugmode ? config.debugBase + '/propozycje' : 'Wikiprojekt:Czy wiesz/propozycje';
	}
	/** Page for rated. */
	DYKnomination.getBaseDone = function () {
		return this.debugmode ? config.debugBase + '/ocenione' : 'Wikiprojekt:Czy wiesz/ocenione';
	}
	/** Nomination subpage. */
	DYKnomination.getNominationPage = function (currentDate, title) {
		const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
		const base = this.getBaseNew();
		return base + '/' + formattedDate + '/' + title;
	}

	/**
	 * List of wikiprojects.
	 */
	DYKnomination.wikiprojects = {
		list :  [], // populated on askuser() from [[Wikipedia:Wikiprojekt/Spis wikiprojektów]] by DYKnomination.wikiprojects.load() (see below)
		list2 : [   /*****
				 * List of wikiprojects which aren't on above list and should appear on the list of wikiprojects to be notified.
				 *
				 * Objects containing following fields:
				 * label - text which will appear in the dropdown menu
				 * page - location of the wikiproject. If type is 'talk', page should point to the
				 *        wikiproject talk page
				 * type - 'section' or 'talk'
				 *        - 'section' - the template will be put on the wikiproject main page, after a line
				 *                    "<!-- Nowe zgłoszenia CzyWiesza wstawiaj poniżej tej linii. Nie zmieniaj i nie usuwaj tej linii -->" (without quotes)
				 *        - 'talk' - the template will be placed in a new section on the wikiproject talk page.
				 */
			],
		load : function () {
			var D = DYKnomination;
			
			// https://pl.wikipedia.org/wiki/MediaWiki:Gadget-lib-wikiprojects.js
			// eslint-disable-next-line no-undef
			gadget.getWikiprojects()
			.then(function(data){

					var list = data.wikiprojects.map(
						function (wikiproject) {
							return wikiproject.name;
						}
					);

					D.wikiprojects.list = list;
			        
			        D.wikiproject_select = $('<select class="czywiesz-wikiproject"></select>').css('vertical-align', 'middle');
			        D.wikiproject_select.append('<option value="none">-- (żaden) --</option>');

			        for (var i=0;i<D.wikiprojects.list.length;i++) {
			            if (typeof(D.wikiprojects.list[i]) == 'function') continue; //on IE wikibits adds indexOf method for arrays. skip it.
			            $('<option>').attr('value',i).text(D.wikiprojects.list[i]).appendTo(D.wikiproject_select);
			        }

					$('#CzyWieszWikiprojectContainer small').remove();
					$('#CzyWieszWikiprojectContainer').append(D.wikiproject_select.clone());
				}
			);
		}
	};

	DYKnomination.logs = [];
	DYKnomination.log = function (){
		// could also ...spread, but that would require explicit ES6
		var args = Array.from(arguments);

		// gather debug info in case of an error
		var dt = new Date().toISOString();
		DYKnomination.logs.push({dt:dt, log:args});

		// show debug info only in debug mode
		if( this.debugmode && typeof(console) !== 'undefined' ) {
			args.unshift('[DYK]');	// tag
			console.log.apply(console, args);
		}
	};

	DYKnomination.debugmode = false;

	DYKnomination.debug = function () {
		DYKnomination.debugmode = true;
		DYKnomination.askuser();
	};

	/**
	 * Function called when user clicks the link of the gadget.
	 */
	DYKnomination.askuser = function () {

		var D = DYKnomination;
		var debug = D.debugmode;
		D.errors.clear();
		//D.log(D); //creates circular structure when trying to stringify DYKnimination.logs at the end
		
		D.wgUserName = mw.config.get('wgUserName');
		D.wgTitle = mw.config.get('wgTitle');

		var IMG_ARR = $.merge($('#mw-content-text .infobox span[typeof="mw:File"] a.mw-file-description img'),$('#mw-content-text figure[typeof="mw:File/Thumb"] img'));
		var IMAGES = IMG_ARR.length;
		var REFS = {
			warn:	D.config.no + '&nbsp;&nbsp;<strong style="color: red;">Brak źródeł dyskwalifikuje artykuł ze zgłoszenia!!</strong> <small>(<a class="czywiesz-external">info</a>)</small>',
			ar1:	[''],
			ar2:	['Bibliografia','Przypisy']
		};
			$('.mw-headline').each(function(){
				REFS.ar1.push( $(this).html().replace(/<span class="mw-headline-number"[^>]*>\d+<\/span> */,'') );
			});
			REFS.ar1 = REFS.ar1.join('#') + '#';
			D.sourced = false;
			for (var i=0; i < REFS.ar2.length; i++) {
				if ( REFS.ar1.match('#' + REFS.ar2[i] + '#') ) {D.sourced = true; break;}
			}
		var SIGNATURE = (D.wgUserName ? {name: D.wgUserName, disabled: ' disabled'} : {name: '~~' + '~', disabled: ' disabled'} );

		//workaround for Opera - the textarea must be inserted to a visible element

		var $title_paragraph = $('<p></p>')
			.html('Tytuł artykułu: &nbsp;&nbsp;<input type="text" id="CzyWieszTitle" name="CzyWieszTitle" value="' + D.wgTitle + '" style="width: 476px;" disabled>');

		var $question_paragraph = $('<p><strong>Dokończ pytanie: „Czy wiesz…”</strong></p>');
		var $question_textarea_paragraph = $('<p></p>')
			.html('<textarea id="CzyWieszQuestion" style="width: 570px;" rows="2" value="" placeholder="Możesz wpisać kilka pytań, każde w osobnej linijce – pamiętaj, żeby wtedy każde zacząć wielokropkiem i zakończyć pytajnikiem." autofocus></textarea>');

		var $ref_row = $('<tr id="CzyWieszRefs"></tr>')
			.html('<td>Źródła: </td>'
				+ '<td>' + ( D.sourced ? D.config.yes : REFS.warn ) + '</td>');
			if (D.sourced) {
				$ref_row.css({display: 'none'});
			}

		var $images_row = $('<tr></tr>')
			.html('<td>Liczba grafik w artykule: </td>'
				+ '<td><input type="text" id="CzyWieszImages" name="CzyWieszImages" value="' + IMAGES + '"' 
				+ 'style="width: 8%;text-align: right;margin-left: 2px;">'
				+ '<span id="CzyWieszGalleryToggler" style="display: none;"> &nbsp;<small>(<a class="czywiesz-external">zaproponuj grafikę z artykułu</a>)</small></span>');

		var $file_row = $('<tr></tr>')
			.html('<td style="width: 30%;"><input type="checkbox" id="CzyWieszFile1" name="CzyWieszFile1" style="vertical-align: middle;"><label for="CzyWieszFile1"> Zaproponuj grafikę: </label></td>' // style="width: 36%;
				+ '<td><tt>[[Plik:</tt><input type="text" id="CzyWieszFile2" name="CzyWieszFile2" style="width: 52%; vertical-align: middle;" disabled><tt>|100px|right]]</tt></td>');

		//author row
		var $author_row = $('<tr></tr>')
			.html('<td>Główny autor artykułu<a href="#" title="Gadżet wstawia autora największej edycji w ciągu ostatnich 10 dni (upewnij się!)"><sup>?</sup></a>: </td>'
				+ '<td><input type="text" id="CzyWieszAuthor" name="CzyWieszAuthor" style="width: 50%;margin-left: 2px;vertical-align: middle;">'
				+ '&nbsp;&nbsp;<input type="checkbox" id="CzyWieszAuthorInf" name="CzyWieszAuthorInf" style="vertical-align: middle;"><label for="CzyWieszAuthorInf">poinformować go?</label></td>');

		D.author2_input = $('<input type="text" class="CzyWieszAuthor2" name="CzyWieszAuthor2" style="width: 50%;margin-left: 2px;vertical-align: middle;">');
		var $author2_row = $('<span id="CzyWieszAuthor2Container"></span>').append(D.author2_input.clone());
		$author2_row = $('<td></td>').append($author2_row)
			.append('<a id="CzyWieszAuthor2Add">(+)</a>');
		$author2_row = $('<tr id="CzyWieszAuthor2" style="display: none;" title="Dodaj *tylko* jeśli jego wkład w obecną rozbudowę artykułu był równie duży jak autora podanego powyżej!"></tr>').append('<td>Kolejny autor: </td>').append($author2_row);

		var $date_row = $('<tr></tr>')
			.html('<td>Data utw./rozbud. artykułu<a href="#" title="Gadżet wstawia datę największej edycji w ciągu ostatnich 10 dni (upewnij się!), w przeciwnym wypadku datę dzisiejszą jako datę zgłoszenia)"><sup>?</sup></a>: </td>'
				+ '<td><input type="text" id="CzyWieszDate" name="CzyWieszDate" style="width: 50%;margin-left: 2px;vertical-align: middle;"></td>');

		var $signature_row = $('<tr></tr>')
			.html('<td>Twój podpis: </td>'
				+ '<td><input type="text" id="CzyWieszSignature" name="CzyWieszSignature" value="' 
				+ SIGNATURE.name + '" style="width: 50%;margin-left: 2px;"' + SIGNATURE.disabled + '></td>');

		//wikiproject row (filled later by D.wikiprojects.load())
		var $wikiproject_row = $('<span id="CzyWieszWikiprojectContainer"><small>(trwa ładowanie…)</small></span>');
		$wikiproject_row = $('<td></td>').append($wikiproject_row)
			.append('<a id="CzyWieszWikiprojectAdd">(+)</a>');
		$wikiproject_row = $('<tr></tr>').append('<td>Powiadom wikiprojekt(y): </td>').append($wikiproject_row);

		/* need addidtional comment?
		 *  check → #CzyWieszGadget.height+30, #CzyWieszGadget.parent.height+20
		 *  uncheck → #CzyWieszGadget.height-30, #CzyWieszGadget.parent.height-20
		 */
		var $comment_paragraph_checkbox = $('<input type="checkbox" id="CzyWieszCommentCheckbox" name="CzyWieszCommentCheckbox" style="vertical-align: middle;">')
		.click(function(){
			var el = $('#CzyWieszGadget');
			if ( $(this).prop('checked') ) {
				el.height(el.height+30);
				el.parent().height(el.parent().height+20);
			} else {
				el.height(el.height-30);
				el.parent().height(el.parent().height-20);
			}
		});
		var $comment_paragraph = $('<p></p>').append($comment_paragraph_checkbox).append('<label for="CzyWieszCommentCheckbox">Potrzebujesz zamieścić dodatkowy komentarz? (Twój podpis zostanie dodany automatycznie)</label>');
		var $comment_textarea_paragraph = $('<p id="CzyWieszCommentContainer" style="display: none;"></p>')
			.html('<textarea id="CzyWieszComment" style="width: 570px;" rows="2" value=""></textarea>');

		//rules paragraph
		var $rules_paragraph = $('<p id="CzyWieszRules"></p>')
			.html('<small>Zgłaszaj hasła nie później niż 10 dni od powstania lub rozbudowania hasła, '
				+ 'posiadające źródła najlepiej w formie przypisów i zawierające co najmniej 2 kB samej treści.</small>')
			.css({border: '1px solid #F0F080', backgroundColor: '#FFFFE0', paddingLeft: '5px'});
 
		var $loading_bar = $('<div id="CzyWieszLoaderBar"></div>')
			.css({width: '100%', backgroundColor: 'rgb(220, 220, 220)', border: '1px solid rgb(187, 187, 187)', borderRadius: '3px', boxSizing: 'border-box'})
			.html('<p id="CzyWieszLoaderBarParagraph" style="margin: 0 0 0 7px; position: absolute;">&nbsp;</p>'
				+ '<div id="CzyWieszLoaderBarInner" style="width: 0; height: 20px; background-color: #ABEC46; border: none; border-radius: 3px;"></div>');

		//build the dialog
		var $dialog = $('<table></table>').css('width','100%').append($ref_row).append($images_row).append($file_row)
			.append($author_row).append($author2_row).append($date_row).append($signature_row).append($wikiproject_row);
		$dialog = $('<div id="CzyWieszGadget"></div>').append($title_paragraph).append($question_paragraph).append($question_textarea_paragraph)
			.append($dialog).append($comment_paragraph).append($comment_textarea_paragraph).append($rules_paragraph).append($loading_bar);
 
		//main buttons
		var buttons = {
			"Zgłoś": function() {
				if (D.sourced) {
					D.checkForm();
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
		  title: (window.DYKnomination_is_beta===true?'BETA: ':'')+'Zgłoszenie artykułu do rubryki „Czy wiesz…”' + (debug ? ' &nbsp; (<small id="CzyWieszDialogDebug" style="color: red;">TRYB DEBUG</small>)' : ''),
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
			var str = y + '-' + m + '-' + d;
			return str;
		});

		// debug quicky
		if (this.debugmode) {
			$('#CzyWieszQuestion').val(`jak testować '''[[${D.wgTitle}]]'''?`);
		}

		//fill wikiprojects list
		D.wikiprojects.load();

		// check size of article and make a tip for the possible author
		D.pagerevs();
		
		if ($('#CzyWieszStyleTag').length == 0) {
			D.config.styletag.appendTo('head');
		}

		// when user ticks he wants to nominate with picture → enable picture/file field
		$('#CzyWieszFile1').change(function(){
			var a=$('#CzyWieszFile2');
			a.prop('disabled', !a.prop('disabled'));
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
							GALLERY += IMG_ARR[i].outerHTML.replace(/\swidth=\"\d+\"/,' width="100"').replace(/\sheight=\"[^\"]*\"/,'').replace(/\sclass=\"[^\"]*\"/g,'');
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
								$('#CzyWieszFile1').prop('checked',true);
								$('#CzyWieszFile2').prop('disabled', false);
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
			$('<div><div class="floatright">' + D.config.CWicon + '</div><p style="margin-left: 10px;">Zgodnie z wytycznymi <a href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojektu Czy wiesz</a> zgłaszane hasło powinno posiadać źródła w formie bibliografii lub przypisów. <a href="/wiki/Wikiprojekt:Czy_wiesz/pomoc#Zg.C5.82aszanie_propozycji_i_poprawa_hase.C5.82" title="Wikiprojekt:Czy wiesz/pomoc#Zgłaszanie propozycji i poprawa haseł">(Więcej…)</a><br /><small>Możliwe, że w artykule sekcje ze źródłami są błędnie nazwane – w takim wypadku popraw je.</small></p></div>')
			.dialog({ modal: true, dialogClass: "wikiEditor-toolbar-dialog", close: function() { $(this).dialog("destroy"); $(this).remove();} });
		});

		// click on (+) near wikiprojects combo box → add new combo box and enlarge the dialog window
		$('#CzyWieszWikiprojectAdd').click(function(){
			$('#CzyWieszWikiprojectContainer').append(D.wikiproject_select.clone());
			$('#CzyWieszLoaderBar').parent().css({height: '+=24'});
		});

		// click on (+) near authors input field → add new input field and enlarge the dialog window
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
		
	};

	DYKnomination.pagerevs = function () {

		var D = DYKnomination;
		var a,b,d,aj0,revs0,aj,revs,str,maxdiffsize,maxdiffrev,maxdiffuser,maxdiffdate,g;

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
				+ '&titles=' + encodeURIComponent(D.wgTitle)
		)
		.done(function(d0){
			// number of edits in last 10 days
			revs0 = (d0.query.pages[d0.query.pageids[0]].revisions ? d0.query.pages[d0.query.pageids[0]].revisions.length : 0);

			// get one more revision to check current size and diffsize of last one in 10 days period
			$.ajax('/w/api.php?action=query&prop=revisions&format=json&rvprop=timestamp%7Cuser%7Csize&redirects=&indexpageids='
					+ '&rvlimit=' + (revs0+1)
					+ '&titles=' + encodeURIComponent(D.wgTitle)
			)
			.done(function(d){
				aj = d.query.pages[d.query.pageids[0]].revisions;
				revs = aj.length;
				D.log('edits in last 10 days:',aj);

				if (revs0 > 0) {
				// there are edits in last 10 days
					aj0 = d0.query.pages[d0.query.pageids[0]].revisions;
					//revs0 = aj0.length;
					D.log('edits in last 10 days, plus one more:',aj0);

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
					if (maxdiffsize > 0) maxdiffsize = '+' + maxdiffsize;
					maxdiffuser = aj[maxdiffrev].user;
					//maxdiffdate; get this in format YYYY-MM-DD but in local time (with TimezoneOffset)
					//this way is quicker than converting (g.getFullYear() +'-'+ g.getMonth() +'-'+ g.getDate()) from YYYY-M-D into YYYY-MM-DD
					//toISOString converts time to UTC for display so if we remove TimezoneOffset then the result after toISOString is good
						g = new Date(Date.parse( aj[maxdiffrev].timestamp ));
						g.setMinutes(g.getMinutes()-g.getTimezoneOffset());
						maxdiffdate = g.toISOString().split('T')[0];

					D.log('\"[str,maxdiffrev,maxdiffsize,maxdiffuser]\":',[str,maxdiffrev,maxdiffsize,maxdiffuser]);

/* OLD VER |START|
					// add a tip about possible author…
					$('#CzyWieszAuthor').after('&nbsp;<small id="CzyWieszAuthorTip">(<a class="czywiesz-external">sugestia?</a>)</small>&nbsp;');
					$('#CzyWieszAuthorTip a').click(function(){
						prompt('Autor największej edycji (' + maxdiffsize + ') w ciągu ostatnich 10 dni (skopiuj wciskając Ctrl+C):',maxdiffuser);
						$('#CzyWieszAuthor').select();
					});
					// …and about date
					$('#CzyWieszDate').after('&nbsp;<small id="CzyWieszDateTip">(<a class="czywiesz-external">sugestia?</a>)</small>&nbsp;');
					$('#CzyWieszDateTip a').click(function(){
						prompt('Data największej edycji (' + maxdiffsize + ') w ciągu ostatnich 10 dni (skopiuj wciskając Ctrl+C):',maxdiffdate);
						$('#CzyWieszDate').select();
					});
   OLD VER |END| */
/* NEW VER |START| */
					// add a possible author…
					$('#CzyWieszAuthor').val(maxdiffuser);
					$('#CzyWieszAuthor').after('&nbsp;<small id="CzyWieszAuthorTip"><span class="czywiesz-external" title="Autor największej edycji (' + maxdiffsize + ' znaków) w ciągu ostatnich 10 dni. Upewnij się, że to jest główny autor artykułu!">&nbsp;(!)&nbsp;</span></small>&nbsp;');
					// …and date
					$('#CzyWieszDate').val(maxdiffdate);
					$('#CzyWieszDate').after('&nbsp;<small id="CzyWieszDateTip"><span class="czywiesz-external" title="To jest data największej edycji (' + maxdiffsize + ' znaków) w ciągu ostatnich 10 dni. Upewnij się czy to o tę datę chodzi!">&nbsp;(!)&nbsp;</span></small>&nbsp;');
/* NEW VER |END| */
				}
				else {
				// there are no edits in last 10 days
					//revs0 = 0;
					D.log(d.query.pages[d.query.pageids[0]]);
					alert('W ciągu ostatnich 10 dni nie dokonano żadnej edycji. Jeszcze raz rozważ zgłaszanie tego artykułu, gdyż może to być niezgodne z regulaminem.');
				}
		
				D.articlesize = {
					size:	aj[0].size,
					enough:	(aj[0].size > 2047),
					warn:	( (aj[0].size > 2047) ? '' : (D.config.no + '&nbsp;&nbsp;<strong style="color: red;">Rozmiar ' + aj[0].size + ' b dyskwalifikuje artykuł ze zgłoszenia!!</strong> <!--small>(<a class="czywiesz-external">info</a>)</small-->') )
				};

				$('<tr id="CzyWieszSize"></tr>')
					.insertAfter($('#CzyWieszRefs'))
					.html('<td>Rozmiar (>2 kb): </td>'
						+ '<td>' + (D.articlesize.enough ? D.config.yes : D.articlesize.warn) + '</td>')
					.css( D.articlesize.enough ? {display: 'none'} : {});
			})
			.fail(function(data){
				D.errors.push('Błąd pobierania historii artykułu (funkcja wewnętrzna): $.ajax.fail().');
				D.errors.show();
				console.error('Błąd pobierania historii artykułu (funkcja wewnętrzna): $.ajax.fail().');
				console.error(data);
			});
		})
		.fail(function(data){
			D.errors.push('Błąd pobierania historii artykułu (funkcja zewnętrzna): $.ajax.fail().');
			D.errors.show();
			console.error('Błąd pobierania historii artykułu (funkcja zewnętrzna): $.ajax.fail().');
			console.error(data);
		});
	};

	DYKnomination.strToRegExp = function (str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}
	
	DYKnomination.values = {};

	DYKnomination.checkForm = function () {

		var D = DYKnomination;

		//get the question
		var QUESTION = $('#CzyWieszQuestion').val().replace(/(.*?)(--)?~{3,5}\s*$/,'$1').replace(/^\s*(.*?)\s*$/,'$1').replace(/^([Cc]zy wiesz)?[\s,\.]*/,''); // remove signature, spaces on beginning and end, beginning of question ("Czy wiesz"), first dots
		var FILE = ( $('#CzyWieszFile1').prop('checked') ? $('#CzyWieszFile2').val().replace(/^\s*(.*?)\s*$/,'$1') : '' ); // remove spaces on beginning and end
		var IMAGES = $('#CzyWieszImages').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var REFS = (D.sourced ? '+' : ' ');
		var AUTHOR = $('#CzyWieszAuthor').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var AUTHOR2 = [];
			//get authors
			$('.CzyWieszAuthor2').each( function() {
				var val = $(this).val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
				if (val != '') {
					AUTHOR2.push(val);
				}
			});
		var AUTHOR_INF = ( $('#CzyWieszAuthorInf').prop('checked') ? true : false );
		var DATE = $('#CzyWieszDate').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var SIGNATURE = $('#CzyWieszSignature').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var WIKIPROJECT = [];
		//get the wikiprojects
		$('.czywiesz-wikiproject').each( function() {
			var val = $(this).val();
			if (val != 'none') {
				WIKIPROJECT.push(D.wikiprojects.list[val]);
			}
		});
		var COMMENT = ( $('#CzyWieszCommentCheckbox').prop('checked') ? $('#CzyWieszComment').val().replace(/^\s*(.*?)\s*$/,'$1') : false );

		//validate form
		var invalid = {is: false, fields: [], alert: []};
			if (typeof QUESTION != 'string' || QUESTION === '') {
				invalid.is = true;
				invalid.fields.push('Question');
				invalid.alert.push('Wpisz pytanie.');
			}
			else {
				var tITLE = D.wgTitle[0].toLowerCase()+D.wgTitle.substr(1); //title in link starting with lowercase
				if (QUESTION.length < 10) {
					invalid.is = true;
					invalid.fields.push('Question');
					invalid.alert.push('Zadaj poprawne pytanie – to jest za krótkie.');
				}
				else if (!QUESTION.match(RegExp('\'\'\'\\s*\\[\\[('+D.strToRegExp(D.wgTitle)+'|'+D.strToRegExp(tITLE)+')(\\]\\]|\\|.*?\\]\\])\\s*\'\'\''))) {
				// if there isn't any bold (a) link with title or (b) link with title starting with lowercase
					invalid.is = true;
					invalid.fields.push('Question');
					invalid.alert.push('Pytanie musi zawierać link do artykułu. Pogrubiony.\n Przykład:\n   \'\'\'[['+D.wgTitle+']]\'\'\' lub \'\'\'[['+tITLE+']]\'\'\'\n lub\n   \'\'\'[['+D.wgTitle+'|nazwa do wyświetlenia, jeśli inna niż tytuł]]\'\'\'.');
				}
				else {
					QUESTION = (QUESTION.match(/^(…|\.\.\.)/) ? '' : '…') + QUESTION.replace(/\.\.\./g,'…') + (QUESTION.match(/\?[\s]*$/) ? '' : '?');
					QUESTION = QUESTION.replace(/\n+/g,'\n\n') + '\n';
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
			if (typeof DATE != 'string' || DATE === '' || DATE.match(/\d\d\d\d-\d\d-\d\d/).length==0) {
				invalid.is = true;
				invalid.fields.push('Date');
				invalid.alert.push('Podaj datę utworzenia/rozbudowy artykułu (w formacie rrrr-mm-dd).');
			}
			if (typeof SIGNATURE != 'string' || SIGNATURE === '') {
				invalid.is = true;
				invalid.fields.push('Signature');
				invalid.alert.push('Podpisz się.');
			}
			if ( (typeof COMMENT!='string'&&typeof COMMENT!='boolean') || (typeof COMMENT=='string' && (COMMENT===''||COMMENT.match(/^[^A-ZĘÓĄŚŁŻŹĆŃa-zęóąśłżźćń]+$/)) ) || (typeof COMMENT=='string'&&COMMENT==true) ) {
				invalid.is = true;
				invalid.fields.push('Comment');
				invalid.alert.push('Jeśli musisz podać jakiś komentarz to podaj jakiś sensowny, jeśli nie – wyłącz to pole. Nie wstawiaj w tym polu samego podpisu (lecz po komentarzu podpisz się).');
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
				comment:    COMMENT,
				authorInf:   AUTHOR_INF,
				wikiproject: WIKIPROJECT
			};
			// here is the call of editing/ajax function
			D.prepare();
		}
	};

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
				txt = 'Sprawdzam stronę zgłoszeń…';
				break;
			case 1:
				txt = 'Pobieram dane z formularza…';
				break;
			case 2:
				txt = 'Przygotowuję dane do wysłania…';
				break;
			case 3:
				txt = 'Zgłaszam propozycję…';
				break;
			case 4:
				txt = 'Informuję o zgłoszeniu…';
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

		$('#CzyWieszLoaderBarParagraph').text(txt);
		if (task != 'error') { // 'error' → task/tasks = NaN
			$('#CzyWieszLoaderBarInner').css({width: 100*task/tasks + '%'});
		}
		else {
			$('#CzyWieszLoaderBarInner').css({backgroundColor: 'red'});
		}

	};

	DYKnomination.getEditToken = async function (force) {
		var D = DYKnomination;

		var tmpToken = mw.user.tokens.get('csrfToken');
		if (!force && typeof tmpToken === 'string' && tmpToken.length === 34) {
			D.edittoken = tmpToken;
			D.log('DYKnomination.edittoken :',D.edittoken);
			return D.edittoken;
		}

		/* get edittoken */
		try {
			let data = await apiAsync({
				url:'/w/api.php?action=query&meta=tokens&format=json&type=csrf',
				cache: false
			});
			D.log('DYKnomination.edittoken :',D.edittoken,'data token :',data.query.tokens.csrftoken);
			D.edittoken = data.query.tokens.csrftoken;
		} catch (error) {
			D.errors.push('Błąd pobierania tokena: '+error+'.');
			D.errors.show();
			console.error('Błąd pobierania tokena: ', error);
		}

		return D.edittoken;
	};

	/** Prepare nomination. */
	DYKnomination.prepare = async function () {
		var Dv = this.values;

		// clear errors
		this.errors.clear();

		// main tasks count
		this.tasks = 4 + Dv.wikiproject.length + (Dv.authorInf?1:0);

		// init progress
		this.loadbar();

		// init nomination date
		this.setupNominationPage();

		let nominated;	// already nominated
		try {
			nominated = await this.checkNominationExists();
		} catch (error) {
			this.errors.push('Błąd sprawdzania istniejących zgłoszeń: ' + error + '.');
			this.errors.show();
			console.error('Błąd sprawdzania istniejących zgłoszeń: ', error);
		}

		if (nominated) {
			this.errors.show();
		} else {
			await this.getEditToken(false);
			await this.runNominate();
		}
	}

	/** Setup or read name for the nomination page. */
	DYKnomination.setupNominationPage = function () {
		var Dv = this.values;

		if (!Dv.nominationDate) {
			Dv.nominationDate = new Date();
		}
		Dv.nominationPage = this.getNominationPage(Dv.nominationDate, this.wgTitle);

		return Dv.nominationPage;
	}

	/** Check for active nominations and nominations this month. */
	DYKnomination.checkNominationExists = async function () {

		// search existing sections on nomination page
		let data = await apiAsync({
			url: '/w/api.php?action=parse&format=json&page=' + encodeURIComponent(this.getBaseNew()) + '&prop=sections',
			cache: false
		});
		let sections = data.parse.sections;
		this.log('Sekcje na stronie nominacji:', sections);
		let exisiting = sections.filter(s => s.level==2 && s.line == this.wgTitle);
		if (exisiting.length) {
			const href = '/wiki/'+encodeURIComponent(this.setupNominationPage()) + '#' + exisiting[0].anchor;
			this.errors.push(`
				Podany artykuł jest zgłoszony do rubryki „Czy wiesz…”.<br />
				<a href="${href}" class="czywiesz-external" target="_blank">Sprawdź</a>.
			`);
			return true;
		}

		// check for existing nomination page
		let subpageTitle = this.setupNominationPage();
		let subpageData = await apiAsync({
			url: '/w/api.php?action=query&format=json&prop=&titles=' + encodeURIComponent(subpageTitle) + '&formatversion=2',
			cache: false
		});
		let pageInfo = subpageData.query.pages.pop();
		if (!pageInfo.missing) {
			const href = '/wiki/'+encodeURIComponent(subpageTitle);
			this.errors.push(`
				Podany artykuł był już zgłoszony do rubryki „Czy wiesz…” w tym miesiącu.<br />
				<a href="${href}" class="czywiesz-external" target="_blank">Sprawdź</a>.
			`);
			return true;
		}

		// nomination doesn't exist yet
		return false;
	};

	DYKnomination.runNominate = async function () {

		var D = DYKnomination;
		var Dv = D.values;

		// NR ready, make summary
		let subpage = D.setupNominationPage();
		let summary = D.config.summary.replace('NR (TITLE)', `[[${subpage}|${D.wgTitle}]]`);

		/* making data ready */
		D.loadbar();

		// making content
		let input = '== [[' + D.wgTitle + ']] ==\n'
			+ '<!-- artykuł zgłoszony za pomocą gadżetu CzyWiesz -->\n'
			+ '{{licznik czasu|start={{subst:#timel:Y-m-d H:i:s}}|dni=30}}\n'
			+ Dv.file         //FILE is already with \n at the end
			+ Dv.question     //QUESTION is already with \n at the end
			+ '{' + '{Wikiprojekt:Czy wiesz/weryfikacja|' + D.wgTitle + '|' + Dv.refs + '|' + Dv.images + '|' + Dv.author + '|' + Dv.signature + '|?|?|?}}\n'
			+ (Dv.comment ? Dv.comment + ' ' : '') + '~~' + '~~'
		;

		D.log('input:',input);

		await D.createNomination(input, summary);
		await D.inform_r();
		await D.inform_a();
		await D.inform_w();

		D.success();
	};

	/* Add nomination. */
	DYKnomination.createNomination = async function (input, summary) {

		var D = DYKnomination;
		var Dv = D.values;
		
		D.log('DYKnomination.values:',Dv);

		D.loadbar();

		try {
			// create subpage
			let subpageTitle = this.setupNominationPage();
			await apiAsync({
				url : '/w/api.php',
				type: 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : subpageTitle,
					text : input,
					summary : summary,
					watchlist : 'watch',
					token : D.edittoken
				}
			});
			D.loadbar();

			// append subpage
			await apiAsync({
				url : '/w/api.php',
				type: 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : D.getBaseNew(),
					appendtext : '\n{'+'{' + subpageTitle + '}}',
					summary : summary,
					watchlist : 'nochange',
					token : D.edittoken
				}
			});
		} catch (error) {
			D.errors.push('Błąd zgłaszania do rubryki: ' + error + '.');
			D.errors.show();
			console.error('Błąd zgłaszania do rubryki: ', error);
		}
	};

	/**
	 * Inform readers.
	 * 
	 * Inserts a template to the nominated article.
	 * 
	 * @returns Promise.
	 */
	DYKnomination.inform_r = async function () {
 
		var D = DYKnomination;
		var debug = D.debugmode;

		let subpageTitle = this.setupNominationPage();

		// skip for debug
		if ( debug ) {
			D.log(`edit: ${D.wgTitle}, subpage: ${subpageTitle}`);
			return;
		}

		try {
			await apiAsync({
				url : '/w/api.php',
				type : 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : D.wgTitle,
					prependtext : '{' + '{Czy wiesz do artykułu|p=' + subpageTitle + '}' + '}\n',
					summary : D.config.summary_r,
					watchlist : 'nochange',
					token : D.edittoken
				}
			});
		} catch (info) {
			D.errors.push('Błąd informowania w artykule: ' + info);
			D.errors.show();
			console.error('Błąd informowania w artykule:', info);
		}
	};

	/** Inform author. */
	DYKnomination.inform_a = async function () {
		var D = DYKnomination;
		var Dv = D.values;
		var debug = D.debugmode;
		var secttitl_a,summary_a;

		if ( !Dv.authorInf ) {
			return;
		}

		try {
			secttitl_a = D.config.secttitl_a.replace('TITLE',D.wgTitle);
			summary_a = D.config.summary_a.replace('TITLE',D.wgTitle);
			await apiAsync({
				url : '/w/api.php',
				type : 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : (debug ? config.debugBase + '/autor' : 'Dyskusja wikipedysty:' + Dv.author),
					section : 'new',
					sectiontitle : secttitl_a,
					text : (debug ? "debug: '''" + Dv.author + "'''\n" : '') + '{' + '{subst:Czy wiesz - autor0|tytuł strony='+D.wgTitle+'}} ~~' + '~~',
					summary : summary_a,
					watchlist : 'nochange',
					token : D.edittoken
				},
			})
		} catch (info) {
			D.errors.push('Błąd informowania autora: ' + info);
			D.errors.show();
			console.error('Błąd informowania autora:',  info);
		}

	};

	/** Inform wikiprojects. */
	DYKnomination.inform_w = async function () {
		var D = DYKnomination;
		var Dv = D.values;
		var summary_w,secttitl_w;

		if ( Dv.wikiproject.length == 0 ) {
			return;
		}
		else {
			secttitl_w = D.config.secttitl_w.replace('TITLE',D.wgTitle);
			summary_w = D.config.summary_w.replace('TITLE',D.wgTitle);
			var summary_w2 = D.config.summary_w2.replace('TITLE',D.wgTitle);
 
			// recursive inform loop
			for (let i = 0; i < Dv.wikiproject.length; i++) {
				const curWikiproject = Dv.wikiproject[i];
				try {
					await D.inform_wLoop(secttitl_w, summary_w, summary_w2, curWikiproject);
				} catch (error) {
					D.errors.push('Błąd informowania projektu: '+ curWikiproject + ': '+error.toString()+'.');
					D.errors.show();
					console.error('Błąd informowania projektu: '+ curWikiproject + ': '+error.toString()+'.');
					throw new Error(`Błąd informowania projektów (${i} / ${Dv.wikiproject.length}).`);
				}
				D.loadbar();
			}
		}
	};

	DYKnomination.inform_wLoop = async function (secttitl_w, summary_w, summary_w2, curWikiproject) {
		var D = DYKnomination;
		var debug = D.debugmode;
		
		var wnr = -1;
		//check if wikiproject wants to be informed other way than 'section=new'
		//(wnr=) -1 means 'no' (the wikiproject is not on the list D.wikiprojects.list2), any other number means 'yes' and is a number of the wikiproject in D.wikiprojects.list2
		$(D.wikiprojects.list2).each(function(n){
			if (this.label == curWikiproject) wnr=n;
		});
		D.log('D.wikiprojects.list2',D.wikiprojects.list2);

		var czy_talk;
		var pageToEdit;
		if (wnr<0) {
			pageToEdit = 'Wikiprojekt:'+curWikiproject;
		} else if (D.wikiprojects.list2[wnr].type=='talk') {
			pageToEdit = 'Dyskusja wikiprojektu:' + curWikiproject;
			czy_talk = true;
		} else {
			pageToEdit = D.wikiprojects.list2[wnr].page;
		}

		D.log('czy_talk:',czy_talk,'D.wikiprojects.list2[wnr]:',D.wikiprojects.list2[wnr],'curWikiproject:',curWikiproject,'pageToEdit:',pageToEdit);

		// force talk-page like flow so that we can edit single page multiple times
		if (debug) {
			czy_talk = true;
		}

		let mainCall;
		if (czy_talk) {
			//if report type is 'talk' (D.wikiprojects.list2[wnr].type=='talk' & czy_talk==true) just add new section
			mainCall = {
				url : '/w/api.php',
				type : 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : (debug ? config.debugBase + '/wikiprojekt' : pageToEdit),
					section : 'new',
					sectiontitle : (debug ? secttitl_w + ' • ' + curWikiproject : secttitl_w),
					text : (debug ? "debug: '''" + pageToEdit + "'''\n" : '') +  '{' + '{Czy wiesz - wikiprojekt|' + D.wgTitle + '}} ~~' + '~~',
					summary : summary_w,
					watchlist : 'nochange',
					token : D.edittoken
				}
			};
		}
		//if report type is not 'editsection' or 'subpage' then
		else {

			// get page source [to edit]
			let data;
			try {
				data = await apiAsync({
					url : '/w/index.php?action=raw&title=' + encodeURIComponent(pageToEdit),
					cache : false
				});
			} catch (error) {
				throw new Error(`Nieudany odczyt strony '${pageToEdit}' (${error}).`);
			}

			// now we need to prepare data for page edit operation
			let dykSectionIndicator = '<!-- Nowe zgłoszenia CzyWiesza wstawiaj poniżej tej linii. Nie zmieniaj i nie usuwaj tej linii -->';
			if (!data.match(dykSectionIndicator)) {
				data = data.replace('[[Kategoria:','== Czy wiesz ==\n' + dykSectionIndicator + '\n\n[[Kategoria:');
			}
			data = data.replace(dykSectionIndicator,
				dykSectionIndicator + '\n'
				+ '{' + '{Czy wiesz - wikiprojekt|' + D.wgTitle + '}}');

			D.log('czy_talk (2):',czy_talk,'D.wikiprojects.list2[wnr] (2):',D.wikiprojects.list2[wnr],'curWikiproject (2):',curWikiproject,'pageToEdit (2):',pageToEdit);

			mainCall = {
				url : '/w/api.php',
				type : 'POST',
				data: {
					action: 'edit',
					format: 'json',
					title:  pageToEdit,
					text:   data,
					summary: summary_w2,
					watchlist: 'nochange',
					token:  D.edittoken
				}
			};
		}

		// add section or modify page
		await apiAsync(mainCall);
	};

	/** Finalize nomination (might actually show errors if there were any). */
	DYKnomination.success = function () {
		var D = DYKnomination;
		var Dv = D.values;
		var SectionTitleForFinalLink = '[['+D.wgTitle+']]';

		if (!D.errors.isEmpty()) {
			D.errors.show();
			return false;
		}

		D.loadbar('done');
		D.log('Zgłoszenie zakończone sukcesem!');

		// end dialog: "Finished!"
		$('<div id="CzyWieszSuccess"><div class="floatright">' + D.config.CWicon + '</div>'
			+ '<p style="margin-left: 10px;">Dziękujemy za <a id="CzyWieszLinkAfter" href="//pl.wikipedia.org/wiki/' 
			+ encodeURIComponent(D.getBaseNew()) + '#' + encodeURIComponent(SectionTitleForFinalLink.replace(/ /g,'_')).replace(/%/g,'.').replace(/\(/g,'.28').replace(/\)/g,'.29') + '" class="czywiesz-external" target="_blank">zgłoszenie</a>.<br /><br />'
			+ 'Dla pewności możesz sprawdzić <a href="//pl.wikipedia.org/wiki/Specjalna:Wk%C5%82ad/'
			+ encodeURIComponent(Dv.signature)
			+ '" class="czywiesz-external" target="_blank">swój wkład</a> czy wszystko poszło zgodnie z planem.<br />'
			+ '<small><a class="CzyWieszEmailDoAutoraToggle">(Coś nie działa?)</a></small><br />'
			+ '<span class="CzyWieszEmailDoAutoraInfo" style="display:none;">Jeśli coś poszło nie tak to <a href="#" class="CzyWieszEmailDoAutoraWyslij">kliknij tutaj</a>, aby wysłać twórcy gadżetu e-mail z opisem błędu, a gadżet dołączy do niego szczegóły techniczne.<span class="CzyWieszEmailDoAutoraWyslano"></span><br /></span>'
			+ '<br />'
			+ '<a href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojekt Czy wiesz</a></p></div>')
		.dialog({
			modal: true,
			dialogClass: "wikiEditor-toolbar-dialog",
			title: D.config.tmpldone,
			close: function() {
				$(this).dialog("destroy");
				$(this).remove();
				$('#CzyWieszGadget').dialog("destroy");
				$('#CzyWieszGadget').remove();
			}
		});
		$('#CzyWieszSuccess a.CzyWieszEmailDoAutoraToggle').click( function() {
			$('#CzyWieszSuccess .CzyWieszEmailDoAutoraInfo').toggle();
		});
		$('#CzyWieszSuccess a.CzyWieszEmailDoAutoraWyslij').click( () => { D.emailauthor(); } );

		return true;
	};

	DYKnomination.emailauthor = async function () {
		var D = DYKnomination;

        var opis = prompt('Opisz co się stało. Bez tego twórca nie będzie wiedział co naprawiać.','');
        if (!opis) {
            alert('Nic nie wyślę twórcy, dopóki nie opiszesz błędu swoimi słowami. Bez Twojego opisu twórca nie będzie wiedział co naprawiać.');
            return;
        }
        D.log('DYKnomination.errors: ', D.errors); //add potential errors, before stringifying all logs
        var emailbody = opis + '\n\n' + JSON.stringify(DYKnomination.logs);
		
		//throbber and cursor-wait – until e-mail sent
		$('.CzyWieszEmailDoAutoraWyslano').html('<img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Denken.gif" width="10" height="10">');
		$('#CzyWieszErrorDialog, #CzyWieszSuccess').addClass('wait-im-sending-email');

		apiAsync({
			url : '/w/api.php',
			type: 'POST',
			data : {
				action : 'emailuser',
				format : 'json',
				target : config.supportUser,
				subject : config.supportEmailTopic,
				text : emailbody,
				token : D.edittoken
			},
		})
			.then(function(){
				$('#CzyWieszErrorDialog, #CzyWieszSuccess').removeClass('wait-im-sending-email');
				$('.CzyWieszEmailDoAutoraWyslano').text(' Wysłano!');
			})
			.catch(function(info){
				D.errors.push(`Błąd wysyłania e-maila do twórcy: ${info}.`);
				D.errors.show();
				console.error('Błąd wysyłania e-maila do twórcy: ', info);
			})
		;
	};

	/**
	 * @type {ErrorInfo}
	 */
	DYKnomination.errors = new ErrorInfo(DYKnomination.emailauthor, config.supportUser);
}

module.exports = { createFullDyk, DYKnomination };
