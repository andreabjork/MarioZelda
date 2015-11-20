// A generic contructor which accepts an arbitrary descriptor object
function Prince(descr) {
	this.setup(descr)
    // Default sprite, if not otherwise specified
    this._scale = 0.5;
	this.animations = makePrinceAnimation(this._scale);
	this.animation = this.animations['walkingLeft'];
};

// He's not really an enemy, just as stupid
Prince.prototype = new Enemy();

Prince.prototype.getSize = function(){
    var size = {sizeX:100*this._scale,sizeY:140*this._scale};
    return size;
}