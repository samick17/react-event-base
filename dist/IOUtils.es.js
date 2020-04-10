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

var clamp = (c, min, max) => {
  return c < min ? min : c > max ? max : c;
};
var lerp = (a, b, t) => {
  return a + clamp(t, 0, 1) * (b - a);
};

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

export { IOUtils as EventUtils };
