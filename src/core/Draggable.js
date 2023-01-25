import { $ } from './CustomElement';

const globalMoveEvents = [];

const stopEventChain = (evt) => {
  try {
    evt.stopPropagation();
    evt.preventDefault();
  } catch(err) {
    console.log(err);
  }
};

$(window).on('mousemove', (evt) => {
  if(globalMoveEvents.length) {
    stopEventChain(evt);
    globalMoveEvents.forEach((fn) => {
      fn.apply({}, [evt]);
    });
    return true;
  };
}, true);

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

export const createDraggable = (elem, {onStart, onDrag, onEnd, cancelable}={}) => {
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
    const handleStartEvent = (dragId, touchData, touchParams) => {
      if(!touchData.isStart) {
        touchData.isStart = true;
        const dragContext = createDragContext(dragId);
        if(touchParams) {
          Object.assign(dragContext, touchParams);
        }
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
      if(evt.button === 0) {
        const dragId = 'm';
        stopEventChain(evt);
        mouseData.mdPos = getMousePosition(evt);
        handleStartEvent(dragId, mouseData);
        jElem.on('mousemove', mouseMoveHandler, true);
        globalMoveEvents.push(mouseMoveHandler);
        jElem.on('mouseup', mouseEndHandler, true);
        $(window).on('mouseup', mouseEndHandler, true);
      }
    };
    jElem.on('mousedown', onMouseDown, true);
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
          handleStartEvent(dragId, touchData, {
            force: touch.force,
          });
          const position = getTouchPosition(touch);
          touchData.lastPos = position;
          dragContextMap[dragId].force = touch.force;
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
          handleStartEvent(dragId, touchData, {
            force: touch.force,
          });
          const position = getTouchPosition(touch);
          dragContextMap[dragId].force = touch.force;
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
        handleStartEvent(dragId, touchData, {
          force: touch.force,
        });
      });
      jElem.on('touchmove', touchMoveHandler, true);
      jElem.on('touchend', touchEndHandler, true);
    };
    jElem.on('touchstart', onTouchStart, true);
    return {
      unbind: () => {
        jElem.off('mousedown', onMouseDown);
        jElem.off('touchstart', onTouchStart);
      },
      cancel: () => {
        jElem.off('mousemove', mouseMoveHandler);
        globalMoveEvents.splice(globalMoveEvents.indexOf(mouseMoveHandler), 1);
        jElem.off('mouseup', mouseEndHandler);
        $(window).off('mouseup', mouseEndHandler);
        jElem.off('touchmove', touchMoveHandler);
        jElem.off('touchend', touchEndHandler);
      },
    };
  }
  let result = registerDragEvent(jElem, {
    start: onStart,
    drag: onDrag,
    end: onEnd
  });
  if(cancelable) {
    return result;
  } else {
    return result.unbind;
  }
};
