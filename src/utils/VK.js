import {registerEvent} from '@Models/Base/DOMUtils';

export const Tab = 9;
export const ArrowUp = 38;
export const ArrowDown = 40;
export const ArrowLeft = 37;
export const ArrowRight = 39;


export const registerKeyDownEventHandlers = (handlers) => {
	return registerEvent(window, 'keydown', (e) => {
		let keys = [];
		if(e.ctrlKey) keys.push('ctrl');
		if(e.altKey) keys.push('alt');
		if(e.shiftKey) keys.push('shift');
		// console.log(e.key);
		if(keys.length === 0) keys.push(e.key);
		const key = keys.sort().join('+');
		const handler = handlers[key];
		if(handler) {
			e.stopPropagation();
			e.preventDefault();
			handler();
		}
	});
};
