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
    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
};

Block.prototype._isDeadNow = false;
Block.prototype._isBreakable = false;

Block.prototype.update = function (du) {
	if(this._isDeadNow) return level.BREAK_ME;
};


Block.prototype.render = function (ctx,cx,cy,w,h) {
    ctx.save();

    ctx.fillStyle = "Yellow";
    ctx.linewidth = 3;
    ctx.strokeStyle = "Blue"
    ctx.fillRect(cx-w/2,cy-h/2,w,h);
    ctx.rect(cx-w/2,cy-h/2,w,h);
    ctx.stroke();

    ctx.restore();
};

Block.prototype.tryToBreak = function(){
    if(this._isBreakable) this._isDeadNow = true;
}
