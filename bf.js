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

function runBFScript() //Instructions: > < + - . , [ ]
{
	//create an array for the memory we will be addressing
	var memory = Array.apply(null, Array(Math.pow(2,16))).map(Number.prototype.valueOf,0);
	var pointer = 0;

	//array to store where to go when we hit the end of a loop or should not loop a loop
	var loopData = [];

	//used for calculating nested loops
	var stack = [];

	//fill the loopData array with data
	for(var i = 0; i < fileContents.length; i++)
	{
		var c = fileContents[i];

		if(c === '[')
		{
			stack.push(i);
		}
		else if(c === ']')
		{
			loopData[i] = stack.pop();
			loopData[loopData[i]] = i + 1;
		}
	}

	//loop through all instructions
	for(var i = 0; i < fileContents.length; i++)
	{
		var c = fileContents[i];

		switch(c)
		{
			case '>':
					//dont overflow
					if(pointer < Math.pow(2,16) - 1)
					{
						pointer++;
						debug('incremented pointer to ' + pointer);
					}
					else
						console.log('Error on instruction ' + i + ': Cannot set pointer to ' + Math.pow(2,16));
					break;
			case '<':
					//don't go below 0
					if(pointer > 0)
					{
						pointer--;
						debug('Decremented pointer to ' + pointer);
					}
					else
						console.log('Error on instruction ' + i + ': Cannot set pointer to -1');
					break;
			case '+':
					//data value overflows to 0
					if(memory[pointer] < 255)
					{
						memory[pointer]++;
					}
					else
						memory[pointer] = 0;
					debug('Incremented memory value to ' + memory[pointer]);
					break;
			case '-':
					//data value underflows to 255
					if(memory[pointer] > 0)
						memory[pointer] = memory[pointer] - 1;
					else
						memory[pointer] = 255;
					debug('Decremented memory value to ' + memory[pointer]);
					break;
			case '.':
					process.stdout.write(String.fromCharCode(memory[pointer]));
					break;
			case ',':
					memory[pointer] = process.stdin.read();
					break;
			case '[':
					//if this current memory cell is true, continue
					//else go to the matching ]
					if(memory[pointer] === 0)
					{
						//do not run this loop, skip it
						debug('Going back to instruction ' + loopData[i]);
						//-1 because i will be incremented at the end of the for loop
						i = loopData[i] - 1;
					}
					break;
			case ']':
					//always go back to the beginning of this loop
					debug('Going back to instruction ' + loopData[i]);
					//-1 because i will be incremented at the end of the for loop
					i = loopData[i] - 1;
					break;
					//if a non-instruction character is encountered, just ignore it
		}
	}
}
function debug(v)
{
//	console.log(v);
}
