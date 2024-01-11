/* global describe, it */
let { assert } = require('chai');
let { timeCounter, endCounter } = require('../src/timeCounter');

describe('timeCounter', () => {
	describe('timeCounter function', () => {
		it('should return 0 days when now is very close', () => {
			let startDate = new Date().toISOString();
			let result = timeCounter(startDate);
			assert.equal(result, 0);
		});

		it('should return 0 days when now is close', () => {
			let startDate;
			let fakeNow;
			let result;
			startDate = '2023-01-01 10:30:00';
			fakeNow = new Date('2023-01-01 12:30:00');
			result = timeCounter(startDate, fakeNow);
			assert.equal(result, 0);
			startDate = '2023-01-01 10:30:00';
			fakeNow = new Date('2023-01-01 15:30:00');
			result = timeCounter(startDate, fakeNow);
			assert.equal(result, 0);
			// or should it round up for 12h?
			startDate = '2023-01-01 10:30:00';
			fakeNow = new Date('2023-01-01 23:30:00');
			result = timeCounter(startDate, fakeNow);
			assert.equal(result, 0);
		});

		it('should return correct number of days when start date is in the past', () => {
			let startDate = '2024-01-01 00:00:00';
			let fakeNow = new Date('2024-01-10 12:00:00');
			let result = timeCounter(startDate, fakeNow);
			assert.equal(result, 9); // 10th January minus 1st January
		});

		it('should handle ISO date strings with "T" separator', () => {
			let startDate = '2024-01-01T00:00:00';
			let fakeNow = new Date('2024-01-10T12:00:00');
			let result = timeCounter(startDate, fakeNow);
			assert.equal(result, 9); // 10th January minus 1st January
		});

		it('should handle date strings with milliseconds', () => {
			let startDate = '2024-01-01 00:00:00.500';
			let fakeNow = new Date('2024-01-10 12:00:00');
			let result = timeCounter(startDate, fakeNow);
			assert.equal(result, 9); // 10th January minus 1st January
		});

		it('should handle date strings with different separators', () => {
			let startDate = '2024/01/01 00:00:00';
			let fakeNow = new Date('2024-01-10 12:00:00');
			let result = timeCounter(startDate, fakeNow);
			assert.equal(result, 9); // 10th January minus 1st January
			startDate = '2024-01-01T00:00:00';
			result = timeCounter(startDate, fakeNow);
			assert.equal(result, 9); // 10th January minus 1st January
		});
	});
	describe('endCounter function', () => {
		it('should end before current date', () => {
			let tpl = '{{licznik czasu|start=2024-01-10 12:00:00|dni=30}}';
			let fakeNow = new Date('2024-01-12 14:00:00');
			let exp = '{{licznik czasu|start=2024-01-10 12:00:00|dni=2}}';
			let result = endCounter(tpl, fakeNow);
			assert.equal(result, exp);

			tpl = '{{licznik czasu|start=2024-01-10 12:00:00|dni=30}}';
			fakeNow = new Date('2024-01-12 11:00:00');
			exp = '{{licznik czasu|start=2024-01-10 12:00:00|dni=1}}';
			result = endCounter(tpl, fakeNow);
			assert.equal(result, exp);
		});
		it('should leave as is when date is weird', () => {
			let tpl = '{{licznik czasu|start=2024-01-10 12:00:00|dni=30}}';
			let fakeNow = new Date('2024-01-02 12:00:00'); // past from tpl
			let result = endCounter(tpl, fakeNow);
			assert.equal(result, tpl);
		});
	});
});
