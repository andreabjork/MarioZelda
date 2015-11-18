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
	if(this.velX > 0)this.animation = makeSpellAnimation(this.radius/2);
	else this.animation = makeSpellAnimation(-this.radius/2);

    this.HP = 1;
}

Projectile.prototype = new Character();

// Initial, inheritable, default values
Projectile.prototype.friendly = false;  //override if Mario made it 
Projectile.prototype.radius = 4;        //override in constructor for specific r
Projectile.prototype.rotation = 0;
Projectile.prototype.cx = 200;
Projectile.prototype.cy = 200;
Projectile.prototype.velX = 1;
Projectile.prototype.velY = 1;
Projectile.prototype.particleColors = [
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
"#15408C"
]; // Hardcoded because random colors with a certain theme are hard man!

//

// Convert times from milliseconds to "nominal" time units.
Projectile.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

Projectile.prototype.update = function (du) {

    // Unregister
    spatialManager.unregister(this);
    this.updateProxBlocks(this.cx, this.cy, this.cx+this.velX*du, this.cy+this.velY*du);
    this.animation.update(du);

    // hér á eftir að útbúa handler fyrir rotation sem og manage hvað
    // og hvenær projectilið drepur sig... best kannski bara þegar það 
    //er out of screen

    var nextX = this.cx + this.velX*du;
    var nextY = this.cy + this.velY*du;

    var hitEntity = this.findHitEntity(nextX, nextY);
    if (hitEntity instanceof Enemy) {
        var canTakeHit = hitEntity.takeHit;
        if (canTakeHit) {
            g_audio.boop.play();
            g_score.update(50);
            hitEntity.takeHit();
        }
        return entityManager.KILL_ME_NOW;
    }
	
    this.handlePartialCollision(nextX,this.cy,"x")

    if(this._isDeadNow) return entityManager.KILL_ME_NOW;	
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
