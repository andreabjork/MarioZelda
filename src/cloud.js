function Cloud(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
	this.setCloudFormAtRandom();
	this.cx = Infinity;
	this.cy = g_canvas.height - (0.3 + Math.random())*g_canvas.height;
	this.scale = 0.8+0.4*Math.random();
	do{
		this.xVel = util.randRange(-0.6,0.6);
	} while (this.xVel < 0.2 && this.xVel > -0.2);
	this.fading = 1;
}

Cloud.prototype.cx = Math.random()*g_canvas.width;
Cloud.prototype.scale = 0.2+0.6*Math.random();
Cloud.prototype.cy = 0.66*g_canvas.height-0.5*g_canvas.height;
Cloud.prototype.xVel = 0.2+0.3*Math.random();
Cloud.prototype.fading = 1;
    
Cloud.prototype.update = function(du){
	this.cx += this.xVel * du; 
	if(this.cx > g_lvlLength + 250 || this.cx < -250) {
		this.cx = Math.random()*g_lvlLength;
		this.cy = g_canvas.height - (0.3 + Math.random())*g_canvas.height;
		this.scale = 0.8+0.4*Math.random();
		do{
			this.xVel = util.randRange(-0.6,0.6);
		} while (this.xVel < 0.2 && this.xVel > -0.2);
		this.fading = 0;
		this.setCloudFormAtRandom();
	}
	if(this.fading < 1){
		this.fading += 0.004;
	}
};

Cloud.prototype.render = function(ctx){
	g_ctx.globalAlpha = this.fading;
	this.sprite.scale = this.scale;
	this.sprite.drawCentredAt(ctx, this.cx ,this.cy);
	g_ctx.globalAlpha = 1;
};

Cloud.prototype.setCloudFormAtRandom = function(){
	if(Math.random() < 0.34){
		this.sprite = g_sprites.cloud1;
	} else if(Math.random() < 0.5){
		this.sprite = g_sprites.cloud2;
	} else {
		this.sprite = g_sprites.cloud3;
	}
};