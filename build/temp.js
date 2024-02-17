const fs = require('fs');
const UglifyJS = require("uglify-js");

const options = {
	compress: false,
	// mangle: false,
	mangle: {
		// mangle options
		properties: {
			// mangle property options
			regex: /DYK.+/,
		}
	},
	output: {
		// preserve_line: true,
		// preamble: "/* uglified */"
		comments: /^!/,
		braces: false,
		quote_style: 3,
		beautify: true,
		indent_level: "\t",	// only with beautify
	}
};
var filePath = 'dist/CzyWiesz'
var code = fs.readFileSync(filePath + '.js', 'utf8');
const re = UglifyJS.minify(code, options);
if (re.error) console.log(re.error);
// console.log(re.code.substring(0, 1000));

fs.writeFileSync(filePath + '.min.js', re.code);

console.log('strip:', {before:code.length, after:re.code.length});
