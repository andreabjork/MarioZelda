function Cloud(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
	
	this.sprite = this.sprite || g_sprites.cloud;
	this.cx = Math.random()*2*g_canvas.width - g_canvas.width;
	this.cy = 0.66*g_canvas.height-0.3*g_canvas.height;
	this.scale = 0.3+0.3*Math.random();
	this.xVel = 0.2+0.3*Math.random();
}

Cloud.prototype.cx = Math.random()*g_canvas.width;
Cloud.prototype.scale = 0.2+0.6*Math.random();
Cloud.prototype.cy = 0.66*g_canvas.height-0.3*g_canvas.height;
Cloud.prototype.xVel = 0.2+0.3*Math.random();
    
Cloud.prototype.update = function(du){
	this.cx += this.xVel * du; 
	if(this.cx > g_canvas.width + 600){
		this.cx = -(1+Math.random())*g_canvas.width;
		this.cy = 0.66*g_canvas.height-0.3*g_canvas.height;
		this.scale = 0.1+0.2*Math.random();
		this.xVel = 0.2 + 0.3*Math.random();
	}
};

Cloud.prototype.render = function(ctx){
	this.sprite.scale = this.scale;
	this.sprite.drawCentredAt(ctx, g_viewPort.x + this.cx ,this.cy);
};