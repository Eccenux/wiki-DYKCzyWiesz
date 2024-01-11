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
		/** @private OO.ui.Dialog placeholder. */
		this.doneDialogInternal = false;
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
	update(info, append) {
		if (append) {
			info = `<div>${this.elInfo.innerHTML}</div>` + info;
		}
		this.elInfo.innerHTML = info;
		if (append) {
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
			this.content.$element.append( `<div class="info">${me.info}</div>` );
			this.$body.append( this.content.$element );

			// cache
			me.elInfo = this.content.$element[0].querySelector('.info');
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