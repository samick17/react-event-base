import {
	createEventTypes,
} from './EventUtils';

test('EventUtils:createEventTypes', () => {
	expect(createEventTypes(['Add', 'Remove'])).toEqual({Add: '0', Remove: '1'});
	expect(createEventTypes(['Add', 'Remove'], 'e')).toEqual({Add: 'e0', Remove: 'e1'});
});
