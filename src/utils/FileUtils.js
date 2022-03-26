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
export const saveFile = (name, arg, revokeURL) => {
	const a = document.createElement('a');
	a.style.display = 'none';
	const isBlob = arg instanceof Blob;
	const url = isBlob ? URL.createObjectURL(arg) : arg;
	a.href = url;
	a.download = name;
	a.click();
	if(isBlob && revokeURL) URL.revokeObjectURL(url);
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
	const sizeArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
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
export function isImage(fileType) {
	return (fileType||'').startsWith('image/');
}
export function isVideo(fileType) {
	return (fileType||'').startsWith('video/');
}
export function isText(fileType) {
	return (fileType||'').startsWith('text/');
}
export function isLink(fileType) {
	return fileType === 'application/link';
}
export function isStream(fileType) {
	return fileType === 'application/octet-stream';
}
export const resizeImage = (file, size, fillColor, type) => {
	return new Promise(resolve => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const img = new window.Image();
		const url = URL.createObjectURL(file);
		img.addEventListener('load', () => {
			ctx.beginPath();
			if(fillColor) {
				ctx.fillStyle = fillColor;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}
			if(img.width > size.width || img.height > size.height) {
				let newWidth, newHeight;
				let aspect = img.width / img.height;
				if(img.width > img.height) {
					newWidth = size.width;
					newHeight = newWidth / aspect;
				} else {
					newHeight = size.height;
					newWidth = newHeight * aspect;
				}
				canvas.width = newWidth;
				canvas.height = newHeight;
				ctx.drawImage(img, 0, 0, img.width, img.height, (canvas.width - newWidth) * .5, (canvas.height - newHeight) * .5, newWidth, newHeight);
			} else {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0, img.width, img.height, (canvas.width - img.width) * .5, (canvas.height - img.height) * .5, img.width, img.height);
			}
			ctx.closePath();
			canvas.toBlob(blob => {
				URL.revokeObjectURL(url);
				resolve(blob);
			}, type);
		});
		img.src = url;
	});
};
export async function generateThumbnail(file) {
	if(isImage(file.type)) {
		return await resizeImage(file, {
			width: 256,
			height: 256,
		}, 'transparent', 'image/jpg');
	} else if(isVideo(file.type)) {
		return new Promise(resolve => {
			const url = URL.createObjectURL(file);
			const video = document.createElement('video');
			async function captureImage() {
				const canvas = document.createElement('canvas');
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(video, 0, 0);
				canvas.toBlob(async blob => {
					URL.revokeObjectURL(url);
					const resizedImg = await resizeImage(blob, {
						width: 256,
						height: 256,
					}, 'transparent', 'image/jpg');
					resolve(resizedImg);
				});
			}
			const onCanPlay = () => {
				video.removeEventListener('canplay', onCanPlay);
				video.currentTime = 0;
			};
			video.addEventListener('canplay', onCanPlay);
			const onSeek = () => {
				video.removeEventListener("seeked", onSeek);
				video.pause();
				captureImage();
			};
			video.addEventListener("seeked", onSeek);
			video.src = url;
		});
	} else if(isText(file.type)) {
		const content = await fileAsText(file);
		const imageAdapter = await htmlToImage('<div style="width:256px;height:256px;">' + content + '</div>', 1);
		const blob = await imageAdapter.getBlob();
		return blob;
	} else if(isLink(file.type)) {
		const content = await fileAsText(file);
		const jsonContent = JSON.parse(content);
		const imageAdapter = await htmlToImage('<div style="width:256px;height:256px;font-size:48px;">' + jsonContent.url + '</div>', 1);
		const blob = await imageAdapter.getBlob();
		return blob;
	} else {
		// do nothing
		return;
	}
}
