const fs = require('fs');
const UglifyJS = require("uglify-js");

const devOptions = {
	compress: false,
	mangle: false,
	output: {
		// preserve_line: true,
		preamble: "",
		// comments: /^!/,
		// braces: false,
		quote_style: 3,
		beautify: true,
		indent_level: "\t",	// only with beautify
	}
};
// production/release
const proOptions = {
	compress: false,
	mangle: {},
	output: {},
};


/**
 * Strip JS, but keep readable.
 * @param {String} filePath Path without extension.
 */
function stripJs(filePath, headerPath="", dev=true) {
	// Read the original JavaScript file
	const code = fs.readFileSync(filePath + '.js', 'utf8');

	// Options
	const ext = dev ? '.min.js' : '.prod.js';
	const options = structuredClone(dev ? devOptions : proOptions);
	if (headerPath.length) {
		options.output.preamble = fs.readFileSync(headerPath, 'utf8');
	}

	// Minify
	const re = UglifyJS.minify(code, options);
	if (re.error) console.error(re.error);
	console.log('strip:', {before:code.length, after:re.code.length});

	// Write the minified code to the new file
	fs.writeFileSync(filePath + ext, re.code);

	// console.log('Comments stripped and the script saved as *.min.js.');
}

// strip
// stripJs('dist/CzyWiesz');

module.exports = { stripJs };

