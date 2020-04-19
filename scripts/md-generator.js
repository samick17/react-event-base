const os = require('os');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const Symbols = {
	Name: 'name',
	Description: 'description',
	Caregory: 'category',
	Param: 'param',
	Params: 'params',
	Returns: 'returns',
	Example: 'example',
};

const Categories = {
	StaticFn: 'static function',
	MemberFn: 'function',
};

function dumpFileComment(filePath) {
	let isStart = false;
	let data = null;
	const parseItem = (str) => {
		const re1 = /{(.*)}\s?(.*?)\s?-\s?(.*)/;
		const re1Result = re1.exec(str);
		if(re1Result) {
			return {
				type: re1Result[1],
				name: re1Result[2],
				desc: re1Result[3],
			};
		}
		const re2 = /{(.*?)}\s?(.*)/;
		const re2Result = re2.exec(str);
		if(re2Result) {
			return {
				type: re2Result[1],
				name: '',
				desc: re2Result[2],
			};
		}
		return {
			type: '',
			name: '',
			desc: str,
		};
	};
	let onItemCallback = () => {};
	let onEndCallback = () => {};
	readline
	.createInterface({
		input: fs.createReadStream(filePath),
		output: process.stdout,
		console: false
	})
	.on('line', (line) => {
		// Block comment inline
		if(line.match(/\/\*.*\*\//)) {
		} else if(line.match(/\/\*/)) {
			isStart = true;
			data = {
				[Symbols.Name]: '',
				[Symbols.Description]: '',
				[Symbols.Params]: [],
				[Symbols.Returns]: ''
			};
		} else if(line.match(/\*\//)) {
			isStart = false;
			onItemCallback && onItemCallback(data);
			data = null;
		} else if(isStart) {
			const reComment = /\s\* @(.*?):\s?(.*)/;
			const reResult = reComment.exec(line);
			if(reResult) {
				const name = reResult[1];
				const value = reResult[2];
				switch(name.toLowerCase()) {
					case Symbols.Caregory:
					data.category = value;
					break;
					case Symbols.Name:
					data.name = value;
					break;
					case Symbols.Description:
					data.desc = value;
					break;
					case Symbols.Param:
					data.params.push(parseItem(value));
					break;
					case Symbols.Returns:
					data.return = parseItem(value);
					break;
					case Symbols.Example:
					data.example = data.example || '';
					break;
					default:
					break;
				}
			} else {
				if('example' in data) {
					data.example += line.replace(' * ', '') + os.EOL;
				}
			}
		}
	})
	.on('close', () => {
		onEndCallback();
	});
	const parser = {
		onItem: (fn) => {
			onItemCallback = fn;
			return parser;
		},
		onEnd: (fn) => {
			onEndCallback = fn;
			return parser;
		},
	};
	return parser;
}

async function dumpSrcDoc(srcFilePath, destFilePath) {
	const fileName = path.basename(srcFilePath).replace(path.extname(srcFilePath), '');
	const ws = fs.createWriteStream(destFilePath);
	const printLine = () => {
		ws.write(os.EOL);
	};
	const write = (line) => {
		ws.write(line);
	};
	const writeLine = (line) => {
		ws.write(line);
		printLine();
	};
	const writeItemsOutline = items => {
		writeLine('## **Methods**');
		printLine();
		const writeItem = item => {
			writeLine(`| [${item.name}](#${item.name.toLowerCase()}) | ${item.desc||''} |`);
		};
		writeLine('| Name | Description |');
		writeLine('|------|-------------|');
		for(let i in items) {
			writeItem(items[i]);
		}
		printLine();
	};
	const writeAllItems = items => {
		const writeItem = item => {
			writeLine(`### **${item.name}**`);
			printLine();
			writeLine(`| Parameters | Type | Description |`);
			writeLine(`|------------|------|-------------|`);
			for(let i in item.params) {
				let arg = item.params[i];
				writeLine(`| ${arg.name} | ${arg.type} | ${arg.desc} |`);
			}
			printLine();
			writeLine(`| Return |`);
			writeLine(`|--------|`);
			if(item.return.type) {
				writeLine(`| **${item.return.type}** ${item.return.desc} |`);
			} else {
				writeLine(`| ${item.return.desc} |`);
			}
			printLine();
			if(item.example) {
				writeLine('```js');
				// printLine();
				write(item.example);
				// printLine();
				writeLine('```');
			}
			writeLine('---');
			printLine();
		};
		for(let i in items) {
			writeItem(items[i]);
		}
	};
	const items = [];
	return new Promise((resolve) => {
		writeLine(`# **[${fileName}](../README.md)**`);
		printLine();
		dumpFileComment(srcFilePath)
		.onItem((item) => {
			items.push(item);
		})
		.onEnd(() => {
			writeItemsOutline(items);
			writeAllItems(items);
			ws.end();
			resolve();
		});
	});
}

function getFilePath(filePath) {
	return path.resolve(__dirname, filePath);
}

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
};
if(module.id === '.') {
	for(let i in docDefs) {
		let docDef = docDefs[i];
		const srcFilePath = getFilePath(docDef.src);
		const destFilePath = getFilePath(docDef.dest);
		dumpSrcDoc(srcFilePath, destFilePath);
	}
}
