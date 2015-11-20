// ==========
// RedBull
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function RedBull(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    this.particleColors = [
            "#3ffe3f",
            "#189618",
            "#bcd9bc",
            "#75de36",
            "#54be14",
            "#91be14",
            "#57720a",
            "#fdfc08",
            "#e1fd08",
            "#f3ff96",
            "#18601e"
            ]; 
    this.HP = 1;
	this.scale = 0.2;
    this.sprite = g_sprites.redBull;
}

RedBull.prototype = new Character(); // Lol remember to change name of Character class... turns out it's useful for more things than just a character.

// Initial, inheritable, default values
RedBull.prototype.friendly = false;  //override if Mario made it 
RedBull.prototype.radius = 4;        //override in constructor for specific r
RedBull.prototype.rotation = 0;
RedBull.prototype.cx = 200;
RedBull.prototype.cy = 200;
RedBull.prototype.velX = 1;
RedBull.prototype.velY = 1;

//

// Convert times from milliseconds to "nominal" time units.
RedBull.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

RedBull.prototype.update = function (du) {

    // Unregister
    spatialManager.unregister(this);
	
    this.updateProxBlocks(this.cx, this.cy, this.cx+this.velX*du, this.cy+this.velY*du);
    if(this._isDeadNow) return entityManager.KILL_ME_NOW;
    
	
	this.velY += 0.02;
	
    var nextX = this.cx + this.velX*du;
    var nextY = this.cy + this.velY*du;

	
    this.handlePartialCollision(nextX,this.cy,"x")
	
    // select random colour
	var randIndex = Math.floor(Math.random()*this.particleColors.length);
	var randColour = this.particleColors[randIndex];
	
	// select random alpha
	var particleDir = Math.random()*Math.PI*2;
	
	//generateParticle
	entityManager.generateParticle(this.cx, this.cy, particleDir, 1, 0.7, this.radius*2, randColour);

    this.cx += this.velX * du;
    this.cy += this.velY * du;

	this.rotation -= 0.08;
    // (Re-)Register
    spatialManager.register(this);

};

RedBull.prototype.getPos = function () {
    return {posX: this.cx-1, posY: this.cy-1};
};

RedBull.prototype.getSize = function () {
    return {sizeX: 55, sizeY: 45};
};

RedBull.prototype.render = function (ctx) {
	this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(ctx, this.cx, this.cy,this.rotation);
};


RedBull.prototype.handleCollision = function(hitEntity, axis) {
    
    if(hitEntity instanceof Block && !hitEntity._isPassable) {
        //this.takeHit();
    } else if(hitEntity instanceof Zelda) {
        this.takeHit();
        hitEntity.takeHit();
    }

    return {standingOnSomething: false, walkingIntoSomething: false};
}
