import {lerp} from '../mathf';

const createImageAdapter = (canvas) => {
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

const DOMUtils = {
	createElement: (innerHtml) => {
		const template = document.createElement('div');
		template.innerHTML = innerHtml;
		return template.firstChild;
	},
	registerEvent: (element, name, callback) => {
		element.addEventListener(name, callback);
		return () => {
			element.removeEventListener(name, callback);
		};
	},
	htmlToImage: async (innerHtml) => {
		const html2canvas = (await import('html2canvas')).default;
		const element = DOMUtils.createElement(innerHtml);
		Object.assign(element.style, {
			position: 'absolute',
			'z-index': -1000,
			left: '-999999px',
			top: '-999999px'
		});
		document.body.append(element);
		const canvas = await html2canvas(element);
		element.remove();
		return createImageAdapter(canvas);
	},
	svgToImage: async (svgText, options) => {
		options = options || {};
		const MaxWidth = options.MaxWidth || 400;
		const MaxHeight = options.MaxHeight || 400;
		const svg = DOMUtils.createElement(svgText.trim());
		const img = new Image();
		const canvas = document.createElement('canvas');
		const xml = new XMLSerializer().serializeToString(svg);
		const reViewBox = /<svg.*viewBox="(.*)".*>/;
		const reViewBoxResult = reViewBox.exec(xml);
		const viewBox = reViewBoxResult[1].split(' ').map(value => parseInt(value));
		const size = {
			width: viewBox[2],
			height: viewBox[3]
		};
		const svg64 = btoa(xml);
		const b64Header = 'data:image/svg+xml;base64,';
		const image64 = b64Header + svg64;
		return new Promise((resolve, reject) => {
			img.onload = () => {
				const aspect = img.width / img.height;
				let preferredWidth = MaxWidth;
				let preferredHeight = preferredWidth / aspect;
				if(preferredHeight > MaxHeight) {
					preferredHeight = MaxHeight;
					preferredWidth = preferredHeight * aspect;
				}
				canvas.width = preferredWidth;
				canvas.height = preferredHeight;
				canvas.getContext('2d').drawImage(img, 0, 0, size.width, size.height, 0, 0, preferredWidth, preferredHeight);
				const canvasAdapter = createImageAdapter(canvas);
				resolve(canvasAdapter);
			};
			img.onerror = (err) => {
				reject(err);
			};
			img.src = image64;
		});
	},
	scrollTo: async (element, {startTime, fromValue, toValue, animationTime}) => {
		const _scrollTo = () => {
			let deltaTime = Date.now() - startTime;
			let t = deltaTime / animationTime;
			let pos = lerp(fromValue, toValue, t);
			// $(this.sliderElem).scrollLeft(pos);
			element.scrollLeft = pos;
			if(t < 1) {
				window.requestAnimationFrame(() => {
					if(t < 1) {
						_scrollTo();
						// this._doAnimScroll();
					}
				});
			}
			return t;
		};
		_scrollTo();
	},
	calculateSizeByAspect: (maxSize, aspect) => {
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
	}
};

export const createElement = DOMUtils.createElement;
export const registerEvent = DOMUtils.registerEvent;
export const htmlToImage = DOMUtils.htmlToImage;
export const svgToImage = DOMUtils.svgToImage;

export default DOMUtils;
