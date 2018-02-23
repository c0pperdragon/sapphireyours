
var Screen = function() 
{   this.game = null;   
};

Screen.prototype.$ = function(game)
{
    this.game = game;
    return this;
};

Screen.prototype.discard = function()
{
};

Screen.prototype.setDirty = function()
{
    this.game.setDirty();
};


// can be overwritten to get notified about events and things to do
// and things to report


Screen.prototype.tick = function()
{
};

Screen.prototype.draw = function()
{
};

Screen.prototype.reactivate = function()
{
};

Screen.prototype.isOverlay = function()
{   return false;
};

Screen.prototype.onResize = function()
{
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


