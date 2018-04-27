"use strict";

var EditorScreen = function() 
{
    Screen.call(this);

    this.level = null;
    
//    this.toolbarx = 0;
//    this.toolbary = 0;
//    this.tooltilesize = 0;
//    this.tooltilespacing = 0;
//    this.toolselectionx = 0;
//    this.toolselectioncolumns = 0;
        
//    this.selectedtools = null;
    this.selectedpiece = 0;
//    this.toolselectionopen = false;
    
    this.pointerprevx = 0;
    this.pointerprevy = 0;
    this.pointerdownx = 0;
    this.pointerdowny = 0;

//    Button menuButton;
}
EditorScreen.prototype = Object.create(Screen.prototype);


EditorScreen.MODE_MOVESCREEN = -1;
EditorScreen.MODE_ZOOMSCREEN = -2;

EditorScreen.pieces = [
    MAN1, MAN2, EARTH, DOOR,
    EMERALD, SAPPHIRE, RUBY, CITRINE,
    ROCK, BAG, BOMB, TIMEBOMB,
    WALL, WALLEMERALD, SAND, SAND_FULL, 
    ROUNDWALL, STONEWALL, ROUNDSTONEWALL, GLASSWALL,     
    TIMEBOMB10, CONVERTER, BOX, CUSHION,
    KEYBLUE, KEYRED, KEYGREEN, KEYYELLOW,
    DOORBLUE, DOORRED, DOORGREEN, DOORYELLOW,   
    ONETIMEDOOR, ELEVATOR, ELEVATOR_TOLEFT, ELEVATOR_TORIGHT, 
    LORRYLEFT, LORRYUP, LORRYRIGHT, LORRYDOWN,
    BUGLEFT, BUGUP, BUGRIGHT, BUGDOWN,
    YAMYAMLEFT, YAMYAMUP, YAMYAMRIGHT, YAMYAMDOWN,
    GUN0, GUN1, GUN2, GUN3,
    SWAMP, DROP, ACID, ROBOT, 
    AIR,
    ];

    
EditorScreen.prototype.$ = function(game,level)
{       Screen.prototype.$.call(this,game);    
        
        this.level = level;
        
        this.selectedpiece = 17;
        
        this.pointerprevx = 0;
        this.pointerprevy = 0;
        
    return this;
}
    
EditorScreen.prototype.afterScreenCreation = function()
{
//    this.createMenuScreen();
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
    return this.computeCSSTileSize()*4+6;
}

EditorScreen.prototype.map2css = function(x)
{
    return x * this.computeCSSTileSize() / 60.0;
}

EditorScreen.prototype.css2map = function(x)
{
    return Math.round(x*60/this.computeCSSTileSize());
}
        
EditorScreen.prototype.draw = function()
{
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
    for (var y=0; y<h; y++)
    {   for (var x=0; x<w; x++)
        {
            lr.addRestingPieceToBuffer(
                this.css2map(le+x*csstilesize),
                this.css2map(y*csstilesize), 
                this.level.getPiece(x,y));
        }
    }       
    lr.flush();

    
    // -- draw the piece palette
    
    
    // -- draw the decoration of the toolbar and selection box --
    lr.startDrawing (0,0,0,0);
    vr.startDrawing();
    for (var i=0; i<EditorScreen.pieces.length; i++)
    {   var x = i%4;
        var y = Math.floor(i/4);
        lr.addRestingPieceToBuffer(
            this.css2map(3+csstilesize*x),
            this.css2map(3+csstilesize*y),
            EditorScreen.pieces[i]);        
        
        if (i==this.selectedpiece)
        {   vr.addFrame(csstilesize*x, csstilesize*y, csstilesize+6, csstilesize+6, 3.0, 0xffffff00);
        }
    }
    lr.flush();
    vr.flush();
    
//        lr.startDrawing (screenwidth, screenheight, tooltilesize);
//        
//        vr.addRectangle(toolbarx-1.0f,toolbary-1.0f, tooltilesize+2.0f, (tooltilesize+tooltilespacing)*toolgroups.length-tooltilespacing+2.0f, 0xffffffff);
//        vr.addRectangle(toolbarx, toolbary, tooltilesize, (tooltilesize+tooltilespacing)*toolgroups.length-tooltilespacing, 0xff000000);
//        vr.addFrame(toolbarx-3.0f,toolbary+currenttool*(tooltilesize+tooltilespacing)-3.0f, tooltilesize+6.0f, tooltilesize+6.0f, 3.0f, 0xffffff00);
//        if (toolselectionopen)
//        {   int boxwidth = Math.min(toolgroups[currenttool].length, toolselectioncolumns) * (tooltilesize+tooltilespacing) - tooltilespacing;
//            int boxheight = ((toolgroups[currenttool].length+toolselectioncolumns-1) / toolselectioncolumns) * (tooltilesize+tooltilespacing) - tooltilespacing;            
//            int toolselectiony = toolbary+currenttool*(tooltilesize+tooltilespacing);
//            vr.addRectangle(toolselectionx-2.0f, toolselectiony-2.0f, boxwidth+4.0f, boxheight+4.0f, 0xffffffff); 
//            vr.addRectangle(toolselectionx-1.0f, toolselectiony-1.0f, boxwidth+2.0f, boxheight+2.0f, 0xff000000); 
//        }
//        vr.flush();
//        
//        // --- draw the tiles in the toolbar in selection box
//        for (int i=0; i<toolgroups.length; i++)
//        {
//            drawTileOrCommand(toolbarx, toolbary+i*(tooltilesize+tooltilespacing), toolgroups[i][selectedtools[i]]);        
//        }
//        if (toolselectionopen)
//        {   int toolselectiony = toolbary+currenttool*(tooltilesize+tooltilespacing);
//            for (int i=0; i<toolgroups[currenttool].length; i++)
//            {
//                int row = i / toolselectioncolumns;
//                int column = i % toolselectioncolumns;
//                drawTileOrCommand(toolselectionx+column*(tooltilesize+tooltilespacing), toolselectiony+row*(tooltilesize+tooltilespacing), toolgroups[currenttool][i]);
//            }       
//        }
//        
//        
//        // paint the menu button (but only if no menu is already present)
//        if (game.getTopScreen()==this)
//        {   menuButton.draw(game.vectorRenderer);
//        }
//        
//        // flush everything to screen
//        lr.flush();
};
    
//    private void drawTileOrCommand(int x, int y, int t)
//    {
//        switch (t)
//        {   case MODE_MOVESCREEN:
//                game.vectorRenderer.addCrossArrows(x,y,tooltilesize,tooltilesize, 0xffffffff); 
//                break;
//            case MODE_ZOOMSCREEN:
//                game.vectorRenderer.addZoomArrows(x,y,tooltilesize,tooltilesize, 0xffffffff); 
//                break;      
//            default:
//                game.levelRenderer.addSimplePieceToBuffer(x,y,(byte)t);
//        }
//    }


EditorScreen.prototype.onPointerDown = function(x,y)
{
    var csstilesize  = this.computeCSSTileSize();
    
    // check if selected a piece
    var tx = Math.floor(x-3 / csstilesize);
    var ty = Math.floor(y-3 / csstilesize);
    if (tx>=0 && tx<4 && ty>0 && ty<15)
    {   var s = ty*4 + tx;
        if (s>=0 && s<EditorScreen.pieces.length)
        {   this.selectedpiece = s;
            this.setDirty();
            return;
        }        
    }
    
    // check if piece was placed in map
    this.tryPlacePiece(x,y);
};
    
/*    
    @Override
    public void onPointerUp()
    {
        menuButton.onPointerUp();       

        if (toolselectionopen)
        {
            toolselectionopen = false;
        }
    }
*/
    
EditorScreen.prototype.onPointerMove = function(x,y) 
{
    this.tryPlacePiece(x,y);
};

EditorScreen.prototype.tryPlacePiece = function(x,y,piece)
{
    var px = Math.floor(this.css2map(x-this.getMapAreaLeftEdge()) / 60);
    var py = Math.floor(this.css2map(y) / 60);
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
/*    
    public void createMenuScreen()
    {
        // do not open menu twice
        if (game.getTopScreen() instanceof PauseMenu)
        {   return;
        }
                
        // create the menu screen
        PauseMenu m = new PauseMenu(game,this, level, PauseMenu.MENUACTION_EXITEDITOR);
        m.addPriorityAction(PauseMenu.MENUACTION_DISCARDCHANGES);
        m.addDefaultAction(PauseMenu.MENUACTION_CONTINUEEDIT);
        m.addPriorityAction(PauseMenu.MENUACTION_TESTLEVEL);
        m.addPriorityAction(PauseMenu.MENUACTION_EXITEDITOR);
        m.addAction(PauseMenu.MENUACTION_EDITSETTINGS);
        m.addAction(PauseMenu.MENUACTION_EDITNAME);
        m.addAction(PauseMenu.MENUACTION_EDITAUTHOR);
        m.addAction(PauseMenu.MENUACTION_EDITINFO);
        game.addScreen(m);
    }
    
    
    // -------------------- actions from the ingame-menu ---------------
    public void menuAction(int id)
    {   
        switch (id)
        {   
            case PauseMenu.MENUACTION_EXITEDITOR:
                original.copyFrom(level);
                game.writeUserLevel(original);              
                game.removeScreen();
                break;
                
            case PauseMenu.MENUACTION_TESTLEVEL:
                GameScreen gs = new GameScreen(game, level, null, false, true);
                game.addScreen(gs);
                gs.afterScreenCreation();                           
                break;
                                
            case PauseMenu.MENUACTION_DISCARDCHANGES:
                level.copyFrom(original);
                computeTileSize();
                computeMapCenterPosition();
                break;
                
            case PauseMenu.MENUACTION_EDITSETTINGS:
                createMenuScreen();
                game.addScreen(new LevelSettingsDialog(game,level));
                break;

            case PauseMenu.MENUACTION_EDITNAME:
                createMenuScreen();             
                game.addScreen(new TextInputDialog(game,"Name", level.getTitle(), 
                    new TextInputDialog.Listener(){public void valueChanged(String v){level.setTitle(v);}}
                ));
                break;

            case PauseMenu.MENUACTION_EDITAUTHOR:
                createMenuScreen();
                game.addScreen(new TextInputDialog(game,"Author", level.getAuthor(), 
                    new TextInputDialog.Listener(){public void valueChanged(String v){level.setAuthor(v);}}
                ));
                break;

            case PauseMenu.MENUACTION_EDITINFO:
                createMenuScreen();
                game.addScreen(new TextInputDialog(game,"Info", level.getHint(), 
                    new TextInputDialog.Listener(){public void valueChanged(String v){level.setHint(v);}}
                ));
                break;
                
            default:
                break;
        }
    }
*/    


