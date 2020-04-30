import {
	compressJson,
	decompressJson,
} from './IOUtils';

test('IOUtils:compress/decompress', async () => {
	const originData = {
		foo: 'bar'
	};
	const compressedData = await compressJson(originData);
	expect(await decompressJson(compressedData)).toEqual(originData);
});
