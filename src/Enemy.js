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
    this._scale = 2.5;
	this.animations = makeEnemyAnimation(this._scale);
	this.animation = this.animations['walkingRight'];
};

// This comes later on when Entity has been implemented: 
Enemy.prototype = new Character();

// Initial, inheritable, default values
Enemy.prototype.cx = 500;
Enemy.prototype.cy = 483;
Enemy.prototype.velX = -1;
Enemy.prototype.velY = 1;
Enemy.prototype.HP = 1;
Enemy.prototype.initialized = false;
Enemy.prototype.state = {
jumping: false,
offGround: false,
onGround: true,
inWater: false
};

Enemy.prototype.update = function(du) {
	spatialManager.unregister(this);
	
	//check if this is inside the viewport
	var margin = this.getSize().sizeX; //margin outside of viewport we want to update
	if(this.cx+this.getSize().sizeX/2 < g_viewPort.x-margin ||
	   this.cx-this.getSize().sizeX/2 > g_viewPort.x+g_canvas.width+margin) return;

	//Handles if enemy is in water
    if(this.state['inWater']){
        this.maxVelX = 2.3;
        this.maxVelY = 1.1;
    }else {
        this.maxVelX = 3.9;
        this.maxVelY = 6.5;
    }
	
	this.updateProxBlocks(this.cx, this.cy, this.cx+this.velX*du, this.cy+this.velY*du);
	
	var nextX = this.cx+this.velX*du;
    var nextY = this.cy+this.velY*du;
	var prevX = this.cx;
    var prevY = this.cy;
	
    this.state['inWater'] = false;
	
	//check left/right collisions first and then top/bottomx
    var walkingIntoSomething = this.handlePartialCollision(nextX,prevY,"x");
	var standingOnSomething = this.handlePartialCollision(prevX,nextY,"y");
	// update location
    this.cx += this.velX*du;
    this.cy += this.velY*du;
	
	// Fall down
	if(!standingOnSomething && this.velY < TERMINAL_VELOCITY && !this.state['inWater']){
		this.velY += NOMINAL_GRAVITY*du;
	}
	
	if(this.state['inWater'] && standingOnSomething) this.velY = -1;
	// Turn around
	if(walkingIntoSomething){
		this.velX *= -1;
	}
	
	if(this.cy > g_canvas.height){
        this._isDeadNow = true;
    }
	
    // Check for death:
    if(this._isDeadNow) {
		return entityManager.KILL_ME_NOW;
	}
	
	//update status
	var dir;
	if(this.velX === 0) dir = this._lastDir || "Right";
	else{
		dir = (this.velX > 0 ? "Right" : "Left");
		this._lastDir = dir;
	}
	if(this.velY !== 0 && !this.state['inWater']) this.status = "inAir"+dir;
	else if(this.state.inWater) this.status = "swimming"+dir;
	else this.status = "walking"+dir;
	
	this.animation = this.animations[this.status];
	
	this.animation.update(du);
	
	
	spatialManager.register(this);
}



Enemy.prototype.getSize = function(){
    var size = {sizeX:10*this._scale,sizeY:15*this._scale};
    return size;
}
