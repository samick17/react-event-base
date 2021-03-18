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

function createKeyHandler(handlers, logKey) {
	const keyEventHandlers = {};
	forEach(handlers, (def) => {
		const key = normalizeKeys(def.keys);
		keyEventHandlers[key] = def.handler;
	});
	return {
		fn: (e) => {
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
			if(['control', 'shift', 'alt'].indexOf((e.key || '').toLowerCase()) < 0) keys.push(e.key);
			const key = normalizeKeys(keys);
			const handler = keyEventHandlers[key];
			if(handler) {
				e.stopPropagation();
				e.preventDefault();
				handler();
			} else if(logKey) {
				console.log(key);
			}
		}
	};
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
	const handler = createKeyHandler(handlers, logKey);
	return registerEvent(document, 'keydown', handler.fn);
};
/*
 * @category: static function
 * @description: Register KeyUp Event Handlers for window
 * @name: registerKeyUpEventHandlers
 * @param: {Array} handlers - The event handlers
 * @param: {bool} logKey - True will print key if there is no matched handler
 * @returns: The function which is used to unregister the event handler
 * @example:
 * registerKeyUpEventHandlers([
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
export const registerKeyUpEventHandlers = (handlers, logKey=false) => {
	const handler = createKeyHandler(handlers, logKey);
	return registerEvent(document, 'keyup', handler.fn);
};
