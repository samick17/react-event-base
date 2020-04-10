var createEventTypes = eventNames => {
  return eventNames.reduce((m, i, j) => {
    m[i] = j.toString(16);
    return m;
  }, {});
};
var registerEvent = (target, type, fn, unbindArray) => {
  if (type && fn) {
    var unbindFn = target.on(type, fn);
    unbindArray.push(unbindFn);
  }
};
var registerEvents = (target, eventTypes, eventHandlersMap) => {
  var unbindFns = [];

  for (var key in eventTypes) {
    var eventType = eventTypes[key];
    var handlerKey = "on".concat(key);
    registerEvent(target, eventType, eventHandlersMap[handlerKey], unbindFns);
  }

  return () => {
    unbindFns.forEach(fn => fn());
  };
};
var $ = elem => {
  var wrapper = {
    on: (name, fn, options) => {
      elem.addEventListener(name, fn, options);
      return wrapper;
    },
    off: (name, fn) => {
      elem.removeEventListener(name, fn);
      return wrapper;
    }
  };
  return wrapper;
};
var stopEventChain = event => {
  if (event.defaultPrevented) {
    event.preventDefault();
  }

  event.stopPropagation();
};
var registerElementEvents = (elem, events) => {
  var jElem = $(elem);

  var Noop = () => {};

  var EmptyHandlers = {
    onDown: Noop,
    onUp: Noop
  };
  var isHandled = false;
  var activeTimers = {};
  var downTimer;
  var lastDownTimestamp;
  var isMouseEntered;

  function containsTimer(id) {
    return id in activeTimers;
  }

  function startActiveTimer(id) {
    if (!containsTimer(id)) {
      activeTimers[id] = window.setTimeout(() => {
        clearActiveTimer(id);
      }, 100);
    }
  }

  function clearActiveTimer(id) {
    if (containsTimer(id)) {
      window.clearTimeout(activeTimers[id]);
      delete activeTimers[id];
    }
  }

  var handleClick = () => {
    if (!isHandled) {
      events.onClick();
    }

    isHandled = true;
  };

  var handleDoubleClick = () => {
    if (!isHandled) {
      events.onDoubleClick.handler();
    }

    isHandled = true;
  };

  var handleLongClick = () => {
    if (!isHandled && isMouseEntered) {
      events.onLongClick.handler();
    }

    isHandled = true;
  };

  var longClickHandlers = events.onLongClick ? {
    onDown: () => {
      clearDownTimer();
      downTimer = setTimeout(() => {
        downTimer = undefined;
        handleLongClick();
      }, events.onLongClick.threshold);
    },
    onUp: () => {
      clearDownTimer();
    }
  } : EmptyHandlers;
  var clickHandlers = events.onDoubleClick ? {
    onDown: () => {
      if (lastDownTimestamp && Date.now() - lastDownTimestamp <= events.onDoubleClick.threshold) {
        handleDoubleClick();
        lastDownTimestamp = undefined;
      } else {
        lastDownTimestamp = Date.now();
      }
    },
    onUp: () => {
      handleClick();
    }
  } : {
    onDown: Noop,
    onUp: () => {
      handleClick();
    }
  };

  var clearDownTimer = () => {
    if (downTimer) {
      window.clearTimeout(downTimer);
      downTimer = undefined;
    }
  };
  /* Enter/Leave events */


  var onMouseOutHandler = () => {
    isMouseEntered = false;
  };

  var onMouseEnterHandler = () => {
    isMouseEntered = true;
  };
  /**/


  var onMouseDownHandler = event => {
    stopEventChain(event);
    if (containsTimer('t')) return;
    isHandled = false;
    isMouseEntered = true;
    longClickHandlers.onDown();
    clickHandlers.onDown();
    jElem.on('mouseup', onMouseUpHandler);
    jElem.on('mouseout', onMouseOutHandler);
    jElem.on('mouseenter', onMouseEnterHandler);
    return true;
  };

  var onTouchStartHandler = event => {
    stopEventChain(event);
    if (containsTimer('m')) return;
    isHandled = false;
    longClickHandlers.onDown();
    clickHandlers.onDown();
    jElem.on('touchend', onTouchEndHandler);
    return true;
  };
  /**/


  var onMouseUpHandler = event => {
    stopEventChain(event);
    jElem.off('mouseup', onMouseUpHandler);
    jElem.off('mouseout', onMouseOutHandler);
    jElem.off('mouseenter', onMouseEnterHandler);
    longClickHandlers.onUp();
    clickHandlers.onUp();
    startActiveTimer('m');
    return true;
  };

  var onTouchEndHandler = event => {
    stopEventChain(event);
    jElem.off('touchend', onTouchEndHandler);
    longClickHandlers.onUp();
    clickHandlers.onUp();
    startActiveTimer('t');
    return true;
  };

  jElem.on('mousedown', onMouseDownHandler);
  jElem.on('touchstart', onTouchStartHandler);
  return function () {
    jElem.off('mousedown', onMouseDownHandler);
    jElem.off('touchstart', onTouchStartHandler);
    jElem.off('mouseup', onMouseUpHandler);
    jElem.off('mouseout', onMouseOutHandler);
    jElem.off('mouseenter', onMouseEnterHandler);
    jElem.off('touchend', onTouchEndHandler);
  };
};

var EventUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createEventTypes: createEventTypes,
    registerEvent: registerEvent,
    registerEvents: registerEvents,
    $: $,
    stopEventChain: stopEventChain,
    registerElementEvents: registerElementEvents
});

export { EventUtils };
