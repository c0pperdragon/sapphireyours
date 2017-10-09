
var Screen = function() 
{   this.game = null;   
    this.screenwidth = 0;
    this.screenheight = 0;
};
Screen.prototype.constructor = Screen;

Screen.prototype.$ = function(game)
{
    this.game = game;
    this.screenwidth = 0;
    this.screenheight = 0;
    return this;
};

Screen.prototype.discard = function()
{
};

Screen.prototype.resize = function(width, height)
{
    this.screenwidth = width;
    this.screenheight = height;
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

// ---- key event handlers called in GL thread ----
Screen.prototype.handleKeyEvent = function(event)
{
};

Screen.prototype.handleBackNavigation = function()
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
