/**
 * Example for tests
 */
class Imdb {
	/** Resolve redirects. */
	static redir(str) {
		let after = str;

		// redir
		after = after.replace(/\[\[(?:IMDB|Imdb\.com|The Internet Movie Database|Internet Movie Database)([|\]])/ig, '[[IMDb$1');

		return after;
	}
}

module.exports = { Imdb };
