import { createElement } from './DOMUtils';

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
			}, 300);
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
				}, 300);
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
export const saveFile = (name, blob) => {
	const a = document.createElement('a');
	a.style.display = 'none';
	const url = URL.createObjectURL(blob);
	a.href = url;
	a.download = name;
	a.click();
	URL.revokeObjectURL(url);
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
	const sizeArr = ['bytes', 'KB', 'MB', 'GB', 'TB'];
	let n = size;
	let index = 0;
	while(n > 1024) {
		n /= 1024;
		index++;
	}
	return n.toFixed(digits) + ' ' + sizeArr[index];
};
