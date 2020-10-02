import { lerp } from '../core/Mathf';

let passiveSupported = false;

try {
  const options = {
    get passive() { // This function will be called when the browser
                    //   attempts to access the passive property.
      passiveSupported = true;
      return false;
    }
  };

  window.addEventListener("test", null, options);
  window.removeEventListener("test", null, options);
} catch(err) {
  passiveSupported = false;
}

export const getPassiveOptions = () => {
	return passiveSupported ? { passive: true } : false;
};
export const isPassvieSupported = () => {
	return passiveSupported;
};

export const createImageAdapter = (canvas) => {
	return {
		getImageWithBlob: () => {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = () => {
					resolve(img);
				};
				img.onerror = err => reject(err);
				canvas.toBlob(blob => {
					const url = URL.createObjectURL(blob);
					img.src = url;
				});
			});
		},
		getBlobURL: () => {
			return new Promise((resolve, reject) => {
				canvas.toBlob(blob => {
					const url = URL.createObjectURL(blob);
					resolve(url);
				});
			});
		},
		getImageWithDataURL: () => {
			return new Promise((resolve, reject) => {
				const img = new Image();
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

/*
 * @category: static function
 * @description: Create element from string
 * @name: createElement
 * @param: {string} innerHtml - The dom string
 * @returns: {Element} - The web element
 * @example:
 * const element = createElement(<div/>);
 */
export const createElement = (innerHtml) => {
	const template = document.createElement('div');
	template.innerHTML = innerHtml;
	return template.firstChild;
};

/*
 * @category: static function
 * @description: Register element event
 * @name: registerEvent
 * @param: {Element} element - The target element
 * @param: {string} element - The event type
 * @param: {Function} element - The handler function
 * @returns: {Function} - The function which is used to unregister the event handler
 * @example:
 * const unregisterFn = registerEvent(body, 'click', (e) => {});
 */
export const registerEvent = (element, name, callback, options) => {
	element.addEventListener(name, callback, options);
	return () => {
		element.removeEventListener(name, callback);
	};
};

/*
 * @category: static function
 * @description: Register element event
 * @name: registerEvent
 * @param: {Element} element - The target element
 * @param: {Object} element - The event/handler object
 * @returns: {Function} - The function which is used to unregister the event handler
 * @example:
 * const unregisterFn = registerEvents(body, { 'click', (e) => {} });
 */
export const registerEvents = (element, nameCallbacksMap, options) => {
	const unbindFns = [];
	for(let name in nameCallbacksMap) {
		let callback = nameCallbacksMap[name];
		unbindFns.push(registerEvent(element, name, callback, options));
	}
	return () => {
		for(let i = 0; i < unbindFns.length; i++) {
			let fn = unbindFns[i];
			fn();
		}
	};
};

/*
 * @category: static function
 * @description: Create element from string
 * @name: calculateSizeByAspect
 * @param: {Object} maxSize - The maximum size of size
 * @param: {Number} aspect - The aspect ratio
 * @param: {Function} callback - The handler function
 * @returns: {Function} - The function which is used to unregister the event handler
 * @example:
 * const maxSize = {
 *   width: window.innerWidth,
 *   height: window.innerHeight
 * };
 * const aspect = 16 / 9;
 * const size = calculateSizeByAspect(maxSize, aspect);
 */
export const calculateSizeByAspect = (maxSize, aspect) => {
	const width = maxSize.width;
	const height = maxSize.height;
	let contentWidth = width;
	let contentHeight = width / aspect;
	if(contentHeight > height) {
		contentHeight = height;
		contentWidth = height * aspect;
	}
	return {
		width: contentWidth,
		height: contentHeight
	};
};

/*
 * @category: static function
 * @description: Create element from string
 * @name: svgToImage
 * @param: {string} svgText - The svg xml text
 * @param: {Object} options - [optional] {MaxWidth, MaxHeight}
 * @returns: {Object} - The ImageAdapter
 * @example:
 * const imageAdapter = svgToImage(svgText, options);
 */
export const svgToImage = (svgText, options) => {
	options = options || {};
	const MaxWidth = options.MaxWidth || 400;
	const MaxHeight = options.MaxHeight || 400;
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	// 
	const reViewBox = /<svg.*viewBox="(.*?)".*?>/;
	const reViewBoxResult = reViewBox.exec(svgText);
	if(reViewBoxResult) {
		if(reViewBoxResult[0].indexOf('width') < 0 || reViewBoxResult[0].indexOf('height') < 0) {
			const viewBox = reViewBoxResult[1].split(' ').map(value => parseInt(value));
			const viewBoxWidth = viewBox[2];
			const viewBoxHeight = viewBox[3];
			svgText = svgText.replace(/<(svg.*viewBox=".*?".*?)>/, (_, i) => {
				return `<${i} width="${viewBoxWidth}px" height="${viewBoxHeight}px">`;
			});
		}
	}
	//
	const svg64 = window.btoa(svgText);
	const b64Start = 'data:image/svg+xml;base64,';
	const image64 = b64Start + svg64;
	const img = new Image();
	return new Promise((resolve, reject) => {
		img.onload = function() {
			const aspect = img.width / img.height;
			const size = calculateSizeByAspect({
				width: MaxWidth,
				height: MaxHeight
			}, aspect);
			canvas.width = size.width;
			canvas.height = size.height;
			ctx.drawImage(img, 0, 0, img.width, img.height, (canvas.width - size.width) * .5, (canvas.height - size.height) * .5, size.width, size.height);
			const canvasAdapter = createImageAdapter(canvas);
			resolve(canvasAdapter);
		};
		img.onerror = function(err) {
			reject(err);
		};
		img.src = image64;
	});
};

/*
 * @category: static function
 * @description: Create element from string
 * @name: scrollTo
 * @param: {Element} element - The target element
 * @param: {Object} name - {fromValue, toValue, animationTime, propertyName}
 * @returns: No return value
 * @example:
 * const element = document.querySelector('.scroll');
 * const fromValue = 0;
 * const toValue = 800;
 * const animationTime: 300;
 * const propertyName = 'scrollLeft';
 * scrollTo(element, {fromValue, toValue, animationTime, propertyName});
 */
export const scrollTo = async (element, {fromValue, toValue, animationTime, propertyName}) => {
	propertyName = propertyName || 'scrollLeft';
	const startTime = Date.now();
	const _scrollTo = () => {
		let deltaTime = Date.now() - startTime;
		let t = deltaTime / animationTime;
		let pos = lerp(fromValue, toValue, t);
		element[propertyName] = pos;
		if(t < 1) {
			window.requestAnimationFrame(() => {
				if(t < 1) {
					_scrollTo();
				}
			});
		}
		return t;
	};
	_scrollTo();
};

export const registerUnloadEvents = ({onUnload, onBeforeUnload}={}) => {
	onUnload = onUnload || (() => {});
	onBeforeUnload = onBeforeUnload || (() => {});
	const unbindBeforeUnloadEvent = registerEvent(window, 'beforeunload', e => {
		e.preventDefault();
		// Chrome requires returnValue to be set.
		e.returnValue = 'Leave now ?';
		onBeforeUnload();
		return false;
	});
	const unbindUnloadEvents = registerEvent(window, 'unload', e => {
		try {
			onUnload();
		} catch(err) {
			console.log(err);
		}
	});
	return () => {
		unbindBeforeUnloadEvent && unbindBeforeUnloadEvent();
		unbindUnloadEvents && unbindUnloadEvents();
	};
};

export const registerContextMenuEvents = (callback) => {
	callback = callback || (() => {});
	return registerEvent(document.body, 'contextmenu', e => {
		callback(e);
	});
};

export const registerDragDropEvents = (elem, {onEnter, onLeave, onDrop}={}) => {
	onEnter = onEnter || (() => {});
	onLeave = onLeave || (() => {});
	onDrop = onDrop || (() => {});
	return registerEvents(elem, {
		dragenter: (e) => {
			onEnter(e);
		},
		dragleave: (e) => {
			onLeave(e);
		},
		drop: (e) => {
			e.preventDefault();
			onDrop(e);
		},
		dragover: (e) => {
			e.preventDefault();
		},
	});
};
