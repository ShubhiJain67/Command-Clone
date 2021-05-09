#!/usr/bin/env node

//--------------------------------------------- Functions -------------------------------------------
function print(message) {
	console.log(message);
}

function checkEsitanceOfAllFiles(files = []) {
	let fileSystem = require('fs');
	let filesNotFound = [];
	files.forEach((file) => {
		if (!fileSystem.existsSync(file)) {
			filesNotFound.push(file);
		}
	});
	if (filesNotFound.length > 0) {
		console.log(`ERROR!! Following Files were not found : ${filesNotFound}`);
		return false;
	}
	return true;
}

function checkIfValidOperations(operations = []) {
	let operationsNotFound = [];
	operations.forEach((operation) => {
		switch (operation) {
			case '-s':
				break;
			case '-n':
				break;
			case '-ne':
				break;
			case '-cat':
				break;
			case '-p':
				break;
			case '-r':
				break;
			case '-t':
				break;
			case 'rs':
				break;
			default:
				operationsNotFound.push(operation);
		}
	});
	if (operationsNotFound.length > 0) {
		console.log(
			`ERROR!! Following Operations were not found : ${operationsNotFound}`
		);
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
	if (operations.includes('-r')) {
		file = removeAllExtraSpaces(file);
	}
	if (operations.includes('-p')) {
		file = convertToParagraph(file);
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

filesCheck = checkEsitanceOfAllFiles(files);
operationsCheck = checkIfValidOperations(operations);

if (filesCheck && operationsCheck) {
	if (operations.length == 0) {
		print(`ERROR!! Please specify the operation to perform :
                1. -s   : to reduce large line gaps to single line gap
                2. -n   : to number only non empty lines
                3. -ne  : to number al lines
                4. -cat : to concatenate all mentioned files
				5. -p   : to convert the file into a paragraph
				6. -r   : remove extra spaces
				7. -t   : trim extra spaces from ends of each line of files
				8. -rs  : remove all extra spaces`);
	} else if (files.length == 0) {
		print(
			'ERROR!! Please specify the files on which you need to perfom the operations'
		);
	} else {
		if (operations.includes('-cat') || files.length == 1) {
			resultFile = concatAllFiles(files);
			print(performAllOperations(resultFile));
		} else if (files.length > 1) {
			print(
				'ERROR!! Either add the -cat command to concatenate all files or specify a single file.'
			);
		}
	}
}
