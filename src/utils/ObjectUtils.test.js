import {
	cloneDeep,
	deepEqual,
	diffTwoObjects,
	format
} from './ObjectUtils';

test('ObjectUtils:cloneDeep', () => {
	const instance1 = {
		name: 'f1'
	};
	const clonedInstance1 = cloneDeep(instance1);
	expect(clonedInstance1).toEqual(instance1);
	expect(clonedInstance1 === instance1).toBe(false);
	const instance2 = {
		name: 'f1',
		args: {
			arg1: 'custom'
		}
	};
	const clonedInstance2 = cloneDeep(instance2);
	expect(clonedInstance2).toEqual(instance2);
	expect(clonedInstance2 === instance2).toBe(false);
});
test('ObjectUtils:deepEqual', () => {
	/* Basic types */
	expect(deepEqual(0, 0)).toBe(true);
	expect(deepEqual(0, '0')).toBe(false);
	expect(deepEqual({}, {})).toBe(true);
	expect(deepEqual({}, '{}')).toBe(false);
	expect(deepEqual(true, true)).toBe(true);
	expect(deepEqual(false, false)).toBe(true);
	expect(deepEqual(true, false)).toBe(false);
	expect(deepEqual(false, true)).toBe(false);
	expect(deepEqual(true, 'true')).toBe(false);
	expect(deepEqual(true, 'false')).toBe(false);
	expect(deepEqual(false, 'false')).toBe(false);
	class Foo {
		constructor(name) {
			this.name = name;
		}
	}
	const foo1 = new Foo('f1');
	const foo2 = new Foo('f2');
	const foo3 = new Foo('f1');
	expect(deepEqual(foo1, foo2)).toBe(false);
	expect(deepEqual(foo2, foo3)).toBe(false);
	expect(deepEqual(foo1, foo3)).toBe(true);
	/**/
	expect(deepEqual({name: 'f1'}, {name: 'f1'})).toBe(true);
	expect(deepEqual({name: 'f1'}, {name: 'f2'})).toBe(false);
	expect(deepEqual({name: 'f1'}, {})).toBe(false);
});
test('ObjectUtils:diffTwoObjects', () => {

});
test('ObjectUtils:format', () => {
	expect(format('name: {0}, type: {1}', 'samick', 'host')).toBe('name: samick, type: host');
});
