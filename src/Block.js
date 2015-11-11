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
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
	this.sprite = this.sprite || g_sprites.defaultBlock;
};
Block.prototype._isDeadNow = false;
Block.prototype._isBreakable = false;
Block.prototype._isPassable = false;



Block.prototype.update = function (du) {
	if(this._isDeadNow) return true;
	else return false;
};


Block.prototype.render = function (ctx,x,y,w,h) {
    var img_h = this.sprite.height;
	var scale = h/img_h;
	this.sprite.scale = scale;
	this.sprite.drawCentredAt(ctx,x+w/2,y+h/2);
};

Block.prototype.activate = function (Char, direction) {
    if(direction === 1){
	this.tryToBreak();
	}
	if(this.type === 2){
	console.log("take damage by these scary spikes or smt like dat...");
	Char.takeHit();
	}
	if(this.type === 3 && direction === 1){
		console.log("get money");
	}
	if(this.type === 4 && direction === 4){
		console.log("le swimming");
		Char.tempMaxJumpHeight = Char.cy - Char.maxPushHeight/5;
        this.offGround = false;		
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
