// ==========
// World
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function World(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    // Define current level:
    this.world = this.Worlds.level1;

    this.blocks = [];
	var s = 2;	

	for(var i = 0; i < this.world.length; i++) {
		this.blocks[i] = [];
		for(var j = 0; j < this.world[i].length; j++) {
			s = this.world[i][j];
			console.log("does this happen?");
			this.blocks[i][j] = (s === 0 ? null : new Block({i: i, j: j, type: s}));
		}
	}
}

World.prototype = new Entity();

// =====================
// WORLD COLLISION STUFF
// =====================
    
// Initial, inheritable, default values
World.prototype.height = 14 //Able to fit 14 blocks on the height of the canvas. Zelda's height is around 2 blocks.
World.prototype.blockDim = g_canvas.height/14;
			

World.prototype.getBlockCoords = function(x,y) {
	var col = Math.floor(x/(this.blockDim));
	var row = Math.floor(y/(this.blockDim));
	return [row, col];
}

World.prototype.getLocation = function(i,j) {
	//var block = this.blocks[i][j];
	return [j*this.blockDim, 
			i*this.blockDim]
}


World.prototype.collidesWith = function (zelda, prevX, prevY, nextX, nextY) {
	var halfW = zelda.getSize().sizeX;
	var halfH = zelda.getSize().sizeY;
	var newCoords = this.getBlockCoords(prevX,prevY+halfH/2 - 2); // off by 2 because we have off by 1 for zelda's putToGround AND regular off by 1 so we don't fall after landing.
/*
	var row = newCoords[0];
	var col = newCoords[1];
	var topBlock = (this.blocks[row-2] ? this.blocks[row-2][col] : null);
	var leftBlockA = (this.blocks[row-1] ? this.blocks[row-1][col-1] : null);
	var leftBlockB = (this.blocks[row] ?  this.blocks[row][col-1] : null);
	var bottomBlock = (this.blocks[row+1] ? this.blocks[row+1][col] : null);
	var rightBlockA = (this.blocks[row-1] ? this.blocks[row-1][col+1] : null);
	var rightBlockB = (this.blocks[row] ? this.blocks[row][col+1] : null);
	
	var collidingCoords = [];
	var collidingBlocks = [topBlock, leftBlockA, leftBlockB, bottomBlock, rightBlockA, rightBlockB];
	for(var block in collidingBlocks) {
		var b = collidingBlocks[block];
		if(b) {
			var coords = this.getLocation(b.i, b.j);
			b.cx = coords[0]+this.blockDim/2;
			b.cy = coords[1]+this.blockDim/2;
			b.halfWidth = this.blockDim;
			b.halfHeight = this.blockDim;
		}
	}
*/
// /*
	var collidingBlocks = [];
	var collidingCoords = [];
	var row = newCoords[0]-2;
	var col = newCoords[1]-1;
	for(var i = 0; i < 4; i++) {
		for(var j = 0; j < 3; j++) {
			if(this.blocks[row+i]) {
				if(this.blocks[row+i][col+j]) {
					collidingBlocks.push(this.blocks[row+i][col+j]);	
				}
			}	
		}
	}

	for(var block in collidingBlocks) {
		var b = collidingBlocks[block];
		if(b) {
			var coords = this.getLocation(b.i, b.j);
			b.cx = coords[0]+this.blockDim/2;
			b.cy = coords[1]+this.blockDim/2;
			b.halfWidth = this.blockDim;
			b.halfHeight = this.blockDim;
		}
	}
// */

	return {blocks: collidingBlocks, coords: collidingCoords};
};


// =================
// WORLD HENRY STUFF
// =================

World.prototype.charLevelPosition = function (posX,posY,sizeX,sizeY) {
	var colL = 0;
	var colR = 0;
	var yTop = 0;
	var yBottom = 0;
	var row = 0;
	var rowHeight = 0;

	colL = this.getBlockCoords(posX-sizeX/2, posY)[1];
	colR = this.getBlockCoords(posX+sizeX/2, posY)[1];
	yTop = this.getBlockCoords(posX, posY-sizeY/2)[0];
	yBottom = this.getBlockCoords(posX, posY+sizeY/2)[0];
	//find what column The left side of the character is in 
	/*for(var j = 0; j < this.blocks[13].length; j++)
		if( (posX - sizeX/2) - X*j >= 0 && X*(j+1) - (posX - sizeX/2) >= 0){
			colL = j;
		}

	//find what column The right side of the character is in 
	for(var j = 0; j < this.blocks[13].length; j++)
		if( (posX + sizeX/2) - X*j >= 0 && X*(j+1) - (posX + sizeX/2) >= 0){
			colR = j;
		}
	*/


/*
		
	//starting point aka ground uses middle X-point as reference
	for(var i = 0; i < this.blocks.length; i++)
		if( Y*(i+1) - (posY + sizeY/2) >= 0  && (posY + sizeY/2) - Y*i >= 0){
			row = i;
		}
	//reference height of the char to see how many rows of blocks we need to check
	for(var i = 0; i < this.blocks.length; i++)
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
*/	
	var LPos ={
				xL: colL,
				xR: colR,
				yT: yTop,//rowHeight,
				yB: yBottom,//row,
				};
				
	return LPos;
}

World.prototype.findGround = function (Char) {
	var pos = Char.getPos();
	var posX = pos.posX;
	var posY = pos.posY;
	var size = Char.getSize();
	var sizeY = size.sizeY;
	var col = 0;
	var row = 0;
	var X = this.blockDim;
	var Y = this.blockDim;
	//find what column I'm in 
	for(var j = 0; j < this.blocks[13].length; j++)
		if(Math.abs(X*j - posX) <= X/2)
			col = j;
	//starting point in array to search for ground
	for(var i = 0; i < this.blocks.length; i++)
		if(Math.abs(Y*i - posY) <= Y/2)
			row = i;
		
	//Character is traweling downwards so we check for ground
	for (var i = row; i < this.blocks.length; i++) {
		if (this.blocks[i][col]) {
			return this.blocks[i][col].collide(Char, Y*i - 0.81*Y);
		}
	}
		
	//no hittable blocks were found in this column
	return 1337;
};

World.prototype.emptySpaceBelow = function (Char){
	var pos = Char.getPos();
	var posX = pos.posX;
	var posY = pos.posY;
	var size = Char.getSize();
	var sizeY = size.sizeY;
	var sizeX = size.sizeX;
	var Lpos = this.charLevelPosition(posX, posY, sizeX, sizeY);
	var fall = true;
	if(Lpos.yB < 13){
		if(this.blocks[Lpos.yB + 1][Lpos.xL]){
			if(!this.blocks[Lpos.yB + 1][Lpos.xL]._isPassable){
				fall = false;				
			}
		}
		if(this.blocks[Lpos.yB + 1][Lpos.xR]){
			if(!this.blocks[Lpos.yB + 1][Lpos.xR]._isPassable){
				fall = false;				
			}
		}
	}
	return fall;
}

World.prototype.findBlocks = function (Char, du) {
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

World.prototype.dealWithLevelCollision = function (Lpos, Lpos2, Char) {
	var lEdge = (Lpos.xL != Lpos2.xL);
	var rEdge = (Lpos.xR != Lpos2.xR);
	var tEdge = (Lpos.yT != Lpos2.yT);
	var bEdge = (Lpos.yB != Lpos2.yB);
	var height = Lpos2.yB;	
	var blockR = false;
	var blockL = false;
	var blockT = false;
	var blockB = false;
	/*
	//verður column breyting hægra meginn?
	if(rEdge){
		//skoða alla relevant kubba hægra meginn
		for(var i = Lpos.yT; i <= Lpos.yB; i++){
			if (this.blocks[i][Lpos2.xR]) {
				if(this.blocks[i][Lpos2.xR]._isPassable){
					this.blocks[i][Lpos2.xR].activate(Char,2);
				} else {
					this.blocks[i][Lpos2.xR].activate(Char,2);
					blockR = true;
				}
			}
		}
	}
	//verður column breyting vinstra meginn?
	if(lEdge){
		//skoða alla relevant kubba vinstra meginn
		for(var i = Lpos.yT; i <= Lpos.yB; i++){
			if (this.blocks[i][Lpos2.xL]) {
				if(this.blocks[i][Lpos2.xL]._isPassable){
					this.blocks[i][Lpos2.xL].activate(Char,0);
				} else {
					this.blocks[i][Lpos2.xL].activate(Char,0);
					blockL = true;
				}
			}
		}
	}
	//verður breyting í hæð uppi?
	if(tEdge){
		if(this.blocks[Lpos2.yT][Lpos.xL]){
			if(this.blocks[Lpos2.yT][Lpos.xL]._isPassable){
				this.blocks[Lpos2.yT][Lpos.xL].activate(Char,1);
			} else {
				this.blocks[Lpos2.yT][Lpos.xL].activate(Char,1);
				blockT = true;
			}
		}
		if(this.blocks[Lpos2.yT][Lpos2.xL]){
			if(!this.blocks[Lpos2.yT][Lpos2.xL]._isPassable){
				blockT = true;
			}
		}
		if(this.blocks[Lpos2.yT][Lpos.xR]){
			if(this.blocks[Lpos2.yT][Lpos.xR]._isPassable){
				this.blocks[Lpos2.yT][Lpos.xR].activate(Char,1);
			} else {
				this.blocks[Lpos2.yT][Lpos.xR].activate(Char,1);
				blockT = true;
			}
		}
		if(this.blocks[Lpos2.yT][Lpos2.xR]){
			if(!this.blocks[Lpos2.yT][Lpos2.xR]._isPassable){
				blockT = true;
			}
		}
	}
	//verður breyting í hæð niðri?
	if(bEdge){
		if(this.blocks[Lpos2.yB][Lpos.xL]){
			if(this.blocks[Lpos2.yB][Lpos.xL]._isPassable){
				this.blocks[Lpos2.yB][Lpos.xL].activate(Char,3);
			} else {
				this.blocks[Lpos2.yB][Lpos.xL].activate(Char,3);
				blockB = true;
				var height = Lpos2.yB;				
			}
		}
		if(this.blocks[Lpos2.yB][Lpos2.xL]){
			if(!this.blocks[Lpos2.yB][Lpos2.xL]._isPassable){
				blockB = true;
				height = Lpos2.yB;
			}
		}
		if(this.blocks[Lpos2.yB][Lpos.xR]){
			if(this.blocks[Lpos2.yB][Lpos.xR]._isPassable){
				this.blocks[Lpos2.yB][Lpos.xR].activate(Char,3);
			} else {
				this.blocks[Lpos2.yB][Lpos.xR].activate(Char,3);
				blockB = true;
				height = Lpos2.yB;
			}
		}
		if(this.blocks[Lpos2.yB][Lpos2.xR]){
			if(!this.blocks[Lpos2.yB][Lpos2.xR]._isPassable){
				blockB = true;
				height = Lpos2.yB;
			}
		}
	}
	//Er inní block? ef þá activatea það
	if(Lpos.yB > 0){
		if(this.blocks[Lpos.yB -1][Lpos.xL]){
			if(this.blocks[Lpos.yB-1][Lpos.xL]._isPassable){
				this.blocks[Lpos.yB-1][Lpos.xL].activate(Char,4);
			}
		} else if(this.blocks[Lpos.yB - 1][Lpos.xR]){
			if(this.blocks[Lpos.yB - 1][Lpos.xR]._isPassable){
				this.blocks[Lpos.yB - 1][Lpos.xR].activate(Char,4);
			}
		}
	}
	if(this.blocks[Lpos.yB][Lpos.xL]){
		if(this.blocks[Lpos.yB][Lpos.xL]._isPassable){
			this.blocks[Lpos.yB][Lpos.xL].activate(Char,4);
		}
	} else if(this.blocks[Lpos.yB][Lpos.xR]){
		if(this.blocks[Lpos.yB][Lpos.xR]._isPassable){
			this.blocks[Lpos.yB][Lpos.xR].activate(Char,4);
		}
	}
	
	*/
	
	
	var blocks = {
				L : blockL,
				R : blockR,
				T : blockT,
				B : blockB,
				height : height
				};
	return blocks;
};

// ================================
// BRICK World - GAME LOOP FUNCTIONS
// ================================


World.prototype.update = function (du) {
	
};

World.prototype.render = function(ctx) {
	ctx.save();
	for(var i = 0; i < this.world.length; i++) {
		for(var j = 0; j < this.world[i].length; j++) {
			var block = this.blocks[i][j];
			if(block != null) {
				var coords = this.getLocation(i,j)
				block.render(ctx, coords[0], coords[1], this.blockDim, this.blockDim);
			}
		}
	}

	ctx.restore();
}

// ======================
// VARIOUS WORLDS DEFINED
// ======================

World.prototype.Worlds =  {
	
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