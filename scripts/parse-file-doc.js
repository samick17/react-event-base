const fs = require('fs');
const path = require('path');

const readFile = (filePath) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, (err, data) => {
			err ? reject(err) : resolve(data);
		});
	});
};

const dumpFunctions = async (str) => {
	const re = /export const (.*?) = \((.*)\)/g;
	let m;
	let name = null, args = null;
	const onFunctionHandler = () => {
		console.log('fn', name, args);
	};
	while ((m = re.exec(str)) !== null) {
	    if (m.index === re.lastIndex) {
	        re.lastIndex++;
	    }
	    m.forEach((match, groupIndex) => {
	    	switch(groupIndex) {
	    		case 1:
	    		name = match;
	    		case 2:
	    		args = match.split(',').map(s => s.trim());
	    		if(name !== null && args !== null) onFunctionHandler();
	    		default:
	    		name = null;
	    		args = null;
	    		break;
	    	}
	    });
	}
};

const dumpVariables = async (str) => {
	const re = /export const (.*?) = (.*?);/g;
	let m;
	let name = null, value = null;
	const onVariableHandler = () => {
		console.log('variable', name, value);
	};
	while ((m = re.exec(str)) !== null) {
	    if (m.index === re.lastIndex) {
	        re.lastIndex++;
	    }
	    m.forEach((match, groupIndex) => {
	    	switch(groupIndex) {
	    		case 1:
	    		name = match;
	    		break;
	    		case 2:
	    		value = match;
	    		if(name!== null && value !== null) onVariableHandler();
	    		break;
	    		default:
	    		break;
	    	}
	    });
	}
};

async function main(filePath) {
	// TODO parse src file & output as .md file
	// const filePath = 
	const data = await readFile(filePath);
	const str = data.toString();
	
	dumpFunctions(str);
	dumpVariables(str);
	
}

if(module.id === '.') {
	// const filePath = path.resolve(__dirname, '../src/utils/EventUtils.js');
	const filePath = path.resolve(__dirname, '../src/utils/VK.js');
	main(filePath);
}
