var debounce = (fn, timeout) => {
  var timerId;
  return () => {
    if (timerId) {
      window.clearTimeout(timerId);
      timerId = undefined;
    }

    timerId = setTimeout(() => {
      timerId = undefined;
      fn();
    }, timeout);
  };
};

var PerfUtils = /*#__PURE__*/Object.freeze({
	__proto__: null,
	debounce: debounce
});

export { PerfUtils as EventUtils };
