"use strict";
var LoadingScreen = function() 
{
    Screen.call(this);
};
LoadingScreen.prototype = Object.create(Screen.prototype);

LoadingScreen.prototype.$ = function(game)
{   Screen.prototype.$.call(this,game);
    return this;
};

LoadingScreen.prototype.draw = function()
{    
    var tr = this.game.textRenderer;
    tr.startDrawing (this.game.screenwidth, this.game.screenheight);    
    
	var msg = "Loading...";
	var h = 50;
    tr.addString
	(	msg, 
		this.game.screenwidth/2 - tr.determineStringWidth(msg,40)/2, 
		this.game.screenheight/2 - h/2,
		h, 
		false, 
		0xffffffff, 
		TextRenderer.WEIGHT_PLAIN
	);
    tr.flush();    
};
