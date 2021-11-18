import { createElement } from './DOMUtils';

const params = {
	cancelTimeout: 1000,
};

export const setCancelTimeout = (timeout) => {
	params.cancelTimeout = timeout;
};

export const openFile = async (exts) => {
	const ext = (exts || []).join(',');
	return new Promise((resolve, reject) => {
		let isLocked = false;
		const a = createElement(`<input type="file" accept="${ext}"/>`);
		a.addEventListener('change', (e) => {
			isLocked = true;
			const files = e.target.files;
			const file = files[0];
			file ? resolve(file) : reject(new Error('No such file'));
		});
		window.addEventListener('focus', () => {
			setTimeout(() => {
				if(!isLocked) {
					reject(new Error('Cancel open the file'));
				}
			}, params.cancelTimeout);
		}, { once: true });
		a.click();
	});
};
export const openFiles = async (exts, isWebkitDirectory) => {
	const ext = (exts || []).join(',');
	return new Promise((resolve, reject) => {
		let isLocked = false;
		const a = createElement(`<input type="file" accept="${ext}" multiple/>`);
		if(isWebkitDirectory) {
			a.setAttribute('webkitdirectory', '');
		} else {
			window.addEventListener('focus', () => {
				setTimeout(() => {
					if(!isLocked) {
						reject(new Error('Cancel open the file'));
					}
				}, params.cancelTimeout);
			}, { once: true });
		}
		a.addEventListener('change', (e) => {
			isLocked = true;
			const files = e.target.files;
			resolve(files);
		});
		a.click();
	});
};
export const saveFile = (name, arg) => {
	const a = document.createElement('a');
	a.style.display = 'none';
	const isBlob = arg instanceof Blob;
	const url = isBlob ? URL.createObjectURL(arg) : arg;
	a.href = url;
	a.download = name;
	a.click();
	if(isBlob) URL.revokeObjectURL(url);
};
export const fileAsText = async (file) => {
	return new Promise((resolve) => {
		const fr = new FileReader();
		fr.onload = () => {
	    	resolve(fr.result);
	    };
	    fr.readAsText(file);
	});
};
export const prettifyFileSize = (size, digits=2) => {
	const sizeArr = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let n = size;
	let index = 0;
	while(n > 1024) {
		n /= 1024;
		index++;
	}
	return n.toFixed(digits) + ' ' + sizeArr[index];
};
function str2ab(str) {
	return new TextEncoder().encode(str);
}
export const textToFile = (text, fileName, mimeType) => {
	const arrayBuffer = str2ab(text);
    const file = new File([arrayBuffer], fileName, {type: mimeType});
    return file;
};
