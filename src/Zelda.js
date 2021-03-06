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

    this.rememberResets();
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
Zelda.prototype.KEY_PLUMMET = 40; //Down-arrow key code
Zelda.prototype.KEY_JUMP   = 38; //Up-arrow key code
Zelda.prototype.KEY_SPRINT = 'Z'.charCodeAt(0); // Implement method for this?
Zelda.prototype.KEY_CAST  = ' '.charCodeAt(0);

// Initial, inheritable, default values
Zelda.prototype.cx = 200;
Zelda.prototype.cy = 400;
Zelda.prototype.velX = 0;
Zelda.prototype.velY = 0;
Zelda.prototype.HP = 1;
Zelda.prototype.life = 5;
Zelda.prototype.rotation = 0;
Zelda.prototype.maxVelX = 3.9;
Zelda.prototype.maxVelY = 6.5;
Zelda.prototype.animationTimer = 0;
Zelda.prototype.tempMaxJumpHeight = 0;
Zelda.prototype.maxPushHeight = 120;
Zelda.prototype.state = {jumping: false, canJump: true, pushing: false, offGround: false, casting: false, onGround: true, idle: true, facingRight: true, inWater: false}
Zelda.prototype.status = "idleRight";
// idle, walkingRight, walkingLeft, runningRight, runningLeft, inAirRight, inAirLeft

// ===============
// ZELDA ABILITIES
// ===============


Zelda.prototype.handleJump = function () {
    if((!this.state['canJump'] || this.state['jumping']) && !this.state['inWater']) return;
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
    if(this.state['casting'] || this.state['jumping'] || this.state['inWater']) return;
    else {
        this.state['casting'] = true;
        var dX = (this.state["facingRight"] ? 1 : -1 );
        var dY = 0;//Math.cos(this.rotation);
        var launchDist = this.getSize().sizeX/2;
        var bulletVel = (this.state["facingRight"] ? 7 : -7 );
		
        var relVelX = dX;
        var relVelY = dY;
        entityManager.fireBullet(
           this.cx + dX + launchDist, this.cy + dY,
           bulletVel, 0,
           0,
           this); // this is for shooter
    }
};

// =====================
// ZELDA COLLISION LOGIC
// =====================

Zelda.prototype.handleCollision = function(hitEntity, axis) {
    var bEdge,lEdge,rEdge,tEdge;
    var standingOnSomething;
    var walkingIntoSomething;



        // Lots of vars for type of collision: top, bottom, same column, same row, going by zelda center coordinate, left coordinate, right, etc.
        var charCoords = entityManager._world[0].getBlockCoords(this.cx, this.cy); //This is going by char's center, which is her lower half. Upper half needs to be in i, j-1.
        var charCoordsLeft = entityManager._world[0].getBlockCoords(this.cx-this.getSize().sizeX/2, this.cy); //This is going by char's bottom left corner
        var charCoordsRight = entityManager._world[0].getBlockCoords(this.cx+this.getSize().sizeX/2, this.cy); //This is going by char's bottom right corner
        var hitCoords = (hitEntity instanceof Block ? [hitEntity.i, hitEntity.j] : entityManager._world[0].getBlockCoords(hitEntity.cx, hitEntity.cy));

        var charAbove = (hitCoords[0] > charCoords[0]); // char block coordinates lower because y-axis points down.
        var charBelow = (hitCoords[0] < charCoords[0]);
        var charToLeft = (hitCoords[1] > charCoords[1]); // char column coords must be lower.
        var charToRight = (hitCoords[1] < charCoords[1]);
        var sameCol = (hitCoords[1] == charCoordsLeft[1] || hitCoords[1] == charCoordsRight[1]);
        var sameRow = (hitCoords[0] == charCoords[0] || hitCoords[0] == charCoords[0]-1) || this.state['jumping'];

        lEdge = charToRight && sameRow;
        rEdge = charToLeft && sameRow;
        tEdge = charBelow && sameCol;
        bEdge = charAbove && sameCol;

        // Bad fix to make Character decide what happens to it's subclasses (Enemy, Zelda, Projectile)
        if(hitEntity instanceof Block) {
            var dir = 0; //direction of hit
            if(!hitEntity._isPassable) {
                standingOnSomething = standingOnSomething || bEdge;
                if(lEdge && this.velX < 0 && axis === "x") {
                    walkingIntoSomething = walkingIntoSomething || true;
                }
                if(rEdge && this.velX > 0 && axis === "x") {
                    walkingIntoSomething = walkingIntoSomething || true;
                }
                if(bEdge && this.velY > 0 && axis === "y") {
                    this.tempMaxJumpHeight = this.cy - this.maxPushHeight; 
                    var groundY = entityManager._world[0].getLocation((hitEntity.i), (hitEntity.j))[1] // block top y coordinate
                    this.putToGround(groundY);
                    dir = 4;
                } 
                if(tEdge && this.velY < 0  && axis === "y"){// && this.velY < 0) {
                    this.velY *= -1;
					this.velY = Math.max(this.velY,5);
                    dir = 1;
                    this.state['offGround'] = true;
                }
            }
            hitEntity.activate(this, dir);

        }else if(hitEntity instanceof Portal) {
			// This happens when we jump in a portal
            if(this.animationTimer === 0){
                util.play(g_audio.portal);
                this.animationTimer = 70; 
                this.transend();
            }
        } else if(hitEntity instanceof Bowser) {
            if(hitEntity.velX === 0) {
				//If Bowser-Pat is moving he shouldn't hit us.
                this.takeHit();
            }
        } else if(hitEntity instanceof Prince){
			// Do nothing, this is our prince!
		}else if(hitEntity instanceof Enemy) {
			// check to see if we jumped on his head
            if(bEdge) {
                util.play(g_audio.boop);
                hitEntity.takeHit();
                this.velY = -4;
                if(hitEntity instanceof Shooter) g_score.add(100);
                else g_score.add(50);
            } else {
				// if not it hurts
                this.takeHit();
            }
        }
    

    return {standingOnSomething: standingOnSomething, walkingIntoSomething: walkingIntoSomething};
}

// ==================
// ZELDA UPDATE LOGIC
// ==================


Zelda.prototype.updateJump = function(bEdge) {
    // If colliding with bottom edge, stop 'jumping'.	
	if(bEdge) { 
        this.state['jumping'] = false;
        this.state['pushing'] = false;
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
	// We can only start "pushing" if we can jump:
	if(!this.state['pushing']) this.state['pushing'] = keys[this.KEY_JUMP] && this.state['canJump'] && this.state['jumping'];
	// if we're already pushing we can keep pushing by these constraints:
	else  this.state['pushing'] = keys[this.KEY_JUMP] && !this.state['offGround'];
    
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
    if(this.state['jumping'] && !this.state['pushing'] && this.velY < TERMINAL_VELOCITY) {
        if(!this.state['inWater'])this.velY += NOMINAL_GRAVITY*du;
        else this.velY += (NOMINAL_GRAVITY*du)/10;
    }else if(this.state['jumping'] && this.state['pushing']){
		this.velY = -6;
	}else if(!this.state['jumping']){
        this.velY = 0;
    }
}

Zelda.prototype.updateLocation = function(du) {
    var lvlLength = entityManager._world[0].blocks[13].length*(g_canvas.height/14);
	var halfWidth = this.getSize().sizeX/2;
    this.cx += this.velX*du;
	this.cx = Math.min(this.cx, lvlLength-halfWidth);
	this.cx = Math.max(this.cx, halfWidth);
    this.cy += this.velY*du;
}


Zelda.prototype.updateStatus = function() {
    var wasMovingRight = (this.velX >= 0);
    var wasMovingLeft = (this.velX < 0);

    // figure out our status
    var nextStatus = this.status;
	var dir;
	if(this.velX === 0) dir = (this.state['facingRight'] ? "Right" : "Left");
	else{
		dir = (this.velX > 0 ? "Right" : "Left");
		this.state['facingRight'] = (dir==="Right");
	}
    var atMaxVel = (Math.abs(this.velX)>=(this.maxVelX*0.9))
    if(this.state['jumping']) nextStatus = "inAir"+dir;
    else if(this.state['casting']) nextStatus = "magic" + dir;
    else if(this.velX === 0 && !this.state['jumping']) nextStatus = "idle"+(wasMovingLeft?"Left":dir);
    else if(atMaxVel && !this.state['jumping'] && !this.state['inWater']) nextStatus = "running"+dir;
    else if(!this.state['jumping']) nextStatus = "walking"+dir;

    // Update animation
    if(nextStatus!==this.status){
        this.status = nextStatus;
        this.animation = this.animations[this.status];
    }    
}

	

Zelda.prototype.update = function (du) {
    //var blocks = entityManager._world[0].findBlocks(this);

	spatialManager.unregister(this);
	
	//update blocks in proximity
    this.updateProxBlocks(this.cx, this.cy, this.cx+this.velX*du, this.cy+this.velY*du);
	
    // Check for death:
    if(this._isDeadNow) {
        if(Math.random() < 0.34){
            util.play(g_audio.patIdiot);
        } else if(Math.random() < 0.5){
            util.play(g_audio.patClown);
        } else {
            util.play(g_audio.patFraud);
        }
        g_score.half();
        if (this.life > 0) {
            this.life--;
            this._isDeadNow = false;
            entityManager.enterLevel(entityManager._level);
        } else {
            return entityManager.KILL_ME_NOW;            
        }      
    };

	// Handle state['jumping']:
    if(keys[this.KEY_JUMP]) this.handleJump();
    // Handle casting:
    if(keys[this.KEY_CAST]) {
        if (entityManager._level === 6) entityManager.enterLevel(1);
		else if(!this.state['jumping'] && !this.state['inWater']){
			util.play(g_audio.zeldaShoot);
			this.handleCasting();
		}
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

    var nextX = this.cx+this.velX*du;
    var nextY = this.cy+this.velY*du;
	var prevX = this.cx;
    var prevY = this.cy;
    var bEdge;
	
    this.state['inWater'] = false;

	//check left/right collisions first and then top/bottom
    if(this.handlePartialCollision(nextX,prevY,"x")) this.velX = 0;
	bEdge = this.handlePartialCollision(prevX,nextY,"y");
	
	this.state['canJump'] = (!this.state['jumping'] && !keys[this.KEY_JUMP]);
	
	if(this.animationTimer > 0) this.transend();
	
    this.updateLocation(du);
	
    this.updateJump(bEdge);

    if(this.cy > g_canvas.height + 42){
        this._isDeadNow = true;
    }

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
	var acid = 0;
	if(g_acid) acid = Math.random()*20 - 10;
    var nextViewX = this.cx - g_canvas.width/2 + acid;
    var lvlLength = entityManager._world[0].blocks[13].length*(g_canvas.height/14) - g_canvas.width;
    if (nextViewX < 0) {
        g_viewPort.x = 0;
    } else if (nextViewX > lvlLength) {
        g_viewPort.x = lvlLength;
    } else {
        g_viewPort.x = nextViewX;
    }
	
    var nextViewY = this.cy - g_canvas.height/2 + acid;
	if (nextViewY > 0) {
        g_viewPort.y = 0;
    } else {
        g_viewPort.y = nextViewY;
    }
}

Zelda.prototype.transend = function(){
	this.animationTimer--;
	this.rotation = (this.animationTimer/70)*(2*Math.PI);
	this.velX = 0;
	this.velY = 0;
	
	if(this.animationTimer === 0){ 
	   entityManager.enterLevel(++entityManager._level);
       if (entityManager._level === 6) util.playLoop(g_audio.victoryTheme);
	}   
}
