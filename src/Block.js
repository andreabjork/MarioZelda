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
	this.AnimationSprite = this.AnimationSprite || g_sprites.coin;
};
Block.prototype._isDeadNow = false;
Block.prototype._isBreakable = false;
Block.prototype._isPassable = false;
Block.prototype._makeAnimation = false;
Block.prototype._AnimationCounter = 0;
Block.prototype.ammmo = 0;

Block.prototype.update = function (du) {
	if(this._isDeadNow) return true;
	else return false;
};


Block.prototype.render = function (ctx,x,y,w,h) {
    if(this._makeAnimation){
			var animationLength = 10;
			g_ctx.globalAlpha = 1 - 0.5*(this._AnimationCounter/animationLength) ;
			this.AnimationSprite.drawCentredAt(ctx, x+w/2,
										y+ h/2 - (this._AnimationCounter) * ((g_canvas.height/14)/(animationLength/1.6)));
			g_ctx.globalAlpha = 1;
			this._AnimationCounter++;
			if(this._AnimationCounter >= animationLength)
				this._makeAnimation = false;
	}
	var img_h = this.sprite.height;
	var scale = h/img_h;
	this.sprite.scale = scale;
	this.sprite.drawCentredAt(ctx,x+w/2,y+h/2);
	
};

Block.prototype.activate = function (Char, direction) {
    if(direction === 1){
		//try to break blocks hit from below
	this.tryToBreak();
	}
	if(this.type === 2){
		//hit by spikes
	Char.takeHit();
	}
	if(this.type === 3 && direction === 1 && this.ammo > 0){
		// $.$
		this._makeAnimation = true;
		this._AnimationCounter = 0;
		g_score.update(20);
		this.ammo--;
		/*
		var blockAbove = entityManager._level[0].Blocks[this.i-1][this.j];
		if (!blockAbove) {
			entityManager._level[0].Blocks[this.i-1][this.j] = new Block({
				type : 7,
				sprite : g_sprites.coin,
				_isPassable : true
			});
		}
		*/
		
	}
	if(this.type === 4 && direction === 4){
		//is in water
		Char.inWater = true;
		/*
		if(keys[Char.KEY_JUMP]){
			var temp = false;
			var blockAbove = entityManager._level[0].Blocks[this.i-1][this.j];
			if(!blockAbove) temp = true;
			if(blockAbove){
				if(blockAbove.type === 4) temp = true;
				console.log(blockAbove.type);
			}
			if (temp) 
				Char.velY = -1;
		}
		*/
	} 
	
	if(this.type === 7 && Char.name === 'zelda') {
		this._isDeadNow = true;
		g_score.update(50);
	}
};


Block.prototype.collide = function ( Char , hitValue) {
    // this function is to let blocks interact with characters, f.ex. water/spikes
	// if they are just solid and collidable return the top value, and if not,
	// interact with character and then return (will finish description when this is ready)stuff stuff
		return hitValue;
};

Block.prototype.tryToBreak = function(){
    if(this._isBreakable) {
		this._isDeadNow = true;
		g_score.update(10);
	}
}
