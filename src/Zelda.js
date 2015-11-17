// =============
//    ZELDA
// =============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// ===============
// ZELDA PROTOTYPE
// ===============


// A generic contructor which accepts an arbitrary descriptor object
function Zelda(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);

    // Default sprite, if not otherwise specified
    this.sprite = g_sprites.marioTest;
    this._scale = 1.5;
	this.animations = makeZeldaAnimation(this._scale);
	this.animation = this.animations['idleRight'];
};

// INHERIT FROM CHARACTER:
Zelda.prototype = new Character();


// Keys
Zelda.prototype.KEY_LEFT   = 37; //Left-arrow key code
Zelda.prototype.KEY_RIGHT  = 39; //Right-arrow key code
Zelda.prototype.KEY_PLUMMET = 36; //Down-arrow key code
Zelda.prototype.KEY_JUMP   = 38; //Up-arrow key code
Zelda.prototype.KEY_SPRINT = 'Z'.charCodeAt(0); // Implement method for this?
Zelda.prototype.KEY_CAST  = ' '.charCodeAt(0);

// Initial, inheritable, default values
Zelda.prototype.cx = 200;
Zelda.prototype.cy = 400;
Zelda.prototype.velX = 0;
Zelda.prototype.velY = 0;
Zelda.prototype.HP = 1;
Zelda.prototype.maxVelX = 3.9;
Zelda.prototype.maxVelY = 6.5;
Zelda.prototype.tempMaxJumpHeight = 0;
Zelda.prototype.maxPushHeight = 120;
Zelda.prototype.state = {jumping: false, pushing: false, offGround: false, casting: false, onGround: true, idle: true, right: true, left: false, inWater: false}
Zelda.prototype.status = "idleRight";
// idle, walkingRight, walkingLeft, runningRight, runningLeft, inAirRight, inAirLeft

// ===============
// ZELDA ABILITIES
// ===============


Zelda.prototype.handleJump = function () {
    if(this.state['jumping'] && !this.state['inWater']) { return; }
    else if(this.state['inWater']) {
        this.velY = -1; 
        this.tempMaxJumpHeight = this.cy - 1;
        this.state['jumping'] = true;
    } else {
    	this.state['jumping'] = true;
        this.velY = -6;
    	this.tempMaxJumpHeight = this.cy - this.maxPushHeight; 
    }
};

Zelda.prototype.handleCasting = function () {
    if(this.state['casting']) return;
    else {
        this.state['casting'] = true;
        var dX = +1;//+Math.sin(this.rotation);
        var dY = 0;//Math.cos(this.rotation);
        var launchDist = this.getSize().sizeX * 1.2;
        
        var relVelX = dX;
        var relVelY = dY;
        entityManager.fireBullet(
           this.cx + dX * launchDist, this.cy + dY * launchDist,
           7, 0,
           0);
    }
};

// =====================
// ZELDA COLLISION LOGIC
// =====================

Zelda.prototype.handleEnemyCollision = function() {
    if(this.isColliding()) {
        var hitEntity = this.findHitEntity();
        // naive collision check, will do it better later 
        // once collision for tiles has been done correctly
        var entPos = hitEntity.getPos();
        var entSize = hitEntity.getSize();
        var entityLeft = entPos.posX-entSize.sizeX;
        var entityRight = entPos.posX+entSize.sizeX;
        if(this.cx-this.getSize().sizeX < entityRight && this.cx+this.getSize().sizeX > entityLeft) {
            hitEntity.takeHit();
        }else {
            this.takeHit();
        }
    }
}

Zelda.prototype.handleBoxCollision = function(prevX, prevY, nextX, nextY) {
    this.unregisterBlocks();
    this.findProxBlocks(prevX, prevY, nextX, nextY);
    this.registerBlocks();
}


Zelda.prototype.handleCollisions = function(prevX, prevY, nextX, nextY) {

        /*var hitEntity = this.findHitEntity();
        var canTakeHit = hitEntity.takeHit;
        if (canTakeHit){ 
            canTakeHit.call(hitEntity);
            this.velY = -9;
        }*/

    this.handleEnemyCollision();
    this.handleBoxCollision(prevX, prevY, nextX, nextY);
}


Zelda.prototype.handlePartialCollision = function(nextX,nextY,axis){
    var bEdge,lEdge,rEdge,tEdge;
    var standingOnSomething = false;
    if(this.isColliding(nextX, nextY)) {
        var hitEntities = this.findHitEntities(nextX, nextY);
        for(var hit in hitEntities) {
            var hitEntity = hitEntities[hit];
            if(hitEntity instanceof Block) {
                var zeldaCoords = entityManager._world[0].getBlockCoords(this.cx, this.cy); //This is going by zelda's center, which is her lower half. Upper half needs to be in i, j-1.
                var zeldaCoordsLeft = entityManager._world[0].getBlockCoords(this.cx-this.getSize().sizeX/2, this.cy); //This is going by zelda's center, which is her lower half. Upper half needs to be in i, j-1.
                var zeldaCoordsRight = entityManager._world[0].getBlockCoords(this.cx+this.getSize().sizeX/2, this.cy); //This is going by zelda's center, which is her lower half. Upper half needs to be in i, j-1.
                var hitCoords = [hitEntity.i, hitEntity.j];

                var zeldaAbove = (hitCoords[0] > zeldaCoords[0]); // zelda block coordinates lower because y-axis points down.
                var zeldaBelow = (hitCoords[0] < zeldaCoords[0]);
                var zeldaToLeft = (hitCoords[1] > zeldaCoords[1]); // zelda column coords must be lower.
                var zeldaToRight = (hitCoords[1] < zeldaCoords[1]);
                var sameCol = (hitCoords[1] == zeldaCoordsLeft[1] || hitCoords[1] == zeldaCoordsRight[1]);
                var sameRow = (hitCoords[0] == zeldaCoords[0] || hitCoords[0] == zeldaCoords[0]-1) || this.state['jumping'];

                //var lEdge = (hitCoords[1] < zeldaCoords[1] && (hitCoords[0] == zeldaCoords[0] || hitCoords[0] == zeldaCoords[0]-1) );
                //var rEdge = (hitCoords[1] > zeldaCoords[1] && (hitCoords[0] == zeldaCoords[0] || hitCoords[0] == zeldaCoords[0]-1));
                //var tEdge = (hitCoords[0] < zeldaCoords[0] && ());
                //bEdge = (hitCoords[0] > zeldaCoords[0]);

                lEdge = zeldaToRight && sameRow;
                rEdge = zeldaToLeft && sameRow;
                tEdge = zeldaBelow && sameCol;
                bEdge = zeldaAbove && sameCol;

                var dir = 0; //direction of hit
                if(!hitEntity._isPassable) {
                    standingOnSomething = standingOnSomething || bEdge;
                    if(lEdge && this.velX < 0 && axis === "x") {
                        this.velX = 0;
                    }
                    if(rEdge && this.velX > 0 && axis === "x") {
                        this.velX = 0;
                    }
                    if(bEdge && this.velY > 0 && axis === "y") {
                        this.tempMaxJumpHeight = this.cy - this.maxPushHeight; 
                        var groundY = entityManager._world[0].getLocation((hitEntity.i), (hitEntity.j))[1] // block top y coordinate
                        this.putToGround(groundY);
                        dir = 4;
                    } 
                    if(tEdge && this.velY < 0  && axis === "y"){// && this.velY < 0) {
                        this.velY *= -1;
                        dir = 1;
                    }
                }

                hitEntity.activate(this, dir);

            }
        }
    }
    return standingOnSomething;
}

Zelda.prototype.putToGround = function(groundY) {
    this.state['jumping'] = false;
    this.state['offGround'] = false;
    this.state['onGround'] = true;
    this.velY = 0;
    this.cy = groundY -this.getSize().sizeY/2 + 1; // zelda center coordinate on ground.
}

// ==================
// ZELDA UPDATE LOGIC
// ==================


Zelda.prototype.updateJump = function(bEdge) {
    // If colliding with bottom edge, stop 'jumping'.	
	if(bEdge) { 
        this.state['jumping'] = false;
        this.state['pushing'] = keys[this.KEY_JUMP];
        this.state['offGround'] = false;
        if(!(keys[this.KEY_LEFT] || keys[this.KEY_RIGHT])) this.velX = 0;
    }else{
		this.state['jumping'] = true;
	}
	
    // Set offGround to true so that we can't keep pushing while in air.
    if(this.cy <= this.tempMaxJumpHeight) {
        this.state['offGround'] = true;
    }
};


Zelda.prototype.updateVelocity = function(du) {
    var NOMINAL_FORCE = +0.15;
    var NOMINAL_GRAVITY = 0.52;

    var wasMovingRight = (this.velX > 0);
    var wasMovingLeft = (this.velX < 0);
    var movingRight = keys[this.KEY_RIGHT];
    var movingLeft = keys[this.KEY_LEFT];
    
    // Check if the Zelda in still in range of the ground
    // to be able to push of it (=> jump higher)
    if(this.state['jumping'] && !keys[this.KEY_JUMP]) {
        this.state['offGround'] = true;
    }

    // We can keep 'pushing' off ground to manage a higher jump so long as we're
    // not too high in the air, i.e. 'offGround'. 
    this.state['pushing'] = keys[this.KEY_JUMP] && !this.state['offGround'];
    
    // To be able to change direction in midair:
    if((movingRight && wasMovingLeft && !this.state['inWater']) || (movingLeft && wasMovingRight && !this.state['inWater'])) this.velX = 0;

    // Increase speed to the right:
    if(movingRight && this.velX < this.maxVelX || this.velX <  - this.maxVelX) {
        this.velX += NOMINAL_FORCE*du;
    } 

    // Increase speed to the left:
    if(movingLeft && this.velX > - this.maxVelX || this.velX >  this.maxVelX) {
        this.velX -= NOMINAL_FORCE*du;
    }

    // Velocity is zero if we're not moving anywhere or floating in air:
    if(!this.state['jumping'] && !(movingRight || movingLeft)) {
        this.velX = 0;
    }

    // Start accelerating down as soon as we've "stopped state['pushing']"
    if(this.state['jumping'] && !this.state['pushing']) {
        if(!this.state['inWater'])this.velY += NOMINAL_GRAVITY*du;
        else this.velY += (NOMINAL_GRAVITY*du)/10;
    } else if(!this.state['jumping']){
        this.velY = 0;
    }
}

Zelda.prototype.updateLocation = function(du) {
    this.cx += this.velX*du;
    this.cy += this.velY*du;
}


Zelda.prototype.updateStatus = function() {
    var wasMovingRight = (this.velX >= 0);
    var wasMovingLeft = (this.velX < 0);

    // figure out our status
    var nextStatus = this.status;
    var dir = (this.velX >= 0)?"Right":"Left";
    var atMaxVel = (Math.abs(this.velX)>=(this.maxVelX*0.9))
    if(this.state['jumping']) nextStatus = "inAir"+dir;
    else if(this.state['casting']) nextStatus = "magic" + dir;
    else if(this.velX === 0 && !this.state['pushing']) nextStatus = "idle"+(wasMovingLeft?"Left":dir);
    else if(atMaxVel && !this.state['pushing'] && !this.state['inWater']) nextStatus = "running"+dir;
    else if(!this.state['pushing']) nextStatus = "walking"+dir;

    // Update animation
    if(nextStatus!==this.status){
        this.status = nextStatus;
        this.animation = this.animations[this.status];
        this.animation.reset();
    }    
}

	

Zelda.prototype.update = function (du) {
    // TEMP SOLUTION??? Seems kind of silly to make zelda 'find' the blocks.
    //var blocks = entityManager._world[0].findBlocks(this);

	spatialManager.unregister(this);

	// Handle state['jumping']:
    if(keys[this.KEY_JUMP]) this.handleJump();
    // Handle casting:
    if(keys[this.KEY_CAST]) {
        this.handleCasting();
    }

    //Handles if Zelda is in water
    if(this.state['inWater']){
        this.maxVelX = 2.3;
        this.maxVelY = 1.1;
    }else {
        this.maxVelX = 3.9;
        this.maxVelY = 6.5;
    }

    // Update speed/location and handle jumps/collisions
    this.updateVelocity(du);

    //this.handleCollisions(this.cx, this.cy, this.cx+this.velX*du, this.cy+this.velY*du);
    this.handleBoxCollision(this.cx, this.cy, this.cx+this.velX*du, this.cy+this.velY*du);
    //

    var nextX = this.cx+this.velX*du;
    var nextY = this.cy+this.velY*du;
	var prevX = this.cx;
    var prevY = this.cy;
    var bEdge;
	
    this.state['inWater'] = false;

	//check left/right collisions and handle them first, if none, check top bottom collisions.
    this.handlePartialCollision(nextX,prevY,"x");
	bEdge = this.handlePartialCollision(prevX,nextY,"y");
	//this.checkFalling();
	// check top bottom collisions specially if left/right collision occurred
    this.updateLocation(du);
    this.updateJump(bEdge);

    if(this.cy > g_canvas.height){
        this._isDeadNow = true;
    }
    




// ------------------------------------------------------------------


    // Check for death:
    if(this._isDeadNow) return entityManager.KILL_ME_NOW;

    // Finally, update status:
    this.updateStatus();
    var animFinished = this.animation.update(du);
    if(this.state['casting'] && animFinished===1) {

        this.state['casting'] = false;
    }

	spatialManager.register(this);

    this.updateViewport();
};

// Make sure Zelda is always center of the screen:
Zelda.prototype.updateViewport = function(){
    var nextView = this.cx - g_canvas.width/2;
    var lvlLength = entityManager._world[0].blocks[13].length*(g_canvas.height/14) - g_canvas.width;
    if (nextView < 0) {
        g_viewPort.x = 0;
    } else if (nextView > lvlLength) {
        g_viewPort.x = lvlLength;
    } else {
        g_viewPort.x = nextView;
    }
    g_viewPort.y = 0;
}
