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
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,0,0,0,7,7,7,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'a',0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,0,0,0,0,0,0,1,1,1,1,1,1,0,4,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,'a',0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,7,7,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,1,0,1,0,3,3,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,7,7,0,6,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,4,4,4,4,4,1,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0],
	[2,0,0,0,0,0,3,0,'a','a','a',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,4,4,4,1,3,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0],
	[6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,6,6,6,6,6,6,6,6,6,6,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
	[6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,6,6,6,6,6,6,6,6,6,6,6,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6] // 60 rows
],

level2 : [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,7,0,7,0,0,0,0,0,7,0,0,0,0,7,0,0,0,0,0,0,0,7,0,0,7,0,0,0,0,0,0,7,7,7,7,7,7,0,0,0,0,7,0,7,0,7,0,0,0,7,0,7,0,7,0,7,0,0,7,0,7,0,7,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,4,4,4,4,6,6,6,6,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,4,4,4,4,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,4,4,4,4,4,4,4,4,4,4,4,4,4,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,4,4,4,4,4,4,4,4,4,4,4,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,4,4,4,4,4,4,4,4,4,4,6,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,4,4,4,4,4,4,4,4,6,6,4,4,4,4,4,4,4,4,4,4,4,6,6,6,6,6,6,6,6,4,4,4,4,4,4,4,4,4,6,6,4,4,4,4,4,4,4,4,4,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,6,6,6,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6,6,6,6,6,6,6,6,6,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6,6,6,6,6,6,6,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6,6,4,4,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0],
	[6,6,6,6,6,6,6,6,6,6,6,6,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
	[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,4,4,4,4,4,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6]
]

};					

Level.prototype.update = function (du) {
	this.width = X*this.Blocks[13].length;
	for (var i = 0; i < this.Blocks.length; i++) {
		for (var j = 0; j < this.Blocks[i].length; j++) {
			if (this.Blocks[i][j]) {
				if(this.Blocks[i][j].update()) this.Blocks[i][j] = undefined; 
			}
		}
	}
};

Level.prototype.BREAK_ME = -2;

Level.prototype.Blocks = [];

var Y = g_canvas.height/14;
var X = Y;

Level.prototype.initLevel = function(curLevel) {
	for (var i = 0; i < curLevel.length; i++) {
		var column = [];
		for (var j = 0; j < curLevel[i].length; j++) {
			var type = curLevel[i][j];
			if (type != 0) {
				
				if(type === 2) {
					//make spikes
					column[j] = new Block({
										type: curLevel[i][j],
										sprite : g_sprites.spikes
									});
				} else if(type === 3) {
					//make a coinbox
					column[j] = new Block({
										type: curLevel[i][j],
										sprite : g_sprites.coinBox,
										i : i,
										j : j
									});
				} else if(type === 4) {
					//make water?
					column[j] = new Block({
										type: curLevel[i][j],
										sprite : g_sprites.water,
										_isPassable : true
										
									});
				} else if (type === 5) {
					//make ground
					column[j] = new Block({
										type : curLevel[i][j],
										sprite : g_sprites.ground
									});
				} else if (type === 6) {
					//make ground
					column[j] = new Block({
										type : curLevel[i][j],
										sprite : g_sprites.dungeon
									});
				} else if (type === 'a') {
					//make basic enemy
					entityManager.generateEnemy({
										cx: X*j + X/2,
										cy: Y*i + i/2 
									});
				} else if (type === 7) {
					//make coin
					column[j] = new Block({
										type : curLevel[i][j],
										sprite : g_sprites.coin,
										_isPassable : true
									});
				} else {
					//make a normal block
					column[j] = new Block({
										type: curLevel[i][j],
										_isBreakable : true
									});
				}
			}
		}
		this.Blocks[i] = column;
	}
}


var testx = 0;
var testx2 = 0;
var testy = 0; 
var testy2 = 0; 

Level.prototype.render = function (ctx) {
	for (var i = 0; i < this.Blocks.length; i++) {
		for (var j = 0; j < this.Blocks[i].length; j++) {
			if (this.Blocks[i][j]) {
				this.Blocks[i][j].render(ctx, X*j, Y*i, X, Y);
				if (g_renderExtraDebug) {
					util.strokeBox(ctx, X*j, Y*i, X, Y, 'red');
				}
			}
		}
	}
	//character bottom and top box
	if (g_renderExtraDebug){ 
		util.strokeBox(ctx, X*this.testx, Y*this.testy, X, Y, 'red');
		util.strokeBox(ctx, X*this.testx2, Y*this.testy, X, Y, 'green');
		util.strokeBox(ctx, X*this.testx, Y*this.testy2, X, Y, 'blue');
		
	}
};

/*
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
*/
Level.prototype.charLevelPosition = function (posX,posY,sizeX,sizeY) {
	var colL = 0;
	var colR = 0;
	var row = 0;
	var rowHeight = 0;


	//find what column The left side of the character is in 
	for(var j = 0; j < this.Blocks[13].length; j++)
		if( (posX - sizeX/2) - X*j >= 0 && X*(j+1) - (posX - sizeX/2) >= 0){
			colL = j;
		}

	//find what column The left right of the character is in 
	for(var j = 0; j < this.Blocks[13].length; j++)
		if( (posX + sizeX/2) - X*j >= 0 && X*(j+1) - (posX + sizeX/2) >= 0){
			colR = j;
		}
		
	//starting point aka ground uses middle X-point as reference
	for(var i = 0; i < this.Blocks.length; i++)
		if( Y*(i+1) - (posY + sizeY/2) >= 0  && (posY + sizeY/2) - Y*i >= 0){
			row = i;
		}
	//reference height of the char to see how many rows of blocks we need to check
	for(var i = 0; i < this.Blocks.length; i++)
		if( Y*(i+1) - (posY - sizeY/2) >= 0  && (posY - sizeY/2) - Y*i >= 0){
			rowHeight = i;
		}
		
	
	if (g_renderExtraDebug){ 
	//to  show what cell character is allocated as.
	this.testy = row;
	this.testy2 = rowHeight;
	this.testx = colL;
	this.testx2 = colR;
	}	
	
	var LPos ={
				xL: colL,
				xR: colR,
				yT: rowHeight,
				yB: row,
				};
				
	return LPos;
}

Level.prototype.emtySpaceBelow = function (Char){
	var pos = Char.getPos();
	var posX = pos.posX;
	var posY = pos.posY;
	var size = Char.getSize();
	var sizeY = size.sizeY;
	var sizeX = size.sizeX;
	var Lpos = this.charLevelPosition(posX, posY, sizeX, sizeY);
	var fall = true;
	if(Lpos.yB < 13){
		if(this.Blocks[Lpos.yB + 1][Lpos.xL]){
			if(!this.Blocks[Lpos.yB + 1][Lpos.xL]._isPassable){
				fall = false;				
			}
		}
		if(this.Blocks[Lpos.yB + 1][Lpos.xR]){
			if(!this.Blocks[Lpos.yB + 1][Lpos.xR]._isPassable){
				fall = false;				
			}
		}
	}
	return fall;
}

Level.prototype.findBlocks = function (Char, du) {
	var pos = Char.getPos();
	var posX = pos.posX;
	var posY = pos.posY;
	var pos2 = Char.getNextPos(du);
	var posX2 = pos2.nextX;
	var posY2 = pos2.nextY;
	var size = Char.getSize();
	var sizeY = size.sizeY;
	var sizeX = size.sizeX;
	
	//level positions
	var Lpos = this.charLevelPosition(posX, posY, sizeX, sizeY);
	var Lpos2 = this.charLevelPosition(posX2, posY2, sizeX, sizeY);
	return this.dealWithLevelCollision(Lpos,Lpos2, Char);
	
};

Level.prototype.dealWithLevelCollision = function (Lpos, Lpos2, Char) {
	var lEdge = (Lpos.xL != Lpos2.xL);
	var rEdge = (Lpos.xR != Lpos2.xR);
	var tEdge = (Lpos.yT != Lpos2.yT);
	var bEdge = (Lpos.yB != Lpos2.yB);
	
	var blockR = false;
	var blockL = false;
	var blockT = false;
	var blockB = false;
	
	//verður column breyting hægra meginn?
	if(rEdge){
		//skoða alla relevant kubba hægra meginn
		for(var i = Lpos.yT; i <= Lpos.yB; i++){
			if (this.Blocks[i][Lpos2.xR]) {
				if(this.Blocks[i][Lpos2.xR]._isPassable){
					this.Blocks[i][Lpos2.xR].activate(Char,2);
				} else {
					this.Blocks[i][Lpos2.xR].activate(Char,2);
					blockR = true;
				}
			}
		}
	}
	//verður column breyting vinstra meginn?
	if(lEdge){
		//skoða alla relevant kubba vinstra meginn
		for(var i = Lpos.yT; i <= Lpos.yB; i++){
			if (this.Blocks[i][Lpos2.xL]) {
				if(this.Blocks[i][Lpos2.xL]._isPassable){
					this.Blocks[i][Lpos2.xL].activate(Char,0);
				} else {
					this.Blocks[i][Lpos2.xL].activate(Char,0);
					blockL = true;
				}
			}
		}
	}
	//verður breyting í hæð uppi?
	if(tEdge){
		if(this.Blocks[Lpos2.yT][Lpos.xL]){
			if(this.Blocks[Lpos2.yT][Lpos.xL]._isPassable){
				this.Blocks[Lpos2.yT][Lpos.xL].activate(Char,1);
			} else {
				this.Blocks[Lpos2.yT][Lpos.xL].activate(Char,1);
				blockT = true;
			}
		}
		if(this.Blocks[Lpos2.yT][Lpos2.xL]){
			if(!this.Blocks[Lpos2.yT][Lpos2.xL]._isPassable){
				blockT = true;
			}
		}
		if(this.Blocks[Lpos2.yT][Lpos.xR]){
			if(this.Blocks[Lpos2.yT][Lpos.xR]._isPassable){
				this.Blocks[Lpos2.yT][Lpos.xR].activate(Char,1);
			} else {
				this.Blocks[Lpos2.yT][Lpos.xR].activate(Char,1);
				blockT = true;
			}
		}
		if(this.Blocks[Lpos2.yT][Lpos2.xR]){
			if(!this.Blocks[Lpos2.yT][Lpos2.xR]._isPassable){
				blockT = true;
			}
		}
	}
	//verður breyting í hæð niðri?
	if(bEdge){
		if(this.Blocks[Lpos2.yB][Lpos.xL]){
			if(this.Blocks[Lpos2.yB][Lpos.xL]._isPassable){
				this.Blocks[Lpos2.yB][Lpos.xL].activate(Char,3);
			} else {
				this.Blocks[Lpos2.yB][Lpos.xL].activate(Char,3);
				blockB = true;
				var height = Lpos2.yB;				
			}
		}
		if(this.Blocks[Lpos2.yB][Lpos2.xL]){
			if(!this.Blocks[Lpos2.yB][Lpos2.xL]._isPassable){
				blockB = true;
				height = Lpos2.yB;
			}
		}
		if(this.Blocks[Lpos2.yB][Lpos.xR]){
			if(this.Blocks[Lpos2.yB][Lpos.xR]._isPassable){
				this.Blocks[Lpos2.yB][Lpos.xR].activate(Char,3);
			} else {
				this.Blocks[Lpos2.yB][Lpos.xR].activate(Char,3);
				blockB = true;
				height = Lpos2.yB;
			}
		}
		if(this.Blocks[Lpos2.yB][Lpos2.xR]){
			if(!this.Blocks[Lpos2.yB][Lpos2.xR]._isPassable){
				blockB = true;
				height = Lpos2.yB;
			}
		}
	}
	//Er inní block? ef þá activatea það
	if(Lpos.yB > 0){
		if(this.Blocks[Lpos.yB -1][Lpos.xL]){
			if(this.Blocks[Lpos.yB-1][Lpos.xL]._isPassable){
				this.Blocks[Lpos.yB-1][Lpos.xL].activate(Char,4);
			}
		} else if(this.Blocks[Lpos.yB - 1][Lpos.xR]){
			if(this.Blocks[Lpos.yB - 1][Lpos.xR]._isPassable){
				this.Blocks[Lpos.yB - 1][Lpos.xR].activate(Char,4);
			}
		}
	}
	if(this.Blocks[Lpos.yB][Lpos.xL]){
		if(this.Blocks[Lpos.yB][Lpos.xL]._isPassable){
			this.Blocks[Lpos.yB][Lpos.xL].activate(Char,4);
		}
	} else if(this.Blocks[Lpos.yB][Lpos.xR]){
		if(this.Blocks[Lpos.yB][Lpos.xR]._isPassable){
			this.Blocks[Lpos.yB][Lpos.xR].activate(Char,4);
		}
	}
	
	
	
	
	var blocks = {
				L : blockL,
				R : blockR,
				T : blockT,
				B : blockB,
				height : height
				};
	return blocks;
};