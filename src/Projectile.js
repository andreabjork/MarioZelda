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
            util.play(g_audio.boop);
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


Projectile.prototype.handleCollision = function(hitEntity, axis) {
    var bEdge,lEdge,rEdge,tEdge;
    var standingOnSomething;
    var walkingIntoSomething;

    if(this instanceof Projectile) {
        if(hitEntity instanceof Block && !hitEntity._isPassable) {
            this.takeHit();
        }else if(hitEntity instanceof Enemy) {
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

    return {standingOnSomething: standingOnSomething, walkingIntoSomething: walkingIntoSomething};
}
