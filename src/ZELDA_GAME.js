// ==========
// ZELDA GAME
// ==========
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

//==========
// SCORE
//==========
   
var g_score = new Score({
    score : 0
});

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
    
    if (g_menuScreenOn) {
		console.log("AT MENU");
		menuScreen = g_sprites.menuBar;
        if (eatKey(KEY_SPACE)) {
			g_menuScreenOn = false;
			if(g_firstTry){
				g_firstTry = false;
				g_textScreenOn = true;
				menuScreen = g_sprites.textScreen1;
			} else {
				g_newGame = false;
				initLevel();
			}
			return;
        }
    }
    if (g_textScreenOn) {
		console.log("AT STORY");
		menuScreen = g_sprites.textScreen1;
        if (eatKey(KEY_SPACE)) {
			if (g_newGame) {
				g_newGame = false;
				// Add listener to perform action when audio has finished playing
				try {
					g_audio.patStory.addEventListener('ended', function () {
						initLevel();
						g_textScreenOn = false;
					});
				} catch(err) {}
				util.play(g_audio.patStory);
			} else {
				g_textScreenOn = false;
				util.playLoop(g_audio.theme1);
				entityManager.enterLevel(1);
			}
			return;
        }
    }
    
    if (g_deathScreenOn) {
		console.log("AT DEATH");
        if (eatKey(KEY_SPACE)) {
            g_deathScreenOn = false;
            g_menuScreenOn = true;
			menuScreen = g_sprites.menuBar;
            backgroundMusic.pause();
            util.playLoop(g_audio.theme2);
			console.log("resetting spatialManager");
			util.resetSpatialManager();
			console.dir(spatialManager);
			
			console.log("resetting entityManager");
			util.resetEntityManager();
			console.dir(entityManager);
			
			
			g_newGame = true;
			return;
        }
    }
    
    entityManager.update(du); 

}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_renderSpatialDebug = false;
var g_viewPort = {x:0, y:0};
var g_isMuted = false;

var KEY_MUTE   = keyCode('M');
var KEY_SPATIAL = keyCode('X');
var KEY_SPACE = keyCode(' ');

var KEY_RESET = keyCode('R');

var KEY_LEVEL1 = keyCode('1');
var KEY_LEVEL2 = keyCode('2');
var KEY_LEVEL3 = keyCode('3');
var KEY_LEVEL4 = keyCode('4');
var KEY_LEVEL5 = keyCode('5');

// hér má bæta við lykklum fyrir tests ásamt falli fyrir neðan 
// í Diagnostics svosem "spawna óvin"

function processDiagnostics() {

    if (eatKey(KEY_MUTE)) {
        if (g_isMuted) {
            backgroundMusic.play();
        } else {
            backgroundMusic.pause();
        }
		g_isMuted = !g_isMuted;
    };

    if (eatKey(KEY_SPATIAL)) 
		g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_RESET)) entityManager.resetAll();

    if (eatKey(KEY_LEVEL1)) {
        if (!g_menuScreenOn && !g_deathScreenOn) entityManager.enterLevel(1);
    };
    if (eatKey(KEY_LEVEL2)) {
        if (!g_menuScreenOn && !g_deathScreenOn) entityManager.enterLevel(2);
    };
    if (eatKey(KEY_LEVEL3)) {
        if (!g_menuScreenOn && !g_deathScreenOn) entityManager.enterLevel(3);
    };
    if (eatKey(KEY_LEVEL4)) {
        if (!g_menuScreenOn && !g_deathScreenOn) entityManager.enterLevel(4);
    };
    if (eatKey(KEY_LEVEL5)) {
        if (!g_menuScreenOn && !g_deathScreenOn) entityManager.enterLevel(5);
    };
}


// =================
// RENDER SIMULATION
// =================

// GAME-SPECIFIC RENDERING
var g_lvlLength;
var g_newGame = true;
var g_firstTry = true;
var g_menuScreenOn = true;
var g_textScreenOn = false;
var g_deathScreenOn = false;
var menuScreen;

function renderSimulation(ctx) {
    
    if (g_menuScreenOn || g_textScreenOn) {
        menuScreen.drawAt(ctx, 0, 0, g_canvas.width, g_canvas.height);
    } else {
        ctx.save();
	
        var dx = g_viewPort.x;
        var dy = g_viewPort.y;
    
        var lvlLength;
        lvlLength = entityManager._world[0].blocks[13].length*(g_canvas.height/14) - g_canvas.width;
        g_sprites.BG1.drawAt(ctx, 0,0, g_canvas.width, g_canvas.height);
        g_sprites.BG2.drawAt(ctx, -(dx / lvlLength) * g_canvas.width ,g_canvas.height/2, g_canvas.width*2, g_canvas.height);
        
        ctx.translate(-dx,-dy);
        entityManager.render(ctx);
    
        if (g_renderSpatialDebug) spatialManager.render(ctx);
        ctx.restore();
        
        if (g_deathScreenOn) g_sprites.deathScreen.drawAt(ctx, 0, 0, g_canvas.width, g_canvas.height);       
        g_score.render(ctx);
    }
};


// =============
// PRELOAD STUFF
// =============

var g_images = {};
var g_audio = {};
var backgroundMusic;

function requestPreloads() {

    var requiredImages = {
        menuBar: "res/images/menuBar.jpg",
        textScreen1: "res/images/textScreen1.png",
        deathScreen: "res/images/deathScreen.png",
        marioTest: "res/images/mario.png",
        zeldaSpriteSheet: "res/images/zeldass.png",
        enemySpriteSheet: "res/images/enemyss.png",
        enemy2SpriteSheet: "res/images/enemyss2.png",
		bowserSpriteSheet: "res/images/Patt_Sheet.png",
        spellSpriteSheet: "res/images/spellss.png",
        spell2SpriteSheet: "res/images/spellss2.png",
		defaultBlock: "res/images/blockPlaceholder.png",
        background: "res/images/background.jpg",
        spikes: "res/images/spikes.png",
        coinBox: "res/images/Coin_Box.png",
        water: "res/images/water-translucent.png",
        ground: "res/images/Ground1.png",
        dungeon: "res/images/dungeonBrick.png",
        cloud1: "res/images/Cloud1.png",
        cloud2: "res/images/cloud2.png",
        cloud3: "res/images/cloud3.png",
        background1: "res/images/MainBackground.png",
        background2: "res/images/Hills1.png",
        coin: "res/images/Coin.png",
        blank: "res/images/blank.png",
        portal: "res/images/Portal.png"
    };

    imagesPreload(requiredImages, g_images, imagePreloadDone);
};

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
    zelda.idleRight = new Animation(g_images.zeldaSpriteSheet,510,19,42,1,1,scale);
    zelda.idleLeft = new Animation(g_images.zeldaSpriteSheet,510,19,42,1,1,-scale);
    zelda.magicRight = new Animation(g_images.zeldaSpriteSheet,320,51,48,6,100,scale);
    zelda.magicLeft = new Animation(g_images.zeldaSpriteSheet,320,51,48,6,100,-scale);

    return zelda;
};

function makeBowserAnimation(scale) {
    var bowser = {};
	//image, frameY, frameWidth, frameHeight, numFrames, interval, scale
    bowser.idleRight = new Animation(g_images.bowserSpriteSheet,0,200,200,3,600,scale);
    bowser.idleLeft = new Animation(g_images.bowserSpriteSheet,0,200,200,3,600,-scale);
    bowser.attackRight = new Animation(g_images.bowserSpriteSheet,200,199,200,5,400,scale);
    bowser.attackLeft = new Animation(g_images.bowserSpriteSheet,200,199,200,5,400,-scale);
	bowser.takeDamageRight = new Animation(g_images.bowserSpriteSheet,400,200,200,4,400,scale);
    bowser.takeDamageLeft = new Animation(g_images.bowserSpriteSheet,400,200,200,4,400,-scale);
    bowser.dieRight = new Animation(g_images.bowserSpriteSheet,600,200,200,4,350,scale);
    bowser.dieLeft = new Animation(g_images.bowserSpriteSheet,600,200,200,4,350,-scale);

	console.log(bowser); 
	
    return bowser;
};

function makeEnemyAnimation(scale) {
    var enemy = {};
    enemy.walkingRight = new Animation(g_images.enemySpriteSheet,0,20,20,2,80, scale);
    enemy.walkingLeft = new Animation(g_images.enemySpriteSheet,0,20,20,2,80,-scale);
    enemy.inAirRight = new Animation(g_images.enemySpriteSheet,20,20,20,1,1,scale);
    enemy.inAirLeft = new Animation(g_images.enemySpriteSheet,20,20,20,1,1,-scale);
    enemy.swimmingRight = new Animation(g_images.enemySpriteSheet,40,20,20,2,80,scale);
    enemy.swimmingLeft = new Animation(g_images.enemySpriteSheet,40,20,20,2,80,-scale);
	enemy.death = new Animation(g_images.enemySpriteSheet,60,20,20,1,50,scale);

    return enemy;
};

function makeShootingEnemyAnimation(scale) {
    var enemy = {};
    enemy.walkingRight = new Animation(g_images.enemy2SpriteSheet,0,20,20,2,80, scale);
    enemy.walkingLeft = new Animation(g_images.enemy2SpriteSheet,0,20,20,2,80,-scale);
    enemy.inAirRight = new Animation(g_images.enemy2SpriteSheet,20,20,20,1,1,scale);
    enemy.inAirLeft = new Animation(g_images.enemy2SpriteSheet,20,20,20,1,1,-scale);
    enemy.swimmingRight = new Animation(g_images.enemy2SpriteSheet,40,20,20,2,80,scale);
    enemy.swimmingLeft = new Animation(g_images.enemy2SpriteSheet,40,20,20,2,80,-scale);
    enemy.death = new Animation(g_images.enemy2SpriteSheet,60,20,20,1,50,scale);

    return enemy;
};

function makeZeldaSpellAnimation(scale) {
    return new Animation(g_images.spellSpriteSheet,0,15,10,5,100, scale);
};

function makeEnemySpellAnimation(scale) {
    return new Animation(g_images.spell2SpriteSheet,0,15,10,5,100, scale);
};

function imagePreloadDone() {
    var requiredAudio = {
        theme1: "res/sounds/thema1.ogg",
        theme2: "res/sounds/thema2.ogg",
        themeDeath: "res/sounds/daudi.ogg",
        victoryTheme: "res/sounds/victory.ogg",
        zeldaShoot: "res/sounds/zelda-shot.ogg",
        portal: "res/sounds/portal.ogg",
        coin: "res/sounds/coin.ogg",
        brick: "res/sounds/brick.ogg",
        boop: "res/sounds/boop.ogg",
        patClown: "res/sounds/Patt_clown.ogg",
        patIdiot: "res/sounds/Patt_idiot.ogg",
        patFraud: "res/sounds/Patt_uselessFraud.ogg",
        patStory: "res/sounds/Patt_stories.ogg"
    }
    audioPreload(requiredAudio, g_audio, preloadDone);
};

function preloadDone() {

    g_sprites.menuBar = new Sprite(g_images.menuBar);
    g_sprites.textScreen1 = new Sprite(g_images.textScreen1);
    g_sprites.deathScreen = new Sprite(g_images.deathScreen);
    g_sprites.marioTest  = new Sprite(g_images.marioTest);
    g_sprites.defaultBlock  = new Sprite(g_images.defaultBlock);
    g_sprites.background = new Sprite(g_images.background);
	g_sprites.blank = new Sprite(g_images.blank);
    g_sprites.spikes = new Sprite(g_images.spikes);
    g_sprites.coinBox = new Sprite(g_images.coinBox);
    g_sprites.water = new Sprite(g_images.water);
    g_sprites.ground = new Sprite(g_images.ground);
    g_sprites.dungeon = new Sprite(g_images.dungeon);
    g_sprites.BG1 = new Sprite(g_images.background1);
    g_sprites.BG2 = new Sprite(g_images.background2);
    g_sprites.cloud1 = new Sprite(g_images.cloud1);
    g_sprites.cloud2 = new Sprite(g_images.cloud2);
    g_sprites.cloud3 = new Sprite(g_images.cloud3);
    g_sprites.coin = new Sprite(g_images.coin);
    g_sprites.portal = new Sprite(g_images.portal);
    
    g_audio.theme1.volume = 0.8;
    g_audio.coin.volume = 0.7;
    
    menuScreen = g_sprites.menuBar;
    
    main.init();
    
    backgroundMusic = g_audio.theme2;
    util.playLoop(g_audio.theme2);
    
};

function initLevel() {

    entityManager.enterLevel(1);
    
    g_lvlLength = entityManager._world[0].blocks[13].length*(g_canvas.height/14) - g_canvas.width;
    
    backgroundMusic.pause();
    util.playLoop(g_audio.theme1);
};

// Kick it off
requestPreloads();