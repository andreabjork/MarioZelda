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
Bowser.prototype.rotation = 0;
Bowser.prototype.velX = 0;
Bowser.prototype.velY = 0;
Bowser.prototype.HP = 3;
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
			if(this.die() === "yolo") return entityManager.KILL_ME_NOW;
		//return entityManager.KILL_ME_NOW;
		
		this.rotation += this.velX / 100;
		
		//update status
		if(entityManager.giveMeZelda()){
			var posZ = entityManager.giveMeZelda().getPos();
			var dir = (((posZ.posX - this.cx)>=0)?"Right":"Left");
		}else var dir = "Left"
		
		if(this.hp <= 0) this.status = "die"+dir;
		else if(this.state['takedamage']) this.status = "takeDamage"+dir;
		else if(this.state['attacking']) this.status = "attack"+dir;
		else this.status = "idle"+dir;
		
		this.animation = this.animations[this.status];
		
		var TRANSITION_OPPORTUNITY = Animation.prototype.TRANSITION_OPPORTUNITY;
		var ANIMATION_STATUS = this.animation.update(du);
		if(ANIMATION_STATUS === TRANSITION_OPPORTUNITY){
			this.state['takedamage'] = false;
			this.state['attacking'] = false;
		}
		
		this.handleSpecificEnemyAction(du);
		
		spatialManager.register(this);
	}
}

Bowser.prototype.cast = function () {
	if(entityManager.giveMeZelda() && this.velX === 0){
		this.state['attacking'] = true;
		var posZ = entityManager.giveMeZelda().getPos();
		var velX = (posZ.posX - this.cx)/100;
		var velY = (posZ.posY - (this.cy))/45;
		if(velY > -1.5) velY = -1.5;
		if(velY < -4.2) velY = -4.2;
		if(velX < -1.7) velX = -1.7;
		if(velX > 1.2) velX = 1.2;
		util.play(g_audio.patRedB);
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
	if(this.shotCoolDown <= 0) {
		this.cast();
		this.shotCoolDown = 250;
	}
}

Bowser.prototype.takeHit = function() {
	if(entityManager.giveMeZelda()){
		var posZ = entityManager.giveMeZelda().getPos();
		var temp = (posZ.posX - this.cx);
		if(temp > 0) {this.HP--; this.state['takedamage'] = true;}
		else util.play(g_audio.patClown);
		if(this.HP <= 0) {this._isDeadNow = true; this.state['die'] = true; }
	}
}

//Bowser collission logic
Bowser.prototype.handleCollision = function(hitEntity, axis) {

        if(hitEntity instanceof Block){
            hitEntity.tryToBreak();
        } else if(hitEntity instanceof Zelda) {
            
        }
    
    return {standingOnSomething: false, walkingIntoSomething: false};
}