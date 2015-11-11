// ==========
// Character STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// A generic contructor which accepts an arbitrary descriptor object
function Enemy(descr) {
	this.setup(descr)

    // Default sprite, if not otherwise specified
    this.sprite = g_sprites.marioTest;
    this._scale = 1;
	this.animations = makeZeldaAnimation(this._scale);
	this.animation = this.animations['idleRight'];
};

// This comes later on when Entity has been implemented: 
Enemy.prototype = new Character();

// Initial, inheritable, default values
Enemy.prototype.cx = 500;
Enemy.prototype.cy = 483;
Enemy.prototype.velX = -1;
Enemy.prototype.velY = 0;
Enemy.prototype.HP = 1;
Enemy.prototype.inAir = true;
Enemy.prototype.initialized = false;


Enemy.prototype.update = function(du) {
	spatialManager.unregister(this);

	var blocks = entityManager._level[0].findBlocks(this, du);
    
	if(this.velX > 0)
		if(!blocks.R) 
			this.cx += this.velX*du;
		else
			this.velX *= -1;
	else
		if(!blocks.L) 
			this.cx += this.velX*du;
		else
			this.velX *= -1;
	if(this.inAir){
		if(!blocks.B){
			this.cy += this.velY*du;
			this.velY = this.velY*1.1 + 0.1;
		} else {
			this.velY = 0;
			this.inAir = false;
			this.cy = blocks.height*(g_canvas.height/14)-this.getSize().sizeY/2 - 1;
		}
	}
	
    if(this.isColliding()) {
    }
	
	if(entityManager._level[0].emtySpaceBelow(this)){
		this.inAir = true;	
	}
	
	if(this.cy > g_canvas.height){
		this._isDeadNow = true;
	}
	
	if(this._isDeadNow){ 
						return entityManager.KILL_ME_NOW;
						console.log("wow, you killed a basic unit. so impressed...");
	}
	

	spatialManager.register(this);

}
