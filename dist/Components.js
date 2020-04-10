'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

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

class BaseComponent extends React.Component {
  constructor() {
    super(...arguments);
    this.eventSubject = new EventModel();
    this._elemEvents = [];
  }

  componentDidMount() {
    this.isInit = true;
    this.isUnmounting = false;
    this.onMount();
  }

  componentWillUnmount() {
    this.isInit = false;
    this.isUnmounting = true;
    this.unregisterAllClickEvent();
    this.onUnmount();
  } // override this method


  onMount() {} // override this method


  onUnmount() {}
  /**/


  registerClickEvent(elem, callback) {
    var comp = this;

    comp.onClick = evt => {
      evt.stopPropagation();
      evt.preventDefault();
      comp.launch();
      return false;
    };

    this.onTouchStart = callback;
    elem.addEventListener('touchstart', callback);

    comp._elemEvents.push({
      type: 'touchstart',
      elem: elem,
      callback: callback
    });

    elem.addEventListener('mousedown', callback);

    comp._elemEvents.push({
      type: 'mousedown',
      elem: elem,
      callback: callback
    });
  }

  unregisterAllClickEvent() {
    var comp = this;

    comp._elemEvents.forEach(elemEvent => {
      elemEvent.elem.removeEventListener(elemEvent.type, elemEvent.callback);
    });

    comp._elemEvents = [];
  }
  /**/


  setState(state, callback) {
    if (!(this.isInit && !this.isUnmounting)) return;
    super.setState(state, callback);
  }

  forceUpdate(callback) {
    if (!(this.isInit && !this.isUnmounting)) return;
    super.forceUpdate(callback);
  }

  on(name, fn) {
    return this.eventSubject.on(name, fn);
  }

  off(name, fn) {
    this.eventSubject.off(name, fn);
  }

  trigger(name, args) {
    this.eventSubject.trigger(name, args);
  }

  unbindEvent(name) {
    var fn = this[name];

    if (fn) {
      fn();
      delete this[name];
    }
  }

}

exports.BaseComponent = BaseComponent;
