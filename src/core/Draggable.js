const globalMoveEvents = [];

class CustomElement {
  constructor(element) {
    this.target = element;
  }
  css(styles) {
    const {target} = this;
    try {
      Object.assign(target.style, styles);
    } catch(err) {
      console.trace();
    }
  }
  on(name, callback) {
    const {target} = this;
    try {
      target.addEventListener(name, callback);
    } catch(err) {
      console.trace();
    }
  }
  off(name, callback) {
    const {target} = this;
    try {
      target.removeEventListener(name, callback);
    } catch(err) {
      console.trace();
    }
  }
}

const $ = (target) => {
  if(target instanceof CustomElement) {
    return target;
  } else {
    return new CustomElement(target);
  }
};

export const stopEventChain = (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
};

$(window).on('mousemove', (evt) => {
  if(globalMoveEvents.length) {
    stopEventChain(evt);
    globalMoveEvents.forEach((fn) => {
      fn.apply({}, [evt]);
    });
    return true;
  };
});

export const getMousePosition = (evt) => {
  return {
    x: evt.clientX,
    y: evt.clientY,
    screenX: evt.screenX,
    screenY: evt.screenY
  };
};
export const getTouchPosition = (touchObject) => {
  return {
    x: touchObject.clientX,
    y: touchObject.clientY,
    screenX: touchObject.screenX,
    screenY: touchObject.screenY
  };
};
export const createDragContextWith = (dragContextMap={}) => (dragId) => {
  const dragContext = dragContextMap[dragId] = dragContextMap[dragId] || {
    id: dragId
  };
  return dragContext;
};

export const createDraggable = (elem, {onStart, onDrag, onEnd}={}) => {
  const jElem = $(elem);
  const onStartHandler = onStart || function() {};
  const onDragHandler = onDrag || function() {};
  const onEndHandler = onEnd || function() {};
  const mouseData = {
    isStart: false,
    mdPos: {x: 0, y: 0}
  };
  jElem.css({
    'touch-action': 'none',
    '-ms-touch-action': 'none'
  });
  const dragContextMap = {};
  const createDragContext = createDragContextWith(dragContextMap);
  const registerDragEvent = (elem, options) => {
    const handleStartEvent = (dragId, touchData) => {
      if(!touchData.isStart) {
        touchData.isStart = true;
        const dragContext = createDragContext(dragId);
        onStartHandler(touchData.mdPos, dragContext);
      }
    }
    const destroyDragContext = (dragId) => {
      delete dragContextMap[dragId];
    };
    const mouseMoveHandler = (evt) => {
      const dragId = 'm';
      stopEventChain(evt);
      handleStartEvent(dragId, mouseData);
      const position = getMousePosition(evt);
      onDragHandler(position, dragContextMap[dragId]);
    };
    const mouseEndHandler = (evt) => {
      const dragId = 'm';
      stopEventChain(evt);
      handleStartEvent(dragId, mouseData);
      const position = getMousePosition(evt);
      onEndHandler(position, dragContextMap[dragId]);
      destroyDragContext(dragId);
      jElem.off('mousemove', mouseMoveHandler);
      globalMoveEvents.splice(globalMoveEvents.indexOf(mouseMoveHandler), 1);
      jElem.off('mouseup', mouseEndHandler);
      $(window).off('mouseup', mouseEndHandler);
      mouseData.isStart = false;
    };
    const onMouseDown = (evt) => {
      const dragId = 'm';
      stopEventChain(evt);
      mouseData.mdPos = getMousePosition(evt);
      handleStartEvent(dragId, mouseData);
      jElem.on('mousemove', mouseMoveHandler);
      globalMoveEvents.push(mouseMoveHandler);
      jElem.on('mouseup', mouseEndHandler);
      $(window).on('mouseup', mouseEndHandler);
    };
    jElem.on('mousedown', onMouseDown);
    const touchIdsMap = {};
    const forChangedTouches = (evt, callback) => {
      for(let i = 0; i < evt.changedTouches.length; i++) {
        let touch = evt.changedTouches[i];
        callback(touch);
      }
    };
    const touchMoveHandler = (evt) => {
      stopEventChain(evt);
      forChangedTouches(evt, (touch) => {
        const dragId = touch.identifier;
        const touchData = touchIdsMap[dragId];
        if(touchData) {
          handleStartEvent(dragId, touchData);
          const position = getTouchPosition(touch);
          touchData.lastPos = position;
          onDragHandler(position, dragContextMap[dragId]);
        }
      });
    };
    const touchEndHandler = (evt) => {
      stopEventChain(evt);
      forChangedTouches(evt, (touch) => {
        const dragId = touch.identifier;
        const touchData = touchIdsMap[dragId];
        if(touchData) {
          handleStartEvent(dragId, touchData);
          const position = getTouchPosition(touch);
          onEndHandler(position, dragContextMap[dragId]);
          destroyDragContext(dragId);
          if(evt.touches.length === 0) {
            jElem.off('touchmove', touchMoveHandler);
            jElem.off('touchend', touchEndHandler);
          }
          delete touchIdsMap[dragId];
        }
      });
    };
    const onTouchStart = (evt) => {
      stopEventChain(evt);
      forChangedTouches(evt, (touch) => {
        const dragId = touch.identifier;
        const mdPos = getTouchPosition(touch);
        const touchData = touchIdsMap[dragId] = {
          mdPos: mdPos,
          isStart: false
        };
        handleStartEvent(dragId, touchData);
      });
      jElem.on('touchmove', touchMoveHandler);
      jElem.on('touchend', touchEndHandler);
    };
    jElem.on('touchstart', onTouchStart);
    return function() {
      jElem.off('mousedown', onMouseDown);
      jElem.off('touchstart', onTouchStart);
    };
  }
  return registerDragEvent(jElem, {
    start: onStart,
    drag: onDrag,
    end: onEnd
  });
};

export default createDraggable;
