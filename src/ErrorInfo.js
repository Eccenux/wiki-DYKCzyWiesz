/**
 * D.errors info.
 */
class ErrorInfo {
	/**
	 * Init.
	 * @param {Function} emailSupport Function to inform gadget support about problems.
	 * @param {String} supportUser User to inform about problems.
	 */
	constructor(emailSupport, supportUser) {
		this.emailSupport = emailSupport;
		this.supportUser = supportUser;
		this.errors = [];
	}

	/** Clear messages. */
	clear() {
		this.errors.length = 0;
	}

	/** Add error message. */
	push(message) {
		this.errors.push(message);
	}

	/** No messages. */
	isEmpty() {
		return this.errors.length < 1;
	}
	
	/** Show errors. */
	show() {
		let list = $('<ul></ul>');
		for (let i=0; i < this.errors.length; i++) {
			list.append( $('<li></li>').html(this.errors[i]) );
		}
		let dialog = $('<div id="CzyWieszErrorDialog"></div>')
			.append(list)
			.append( $(/* html */`
				<p>Coś poszło nie tak. Jeśli powyższa lista nie wyjaśnia problemu, to więcej informacji jest w konsoli przeglądarki.</p>
				<p>Jeśli problem jest nietypowy, to <a href="#" role="button" class="CzyWieszEmailDoAutoraWyslij">wyślij e-mail programiście z danymi błędu</a> (szybka wysyłka logów mailem).<span class="CzyWieszEmailDoAutoraWyslano"></span></p>
				<p>Możesz też opisać co się stało na <a href="https://pl.wikipedia.org/wiki/WP:BAR:TE" class="czywiesz-external" target="_blank">w kawiarence technicznej</a>.</p>
			`) )
		;
		
		dialog.dialog({
			width: 400,
			modal: true,
			title: 'Wystąpił błąd',
			draggable: true,
			dialogClass: "wikiEditor-toolbar-dialog",
			close: function() { $(this).dialog("destroy"); $(this).remove();}
		});
		const D = this;
		$('#CzyWieszErrorDialog a.CzyWieszEmailDoAutoraWyslij').click(function(e) {
			e.preventDefault();
			D.emailSupport(this);
		});
	}
}

module.exports = { ErrorInfo };
