
var PauseButton = function()
{   Button.call(this);
};
PauseButton.prototype = Object.create(Button.prototype);
    
PauseButton.shape_pausebutton = [ 
        -60,-100,-20,-100,-60,100,-20,100, -20,100,     
        20,-100,20,-100, 60,-100,20,100,60,100 
    ];


PauseButton.prototype.$ = function(game, x, y, width, height, triggeraction)
{
    Button.prototype.$(game,x,y,width,height,triggeraction); 
    return this;
};

PauseButton.prototype.draw = function(vr) 
{                
    var width = this.width;
    var height = this.height;
    var x = this.x;
    var y = this.y;
    vr.addRoundedRect(x,y,width,height, width/2, width/2+1.0, this.isPressed ?  0xff666666 : 0xdd000000);
    vr.addShape(x+width/2,y+height/2, PauseButton.shape_pausebutton, width/3.0, 0xffffffff);
};
