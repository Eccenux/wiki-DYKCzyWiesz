/* eslint-disable no-useless-escape */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
/* eslint-disable array-bracket-newline */

function strToRegExp (str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * Nomination form (dialog).
 */
class DykForm {
	/**
	 * Setup deps.
	 * @param {DYKnomination} core 
	 */
	constructor(core) {
		this.core = core;
	}

	/**
	 * Function called when user clicks the link of the gadget.
	 */
	askuser () {
		var D = this.core;
		
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

		// Trzeba zasugerować zgłaszającym, żeby podać różne formy pytania, żeby dodający ekspozycję mieli więcej możliwości
		var $question_paragraph = $(`<p><strong>Dokończ pytanie: „Czy wiesz…”</strong></p>
			<p style="font-size:90%">Zalecamy zadanie 2-3 pytań, żeby łatwiej było wybrać ekspozycję (jedno pytanie per wiersz). 
			Pytania zacznij od od „…ile”, „…kto”, „…jak”, „…co”, „…po co”, „…kiedy”, „…dlaczego”, „…gdzie”, „…skąd”, „…że” itp.</p>
		`);
		var $question_textarea_paragraph = $('<p></p>')
			.html(`
				<textarea id="CzyWieszQuestion" style="width: 570px;" rows="2" value="" 
					placeholder="Możesz wpisać kilka pytań, każde w osobnej linijce. Pamiętaj, żeby w każdym dodać pogrubiony link."
					autofocus
				></textarea>
			`)
		;

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
		if (D.debugmode) {
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
			$('#CzyWieszWikiprojectContainer').append(D.wikiprojects.$select.clone());
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
		
	}

	pagerevs () {
		var D = this.core;

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
	}

	/** Prepare and validate values. */
	prepareValues () {
		var D = this.core;

		//get the question
		var QUESTION = $('#CzyWieszQuestion').val();
		var FILE = ( $('#CzyWieszFile1').prop('checked') ? $('#CzyWieszFile2').val().trim() : '' );
		var IMAGES = $('#CzyWieszImages').val().trim();
		var REFS = (D.sourced ? '+' : ' ');
		var AUTHOR = $('#CzyWieszAuthor').val().trim();
		var AUTHOR2 = [];
			//get authors
			$('.CzyWieszAuthor2').each( function() {
				var val = $(this).val().trim();
				if (val != '') {
					AUTHOR2.push(val);
				}
			});
		var AUTHOR_INF = ( $('#CzyWieszAuthorInf').prop('checked') ? true : false );
		var DATE = $('#CzyWieszDate').val().trim();
		var SIGNATURE = $('#CzyWieszSignature').val().trim();
		var WIKIPROJECT = [];
		//get the wikiprojects
		$('.czywiesz-wikiproject').each( function() {
			var val = $(this).val();
			if (val != 'none') {
				WIKIPROJECT.push(D.wikiprojects.list[val]);
			}
		});
		var COMMENT = ( $('#CzyWieszCommentCheckbox').prop('checked') ? $('#CzyWieszComment').val().trim() : false );

		//validate form
		var invalid = {is: false, fields: [], alert: []};

			const tITLE = D.wgTitle[0].toLowerCase()+D.wgTitle.substr(1); //title in link starting with lowercase
			const egQuestion = 'Przykład:\n   \'\'\'[['+D.wgTitle+']]\'\'\' lub \'\'\'[['+tITLE+']]\'\'\'\n lub\n   \'\'\'[['+D.wgTitle+'|nazwa do wyświetlenia, jeśli inna niż tytuł]]\'\'\'.';

			if (typeof QUESTION != 'string' || QUESTION === '') {
				invalid.is = true;
				invalid.fields.push('Question');
				invalid.alert.push('Wpisz pytanie.');
			}
			else {
				QUESTION = QUESTION.trim()
					.replace(/[\r\n]/g, '\n')		// normalize new lines
					.replace(/\n\s+/g, '\n')		// remove extra spaces
					.replace(/(--)?~{3,5}$/, '')	// remove signature
					.trim()
					.replace(/(^|\n)[.…]+/g, '$1')	// remove leading dots
					.replace(/(^|\n)czy wiesz[\s,\.]*/ig, '$1')	// remove leading DYK
					.replace(/\?($|\n)/g, '$1')		// remove?
					.trim()
				;

				if (QUESTION.length < 10) {
					invalid.is = true;
					invalid.fields.push('Question');
					invalid.alert.push('Zadaj poprawne pytanie – to jest za krótkie.\n'+egQuestion);

					return invalid;
				}

				// if there isn't any bold (a) link with title or (b) link with title starting with lowercase
				const findQ = new RegExp('\'\'\'\\s*\\[\\[('+strToRegExp(D.wgTitle)+'|'+strToRegExp(tITLE)+')(\\]\\]|\\|.*?\\]\\])\\s*\'\'\'');
				const missingQ = QUESTION.split('\n').some(q=>!q.match(findQ));
				if (missingQ) {
					invalid.is = true;
					invalid.fields.push('Question');
					invalid.alert.push('Pytanie musi zawierać link do artykułu. Pogrubiony.\n'+egQuestion);
				}
				else {
					// final prep
					QUESTION = QUESTION.split('\n').map(q=>`…${q}?`).join('\n\n') + '\n';
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

		const values = {
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

		return {invalid, values};
	}

}

module.exports = { DykForm };
