export const isSupportFileSystemAPI = () => {
	return !!window.showOpenFilePicker && !!window.showSaveFilePicker;
};
export const verifyPermission = async (fileHandle) => {
	const options = {
		mode: 'readWrite',
	};
	if ((await fileHandle.queryPermission(options)) === 'granted') {
	  return true;
	}
	if ((await fileHandle.requestPermission(options)) === 'granted') {
	  return true;
	}
	return false;
};
export const openFile = async () => {
	const [fileHandle] = await window.showOpenFilePicker();
	return fileHandle;
};
/*
 * @category: static function
 * @description: New file & save
 * @name: newFile
 * @param: {object} types - The file types
 * @returns: {Object} - The file handle object
 * @example:
 * const Events = newFile([
 *   {
 * 	   description: 'Text Files',
 *     accept: {
 *       'text/plain': ['.txt'],
 *     },
 *   },
 * ]);
 */
export const newFile = async (types) => {
	const options = {
	types: types,
	};
	const handle = await window.showSaveFilePicker(options);
	return handle;
};
export const writeFile = async (fileHandle, content) => {
	const writable = await fileHandle.createWritable();
	await writable.write(contents);
	await writable.close();
};
