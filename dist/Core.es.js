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

var forEach = (objects, callback) => {
  objects = objects || [];
  var length = objects.length;

  if (length) {
    for (var i = 0; i < length; i++) {
      if (callback(objects[i], i, i)) {
        break;
      }
    }
  } else {
    var index = 0;

    for (var _i2 in objects) {
      if (callback(objects[_i2], _i2, index)) {
        break;
      }

      index++;
    }
  }
};
var forEachAsync = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (objects, callback) {
    objects = objects || [];
    var length = objects.length;

    if (length) {
      for (var i = 0; i < length; i++) {
        if (yield callback(objects[i], i, i)) {
          break;
        }
      }
    } else {
      var index = 0;

      for (var _i3 in objects) {
        if (yield callback(objects[_i3], _i3, index)) {
          break;
        }

        index++;
      }
    }
  });

  return function forEachAsync(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var map = (objects, callback) => {
  objects = objects || [];
  var length = objects.length;
  var result = [];

  if (length) {
    for (var i = 0; i < length; i++) {
      result.push(callback(objects[i], i, i));
    }
  } else {
    var index = 0;

    for (var key in objects) {
      result.push(callback(objects[key], key, index));
      index++;
    }
  }

  return result;
};
var filter = (objects, filterFn) => {
  var result = [];
  forEach(objects, object => {
    if (filterFn(object)) {
      result.push(object);
    }
  });
  return result;
};
var delegate = (target, fnName, args) => {
  if (target) {
    try {
      var splittedFns = fnName.split('.');
      var caller = target;

      for (var i = 0; i < splittedFns.length - 1; i++) {
        var _fn = splittedFns[i];
        caller = caller[_fn];
      }

      var fn = splittedFns[splittedFns.length - 1];
      return caller[fn].apply(caller, args);
    } catch (err) {}
  }
};

class ObjectManager extends EventModel {
  constructor(data) {
    super(data);

    this._clear();
  }

  get objects() {
    return this._objects;
  }

  get length() {
    return this._length;
  }

  _add(objId, object, index) {
    if (this.canAddObject(objId, object, index)) {
      this._objects[objId] = object;
      this._length++;
      this.doOnAddObject(objId, object, index);
    } else {
      console.log('Cannot add object', objId, object, index);
    }
  }

  canAddObject(objId, object, index) {
    var isInInObjects = this.containsId(objId);
    return !isInInObjects;
  }

  doOnAddObject(objId, object, index) {}

  doOnRemoveObject(objId) {}

  add(object, index) {
    var objId = object.getId();

    this._add(objId, object, index);
  }

  addAll(objects) {
    forEach(objects, object => this.add(object));
  }

  remove(object) {
    var objId = object.getId();
    this.removeById(objId);
  }

  _removeById(id) {
    this.doOnRemoveObject(id);
    var object = this._objects[id];
    delete this._objects[id];
    this._length--;
    return object;
  }

  removeById(id) {
    if (this.containsId(id)) {
      return this._removeById(id);
    }
  }

  removeByIds(ids) {
    forEach(ids, id => {
      this.removeById(id);
    });
  }

  _clear() {
    this._length = 0;
    this._objects = {};
  }

  clear() {
    this._clear();
  }

  getById(id) {
    return this._objects[id];
  }

  getByIds(ids) {
    var objects = [];
    forEach(ids, id => {
      var object = this.getById(id);

      if (object) {
        objects.push(object);
      }
    });
    return objects;
  }

  getObjectIds() {
    return Object.keys(this._objects);
  }

  containsId(id) {
    return id in this._objects;
  }

  contains(object) {
    return this.containsId(object.getId());
  }

  update(id, data) {
    var obj = this.getById(id);
    if (obj) obj.update(data);
  }

  refresh(dataArray) {
    this._clear();

    forEach(dataArray, obj => {
      var objId = obj.getId();

      this._add(objId, obj);
    });
  }

  map(callback) {
    return map(this._objects, callback);
  }

  forEach(callback) {
    return forEach(this._objects, callback);
  }

  forEachAsync(callback) {
    return forEachAsync(this._objects, callback);
  }

  filter(byFn) {
    return filter(this._objects, byFn);
  }

  forEachReversed(callback) {
    return forEach(this._objects, callback);
  }

  getObjectsArray() {
    var objects = [];
    this.forEach(obj => {
      objects.push(obj);
    });
    return objects;
  }

  log() {
    this.forEach(obj => {
      obj.log();
    });
  }

  delegate(fn, args) {
    this.forEach(obj => {
      delegate(obj, fn, args);
    });
  }

  toJson() {
    var jsonData = {};
    this.forEach(obj => {
      if (!obj.isStatic && obj.toJson) {
        jsonData[obj.getId()] = obj.toJson();
      }
    });
    return jsonData;
  } // This will call "clone" function for each object


  cloneObjects() {
    return map(this.objects, object => object.clone());
  }

  reload(objectManager) {
    this._clear();

    this.addAll(objectManager.objects);
    this._length = objectManager._length;
  }

}

class SortedObjectManager extends ObjectManager {
  constructor(data) {
    super(data);
    this._indices = [];
  }

  get objectOrders() {
    return this._indices;
  }

  canAddObject(objId, object, index) {
    var isInInObjects = this.containsId(objId);
    return !isInInObjects && (typeof index === 'undefined' || typeof index === 'number' && index >= 0 && index <= this._indices.length);
  }

  doOnAddObject(objId, object, index) {
    if (typeof index === 'number') {
      this._indices.splice(index, 0, objId);
    } else {
      this._indices.push(objId);
    }
  }

  doOnRemoveObject(objId) {
    var index = this._indices.indexOf(objId);

    if (index >= 0) {
      this._indices.splice(index, 1);
    }
  }

  clear() {
    super.clear();
    this._indices = [];
  }

  removeByIndex(index) {
    var id = this._indices[index];
    return this.removeById(id);
  }

  getObjectIds() {
    return this.objectOrders;
  }

  getByIndex(index) {
    var id = this._indices[index];
    return this._objects[id];
  }

  indexOf(object) {
    var objId = object.getId();
    return this._indices.indexOf(objId);
  }

  setObjectIndex(object, newIndex) {
    var objId = object.getId();

    if (this.containsId(objId) && newIndex >= 0 && newIndex < this.length) {
      var objIndex = this._indices.indexOf(objId);

      this._indices.splice(objIndex, 1);

      this._indices.splice(newIndex, 0, objId);
    }
  }

  forEach(callback) {
    return forEach(this._indices, (id, key, index) => {
      var object = this._objects[id];
      object && callback(object, id, index);
    });
  }

  forEachAsync(callback) {
    var _this = this;

    return forEachAsync(this._indices, /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (id, key, index) {
        var object = _this._objects[id];
        object && (yield callback(object, id, index));
      });

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }());
  }

  forEachReversed(callback) {
    forEach([...this._indices].reverse(), (id, key, index) => {
      var object = this._objects[id];
      return object && callback(object, id, index);
    });
  }

  map(callback) {
    return map(this._indices, id => {
      return callback(this._objects[id], id);
    });
  }

  reload(objectManager) {
    this._clear();

    this.addAll(objectManager.objects);
    this._length = objectManager._length;
    this._indices = objectManager._indices.slice();
  }

}

var PI2 = Math.PI * 2;
var Radian = Math.PI / 180;
var clamp = (c, min, max) => {
  return c < min ? min : c > max ? max : c;
};
var lerp = (a, b, t) => {
  return a + clamp(t, 0, 1) * (b - a);
};

var Mathf = /*#__PURE__*/Object.freeze({
  __proto__: null,
  PI2: PI2,
  Radian: Radian,
  clamp: clamp,
  lerp: lerp
});

export { EventModel, IdGenerator, Mathf, ObjectManager, SortedObjectManager };
