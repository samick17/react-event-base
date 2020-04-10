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
var createObjectTypes = eventNames => {
  return eventNames.reduce((m, i, j) => {
    m[i] = 't' + j.toString(16);
    return m;
  }, {});
};
var toArray = mapObject => {
  var array = [];

  for (var i in mapObject) {
    array.push(mapObject[i]);
  }

  return array;
};

var _doForEachObjects = function _doForEachObjects(objects, callback) {
  var fromIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var endIndex = arguments.length > 3 ? arguments[3] : undefined;

  if (callback) {
    var length = objects.length;
    endIndex = endIndex || length;

    if (length) {
      for (var i = fromIndex; i < endIndex; i++) {
        callback(objects[i], i);
      }
    } else {
      var index = 0;

      for (var _i in objects) {
        if (index >= fromIndex && index < endIndex) {
          callback(objects[_i], _i);
        }

        index++;
      }
    }
  }
};

var forEachRange = (objects, callback) => {
  objects = objects || [];

  _doForEachObjects(objects, callback);

  var startIndex = 0;
  var endIndex = Object.keys(objects).length;
  var instance = {
    from: index => {
      startIndex = index;
      return instance;
    },
    to: index => {
      endIndex = index;
      return instance;
    },
    do: callback => {
      _doForEachObjects(objects, callback, startIndex, endIndex);
    }
  };
  return instance;
};
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
var findObjectBy = (objects, byFn) => {
  for (var key in objects) {
    var object = objects[key];

    if (byFn(object)) {
      return object;
    }
  }
};
var findObjectsBy = (objects, byFn) => {
  var matchedObjects = [];

  for (var key in objects) {
    var object = objects[key];

    if (byFn(object)) {
      matchedObjects.push(object);
    }
  }

  return matchedObjects;
};
var findObjectReversedBy = (objects, byFn) => {
  var keys = Object.keys(objects);

  for (var i = keys.length - 1; i >= 0; i--) {
    var key = keys[i];
    var object = objects[key];

    if (byFn(object)) {
      return object;
    }
  }
};
var findObjectsReversedBy = (objects, byFn) => {
  var matchedObjects = [];
  var keys = Object.keys(objects);

  for (var i = keys.length - 1; i >= 0; i--) {
    var key = keys[i];
    var object = objects[key];

    if (byFn(object)) {
      matchedObjects.push(object);
    }
  }

  return matchedObjects;
};
var clearKeys = object => {
  forEach(object, (_value, key) => {
    delete object[key];
  });
};
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
var mapAsync = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (objects, callback) {
    objects = objects || [];
    var length = objects.length;
    var result = [];

    if (length) {
      for (var i = 0; i < length; i++) {
        result.push((yield callback(objects[i], i)));
      }
    } else {
      for (var _i4 in objects) {
        result.push((yield callback(objects[_i4], _i4)));
      }
    }

    return result;
  });

  return function mapAsync(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var mapToObject = (objects, callback) => {
  objects = objects || [];
  var length = objects.length;
  var result = {};

  if (length) {
    for (var i = 0; i < length; i++) {
      var data = callback(objects[i], i);
      result[data.key] = data.value;
    }
  } else {
    for (var _i5 in objects) {
      var _data = callback(objects[_i5], _i5);

      result[_data.key] = _data.value;
    }
  }

  return result;
};
var countIf = (objects, byFn) => {
  var count = 0;
  forEach(objects, object => {
    if (byFn(object)) {
      count++;
    }
  });
  return count;
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
var cloneData = data => {
  return JSON.parse(JSON.stringify(data));
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
var alias = (model, fnAlias) => {
  forEach(fnAlias, (value, key) => {
    model[value] = function () {
      return delegate(model, key, arguments);
    };
  });
};
var exportMethods = (target, source, fnNames) => {
  forEach(fnNames, fnName => {
    target[fnName] = function () {
      return delegate(source, fnName, arguments);
    };
  });
  return {
    setSource: srcObject => {
      source = srcObject;
    }
  };
};
var exportMethodsBy = (target, fnNames, fn) => {
  forEach(fnNames, fnName => {
    target[fnName] = function () {
      return fn(fnName, arguments);
    };
  });
  return target;
};
var exportAllMethodsBy = (target, source, byFn) => {
  forEach(source, (_, fnName) => {
    target[fnName] = function () {
      return byFn(fnName, arguments);
    };
  });
  return target;
};
var cloneDeep = object => {
  var cloneValue = value => {
    var typeOfVal = typeof value;

    switch (typeOfVal) {
      case 'string':
      case 'number':
      case 'boolean':
        return value;

      case 'object':
        if (value === null || value === undefined) ; else if (Array.isArray(value)) {
          var newValue = [];
          forEach(value, v => {
            newValue.push(cloneValue(v));
          });
          return newValue;
        } else {
          var cloned = {};
          forEach(value, (v, k) => {
            var newVal = cloneValue(v);

            if (typeof newVal !== 'undefined') {
              cloned[k] = newVal;
            }
          });
          return cloned;
        }

        break;
    }
  };

  return cloneValue(object);
};
var deepEqual = (object1, object2) => {
  if (object1 === object2) {
    return true;
  } else {
    if (object1.constructor.name === object2.constructor.name && object1.constructor.name === 'Object') {
      return JSON.stringify(object1) === JSON.stringify(object2);
    } else {
      try {
        return JSON.stringify(object1) === JSON.stringify(object2);
      } catch (err) {
        return false;
      }
    }
  }
};
var diffTwoObjects = (objectsMap1, objectsMap2, getObjectId) => {
  var itemsAdded = {};
  var itemsUpdated = {};
  var itemsRemoved = {};

  getObjectId = getObjectId || (obj => obj.id);

  forEach(objectsMap1, object => {
    var objId = getObjectId(object);

    if (objId in objectsMap2) {
      itemsUpdated[objId] = {
        origin: object
      };
    } else {
      itemsRemoved[objId] = object;
    }
  });
  forEach(objectsMap2, object => {
    var objId = getObjectId(object);

    if (objId in objectsMap1) {
      var updatedContext = itemsUpdated[objId];

      if (updatedContext) {
        if (deepEqual(updatedContext.origin, object)) {
          delete itemsUpdated[objId];
        } else {
          updatedContext.new = object;
        }
      }
    } else {
      itemsAdded[objId] = object;
    }
  });
  return {
    add: itemsAdded,
    update: itemsUpdated,
    remove: itemsRemoved
  };
};
var createKeyActionHandler = keyHandlerMap => {
  var fn;
  var actionHandler = {
    handle: function handle(action) {
      fn = keyHandlerMap[action] || (() => {});

      return actionHandler;
    },
    apply: function apply() {
      var args = arguments;
      fn.apply(args[0], args);
    }
  };
  return actionHandler;
};
function format(text) {
  var args = Array.from(arguments).slice(1);
  return text.replace(/{(\d+)}/g, (_matched, indexStr) => {
    var index = parseInt(indexStr, 10);
    return args[index];
  });
}
function toUpperCamel(text) {
  var firstWord = text.charAt(0);
  return text.replace(firstWord, firstWord.toUpperCase());
}
var getCharacterLength = ch => {
  var chCode = ch.charCodeAt();

  if (chCode >= 0 && chCode <= 128) {
    return 1;
  } else {
    return 2;
  }
};
var getShortText = (text, maxLength) => {
  var currentLength = 0;
  var endIndex = 0;

  for (var i in text) {
    var ch = text[i];
    var chLength = getCharacterLength(ch);

    if (currentLength + chLength <= maxLength) {
      currentLength += chLength;
      endIndex++;
    } else {
      endIndex--;
      break;
    }
  }

  if (endIndex === text.length) {
    return text;
  } else {
    return text.substring(0, endIndex) + '...';
  }
};

var ObjectUtils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  NOOP: NOOP,
  createObjectTypes: createObjectTypes,
  toArray: toArray,
  forEachRange: forEachRange,
  forEach: forEach,
  forEachAsync: forEachAsync,
  findObjectBy: findObjectBy,
  findObjectsBy: findObjectsBy,
  findObjectReversedBy: findObjectReversedBy,
  findObjectsReversedBy: findObjectsReversedBy,
  clearKeys: clearKeys,
  map: map,
  mapAsync: mapAsync,
  mapToObject: mapToObject,
  countIf: countIf,
  filter: filter,
  cloneData: cloneData,
  delegate: delegate,
  alias: alias,
  exportMethods: exportMethods,
  exportMethodsBy: exportMethodsBy,
  exportAllMethodsBy: exportAllMethodsBy,
  cloneDeep: cloneDeep,
  deepEqual: deepEqual,
  diffTwoObjects: diffTwoObjects,
  createKeyActionHandler: createKeyActionHandler,
  format: format,
  toUpperCamel: toUpperCamel,
  getCharacterLength: getCharacterLength,
  getShortText: getShortText
});

export { ObjectUtils };
