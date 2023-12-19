/**
 * Wikiploy gadget example.
 * 
 * History and docs:
 * https://github.com/Eccenux/wikiploy-rollout-example
 * 
 * Deployed using: [[Wikipedia:Wikiploy]]
 */
class MyGadget {
	constructor() {
		this.options = {
			createTool: true,
		};
	}

	/** Initialize things when DOM is ready. */
	init() {
		// Example link in the tools sidebar
		if (this.options.createTool) {
			var portletId = mw.config.get('skin') === 'timeless' ? 'p-pagemisc' : 'p-tb';
			var linkLabel = '🧩 My gadget dialog';
			var itemId = 'some-unique-gadget-tool';
			var item = mw.util.addPortletLink(portletId, '#', linkLabel, itemId);
			$(item).on('click', (evt) => {
				evt.preventDefault();
				this.openDialog();
			});
		}
	}

	/** Open some dialog. */
	openDialog() {
		// Open a dialog window here
		alert("We are open for community!");
	}
}

module.exports = { MyGadget };
