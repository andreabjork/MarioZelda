function Portal(descr) {
    this.setup(descr);
//    console.log("is this happening");
    this._scale = 3;
    this.sprite = this.sprite || g_sprites.portal;
};

Portal.prototype = new Character();

Portal.prototype.friendly = true;

Portal.prototype.update = function(du) {
    spatialManager.unregister(this);
	
    if(this.isColliding()) {
    	console.log("this is colliding with something");
    }
	
	spatialManager.register(this);

};

Portal.prototype.collide = function(Zelda) {
    if(Zelda.name === 'zelda') {
		entityManager.enterLevel(entityManager._level);
	}
};

Portal.prototype.render = function(ctx) {
	this.sprite.drawCentredAt(ctx, this.cx ,this.cy);
}