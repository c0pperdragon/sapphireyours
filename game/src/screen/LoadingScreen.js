
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
    tr.startDrawing (this.screenwidth, this.screenheight);    
    
    tr.addString("Loading", 50,50, 50, false, Game.getColorForDifficulty(5), 
           TextRenderer.WEIGHT_PLAIN);
    tr.flush();    
};
