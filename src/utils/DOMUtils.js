import { lerp } from '../core/Mathf';

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
	htmlToImage: async (innerHtml, scale) => {
		const html2canvas = (await import('html2canvas')).default;
		const element = DOMUtils.createElement(innerHtml);
		Object.assign(element.style, {
			position: 'absolute',
			'z-index': -1000,
			left: '-999999px',
			top: '-999999px'
		});
		document.body.append(element);
		const canvas = await html2canvas(element, {
			backgroundColor: null,
			scale,
			logging: false
		});
		element.remove();
		return createImageAdapter(canvas);
	},
	svgToImage: (svgText, options) => {
		options = options || {};
		const MaxWidth = options.MaxWidth || 400;
		const MaxHeight = options.MaxHeight || 400;
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		// 
		const reViewBox = /<svg.*viewBox="(.*)".*>/;
		const reViewBoxResult = reViewBox.exec(svgText);
		if(reViewBoxResult[0].indexOf('width') < 0 || reViewBoxResult[0].indexOf('height') < 0) {
			const viewBox = reViewBoxResult[1].split(' ').map(value => parseInt(value));
			const viewBoxWidth = viewBox[2];
			const viewBoxHeight = viewBox[3];
			svgText = svgText.replace(/<(svg.*viewBox=".*".*)>/, (_, i) => {
				return `<${i} width="${viewBoxWidth}px" height="${viewBoxHeight}px">`;
			});
		}
		//
		const svg64 = window.btoa(svgText);
		const b64Start = 'data:image/svg+xml;base64,';
		const image64 = b64Start + svg64;
		const img = new Image();
		return new Promise((resolve, reject) => {
			img.onload = function() {
				const aspect = img.width / img.height;
				const size = DOMUtils.calculateSizeByAspect({
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
	},
	scrollTo: async (element, {startTime, fromValue, toValue, animationTime}) => {
		const scrollTo = () => {
			let deltaTime = Date.now() - startTime;
			let t = deltaTime / animationTime;
			let pos = lerp(fromValue, toValue, t);
			element.scrollLeft = pos;
			if(t < 1) {
				window.requestAnimationFrame(() => {
					if(t < 1) {
						scrollTo();
					}
				});
			}
			return t;
		};
		scrollTo();
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
export const scrollTo = DOMUtils.scrollTo;
export const calculateSizeByAspect = DOMUtils.calculateSizeByAspect;

export default DOMUtils;
