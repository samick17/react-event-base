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
export const throttle = (callback, limit) => {
    let waiting = false;
    return function () {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(function () {
                waiting = false;
            }, limit);
        }
    };
};
export const createViewUpdator = (component, limit) => {
	let isViewChanged = false;
	const updateThreshold = limit;
	function updateView(callback) {
		callback = callback || (() => {});
		component.forceUpdate(() => {
			callback();
			component.isViewChanged = false;
		});
	};
	const postUpdateView = debounce(() => {
	  if(isViewChanged) {
	    updateView();
	  }
	}, updateThreshold + 5);
	const updateViewThrottle = throttle(() => {
	  updateView();
	  postUpdateView();
	}, updateThreshold);
	return {
		updateView: updateView,
		updateViewHandler: () => {
	      isViewChanged = true;
	      updateViewThrottle();
	    },
	};
};
export const delay = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};
