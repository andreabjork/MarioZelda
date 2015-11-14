function Portal(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    
    this.sprite = g_sprites.portal;
};

Portal.prototype.update = function(du) {
    this.cx = g_lvlLength - 110;
    this.cy = g_canvas.height - 200;
};

Portal.prototype.render = function(ctx) {
    this.sprite.drawCentredAt(ctx, this.cx ,this.cy);
}