/*
* Brainfuck interpreter written in NodeJS
*/
var fs = require('fs');

//read in file
var BFFileName = process.argv[2];
var fileContents;

fs.readFile(BFFileName, 'utf8', function(err, data)
{
	if(err)
	{
		console.log('Error: File not found');
		process.exit(1);
	}
	else
	{
		fileContents = data;
	}
});
var fileReadYet = setInterval(function()
{
	if(fileContents !== undefined)
	{
		clearInterval(fileReadYet);
		runBFScript();
	}
});

function runBFScript()
{
	//create an array for the memory we will be addressing
	var memory = Array.apply(null, Array(Math.pow(2,16))).map(Number.prototype.valueOf,0);
	var pointer = 0;

	//loop through all instructions
	for(var i = 0; i < fileContents.length - 1; i++)
	{
		var c = fileContents[i];
		if(c === '') continue;

		//TODO: handle instructions
	}	
}
