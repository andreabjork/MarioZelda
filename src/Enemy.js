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
}
