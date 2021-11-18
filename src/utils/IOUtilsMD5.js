/* MD5 functions */
export const getMD5FromArrayBuffer = async (arrayBuffer) => {
	const md5 = (await import('js-md5')).default;
	return md5(arrayBuffer);
};
export const getMD5FromBlob = async (blob) => {
	const arrayBuffer = await new Response(blob).arrayBuffer();
	return await getMD5FromArrayBuffer(arrayBuffer);
};
export const getMD5FromBlobURL = async (blobURL) => {
	return await getMD5FromBlob(await blobURLToBlob(blobURL));
};
export const getMD5FromFile = async (file) => {
	const arrayBuffer = await new Response(file).arrayBuffer();
	return await getMD5FromArrayBuffer(arrayBuffer);
};
/* End of MD5 functions */
