import {
	createElement
} from './DOMUtils';

export const encodeToPng = (arrayBuffer) => {
	const input = new Uint8Array(arrayBuffer);
	const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	let output = '';
	let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	let i = 0;
	while (i < input.length) {
		chr1 = input[i++];
		chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
		chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}
		output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
			keyStr.charAt(enc3) + keyStr.charAt(enc4);
	}
	return 'data:image/png;base64,' + output;
};
const Encodings = {
	Legacy: 'StorageBinaryString',
	Base64: 'Base64'
};
const _compressJson = (data, LZUTF8, outputEncoding = Encodings.Legacy) => {
	const dataText = JSON.stringify(data);
	return LZUTF8.compress(dataText, {
		outputEncoding: outputEncoding
	});
};
export const compressJson = async (data) => {
	const LZUTF8 = (await import('lzutf8')).default;
	return _compressJson(data, LZUTF8, Encodings.Base64);
};
const _decompressJson = (data, LZUTF8, inputEncoding = Encodings.Legacy) => {
	const result = LZUTF8.decompress(data, {
		inputEncoding: inputEncoding,
		outputEncoding: 'String'
	});
	return JSON.parse(result);
};
export const decompressJson = async (data) => {
	const LZUTF8 = (await import('lzutf8')).default;
	try {
		return _decompressJson(data, LZUTF8, Encodings.Legacy);
	} catch (err) {
		return _decompressJson(data, LZUTF8, Encodings.Base64);
	}
};
export const dataURLtoFile = (dataURL, fileName = 'thumbnail.png') => {
	const pos = dataURL.indexOf(';base64,');
	const type = dataURL.substring(5, pos);
	const b64 = dataURL.substr(pos + 8);
	const imageContent = atob(b64);
	const buffer = new ArrayBuffer(imageContent.length);
	const view = new Uint8Array(buffer);
	for (let n = 0; n < imageContent.length; n++) {
		view[n] = imageContent.charCodeAt(n);
	}
	return new File([buffer], fileName, { type: type });
};
export const isDataURI = (value) => {
	return typeof value === 'string' && (value.indexOf('data:image') === 0 || value.indexOf('data:img') === 0)
};
export const isBlobURL = (text) => {
	return text.indexOf('blob:') === 0;
};
export const dataURLtoBuffer = (dataURL) => {
	const pos = dataURL.indexOf(';base64,');
	const b64 = dataURL.substr(pos + 8);
	const imageContent = atob(b64);
	const buffer = new ArrayBuffer(imageContent.length);
	const view = new Uint8Array(buffer);
	for (let n = 0; n < imageContent.length; n++) {
		view[n] = imageContent.charCodeAt(n);
	}
	return buffer;
};
export const bufferToFile = (buffer, fileName = 'thumbnail', options) => {
	return new File([buffer], fileName, options);
};
export const arrayBufferToDOM = (arrayBuffer) => {
	const enc = new TextDecoder('utf-8');
	const input = new Uint8Array(arrayBuffer);
	const xmlString = enc.decode(input);
	const parser = new DOMParser();
	const doc = parser.parseFromString(xmlString, 'text/html');
	return doc;
};
export const arrayBufferToBase64 = (buffer) => {
	let binary = '';
	const bytes = new Uint8Array(buffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
};
export const arrayBufferToDataURL = (buffer, mimeType = 'image/png') => {
	return `data:${mimeType};base64,` + arrayBufferToBase64(buffer);
};
export const arrayBufferToBlob = (arrayBuffer, mimeType = 'image/png') => {
	return new Blob([arrayBuffer], { type: mimeType });
};
export const arrayBufferToBlobURL = (arrayBuffer, mimeType = 'image/png') => {
	return URL.createObjectURL(arrayBufferToBlob(arrayBuffer, mimeType));
};
export const blobURLToDataURL = async (blobURL) => {
	const blob = await blobURLToBlob(blobURL);
	return await blobToDataURL(blob);
};
export const blobURLToArrayBuffer = async (blobURL) => {
	return await fetch(blobURL).then(res => res.arrayBuffer());
};
export const blobToDataURL = async (blob) => {
	return new Promise((resolve, reject) => {
		const fr = new FileReader();
		fr.onload = (e) => {
			resolve(e.target.result);
		};
		fr.onerror = reject;
		fr.readAsDataURL(blob);
	});
};
export const blobURLToBlob = async (blobURL) => {
	return await fetch(blobURL).then(res => res.blob());
};
export const blobAsFile = async (blob, fileName) => {
	fileName = fileName || (await getMD5FromBlob(blob));
	return new File(blob, fileName, { type: blob.type });
};
export const getMimeTypeByArrayBuffer = (arrayBuffer) => {
	const arr = (new Uint8Array(arrayBuffer)).subarray(0, 4);
	let header = '';
	for (let i = 0; i < arr.length; i++) {
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
		case '0010':
			return 'image/x-icon';
		default:
			return;
	}
};
export const base64ToHex = (base64) => {
	const raw = atob(base64);
	let hex = '';
	for (let i = 0; i < raw.length; i++) {
		let _hex = raw.charCodeAt(i).toString(16);
		hex += (_hex.length === 2 ? _hex : '0' + _hex);
	}
	return hex.toUpperCase();
};
export const getDataURLContentType = (dataURL) => {
	const reData = /data:(.*);base64/;
	const reDataResult = reData.exec(dataURL);
	const contentType = reDataResult[1];
	return contentType;
};
/* MD5 functions */
export const getMD5FromArrayBuffer = async (arrayBuffer) => {
	const md5 = (await import('js-md5')).default;
	return md5(arrayBuffer);
};
export const getMD5FromBlob = async (blob) => {
	return await getMD5FromArrayBuffer(await blob.arrayBuffer());
};
export const getMD5FromBlobURL = async (blobURL) => {
	return await getMD5FromBlob(await blobURLToBlob(blobURL));
};
export const getMD5FromFile = async (file) => {
	return await getMD5FromArrayBuffer(await file.arrayBuffer());
};
/* End of MD5 functions */
export const fileAsBlobURL = async (file) => {
	return URL.createObjectURL(file);
};
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
export const registerPasteEventHandler = ({handlers}) => {
	function handle(item, handlers) {
		const handler = handlers[item.type] || handlers.default;
		handler && handler(item);
	}
	const createPasteHandler = (handlers) => {
		const newHandlers = {};
		for(let i in handlers) {
			let handler = handlers[i];
			newHandlers[i] = function(item) {
				handle(item, handler);
			}
		}
		return newHandlers;
	};
	handlers = createPasteHandler(handlers);
	function onPasteEvent(e) {
		const items = e.clipboardData.items;
		const length = items.length;
		const item = items[length - 1];
		const handler = handlers[item.kind];
		handler && handler(item);
	}
	window.addEventListener('paste', onPasteEvent, false);
	return () => {
		window.removeEventListener('paste', onPasteEvent, false);
	};
};
export const openFile = async (exts) => {
	const ext = (exts || []).join(',');
	return new Promise((resolve, reject) => {
		const a = createElement(`<input type="file" accept="${ext}"/>`);
		a.addEventListener('change', (e) => {
			const files = e.target.files;
			resolve(files[0]);			
		});
		a.click();
	});
};
export const openFiles = async (exts) => {
	const ext = (exts || []).join(',');
	return new Promise((resolve, reject) => {
		const a = createElement(`<input type="file" accept="${ext}" multiple/>`);
		a.addEventListener('change', (e) => {
			const files = e.target.files;
			resolve(files);			
		});
		a.click();
	});
};
export const saveFile = (name, blob) => {
	const a = document.createElement('a');
	a.style.display = 'none';
	const url = URL.createObjectURL(blob);
	a.href = url;
	a.download = name;
	a.click();
	URL.revokeObjectURL(url);
};
export const loadImage = async (url) => {
	const image = new Image();
	return new Promise((resolve, reject) => {
		image.onload = () => {
			resolve(image);
		};
		image.onerror = (err) => {
			reject(err);
		};
		image.src = url;
	});
};
