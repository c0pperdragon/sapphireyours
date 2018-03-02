
var Button = function()
{
    this.game = null;    
    this.x = 0.0;
    this.y = 0.0;
    this.width = 0.0;
    this.height = 0.0;
    this.triggeraction = null;    
    this.isPressed = false;
};

Button.prototype.$ = function(game, x, y, width, height, triggeraction)
{
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.triggeraction = triggeraction;
    this.isPressed = false;
};
    
Button.prototype.draw = function(vr) 
{                       
};
    
Button.prototype.setPosition = function(x,y)
{   
    this.x = x;
    this.y = y;
};
    
    // ------------------- handle touch input commands ------------
Button.prototype.onPointerDown = function(x, y)
{
    if (x>=this.x && x<this.x+this.width && y>=this.y && y<this.y+this.height)
    {   this.isPressed = true;
        return true;        
    }
    return false;
};
    
Button.prototype.onPointerUp = function()
{
    if (this.isPressed)
    {   this.isPressed = false;
        this.triggeraction.run();
    }
};
        
Button.prototype.onPointerMove = function(x, y)
{
    if (!this.isPressed)
    {   return;
    }
    this.isPressed = (x>=this.x && x<this.x+this.width && y>=this.y && y<this.y+this.height);
};
