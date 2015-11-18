// A generic contructor which accepts an arbitrary descriptor object
function Boss(descr) {
	this.setup(descr)
    // Default sprite, if not otherwise specified
    this._scale = 2.5;
	this.animations = makeEnemyAnimation(this._scale);
	this.animation = this.animations['walkingRight'];
};

// This comes later on when Entity has been implemented: 
Boss.prototype = new Enemy();
Boss.prototype.shotCoolDown = 100;

Boss.prototype.handleSpecificEnemyAction = function(du) {
	this._lastDir = (this.velX > 0 ? "Right" : "Left");
	console.log("direection "+this._lastDir);
	this.shotCoolDown -= du;
	if(this.shotCoolDown <= 0) {
		this.cast();
		this.shotCoolDown = 100;
	}
}

Boss.prototype.cast = function () {
	console.log("casting");
    this.state['casting'] = true;
    var dX = (this._lastDir === "Right" ? 1 : -1 );
    var dY = 0;//Math.cos(this.rotation);
    var launchDist = this.getSize().sizeX/2;
    var bulletVel = (this._lastDir === "Right" ? 7 : -7 );
	
    var relVelX = dX;
    var relVelY = dY;
    entityManager.fireBullet(
       this.cx + dX * launchDist, this.cy + dY,
       bulletVel, 0,
       0);
};