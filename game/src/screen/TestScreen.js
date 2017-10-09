
var TestScreen = function() 
{
    Screen.call(this);
    this.t = 0;
};
TestScreen.prototype = Object.create(Screen.prototype);
TestScreen.prototype.constructor = TestScreen;

TestScreen.prototype.$ = function(game)
{   Screen.prototype.$.call(this,game);
    this.t = 0;
    return this;
};

TestScreen.prototype.tick = function()
{   this.t = (this.t + 1) % 600;  
    if (this.t<=300) this.setDirty();
};

TestScreen.prototype.draw = function()
{    
    this.game.vectorRenderer.startDrawing (this.screenwidth, this.screenheight);    
    this.game.vectorRenderer.addRoundedRect(10,10,100,100, 5,10, Game.getColorForDifficulty(3));
    
    var s = 150;
    if (this.t<300) {
        if (this.t<150) s = 150 - this.t/2;
        else            s = 150 - (300-this.t)/2;
    }
    this.game.vectorRenderer.addCrossArrows(250-s/2,250-s/2, s,s, Game.getColorForDifficulty(4));    
    
    this.game.vectorRenderer.flush();
};

