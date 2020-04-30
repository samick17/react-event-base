import {
	compressJson,
	decompressJson,
} from './IOUtils';

test('IOUtils:compress/decompress', async () => {
	const LZUTF8 = (await import('lzutf8')).default;
	const originData = {
		foo: 'bar'
	};
	const compressedData = compressJson(originData, LZUTF8);
	expect(decompressJson(compressedData, LZUTF8)).toEqual(originData);
});
