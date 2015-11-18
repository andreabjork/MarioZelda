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

Character.prototype.HP = 1;
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

Character.prototype.updateProxBlocks = function(prevX, prevY, nextX, nextY) {
    this.unregisterBlocks();
    this.findProxBlocks(prevX, prevY, nextX, nextY);
    this.registerBlocks();
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
	//console.log("rendering at: ("+this.cx+","+this.cy+")");
    this.animation.renderAt(ctx, this.cx, this.cy, this.rotation);
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


//=================
// COLLISION STUFFS
//=================

Character.prototype.putToGround = function(groundY) {
    this.state['jumping'] = false;
    this.state['offGround'] = false;
    this.state['onGround'] = true;
    this.velY = 0;
    this.cy = groundY -this.getSize().sizeY/2 + 1; // character centre coordinate on ground.
}

Character.prototype.handlePartialCollision = function(charX,charY,axis,callback){
    var bEdge,lEdge,rEdge,tEdge;
    var standingOnSomething = false;
    var walkingIntoSomething = false;
    if(this.isColliding(charX, charY)) {
        var hitEntities = this.findHitEntities(charX, charY);
        for(var hit in hitEntities) {
            var hitEntity = hitEntities[hit];

            if(this instanceof Projectile) {
                if(hitEntity instanceof Block && !hitEntity._isPassable) {
                    console.log("hit unpassable block");
                    console.log("hp of bullet");
                    console.log(this.HP);
                    console.log("is dead now");
                    console.log(this._isDeadNow);
                    this.takeHit();
                    console.log("hp of bullet");
                    console.log(this.HP);
                    console.log("is dead now");
                    console.log(this._isDeadNow);
                }else if(hitEntity instanceof Enemy) {
                    console.log("hit enemy");
                    this.takeHit();
                    hitEntity.takeHit();
                }
            } else {

                // Lots of vars for type of collision: top, bottom, same column, same row, going by zelda center coordinate, left coordinate, right, etc.
                var charCoords = entityManager._world[0].getBlockCoords(this.cx, this.cy); //This is going by char's center, which is her lower half. Upper half needs to be in i, j-1.
                var charCoordsLeft = entityManager._world[0].getBlockCoords(this.cx-this.getSize().sizeX/2, this.cy); //This is going by char's bottom left corner
                var charCoordsRight = entityManager._world[0].getBlockCoords(this.cx+this.getSize().sizeX/2, this.cy); //This is going by char's bottom right corner
                var hitCoords = (hitEntity instanceof Block ? [hitEntity.i, hitEntity.j] : entityManager._world[0].getBlockCoords(hitEntity.cx+this.getSize().sizeX/2, hitEntity.cy));

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
                            dir = 1;
							this.state['offGround'] = true;
                        }
                    }
                    hitEntity.activate(this, dir);

                }else if(hitEntity instanceof Portal && this instanceof Zelda) {
                    if(this.animationTimer === 0){
    					util.play(g_audio.portal);
    					this.animationTimer = 70; 
    					this.transend();
    				}
                } else if(hitEntity instanceof Enemy && this instanceof Zelda) {
                    if(bEdge) {
                        console.log("colliding bottom edge!");
                        util.play(g_audio.boop);
                        g_score.update(50);
                        hitEntity.takeHit();
                        this.velY = -3;
                    } else {
                        console.log("colliding elsewhere");
                        this.takeHit();
                    }
                }
            }
        }
    }
    if(axis === "x") return walkingIntoSomething;
    if(axis === "y") return standingOnSomething;
}