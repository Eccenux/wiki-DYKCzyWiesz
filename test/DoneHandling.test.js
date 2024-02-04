let { assert } = require('chai');
let { DoneHandling } = require('../src/DoneHandling');

describe('DoneHandling', () => {
	const doneHandling = new DoneHandling();
	
	describe('statusChange', () => {
		let eg = (status) => {
			return `{{CW/weryfikacja
			| artykuł        = Tatry
			| przypisy       = +
			| ilustracje     = dużo
			| 1. autorstwo   = Lajsikonik
			| 2. autorstwo   =
			| nominacja      = ABX
			| status         = ${status}
			| 1. sprawdzenie = Ludmiła Pilecka
			| 2. sprawdzenie = Cień
			| 3. sprawdzenie = Roo72
			| 4. sprawdzenie = ?
			}}`.replace(/\n\t+/g, '\n')
		}
		function cleanup(tpl) {
			tpl = tpl.replace(/[\s\S]+?(\| status.+)/, '$1');
			tpl = tpl.replace(/([\s\S]*)(\| status.+)[\s\S]*/, '$1$2');
			// tpl = tpl.replace(/([\s\S]+(status|sprawdzenie).+)/, '$1');
			return tpl;
		}
		let resInfo = (result, expected) => `\nresult:\n${result}\nexpected:\n${expected}`;

		let result;
		it('should replace empty status', () => {
			const empty = eg('');
			const expected = eg('abc');
			result = doneHandling.statusChange(empty, 'abc');
			let resultShort = cleanup(result);
			let expectedShort = cleanup(expected);
			assert.equal(resultShort, expectedShort, resInfo(resultShort, expectedShort));
		});
		it('should remove status', () => {
			const empty = eg('zakończone');
			const expected = eg('');
			result = doneHandling.statusChange(empty, '');
			let resultShort = cleanup(result);
			let expectedShort = cleanup(expected);
			assert.equal(resultShort, expectedShort, resInfo(resultShort, expectedShort));
		});
		it('should add before check param', () => {
			const empty = eg('abc');
			const expected = eg('def');
			result = doneHandling.statusChange(empty, 'def');
			assert.equal(result, expected, resInfo(result, expected));
		});
		it('should add in empty template', () => {
			let tpl = `
				{{CW/weryfikacja
				| artykuł        = Tatry
				}}
			`.replace(/\n\t+/g, '\n');
			let expected = `
				{{CW/weryfikacja
				| artykuł        = Tatry
				| status         = abc
				}}
			`.replace(/\n\t+/g, '\n');
			result = doneHandling.statusChange(tpl, 'abc');
			assert.equal(result, expected, resInfo(result, expected));
		});
		it('should pad by other params', () => {
			let tpl, expected;
			tpl = `
				{{CW/weryfikacja
				| artykuł    = Tatry
				}}
			`.replace(/\n\t+/g, '\n');
			expected = `
				{{CW/weryfikacja
				| artykuł    = Tatry
				| status     = abc
				}}
			`.replace(/\n\t+/g, '\n');
			result = doneHandling.statusChange(tpl, 'abc');
			assert.equal(result, expected, resInfo(result, expected));

			tpl = `
				{{CW/weryfikacja
				| artykuł = Tatry
				}}
			`.replace(/\n\t+/g, '\n');
			expected = `
				{{CW/weryfikacja
				| artykuł = Tatry
				| status  = abc
				}}
			`.replace(/\n\t+/g, '\n');
			result = doneHandling.statusChange(tpl, 'abc');
			assert.equal(result, expected, resInfo(result, expected));
		});
	});
});
