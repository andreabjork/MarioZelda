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
function Bowser(descr) {
	this.setup(descr)
    // Default sprite, if not otherwise specified
    this._scale = 1;
	this.animations = makeBowserAnimation(this._scale);
	this.animation = this.animations['idle'];
};

// This comes later on when Entity has been implemented: 
Bowser.prototype = new Character();

// Initial, inheritable, default values
Bowser.prototype.cx = 500;
Bowser.prototype.cy = 483;
Bowser.prototype.velX = 0;
Bowser.prototype.velY = 0;
Bowser.prototype.HP = 10;
Bowser.prototype.teljari = 200;
Bowser.prototype.initialized = false;
Bowser.prototype.startBattle = false;
Bowser.prototype.state = {
	idle: false,
	attacking: false,
	die: true,
	takeDamage: false
};


Bowser.prototype.update = function(du) {
	//check if this is inside the viewport
	var margin = this.getSize().sizeX; //margin outside of viewport we want to update
	if(!(this.cx+this.getSize().sizeX/2 < g_viewPort.x-margin ||
	   this.cx-this.getSize().sizeX/2 > g_viewPort.x+g_canvas.width+margin)) this.startBattle = true;

	if(this.startBattle){
		spatialManager.unregister(this);
		
		this.updateProxBlocks(this.cx, this.cy, this.cx+this.velX*du, this.cy+this.velY*du);
		
		
		var nextX = this.cx+this.velX*du;
		var prevX = this.cx;
		var nextY = this.cy;
		var prevY = this.cy;
	
		
		//check left/right collisions first and then top/bottomx
		var walkingIntoSomething = this.handlePartialCollision(nextX,prevY,"x");
		// update location
		this.cx += this.velX*du;
	
		// Check for death:
		//if(this._isDeadNow) this.Die(); //return entityManager.KILL_ME_NOW;
	
		//update status
		var dir;
		if(this.velX === 0) dir = this._lastDir || "Right";
		else{
			dir = (this.velX > 0 ? "Right" : "Left");
			this._lastDir = dir;
		}
		this.teljari--;
		if(this.teljari< 0) this.status = "idle"+dir;
		else this.status = "takeDamage"+dir;
		if(this.teljari < -200) this.teljari = 200;
		
		this.animation = this.animations[this.status];
	
		this.animation.update(du);
	
		spatialManager.register(this);
	}
}



Bowser.prototype.getSize = function(){
    var size = {sizeX:140*this._scale,sizeY:140*this._scale};
    return size;
}
