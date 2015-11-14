//constructor for the Score
function Score(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

//update Score as a multiple of the combo
//generated in g_ball.update
Score.prototype.update = function(x){
	this.score = this.score + x;
}

//render score
Score.prototype.render = function(ctx){
	
	ctx.save();
	
	ctx.fillStyle = "white";
	ctx.font="Bold 15px Arial";
    ctx.fillText('Score: ' + this.score, g_canvas.width-100, 20);
	
	ctx.restore();
}

//reset to initial score,life and level
Score.prototype.reset = function (){
	this.score = 0;
}
