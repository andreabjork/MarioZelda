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
Level.prototype.height = 14 //dæmi um hversu mörg block canvazið getur tekið.
							//geri ráð fyrir að Mario sé 2 blocks á hæð...

var levelObject =  {
	
	level1 : [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
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
	var start = 0;
	var end = this.Blocks[13].length*(-X)+g_canvas.width;
	var charPos = entityManager._character[0].getPos();
	var charVelX = entityManager._character[0].velX;
	var charVelY = entityManager._character[0].velY;
	var Left = entityManager._character[0].KEY_LEFT;
	var Right = entityManager._character[0].KEY_RIGHT;
	

	if (keys[Left] && charPos.posX < 200) {
		if (this.center.cx < start) {
			var nextC = this.center.cx - charVelX;
			if (nextC > start) {
				this.center.cx = start;
			} else {
				this.center.cx = nextC;
			}
		}
	}
	if (keys[Right] && charPos.posX > 385) {
		if (this.center.cx > end) {
			nextC = this.center.cx - charVelX;
			if (nextC < end) {
				this.center.cx = end
			} else {
				this.center.cx = nextC;
			}
		}
	}
	if (charPos.posY <= 100) {
		if (this.center.cy + charVelY > 0) {
			this.center.cy = 0;
		} else {
			this.center.cy += charVelY;
			console.log(this.center.cy);
		}
	} else {
		this.center.cy = 0;
	}

};

Level.prototype.BREAK_ME = -2;

Level.prototype.Blocks = [];

Level.prototype.center = {cx : 0, cy : 0};

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
				this.Blocks[i][j].render(ctx, X*j + this.center.cx, Y*i - this.center.cy, X, Y);
				if (g_renderSpatialDebug) {
					util.strokeBox(ctx, X*j + this.center.cx, Y*i - this.center.cy, X, Y, 'red');
				}
			}
		}
	}
	//character bottom box
	if (g_renderSpatialDebug){ 
		util.strokeBox(ctx, X*this.testx + this.center.cx, Y*this.testy, X, Y, 'red');
		util.strokeBox(ctx, X*this.testx + this.center.cx, Y*this.testy2, X, Y, 'blue');
	}
};

Level.prototype.findGround = function (Char) {
 //Mun verða fjarlægt er bara hér þar til ég get fiktað í ykkar 
	var col = testx;
	var row = testy;
		
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
		if( posX - X*j + this.center.cx >= 0 && X*(j+1) + this.center.cx - posX >= 0){
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
		rightB = false;
		bottomB = false;
	var theBAbove;
	var roof = -1337;


	/*
	//block on top?
	if(row > 0){
		//is there a block directly above?, and if so, save it
		if (this.Blocks[row - 1][col]) {
			topB = true;
			theBAbove = this.Blocks[row - 1][col];
			roof = Y*(row-1) + Y/2; 
		}
		
		//is there a block in the way of the image that would make silly clips? :)
		if((X*col + this.center.cx - posX) < -Y/4){
			if (this.Blocks[row - 1][col+ 1]) {
				//topB = true;
				roof = Y*(row-1) + Y/2; 
			}
		} else if((X*col + this.center.cx - posX) > Y/4){
			if (this.Blocks[row - 1][col-1]) {
				//topB = true;
				roof = Y*(row-1) + Y/2; 
			}
		}
	}
	//blocked on left?
	if (this.Blocks[row][col-1] || this.Blocks[row+1][col-1]) {
			if((X*(col-1) + this.center.cx + X/2 - posX + sizeX - Char.velX) >= -Y/4) leftB = true;					
	}
	
	if(row > 0) if(this.Blocks[row-1][col-1] && Char.offGround)
		if((X*(col-1) + this.center.cx + X/2 - posX + sizeX - Char.velX) >= 0) leftB = true;
	
	if(row < 14 && row > 0) if(this.Blocks[row+2][col-1] && Char.offGround)
		if((X*(col-1) + this.center.cx + X/2 - posX + sizeX - Char.velX) >= 0) leftB = true;
	
	//blocked on right?
	if (this.Blocks[row][col+1] || this.Blocks[row+1][col+1]) {
			if((X*(col+1) + this.center.cx - X/2 - posX - sizeX - Char.velX) <= -Y/4) rightB = true;					
	}
	if(row > 0) if(this.Blocks[row-1][col+1] && Char.offGround)
		if((X*(col+1) + this.center.cx - X/2 - posX - sizeX - Char.velX) <= 0) rightB = true;
	
	if(row < 14) if(this.Blocks[row+2][col+1] && Char.offGround)
		if((X*(col+1) + this.center.cx + X/2 - posX - sizeX - Char.velX) <= 0) leftB = true
	*/
	
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
	if(attvisir === 0){
	
	}
};