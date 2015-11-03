// Running Sprites

"use strict";

/*jslint browser: true, devel: true, white: true */

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// =================
// KEYBOARD HANDLING
// =================

var keys = [];

function handleKeydown(evt) {
    keys[evt.keyCode] = true;
}

function handleKeyup(evt) {
    keys[evt.keyCode] = false;
}

// Inspects, and then clears, a key's state
//
// This allows a keypress to be "one-shot" e.g. for toggles
// ..until the auto-repeat kicks in, that is.
//
function eatKey(keyCode) {
    var isDown = keys[keyCode];
    keys[keyCode] = false;
    return isDown;
}

// A tiny little convenience function
function keyCode(keyChar) {
    return keyChar.charCodeAt(0);
}

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);

var KEY_NEXT = keyCode(" ");

// UTILS
// =====

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var g_spriteSheet;

var g_row = 0;
    
function preload() {
    g_spriteSheet = new Image();
    g_spriteSheet.onload = callback;
    g_spriteSheet.src = "zeldass.png"
}

function loadNext(){
    g_cel = 0;
    g_row = (g_row+1)%7;
    preloadDone();
}

function Sprite(sx, sy, width, height) {
    this.sx = sx;
    this.sy = sy;
    this.width = width;
    this.height = height;
    this.image = g_spriteSheet;
}

Sprite.prototype.drawAt = function (x, y) {
    ctx.drawImage(this.image, 
                  this.sx, this.sy, this.width, this.height,
                  x, y, this.width, this.height);
}

var g_sprites;

function sumFirst(num, array){
    var sum = 0;
    for(var i=0; i<num; i++){
        sum += array[i];
    }
    return sum;
}

function preloadDone() {
    
    var celWidthAll  = [30,33,31,30,30,33,31];
    var celHeightAll = [42,43,44,42,48,43,44];
    var numColsAll = [10,4,2,5,4,5,3];
    var numCols = numColsAll[g_row];
    var celWidth = celWidthAll[g_row];
    var celHeight = celHeightAll[g_row];
    g_sprites = [];
    var sprite;
    
    for (var col = 0; col < numCols; ++col) {
        sprite = new Sprite(col * celWidth, sumFirst(g_row,celHeightAll),
                            celWidth, celHeight) 
        g_sprites.push(sprite);
    }
    
    // Remove any superfluous ones from the end
    //g_sprites.splice(numCels);
    
    console.dir(g_sprites);
}

function callback(){
    preloadDone();
    main();
}

var g_cel = 0;

function main() {
    if(eatKey(KEY_NEXT)) loadNext();
    clearCanvas();
    
    ctx.fillText(""+g_cel, 10, 10);
    
    var cel = g_sprites[g_cel]

    // Primary instance
    cel.drawAt(50, 50);
    
    // Horizontal run
    //cel.drawAt(50 + g_cel * 6, 50);
    
    // Diagonal run
    //cel.drawAt(50 + g_cel * 5, g_cel * 10);
    
    // Backwards
    ctx.scale(-1, 1);
    //cel.drawAt(-50 - cel.width, 250);
    ctx.scale(-1, 1);
    
    ++g_cel;
    if (g_cel === g_sprites.length) g_cel = 0;
    
    // A poor man's cross-browser "requestAnimationFrame"
    setTimeout(main, 100);
}

preload();
