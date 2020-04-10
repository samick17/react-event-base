import React from 'react';

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

var createImageAdapter = canvas => {
  return {
    getImageWithBlob: () => {
      return new Promise((resolve, reject) => {
        var img = new Image();

        img.onload = () => {
          resolve(img);
        };

        img.onerror = err => reject(err);

        canvas.toBlob(blob => {
          var url = URL.createObjectURL(blob);
          img.src = url;
        });
      });
    },
    getBlobURL: () => {
      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          var url = URL.createObjectURL(blob);
          resolve(url);
        });
      });
    },
    getImageWithDataURL: () => {
      return new Promise((resolve, reject) => {
        var img = new Image();

        img.onload = () => {
          resolve(img);
        };

        img.onerror = err => reject(err);

        img.src = canvas.toDataURL();
      });
    },
    getDataURI: () => {
      return canvas.toDataURL();
    }
  };
};

var DOMUtils = {
  createElement: innerHtml => {
    var template = document.createElement('div');
    template.innerHTML = innerHtml;
    return template.firstChild;
  },
  registerEvent: (element, name, callback) => {
    element.addEventListener(name, callback);
    return () => {
      element.removeEventListener(name, callback);
    };
  },
  htmlToImage: function () {
    var _htmlToImage = _asyncToGenerator(function* (innerHtml, scale) {
      var html2canvas = (yield import('html2canvas')).default;
      var element = DOMUtils.createElement(innerHtml);
      Object.assign(element.style, {
        position: 'absolute',
        'z-index': -1000,
        left: '-999999px',
        top: '-999999px'
      });
      document.body.append(element);
      var canvas = yield html2canvas(element, {
        backgroundColor: null,
        scale,
        logging: false
      });
      element.remove();
      return createImageAdapter(canvas);
    });

    function htmlToImage(_x, _x2) {
      return _htmlToImage.apply(this, arguments);
    }

    return htmlToImage;
  }(),
  svgToImage: (svgText, options) => {
    options = options || {};
    var MaxWidth = options.MaxWidth || 400;
    var MaxHeight = options.MaxHeight || 400;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d'); // 

    var reViewBox = /<svg.*viewBox="(.*)".*>/;
    var reViewBoxResult = reViewBox.exec(svgText);

    if (reViewBoxResult[0].indexOf('width') < 0 || reViewBoxResult[0].indexOf('height') < 0) {
      var viewBox = reViewBoxResult[1].split(' ').map(value => parseInt(value));
      var viewBoxWidth = viewBox[2];
      var viewBoxHeight = viewBox[3];
      svgText = svgText.replace(/<(svg.*viewBox=".*".*)>/, (_, i) => {
        return "<".concat(i, " width=\"").concat(viewBoxWidth, "px\" height=\"").concat(viewBoxHeight, "px\">");
      });
    } //


    var svg64 = window.btoa(svgText);
    var b64Start = 'data:image/svg+xml;base64,';
    var image64 = b64Start + svg64;
    var img = new Image();
    return new Promise((resolve, reject) => {
      img.onload = function () {
        var aspect = img.width / img.height;
        var size = DOMUtils.calculateSizeByAspect({
          width: MaxWidth,
          height: MaxHeight
        }, aspect);
        canvas.width = size.width;
        canvas.height = size.height;
        ctx.drawImage(img, 0, 0, img.width, img.height, (canvas.width - size.width) * .5, (canvas.height - size.height) * .5, size.width, size.height);
        var canvasAdapter = createImageAdapter(canvas);
        resolve(canvasAdapter);
      };

      img.onerror = function (err) {
        reject(err);
      };

      img.src = image64;
    });
  },
  scrollTo: function () {
    var _scrollTo = _asyncToGenerator(function* (element, _ref) {
      var {
        startTime,
        fromValue,
        toValue,
        animationTime
      } = _ref;

      var scrollTo = () => {
        var deltaTime = Date.now() - startTime;
        var t = deltaTime / animationTime;
        var pos = lerp(fromValue, toValue, t);
        element.scrollLeft = pos;

        if (t < 1) {
          window.requestAnimationFrame(() => {
            if (t < 1) {
              scrollTo();
            }
          });
        }

        return t;
      };

      scrollTo();
    });

    function scrollTo(_x3, _x4) {
      return _scrollTo.apply(this, arguments);
    }

    return scrollTo;
  }(),
  calculateSizeByAspect: (maxSize, aspect) => {
    var width = maxSize.width;
    var height = maxSize.height;
    var contentWidth = width;
    var contentHeight = width / aspect;

    if (contentHeight > height) {
      contentHeight = height;
      contentWidth = height * aspect;
    }

    return {
      width: contentWidth,
      height: contentHeight
    };
  }
};
var createElement = DOMUtils.createElement;
var registerEvent = DOMUtils.registerEvent;
var htmlToImage = DOMUtils.htmlToImage;
var svgToImage = DOMUtils.svgToImage;
var scrollTo = DOMUtils.scrollTo;
var calculateSizeByAspect = DOMUtils.calculateSizeByAspect;

var DOMUtils$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createElement: createElement,
  registerEvent: registerEvent,
  htmlToImage: htmlToImage,
  svgToImage: svgToImage,
  scrollTo: scrollTo,
  calculateSizeByAspect: calculateSizeByAspect,
  'default': DOMUtils
});

var createEventTypes = eventNames => {
  return eventNames.reduce((m, i, j) => {
    m[i] = j.toString(16);
    return m;
  }, {});
};
var registerEvent$1 = (target, type, fn, unbindArray) => {
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
    registerEvent$1(target, eventType, eventHandlersMap[handlerKey], unbindFns);
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
  registerEvent: registerEvent$1,
  registerEvents: registerEvents,
  $: $,
  stopEventChain: stopEventChain,
  registerElementEvents: registerElementEvents
});

var encodeToPng = arrayBuffer => {
  var input = new Uint8Array(arrayBuffer);
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var output = '';
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  var i = 0;

  while (i < input.length) {
    chr1 = input[i++];
    chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index

    chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

    enc1 = chr1 >> 2;
    enc2 = (chr1 & 3) << 4 | chr2 >> 4;
    enc3 = (chr2 & 15) << 2 | chr3 >> 6;
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }

    output += keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
  }

  return 'data:image/png;base64,' + output;
};
var Encodings = {
  Legacy: 'StorageBinaryString',
  Base64: 'Base64'
};

var _compressJson = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (data, LZUTF8) {
    var outputEncoding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Encodings.Legacy;
    return new Promise((resolve, reject) => {
      try {
        var dataText = JSON.stringify(data);
        LZUTF8.compressAsync(dataText, {
          outputEncoding: outputEncoding
        }, (result, error) => {
          if (error) reject(error);else resolve(result);
        });
      } catch (err) {
        reject(err);
      }
    });
  });

  return function _compressJson(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function _compressJsonNew(data, LZUTF8) {
  return _compressJson(data, LZUTF8, Encodings.Base64);
}

var compressJson = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (data) {
    var LZUTF8 = (yield import('lzutf8')).default;
    return yield _compressJsonNew(data, LZUTF8);
  });

  return function compressJson(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

var _decompressJson = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* (data, LZUTF8) {
    var inputEncoding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Encodings.Legacy;
    return new Promise((resolve, reject) => {
      LZUTF8.decompressAsync(data, {
        inputEncoding: inputEncoding,
        outputEncoding: 'String'
      }, (result, error) => {
        if (error) reject(error);else {
          try {
            var jsonData = JSON.parse(result);
            resolve(jsonData);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  });

  return function _decompressJson(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

function _decompressJsonLegacy(data, LZUTF8) {
  return _decompressJson(data, LZUTF8, Encodings.Legacy);
}

function _decompressJsonNew(data, LZUTF8) {
  return _decompressJson(data, LZUTF8, Encodings.Base64);
}

var decompressJson = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(function* (data) {
    var LZUTF8 = (yield import('lzutf8')).default;

    try {
      return yield _decompressJsonLegacy(data, LZUTF8);
    } catch (err) {
      return yield _decompressJsonNew(data, LZUTF8);
    }
  });

  return function decompressJson(_x6) {
    return _ref4.apply(this, arguments);
  };
}();
var dataURLtoFile = function dataURLtoFile(dataURL) {
  var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'thumbnail.png';
  var pos = dataURL.indexOf(';base64,');
  var type = dataURL.substring(5, pos);
  var b64 = dataURL.substr(pos + 8);
  var imageContent = atob(b64);
  var buffer = new ArrayBuffer(imageContent.length);
  var view = new Uint8Array(buffer);

  for (var n = 0; n < imageContent.length; n++) {
    view[n] = imageContent.charCodeAt(n);
  }

  return new File([buffer], fileName, {
    type: type
  });
};
var isDataURI = value => {
  return typeof value === 'string' && (value.indexOf('data:image') === 0 || value.indexOf('data:img') === 0);
};
var isBlobURL = text => {
  return text.indexOf('blob:') === 0;
};
var dataURLtoBuffer = dataURL => {
  var pos = dataURL.indexOf(';base64,');
  var b64 = dataURL.substr(pos + 8);
  var imageContent = atob(b64);
  var buffer = new ArrayBuffer(imageContent.length);
  var view = new Uint8Array(buffer);

  for (var n = 0; n < imageContent.length; n++) {
    view[n] = imageContent.charCodeAt(n);
  }

  return buffer;
};
var bufferToFile = function bufferToFile(buffer) {
  var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'thumbnail';
  return new File([buffer], fileName);
};
var arrayBufferToDOM = arrayBuffer => {
  var enc = new TextDecoder('utf-8');
  var input = new Uint8Array(arrayBuffer);
  var xmlString = enc.decode(input);
  var parser = new DOMParser();
  var doc = parser.parseFromString(xmlString, 'text/html');
  return doc;
};
var arrayBufferToBase64 = buffer => {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;

  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return window.btoa(binary);
};
var arrayBufferToDataURL = function arrayBufferToDataURL(buffer) {
  var mimeType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'image/png';
  return "data:".concat(mimeType, ";base64,") + arrayBufferToBase64({
    buffer
  });
};
var arrayBufferToBlob = function arrayBufferToBlob(arrayBuffer) {
  var mimeType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'image/png';
  return new Blob([arrayBuffer], {
    type: mimeType
  });
};
var arrayBufferToBlobURL = function arrayBufferToBlobURL(arrayBuffer) {
  var mimeType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'image/png';
  return URL.createObjectURL(arrayBufferToBlob(arrayBuffer, mimeType));
};
var blobURLToDataURL = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(function* (blobURL) {
    var blob = yield blobURLToBlob(blobURL);
    return yield blobToDataURL(blob);
  });

  return function blobURLToDataURL(_x7) {
    return _ref5.apply(this, arguments);
  };
}();
var blobToDataURL = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(function* (blob) {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();

      fr.onload = e => {
        resolve(e.target.result);
      };

      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
  });

  return function blobToDataURL(_x8) {
    return _ref6.apply(this, arguments);
  };
}();
var blobURLToBlob = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(function* (blobURL) {
    return yield fetch(blobURL).then(res => res.blob());
  });

  return function blobURLToBlob(_x9) {
    return _ref7.apply(this, arguments);
  };
}();
var blobAsFile = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(function* (blob, fileName) {
    fileName = fileName || (yield getMD5FromBlob(blob));
    return new File(blob, fileName, {
      type: blob.type
    });
  });

  return function blobAsFile(_x10, _x11) {
    return _ref8.apply(this, arguments);
  };
}();
var getMimeTypeByArrayBuffer = arrayBuffer => {
  var arr = new Uint8Array(arrayBuffer).subarray(0, 4);
  var header = '';

  for (var i = 0; i < arr.length; i++) {
    header += arr[i].toString(16);
  }

  switch (header) {
    case '89504e47':
      return 'image/png';

    case '47494638':
      return 'image/gif';

    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
    case 'ffd8ffdb':
      return 'image/jpeg';

    case '52494646':
      return 'image/webp';

    case '3c737667':
      return 'image/svg+xml';

    default:
      return;
  }
};
var base64ToHex = base64 => {
  var raw = atob(base64);
  var hex = '';

  for (var i = 0; i < raw.length; i++) {
    var _hex = raw.charCodeAt(i).toString(16);

    hex += _hex.length === 2 ? _hex : '0' + _hex;
  }

  return hex.toUpperCase();
};
var getDataURLContentType = dataURL => {
  var reData = /data:(.*);base64/;
  var reDataResult = reData.exec(dataURL);
  var contentType = reDataResult[1];
  return contentType;
};
/* MD5 functions */

var getMD5FromArrayBuffer = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(function* (arrayBuffer) {
    var md5 = (yield import('js-md5')).default;
    return md5(arrayBuffer);
  });

  return function getMD5FromArrayBuffer(_x12) {
    return _ref9.apply(this, arguments);
  };
}();
var getMD5FromBlob = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(function* (blob) {
    return yield getMD5FromArrayBuffer((yield blob.arrayBuffer()));
  });

  return function getMD5FromBlob(_x13) {
    return _ref10.apply(this, arguments);
  };
}();
var getMD5FromBlobURL = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(function* (blobURL) {
    return yield getMD5FromBlob((yield blobURLToBlob(blobURL)));
  });

  return function getMD5FromBlobURL(_x14) {
    return _ref11.apply(this, arguments);
  };
}();
var getMD5FromFile = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(function* (file) {
    return yield getMD5FromArrayBuffer((yield file.arrayBuffer()));
  });

  return function getMD5FromFile(_x15) {
    return _ref12.apply(this, arguments);
  };
}();
/* End of MD5 functions */

var fileAsBlobURL = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(function* (file) {
    return URL.createObjectURL(file);
  });

  return function fileAsBlobURL(_x16) {
    return _ref13.apply(this, arguments);
  };
}();
/* Example
const PasteImageHandlers = {
	'image/png': async item => {},
	'image/jpg': async item => {},
	default: async () => {}
};
const PasteTextHandlers = {
	'text/html': item => {},
	'text/plain': item => {},
	default: item => {}
};
*/

var registerPasteEventHandler = (_ref14) => {
  var {
    handlers
  } = _ref14;

  function handle(item, handlers) {
    var handler = handlers[item.type] || handlers.default;
    handler && handler(item);
  }

  var createPasteHandler = handlers => {
    var newHandlers = {};

    var _loop = function _loop(i) {
      var handler = handlers[i];

      newHandlers[i] = function (item) {
        handle(item, handler);
      };
    };

    for (var i in handlers) {
      _loop(i);
    }

    return newHandlers;
  };

  handlers = createPasteHandler(handlers);

  function onPasteEvent(e) {
    var items = e.clipboardData.items;
    var length = items.length;
    var item = items[length - 1];
    var handler = handlers[item.kind];
    handler && handler(item);
  }

  window.addEventListener('paste', onPasteEvent, false);
  return () => {
    window.removeEventListener('paste', onPasteEvent, false);
  };
};
var openFile = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator(function* (exts) {
    var ext = (exts || []).join(',');
    return new Promise((resolve, reject) => {
      var a = createElement("<input type=\"file\" accept=\"".concat(ext, "\"/>"));
      a.addEventListener('change', e => {
        var files = e.target.files;
        resolve(files[0]);
      });
      a.click();
    });
  });

  return function openFile(_x17) {
    return _ref15.apply(this, arguments);
  };
}();
var openFiles = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator(function* (exts) {
    var ext = (exts || []).join(',');
    return new Promise((resolve, reject) => {
      var a = createElement("<input type=\"file\" accept=\"".concat(ext, "\" multiple/>"));
      a.addEventListener('change', e => {
        var files = e.target.files;
        resolve(files);
      });
      a.click();
    });
  });

  return function openFiles(_x18) {
    return _ref16.apply(this, arguments);
  };
}();
var loadImage = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator(function* (url) {
    var image = new Image();
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image);
      };

      image.onerror = err => {
        reject(err);
      };

      image.src = url;
    });
  });

  return function loadImage(_x19) {
    return _ref17.apply(this, arguments);
  };
}();

var IOUtils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  encodeToPng: encodeToPng,
  compressJson: compressJson,
  decompressJson: decompressJson,
  dataURLtoFile: dataURLtoFile,
  isDataURI: isDataURI,
  isBlobURL: isBlobURL,
  dataURLtoBuffer: dataURLtoBuffer,
  bufferToFile: bufferToFile,
  arrayBufferToDOM: arrayBufferToDOM,
  arrayBufferToBase64: arrayBufferToBase64,
  arrayBufferToDataURL: arrayBufferToDataURL,
  arrayBufferToBlob: arrayBufferToBlob,
  arrayBufferToBlobURL: arrayBufferToBlobURL,
  blobURLToDataURL: blobURLToDataURL,
  blobToDataURL: blobToDataURL,
  blobURLToBlob: blobURLToBlob,
  blobAsFile: blobAsFile,
  getMimeTypeByArrayBuffer: getMimeTypeByArrayBuffer,
  base64ToHex: base64ToHex,
  getDataURLContentType: getDataURLContentType,
  getMD5FromArrayBuffer: getMD5FromArrayBuffer,
  getMD5FromBlob: getMD5FromBlob,
  getMD5FromBlobURL: getMD5FromBlobURL,
  getMD5FromFile: getMD5FromFile,
  fileAsBlobURL: fileAsBlobURL,
  registerPasteEventHandler: registerPasteEventHandler,
  openFile: openFile,
  openFiles: openFiles,
  loadImage: loadImage
});

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

var Tab = 9;
var ArrowUp = 38;
var ArrowDown = 40;
var ArrowLeft = 37;
var ArrowRight = 39;
var registerKeyDownEventHandlers = handlers => {
  return registerEvent(window, 'keydown', e => {
    var keys = [];
    if (e.ctrlKey) keys.push('ctrl');
    if (e.altKey) keys.push('alt');
    if (e.shiftKey) keys.push('shift');
    if (keys.length === 0) keys.push(e.key);
    var key = keys.sort().join('+');
    var handler = handlers[key];

    if (handler) {
      e.stopPropagation();
      e.preventDefault();
      handler();
    }
  });
};

var VK = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Tab: Tab,
  ArrowUp: ArrowUp,
  ArrowDown: ArrowDown,
  ArrowLeft: ArrowLeft,
  ArrowRight: ArrowRight,
  registerKeyDownEventHandlers: registerKeyDownEventHandlers
});

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

var $$1 = target => {
  if (target instanceof CustomElement) {
    return target;
  } else {
    return new CustomElement(target);
  }
};

var stopEventChain$1 = evt => {
  evt.preventDefault();
  evt.stopPropagation();
};
$$1(window).on('mousemove', evt => {
  if (globalMoveEvents.length) {
    stopEventChain$1(evt);
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
  var jElem = $$1(elem);

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
      stopEventChain$1(evt);
      handleStartEvent(dragId, mouseData);
      var position = getMousePosition(evt);
      onDragHandler(position, dragContextMap[dragId]);
    };

    var mouseEndHandler = evt => {
      var dragId = 'm';
      stopEventChain$1(evt);
      handleStartEvent(dragId, mouseData);
      var position = getMousePosition(evt);
      onEndHandler(position, dragContextMap[dragId]);
      destroyDragContext(dragId);
      jElem.off('mousemove', mouseMoveHandler);
      globalMoveEvents.splice(globalMoveEvents.indexOf(mouseMoveHandler), 1);
      jElem.off('mouseup', mouseEndHandler);
      $$1(window).off('mouseup', mouseEndHandler);
      mouseData.isStart = false;
    };

    var onMouseDown = evt => {
      var dragId = 'm';
      stopEventChain$1(evt);
      mouseData.mdPos = getMousePosition(evt);
      handleStartEvent(dragId, mouseData);
      jElem.on('mousemove', mouseMoveHandler);
      globalMoveEvents.push(mouseMoveHandler);
      jElem.on('mouseup', mouseEndHandler);
      $$1(window).on('mouseup', mouseEndHandler);
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
      stopEventChain$1(evt);
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
      stopEventChain$1(evt);
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
      stopEventChain$1(evt);
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
  stopEventChain: stopEventChain$1,
  getMousePosition: getMousePosition,
  getTouchPosition: getTouchPosition,
  createDragContextWith: createDragContextWith,
  createDraggable: createDraggable,
  'default': createDraggable
});

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

export { AdvancedDraggable, BaseComponent, DOMUtils$1 as DOMUtils, Draggable, DropZone$1 as DropZone, EventModel, EventUtils, IOUtils, IdGenerator, Mathf, ObjectManager, ObjectUtils, PerfUtils, SortedObjectManager, VK };
