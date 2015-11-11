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
    this.world = this.Worlds[1];

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
	// Note that if the following condition holds for x:
	// startingX + n*width < x < startingX + (n+1)*width
	// then x resides in column n of the grid, starting from 0.
	// Solving, we get: n < (x-startingX)/width but n > (x-startingX)/width - 1.
	// In other words, n = Math.floor((x-startingX/width)) is the column index.
	// Same holds for y for getting row index.
	var halfW = zelda.getSize().sizeX;
	var halfH = zelda.getSize().sizeY;

	var prevCoords = this.getBlockCoords(prevX,prevY);
	
	var newCoords = this.getBlockCoords(nextX,nextY);

	var row = newCoords[0]-2;
	var col = newCoords[1]-1;
	var collidingBlocks = [];
	var collidingCoords = [];
	for(var i = 0; i < 4; i++) {
		collidingBlocks[i] = [];
		collidingCoords[i] = [];
		for(var j = 0; j < 3; j++) {
			collidingBlocks[i][j] = this.blocks[row+i][col+j]
			var coords = this.getLocation(row+i, col+j);
			collidingCoords[i][j] = [coords[0]+this.blockDim/2, coords[1]+this.blockDim/2];
		}
	}

	return {blocks: collidingBlocks, coords: collidingCoords};
};

World.prototype.getCollisionBlocks = function(zelda, prev) {

}

// ================================
// BRICK World - GAME LOOP FUNCTIONS
// ================================


World.prototype.update = function (du) {
	spatialManager.unregister(this);
	//this.width = this.blockDim*this.blocks[13].length;

	spatialManager.register(this);
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
	
	1 : [
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
};		