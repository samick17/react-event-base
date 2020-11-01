import {
	getBy,
	updateWith,
	removeBy,
	containsKey,
	insertElement,
	spliceElement,
} from './DataUtils';

test('DataUtils:getBy', () => {
	expect(getBy({foo: 'bar'})).toBe(undefined);
	expect(getBy({foo: 'bar'}, null)).toBe(undefined);
	expect(getBy({foo: 'bar'}, '')).toBe(undefined);
	expect(getBy({foo: 'bar'}, 'foo')).toBe('bar');
	expect(getBy({foo: {bar: 'name'}}, 'foo.bar')).toBe('name');
});
test('DataUtils:updateWith', () => {
	const data = {foo: 'bar'};
	updateWith(data, 'name', 'new name');
	expect(data.name).toBe('new name');
});
test('DataUtils:removeBy', () => {
	const data = {foo: 'bar'};
	removeBy(data, 'foo');
	expect('foo' in data).toBe(false);
	expect(data.foo).toBe(undefined);
});
test('DataUtils:containsKey', () => {
	expect(containsKey({}, null)).toBe(false);
	expect(containsKey({}, '')).toBe(false);
	expect(containsKey({null: {}}, null)).toBe(true);
	expect(containsKey({'': {}}, '')).toBe(true);
});
test('DataUtils:insertElement', () => {
	const data = {elems: []};
	insertElement(data, 'elems', 0, 'a');
	expect(data).toEqual({elems: ['a']});
});
test('DataUtils:spliceElement', () => {
	const data = {elems: [1, 3, 5]};
	spliceElement(data, 'elems', 1, 2);
	expect(data).toEqual({elems: [1]});

	const data1 = {elems: [1, 3, 5]};
	spliceElement(data1, 'elems', 1, 1);
	expect(data1).toEqual({elems: [1, 5]});

	const data2 = {elems: [1, 3, 5]};
	spliceElement(data2, 'elems', 1, 0);
	expect(data2).toEqual({elems: [1, 3, 5]});
});
