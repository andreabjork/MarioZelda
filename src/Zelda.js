// ==========
// Zelda STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// A generic contructor which accepts an arbitrary descriptor object
function Zelda(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    //this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = g_sprites.marioTest;
    this._scale = 1.5;
	this.animations = makeZeldaAnimation(this._scale);
	this.animation = this.animations['idleRight'];
};

Zelda.prototype = new Character();


// Keys
Zelda.prototype.KEY_LEFT   = 37; //Left-arrow key code
Zelda.prototype.KEY_RIGHT  = 39; //Right-arrow key code
Zelda.prototype.KEY_PLUMMET = 36; //Down-arrow key code
Zelda.prototype.KEY_JUMP   = 38; //Up-arrow key code
Zelda.prototype.KEY_SPRINT = 'Z'.charCodeAt(0); // Implement method for this?
Zelda.prototype.KEY_SHOOT  = ' '.charCodeAt(0);

// Initial, inheritable, default values
Zelda.prototype.cx = 200;
Zelda.prototype.cy = 483;
Zelda.prototype.velX = 0;
Zelda.prototype.velY = 0;
Zelda.prototype.maxVelX = 3.9;
Zelda.prototype.maxVelY = 6.5;
Zelda.prototype.tempMaxJumpHeight = 0;
Zelda.prototype.maxPushHeight = 120;
// Vars for identifying Zelda actions:
Zelda.prototype.jumping = false;
Zelda.prototype.pushing = false;
Zelda.prototype.offGround = false;
Zelda.prototype.casting = false;
Zelda.prototype.status = "idleRight";
// idle, walkingRight, walkingLeft, runningRight, runningLeft, inAirRight, inAirLeft

// Sounds (should be preloaded and initialized in constructor):
// Zelda.prototype.warpSound = new Audio(
//    "sounds/ZeldaWarp.ogg");


Zelda.prototype.jump = function () {
	this.jumping = true;
    this.velY = -6;
	this.tempMaxJumpHeight = this.cy - this.maxPushHeight; 
};

Zelda.prototype.updateJump = function(roof, isTB, topBlock) {
	var groundHeight = entityManager._level[0].findGround(this); 
	
	if(this.cy >= groundHeight) {
        this.jumping = false;
        this.pushing = keys[this.KEY_JUMP];
        this.offGround = false;
        if(!(keys[this.KEY_LEFT] || keys[this.KEY_RIGHT])) this.velX = 0;
    }
	else {this.jumping = true;}
	
    if(this.cy <= this.tempMaxJumpHeight) {
        this.offGround = true;
    }
	
	if(this.cy - 42*this._scale <= roof) {
        this.velY *= -1;
		if(isTB)topBlock.activate();
    }
};

var NOMINAL_GRAVITY = 0.52;

Zelda.prototype.computeGravity = function () {
    return NOMINAL_GRAVITY;
};

Zelda.prototype.shoot = function () {

    var dX = +1;//+Math.sin(this.rotation);
    var dY = 0;//Math.cos(this.rotation);
    var launchDist = this.getRadius() * 1.2;
    
    var relVelX = dX;
    var relVelY = dY;
    entityManager.fireBullet(
       this.cx + dX * launchDist, this.cy + dY * launchDist,
       7, 0,
       0);
       

};


Zelda.prototype.takeDamage = function () {

};



var NOMINAL_FORCE = +0.15;
Zelda.prototype.updateVelocity = function(du) {
    var wasMovingRight = (this.velX > 0);
    var wasMovingLeft = (this.velX < 0);
    var movingRight = keys[this.KEY_RIGHT];
    var movingLeft = keys[this.KEY_LEFT];
    
    // Check if the Zelda in still in range of the ground
    // to be able to push of it (=> jump higher)
    if(this.jumping && !keys[this.KEY_JUMP]) {
        this.offGround = true;
    }
    this.pushing = keys[this.KEY_JUMP] && !this.offGround;
    
    // To be able to change direction in midair:
    if((movingRight && wasMovingLeft) || (movingLeft && wasMovingRight)) this.velX = 0;

    // Increase speed to the right:
    if(movingRight && this.velX < this.maxVelX) {
        this.velX += NOMINAL_FORCE*du;
    } 

    // Increase speed to the left:
    if(movingLeft && this.velX > - this.maxVelX) {
        this.velX -= NOMINAL_FORCE*du;
    }

    // Velocity is zero if we're not moving anywhere or floating in air:
    if(!this.jumping && !(movingRight || movingLeft)) {
        this.velX = 0;
    }

    // Start accelerating down as soon as we've "stopped pushing"
    if(this.jumping && !this.pushing) {
        this.velY += NOMINAL_GRAVITY*du;
    } else if(!this.jumping){
        this.velY = 0;
    }
}


Zelda.prototype.detectStatus = function() {
    var wasMovingRight = (this.velX >= 0);
    var wasMovingLeft = (this.velX < 0);

    // figure out our status
    var nextStatus = this.status;
    var dir = (this.velX >= 0)?"Right":"Left";
    var atMaxVel = (Math.abs(this.velX)>=(this.maxVelX*0.9))
    if(this.jumping) nextStatus = "inAir"+dir;
    else if(this.casting) nextStatus = "magic" + dir;
    else if(this.velX === 0 && !this.pushing) nextStatus = "idle"+(wasMovingLeft?"Left":dir);
    else if(atMaxVel && !this.pushing) nextStatus = "running"+dir;
    else if(!this.pushing) nextStatus = "walking"+dir;

    // Update animation
    if(nextStatus!==this.status){
        this.status = nextStatus;
        this.animation = this.animations[this.status];
        this.animation.reset();
    }    
}

Zelda.prototype.update = function (du) {
	spatialManager.unregister(this);
    if(!this.jumping && keys[this.KEY_JUMP]) this.jump();
    if(keys[this.KEY_SHOOT] && !this.casting) {
        this.shoot();
        this.casting = true;
    }
    
	var blocks = entityManager._level[0].findBlocks(this);
	
	
    this.updateVelocity(du);
    this.cx += this.velX*du;
    this.cy += this.velY*du;
    
    
	
    this.updateJump(blocks.top, blocks.isTB, blocks.topBlock);

    //this.wrapPosition();


    this.detectStatus();
    var animFinished = this.animation.update(du);
    if(this.casting && animFinished===1) {

        this.casting = false;
    }
	spatialManager.register(this);
};
