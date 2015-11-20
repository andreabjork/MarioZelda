function Portal(descr) {
    this.setup(descr);
    this._scale = 2;
    this.sprite = g_sprites.portal;
};

Portal.prototype = new Character();

Portal.prototype.friendly = true;

Portal.prototype.update = function(du) {
    spatialManager.unregister(this);
	
    if(this.isColliding()) {
    }
	
	spatialManager.register(this);

};

Portal.prototype.collide = function(Zelda) {
    if(Zelda.name === 'zelda' && Zelda.animationTimer === 0) {
		Zelda.animationTimer = 40; 
		Zelda.transend();
	}
};

Portal.prototype.render = function(ctx) {
	this.sprite.drawCentredAt(ctx, this.cx ,this.cy);
}