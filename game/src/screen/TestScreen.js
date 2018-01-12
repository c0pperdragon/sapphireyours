
var TestScreen = function() 
{
    Screen.call(this);
    this.t = 0;
};
TestScreen.prototype = Object.create(Screen.prototype);

TestScreen.prototype.$ = function(game)
{   Screen.prototype.$.call(this,game);
    this.t = 0;
    return this;
};

TestScreen.prototype.tick = function()
{   this.t = (this.t + 1) % 600;  
//    if (this.t<=300) 
    this.setDirty();
};

TestScreen.prototype.draw = function()
{    
    var vr = this.game.vectorRenderer;
    vr.startDrawing (this.screenwidth, this.screenheight);  
    var tr = this.game.textRenderer;
    tr.startDrawing (this.screenwidth, this.screenheight);    
    var gr = this.game.gfxRenderer;
    gr.startDrawing (this.screenwidth, this.screenheight);    
    var tir = this.game.tileRenderer;
    tir.startDrawing (this.screenwidth, this.screenheight, 60, 0,0,0,0);
    
    vr.addRoundedRect(10,10,100,100, 5,10, Game.getColorForDifficulty(3));   
    var s = 150;
    if (this.t<300) {
        if (this.t<150) s = 150 - this.t/2;
        else            s = 150 - (300-this.t)/2;
    }
    vr.addCrossArrows(250-s/2,250-s/2, s,s, Game.getColorForDifficulty(4));        
    
    tr.addString("Hello World", 50,350, 50, false, Game.getColorForDifficulty(5), 
           TextRenderer.WEIGHT_PLAIN);
           
    gr.addGraphic(gr.TITLEPICTURE, 200,11, 100,100);
           
    tir.addTile(300,300, 0);
    tir.addTile(370,300, 1 + (Math.floor(this.t%60)<<16));
    tir.addTile(440,300, 1 + (Math.floor((this.t%360)*60)<<16));
           
    gr.flush();
    vr.flush();
    tr.flush();    
    tir.flush();
};
