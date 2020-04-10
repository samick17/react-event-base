'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var globalMoveEvents = [];

class CustomElement {
  constructor(element) {
    this.target = element;
  }

  css(styles) {
    var {
      target
    } = this;

    try {
      Object.assign(target.style, styles);
    } catch (err) {
      console.trace();
    }
  }

  on(name, callback) {
    var {
      target
    } = this;

    try {
      target.addEventListener(name, callback);
    } catch (err) {
      console.trace();
    }
  }

  off(name, callback) {
    var {
      target
    } = this;

    try {
      target.removeEventListener(name, callback);
    } catch (err) {
      console.trace();
    }
  }

}

var $ = target => {
  if (target instanceof CustomElement) {
    return target;
  } else {
    return new CustomElement(target);
  }
};

var stopEventChain = evt => {
  evt.preventDefault();
  evt.stopPropagation();
};
$(window).on('mousemove', evt => {
  if (globalMoveEvents.length) {
    stopEventChain(evt);
    globalMoveEvents.forEach(fn => {
      fn.apply({}, [evt]);
    });
    return true;
  }
});
var getMousePosition = evt => {
  return {
    x: evt.clientX,
    y: evt.clientY,
    screenX: evt.screenX,
    screenY: evt.screenY
  };
};
var getTouchPosition = touchObject => {
  return {
    x: touchObject.clientX,
    y: touchObject.clientY,
    screenX: touchObject.screenX,
    screenY: touchObject.screenY
  };
};
var createDragContextWith = function createDragContextWith() {
  var dragContextMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return dragId => {
    var dragContext = dragContextMap[dragId] = dragContextMap[dragId] || {
      id: dragId
    };
    return dragContext;
  };
};
var createDraggable = function createDraggable(elem) {
  var {
    onStart,
    onDrag,
    onEnd
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var jElem = $(elem);

  var onStartHandler = onStart || function () {};

  var onDragHandler = onDrag || function () {};

  var onEndHandler = onEnd || function () {};

  var mouseData = {
    isStart: false,
    mdPos: {
      x: 0,
      y: 0
    }
  };
  jElem.css({
    'touch-action': 'none',
    '-ms-touch-action': 'none'
  });
  var dragContextMap = {};
  var createDragContext = createDragContextWith(dragContextMap);

  var registerDragEvent = (elem, options) => {
    var handleStartEvent = (dragId, touchData) => {
      if (!touchData.isStart) {
        touchData.isStart = true;
        var dragContext = createDragContext(dragId);
        onStartHandler(touchData.mdPos, dragContext);
      }
    };

    var destroyDragContext = dragId => {
      delete dragContextMap[dragId];
    };

    var mouseMoveHandler = evt => {
      var dragId = 'm';
      stopEventChain(evt);
      handleStartEvent(dragId, mouseData);
      var position = getMousePosition(evt);
      onDragHandler(position, dragContextMap[dragId]);
    };

    var mouseEndHandler = evt => {
      var dragId = 'm';
      stopEventChain(evt);
      handleStartEvent(dragId, mouseData);
      var position = getMousePosition(evt);
      onEndHandler(position, dragContextMap[dragId]);
      destroyDragContext(dragId);
      jElem.off('mousemove', mouseMoveHandler);
      globalMoveEvents.splice(globalMoveEvents.indexOf(mouseMoveHandler), 1);
      jElem.off('mouseup', mouseEndHandler);
      $(window).off('mouseup', mouseEndHandler);
      mouseData.isStart = false;
    };

    var onMouseDown = evt => {
      var dragId = 'm';
      stopEventChain(evt);
      mouseData.mdPos = getMousePosition(evt);
      handleStartEvent(dragId, mouseData);
      jElem.on('mousemove', mouseMoveHandler);
      globalMoveEvents.push(mouseMoveHandler);
      jElem.on('mouseup', mouseEndHandler);
      $(window).on('mouseup', mouseEndHandler);
    };

    jElem.on('mousedown', onMouseDown);
    var touchIdsMap = {};

    var forChangedTouches = (evt, callback) => {
      for (var i = 0; i < evt.changedTouches.length; i++) {
        var touch = evt.changedTouches[i];
        callback(touch);
      }
    };

    var touchMoveHandler = evt => {
      stopEventChain(evt);
      forChangedTouches(evt, touch => {
        var dragId = touch.identifier;
        var touchData = touchIdsMap[dragId];

        if (touchData) {
          handleStartEvent(dragId, touchData);
          var position = getTouchPosition(touch);
          touchData.lastPos = position;
          onDragHandler(position, dragContextMap[dragId]);
        }
      });
    };

    var touchEndHandler = evt => {
      stopEventChain(evt);
      forChangedTouches(evt, touch => {
        var dragId = touch.identifier;
        var touchData = touchIdsMap[dragId];

        if (touchData) {
          handleStartEvent(dragId, touchData);
          var position = getTouchPosition(touch);
          onEndHandler(position, dragContextMap[dragId]);
          destroyDragContext(dragId);

          if (evt.touches.length === 0) {
            jElem.off('touchmove', touchMoveHandler);
            jElem.off('touchend', touchEndHandler);
          }

          delete touchIdsMap[dragId];
        }
      });
    };

    var onTouchStart = evt => {
      stopEventChain(evt);
      forChangedTouches(evt, touch => {
        var dragId = touch.identifier;
        var mdPos = getTouchPosition(touch);
        var touchData = touchIdsMap[dragId] = {
          mdPos: mdPos,
          isStart: false
        };
        handleStartEvent(dragId, touchData);
      });
      jElem.on('touchmove', touchMoveHandler);
      jElem.on('touchend', touchEndHandler);
    };

    jElem.on('touchstart', onTouchStart);
    return function () {
      jElem.off('mousedown', onMouseDown);
      jElem.off('touchstart', onTouchStart);
    };
  };

  return registerDragEvent();
};

var Draggable = /*#__PURE__*/Object.freeze({
  __proto__: null,
  stopEventChain: stopEventChain,
  getMousePosition: getMousePosition,
  getTouchPosition: getTouchPosition,
  createDragContextWith: createDragContextWith,
  createDraggable: createDraggable,
  'default': createDraggable
});

var updateDropZones = (touchObject, advancedDraggable) => {
  var dropzones = advancedDraggable.dropzones;

  for (var i = 0; i < dropzones.length; i++) {
    var dropzone = dropzones[i];

    if (dropzone.containsPoint(touchObject.current)) {
      if (touchObject.lastDropZone && touchObject.lastDropZone !== dropzone) {
        touchObject.lastDropZone.leave(touchObject);
        touchObject.lastDropZone = undefined;
      }

      if (touchObject.lastDropZone !== dropzone) {
        touchObject.source = advancedDraggable.srcValue;
        dropzone.enter(touchObject);
        touchObject.lastDropZone = dropzone;
      }

      return;
    }
  }

  if (touchObject.lastDropZone) {
    touchObject.lastDropZone.leave(touchObject);
    touchObject.lastDropZone = undefined;
  }
};

class AdvacedDraggable {
  constructor(elem) {
    this.dropzones = [];
    var touchObjectMap = this.touchObjectMap = {};
    this.srcValue = undefined;
    this.unbindDraggableEvent = createDraggable(elem, {
      onStart: (point, context) => {
        var touchId = context.id;
        touchObjectMap[touchId] = {
          start: point,
          current: point,
          lastDropZone: undefined
        };
      },
      onDrag: (point, context) => {
        var touchId = context.id;
        var touchObject = touchObjectMap[touchId];

        if (touchObject) {
          touchObject.current = point;
          touchObject.isMoved = true;
          updateDropZones(touchObject, this);

          if (touchObject.lastDropZone) {
            touchObject.lastDropZone.move(touchObject);
          }
        }
      },
      onEnd: (point, context) => {
        var touchId = context.id;
        var touchObject = touchObjectMap[touchId];

        if (touchObject) {
          updateDropZones(touchObject, this);

          if (touchObject.lastDropZone) {
            touchObject.lastDropZone.drop(touchObject);
          }
        }

        delete touchObjectMap[touchId];
      }
    });
    this._unbindRemoveEvents = [];
  }

  unbind() {
    this.unbindDraggableEvent();
  }

  addDropZone(dropzone) {
    this.dropzones.push(dropzone);
    var unbindRemoveEvent = dropzone.on('remove', () => {
      this.dropzones.remove(dropzone);
      unbindRemoveEvent();

      this._unbindRemoveEvents.remove(unbindRemoveEvent);
    });

    this._unbindRemoveEvents.push(unbindRemoveEvent);

    return this;
  }

  addDropZones(dropzones) {
    if (Array.isArray(dropzones)) {
      dropzones.forEach(dropzone => {
        this.addDropZone(dropzone);
      });
    }

    return this;
  }

  setDropZones(dropzones) {
    this._unbindRemoveEvents.forEach(unbindRemoveEvent => {
      unbindRemoveEvent();
    });

    this._unbindRemoveEvents = [];
    this.dropzones = [];
    dropzones.forEach(dropzone => {
      this.addDropZone(dropzone);
    });
    return this;
  }

  setValue(value) {
    this.srcValue = value;
    return this;
  }

}

var createAdvanceDraggable = elem => {
  return new AdvacedDraggable(elem);
};
/*
Usage:
import Factory from '@Models/Factory'
import Draggable from '@Models/AdvancedDraggable'

// onEnter: sourceValue, context
// onMove: context
// onLeave: context
// onDrop: context

let dropzones = Factory.createDropZones([{
	x: 0,
	y: 0,
	w: 32,
	h: 32
}...], onEnterCallback, onMoveCallback, onLeaveCallback, onDropCallback)

Draggable(elem)
.setValue(yourDataObject)
.setDropZones(dropzones)

Draggable(elem)
.setValue(yourDataObject)
.addDropZones(dropzones)

Draggable(elem)
.setValue(yourDataObject)
.addDropZone(new DropZone(....))

Draggable(elem)
.setValue(yourDataObject)
.addDropZones([new DropZone(....), ...])

*/

var AdvancedDraggable = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createAdvanceDraggable: createAdvanceDraggable,
  'default': AdvacedDraggable
});

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var NOOP = () => {};

var triggerEventsAsync = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (_ref2) {
    var {
      target,
      eventArray,
      args
    } = _ref2;

    for (var i in eventArray) {
      var fn = eventArray[i];
      yield fn.apply(target, args);
    }
  });

  return function triggerEventsAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();

class EventModel {
  constructor(data) {
    this._events = {};
    Object.assign(this, data);
  }

  _on(name, fn) {
    var eventArray = this._events[name];

    if (!eventArray) {
      eventArray = this._events[name] = [];
    }

    eventArray.push(fn);
    return () => {
      this.off(name, fn);
    };
  }

  on(arg1, argFn) {
    var typeofArg1 = typeof arg1;

    switch (typeofArg1) {
      case 'object':
        var unbindFns = [];

        for (var name in arg1) {
          var fn = arg1[name];
          unbindFns.push(this._on(name, fn));
        }

        return () => {
          unbindFns.forEach(unbindFn => {
            unbindFn();
          });
        };

      case 'string':
        return this._on(arg1, argFn);

      default:
        throw new Error('Invalid arguments!');
    }
  }

  off(name, fn) {
    var eventArray = this._events[name];

    if (eventArray) {
      var index = eventArray.indexOf(fn);

      if (index >= 0) {
        eventArray.splice(index, 1);
      }
    }
  }

  trigger(name, args) {
    var eventArray = this._events[name];

    if (eventArray) {
      var target = this;
      triggerEventsAsync({
        target,
        eventArray,
        args
      });
    }
  }

  unbindEvent(name) {
    var fn = this[name];

    if (fn) {
      fn();
      delete this[name];
    }
  }

}

class IdGenerator {
  constructor() {
    this.serialNumber = 0;
    this.idPrefix = 'o';
  }

  setIdPrefix(idPrefix) {
    this.idPrefix = idPrefix;
  }

  genId() {
    var newId = this.serialNumber;
    this.serialNumber++;
    return this.idPrefix + newId.toString(16);
  }

}

var createEventTypes = eventNames => {
  return eventNames.reduce((m, i, j) => {
    m[i] = j.toString(16);
    return m;
  }, {});
};

var Events = createEventTypes(['BoundingChange', 'Enter', 'Move', 'Leave', 'Drop', 'Remove']);

var isPointInRect = (point, rect) => {
  return point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h;
};

var dropZonIdGenerator = new IdGenerator();

var genId = () => {
  return dropZonIdGenerator.genId();
};

class DropZone extends EventModel {
  get id() {
    return this._id;
  }

  constructor(onEnter, onMove, onLeave, onDrop) {
    super({});
    this._id = genId();
    this._jobs = [];
    this._isJobRunning = false;
    this._updateRectFn = NOOP;

    this._updateRect = () => {
      var element = this.linkedElement;
      var bounding = element.getBoundingClientRect();
      this.setRect(bounding.x, bounding.y, bounding.width, bounding.height);
    };

    this.rect = {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    };
    this.onEnter = onEnter;
    this.onMove = onMove;
    this.onLeave = onLeave;
    this.onDrop = onDrop;
  }

  setRect(x, y, w, h) {
    this.rect = {
      x: x,
      y: y,
      w: w,
      h: h
    };
    this.trigger(Events.BoundingChange);
  }
  /* setRect by element */


  updateRect() {
    this._updateRectFn();
  }

  link(element) {
    this.linkedElement = element;
    this._updateRectFn = this._updateRect;
    this.updateRect();
  }

  unlink() {
    this._updateRectFn = NOOP;
  }

  containsPoint(point) {
    return isPointInRect(point, this.rect);
  }

  enter(context) {
    this._jobs.push({
      callback: this.onEnter,
      args: [context]
    });

    this.executeJobs();
    this.trigger(Events.Enter, [context]);
  }

  move(context) {
    this._jobs.push({
      callback: this.onMove,
      args: [context]
    });

    this.executeJobs();
    this.trigger(Events.Move, [context]);
  }

  leave(context) {
    this._jobs.push({
      callback: this.onLeave,
      args: [context]
    });

    this.executeJobs();
    this.trigger(Events.Leave, [context]);
  }

  drop(context) {
    this._jobs.push({
      callback: this.onDrop,
      args: [context]
    });

    this.executeJobs();
    this.trigger(Events.Drop, [context]);
  }

  executeJobs() {
    if (this._isJobRunning) return;else this._executeJobs();
  }

  _executeJobs() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this._isJobRunning = true;

      try {
        var lenOfJobs = _this._jobs.length;

        if (lenOfJobs > 0) {
          var job = _this._jobs.splice(0, 1)[0];

          yield job.callback.apply(_this, job.args);
        }
      } catch (err) {
        console.log(err);
      } finally {
        _this._isJobRunning = false;

        if (_this._jobs.length > 0) {
          yield _this._executeJobs();
        }
      }
    })();
  }

  remove() {
    this.trigger(Events.Remove);
  }

}

var createDropZone = function createDropZone() {
  var {
    onEnter,
    onMove,
    onLeave,
    onDrop
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new DropZone(onEnter, onMove, onLeave, onDrop);
};

var DropZone$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Events: Events,
  createDropZone: createDropZone
});

exports.AdvancedDraggable = AdvancedDraggable;
exports.Draggable = Draggable;
exports.DropZone = DropZone$1;
