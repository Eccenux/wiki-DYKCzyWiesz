/* global SimpleDragDialog */
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

	/** Add TEXT error message. */
	push(message) {
		this.errors.push(message);
	}

	/** No messages. */
	isEmpty() {
		return this.errors.length < 1;
	}
	
	/** Show errors. */
	show() {
		let list = document.createElement('ul');
		for (let message of this.errors) {
			let li = document.createElement('li');
			li.textContent = message;
			list.appendChild(li);
		}

		const content = document.createElement('div');
		content.id = 'CzyWieszErrorDialog';
		content.appendChild(list);
		content.innerHTML = /* html */`
				<p>Coś poszło nie tak. Jeśli powyższa lista nie wyjaśnia problemu, to więcej informacji jest w konsoli przeglądarki.</p>
				<p>Jeśli problem jest nietypowy, to <a href="#" role="button" class="CzyWieszEmailDoAutoraWyslij">wyślij e-mail programiście z danymi błędu</a> (szybka wysyłka logów mailem).<span class="CzyWieszEmailDoAutoraWyslano"></span></p>
				<p>Możesz też opisać co się stało na <a href="https://pl.wikipedia.org/wiki/WP:BAR:TE" class="czywiesz-external" target="_blank">w kawiarence technicznej</a>.</p>
		`;
		
		let sdd = new SimpleDragDialog();
		sdd.create({
			title:'Wystąpił błąd',
			dialogClass: "dyk-dialog dyk-error-dialog",
			content,
		});
		const me = this;
		$('a.CzyWieszEmailDoAutoraWyslij', content).click(function(e) {
			e.preventDefault();
			me.emailSupport(this);
		});
	}
}

module.exports = { ErrorInfo };
