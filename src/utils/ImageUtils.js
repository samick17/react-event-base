import { createElement, createImageAdapter } from './DOMUtils';

/*
 * @category: static function
 * @description: Create element from string
 * @name: htmlToImage
 * @param: {string} svgText - The target innerText of Element
 * @param: {Number} scale - [optional] The scaling, default is 1
 * @returns: {Object} - The ImageAdapter
 * @example:
 * const imageAdapter = htmlToImage(innerHtml, scale);
 */
 // svgText, options
export const htmlToImage = async (innerHtml, scale=1) => {
	const html2canvas = (await import('html2canvas')).default;
	const element = createElement(innerHtml);
	Object.assign(element.style, {
		position: 'absolute',
		'z-index': -1000,
		left: '-999999px',
		top: '-999999px'
	});
	document.body.append(element);
	const canvas = await html2canvas(element, {
		backgroundColor: null,
		scale,
		logging: false
	});
	element.remove();
	return createImageAdapter(canvas);
};
