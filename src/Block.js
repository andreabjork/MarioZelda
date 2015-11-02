// ====
// Block
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Block(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

      
    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.Block;
    this.scale  = this.scale  || 1;

/*
    // Diagnostics to check inheritance stuff
    this._BlockProperty = true;
    console.dir(this);
*/

};

Block.prototype = new Entity();


Block.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
	spatialManager.unregister(this);
	
	if(this._isDeadNow) return entityManager.KILL_ME_NOW;
		


    this.rotation += 1 * this.velRot;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

	spatialManager.register(this);
	
};

//Breyta hit management í x-y kannski... hafa svona í bili
Block.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2) * 0.9;
};


Block.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
