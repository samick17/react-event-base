import {
	compressJson,
	decompressJson,
} from './IOUtilsZip';

test('IOUtilsZip:compress/decompress', async () => {
	const originData = {
		foo: 'bar'
	};
	const compressedData = await compressJson(originData);
	expect(await decompressJson(compressedData)).toEqual(originData);
});
