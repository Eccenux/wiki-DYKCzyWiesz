/* global describe, it */
let { assert } = require('chai');
let { RevisionList } = require('../src/RevisionList');

describe('RevisionList', () => {
	const revisionList = new RevisionList();
	const prepareData = (r,l) => revisionList.prepareData(r,l);
	const uniq = (a) => {const s = new Set(a); return Array.from(s)};
	// example
	const revisions = [
		{"user":"Nux","timestamp":"2024-01-12T19:08:02Z","size":6200},
		{"user":"Nux","timestamp":"2024-01-12T18:56:56Z","size":10200},
		{"user":"MalarzBOT","timestamp":"2023-12-24T05:23:30Z","size":6100},
		{"user":"Czupirek","timestamp":"2023-12-09T23:02:00Z","size":6200},
		{"user":"Czupirek","timestamp":"2023-12-09T22:55:32Z","size":6145},
		{"user":"Nux","timestamp":"2023-12-09T16:44:15Z","size":6150}
	];
	const expectedList = [
		{"day":"2024-01-12","user":"Nux","added":4100,"removed":4000,"edits":2},
		{"day":"2023-12-24","user":"MalarzBOT","added":0,"removed":100,"edits":1},
		{"day":"2023-12-09","user":"Czupirek","added":55,"removed":5,"edits":2},
		{"day":"2023-12-09","user":"Nux","added":6150,"removed":0,"edits":0}
	];
	// helper log
	function formatedJson(data) {
		let text = JSON.stringify(data);
		return text.replace(/\},\{/g, '},\n{');
	}
	
	describe('prepareData', () => {
		let result;
		it('should return all records', () => {
			result = prepareData(revisions);
			console.log(formatedJson(result));
			let users = result.map(r=>r.user);
			let days = result.map(r=>r.day);
			assert.equal(uniq(users).length, 3);
			assert.equal(uniq(days).length, 3);
			// let first = result[0];
			// const expected = expectedList[0];
			// assert.deepEqual(first, expected);
			assert.deepEqual(result, expectedList);
		});
		it('should cut initial edit', () => {
			result = prepareData(revisions, new Date('2023-12-09T20:00:00Z'));
			console.log(formatedJson(result));
			assert.equal(result.length, 3);
			let last = result.pop();
			const expected = expectedList[2];
			assert.deepEqual(last, expected);
		});
		it('should cut until 2023-12-20', () => {
			result = prepareData(revisions, new Date('2023-12-20T10:00:00Z'));
			console.log(formatedJson(result));
			assert.equal(result.length, 2);
			let last = result.pop();
			const expected = expectedList[1];
			assert.deepEqual(last, expected);
		});
		it('should cut until 2023-12-30', () => {
			result = prepareData(revisions, new Date('2023-12-30T10:00:00Z'));
			console.log(formatedJson(result));
			assert.equal(result.length, 1);
			let last = result.pop();
			const expected = expectedList[0];
			assert.deepEqual(last, expected);
		});
	});

	describe('findWinner', () => {
		it('should find latest', () => {
			let records = [
				{"day":"2024-01-12","user":"Nux","added":1100,"removed":10,"edits":2},
				{"day":"2023-12-24","user":"MalarzBOT","added":100,"removed":100,"edits":1},
				{"day":"2023-12-09","user":"Czupirek","added":2100,"removed":5,"edits":2},
				{"day":"2023-12-09","user":"Nux","added":6150,"removed":0,"edits":0}
			];
			let expected = records[2];
			let {record:result, size} = revisionList.findWinner(records, 2000);
			console.log(formatedJson(result));

			assert.equal(result.user, 'Czupirek');
			assert.equal(size, 2100);
			assert.deepEqual(result, expected);
		});
		it('should find acumulated', () => {
			// the key req here is that none is larger then 2000
			let records = [
				{"day":"2024-01-12","user":"Nux","added":1200,"removed":10,"edits":2},
				{"day":"2023-12-24","user":"MalarzBOT","added":100,"removed":100,"edits":1},
				{"day":"2023-12-12","user":"Nux","added":1100,"removed":10,"edits":1},
				{"day":"2023-12-09","user":"Czupirek","added":1400,"removed":5,"edits":2},
				{"day":"2023-12-09","user":"Nux","added":1150,"removed":0,"edits":0}
			];
			let expected = records[0];
			let {record:result, size} = revisionList.findWinner(records, 2000);
			console.log(formatedJson(result));

			assert.equal(result.user, 'Nux');
			assert.equal(size, 2400);
			assert.deepEqual(result, expected);
		});
	});
});
