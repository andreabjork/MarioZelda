// ==========
// Level
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Level(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
}

Level.prototype = new Entity();

    
// Initial, inheritable, default values
Level.prototype.height = 14 //dæmi um hversu mörg block canvazið getur tekið.
							//geri ráð fyrir að Mario sé 2 blocks á hæð...

var levelObject =  {
	
	level1 : [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] // 20 rows
],

level2 : [
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[]
]

};					

Level.prototype.update = function (du) {

// Must-do
};

Level.prototype.BREAK_ME = -2;

Level.prototype.render = function (ctx) {
	// Must-do
	for (var i = 0; i < levelObject.level1.length; i++) {
		for (var j = 0; j < levelObject.level1[i].length; j++) {
			if (levelObject.level1[i][j] === 1) {
				util.fillBox(ctx, (g_canvas.width/20)*j, (g_canvas.height/14)*i, g_canvas.width/20, g_canvas.height/14, 'blue');
			}
		}
	} 
};
