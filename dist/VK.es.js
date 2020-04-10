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
var registerEvent = DOMUtils.registerEvent;

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

export { VK };
