"use strict";
var LevelSelectionScreen = function()
{
    Screen.call(this);
    
    this.selectingcriterium = false;    
    this.selectedcriterium = 0;
    this.selectedlevel = 0;
    
    this.filteredlevels = [];    
    this.listscrolly = 0;
    
    this.pointerdownx = 0;
    this.pointerdowny = 0;
    this.pointerx = 0;
    this.pointery = 0;
    this.pointeractive = false;    
};
LevelSelectionScreen.prototype = Object.create(Screen.prototype);

LevelSelectionScreen.prototype.$ = function (game)
{   Screen.prototype.$.call(this,game);

    this.selectingcriterium = true;
    this.selectedcriterium = 0;
    this.selectedlevel = 0;

    this.filterAndSortLevels();
    return this;
};

    
LevelSelectionScreen.prototype.draw = function()
{
    var screenwidth = this.game.screenwidth;
    var screenheight = this.game.screenheight;    
    var menuwidth = Math.min(300, screenwidth);                 
    
    var background = 0xff000000;
    var buttonnormal = 0xff303030;
    var rowheight = 32;
    var textcolor = 0xffbbbbbb;
    var bigtext = 30;
    var smalltext = 21;

    
    var vr = this.game.vectorRenderer;
    var tr = this.game.textRenderer;
    var lr = this.game.levelRenderer;
    
    // paint level underlay
    if (this.selectedlevel<this.filteredlevels.length)
    {   var l = this.filteredlevels[this.selectedlevel];
        var lo = (new Logic()).$();
        lo.attach(l, (new Walk()).$randomseed(0));
        lr.startDrawingMini(menuwidth, l.getWidth(),l.getHeight());
        lr.draw(lo, 0);
        lr.flush();
    }        
    
    vr.startDrawing();
    tr.startDrawing();
    lr.startDrawDecoration();    
    vr.addRoundedRect(0,0,menuwidth,screenheight, 3, 4, background);
    var x = 10;
    var y = 5;
    
    // mode to select a category/difficulty
    if (this.selectingcriterium)
    {           
        var buttonheight = rowheight-2;
        var buttonwidth = menuwidth/2 - x - 2;

        lr.addDecorationPieceToBuffer (x+17,y+19,SAPPHIRE);
        tr.addString
        (   "Sapphire", x+40, y, smalltext,
            false, 0xff2689fb, TextRenderer.WEIGHT_BOLD
        );
        tr.addString
        (   "Yours", x+40, y+18, smalltext,
            false, 0xff2689fb, TextRenderer.WEIGHT_BOLD
        );
        y+=60;
        
        tr.addString
        (   "Difficulty", x, y, bigtext,
            false, textcolor, TextRenderer.WEIGHT_PLAIN
        );
        y += rowheight;
        
        for (var bu=0; bu<8; bu++)
        {   var column = bu%2;
            var x2 = x+column*(buttonwidth+2);
            var d = pos2difficulty(bu);
            var sel = (this.selectedcriterium==bu);
            vr.addRoundedRect
            (   x2,y,buttonwidth,buttonheight, 3,4, 
                sel ? Game.getColorForDifficulty(d) : buttonnormal
            );
            tr.addString
            (   " " + String.fromCharCode(Game.getIconForDifficulty(d)) 
                + " " + Game.getNameForDifficulty(d), 
                x2, 
                y + (buttonheight-smalltext)/2, 
                smalltext, 
                false, 
                sel ? 0xff000000 : Game.getColorForDifficulty(d), 
                TextRenderer.WEIGHT_BOLD
            );
            if (column==1) { y+=rowheight; }
        }
        
        y += rowheight/2;
        tr.addString
        (   "Category", x, y, rowheight, 
            false, textcolor, TextRenderer.WEIGHT_PLAIN
        );
        y += rowheight;
        
        for (var bu=8; bu<16; bu++)
        {   var column = bu%2;
            var x2 = x+column*(buttonwidth+2);
            var c = pos2category(bu);
            var sel = (this.selectedcriterium==bu);
            vr.addRoundedRect
            (   x2,y,buttonwidth,buttonheight, 3,4, 
                sel ? textcolor : buttonnormal
            );
            tr.addString
            (   " " + String.fromCharCode(Game.getIconForCategory(c)) 
                    + " " + Game.getNameForCategory(c), 
                x2, 
                y + (buttonheight-smalltext)/2, 
                smalltext, 
                false,
                sel ? 0xff000000 : 0xffffffff, TextRenderer.WEIGHT_BOLD
            );
            if (column==1) { y+=rowheight; }
        }
    }
    // mode to select an individual level
    else
    {
        y += this.listscrolly;

        var buttonheight = rowheight-2;
        var buttonwidth = menuwidth - 2*x - 2;

        var d = pos2difficulty(this.selectedcriterium);
        if (d>=0) 
        {   tr.addString
            (   Game.getNameForDifficulty(d), x, y, bigtext,
                false, Game.getColorForDifficulty(d), TextRenderer.WEIGHT_PLAIN
            );
        } 
        var c = pos2category(this.selectedcriterium);
        if (c>=0) 
        {   tr.addString
            (   Game.getNameForCategory(c), x, y, bigtext,
                false, textcolor, TextRenderer.WEIGHT_PLAIN
            );
        }
        y += 1.5*rowheight;

        for (var i=0; i<this.filteredlevels.length; i++)
        {             
            var l = this.filteredlevels[i];            
            var color = Game.getColorForDifficulty(l.getDifficulty());
            var sel = (this.selectedlevel==i);            
            if (sel)
            {   vr.addRoundedRect
                (   x,y,buttonwidth,buttonheight, 3,4, 
                    color
                );
            }
            else
            {   vr.addRectangle
                (   x,y,buttonwidth,buttonheight, 
                    buttonnormal
                );
            }
            tr.addString
            (   " " 
                + String.fromCharCode
                (   c<0 ? Game.getIconForCategory(l.getCategory())
                        : Game.getIconForDifficulty(l.getDifficulty()) 
                )
                + " " + l.getTitle(), 
                x, 
                y + (buttonheight-smalltext)/2, 
                smalltext, 
                false,
                sel ? 0xff000000 : color, TextRenderer.WEIGHT_BOLD
            );
            y += rowheight;
        }
    }
    
    vr.flush();
    tr.flush();
    lr.flush();
};

function pos2difficulty(pos)
{
    if (pos<0 || pos>=8) { return -1; }
    return 2 + Math.floor(pos/2) + 4*(pos%2);
}
function pos2category(pos)
{
    switch (pos)
    {   case 8:    return 0;   // Fun
        case 10:   return 4;   // Puzzle
        case 12:  return 1;    // Travel
        case 14:  return 6;    // Work
        case 9:   return 5;    // Science
        case 11:  return 2;    // Speed
        case 13:  return 7;    // Survival
        case 15:  return 3;    // Fighting
        default: return -1;
    }    
}

LevelSelectionScreen.prototype.filterAndSortLevels = function()
{
    this.filteredlevels.length = 0;

    var pos = this.selectedcriterium;    
    for (var i=0; i<this.game.levelpacks.length; i++)
    {   var p = this.game.levelpacks[i];
        for (var j=0; j<p.numberOfLevels(); j++)
        {   var l = p.getLevel(j);
            if 
            (   pos2difficulty(pos) == l.getDifficulty() 
                || pos2category(pos) == l.getCategory()
            )
            {   this.filteredlevels.push(l);
            }
        }
    }
    
    this.filteredlevels.sort
    (   function(la, lb) 
        {   if (pos2category(pos)>=0) 
            {   var dd = la.getDifficulty() - lb.getDifficulty();
                if (dd!=0) return dd;
            }
            var a = la.getTitle();
            var b = lb.getTitle();
            return (a<b?-1:(a>b?1:0));  
        }
    );    
}

LevelSelectionScreen.prototype.scrollToVisible = function()
{
    if (this.selectingcriterium) { return; }
    
    var top = 5 + 1.5*32;
    var bottom = this.game.screenheight - 37; 
    var cursory = 5 + this.listscrolly + 1.5*32 + 32*this.selectedlevel;
    if (cursory<top)
    {   this.listscrolly += (top-cursory);
    }
    else if (cursory>bottom)
    {   this.listscrolly -= (cursory-bottom);
    }
}

// ---- key event handlers --
LevelSelectionScreen.prototype.onKeyDown = function(keycode)
{    
    if (this.selectingcriterium)
    {   switch (keycode)
        {   case KeyEvent.LEFT:
            case KeyEvent.RIGHT:
            {   this.selectedcriterium = this.selectedcriterium ^ 1;
                this.filterAndSortLevels();
                this.selectedlevel = 0;
                this.setDirty();
                break;
            }
            case KeyEvent.UP:
            {   if (this.selectedcriterium-2>=0) 
                {   this.selectedcriterium -= 2;
                    this.filterAndSortLevels();
                    this.selectedlevel = 0;
                    this.setDirty();
                }
                break;
            }
            case KeyEvent.DOWN:
            {   if (this.selectedcriterium+2<16) 
                {   this.selectedcriterium += 2;
                    this.filterAndSortLevels();
                    this.selectedlevel = 0;
                    this.setDirty();
                }
                break;
            }            
            case KeyEvent.A:
            {   this.selectingcriterium = false;                
                this.selectedlevel = 0;
                this.scrollToVisible();
                this.setDirty();
                break;
            }
        }
    }    
    // selecting individual level
    else
    {   switch (keycode)
        {   case KeyEvent.UP:
            {   if (this.selectedlevel>0) 
                {   this.selectedlevel--;
                    this.scrollToVisible();
                    this.setDirty();
                }
                break;
            }
            case KeyEvent.DOWN:
            {   if (this.selectedlevel<this.filteredlevels.length-1) 
                {   this.selectedlevel++
                    this.scrollToVisible();
                    this.setDirty();
                }
                break;
            }
            case KeyEvent.A:
            {   this.startSelectedLevel();
                break;
            }

            // special keys for development mode
                case KeyEvent.EDIT:
                    if (Game.DEVELOPERMODE)
                    {   var l = this.getSelectedLevel();
                        if (l!=null)
                        {   var es = new EditorScreen().$(this.game, l);
                            this.game.addScreen(es);
                            es.afterScreenCreation();
                        }
                    }
                    break;                    
                    
                case KeyEvent.SAVE:
                    if (Game.DEVELOPERMODE)
                    {   var l = this.getSelectedLevel();
                        if (l!=null)
                        {   console.log(JSON.stringify(l.toJSON(),null,4));
                        }
                    }
                    break;        
                    
                case KeyEvent.TEST:
                    if (Game.DEVELOPERMODE)
                    {   this.game.testAllLevels();                        
                    }
                    break;                    
            
        }        
    }
    
    Screen.prototype.onKeyDown.call(this,keycode);
};
  
LevelSelectionScreen.prototype.onBackNavigation = function()
{
    if (!this.selectingcriterium)
    {   this.selectingcriterium=true;
        this.setDirty();
    }
}
  
LevelSelectionScreen.prototype.getSelectedLevel = function()
{
    if (this.filteredlevels.length>this.selectedlevel)
    {   return this.filteredlevels[this.selectedlevel];
    }
    return null;
}
  
LevelSelectionScreen.prototype.startSelectedLevel = function()
{
    var l = this.getSelectedLevel();
    if (l!=null)
    {   var gs = new GameScreen().$
        (   this.game, l, null, 
            this.selectedlevel+1<this.filteredlevels, false
        );
        this.game.addScreen(gs);
        gs.afterScreenCreation();                      
    }                   
};
