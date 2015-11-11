// ==========
// Level
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Level(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
}

Level.prototype = new Entity();

    
// Initial, inheritable, default values
Level.prototype.height = 14 //Able to fit 14 blocks on the height of the canvas. Zelda's height is around 2 blocks.

var levelObject =  {
	
	level1 : [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] // 60 rows
],

level2 : [
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[]
]

};					

Level.prototype.update = function (du) {
	this.width = X*this.Blocks[13].length;
};

Level.prototype.BREAK_ME = -2;

Level.prototype.Blocks = [];

Level.prototype.initLevel = function(curLevel) {
	for (var i = 0; i < curLevel.length; i++) {
		var column = [];
		for (var j = 0; j < curLevel[i].length; j++) {
			if (curLevel[i][j] === 1) {
				column[j] = new Block();
			}
		}
		this.Blocks[i] = column;
	}
}

var Y = g_canvas.height/14;
var X = Y;

var testx = 0;
var testy = 0; 
var testy2 = 0; 

Level.prototype.render = function (ctx) {
	for (var i = 0; i < this.Blocks.length; i++) {
		for (var j = 0; j < this.Blocks[i].length; j++) {
			if (this.Blocks[i][j]) {
				this.Blocks[i][j].render(ctx, X*j, Y*i, X, Y);
				if (g_renderSpatialDebug) {
					util.strokeBox(ctx, X*j, Y*i, X, Y, 'red');
				}
			}
		}
	}
	//character bottom and top box
	if (g_renderSpatialDebug){ 
		util.strokeBox(ctx, X*this.testx + this.center.cx, Y*this.testy, X, Y, 'red');
		util.strokeBox(ctx, X*this.testx + this.center.cx, Y*this.testy2, X, Y, 'blue');
	}
};

Level.prototype.findGround = function (Char) {
 //Mun verða fjarlægt er bara hér þar til ég get fiktað í ykkar 
	var col = testx;
	var row = testy;
	util.strokeBox(ctx, X*this.testx, Y*this.testy, X, Y, 'red');
};

Level.prototype.findGround = function (Char) {
	var pos = Char.getPos();
	var posX = pos.posX;
	var posY = pos.posY;
	var size = Char.getSize();
	var sizeY = size.sizeY;
	var col = 0;
	var row = 0;
	//find what column I'm in 
	for(var j = 0; j < this.Blocks[13].length; j++)
		if(Math.abs(X*j - posX) <= X/2)
			col = j;
	//starting point in array to search for ground
	for(var i = 0; i < this.Blocks.length; i++)
		if(Math.abs(Y*i - posY) <= Y/2)
			row = i;
		
	//Character is traweling downwards so we check for ground
	for (var i = row; i < this.Blocks.length; i++) {
		if (this.Blocks[i][col]) {
			return this.Blocks[i][col].collide(Char, Y*i - 0.81*Y);
		}
	}
		
	//no hittable blocks were found in this column
	return 1337;
};

Level.prototype.findBlocks = function (Char) {
	var pos = Char.getPos();
	var posX = pos.posX;
	var posY = pos.posY;
	var size = Char.getSize();
	var sizeY = size.sizeY;
	var sizeX = size.sizeX;
	var col = 0;
	var row = 0;
	var rowHeight = 0;
	//find what column I'm in 
	for(var j = 0; j < this.Blocks[13].length; j++)
		if( posX - X*j >= 0 && X*(j+1) - posX >= 0){
			col = j;
			break;
		}
	//starting point in array to search for roof
	for(var i = 0; i < this.Blocks.length; i++)
		if( Y*(i+1) - (posY + sizeY/2) >= 0  && (posY + sizeY/2) - Y*i >= 0)
			row = i;

	//reference height of the char to see how many rows of blocks we need to check
	for(var i = 0; i < this.Blocks.length; i++)
		if( Y*(i+1) - (posY - sizeY/2) >= 0  && (posY - sizeY/2) - Y*i >= 0)
			rowHeight = i;

	//to  show what cell character is allocated as.
	this.testy = row;
	this.testy2 = rowHeight;
	this.testx = col;


	var topB = false,
		leftB = false,
		rightB = false,
		bottomB = false;
	var theBAbove;
	var roof = -1337;

	
	this.findAjacentBlocks(col, row, row - rowHeight, 0);
	
	var blocks ={
				left: leftB,
				right: rightB,
				top: roof,
				isTB: topB,
				topBlock : theBAbove
				};
	return blocks;
};

Level.prototype.findAjacentBlocks = function (col, row, hight, attVisir) {
	if(attVisir === 0){
	
	}
};