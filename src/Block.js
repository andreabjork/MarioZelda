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
	this.sprite = this.Asprite || g_sprites.defaultBlock;
	this.AnimationSprite = this.AnimationSprite || g_sprites.coin;

	switch(this.type) {
		case 0: 
		break;
		case 1: this._isBreakable = true;
		break;
		case 2: this.sprite = g_sprites.spikes;
				this.scale *= 0.9;
		break;
		case 3: this.sprite = g_sprites.coinBox;
				this.ammo = 5;
		break;
		case 4: this.sprite = g_sprites.water;
				this._isPassable = true;
		break;
		case 5: this.sprite = g_sprites.ground;
		break; 
		case 6: this.sprite = g_sprites.dungeon;
		break; 
		case 7: this.sprite = g_sprites.coin;
				this._isPassable = true;
				this.ammo = 1;
		break;
		
		default: this._isBreakable = true;
				 this._isPassable = true;
				 this.sprite = g_sprites.blank;
		break;
	}
};

Block.prototype._isDeadNow = false;
Block.prototype._isBreakable = false;
Block.prototype._isPassable = false;
Block.prototype._inWater = false;
Block.prototype._makeAnimation = false;
Block.prototype._AnimationCounter = 0;
Block.prototype.ammmo = 0;
Block.prototype.dim = g_canvas.height/14;

Block.prototype = new Entity();

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
	if(this.inWater) g_sprites.water.drawCentredAt(ctx,x+w/2,y+h/2);
	this.sprite.drawCentredAt(ctx,x+w/2,y+h/2);
	
};

Block.prototype.activate = function (Char, direction) {
    if(direction === 1){
		this.tryToBreak();
	}
	if(this.type === 2){
		if(Char instanceof Zelda) Char.takeHit();
	}
	if(this.type === 3 && direction === 1 && this.ammo > 0){
		this._makeAnimation = true;
		this._AnimationCounter = 0;
		g_score.update(50);
		g_audio.coin.pause();
		g_audio.coin.currentTime = 0;
		g_audio.coin.play();
		this.ammo--;
	}
	if(this.type === 4) {// && direction === 4){
		Char.state.inWater = true;
	} 
	
	if(this.type === 7 && Char instanceof Zelda) {
		if(this.ammo > 0) {
			g_score.update(50);
			g_audio.coin.pause();
			g_audio.coin.currentTime = 0;
			g_audio.coin.play();
		} else this.sprite = g_sprites.blank;
		this.ammo--;
	}
};


Block.prototype.collide = function ( Char , hitValue) {
    // this function is to let blocks interact with characters, f.ex. water/spikes
	// if they are just solid and collidable return the top value, and if not,
	// interact with character and then return (will finish description when this is ready)stuff stuff
	return hitValue;
};

Block.prototype.tryToBreak = function(){
	console.log("trying to break");
    if(this._isBreakable) {
    	console.log("breaking!");
		this._isDeadNow = true;
		g_score.update(10);
		g_audio.brick.pause();
		g_audio.brick.currentTime = 0;
		g_audio.brick.play();
	}
}