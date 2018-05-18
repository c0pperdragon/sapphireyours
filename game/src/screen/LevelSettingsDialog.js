"use strict";
var LevelSettingsDialog = function()
{   Screen.call(this);
    
    this.level = null;  
    this.selected = 0;
    this.pointerx = 0;
    this.pointery = 0;
};
LevelSettingsDialog.prototype = Object.create(Screen.prototype);
    
    
LevelSettingsDialog.prototype.$ = function(game, level)
{   Screen.prototype.$.call(this,game); 

    this.level = level;
    this.selected = -1;
    return this;
};

LevelSettingsDialog.prototype.isOverlay = function()
{   return true;
};

LevelSettingsDialog.prototype.draw = function()
{
    var vr = this.game.vectorRenderer;                
    var tr = this.game.textRenderer;                
    vr.startDrawing ();
    tr.startDrawing ();    
    
    var w = Math.min(370, this.game.screenwidth-20);
    var h = 435;
    var x = 10;
    var y = this.game.screenheight-h-10;
    var spacing = 70;
    
    vr.addRoundedRect (x,y,w,h, 4,6, 0xcc000000);
    
    this.renderSetting(x+20,y+10, 
        "Difficulty", Game.getNameForDifficulty(this.level.difficulty),
        this.selected==0 );    
    this.renderSetting(x+20,y+10+spacing, 
        "Category", Game.getNameForCategory(this.level.category),
        this.selected==1 );
    this.renderSetting(x+20,y+10+spacing*2, 
        "Gems points needed", ""+this.level.loot,
        this.selected==2 );
    this.renderSetting(x+20,y+10+spacing*3, 
        "Swamp spreading speed", this.level.swamprate ? ""+this.level.swamprate : "Off",
        this.selected==3 );
    this.renderSetting(x+20,y+10+spacing*4, 
        "Robot speed", this.level.robotspeed ? ""+this.level.robotspeed : "Off",
        this.selected==4 );
            
    this.renderSetting(x+20,y+10+spacing*5, "", "Done", this.selected==5 );
            
    vr.flush();
    tr.flush();    
};

LevelSettingsDialog.prototype.renderSetting = function(x,y,label,value,highlight)
{
    this.game.textRenderer.addString(label, x,y, 20, false, 0xff888888, TextRenderer.WEIGHT_PLAIN);
    
    var fcol = 0xffdddddd;
    var bcol = 0xff393939;
    if (highlight)
    {   var fcol = 0xff393939;
        var bcol = 0xffdddddd;
    }
    this.game.vectorRenderer.addRoundedRect(x,y+25,330,40, 4,6, bcol);   
    this.game.textRenderer.addString(value, x+20,y+35, 20, false, fcol, TextRenderer.WEIGHT_BOLD);        
    if (label.length>0)
    {   this.game.textRenderer.addString("-", x+240,y+30, 30, false, fcol, TextRenderer.WEIGHT_BOLD);    
        this.game.textRenderer.addString("+", x+280,y+33, 30, false, fcol, TextRenderer.WEIGHT_BOLD);    
        
    }
};

LevelSettingsDialog.prototype.findAction = function(px, py)
{    
    var h = 435;
    var spacing = 70;
    for (var i=0; i<6; i++)
    {   var x = 10+20;
        var y = this.game.screenheight-h-10+10+spacing*i+25;
        if (px>=x && px<x+330 && py>=y && py<y+40) { return i; }        
    }
    return -1;
};

LevelSettingsDialog.prototype.onBackNavigation = function()
{
    this.game.removeScreen();
    this.game.getTopScreen().afterScreenCreation();
};
        
LevelSettingsDialog.prototype.onKeyDown = function(code)
{   
    var l = this.level;
    switch (code)
    {   case KeyEvent.UP:
        {   if (this.selected>0)
            {   this.selected--;
                this.setDirty();
            }
            break;                  
        }
        case KeyEvent.DOWN:
        {   if (this.selected<5)
            {   this.selected++;
                this.setDirty();
            }
        }
        case KeyEvent.LEFT:
        {   switch(this.selected)
            {   case 0: // difficulty
                {   if (l.difficulty>2) { l.difficulty--; }
                    this.setDirty();
                    break;
                }            
                case 1: // category
                {   if (l.category>0) { l.category--; }
                    this.setDirty();
                    break;
                }                        
                case 2: // loot
                {   if (l.loot>0) { l.loot--; }
                    this.setDirty();
                    break;
                }                        
                case 3: // swamp speed
                {   if (l.swamprate>0) { l.swamprate--; }
                    this.setDirty();
                    break;
                }                        
                case 4: // robot speed
                {   if (l.robotspeed>0) { l.robotspeed--; }
                    this.setDirty();
                    break;
                }                        
            }
            break;
        }
        case KeyEvent.RIGHT:
        {   switch(this.selected)
            {   case 0: // difficulty
                {   if (l.difficulty<9) { l.difficulty++; }
                    this.setDirty();
                    break;
                }            
                case 1: // category
                {   if (l.category<7) { l.category++; }
                    this.setDirty();
                    break;
                }                        
                case 2: // loot
                {   l.loot++;
                    this.setDirty();
                    break;
                }                        
                case 3: // swamp speed
                {   l.swamprate++;
                    this.setDirty();
                    break;
                }                        
                case 4: // robot speed
                {   l.robotspeed++;
                    this.setDirty();
                    break;
                }                        
            }
            break;
        }
        case KeyEvent.A:
        {   if (this.selected==5) 
            {   this.onBackNavigation();
            }
            break;
        }
    }
};


LevelSettingsDialog.prototype.onPointerDown = function(x, y)
{
    this.pointerx = x;
    this.pointery = y;
    
    var sel = this.findAction(x,y);
    if (sel!=this.selected)
    {   this.selected = sel;
        this.setDirty();
    }
};
    
LevelSettingsDialog.prototype.onPointerUp = function()
{
    if (this.selected>=0 && this.findAction(this.pointerx,this.pointery)==this.selected)
    {           
        if (this.selected<=4)
        {   this.onKeyDown(this.pointerx < 295 ? KeyEvent.LEFT : KeyEvent.RIGHT);
        } 
        else
        {   this.onKeyDown(KeyEvent.A);
        }
    }       
};
    
LevelSettingsDialog.prototype.onPointerMove = function(x, y)
{
    this.pointerx = x;
    this.pointery = y;
};


