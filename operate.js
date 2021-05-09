#!/usr/bin/env node
let availableOperations = [
	{
		name: '-s',
		description: 'to reduce large line gaps to single line gap',
	},
	{
		name: '-n',
		description: 'to number only non empty lines',
	},
	{
		name: '-ne',
		description: 'to number al lines',
	},
	{
		name: '-cat',
		description: 'to concatenate all mentioned files',
	},
	{
		name: '-p',
		description: 'to convert the file into a paragraph',
	},
	{
		name: '-r',
		description: 'remove all extra spaces',
	},
	{
		name: '-t',
		description: 'trim extra spaces from ends of each line of files',
	},
];
//--------------------------------------------- Functions -------------------------------------------
function print(message) {
	console.log(message);
}

function printError(message) {
	console.log(`ERROR!!-----------------> ${message}`);
}

function printSyntaxError() {
	console.log(`Invalid Command!
    The coorect syntax is as follows :
    {operation type(s)} {filename(s)}`);
	printAvailableOperations();
}

function printAvailableOperations() {
	let message = `Available Operation Types :`;
	let count = 1;
	availableOperations.forEach((operation) => {
		message += `\n${count}. ${operation.name} : ${operation.description}`;
		count++;
	});
	console.log(message);
}

function checkIfValidOperations(operations = []) {
	if (operations.length === 0) {
		printError('No operation mentioned!');
		printSyntaxError();
	}
	let count = 0;
	operations.forEach((operation) => {
		availableOperations.forEach((availableOperation) => {
			if (availableOperation.name === operation) {
				count++;
			}
		});
	});
	return count === operations.length;
}

function checkEsitanceOfAllFiles(files = []) {
	if (files.length == 0) {
		printError('No files mentioned');
		return false;
	}
	let fileSystem = require('fs');
	let filesNotFound = [];
	files.forEach((file) => {
		if (!fileSystem.existsSync(file)) {
			filesNotFound.push(file);
		}
	});
	if (filesNotFound.length > 0) {
		printError(`Following Files were not found : ${filesNotFound}`);
		return false;
	}
	return true;
}

function removeExtraLines(file = '') {
	let resultWOextraspce = (function (arr) {
		let result = [];
		let firstSpace = true;
		arr.forEach((ele) => {
			if (ele === '\n' || ele == '\r') {
				if (firstSpace) {
					result.push(ele);
					firstSpace = false;
				}
			} else {
				result.push(ele);
				firstSpace = true;
			}
		});
		return result;
	})(file.split('\n'));
	return resultWOextraspce.join('\n');
}

function numberLines(file = '', numberAll = true) {
	let resultWOextraspce = (function (arr) {
		let result = [];
		let count = 1;
		arr.forEach((ele) => {
			if (ele === '\n' || ele == '\r') {
				if (numberAll) {
					ele = count + '. ' + ele;
					count++;
				}
			} else {
				ele = count + '. ' + ele;
				count++;
			}
			result.push(ele);
		});
		return result;
	})(file.split('\n'));
	return resultWOextraspce.join('\n');
}

function performAllOperations(file = '') {
	if (operations.includes('-s')) {
		file = removeExtraLines(file);
	}
	if (operations.includes('-ne')) {
		file = numberLines(file);
	} else if (operations.includes('-n')) {
		file = numberLines(file, false);
	}
	if (operations.includes('-p')) {
		file = convertToParagraph(file);
	}
	if (operations.includes('-r')) {
		file = removeAllExtraSpaces(file);
	}
	if (operations.includes('-t')) {
		file = removeExtraSpacesFromEnds(file);
	}
	return file;
}

function concatAllFiles(files) {
	let resultFile = '';
	files.forEach((file) => {
		if (resultFile === '') {
			resultFile = fileSystem.readFileSync(file).toString();
		} else {
			resultFile = `${resultFile}\r\n${fileSystem
				.readFileSync(file)
				.toString()}`;
		}
	});
	return resultFile;
}

function convertToParagraph(file) {
	return file.replace(/\s+/g, ' ');
}

function removeExtraSpacesFromEnds(file) {
	let returnFile = (function (files) {
		let result = [];
		files.forEach((file) => {
			result.push(file.trim());
		});
		return result.join('\n');
	})(file.split('\n'));
	return returnFile;
}

function removeAllExtraSpaces(file) {
	let returnFile = (function (files) {
		let result = [];
		files.forEach((file) => {
			file = file.trim();
			result.push(file.replace(/\s+/g, ' '));
		});
		return result.join('\n');
	})(file.split('\n'));
	return returnFile;
}

//-------------------------------------------- Cat commond clone starts here --------------------------------

let fileSystem = require('fs');
let arguments = process.argv.slice(2);
let operations = [];
let files = [];
let resultFile = '';

// ------------ Segregating operations and files --------------
arguments.forEach((element) => {
	if (element.startsWith('-')) {
		operations.push(element);
	} else {
		files.push(element);
	}
});

if (operations.includes('-help')) {
	printAvailableOperations();
} else {
	filesCheck = checkEsitanceOfAllFiles(files);
	operationsCheck = checkIfValidOperations(operations);
	print(`${filesCheck}  ${operationsCheck}`);
	if (filesCheck && operationsCheck) {
		if (operations.length == 0) {
			printError(`Please specify the operation to perform`);
			printSyntaxError();
		} else if (files.length == 0) {
			printError(
				'Please specify the files on which you need to perfom the operations'
			);
			printSyntaxError();
		} else {
			if (operations.includes('-cat') || files.length == 1) {
				resultFile = concatAllFiles(files);
				print(performAllOperations(resultFile));
			} else if (files.length > 1) {
				printError(
					'Either add the -cat command to concatenate all files or specify a single file.'
				);
				printSyntaxError();
			}
		}
	} else {
		printSyntaxError();
	}
}
