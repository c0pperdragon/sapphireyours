"use strict";
var LevelSelectionScreen = function()
{
    Screen.call(this);
    
    this.selectednumberofplayers = 0;
    this.selectingcriterium = false;
    this.selectedcriterium = 0;
    this.selectedlevel = 0;
    
    this.filteredlevels = [];    
    this.listscrolly = 50;
    
    this.pointerdownx = 0;
    this.pointerdowny = 0;
    this.pointerdowntime = 0;
    this.pointerx = 0;
    this.pointery = 0;
    this.pointeractive = false;    
};
LevelSelectionScreen.prototype = Object.create(Screen.prototype);

LevelSelectionScreen.prototype.$ = function (game)
{   Screen.prototype.$.call(this,game);

    this.selectednumberofplayers = 1;
    this.selectingcriterium = true;
    this.selectedcriterium = 0;
    this.selectedlevel = this.filterAndSortLevels();
    return this;
};

    
LevelSelectionScreen.prototype.draw = function()
{
    var menuwidth = Math.min(300, this.game.screenwidth);                 
    
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
    vr.addRoundedRect(0,0,menuwidth,this.game.screenheight, 3, 4, background);
    var x = 10;
    var y = 5;
    
    // mode to select a category/difficulty
    if (this.selectingcriterium)
    {           
        var titlecolor = 0xff2689fb;
        lr.addDecorationPieceToBuffer (x+17,y+19,SAPPHIRE);
        tr.addString
        (   "Sapphire", x+40, y, smalltext,
            false, titlecolor, TextRenderer.WEIGHT_BOLD
        );
        tr.addString
        (   "Yours", x+40, y+18, smalltext,
            false, titlecolor, TextRenderer.WEIGHT_BOLD
        );
        
        var numbuttonwidth = 32;
        var numbuttonheight = 32;
        x2 = menuwidth - 12 - numbuttonwidth;
        var str = ""+(this.selectednumberofplayers);
        vr.addRoundedRect(x2,y, numbuttonwidth, numbuttonheight, 3,4, 0xff222222);
        tr.addString
        (   str, 
                x2 + numbuttonwidth/2 - tr.determineStringWidth(str,bigtext)/2, 
                y + (numbuttonheight-bigtext)/2, 
                bigtext, 
                false, 
                titlecolor,
                TextRenderer.WEIGHT_BOLD
        );
        
        y+=60;

        var buttonheight = rowheight-2;
        var buttonwidth = menuwidth/2 - x - 2;
        
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
        y = this.listscrolly;
        var d = pos2difficulty(this.selectedcriterium);
        var c = pos2category(this.selectedcriterium);

        var buttonheight = rowheight-2;
        var buttonwidth = menuwidth - 2*x - 2;

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
            
            var solve = this.game.getLevelSolvedGrade(l);
            if (solve>=1)
            {   vr.addFrame(x+2,y+1,buttonheight-4,buttonheight-2, solve, sel ? 0xff000000 : color);
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
        
        vr.flush();
        tr.flush();

        {   var color = textcolor;
            
            y = 5;
            vr.addRectangle(0,0, menuwidth,50, 0xff000000);        
            if (d>=0) 
            {   color = Game.getColorForDifficulty(d);
                tr.addString
                (   Game.getNameForDifficulty(d), x, y, bigtext,
                    false, color, TextRenderer.WEIGHT_PLAIN
                );
            } 
            if (c>=0) 
            {   tr.addString
                (   Game.getNameForCategory(c), x, y, bigtext,
                    false, textcolor, TextRenderer.WEIGHT_PLAIN
                );
            }
            
            var exitbuttonwidth = 32;
            var exitbuttonheight = 32;
            var x2 = menuwidth-12 - exitbuttonwidth;
            var isselected = this.pointeractive 
            && this.isClickedExitButton(this.pointerdownx,this.pointerdowny);
            vr.addRoundedRect(x2,y, exitbuttonwidth, exitbuttonheight, 3,4, isselected ? color : 0xff444444);
            vr.addCross(x2,y, exitbuttonwidth, exitbuttonheight, isselected ? 0xff444444 : color);        
        }
    }
    
    vr.flush();
    tr.flush();
    lr.flush();
};

LevelSelectionScreen.prototype.computeClickedCriterium = function(x, y)
{ 
    var rowheight = 32;
    var columnwidth = 150;    
    var top = 96;
    if (y>=top && x<2*columnwidth)
    {   var row = Math.floor((y-top) / rowheight);
        var column = Math.floor(x / columnwidth);
        if (column<=1 && row<=3) { return row*2 + column; }
    }
    var top = 272;
    if (y>=top && x<2*columnwidth)
    {   var row = Math.floor((y-top) / rowheight);
        var column = Math.floor(x / columnwidth);
        if (column<=1 && row<=3) { return 8 + row*2 + column; }
    }
    
    return -1;
};

LevelSelectionScreen.prototype.isClickedNumberOfPlayers = function(x, y)
{
    var menuwidth = Math.min(300, this.game.screenwidth);                 
    return /*x >= menuwidth-12 - 40 &&*/ x<menuwidth && y<40;
};

LevelSelectionScreen.prototype.isClickedExitButton = function(x, y)
{
    var menuwidth = Math.min(300, this.game.screenwidth); 
    return x >= menuwidth-12 - 40 && x<menuwidth && y<40;
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
    var prefered = 0;
    this.filteredlevels.length = 0;

    var pos = this.selectedcriterium;    
    for (var i=0; i<this.game.levels.length; i++)
    {   var l = this.game.levels[i];
        if 
        (   l.getNumberOfPlayers() === this.selectednumberofplayers
        &&  (   pos2difficulty(pos) === l.getDifficulty() 
                || pos2category(pos) === l.getCategory()
            )
        )
        {   this.filteredlevels.push(l);            
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

    // use different default level in certain cases
    if (pos2difficulty(pos) == 2)
    {   for (var i=0; i<this.filteredlevels.length; i++)
        {   var t = this.filteredlevels[i].getTitle();
            if (t==="Basic Mining" || t=="Two Miners") 
            {   prefered=i;
            }
        }
    }
    return prefered; // the default level for this sorting
}

LevelSelectionScreen.prototype.scrollToVisible = function()
{
    if (this.selectingcriterium) { return; }
    
    var top = 50;    
    var bottom = this.game.screenheight - 5;            
    var lineheight = 32;
    var h = this.filteredlevels.length * lineheight;    
    if (top+h<=bottom) 
    {   this.listscrolly=top; 
    }
    else
    {   var cursory = this.listscrolly + lineheight*this.selectedlevel;    
        if (this.listscrolly>top) { this.listscrolly=top; }
        if (this.listscrolly+h<bottom) { this.listscrolly=bottom-h; }
        if (cursory<top)
        {   this.listscrolly += (top-cursory);
        }
        else if (cursory>bottom-lineheight)
        {   this.listscrolly -= (cursory-(bottom-lineheight));
        }
    }
}

// ---- key event handlers --
LevelSelectionScreen.prototype.onKeyDown = function(keycode)
{    
    if (this.selectingcriterium)
    {   switch (keycode)
        {   case KeyEvent.LEFT:
            {   this.selectedcriterium = this.selectedcriterium & ~1;                
                this.selectedlevel = this.filterAndSortLevels();
                this.setDirty();
                break;
            }
            case KeyEvent.RIGHT:
            {   this.selectedcriterium = this.selectedcriterium | 1;                
                this.selectedlevel = this.filterAndSortLevels();
                this.setDirty();
                break;
            }
            case KeyEvent.UP:
            {   if (this.selectedcriterium-2>=0) 
                {   this.selectedcriterium -= 2;                    
                    this.selectedlevel = this.filterAndSortLevels();
                    this.setDirty();
                }
                break;
            }
            case KeyEvent.DOWN:
            {   if (this.selectedcriterium+2<16) 
                {   this.selectedcriterium += 2;                    
                    this.selectedlevel = this.filterAndSortLevels();
                    this.setDirty();
                }
                break;
            }            
            case KeyEvent.A:
            {   this.selectingcriterium = false;                
                this.scrollToVisible();
                this.setDirty();
                break;
            }
            case KeyEvent.Y:
            {   this.selectednumberofplayers = (this.selectednumberofplayers===1) ? 2:1;
                this.selectedlevel = this.filterAndSortLevels();
                this.setDirty();     
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
        }        
    }
    
    Screen.prototype.onKeyDown.call(this,keycode);
};

LevelSelectionScreen.prototype.onPointerDown = function(x, y)
{
    var menuwidth = Math.min(300, this.game.screenwidth);                 
    var rowheight = 32;
    
    this.pointerdownx = x;
    this.pointerdowny = y;
    this.pointerx = x;
    this.pointery = y;
    this.pointeractive = true;    
    this.pointerdowntime = Game.currentTimeMillis();
    
    if (this.selectingcriterium)
    {   var c = this.computeClickedCriterium(x,y);
        if (c>=0)
        {   this.selectedcriterium = c;
            this.selectedlevel = this.filterAndSortLevels();
        }
        else if (this.isClickedNumberOfPlayers(x,y))
        {   this.selectednumberofplayers = (this.selectednumberofplayers===1) ? 2:1;
            this.selectedlevel = this.filterAndSortLevels();
        }
    }
    else
    {   if (x<menuwidth && y>=5+rowheight && y>=this.listscrolly)
        {   var row = Math.floor((y - this.listscrolly) / rowheight);
            if (row>=0 && row<this.filteredlevels.length)
            {   this.selectedlevel = row;
            }
        }       
    }
    this.setDirty();
};

LevelSelectionScreen.prototype.onPointerMove = function(x,y)
{
    var menuwidth = Math.min(300, this.game.screenwidth);                 
    var dy = y - this.pointery;
    this.pointerdowntime -= Math.abs(dy*10);
    
    this.pointerx = x;
    this.pointery = y;
    this.pointeractive = true;    
    
    if (!this.selectingcriterium && x<menuwidth && this.pointerdownx<menuwidth && y>40 && dy!=0)
    {   this.listscrolly += dy;
        this.scrollToVisible();
        this.setDirty();
    }
};

LevelSelectionScreen.prototype.onPointerUp = function()
{
    var x = this.pointerx;
    var y = this.pointery;
    this.pointeractive = false;
    var shortclick = Game.currentTimeMillis() < this.pointerdowntime + 500;
    
    if (this.selectingcriterium)
    {   if (shortclick)
        {   var c = this.selectedcriterium;
            this.computeClickedCriterium(this.pointerx,this.pointery);
            if (c>=0 
            && c==this.computeClickedCriterium(x,y)
            && c==this.computeClickedCriterium(this.pointerdownx,this.pointerdowny)
            )
            {   this.selectingcriterium = false;                
                this.scrollToVisible();      
            }
        }
    }
    else if 
    (   this.isClickedExitButton(this.pointerdownx,this.pointerdowny)
        && this.isClickedExitButton(x,y)
    )
    {   this.selectingcriterium = true;                
    }       
    else    
    {   if (shortclick)
        {   var menuwidth = Math.min(300, this.game.screenwidth);                 
            var rowheight = 32;
            if (x<menuwidth && y>=5+rowheight && y>=this.listscrolly)
            {   var row = Math.floor((y - this.listscrolly) / rowheight);
                if (row>=0 && row<this.filteredlevels.length && this.selectedlevel==row)
                {   this.startSelectedLevel();
                }
            }       
        }
    }
    
    this.setDirty();
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
            false
        );
        this.game.addScreen(gs);
        gs.afterScreenCreation();                      
    }                   
};

LevelSelectionScreen.prototype.startSubsequentLevel = function()
{
    if (this.selectedlevel+1<this.filteredlevels.length)
    {   this.selectedlevel++;
        this.startSelectedLevel();
    }
    else if (this.selectedlevel>0)
    {   this.selectedlevel=0;
        this.startSelectedLevel();
    }
};
