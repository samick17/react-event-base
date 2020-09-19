export const loadImage = async (url) => {
	const image = new Image();
	return new Promise((resolve, reject) => {
		image.onload = () => {
			resolve(image);
		};
		image.onerror = (err) => {
			reject(err);
		};
		image.src = url;
	});
};
