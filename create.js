// --------------------------------------------- Basic Setup ---------------------------------------
let syntax = `{operation type} {name} -count {count}`;
let availableOperations = [
	{
		name: '-createFolder',
		description: 'to create a new folder',
	},
	{
		name: '-removeFolder',
		description: 'to remove an already existing folder',
	},
];

//--------------------------------------------- Functions -------------------------------------------
function print(message = '') {
	console.log(message);
}

function printError(message = '') {
	console.log(`ERROR!!-----------------> ${message}`);
}

function printSyntaxError() {
	console.log(`Invalid Command!
    The coorect syntax is as follows :
    ${syntax}
    where count is optional`);
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

function checkIfValidOperations(operation = '') {
	let ret = false;
	availableOperations.forEach((availableOperation) => {
		if (!ret && availableOperation.name === operation) {
			ret = true;
		}
	});
	return ret;
}

function checkForCorrectSyntax(arguments = []) {
	let len = arguments.length;
	if (len < 2 || len == 3 || len > 4) {
		return false;
	}
	if (!checkIfValidOperations(arguments[0])) {
		return false;
	}
	if (arguments[2] === '-count') {
		if (arguments.length !== 4 || parseInt(arguments[3]) === NaN) {
			return false;
		}
	}
	return true;
}

function exists(path = '') {
	return fileSystem.existsSync(path);
}

function createFolder(name = '', count = 1) {
	print(`Create folder ${name} ${count}`);
	if (count <= 0) {
		printError('Invalid parameters : count cannot be less than or equal to 0');
		printSyntaxError();
	}
	let folderSuffix = 0;
	let folderName = `${name}`;
	while (count > 0) {
		if (folderSuffix > 0) {
			folderName = `${name}-${folderSuffix}`;
		}
		if (!exists(folderName)) {
			fileSystem.mkdirSync(folderName);
			print(`Created : ${folderName}`);
			count--;
		} else {
			folderSuffix++;
		}
	}
}

function removeFolder(name = '') {
	let folderName = `${name}`;
	if (exists(folderName)) {
		// Deleting folder
		fileSystem.rmdirSync(folderName);
		print(`Deleted : ${folderName}`);
	} else {
		print(`Folder : ${folderName} Doesnot exist`);
	}
}

//-------------------------------------------- Cat commond clone starts here --------------------------------

const fileSystem = require('fs');
let arguments = process.argv.slice(2);

if (checkForCorrectSyntax(arguments)) {
	let operation = arguments[0];
	let name = arguments[1];
	let count = 1
	if(arguments[3] !== undefined){
		count = parseInt(arguments[3]);
	}
	if (operation === '-createFolder') {
		createFolder(name, count);
	} else if (operation === '-removeFolder') {
		removeFolder(name);
	}
} else {
	printError();
	printSyntaxError();
}
