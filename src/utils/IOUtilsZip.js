import LZUTF8 from 'lzutf8';

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
const _compressJsonAsync = async (data, LZUTF8, outputEncoding = Encodings.Legacy) => {
	const dataText = JSON.stringify(data);
	return await LZUTF8.compressAsync(dataText, {
		outputEncoding: outputEncoding
	});
};
export const compressJson = (data) => {
	return _compressJson(data, LZUTF8, Encodings.Base64);
};
export const compressJsonAsync = (data) => {
	return _compressJsonAsync(data, LZUTF8, Encodings.Base64);
};
const _decompressJson = (data, LZUTF8, inputEncoding = Encodings.Legacy) => {
	const result = LZUTF8.decompress(data, {
		inputEncoding: inputEncoding,
		outputEncoding: 'String'
	});
	return JSON.parse(result);
};
const _decompressJsonAsync = async (data, LZUTF8, inputEncoding = Encodings.Legacy) => {
	const result = await LZUTF8.decompressAsync(data, {
		inputEncoding: inputEncoding,
		outputEncoding: 'String'
	});
	return JSON.parse(result);
};
export const decompressJson = (data) => {
	try {
		return _decompressJson(data, LZUTF8, Encodings.Legacy);
	} catch (err) {
		return _decompressJson(data, LZUTF8, Encodings.Base64);
	}
};
export const decompressJsonAsync = (data) => {
	try {
		return _decompressJsonAsync(data, LZUTF8, Encodings.Legacy);
	} catch (err) {
		return _decompressJsonAsync(data, LZUTF8, Encodings.Base64);
	}
};
