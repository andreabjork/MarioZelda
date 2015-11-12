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
Zelda.prototype.cy = 483;
Zelda.prototype.velX = 0;
Zelda.prototype.velY = 0;
Zelda.prototype.HP = 1;
Zelda.prototype.maxVelX = 3.9;
Zelda.prototype.maxVelY = 6.5;
Zelda.prototype.tempMaxJumpHeight = 0;
Zelda.prototype.maxPushHeight = 120;
Zelda.prototype.state = {jumping: false, pushing: false, offGround: false, casting: false, onGround: true, idle: true, right: true, left: false}
Zelda.prototype.status = "idleRight";
// idle, walkingRight, walkingLeft, runningRight, runningLeft, inAirRight, inAirLeft

// ===============
// ZELDA ABILITIES
// ===============


Zelda.prototype.handleJump = function () {
    if(this.state['jumping']) { return; }
    else {
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
        console.log("detecting collision");
        var hitEntity = this.findHitEntity();
        // naive collision check, will do it better later 
        // once collision for tiles has been done correctly
        var entPos = hitEntity.getPos();
        var entSize = hitEntity.getSize();
        var entityLeft = entPos.posX-entSize.sizeX;
        var entityRight = entPos.posX+entSize.sizeX;
        if(this.cx-this.getSize().sizeX < entityRight && this.cx+this.getSize().sizeX > entityLeft) {
            console.log("entity should take hit");
            hitEntity.takeHit();
        }else {
            console.log("I should take hit");
            this.takeHit();
        }
    }
}

Zelda.prototype.handleBoxCollision = function(prevX, prevY, nextX, nextY) {
    this.unregisterBlocks();
    this.findProxBlocks(prevX, prevY, nextX, nextY);
    this.registerBlocks();
}

Zelda.prototype.putToGround  = function(y) {
    this.cy = y+this.getSize().sizeY;
    this.velX = 0;
    this.velY = 0;
    this.state['onGround'] = true;
    this.state['jumping'] = false;
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
// ==================
// ZELDA UPDATE LOGIC
// ==================


Zelda.prototype.updateJump = function(bEdge) {
	var groundHeight = entityManager._world[0].findGround(this); 
	
	if(this.state['onGround'] && bEdge) { // this should happen when blocks.B, whatever that means
        this.state['jumping'] = false;
        this.state['pushing'] = keys[this.KEY_JUMP];
        this.state['offGround'] = false;
        if(!(keys[this.KEY_LEFT] || keys[this.KEY_RIGHT])) this.velX = 0;
    }
	else {this.state['jumping'] = true;}
	
    if(this.cy <= this.tempMaxJumpHeight) {
        this.state['offGround'] = true;
    }

    if(this.jumping && this.velY === 0)this.offGround = true; 
    if(!bEdge){
        console.log("this is triggering");
        this.jumping = true;
        //this.offGround = true;
    }

    /*    	
	if(this.cy - 42*this._scale <= roof) {
        this.velY *= -1;
		if(isTB)topBlock.activate();
    }*/
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
    this.state['pushing'] = keys[this.KEY_JUMP] && !this.state['offGround'];
    
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
    if(!this.state['jumping'] && !(movingRight || movingLeft)) {
        this.velX = 0;
    }

    // Start accelerating down as soon as we've "stopped state['pushing']"
    if(this.state['jumping'] && !this.state['pushing']) {
        this.velY += NOMINAL_GRAVITY*du;
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
    else if(atMaxVel && !this.state['pushing']) nextStatus = "running"+dir;
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

    // Update speed/location and handle jumps/collisions
    this.updateVelocity(du);

    //this.handleCollisions(this.cx, this.cy, this.cx+this.velX*du, this.cy+this.velY*du);
    this.handleBoxCollision(this.cx, this.cy, this.cx+this.velX*du, this.cy+this.velY*du);
    //

// TO BE FIDDLED WITH ---------------------------------------------------------------------
    var bEdge;
    if(this.isColliding()) {
        var hitEntities = this.findHitEntities();
        for(var hit in hitEntities) {
            var hitEntity = hitEntities[hit];
            if(hitEntity instanceof Block) {
                var zeldaCoords = entityManager._world[0].getBlockCoords(this.cx, this.cy);
                var hitCoords = [hitEntity.i, hitEntity.j];

                var lEdge = (hitCoords[1] < zeldaCoords[1] && (hitCoords[0] == zeldaCoords[0] || hitCoords[0] == zeldaCoords[0]-1) );
                var rEdge = (hitCoords[1] > zeldaCoords[1] && (hitCoords[0] == zeldaCoords[0] || hitCoords[0] == zeldaCoords[0]-1));
                var tEdge = (hitCoords[0] < zeldaCoords[0]);
                bEdge = (hitCoords[0] > zeldaCoords[0]);

                if(lEdge && this.velX < 0) {
                    console.log("colliding left");
                    this.velX = 0;
                }
                if(rEdge && this.velX > 0) this.velX = 0; 
                if(tEdge && this.velY < 0) {
                    console.log("colliding top!");
                    this.velY *= -1;
                }
                if(bEdge) {
                    console.log("colliding bottom");
                    this.tempMaxJumpHeight = this.cy - this.maxPushHeight; 
                    this.cy = zeldaCoords[0]*(g_canvas.height/14)+this.getSize().sizeY/6+1;
                }
            }
        }
    }       

    this.updateLocation(du);

    this.updateJump(bEdge);

    if(this.cy > g_canvas.height){
        console.log("ur dead, scruuuub, f5 to win at life");
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
	g_viewPort.x = Math.max(0,this.cx-g_canvas.width/2);
	g_viewPort.y = 0;
}
