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
function _isMatchPattern(arrayBuffer, pattern, mask) {
	let counter = mask.length;
	for(let i = 0; i < pattern.length; i++) {
		let symbol = arrayBuffer[i];
		
		if(mask[i] === 0x00) {
			counter -= 1;
			continue;
		} else if(mask[i] === 0xFF && symbol === pattern[i]) {
			counter -= 1;
		} else {
			return false;
		}
	}
	return counter <= 0;
}
export const getMimeTypeByArrayBuffer = (arrayBuffer) => {
	let arr = new Uint8Array(arrayBuffer).subarray(0, 14);
	let header = '';
	for (let i = 0; i < arr.length; i++) {
	  header += arr[i].toString(16);
	}
	if(header === '52494646') {
		let patternWebp = [52, 49, 46, 46, 0, 0, 0, 0, 57, 45, 42, 50, 56, 50];
		if(isMatchPattern(arrayBuffer, patternWebp)) {
			return 'image/webp';
		}
		let patternWave = [52, 49, 46, 46, 0, 0, 0, 0, 57, 41, 56, 45];
		if(isMatchPattern(arrayBuffer, patternWave)) {
			return 'audio/wav';
		}
	} else if(header === 'a3c73766720786d6c6e733d2268') {
		return 'image/svg+xml';
	} else {
		let arr = (new Uint8Array(arrayBuffer)).subarray(0, 4);
		let header = '';
		for (let i = 0; i < arr.length; i++) {
			header += arr[i].toString(16);
		}
		switch (header) {
			case '424d':
				return 'image/bmp';
			case '89504e47':
				return 'image/png';
			case '47494638':
				return 'image/gif';
			case 'ffd8ff':
			case 'ffd8ffe0':
			case 'ffd8ffe1':
			case 'ffd8ffe2':
			case 'ffd8ffe3':
			case 'ffd8ffe8':
			case 'ffd8ffdb':
				return 'image/jpeg';
			case '52494646':
				if(_isMatchPattern(arrayBuffer,
					[0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50],
					[0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])) {
					return 'image/webp';
				} else if(_isMatchPattern(arrayBuffer,
					[0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x41, 0x56, 0x49, 0x20],
					[0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF])) {
					return 'video/avi';
				} else if(_isMatchPattern(arrayBuffer,
					[0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45],
					[0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF])) {
					return 'audio/wave';
				}
				break;
			case '3c737667':
			case '3c3f786d':
				return 'image/svg+xml';
			case '0010':
				return 'image/x-icon';
			case '49492a0':
			return 'image/tiff';
			case '25504446':
				return 'application/pdf';
			case 'fff15080':
				return 'audio/aac';
			case '494433':
				return 'audio/mpeg';
			case '4f67530':
				return 'application/ogg';
			case '4f676753':
				return 'audio/ogg';
			case '3026b275':
				return 'video/x-ms-wma';
			case '00014':
				return 'video/quicktime';
			case '00020':
				return 'video/mp4';
			case '1a45dfa3':
				return 'video/webm';
			case '3026b275':
				return 'video/x-ms-wmv';
			case 'd0cf11e0':
				return 'application/msword';
			case '504b34':
				return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
			case 'd0cf11e0':
				return 'application/vnd.ms-powerpoint';
			case '504b34':
				return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
			case 'd0cf11e0':
				return 'application/vnd.ms-excel';
			case '504b34':
				return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
			default:
				return;
		}
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
	function onPasteEvent(e) {
		e.stopPropagation();
		e.preventDefault();
		const items = e.clipboardData.items;
		const length = items.length;
		const item = items[length - 1];
		handle(item, handlers);
	}
	window.addEventListener('paste', onPasteEvent, false);
	return () => {
		window.removeEventListener('paste', onPasteEvent, false);
	};
};
