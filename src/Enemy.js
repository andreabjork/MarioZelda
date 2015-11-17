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
/*function Enemy(descr) {
	this.setup(descr)

    // Default sprite, if not otherwise specified
    this.sprite = g_sprites.marioTest;
    this._scale = 1;
	this.animations = makeZeldaAnimation(this._scale);
	this.animation = this.animations['idleRight'];
};

// This comes later on when Entity has been implemented: 
Enemy.prototype = new Character();

// Initial, inheritable, default values
Enemy.prototype.cx = 500;
Enemy.prototype.cy = 483;
Enemy.prototype.velX = 1.5;
Enemy.prototype.HP = 1;

Enemy.prototype.update = function(du) {
	spatialManager.unregister(this);
	if(this.cx > 600 && this.velX > 0) this.velX *= -1;
	else if(this.cx < 100 & this.velX < 0) this.velX *= -1;

	this.cx += this.velX*du;

	if(this._isDeadNow) return entityManager.KILL_ME_NOW;

	spatialManager.register(this);
}*/


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
	//console.dir(descr);
    // Default sprite, if not otherwise specified
    this._scale = 1;
	this.animations = makeZeldaAnimation(this._scale);
	this.animation = this.animations['idleRight'];
};

// This comes later on when Entity has been implemented: 
Enemy.prototype = new Character();

// Initial, inheritable, default values
Enemy.prototype.cx = 500;
Enemy.prototype.cy = 483;
Enemy.prototype.velX = -1;
Enemy.prototype.velY = 0;
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

	//Handles if enemy is in water
    if(this.state['inWater']){
        this.maxVelX = 2.3;
        this.maxVelY = 1.1;
    }else {
        this.maxVelX = 3.9;
        this.maxVelY = 6.5;
    }
	
	if(this.state['jumping'] && this.velY < TERMINAL_VELOCITY){
		this.state['offGround'] = true;
		this.velY += NOMINAL_GRAVITY*du;
	}
	
	this.updateProxBlocks(this.cx, this.cy, this.cx+this.velX*du, this.cy+this.velY*du);
	
	var nextX = this.cx+this.velX*du;
    var nextY = this.cy+this.velY*du;
	var prevX = this.cx;
    var prevY = this.cy;
    var bEdge;
	
    this.state['inWater'] = false;
	
	//check left/right collisions first and then top/bottom
    this.handlePartialCollision(nextX,prevY,"x");
	bEdge = this.handlePartialCollision(prevX,nextY,"y");
	
	// update location
    this.cx += this.velX*du;
    this.cy += this.velY*du;
	
    // update jump
	this.state['jumping'] = !bEdge;
	this.state['offGround'] = !bEdge;
	this.state['onGround'] = !bEdge;
	
	if(this.cy > g_canvas.height){
        this._isDeadNow = true;
    }
	
    // Check for death:
    if(this._isDeadNow) return entityManager.KILL_ME_NOW;
	
	this.animation.update(du);

	spatialManager.register(this);
}
