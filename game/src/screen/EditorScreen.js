"use strict";

var EditorScreen = function() 
{
    Screen.call(this);

    this.level = null;
    this.backup = null;
    
    this.toolbary = 0;
    
    this.mapareax = 0;
    this.mapareay = 0;

    this.selectedpiece = 0;
    
    this.pointerprevx = 0;
    this.pointerprevy = 0;

    this.menuButtonIsPressed = false;
    this.panningButtonIsPressed = false;
    this.isPanning = false;
}
EditorScreen.prototype = Object.create(Screen.prototype);


EditorScreen.MODE_MOVESCREEN = -1;
EditorScreen.MODE_ZOOMSCREEN = -2;

EditorScreen.pieces = [
    MAN1, AIR, EARTH, DOOR,
    EMERALD, SAPPHIRE, RUBY, CITRINE,
    ROCK, BAG, BOMB, TIMEBOMB,
    WALL, ROUNDWALL, STONEWALL, ROUNDSTONEWALL, 
    WALLEMERALD, SAND, SAND_FULL, GLASSWALL,     
    TIMEBOMB10, BOX, CUSHION, CONVERTER,
    KEYBLUE, KEYRED, KEYGREEN, KEYYELLOW,
    DOORBLUE, DOORRED, DOORGREEN, DOORYELLOW,   
    ONETIMEDOOR, ELEVATOR, ELEVATOR_TOLEFT, ELEVATOR_TORIGHT, 
    LORRYLEFT, LORRYUP, LORRYRIGHT, LORRYDOWN,
    BUGLEFT, BUGUP, BUGRIGHT, BUGDOWN,
    YAMYAMLEFT, YAMYAMUP, YAMYAMRIGHT, YAMYAMDOWN,
    ROBOT, SWAMP, DROP, ACID, 
    GUN0, GUN1, GUN2, GUN3,
    AIR, AIR, AIR, MAN2,
    ];

    
EditorScreen.prototype.$ = function(game,level)
{       Screen.prototype.$.call(this,game);    
        
    this.level = level;
    this.backup = level.toJSON();
        
    this.toolbary = 0;
    this.selectedpiece = 2;
        
    this.pointerisdown = false;
    this.pointerprevx = 0;
    this.pointerprevy = 0;

    this.centerMap();

    return this;
}
    
EditorScreen.prototype.afterScreenCreation = function()
{
    this.createMenuScreen();
}

EditorScreen.prototype.centerMap = function()
{
    var g = this.game;
    var csstilesize = this.computeCSSTileSize();
    
    var mapspace = g.screenwidth - (4*csstilesize+6);
    this.mapareax = (mapspace- this.level.datawidth*csstilesize)/2;
    this.mapareay = (g.screenheight - this.level.dataheight*csstilesize)/2;
}
    
// get tile size in css pixel (depending on current browser zoom level)    
EditorScreen.prototype.computeCSSTileSize = function()
{   
    var g = this.game;
    var ratio = g.screenwidth / g.pixelwidth;
    return ratio * g.pixeltilesize;
}

EditorScreen.prototype.getMapAreaLeftEdge = function()
{
    return this.computeCSSTileSize()*4+6 + this.mapareax;
}

EditorScreen.prototype.getMapAreaTopEdge = function()
{
    return this.mapareay;
}

EditorScreen.prototype.map2css = function(x)
{
    return x * this.computeCSSTileSize() / 60.0;
}

EditorScreen.prototype.css2map = function(x)
{
    return Math.round(x*60/this.computeCSSTileSize());
}
        
EditorScreen.prototype.tick = function()
{
    if (this.panningTime>0) 
    {   this.panningTime--;
        if (this.panningTime<=0) { this.setDirty(); }
    }            
}    
        
EditorScreen.prototype.draw = function()
{
    var screenwidth = this.game.screenwidth;
    var screenheight = this.game.screenheight;
    var col = Game.getColorForDifficulty(this.level.getDifficulty());
    
    var lr = this.game.levelRenderer;
    var vr = this.game.vectorRenderer;

    var w = this.level.getWidth();
    var h = this.level.getHeight();
    var csstilesize  = this.computeCSSTileSize();
    
//        int screencenterx = screenwidth/2;
//        int screencentery = screenheight/2;
        
//      vr.addRectangle(screencenterx-mapcenterx-1.0f, screencentery-mapcentery-1.0f, 
//        w*screentilesize+2.0f, h*screentilesize+2.0f, 0xff222222);
//      vr.flush();
        
    // draw all tiles of the level
    lr.startDrawing (0,0,0,0);
    var le = this.getMapAreaLeftEdge();
    var te = this.getMapAreaTopEdge();
    for (var y=0; y<h; y++)
    {   for (var x=0; x<w; x++)
        {
            lr.addRestingPieceToBuffer(
                this.css2map(le+x*csstilesize),
                this.css2map(te+y*csstilesize), 
                this.level.getPiece(x,y));
        }
    }       
    lr.flush();
    
    // -- draw the tool bar
    vr.startDrawing();
    vr.addRectangle(0,0, 4*csstilesize+6,screenheight, 0xff000000);
    
    // draw screen panning graphics over the map 
    if (this.isPanning)
    {   var mapwidth = screenwidth-(4*csstilesize+6);
        var s = Math.min(mapwidth/2,screenheight/2);
        vr.addCrossArrows(4*csstilesize+6+mapwidth/2-s/2,screenheight/2-s/2, 
            s,s, col & 0xccffffff);
    }
    vr.flush();
    
    lr.startDrawing (0,0,0,0);
    vr.startDrawing();
    for (var i=0; i<EditorScreen.pieces.length; i++)
    {   var x = i%4;
        var y = Math.floor(i/4);
        lr.addRestingPieceToBuffer(
            this.css2map(3+csstilesize*x),
            this.css2map(3+csstilesize*y+this.toolbary),
            EditorScreen.pieces[i]);        
        
        if (i==this.selectedpiece)
        {   vr.addFrame(csstilesize*x, csstilesize*y+this.toolbary, csstilesize+6, csstilesize+6, 3.0, 0xffffff00);
        }
    }
    
    // paint additional tools if not having menu open anyway
    if (this.game.getTopScreen()==this)
    {
        var statusbarheight = 50;
        var hspace = 5;    
        var mbuttonwidth = 50;
        var y1 = screenheight-statusbarheight-2*hspace;
        var x1 = 2*hspace;
        var ycenter = y1+statusbarheight/2;
        var x = x1;
        
        // space for pause-button
        x += mbuttonwidth;
        
        // background area
        x += hspace;
        var radius = statusbarheight/10;
        vr.addRoundedRect(x1, y1, x-x1,statusbarheight, radius, radius+1.0, 0xbb000000);
        
        // menu button
        vr.addRoundedRect(x1,y1, mbuttonwidth,statusbarheight, radius, radius+1.0, 
               this.menuButtonIsPressed ? 0xff666666 : 0xff333333);
            
        x = x1+mbuttonwidth/2-8;
        var y = ycenter - statusbarheight/4;        
        vr.addRectangle(x,y, 5,statusbarheight/2, col);
        vr.addRectangle(x+10,y, 5,statusbarheight/2, col);
        
        // panning button        
        x1 += hspace + mbuttonwidth;
        vr.addRoundedRect(x1,y1, mbuttonwidth,statusbarheight, radius, radius+1.0, 
               this.panningButtonIsPressed ? 0xff666666 : 0xff333333);
        var col = Game.getColorForDifficulty(this.level.getDifficulty());
            
//        x = x1+mbuttonwidth/2-8;
//        var y = ycenter - statusbarheight/4;   
        vr.addCrossArrows(x1,y1,mbuttonwidth,statusbarheight,col); 
//        vr.addRectangle(x,y, 5,statusbarheight/2, col);
//        vr.addRectangle(x+10,y, 5,statusbarheight/2, col);
    }
    lr.flush();
    vr.flush();  
};


EditorScreen.prototype.isMenuButtonHit = function(x,y)
{
    var statusbarheight = 50;
    var mbuttonwidth = 50;
    var hspace = 5;    
    var y1 = this.game.screenheight-statusbarheight-2*hspace;
    var x1 = 2*hspace;
    
    var hit = x>=x1 && x<x1+mbuttonwidth && y>=y1 && y<y1+statusbarheight;
    return hit;
};
EditorScreen.prototype.isPanningButtonHit = function(x,y)
{
    var statusbarheight = 50;
    var mbuttonwidth = 50;
    var hspace = 5;    
    var y1 = this.game.screenheight-statusbarheight-2*hspace;
    var x1 = 2*hspace + mbuttonwidth + hspace;
    
    var hit = x>=x1 && x<x1+mbuttonwidth && y>=y1 && y<y1+statusbarheight;
    return hit;
};

EditorScreen.prototype.onBackNavigation = function()
{
    this.createMenuScreen();    
};

EditorScreen.prototype.onResize = function()
{
    this.toolbary = 0;
    this.centerMap();
};

EditorScreen.prototype.onPointerDown = function(x,y)
{
    if (this.isMenuButtonHit(x,y))
    {   this.menuButtonIsPressed = true; 
        this.setDirty();
        return;
    }
    if (this.isPanningButtonHit(x,y))
    {   this.panningButtonIsPressed = true;
        this.setDirty();
        return;
    }
    
    var csstilesize  = this.computeCSSTileSize();
    
    // check if selected a piece
    tryhandle: {
        var tx = Math.floor((x-3) / csstilesize);
        var ty = Math.floor((y-this.toolbary-3) / csstilesize);
        if (tx>=0 && tx<4 && ty>=0 && ty<15)
        {   var s = ty*4 + tx;
            if (s>=0 && s<EditorScreen.pieces.length)
            {   this.selectedpiece = s;
                this.isPanning = false;
                this.setDirty();                
                break tryhandle;
            }        
        }
    
        // check if piece was placed in map
        if (x>6+4*csstilesize)
        {   if (!this.isPanning) { this.tryPlacePiece(x,y); }
        }
    }
    
    this.pointerprevx = x;
    this.pointerprevy = y;
};
    
EditorScreen.prototype.onPointerUp = function()
{
    if (this.menuButtonIsPressed)
    {   this.menuButtonIsPressed = false;
        this.createMenuScreen(true);         
        return;
    }
    if (this.panningButtonIsPressed)
    {   this.panningButtonIsPressed = false;
        this.isPanning = !this.isPanning;
        this.setDirty();
        return;
    }
    
    this.pointerisdown = false;
};
    
EditorScreen.prototype.onPointerMove = function(x,y) 
{   
    if (this.menuButtonIsPressed)
    {   if (!this.isMenuButtonHit(x,y))
        {   this.menuButtonIsPressed = false;  
            this.setDirty();
        }
        this.pointerprevx = x;
        this.pointerprevy = y;
        return;
    }
    if (this.panningButtonIsPressed)
    {   if (!this.isPanningButtonHit(x,y))
        {   this.panningButtonIsPressed = false;  
            this.setDirty();
        }
        this.pointerprevx = x;
        this.pointerprevy = y;
        return;
    }        

    var csstilesize  = this.computeCSSTileSize();

    tryhandle: {
        if (x<3+4*csstilesize) 
        {   if (y!=this.pointerprevy) 
            {   var barheight = 15*csstilesize;
                this.toolbary = Math.min
                (   0, Math.max
                    (   this.toolbary + (y-this.pointerprevy),
                        this.game.screenheight - (barheight+6) 
                    )
                );
                this.isPanning = false;
                this.setDirty();
                break tryhandle;
            }            
        }
        
        if (x>6+4*csstilesize)
        {   if (!this.isPanning && x>6+4*csstilesize) { this.tryPlacePiece(x,y); }
            else
            {   this.mapareax += (x - this.pointerprevx);
                this.mapareay += (y - this.pointerprevy);
                this.setDirty();
            }
        }
    }
    
    this.pointerprevx = x;
    this.pointerprevy = y;
};

EditorScreen.prototype.tryPlacePiece = function(x,y,piece)
{    
    var px = Math.floor(this.css2map(x-this.getMapAreaLeftEdge()) / 60);
    var py = Math.floor(this.css2map(y-this.getMapAreaTopEdge()) / 60);
    
    var l = this.level;
    // TODO extend map to the left
    if (px==-1 && l.getWidth()<MAPWIDTH) 
    {   
    }
    
    if (px>=0 && py>=0 && px<this.level.getWidth() && py<this.level.getHeight())
    {   this.level.setPiece(px,py,EditorScreen.pieces[this.selectedpiece]);
        this.setDirty();
    }
};    
    
EditorScreen.prototype.onKeyDown = function(keycode)
{       switch (keycode)
            {   
                case KeyEvent.EDIT:
                // TODO: write to console
                    break;                    
            }           
        
        Screen.prototype.onKeyDown.call(this,keycode);
};
    
EditorScreen.prototype.createMenuScreen = function()
{
    // do not open menu twice
    if (this.game.getTopScreen() != this)
    {   return;
    }
                
        // create the menu screen
    var m = new PauseMenu().$(this.game,this, this.level, PauseMenu.MENUACTION_EXITEDITOR);
    m.addPriorityAction(PauseMenu.MENUACTION_DISCARDCHANGES);
    m.addDefaultAction(PauseMenu.MENUACTION_CONTINUEEDIT);
    m.addPriorityAction(PauseMenu.MENUACTION_TESTLEVEL);
    m.addPriorityAction(PauseMenu.MENUACTION_EXITEDITOR);
    m.addAction(PauseMenu.MENUACTION_EDITSETTINGS);
    m.addAction(PauseMenu.MENUACTION_EDITNAME);
    m.addAction(PauseMenu.MENUACTION_EDITAUTHOR);
    m.addAction(PauseMenu.MENUACTION_EDITINFO);
    m.layout();
    
    this.game.addScreen(m);
};
    
EditorScreen.prototype.menuAction = function(id)
{   
    var game = this.game;
    
        switch (id)
        {   
            case PauseMenu.MENUACTION_EXITEDITOR:
                game.removeScreen();
                break;
                
            case PauseMenu.MENUACTION_TESTLEVEL:
                var gs = new GameScreen().$(game, this.level, null, false, true);
                game.addScreen(gs);
                gs.afterScreenCreation();                           
                break;
                                
            case PauseMenu.MENUACTION_DISCARDCHANGES:
                this.level.$(this.backup);
                break;
                
            case PauseMenu.MENUACTION_EDITSETTINGS:
                this.createMenuScreen();
//                game.addScreen(new LevelSettingsDialog(game,level));
                break;

            case PauseMenu.MENUACTION_EDITNAME:
                this.createMenuScreen();             
//                game.addScreen(new TextInputDialog(game,"Name", level.getTitle(), 
//                    new TextInputDialog.Listener(){public void valueChanged(String v){level.setTitle(v);}}
//                ));
                break;

            case PauseMenu.MENUACTION_EDITAUTHOR:
                this.createMenuScreen();
//                game.addScreen(new TextInputDialog(game,"Author", level.getAuthor(), 
//                    new TextInputDialog.Listener(){public void valueChanged(String v){level.setAuthor(v);}}
//                ));
                break;

            case PauseMenu.MENUACTION_EDITINFO:
                this.createMenuScreen();
//                game.addScreen(new TextInputDialog(game,"Info", level.getHint(), 
//                    new TextInputDialog.Listener(){public void valueChanged(String v){level.setHint(v);}}
//                ));
                break;
                
            default:
                break;
        }
};
   


