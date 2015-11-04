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
function Character(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    //this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = g_sprites.marioTest;
    this._scale = 1.3;
	makeZeldaAnimation(this._scale);
    this._isAlive = true;
    this.animation = g_animations.zelda.idleRight;
};
// This comes later on when Entity has been implemented: 
Character.prototype = new Entity();

Character.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
};

// Keys
Character.prototype.KEY_LEFT   = 37; //Left-arrow key code
Character.prototype.KEY_RIGHT  = 39; //Right-arrow key code
Character.prototype.KEY_PLUMMET = 36; //Down-arrow key code
Character.prototype.KEY_JUMP   = 38; //Up-arrow key code
Character.prototype.KEY_JAB = 'Z'.charCodeAt(0); // Implement method for this?
Character.prototype.KEY_SHOOT  = 'X'.charCodeAt(0);

// Initial, inheritable, default values
Character.prototype.cx = 200;
Character.prototype.cy = 400;
Character.prototype.velX = 0;
Character.prototype.velY = 0;
Character.prototype.maxVelX = 7;
Character.prototype.maxVelY = 7;
Character.prototype.startingHeight = 400;
Character.prototype.maxPushHeight = 120;
// These types are to detect whether a) character is actually in air
// and b) whether character is pushing off of the ground. As in original
// mario, character can push 'longer' to jump higher and 
// c) whether the character has exceeded his "push" and can therefore not
// continue pushing in midair.
Character.prototype.jumping = false;
Character.prototype.pushing = false;
Character.prototype.offGround = false;

Character.prototype.status = "idleRight";
// idle, walkingRight, walkingLeft, runningRight, runningLeft, inAirRight, inAirLeft

// Sounds (should be preloaded and initialized in constructor):
// Character.prototype.warpSound = new Audio(
//    "sounds/CharacterWarp.ogg");


Character.prototype.jump = function () {
	this.jumping = true;
    this.velY = -3;
};

Character.prototype.updateJump = function() {
	if(this.cy >= this.startingHeight) {
        this.jumping = false;
        this.pushing = false;
        this.offGround = false;
    }
    if(this.cy <= this.startingHeight-this.maxPushHeight) {
        console.log("Character is OFF GROUND!");
        this.offGround = true;
    }

};

var NOMINAL_GRAVITY = 0.12;

Character.prototype.computeGravity = function () {
    return NOMINAL_GRAVITY;
};

Character.prototype.shoot = function () {
    if (keys[this.KEY_FIRE]) {
    
        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.2;
        
        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBullet(
           this.cx + dX * launchDist, this.cy + dY * launchDist,
           this.velX + relVelX, this.velY + relVelY,
           this.rotation);
           
    }
};

Character.prototype.takeDamage = function () {

};

Character.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
};

var NOMINAL_FORCE = +0.2;
Character.prototype.updateVelocity = function(du) {
    var wasMovingRight = (this.velX > 0);
    var wasMovingLeft = (this.velX < 0);
    var movingRight = keys[this.KEY_RIGHT];
    var movingLeft = keys[this.KEY_LEFT];
    
    // Check if the character in still in range of the ground
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


Character.prototype.detectStatus = function() {
    var wasMovingRight = (this.velX >= 0);
    var wasMovingLeft = (this.velY < 0);

    // figure out our status
    var nextStatus = null;
    var dir = (this.velX >= 0)?"Right":"Left";
    var atMaxVel = (Math.abs(this.velX)>=(this.maxVelX*0.9))
    if(this.jumping) nextStatus = "inAir"+dir;
    else if(this.velX === 0) nextStatus = "idle"+(wasMovingLeft?"Left":dir);
    else if(atMaxVel) nextStatus = "running"+dir;
    else nextStatus = "walking"+dir;

    // Update animation
    if(nextStatus!==this.status){
        this.status = nextStatus;
        this.animation = g_animations.zelda[this.status];
        this.animation.reset();
    }    
}

Character.prototype.update = function (du) {
    if(!this.jumping && keys[this.KEY_JUMP]) this.jump();

    this.updateVelocity(du);
    this.cx += this.velX*du;
    this.cy += this.velY*du;
    
    this.updateJump(du);

    this.wrapPosition();


    this.detectStatus();
    this.animation.update(du);
};

Character.prototype.render = function (ctx) {
        this.animation.renderAt(ctx, this.cx, this.cy);
};
