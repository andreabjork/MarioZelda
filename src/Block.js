// ====
// Block
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Block(descr) {
	this.setup(descr);
	this.sprite = this.sprite || g_sprites.defaultBlock;


	switch(this.type) {
		case 0: 
		break;
		case 2: this.sprite = g_sprites.spikes
		break;
		case 3: this.sprite = g_sprites.coinBox;
		break;
		case 4: this.sprite = g_sprites.water;
		this._isPassable = true;
		break;
		case 5: this.sprite = g_sprites.ground;
		break; 
		case 6: this.sprite = g_sprites.dungeon;
		break; 
		case 'a':  entityManager.generateEnemy({cx: this.cx, cy: this.cy})
		break;
		case 'default': this._isBreakable = true;
		break;
	}
};
Block.prototype._isDeadNow = false;
Block.prototype._isBreakable = false;
Block.prototype._isPassable = false;
Block.prototype.dim = g_canvas.height/14;

Block.prototype = new Entity();

Block.prototype.update = function (du) {
	return this._isDeadNow;
};


Block.prototype.render = function (ctx,x,y,w,h) {
    var img_h = this.sprite.height;
	var scale = h/img_h;
	this.sprite.scale = scale;
	this.sprite.drawCentredAt(ctx,x+w/2,y+h/2);
};

Block.prototype.activate = function (Char) {
	if(direction === 1){
		//try to break blocks hit from below
	this.tryToBreak();
	}
	if(this.type === 2){
		//hit by spikes
		Char.takeHit();
	}
	if(this.type === 3 && direction === 1){
		// $.$
		console.log("get money");
	}
	if(this.type === 4 && direction === 4){
		//is in water
		Char.tempMaxJumpHeight = Char.cy - Char.maxPushHeight/5;
        Char.velX *= 0.9;
		Char.velY *= 0.9;
		if(keys[Char.KEY_JUMP])
		Char.velY = -1;
	}
};


Block.prototype.collide = function ( Char , hitValue) {
    // this function is to let blocks interact with characters, f.ex. water/spikes
	// if they are just solid and collidable return the top value, and if not,
	// interact with character and then return (will finish description when this is ready)stuff stuff
		return hitValue;
};

Block.prototype.tryToBreak = function(){
    if(this._isBreakable) this._isDeadNow = true;
}
