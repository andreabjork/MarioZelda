// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


var util = {

// RESETS
// ======

resetSpatialManager: function(){
	spatialManager._nextSpatialID = 1;
	spatialManager._entities = [];
},

resetEntityManager: function(){
	entityManager._character = [];
	entityManager._bullets = [];
	entityManager._particles = [];
	entityManager._world = [];
	entityManager._collisionBlocks = [];
	entityManager._enemies = [];
	entityManager._objects = [];
	entityManager._level = 1;
	entityManager.deferredSetup();

	g_score.reset();
},



// RANGES
// ======

clampRange: function(value, lowBound, highBound) {
        if (value < lowBound) {
    	value = lowBound;
    } else if (value > highBound) {
	value = highBound; 
    }
    return value;
},

wrapRange: function(value, lowBound, highBound) {
    while (value < lowBound) {
	value += (highBound - lowBound);
    }
    while (value > highBound) {
	value -= (highBound - lowBound);
    }
    return value;
},

isBetween: function(value, lowBound, highBound) {
    if (value < lowBound) { return false; }
    if (value > highBound) { return false; }
    return true;
},


// RANDOMNESS
// ==========

randRange: function(min, max) {
    return (min + Math.random() * (max - min));
},


// MISC
// ====

square: function(x) {
    return x*x;
},

sumFirst: function(num, array){
    var sum = 0;
    for(var i=0; i< min(num,array.length) ; i++){
        sum += array[i];
    }
    return sum;
},


// DISTANCES
// =========

distSq: function(x1, y1, x2, y2) {
    return this.square(x2-x1) + this.square(y2-y1);
},

wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
    var dx = Math.abs(x2-x1),
	dy = Math.abs(y2-y1);
    if (dx > xWrap/2) {
	dx = xWrap - dx;
    };
    if (dy > yWrap/2) {
	dy = yWrap - dy;
    }
    return this.square(dx) + this.square(dy);
},


// CANVAS OPS
// ==========

clearCanvas: function (ctx) {
    var prevfillStyle = ctx.fillStyle;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevfillStyle;
},

strokeCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
},

fillCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
},

fillBox: function (ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
},

strokeBox: function (ctx, x, y, w, h, style) {
    ctx.save();
    
    ctx.strokeStyle = style;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x,y+h);
    ctx.lineTo(x+w,y+h);
    ctx.lineTo(x+w,y);
    ctx.lineTo(x,y);
    
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();
},

//=======
// AUDIO
//=======

play: function (audio) {
    audio.pause();
    audio.currentTime = 0;
    if (!g_isMuted) audio.play();
},

playLoop: function (audio) {
    backgroundMusic = audio;
	backgroundMusic.volume = Math.min(backgroundMusic.volume,0.5);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    if (!g_isMuted) {
        try {
            backgroundMusic.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            });
            backgroundMusic.play();
        } catch(err) {}
    };
}

};
