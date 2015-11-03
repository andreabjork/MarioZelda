// ===============
// ANIMATION STUFF
// ===============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */


// Construct an animation from a sprite sheet
function Animation (image, frameY, frameWidth, frameHeight, numFrames, interval, scale) {
    this.image = image;
    this.sprites = loadSprites(frameY,frameWidth,frameHeight,numFrames,scale);
    this.numFrames = numFrames;
    this.interval = (interval/1000)*SECS_TO_NOMINALS; // The input interval should be in milliseconds
    this.frameTimeLeft = this.interval;
}

// The current frame of animation
Animation.prototype.frameNum = 0;
Animation.prototype.updateFrameNum = function(){
	while(this.frameTimeLeft <=0){
		this.frameNum = (this.frameNum+1)%this.numFrames;
		this.frameTimeLeft += this.interval;
	}
}

Animation.prototype.update = function (du) {
	this.updateFrameNum();
	this.frameTimeLeft -= du;
};

Animation.prototype.render = function(ctx,cx,cy,0){
	var frame = sprites[frameNum];
	frame.drawWrappedCentredAt(cx,cy);
};

Animation.prototype.loadSprites = function(y,w,h,n,s){
	var sprites = []
	for (var i = 0; i < n; i++) {
		var s = Sprite(this.image);
		s.sx = i*w;
		s.sy = y;
		s.width = w;
		s.height = h;
		s.scale = s;
		s.drawAt = function(ctx,x,y){
			ctx.drawImage(this.image, this.sx, this.sy, this.width, this.height, x, y, this.width, this.height);
		};
		sprites.push(s);
	};
	return sprites;
};