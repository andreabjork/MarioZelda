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
}

Projectile.prototype = new Entity();

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
    
    // hér á eftir að útbúa handler fyrir rotation sem og manage hvað
    // og hvenær projectilið drepur sig... best kannski bara þegar það 
    //er out of screen

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeProjectileHit;
        if (canTakeHit) canTakeHit.call(hitEntity); 
        return entityManager.KILL_ME_NOW;
    }
    
    // (Re-)Register
    spatialManager.register(this);

};

Projectile.prototype.getPos = function () {
    return {posX: this.cx-1, posY: this.cy-1};
};

Projectile.prototype.getSize = function () {
    return {sizeX: 2, sizeY: 2};
};

Projectile.prototype.takeProjectileHit = function () {
    // Must-do
};

Projectile.prototype.render = function (ctx) {
    // Must-do
    ctx.fillStyle = "red";
    ctx.fillRect(this.cx, this.cy, this.radius, this.radius);
};
