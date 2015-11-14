function Cloud(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
	
	this.sprite = this.sprite || g_sprites.cloud;
	this.cx = Infinity;
	this.cy = g_canvas.height - (0.3 + Math.random())*g_canvas.height;
	this.scale = 0.8+0.4*Math.random();
	this.xVel = util.randRange(-0.6,0.6);
}

Cloud.prototype.cx = Math.random()*g_canvas.width;
Cloud.prototype.scale = 0.2+0.6*Math.random();
Cloud.prototype.cy = 0.66*g_canvas.height-0.5*g_canvas.height;
Cloud.prototype.xVel = 0.2+0.3*Math.random();
    
Cloud.prototype.update = function(du){
	this.cx += this.xVel * du; 
	if(this.cx > g_lvlLength + 150) {
		this.cx = Math.random()*g_lvlLength;
		this.cy = g_canvas.height - (0.3 + Math.random())*g_canvas.height;
		this.scale = 0.8+0.4*Math.random();
		this.xVel = util.randRange(-0.6,0.6);
	}
};

Cloud.prototype.render = function(ctx){
	this.sprite.scale = this.scale;
	this.sprite.drawCentredAt(ctx, this.cx ,this.cy);
};