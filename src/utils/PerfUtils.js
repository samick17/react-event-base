export const debounce = (fn, timeout) => {
	let timerId;
	return function() {
		const args = arguments;
		if(timerId) {
			window.clearTimeout(timerId);
			timerId = undefined;
		}
		timerId = setTimeout(() => {
			timerId = undefined;
			fn.apply(null, args);
		}, timeout);
	};
};
