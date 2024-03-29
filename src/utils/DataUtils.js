export const getBy = (data, key) => {
	if(typeof key === 'undefined' || key === null) {
		return data[key];
	}
	const keyArr = key.split('.');
	let entry = data;
	for(let i = 0; i < keyArr.length; i++) {
		entry = entry[keyArr[i]];
		if(i !== keyArr.length - 1 && typeof entry !== 'object') {
			return null;
		}
	}
	return entry;
};
export const updateWith = (data, key, value) => {
	const keyArr = key.split('.');
	let entry = data;
	for(let i = 0; i < keyArr.length - 1; i++) {
		entry = entry[keyArr[i]] = entry[keyArr[i]] || {};
	}
	entry[keyArr[keyArr.length - 1]] = value;
};
export const removeBy = (data, key) => {
	const keyArr = key.split('.');
	let entry = data;
	for(let i = 0; i < keyArr.length - 1; i++) {
		entry = entry[keyArr[i]] || {};
	}
	delete entry[keyArr[keyArr.length - 1]];
};
export const containsKey = (data, key) => {
	if(typeof key === 'undefined' || key === null) {
		return key in data;
	}
	const keyArr = key.split('.');
	let isInData = false;
	let entry = data;
	for(let i = 0; i < keyArr.length; i++) {
		if(keyArr[i] in entry) {
			entry = entry[keyArr[i]];
			isInData = true;
		} else {
			return false;
		}
	}
	return isInData;
};
export const insertElement = (data, key, index, value) => {
	const keyArr = key.split('.');
	let entry = data;
	for(let i = 0; i < keyArr.length - 1; i++) {
		entry = entry[keyArr[i]] = entry[keyArr[i]] || {};
	}
	const arr = entry[keyArr[keyArr.length - 1]] = entry[keyArr[keyArr.length - 1]] || [];
	arr.splice(index, 0, value);
}
export const spliceElement = (data, key, index, count) => {
	const keyArr = key.split('.');
	let entry = data;
	for(let i = 0; i < keyArr.length - 1; i++) {
		entry = entry[keyArr[i]] = entry[keyArr[i]] || {};
	}
	const arr = entry[keyArr[keyArr.length - 1]] = entry[keyArr[keyArr.length - 1]] || [];
	arr.splice(index, count);
};
