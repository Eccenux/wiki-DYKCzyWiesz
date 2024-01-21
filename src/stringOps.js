/** Encode user string for JS. */
function htmlspecialchars(text) {
	return text.toString()
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;")
	;
}

module.exports = { htmlspecialchars };