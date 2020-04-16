const fs = require('fs');
const path = require('path');

const readFile = (filePath) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, (err, data) => {
			err ? reject(err) : resolve(data);
		});
	});
};

async function main() {
	// TODO parse src file & output as .md file
	const filePath = path.resolve(__dirname, '../src/utils/EventUtils.js');
	const data = await readFile(filePath);
	const str = data.toString();
	const re = /export const (.*?) =/g;
	let m;
	while ((m = re.exec(str)) !== null) {
	    if (m.index === re.lastIndex) {
	        re.lastIndex++;
	    }
	    m.forEach((match, groupIndex) => {
	    	if(groupIndex === 1)
	    	console.log(match);
	    });
	}
}

if(module.id === '.') {
	main();
}
