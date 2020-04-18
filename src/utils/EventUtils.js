import { $ } from '../core/CustomElement';

/*
 * @category: static function
 * @description: Create event types from string array
 * @name: createEventTypes
 * @param: {Array} eventNames - The keys of event
 * @returns: {Object} - The Event types object
 * @example:
 * const Events = createEventTypes([
 *   'AddObject',
 *   'RemoveObject',
 * ]);
 */
export const createEventTypes = (eventNames) => {
    return eventNames.reduce((m, i, j) => {
        m[i] = j.toString(16);
        return m;
    }, {});
};
/*
 * @category: static function
 * @name: registerEvent
 * @description: Register event for element
 * @param: {Element} elem - Element
 * @param: {string} type - The event type
 * @param: {Function} fn - The event handler
 * @returns: {Function} - The function which is used to unregister the event handler
 */
export const registerEvent = (elem, type, fn) => {
    if(type && fn) {
        return elem.on(type, fn);
    }
};
/*
 * @category: static function
 * @name: registerEvents
 * @description: Register events for element
 * @param: {Element} elem - Element
 * @param: {Object} events - The key-value event handler object
 * @returns: {Function} - The function which is used to unregister the event handler
 */
export const registerEvents = (elem, events) => {
    const unbindFns = [];
    for(let key in events) {
        let handler = events[key];
        let unbindFn = registerEvent(elem, key, handler);
        unbindFn && unbindFns.push(unbindFn);
    }
    return () => {
        unbindFns.forEach(fn => fn());
    };
};
/*
 * @category: static function
 * @name: stopEventChain
 * @description: Stop the event handler & bubbling
 * @param: {Event} event - Event
 * @returns: No return value
 */
export const stopEventChain = (event) => {
    if(event.defaultPrevented) {
        event.preventDefault();
    }
    event.stopPropagation();
};
/*
 * @category: static function
 * @name: registerElementEvents
 * @description: Register onClick/onDoubleClick/onLongClick event for element
 * @param: {Element} elem - Element
 * @param: {Object} events - The key-value event handler object
 * @returns: {Function} - The function which is used to unregister the event handler
 */
export const registerElementEvents = (elem, events) => {
    const jElem = $(elem);
    const Noop = () => {};
    const EmptyHandlers = {
        onDown: Noop,
        onUp: Noop
    };
    let isHandled = false;
    let activeTimers = {};
    let downTimer;
    let lastDownTimestamp;
    let isMouseEntered;
    function containsTimer(id) {
        return id in activeTimers;
    }
    function startActiveTimer(id) {
        if(!containsTimer(id)) {
            activeTimers[id] = window.setTimeout(() => {
                clearActiveTimer(id);
            }, 100);
        }
    }
    function clearActiveTimer(id) {
        if(containsTimer(id)) {
            window.clearTimeout(activeTimers[id]);
            delete activeTimers[id];
        }
    }
    const handleClick = () => {
        if(!isHandled) {
            events.onClick();
        }
        isHandled = true;
    };
    const handleDoubleClick = () => {
        if(!isHandled) {
            events.onDoubleClick.handler();
        }
        isHandled = true;
    };
    const handleLongClick = () => {
        if(!isHandled && isMouseEntered) {
            events.onLongClick.handler();
        }
        isHandled = true;
    };
    const longClickHandlers = events.onLongClick ? {
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
    const clickHandlers = events.onDoubleClick ? {
        onDown: () => {
            if(lastDownTimestamp && Date.now() - lastDownTimestamp <= events.onDoubleClick.threshold) {
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
    const clearDownTimer = () => {
        if(downTimer) {
            window.clearTimeout(downTimer);
            downTimer = undefined;
        }
    };
    /* Enter/Leave events */
    const onMouseOutHandler = () => {
        isMouseEntered = false;
    };
    const onMouseEnterHandler = () => {
        isMouseEntered = true;
    };
    /**/
    const onMouseDownHandler = event => {
        stopEventChain(event);
        if(containsTimer('t')) return;
        isHandled = false;
        isMouseEntered = true;
        longClickHandlers.onDown();
        clickHandlers.onDown();
        jElem.on('mouseup', onMouseUpHandler);
        jElem.on('mouseout', onMouseOutHandler);
        jElem.on('mouseenter', onMouseEnterHandler);
        return true;
    };
    const onTouchStartHandler = event => {
        stopEventChain(event);
        if(containsTimer('m')) return;
        isHandled = false;
        longClickHandlers.onDown();
        clickHandlers.onDown();
        jElem.on('touchend', onTouchEndHandler);
        return true;
    };
    /**/
    const onMouseUpHandler = event => {
        stopEventChain(event);
        jElem.off('mouseup', onMouseUpHandler);
        jElem.off('mouseout', onMouseOutHandler);
        jElem.off('mouseenter', onMouseEnterHandler);
        longClickHandlers.onUp();
        clickHandlers.onUp();
        startActiveTimer('m');
        return true;
    };
    const onTouchEndHandler = event => {
        stopEventChain(event);
        jElem.off('touchend', onTouchEndHandler);
        longClickHandlers.onUp();
        clickHandlers.onUp();
        startActiveTimer('t');
        return true;
    };
    jElem.on('mousedown', onMouseDownHandler);
    jElem.on('touchstart', onTouchStartHandler);
    return function() {
        jElem.off('mousedown', onMouseDownHandler);
        jElem.off('touchstart', onTouchStartHandler);
        jElem.off('mouseup', onMouseUpHandler);
        jElem.off('mouseout', onMouseOutHandler);
        jElem.off('mouseenter', onMouseEnterHandler);
        jElem.off('touchend', onTouchEndHandler);
    };
};
