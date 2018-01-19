
var MainMenuScreen = function()
{
    Screen.call(this);
    
    this.selectedcolumn = 0;
    this.selectedrow = 0;
    
    this.numcolumns=0;  // how many columns are in the screen 
    this.menucolumn=0;   // in which column is the main menu located
    this.colwidth = 0;
    this.rowheight = 0;
    this.left = 0;
    this.top = 0;
    
    this.pointerdownx = 0;
    this.pointerdowny = 0;
    this.pointerx = 0;
    this.pointery = 0;
    this.pointeractive = false;
    
};
MainMenuScreen.prototype = Object.create(Screen.prototype);
   
  
MainMenuScreen.MENUENTRY_EXIT = 0;  
MainMenuScreen.MENUENTRY_NEWLEVEL = 1;
MainMenuScreen.menuentrytext = [ "Exit", "New Level" ]; 


MainMenuScreen.prototype.$ = function (game)
{   Screen.prototype.$.call(this,game);

    this.selectedcolumn = this.menucolumn+1;
    this.selectedrow = 0;
        
    this.colwidth = 300;
    this.rowheight = 30;
        
    this.reactivate();     

    return this;
};

MainMenuScreen.prototype.resize = function()
{
    Screen.prototype.resize.call(this);
    this.snapPosition();    
}

MainMenuScreen.prototype.reactivate = function()
{
    // compute some layout data
    this.numcolumns = this.game.levelpacks.length + 1;
    this.menucolumn = 0;

    for (var i=0; i<this.game.levelpacks.length; i++)
    {
        if (this.game.levelpacks[i].isWriteable()) 
        {   this.menucolumn=i+1;
        }
    }

    this.left = 0;
    this.top = 0;
    this.pointeractive = false;

    this.bringSelectedInView();
}
    
MainMenuScreen.prototype.draw = function()
{
    var game = this.game;
        
    var background = 0xff393939;
    var menuhighlight = 0xffffffff;

    game.vectorRenderer.startDrawing (this.screenwidth, this.screenheight);
    
        // draw selection
        var selectedlevel = this.getSelectedLevel(); 
        var cornerradius = 4;           
        if (selectedlevel!=null)
        {   game.vectorRenderer.addRoundedRect(
                this.left+this.selectedcolumn*this.colwidth, 
                this.top+this.selectedrow*this.rowheight, 
                this.colwidth,this.rowheight, 
                cornerradius,cornerradius+1, 
                Game.getColorForDifficulty(selectedlevel.getDifficulty()) );
        }
        else if (this.selectedcolumn==this.menucolumn && this.selectedrow>=0 
           && this.selectedrow<MainMenuScreen.menuentrytext.length)
        {
            game.vectorRenderer.addRoundedRect(
                this.left+this.selectedcolumn*this.colwidth, 
                this.top+this.selectedrow*this.rowheight, 
                this.colwidth,this.rowheight, 
                cornerradius,cornerradius+1, 
                menuhighlight );
        }           
        
    game.vectorRenderer.flush();

    game.textRenderer.startDrawing (this.screenwidth, this.screenheight);
    game.gfxRenderer.startDrawing (this.screenwidth, this.screenheight);

        // draw all columns of the main menu
        var iconwidth = this.rowheight;
        for (var col=0; col<this.numcolumns; col++)
        {
            var x = this.left+col*this.colwidth;
            if (x+this.colwidth < 0) continue;
            if (x > this.screenwidth) continue;
                                
            var p = this.getLevelPack(col);

            if (p!=null)
            {   game.textRenderer.addString(
                    p.name, this.left+col*this.colwidth+iconwidth, 
                            this.top-this.rowheight-15, this.rowheight, 
                    false, 0xffffffff, TextRenderer.WEIGHT_BOLD);     
        
                for (var row=0; row<p.levels.length; row++)
                {
                    var y = this.top+row*this.rowheight;                        
                
                    var l = p.levels[row];
                    game.textRenderer.addString(l.getTitle(), 
                        x+iconwidth, y, this.rowheight, false,
                        selectedlevel==l ? background : Game.getColorForDifficulty(l.getDifficulty()),
                        TextRenderer.WEIGHT_PLAIN);
                        
                    var icon = null;    
                    switch (game.getLevelSolvedGrade(l))
                    {   case 0: icon = game.gfxRenderer.FINISHEDMARKER_VISITED;
                                break;
                        case 1: icon = game.gfxRenderer.FINISHEDMARKER_SOLVED;
                                break;
                        case 2: icon = game.gfxRenderer.FINISHEDMARKER_PERFECT;
                                break;
                    }
                    if (icon!=null)
                    {
                        game.gfxRenderer.addGraphic(icon, x,y+this.rowheight*0.1,this.rowheight*0.8,this.rowheight*0.8);
                    }
                }
            }
            else if (col==this.menucolumn)
            {
                game.textRenderer.addString("Sapphire Yours", 
                    this.left+col*this.colwidth+iconwidth, 
                    this.top-this.rowheight-15, this.rowheight, 
                    false, 0xffffffff, TextRenderer.WEIGHT_BOLD);
                
                for (var row=0; row<MainMenuScreen.menuentrytext.length; row++)
                {                                           
                    var y = this.top+row*this.rowheight;                        
                
                    game.textRenderer.addString(MainMenuScreen.menuentrytext[row], 
                        x+this.rowheight, y, this.rowheight, false,
                        (this.selectedcolumn==col && this.selectedrow==row) ? background : menuhighlight,
                        TextRenderer.WEIGHT_PLAIN);             
                }
            }               
        }   
        
        // flush everything to screen
        game.textRenderer.flush();
        game.gfxRenderer.flush();
};


    // -- mapping of rows/columns to the level list ---
    
MainMenuScreen.prototype.getRows = function(column)
{
        if (column==this.menucolumn)
        {   return MainMenuScreen.menuentrytext.length; 
        }
        else if (column<this.menucolumn)
        {
            return this.game.levelpacks[column].numberOfLevels();  
        }
        else 
        {
            return this.game.levelpacks[column-1].numberOfLevels();    
        }
};

MainMenuScreen.prototype.getLevelPack = function(column)
{
        if (column==this.menucolumn)
        {   return null; 
        }
        return this.game.levelpacks[column<this.menucolumn ? column : column-1];
};

MainMenuScreen.prototype.getLevel = function(column, row)
{
        var p = this.getLevelPack(column);
        if (p==null)
        {   return null; 
        }
        if (row<0 || row>=p.numberOfLevels())
        {
            return null;    
        }
        else 
        {
            return p.levels[row];   
        }
}
        

MainMenuScreen.prototype.startSelectedAction = function()
{
        if (this.getSelectedLevel()!=null)
        {
            this.startSelectedLevel();
        }
        else if (this.selectedcolumn==this.menucolumn)        
        {
            switch (this.selectedrow)
            {   case MainMenuScreen.MENUENTRY_NEWLEVEL:
                {   
//                    EditorScreen s = new EditorScreen(game, new Level());
//                    game.addScreen(s);
//                    s.afterScreenCreation();
                    break;
                }
                case MainMenuScreen.MENUENTRY_EXIT:
                {
                    this. game.removeScreen();
                    break;
                } 
            }
        }
};

MainMenuScreen.prototype.getSelectedLevel = function()
{
    return this.getLevel(this.selectedcolumn, this.selectedrow);
};

MainMenuScreen.prototype.startSelectedLevel = function()
{
        var l = this.getSelectedLevel();
        if (l!=null)
        {
            var lp = this.getLevelPack(this.selectedcolumn);            
            if (lp.isWriteable())
            {
//                EditorScreen es = new EditorScreen(game, l);
//                game.addScreen(es);
//                es.afterScreenCreation();
            }
            else
            {
                var gs = new GameScreen().$(this.game, l, null, 
                    this.selectedcolumn<this.game.levelpacks.length 
                 || this.selectedrow<lp.levels.length-1, false);
                this.game.addScreen(gs);
                gs.afterScreenCreation();
            }           
        }                   
};


MainMenuScreen.prototype.startSubsequentLevel = function()
{
        var found=false;
        for (var col=0; col<this.numcolumns; col++)
        {
            var numrows = this.getRows(col);
            for (var row=0; row<numrows; row++)
            {
                if (this.selectedcolumn==col && this.selectedrow==row)
                {   found = true;
                }
                else if (found && col!=this.menucolumn)
                {
                    this.selectedrow = row;
                    this.selectedcolumn = col;
                    this.startSelectedLevel();
                    return;                             
                }                   
            }
        }
};

MainMenuScreen.prototype.bringSelectedInView = function()
{    
    if (this.selectedcolumn>=0)
    {   
        this.left = Math.floor(this.screenwidth/2 -this.selectedcolumn*this.colwidth - this.colwidth/2);
        this.snapPosition();
    }
};


MainMenuScreen.prototype.snapPosition = function()
{       
        this.left = this.roundtostep(this.left, this.colwidth);
        this.snapEdges();
};
    
MainMenuScreen.prototype.snapEdges = function()
{
        if (this.left>0) {
            this.left=0;
        }
        if (this.left+this.numcolumns*this.colwidth < this.screenwidth)
        {
            this.left = this.screenwidth - this.numcolumns*this.colwidth;
        }
        this.top = 50;
};
    
MainMenuScreen.prototype.roundtostep = function(value, stepsize)
{
        return Math.round(value/stepsize) * stepsize;
};



    // ---- key event handlers --
MainMenuScreen.prototype.onKeyDown = function(keycode)
{   
        switch (keycode)
            {   
                case KeyEvent.KEYCODE_DPAD_LEFT:
                    if (this.selectedcolumn>0)
                    {   this.selectedcolumn--;
                        if (this.selectedrow<0)
                        {   this.selectedrow=0;
                        }
                        else if (this.selectedrow>=this.getRows(this.selectedcolumn))
                        {   this.selectedrow = this.getRows(this.selectedcolumn)-1;
                        }
                        this.bringSelectedInView();
                        this.setDirty();
                    }
                    break;                  
                case KeyEvent.KEYCODE_DPAD_RIGHT:
                    if (this.selectedcolumn<this.numcolumns-1)
                    {   this.selectedcolumn++;
                        if (this.selectedrow<0)
                        {   this.selectedrow=0;
                        }
                        else if (this.selectedrow>=this.getRows(this.selectedcolumn))
                        {   this.selectedrow = this.getRows(this.selectedcolumn)-1;
                        }
                        this.bringSelectedInView();
                        this.setDirty();
                    }
                    break;
            
                case KeyEvent.KEYCODE_DPAD_UP:
                    if (this.selectedrow<0)
                    {   this.selectedrow=0;
                        this.bringSelectedInView();
                        this.setDirty();
                    }
                    else if (this.selectedrow>0) 
                    {   this.selectedrow--;
                        this.bringSelectedInView();
                        this.setDirty();
                    }
                    break;                  
                case KeyEvent.KEYCODE_DPAD_DOWN:
                    if (this.selectedrow<0)
                    {   this.selectedrow=0;
                        this.bringSelectedInView();
                        this.setDirty();
                    }
                    else if (this.selectedrow<this.getRows(this.selectedcolumn)-1)
                    {   this.selectedrow++;
                        this.bringSelectedInView();
                        this.setDirty();
                    }
                    break;
                case KeyEvent.KEYCODE_ENTER:
                    if (this.selectedrow<0)
                    {   this.selectedrow=0;
                    }
                    else
                    {   
                        this.startSelectedLevel();
                    }
                    break;
            }           
        
        Screen.prototype.onKeyDown.call(this,keycode);
};
    
    // ---- pointer event handlers ----
MainMenuScreen.prototype.onPointerDown = function(x, y)
{
        this.pointerx = x;
        this.pointery = y;
        this.pointerdownx = x;
        this.pointerdowny = y;
        this.pointeractive = true;

        this.selectedcolumn = (this.pointerx-this.left) / this.colwidth;
        this.selectedrow = (this.pointery-this.top) / this.rowheight;
};

MainMenuScreen.prototype.onPointerUp = function()
{
        this.pointeractive = false;
        
        this.snapPosition();     
        this.startSelectedAction();      
};

MainMenuScreen.prototype.onPointerMove = function(x,y)
{   
    this.left = this.left + (x-this.pointerx);
    this.top =  this.top + (y-this.pointery);
    
    this.pointerx = x;
    this.pointery = y;
        
    // check if scrolling turns off level selection
    if (Math.abs(this.pointerx-this.pointerdownx)>5 || Math.abs(this.pointery-this.pointerdowny)>5)
    {
        this.selectedrow = -1;
    }
                
    this.snapEdges();
}
