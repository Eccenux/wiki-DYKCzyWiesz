/* global describe, it */
const { assert } = require('chai');
const { Imdb } = require('../src/Imdb');

describe('imdb', function () {
	describe('imdb redir', function () {
		// test function specific to *imdb redir*
		function test(text, expected) {
			// wrap
			let result = Imdb.redir(text);
			if (result !== expected) {
				console.log({text, result, expected});
			}
			assert.equal(result, expected);
		}
		// actual test
		it('should resolve redirs', function () {
			test(`[[IMDb.com]]`, `[[IMDb]]`);
			test(`[[IMDb.com|abc]]`, `[[IMDb|abc]]`);
			test(`[[Internet Movie Database|xyz]]`, `[[IMDb|xyz]]`);
		});
	});
});
