let { assert } = require('chai');
let { DykForm } = require('../src/DykForm');

describe('DykForm', () => {
	const hasGoodQuestions = (value) => DykForm.prototype.hasGoodQuestions(value);

	describe('hasGoodQuestions', () => {
		it('should accept single questions', () => {
			assert.isTrue(hasGoodQuestions('jak odkryto Amerykę?'));
			assert.isTrue(hasGoodQuestions('ile razy odkryto Amerykę?'));
		});

		it('should reject multiple questions starting with że or który', () => {
			assert.isFalse(hasGoodQuestions(['że coś tam biega?','który coś tam biega?'].join('\n')));
			assert.isFalse(hasGoodQuestions(['który coś tam biega?','że coś tam biega?'].join('\n')));
			assert.isFalse(hasGoodQuestions(['który coś tam biega?','która coś tam biega innego?'].join('\n')));
			assert.isFalse(hasGoodQuestions(['którego coś tam biega?','której coś tam biega?'].join('\n')));
			assert.isFalse(hasGoodQuestions(['którym coś tam biega?','których coś tam biega?'].join('\n')));
		});

		it('should accept at least one differently starting question', () => {
			assert.isTrue(hasGoodQuestions(['że odkryto Amerykę?','ile razy odkryto Amerykę?'].join('\n')));
			assert.isTrue(hasGoodQuestions(['że odkryto Amerykę?','jak odkryto Amerykę?'].join('\n')));
			assert.isTrue(hasGoodQuestions(['jak odkryto Amerykę?','że odkryto Amerykę?'].join('\n')));
		});

		it('should be case insensitive', () => {
			assert.isFalse(hasGoodQuestions(['Że coś tam biega?','KTÓRY coś tam biega?'].join('\n')));
			assert.isFalse(hasGoodQuestions(['KTÓRA coś tam biega?','ŻE coś tam biega?'].join('\n')));
		});

		it('should ignore whitespace and empty lines', () => {
			assert.isFalse(hasGoodQuestions(['  że coś tam biega  ?','  który coś tam biega  ?'].join('\n')));
			assert.isFalse(hasGoodQuestions(['    że coś tam biega?       ','   który coś tam biega?   '].join('\n')));
			assert.isTrue(hasGoodQuestions(['   że coś tam biega?','     jak coś tam biega?'].join('\n')));
			assert.isTrue(hasGoodQuestions(['   że coś tam biega?   ','     jak coś tam biega?   '].join('\n')));
		});

		it('should handle question prefixes', () => {
			assert.isFalse(hasGoodQuestions(['…że coś tam biega?','…który coś tam biega?'].join('\n')));
			assert.isTrue(hasGoodQuestions(['…że coś tam biega?','…jak coś tam biega?'].join('\n')));
			assert.isFalse(hasGoodQuestions(['Czy wiesz, że coś tam biega?','Czy wiesz, który coś tam biega?'].join('\n')));
			assert.isTrue(hasGoodQuestions(['Czy wiesz, że coś tam biega?','Czy wiesz, jak coś tam biega?'].join('\n')));
		});
	});
});