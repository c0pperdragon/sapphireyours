
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
    var vr = this.game.vectorRenderer;
    vr.startDrawing (this.screenwidth, this.screenheight);  
    var tr = this.game.textRenderer;
    tr.startDrawing (this.screenwidth, this.screenheight);    
    var gr = this.game.gfxRenderer;
    gr.startDrawing (this.screenwidth, this.screenheight);    
    
    vr.addRoundedRect(10,10,100,100, 5,10, Game.getColorForDifficulty(3));   
    var s = 150;
    if (this.t<300) {
        if (this.t<150) s = 150 - this.t/2;
        else            s = 150 - (300-this.t)/2;
    }
    vr.addCrossArrows(250-s/2,250-s/2, s,s, Game.getColorForDifficulty(4));        
    
    tr.addString("Hello World", 50,400, 50, false, Game.getColorForDifficulty(5), 
           TextRenderer.WEIGHT_PLAIN);
           
    gr.addGraphic(gr.TITLEPICTURE, 200,11, 100,100);
           
    gr.flush();
    vr.flush();
    tr.flush();    
};
