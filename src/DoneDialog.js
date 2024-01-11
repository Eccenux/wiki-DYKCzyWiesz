/* global OO */

/**
 * Done-move progress info dialog.
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
	open() {
		if (!this.doneDialogInternal) {
			this.init();
		}
		this.windowManager.openWindow( this.doneDialogInternal );
	}
	/**
	 * 
	 * @param {String} info HTML info.
	 * @param {Boolean} append Option to append info (e.g. to append errors).
	 */
	update(info, append) {
		if (append) {
			info = `<div>${this.elInfo.innerHTML}</div>` + info;
		}
		this.elInfo.innerHTML = info;
	}

	/** @private init OO cruft.*/
	init() {
		const me = this;

		function DoneDialogInternal( config ) {
			DoneDialogInternal.super.call( this, config );
		}
		OO.inheritClass( DoneDialogInternal, OO.ui.Dialog ); 
	
		// Name for .addWindows()
		DoneDialogInternal.static.name = 'doneDialogInternal';
		// Startup title.
		DoneDialogInternal.static.title = this.title;
	
		// Add content to the dialog body.
		DoneDialogInternal.prototype.initialize = function () {
			DoneDialogInternal.super.prototype.initialize.call( this );

			// base layout
			this.content = new OO.ui.PanelLayout( { 
				padded: true,
				expanded: false 
			} );
			this.content.$element.append( `<h2 class="title">${me.title}</h2>` );
			this.content.$element.append( `<div class="info">${me.info}</div>` );
			this.$body.append( this.content.$element );

			// cache
			me.elTitle = this.content.$element[0].querySelector('.title');
			me.elInfo = this.content.$element[0].querySelector('.info');
		};

		// Setup height
		// DoneDialogInternal.prototype.getBodyHeight = function () {
		// 	return this.content.$element.outerHeight( true );
		// };
	
		var doneDialogInternal = new DoneDialogInternal( {
			size: 'medium'
		} );
	
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