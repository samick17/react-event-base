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
export const openFiles = async (exts, isWebkitDirectory) => {
	const ext = (exts || []).join(',');
	return new Promise((resolve, reject) => {
		const a = createElement(`<input type="file" accept="${ext}" multiple/>`);
		if(isWebkitDirectory) {
			a.setAttribute('webkitdirectory', '');
		}
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
