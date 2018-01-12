
var Screen = function() 
{   this.game = null;   
    this.screenwidth = 0;
    this.screenheight = 0;
};
Screen.prototype.constructor = Screen;

Screen.prototype.$ = function(game,width,height)
{
    this.game = game;
    this.screenwidth = game.screenwidth;
    this.screenheight = game.screenheight;
    return this;
};

Screen.prototype.discard = function()
{
};

Screen.prototype.resize = function()
{
    this.screenwidth = this.game.screenwidth;
    this.screenheight = this.game.screenheight;
};

Screen.prototype.setDirty = function()
{   this.game.setDirty();
};

// can be overwritten to get notified about events and things to do

Screen.prototype.onResize = function()
{
};

Screen.prototype.tick = function()
{
};

Screen.prototype.draw = function()
{
};

Screen.prototype.isOverlay = function()
{   return false;
};

// ---- default key event handlers  ----
Screen.prototype.onKeyDown = function(keycode)
{
};

Screen.prototype.onKeyUp = function(keycode)
{
};

Screen.prototype.onBackNavigation = function()
{
    this.game.removeScreen();
};
    
// interface for simplified touch events. 
Screen.prototype.onPointerDown = function(x, y)
{
};

Screen.prototype.onPointerUp = function()
{
};

Screen.prototype.onPointerMove = function(x,y)
{
};

// some toolbox methods to be used on various screens

/** 
 * 	Create string of the form m:ss of a given number of seconds. 
 *  Only non-negative seconds work correctly.
 */ 

Screen.buildTimeString = function(seconds)
{
    var s = seconds%60;
    var m = seconds - s*60;
    if (s>=10)
    {   return m+":"+s;
    }
    else
    {	return m+":0"+s;
    }			
} ;
