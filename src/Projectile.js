// ==========
// PROJECTILE
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Projectile(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    if(this.shooter instanceof Zelda) {
	   if(this.velX > 0)this.animation = makeZeldaSpellAnimation(this.radius/2);
	   else this.animation = makeZeldaSpellAnimation(-this.radius/2);
       this.particleColors = [
            "#C716D8",
            "#EC6CF9",
            "#E802FF",
            "#910B9E",
            "#6F1A77",
            "#54A2FF",
            "#59D6F1",
            "#1F8FA7",
            "#03CAF5",
            "#035BF5",
            "#15408C" // Hardcoded because random colors with a certain theme are hard man!
            ];
    }else if(this.shooter instanceof Enemy) {
       if(this.velX > 0)this.animation = makeEnemySpellAnimation(this.radius/2);
       else this.animation = makeEnemySpellAnimation(-this.radius/2);
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
   }
    this.HP = 1;
}

Projectile.prototype = new Character(); // Lol remember to change name of Character class... turns out it's useful for more things than just a character.

// Initial, inheritable, default values
Projectile.prototype.friendly = false;  //override if Mario made it 
Projectile.prototype.radius = 4;        //override in constructor for specific r
Projectile.prototype.rotation = 0;
Projectile.prototype.cx = 200;
Projectile.prototype.cy = 200;
Projectile.prototype.velX = 1;
Projectile.prototype.velY = 1;

//

// Convert times from milliseconds to "nominal" time units.
Projectile.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

Projectile.prototype.update = function (du) {

    // Unregister
    spatialManager.unregister(this);
    this.updateProxBlocks(this.cx, this.cy, this.cx+this.velX*du, this.cy+this.velY*du);
    if(this._isDeadNow) return entityManager.KILL_ME_NOW;
    this.animation.update(du);

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

    // (Re-)Register
    spatialManager.register(this);

};

Projectile.prototype.getPos = function () {
    return {posX: this.cx-1, posY: this.cy-1};
};

Projectile.prototype.getSize = function () {
    return {sizeX: 2, sizeY: 2};
};

Projectile.prototype.render = function (ctx) {
    this.animation.renderAt(ctx, this.cx, this.cy);
};


Projectile.prototype.handleCollision = function(hitEntity, axis) {
    var bEdge,lEdge,rEdge,tEdge;
    var standingOnSomething;
    var walkingIntoSomething;

    if(hitEntity instanceof Block && !hitEntity._isPassable) {
        this.takeHit();
    }else if(hitEntity instanceof Enemy && this.shooter instanceof Zelda) {
        this.takeHit();
        hitEntity.takeHit();
        if(hitEntity instanceof Shooter) g_score.add(100);
        else g_score.add(50);
    }else if(hitEntity instanceof Zelda && this.shooter instanceof Shooter) {
        this.takeHit();
        hitEntity.takeHit();
    }

    return {standingOnSomething: standingOnSomething, walkingIntoSomething: walkingIntoSomething};
}
