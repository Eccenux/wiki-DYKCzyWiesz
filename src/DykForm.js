/* eslint-disable no-useless-escape */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
/* eslint-disable array-bracket-newline */
const { RevisionList } = require("./RevisionList");

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
		this.revisionList = new RevisionList();
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

		var IMG_ARR = $(/*css*/`
			.infobox span[typeof="mw:File"] a.mw-file-description img
			,figure[typeof="mw:File/Thumb"] img
			,.gallery span[typeof="mw:File"] img
		`, $('#mw-content-text'));
		var IMAGES = IMG_ARR.length;
		var REFS = {
			warn:	D.config.no + '&nbsp;&nbsp;<strong style="color: red;">Brak źródeł dyskwalifikuje artykuł ze zgłoszenia!</strong> <small>(<a href="#" role="button">info</a>)</small>',
			ar1:	[''],
			ar2:	['Bibliografia','Przypisy']
		};
			$('.mw-headline, .mw-heading > [id]').each(function(){
				REFS.ar1.push( $(this).html() );
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
			Pytania zacznij od: „…ile”, „…kto”, „…jak”, „…co”, „…po co”, „…kiedy”, „…dlaczego”, „…gdzie”, „…skąd”, „…że” itp.</p>
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
				+ '<td><input type="number" min="0" id="CzyWieszImages" name="CzyWieszImages" value="' + IMAGES + '"' 
				+ 'style="width: 3.5em;">'
				+ '<span id="CzyWieszGalleryToggler" style="display: none;"> &nbsp;<small><a href="#" role="button">(zaproponuj grafikę z artykułu)</a></small></span>');

		var $file_row = $('<tr></tr>')
			.html('<td style="width: 30%;"><input type="checkbox" id="CzyWieszFile1" name="CzyWieszFile1" style="vertical-align: middle;"><label for="CzyWieszFile1"> Zaproponuj grafikę: </label></td>' // style="width: 36%;
				+ '<td><tt>[[Plik:</tt><input type="text" id="CzyWieszFile2" name="CzyWieszFile2" style="width: 52%; vertical-align: middle;" disabled><tt>|100px|right]]</tt></td>');

		//author row
		var $author_row = $(/*html*/`
			<tr id="CzyWieszAuthorRow">
				<td>Główna autor(-ka) artykułu<span class="czywiesz-tip" title="Gadżet ustala autorstwo wg największej edycji w ciągu ostatnich 10 dni (sprawdź zmiany w ostatnich dniach)."><sup>(?)</sup></span>: </td>
				<td><input type="text" id="CzyWieszAuthor" name="CzyWieszAuthor" style="width: 50%;margin-left: 2px;vertical-align: middle;">
				&nbsp;&nbsp;<input type="checkbox" checked id="CzyWieszAuthorInf" name="CzyWieszAuthorInf" style="vertical-align: middle;"><label for="CzyWieszAuthorInf"> wysłać powiadomienia?</label></td>
			</tr>
			<tr id="CzyWieszAuthor2Row">
				<td>Druga autor(-ka) artykułu<span class="czywiesz-tip" title="Użyj listy zmian, żeby sprawdzić, czy ktoś jeszcze wprowadzał duże zmiany."><sup>(?)</sup></span>: </td>
				<td><input type="text" id="CzyWieszAuthor2" name="CzyWieszAuthor2" style="width: 50%;margin-left: 2px;vertical-align: middle;">
				</td>
			</tr>
			<tr id="CzyWieszAuthorInfo">
				<td colspan=2></td>
			</tr>
		`.replace(/\n\t+/g, '').trim());

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
		var $comment_paragraph = $('<p></p>').append($comment_paragraph_checkbox).append('<label for="CzyWieszCommentCheckbox"> Potrzebujesz zamieścić dodatkowy komentarz? (Twój podpis zostanie dodany automatycznie)</label>');
		var $comment_textarea_paragraph = $('<p id="CzyWieszCommentContainer" style="display: none;"></p>')
			.html('<textarea id="CzyWieszComment" style="width: 570px;" rows="2" value=""></textarea>');

		//rules paragraph
		var $rules_paragraph = $('<p id="CzyWieszRules"></p>')
			.html(`<small>Reguły: Zgłaszaj hasła, które powstały lub zostały rozbudowane nie dawniej niż 10 dni temu.
				Hasła muszą posiadać źródła (najlepiej w formie przypisów) oraz muszą zawierać co najmniej 2 kB samej treści.</small>`)
			.css({border: '1px solid #F0F080', backgroundColor: '#FFFFE0', paddingLeft: '5px'});
 
		var $loading_bar = $('<div id="CzyWieszLoaderBar"></div>')
			.css({width: '100%', backgroundColor: 'rgb(220, 220, 220)', border: '1px solid rgb(187, 187, 187)', borderRadius: '3px', boxSizing: 'border-box'})
			.html('<p id="CzyWieszLoaderBarParagraph" style="margin: 0 0 0 7px; position: absolute;">&nbsp;</p>'
				+ '<div id="CzyWieszLoaderBarInner" style="width: 0; height: 20px; background-color: #ABEC46; border: none; border-radius: 3px;"></div>');

		//build the dialog
		var $dialog = $('<table></table>').css('width','100%').append($ref_row).append($images_row).append($file_row)
			.append($author_row).append($signature_row).append($wikiproject_row);
		$dialog = $('<div id="CzyWieszGadget"></div>').append($title_paragraph).append($question_paragraph).append($question_textarea_paragraph)
			.append($dialog).append($comment_paragraph).append($comment_textarea_paragraph).append($rules_paragraph).append($loading_bar);
 
		//main buttons
		var buttons = {
			"Zgłoś": function() {
				if (D.sourced) {
					D.main.checkForm();
				}
				else {
					alert('Artykuł bez źródeł jest zdyskwalifikowany z nominacji. (Jeśli źródła są, to zwróć uwagę, czy tytuł sekcji jest prawidłowy, tzn. „Przypisy” lub „Bibliografia”.)');
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

		// debug quicky
		if (D.debugmode) {
			$('#CzyWieszQuestion').val(`jak testować '''[[${D.wgTitle}]]'''?`);
			// $('#CzyWieszAuthor').parent().append(`
			// 	<p style="padding:2px;margin:0;font-size:80%;background:wheat"
			// 			title="Autor dostanie powiadomienie o utworzonej podstronie." 
			// 		>Uwaga! Dla testów lepiej wpisz siebie (autor dostanie pinga).
			// 	</p>
			// `);
		}

		//fill wikiprojects list
		D.wikiprojects.load();

		// check size of article and make a tip for the possible author
		this.pagerevs();
		
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
						+ `<div id="CzyWieszGallery">`;
						for (var i=0; i<IMG_ARR.length; i++) {
							GALLERY += '<fig>';
							GALLERY += IMG_ARR[i].outerHTML.replace(/\swidth=\"\d+\"/,'').replace(/\sheight=\"[^\"]*\"/,'').replace(/\sclass=\"[^\"]*\"/g,'');
							GALLERY += '</fig>';
						}
				GALLERY	+= '</div> </div>';

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
			$(/*html*/`<div>
				<div class="floatright">${D.config.CWicon}</div>
				<p style="margin-left: 10px;">Zgodnie z wytycznymi <a class="czywiesz-external" target="_blank" href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojektu Czy wiesz</a> zgłaszane hasło powinno posiadać źródła w formie bibliografii lub przypisów.
				<a class="czywiesz-external" target="_blank" href="/wiki/Wikiprojekt:Czy_wiesz/pomoc#Zg.C5.82aszanie_propozycji_i_poprawa_hase.C5.82" title="Wikiprojekt:Czy wiesz/pomoc#Zgłaszanie propozycji i poprawa haseł">Więcej informacji w instrukcji</a>
				<br /><small>Możliwe, że w artykule sekcje ze źródłami są błędnie nazwane – w takim wypadku popraw je.</small></p>
			</div>`)
			.dialog({ modal: true, dialogClass: "wikiEditor-toolbar-dialog", close: function() { $(this).dialog("destroy"); $(this).remove();} });
		});

		// click on (+) near wikiprojects combo box → add new combo box and enlarge the dialog window
		$('#CzyWieszWikiprojectAdd').click(function(){
			$('#CzyWieszWikiprojectContainer').append(D.wikiprojects.$select.clone());
			$('#CzyWieszLoaderBar').parent().css({height: '+=24'});
		});

		$('#CzyWieszCommentCheckbox').change(function(){
			$('#CzyWieszCommentContainer').toggle();
		});

		//$('#CzyWieszQuestion').keyup();
		$('#CzyWieszQuestion').focus();
		
	}

	/** Page revisions and author data. */
	async pagerevs () {
		const D = this.core;
		const bigEdit = 2048; // big/min edit

		const {revisions, records} = await this.revisionList.readRevs(D.wgTitle, 10);
		D.log('revisions in last 10 days + 1 edit:', revisions.length);
		D.log('day-users in last 10 days:', records.length);
		let editSize = 0;
		// found edits
		if (records.length > 0) {
			// find a winner edit/author
			let {record:winner, size} = this.revisionList.findWinner(records, bigEdit);
			D.log(JSON.stringify(winner), size);

			// find size on the day of edit
			editSize = size;

			// add a possible author…
			if (winner) {
				$('#CzyWieszAuthor').val(winner.user);
				$('#CzyWieszAuthor').after('&nbsp;<small id="CzyWieszAuthorTip"><span class="czywiesz-tip" title="Autorstwo ustalone wg największej lub najnowszej dużej edycji z ostatnich 10 dni (dodane ' + winner.added + ' znaków, data: ' + winner.day + ').">(!)</span></small>&nbsp;');
				// if (D.debugmode) {
				// 	$('#CzyWieszAuthor').width('25%').val(D.wgUserName);
				// 	$('#CzyWieszAuthor').after(winner.user);
				// }
			} else {
				alert(`
					⚠️ W ciągu ostatnich 10 dni ''nie dokonano wystarczająco dużych zmian''.
					Skumulowany rozmiar: ${editSize} bajtów, edycje: ${revisions.length-1}.

					Jeszcze raz rozważ zgłaszanie tego artykułu, gdyż może to być niezgodne z regulaminem.
				`.replace(/\n\t+/g, '\n'));
			}
		}
		// there are no edits in last 10 days
		else {
			// we should still get one revision
			D.log(JSON.stringify(revisions));
			editSize = revisions[0].size;
			alert(`
				⚠️ W ciągu ostatnich 10 dni ''nie wykonano żadnych zmian''.

				Jeszcze raz rozważ zgłaszanie tego artykułu, gdyż może to być niezgodne z regulaminem.
			`.replace(/\n\t+/g, '\n'));
		}

		D.articlesize = {
			size:	editSize,
			enough:	(editSize >= bigEdit),
			warn:	(editSize >= bigEdit ? '' : (D.config.no + '&nbsp;&nbsp;<strong style="color: red;">Rozmiar ' + editSize + ' b dyskwalifikuje artykuł ze zgłoszenia!</strong> <!--small>(<a class="czywiesz-external">info</a>)</small-->') )
		};

		// autor/edit info: when, who, what changed
		if (records && records.length) {
			let infoTable = `<table class="wikitable">`;
			infoTable += `<tr>
				<th>Data</th>
				<th>Dodane</th>
				<th>Usunięte</th>
				<th>Edycje</th>
				<th>Autor(ka)</th>
			</tr>`;
			for (const record of records) {
				infoTable += `<tr>
					<td>${record.day}</td>
					<td>+${record.added}</td>
					<td>-${record.removed}</td>
					<td>${record.edits}${record.isNew ? ' (nowy art.)' : ''}</td>
					<td>${record.user}</td>
				</tr>`;
			}
			infoTable += `</table>`;
			const historyHref = mw.util.getUrl(null, {action:'history'});
			const container = document.querySelector('#CzyWieszAuthorInfo td');
			container.innerHTML = /*html*/`
						<a class="dyk-toggle" role="button" href="#">(pokaż zmiany w ostatnich dniach)</a>
						<div style="display:none" class="dyk-toggle-content">
							${infoTable}
							<a href="${historyHref}" class="czywiesz-external" target="_blank">zobacz historię</a>
						</div>
			`;
			// toggle action
			const $toggleContent = $('.dyk-toggle-content', container);
			$('.dyk-toggle', container).click(function(e) {
				e.preventDefault();
				$toggleContent.toggle();
			});
		}

		// size warning
		$('<tr id="CzyWieszSize"></tr>')
			.insertAfter($('#CzyWieszRefs'))
			.html('<td>Rozmiar (>2 kb): </td>'
				+ '<td>' + (D.articlesize.enough ? D.config.yes : D.articlesize.warn) + '</td>')
			.css( D.articlesize.enough ? {display: 'none'} : {})
		;

		// tooltips
		$('#CzyWieszGadget .czywiesz-tip').click(function () {
			alert(this.title);
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
		var AUTHOR_INF = ( $('#CzyWieszAuthorInf').prop('checked') ? true : false );
		var AUTHOR2 = $('#CzyWieszAuthor2').val().trim();
		var SIGNATURE = $('#CzyWieszSignature').val().trim();
		//get the wikiprojects
		var wikiprojectSet = new Set();
		$('.czywiesz-wikiproject').each( function() {
			var val = $(this).val();
			if (val != 'none') {
				wikiprojectSet.add(val);
			}
		});
		var WIKIPROJECT = Array.from(wikiprojectSet).map(v=>D.wikiprojects.list[v]);

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
			if (typeof SIGNATURE != 'string' || SIGNATURE === '') {
				invalid.is = true;
				invalid.fields.push('Signature');
				invalid.alert.push('Podpisz się.');
			}
			if ( (typeof COMMENT!='string'&&typeof COMMENT!='boolean') || (typeof COMMENT=='string' && (COMMENT===''||COMMENT.match(/^[^A-ZĘÓĄŚŁŻŹĆŃa-zęóąśłżźćń]+$/)) ) || (typeof COMMENT=='string'&&COMMENT==true) ) {
				invalid.is = true;
				invalid.fields.push('Comment');
				invalid.alert.push('Jeśli musisz podać jakiś komentarz to podaj jakiś sensowny, jeśli nie – wyłącz to pole. Nie wstawiaj w tym polu samego podpisu (lecz w przypadku komentarza – podpisz się).');
			}

		const values = {
			question:    QUESTION,
			file:        FILE,
			images:      IMAGES,
			refs:        REFS,
			author:      AUTHOR,
			authorInf:   AUTHOR_INF,
			author2:      AUTHOR2,
			signature:   SIGNATURE,
			comment:    COMMENT,
			wikiproject: WIKIPROJECT
		};

		return {invalid, values};
	}

}

module.exports = { DykForm };
