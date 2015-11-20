//constructor for the Score
function Score(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

//update Score as a multiple of the combo
//generated in g_ball.update
Score.prototype.add = function(x){
	this.score = this.score + x;
}

//update Score as a multiple of the combo
//generated in g_ball.update
Score.prototype.half = function(){
	this.score = Math.ceil(this.score/2);
}


//reset to initial score,life and level
Score.prototype.reset = function (){
	this.score = 0;
}


//render score
Score.prototype.render = function(ctx){
	
	ctx.save();
	
	ctx.fillStyle = "white";
	ctx.font="Bold 15px Arial";
    ctx.fillText('Score: ' + this.score, g_canvas.width-100, 20);
	ctx.fillText('Lives: ', 20, 25);
	if (entityManager._character[0]) {
		for (var i = 0; i < entityManager._character[0].life; i++) {
			ctx.drawImage(g_images.zeldaSpriteSheet, 0, 135, 28, 178-135, 65 + i*30, 10, 28, 178-135);
		}
	}
	ctx.restore();
}

