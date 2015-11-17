function Portal(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    
	this._scale = 3;
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
    if(Zelda.name === 'zelda') {
		
		if(g_currentLevel === 1){
			entityManager._level[0].initLevel(levelObject.level2);
			g_currentLevel++;
			return g_currentLevel;
		}
		if(g_currentLevel === 2){
			entityManager._level[0].initLevel(levelObject.level3);
			g_currentLevel++;
			return g_currentLevel;
		}
		if(g_currentLevel === 3){
			entityManager._level[0].initLevel(levelObject.level4);
			g_currentLevel++;
			return g_currentLevel;
		}
		if(g_currentLevel === 4){
			entityManager._level[0].initLevel(levelObject.level5);
			g_currentLevel++;
			return g_currentLevel;
		}
	}
};

Portal.prototype.render = function(ctx) {
    this.sprite.drawCentredAt(ctx, this.cx ,this.cy);
}