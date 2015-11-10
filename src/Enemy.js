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
	makeZeldaAnimation(this._scale);
    this.animation = g_animations.zelda.idleRight;
};

// This comes later on when Entity has been implemented: 
Enemy.prototype = new Character();

// Initial, inheritable, default values
Enemy.prototype.cx = 200;
Enemy.prototype.cy = 483;
Enemy.prototype.velX = 5;


Enemy.prototype.update = function(du) {
	if(this.cx > 300 && this.velX > 0) this.velX = -this.velX;
	else if(this.cx < 100 & this.velX < 0) this.velX = +this.velX;

	this.cx = this.velX*du;
}
