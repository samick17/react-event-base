import { registerEvent } from './DOMUtils';
import { forEach } from './ObjectUtils';

export const Tab = 9;
export const Enter = 13;
export const Escape = 27;
export const Space = 32;
export const ArrowUp = 38;
export const ArrowDown = 40;
export const ArrowLeft = 37;
export const ArrowRight = 39;

function normalizeKeys(keys) {
	return keys.map(k => k.toLowerCase()).sort().join(',');
}

/*
 * @category: static function
 * @description: Register KeyDown Event Handlers for window
 * @name: registerKeyDownEventHandlers
 * @param: {Array} handlers - The event handlers
 * @param: {bool} logKey - True will print key if there is no matched handler
 * @returns: The function which is used to unregister the event handler
 * @example:
 * registerKeyDownEventHandlers([
 * {
 *   keys: ['ctrl', '+'],
 *   handler: () => {
 *     console.log('new tab');
 *   }
 * },
 * {
 *   keys: ['ctrl', '-'],
 *   handler: () => {
 *     console.log('close the tab');
 * 	 }
 * }
 * ]);
 */
export const registerKeyDownEventHandlers = (handlers, logKey=false) => {
	const keyEventHandlers = {};
	forEach(handlers, (def) => {
		const key = normalizeKeys(def.keys);
		keyEventHandlers[key] = def.handler;
	});
	return registerEvent(document, 'keydown', (e) => {
		const keys = [];
		let isOneOfComboKeys = false;
		if(e.ctrlKey) {
			keys.push('ctrl');
			isOneOfComboKeys = true;
		}
		if(e.altKey) {
			keys.push('alt');
			isOneOfComboKeys = true;
		}
		if(e.shiftKey) {
			keys.push('shift');
			isOneOfComboKeys = true;
		}
		if(['Control', 'Shift', 'Alt'].indexOf(e.key) < 0) keys.push(e.key);
		const key = normalizeKeys(keys);
		const handler = keyEventHandlers[key];
		if(handler) {
			e.stopPropagation();
			e.preventDefault();
			handler();
		} else if(logKey) {
			console.log(key);
		}
	});
};
