const fs = require('fs');
const path = require('path');
const readline = require('readline');

const Symbols = {
	Name: 'name',
	Arg: 'arg',
	Args: 'args',
	Return: 'return',
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
				[Symbols.Args]: [],
				[Symbols.Return]: ''
			};
		} else if(line.match(/\*\//)) {
			isStart = false;
			onItemCallback && onItemCallback(data);
			data = null;
		} else if(isStart) {
			const reComment = /\s\* @(.*?):\s(.*)/;
			const reResult = reComment.exec(line);
			const name = reResult[1];
			const value = reResult[2];
			switch(name.toLowerCase()) {
				case Symbols.Name:
				data.name = value;
				break;
				case Symbols.Arg:
				data.args.push(parseItem(value));
				break;
				case Symbols.Return:
				data.return = parseItem(value);
				break;
				default:
				break;
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

if(module.id === '.') {
	const srcFilePath = path.resolve(__dirname, '../src/utils/EventUtils.js');
	// const srcFilePath = path.resolve(__dirname, '../src/utils/ObjectUtils.js');
	// const srcFilePath = path.resolve(__dirname, '../src/utils/VK.js');
	// TODO write markdown file to dest
	// const destFilePath
	dumpFileComment(srcFilePath)
	.onItem((item) => {
		console.log('----', item);
	})
	.onEnd(() => {
		console.log('end');
	});
}
