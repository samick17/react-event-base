const jsmdg = require('js-mdg');

if(module.id === '.') {
	const docDefs = {
		EventUtils: {
			src: '../src/utils/EventUtils.js',
			dest: '../docs/EventUtils.md'
		},
		ObjectUtils: {
			src: '../src/utils/ObjectUtils.js',
			dest: '../docs/ObjectUtils.md'
		},
		DOMUtils: {
			src: '../src/utils/DOMUtils.js',
			dest: '../docs/DOMUtils.md'
		},
		VK: {
			src: '../src/utils/VK.js',
			dest: '../docs/VK.md'
		},
		Mathf: {
			src: '../src/core/Mathf.js',
			dest: '../docs/Mathf.md'
		},
	};
	jsmdg.genDocs(docDefs);
}
