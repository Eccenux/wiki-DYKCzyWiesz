const fs = require('fs');
const strip = require('strip-comments');

/**
 * Strip JS, but keep readable.
 * @param {String} filePath Path without extension.
 */
function stripJs(filePath) {
	// Read the original JavaScript file
	const originalCode = fs.readFileSync(filePath + '.js', 'utf8');

	// Options to preserve protected comments
	const options = {
		keepProtected: true,
	};

	// Strip comments
	let minifiedCode = strip(originalCode, options);
	console.log('comments:', {before:originalCode.length, after:minifiedCode.length});
	// Whitespace
	// (note: could affect template strings in general, but should not be dangerous in this project)
	const before = minifiedCode.length;
	minifiedCode = minifiedCode
		.replace(/\r/g, '')	// Windows
		.replace(/[ \t]+\n/g, '\n')	// Line endings
		.replace(/\n{2,}/g, '\n')	// Multiline
	;
	const after = minifiedCode.length
	console.log('whitespace:', {before, after});

	// Write the minified code to the new file
	fs.writeFileSync(filePath + '.min.js', minifiedCode);

	console.log('Comments stripped and the script saved as *.min.js.');
}

// strip
stripJs('dist/CzyWiesz');
