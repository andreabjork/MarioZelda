// =========
// MARIO
// =========
/*

TO-DO:

Þessi texti sem verður hérna í staðin fyrir þennan shitty To-do lista 
og lýsir leiknum okkar copyright claims, authors,  og allt þannig stuff...

Spurning um að útbúa level clasa sem entity manangerinn getur notað til að 
einfallda að hafa mörg level sem entity manangerinn getur haldið utanum...

þessi kóði hér gerir ráð fyrir falli "resetAll" í entityManager má skoða / breyta

Á eftir að fylla innní föll + bæta við í  Block.js / Character.js og Projectile.js

Bæta við link á sprites hér neðst í þessu skjali, útskýrt nánar þar..

Velja okkur gluggastærð. getum stillt það  í globals.js

er með hér inná öll helper functions frá Pat til að passa uppá compatability við ykkar dót
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ===============
// CREATE INITIAL 
// ===============

function createInitialStuff() {

	//Sniðugt að búa til alla units í Levelinu hér og svoleiðis til 
	// allt sé loadað áðurenn hann byrjar render/update
	//AKA það er betra að hafa þetta sem part af "loading" frekar en 
	//byrjunar laggi
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    
    entityManager.update(du);

}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_renderSpatialDebug = false;
var g_renderExtraDebug = false;
var g_viewPort = {x:0, y:0};

var KEY_MIXED   = keyCode('M');
var KEY_SPATIAL = keyCode('X');
var KEY_EXTRA_INFO = keyCode('V');

var KEY_RESET = keyCode('R');

// hér má bæta við lykklum fyrir tests ásamt falli fyrir neðan 
// í Diagnostics svosem "spawna óvin"

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_SPATIAL)) 
		g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_EXTRA_INFO)) 
		g_renderExtraDebug = !g_renderExtraDebug;

    if (eatKey(KEY_RESET)) entityManager.resetAll();
}


// =================
// RENDER SIMULATION
// =================

// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
    
    ctx.save();
	
	var dx = g_viewPort.x;
	var dy = g_viewPort.y;

	var lvlLength = entityManager._level[0].Blocks[13].length*(g_canvas.height/14) - g_canvas.width;
    
	g_sprites.BG1.drawAt(ctx, 0,0, g_canvas.width, g_canvas.height);
    g_sprites.BG2.drawAt(ctx, -(dx / lvlLength) * g_canvas.width ,g_canvas.height/2, g_canvas.width*2, g_canvas.height);
    
    ctx.translate(-dx,-dy);
    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
    ctx.restore();
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        marioTest: "res/images/mario.png",
        zeldaSpriteSheet: "res/images/zeldass.png",
		defaultBlock: "res/images/blockPlaceholder.png",
        background: "res/images/background.jpg",
		spikes: "res/images/SpikeBall.gif",
		coinBox: "res/images/Coin_Box.png",
		water: "res/images/water.png",
        ground: "res/images/Ground1.png",
        dungeon: "res/images/dungeonBrick.png",
		cloud: "res/images/shitty_cloud.png",
		background1: "res/images/MainBackground.png",
		background2: "res/images/Hills1.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};
var g_animations = {};
function makeZeldaAnimation(scale) {
    var zelda = {};
    zelda.walkingRight = new Animation(g_images.zeldaSpriteSheet,0,30,42,10,100, scale);
    zelda.walkingLeft = new Animation(g_images.zeldaSpriteSheet,0,30,42,10,100,-scale);
    zelda.runningRight = new Animation(g_images.zeldaSpriteSheet,44,33,43,4,100, scale);
    zelda.runningLeft = new Animation(g_images.zeldaSpriteSheet,44,33,43,4,100,-scale);
    zelda.inAirRight = new Animation(g_images.zeldaSpriteSheet,89,31,44,2,100,scale);
    zelda.inAirLeft = new Animation(g_images.zeldaSpriteSheet,89,31,44,2,100,-scale);
    zelda.idleRight = new Animation(g_images.zeldaSpriteSheet,135,30,42,1,10,scale);
    zelda.idleLeft = new Animation(g_images.zeldaSpriteSheet,135,30,42,1,10,-scale);
    zelda.magicRight = new Animation(g_images.zeldaSpriteSheet,320,51,48,6,100,scale);
    zelda.magicLeft = new Animation(g_images.zeldaSpriteSheet,320,51,48,6,100,-scale);

    return zelda;
}



function preloadDone() {

    g_sprites.marioTest  = new Sprite(g_images.marioTest);
    g_sprites.defaultBlock  = new Sprite(g_images.defaultBlock);
    g_sprites.background = new Sprite(g_images.background);
    g_sprites.spikes = new Sprite(g_images.spikes);
	g_sprites.coinBox = new Sprite(g_images.coinBox);
	g_sprites.water = new Sprite(g_images.water);
    g_sprites.ground = new Sprite(g_images.ground);
    g_sprites.dungeon = new Sprite(g_images.dungeon);
	g_sprites.BG1 = new Sprite(g_images.background1);
	g_sprites.BG2 = new Sprite(g_images.background2);
	g_sprites.cloud = new Sprite(g_images.cloud);
	
    entityManager.init();

    main.init();
    
    entityManager._level[0].initLevel(levelObject.level1);
}

// Kick it off
requestPreloads();