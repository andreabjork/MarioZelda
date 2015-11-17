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
function Character(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    this.rememberResets();
    this._isAlive = true;

};
// This comes later on when Entity has been implemented: 
Character.prototype = new Entity();

Character.prototype.proxBlocks = []; 

Character.prototype.findProxBlocks = function(prevX, prevY, nextX, nextY) {
    var collisionInfo = entityManager._world[0].collidesWith(this, prevX, prevY, nextX, nextY);
    this.proxBlocks = collisionInfo.blocks;
    //entityManager.setBoxCentres(this.proxBlocks, collisionInfo.coords);
}

Character.prototype.registerBlocks = function() {
    for(var b in this.proxBlocks) if(this.proxBlocks[b]) spatialManager.register(this.proxBlocks[b]);
}

Character.prototype.unregisterBlocks = function() {
    for(var b in this.proxBlocks) if(this.proxBlocks[b]) spatialManager.unregister(this.proxBlocks[b]);
}


Character.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
};

Character.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
};

Character.prototype.takeHit = function () {
    this.HP--;
    if(this.HP <= 0) this.kill();
};

Character.prototype.render = function (ctx) {
    this.animation.renderAt(ctx, this.cx, this.cy);
};

Character.prototype.getPos = function(){
    var pos = {posX:this.cx,posY:this.cy};
    return pos;
}

Character.prototype.getNextPos = function(du) {
    return {nextX: this.cx+this.velX*du, nextY: this.cy+this.velY*du}
}

Character.prototype.getSize = function(){
    var size = {sizeX:16*this._scale,sizeY:42*this._scale};
    return size;
}