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
function Zelda(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    //this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = g_sprites.marioTest;
    this._scale = 1.5;
	makeZeldaAnimation(this._scale);
    this.animation = g_animations.zelda.idleRight;
};

Zelda.prototype = new Character();


// Keys
Character.prototype.KEY_LEFT   = 37; //Left-arrow key code
Character.prototype.KEY_RIGHT  = 39; //Right-arrow key code
Character.prototype.KEY_PLUMMET = 36; //Down-arrow key code
Character.prototype.KEY_JUMP   = 38; //Up-arrow key code
Character.prototype.KEY_SPRINT = 'Z'.charCodeAt(0); // Implement method for this?
Character.prototype.KEY_SHOOT  = ' '.charCodeAt(0);

// Initial, inheritable, default values
Character.prototype.cx = 200;
Character.prototype.cy = 483;
Character.prototype.velX = 0;
Character.prototype.velY = 0;
Character.prototype.maxVelX = 3.9;
Character.prototype.maxVelY = 6.5;
Character.prototype.tempMaxJumpHeight = 0;
Character.prototype.maxPushHeight = 120;
// Vars for identifying character actions:
Character.prototype.jumping = false;
Character.prototype.pushing = false;
Character.prototype.offGround = false;
Character.prototype.casting = false;
Character.prototype.status = "idleRight";
// idle, walkingRight, walkingLeft, runningRight, runningLeft, inAirRight, inAirLeft

// Sounds (should be preloaded and initialized in constructor):
// Character.prototype.warpSound = new Audio(
//    "sounds/CharacterWarp.ogg");


Character.prototype.jump = function () {
	this.jumping = true;
    this.velY = -6;
	this.tempMaxJumpHeight = this.cy - this.maxPushHeight; 
};

Character.prototype.updateJump = function(roof, isTB, topBlock) {
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

Character.prototype.computeGravity = function () {
    return NOMINAL_GRAVITY;
};

Character.prototype.shoot = function () {

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


Character.prototype.takeDamage = function () {

};



var NOMINAL_FORCE = +0.15;
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
        this.animation = g_animations.zelda[this.status];
        this.animation.reset();
    }    
}

Character.prototype.update = function (du) {
	spatialManager.unregister(this);
    if(!this.jumping && keys[this.KEY_JUMP]) this.jump();
    if(keys[this.KEY_SHOOT] && !this.casting) {
        this.shoot();
        this.casting = true;
    }
    
	var blocks = entityManager._level[0].findBlocks(this);
	
	
    this.updateVelocity(du);
    if (this.velX < 0) {
        if (entityManager._level[0].center.cx >= 0) {
            if (this.cx > 25 && !blocks.left) {
                this.cx += this.velX*du;
            } 
        } else {
            if (this.cx > 200 && !blocks.left) {
                this.cx += this.velX*du;
            }
        }
    }  else if (this.velX > 0) {
        if (entityManager._level[0].center.cx <= entityManager._level[0].Blocks[13].length*(-X)+g_canvas.width) {
            if (this.cx < g_canvas.width-25 && !blocks.right) {
                this.cx += this.velX*du;
            }
        } else if (this.cx < 400 && !blocks.right) {
            this.cx += this.velX*du;
        }
    }
    var nextY = this.cy + this.velY*du
    if (nextY < 100) {
        this.cy = 100;
    } else if (!(nextY < 100 && this.velY < 0)) {
        this.cy = nextY;
    }
    
    
	
    this.updateJump(blocks.top, blocks.isTB, blocks.topBlock);

    this.wrapPosition();


    this.detectStatus();
    var animFinished = this.animation.update(du);
    if(this.casting && animFinished===1) {

        this.casting = false;
    }
	spatialManager.register(this);
};
