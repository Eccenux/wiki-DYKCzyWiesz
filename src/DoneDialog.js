/* global OO */

/**
 * Done-move progress and info dialog.
 */
class DoneDialog {
	/**
	 * @param {String} title Title.
	 * @param {String} content Startup HTML.
	 */
	constructor(title, info) {
		this.title = title;
		this.info = info;
		/**
		 * @type {OO.ui.Dialog}
		 * @private
		 */
		this.doneDialogInternal = false;
		/**
		 * @type {Element}
		 * @private
		 */
		this.elInfo = false;
		/**
		 * @type {Element}
		 * @private
		 */
		this.elWarnings = false;
		/**
		 * @type {Element}
		 * @private
		 */
		this.elWarningsList = false;
	}
	/** Show dialog. */
	open() {
		if (!this.doneDialogInternal) {
			this.init();
		}
		this.windowManager.openWindow( this.doneDialogInternal );
	}
	/**
	 * Update main content.
	 * @param {String} info HTML info.
	 * @param {Boolean} append Option to append info (e.g. to append errors).
	 */
	update(info, append, resize = true) {
		// clear
		if (!append) {
			this.elInfo.innerHTML = info;
		} else {
			const el = document.createElement('div');
			el.innerHTML = info;
			this.elInfo.appendChild(el);
		}
		if (append || resize) {
			this.forceResize();
		}
	}
	/**
	 * Add a warning.
	 * @param {String} info HTML info.
	 * @param {Boolean} append Append warning (replaced otherwise).
	 * @param {Boolean} resize 
	 */
	warn(info, append = true, resize = true) {
		// clear / show
		this.elWarnings.style.display = info.length ? 'block' : 'none';
		// clear
		if (!info.length || !append) {
			this.elWarningsList.innerHTML = "";
		}
		// new element
		if (info.length) {
			const el = document.createElement('li');
			el.innerHTML = info;
			this.elWarningsList.appendChild(el);
		}
		if (resize) {
			this.forceResize();
		}
	}
	/** Force resize (e.g. after update). */
	forceResize() {
		// this.doneDialogInternal.close();
		// this.doneDialogInternal.open();
		this.windowManager.updateWindowSize(this.doneDialogInternal);
	}

	/** @private init OO boilerplate.*/
	init() {
		const me = this;

		function DoneDialogInternal( config ) {
			DoneDialogInternal.super.call( this, config );
		}
		OO.inheritClass( DoneDialogInternal, OO.ui.ProcessDialog ); 
	
		// Name for .addWindows()
		DoneDialogInternal.static.name = 'doneDialogInternal';
		// Startup title.
		DoneDialogInternal.static.title = this.title;
		// Button(s).
		DoneDialogInternal.static.actions = [
			{ action: 'save', label: 'Zamknij', flags: 'primary' },
		];
	
		// Add content to the dialog body.
		DoneDialogInternal.prototype.initialize = function () {
			DoneDialogInternal.super.prototype.initialize.call( this );

			// base layout
			this.content = new OO.ui.PanelLayout( { 
				padded: true,
				expanded: false 
			} );
			this.content.$element.append( /*html*/`<div class="info">${me.info}</div>` );
			this.content.$element.append( /*html*/`<div class="warnings" style="display:none"><strong>Ostrzeżenia:</strong><ul></ul></div>` );
			this.$body.append( this.content.$element );

			// cache
			me.elInfo = this.content.$element[0].querySelector('.info');
			me.elWarnings = this.content.$element[0].querySelector('.warnings');
			me.elWarningsList = me.elWarnings.querySelector('ul');
		};

		DoneDialogInternal.prototype.getActionProcess = function ( action ) {
			var dialog = this;
			if ( action ) {
				return new OO.ui.Process( function () {
					dialog.close( { action: action } );
				} );
			}
			return DoneDialogInternal.super.prototype.getActionProcess.call( this, action );
		};		
	
		var doneDialogInternal = new DoneDialogInternal();
	
		// Setup OO.oo window manager.
		var windowManager = new OO.ui.WindowManager();
		$( document.body ).append( windowManager.$element );
		windowManager.addWindows( [ doneDialogInternal ] );
	
		// Keep internals
		this.windowManager = windowManager;
		this.doneDialogInternal = doneDialogInternal;
	}
}

module.exports = { DoneDialog };