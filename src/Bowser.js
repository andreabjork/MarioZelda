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
	this.animation = this.animations['idleRight'];
};

// This comes later on when Entity has been implemented: 
Bowser.prototype = new Enemy();

// Initial, inheritable, default values
Bowser.prototype.cx = 500;
Bowser.prototype.cy = 483;
Bowser.prototype.velX = 0;
Bowser.prototype.velY = 0;
Bowser.prototype.HP = 1;
Bowser.prototype.teljari = 200;
Bowser.prototype.shotCoolDown = 100;
Bowser.prototype.animationTeljari = 80;
Bowser.prototype.initialized = false;
Bowser.prototype.startBattle = false;
Bowser.prototype.state = {
	idle: true,
	attacking: false,
	die: true,
	takeDamage: false,
	inWater: false
};


Bowser.prototype.update = function(du) {
	//check if this is inside the viewport
	var margin = this.getSize().sizeX; //margin outside of viewport we want to update
	if(!(this.cx+this.getSize().sizeX/2 < g_viewPort.x-margin ||
	   this.cx-this.getSize().sizeX/2 > g_viewPort.x+ g_canvas.width + margin)) this.startBattle = true;

	if(this.startBattle){
		spatialManager.unregister(this);
		
		this.updateProxBlocks(this.cx, this.cy, this.cx+this.velX*du, this.cy+this.velY*du);
		
		var nextX = this.cx + this.velX*du;
		var prevX = this.cx;
		var nextY = this.cy;
		var prevY = this.cy;
	
		
		//check left/right collisions first and then top/bottomx
		var walkingIntoSomething = this.handlePartialCollision(nextX,prevY,"x");
		var standingOnSomething = this.handlePartialCollision(prevX,nextY,"y");
	
		// update location
		this.cx += this.velX*du;
	
		// Check for death:
		if(this._isDeadNow) 
			if(this.die() === "yolo") this.kill();
		//return entityManager.KILL_ME_NOW;
	
		//update status
		var dir;
		if(this.velX === 0) dir = this._lastDir || "Right";
		else{
			dir = (this.velX > 0 ? "Right" : "Left");
			this._lastDir = dir;
		}
		this.teljari--;
		if(this._isDeadNow) this.status = "die"+dir;
		else if(this.teljari< 0) this.status = "idle"+dir;
		else this.status = "takeDamage"+dir;
		if(this.teljari < -200) this.teljari = 0;
		
		this.animation = this.animations[this.status];
	
		this.animation.update(du);
		
		this.handleSpecificEnemyAction(du);
		
		spatialManager.register(this);
	}
}

Bowser.prototype.cast = function () {
	if(entityManager.giveMeZelda()){
		this.state['attacking'] = true;
		var posZ = entityManager.giveMeZelda().getPos();
		var velX = (posZ.posX - this.cx)/100;
		var velY = (posZ.posY - (this.cy))/50;
		if(velY > -1) velY = -1;
		if(velY < -3.5) velY = -3.5;
		if(velX < -1.7) velX = -1.7;
		if(velX > 1.2) velX = 1.2;
		entityManager.fireRedBull(
			this.cx, this.cy,
			velX, velY,
			0, this);
	}
};

Bowser.prototype.die = function(){
	this._isDeadNow = false;
	this.velX = 10;
	if(this.animationTeljari < 0) return "yolo";
    else {this.animationTeljari--; return "pleb";}
}

Bowser.prototype.getSize = function(){
    var size = {sizeX:140*this._scale,sizeY:140*this._scale};
    return size;
}

Bowser.prototype.handleSpecificEnemyAction = function(du) {
	this.shotCoolDown -= du;
	console.log("step0");
	if(this.shotCoolDown <= 0) {
		this.cast();
		this.shotCoolDown = 250;
	}
}

//Bowser collission logic
Bowser.prototype.handleCollision = function(hitEntity, axis) {

        if(hitEntity instanceof Block){
            hitEntity.tryToBreak();
        } else if(hitEntity instanceof Zelda) {
            if(!this._isDeadNow) hitEntity.takeHit();
        }
    
    return {standingOnSomething: false, walkingIntoSomething: false};
}