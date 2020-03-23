export const debounce = (fn, timeout) => {
	let timerId;
	return () => {
		if(timerId) {
			window.clearTimeout(timerId);
			timerId = undefined;
		}
		timerId = setTimeout(() => {
			timerId = undefined;
			fn();
		}, timeout);
	};
};
