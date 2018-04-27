package grafl.sy.screens;


import grafl.sy.buttons.Button;
import grafl.sy.buttons.MenuButton;
import grafl.sy.game.Game;
import grafl.sy.logic.Level;
import grafl.sy.logic.Logic;
import grafl.sy.renderer.LevelRenderer;
import grafl.sy.renderer.VectorRenderer;

public class EditorScreen extends Screen implements MenuListener
{
	static final int MODE_MOVESCREEN = -1;
	static final int MODE_ZOOMSCREEN = -2;

	static int[][] toolgroups = {
		{	MODE_MOVESCREEN, MODE_ZOOMSCREEN },
		{	Logic.MAN1, Logic.MAN2, Logic.AIR, Logic.DOOR },
		
		{	Logic.EARTH, Logic.WALL, Logic.ROUNDWALL, Logic.GLASSWALL, Logic.WALLEMERALD, Logic.STONEWALL, Logic.ROUNDSTONEWALL},
		
		{   Logic.EMERALD, Logic.CITRINE, Logic.SAPPHIRE, Logic.RUBY, Logic.ROCK, Logic.ROCKEMERALD, Logic.BAG, Logic.BOX },

		{   Logic.BOMB, Logic.TIMEBOMB, Logic.ACTIVEBOMB5, Logic.TIMEBOMB10 },     		   
		
		{   Logic.SAND, Logic.SAND_FULL, Logic.SAND_FULLEMERALD, Logic.ACID },
		{   Logic.DOORBLUE, Logic.DOORRED, Logic.DOORGREEN, Logic.DOORYELLOW, Logic.KEYBLUE, Logic.KEYRED, Logic.KEYGREEN, Logic.KEYYELLOW, Logic.ONETIMEDOOR, Logic.CUSHION},
		
		{   Logic.LORRYLEFT, Logic.LORRYUP, Logic.LORRYRIGHT, Logic.LORRYDOWN, Logic.BUGLEFT, Logic.BUGUP, Logic.BUGRIGHT, Logic.BUGDOWN},
		{   Logic.YAMYAMLEFT, Logic.YAMYAMUP, Logic.YAMYAMRIGHT, Logic.YAMYAMDOWN, Logic.ROBOT, Logic.SWAMP, Logic.DROP },        

		{    Logic.ELEVATOR, Logic.ELEVATOR_TOLEFT, Logic.ELEVATOR_TORIGHT, Logic.CONVERTER,
		 	 Logic.GUN0, Logic.GUN1, Logic.GUN2, Logic.GUN3  },        		
	};
	
		
		

	Level original;
	Level level;
	int screentilesize;
	int mapcenterx;	// position in the map (in pixels), where the screen center lies
	int mapcentery;
	
	int toolbarx;
	int toolbary;
	int tooltilesize;	
	int tooltilespacing;
	int toolselectionx;
	int toolselectioncolumns;
		
	int[] selectedtools;
	int currenttool;
	boolean toolselectionopen;
	
	int pointerprevx;
	int pointerprevy;
	int pointerdownx;
	int pointerdowny;
	int zoom;

	Button menuButton;
	
	public EditorScreen (Game game, Level original)
	{
		super(game);
		
		this.original = original;
		this.level = new Level();
		this.level.copyFrom(original);
		this.screentilesize = 60;
		
		this.toolbarx = 5;
		this.toolbary = 5;
		this.tooltilesize = 60;
		this.tooltilespacing = 3;
		this.toolselectionx = 71;
		this.toolselectioncolumns = 4;
		
		selectedtools = new int[toolgroups.length];
		toolselectionopen = false;
		currenttool = 0;
		
		pointerprevx = 0;
		pointerprevy = 0;
		zoom = 0;
		
		computeTileSize();
		computeMapCenterPosition();
	}
	
	public void afterScreenCreation()
	{
		createMenuScreen();
	}
	
	
	@Override
	public void resize(int screenwidth, int screenheight)
	{
		super.resize(screenwidth, screenheight);

		float scale = game.detailScale;	
		float statusbarheight = scale*50;
		float space = scale*5;
		
		// (re)create menu button
		menuButton = new MenuButton(game, screenwidth-statusbarheight-space, screenheight-statusbarheight-space, 
							statusbarheight,statusbarheight,new Runnable(){ public void run(){ 	createMenuScreen(); }} );
	}
	
	void computeTileSize()
	{	
		screentilesize = (int)(60*Math.exp(zoom*0.004f));
	}

	void computeMapCenterPosition()
	{
		mapcenterx = level.getWidth()*screentilesize/2;
		mapcentery = level.getHeight()*screentilesize/2;			
	}
	
	
	public void draw()
	{
		int w = level.getWidth();
		int h = level.getHeight();
	
		LevelRenderer lr = game.levelRenderer;
		VectorRenderer vr = game.vectorRenderer;

		// -- draw the level -- 
		// set up renderers
		lr.startDrawing (screenwidth, screenheight, screentilesize);
		vr.startDrawing (screenwidth, screenheight);
		int screencenterx = screenwidth/2;
		int screencentery = screenheight/2;
		
//		vr.addRectangle(screencenterx-mapcenterx-1.0f, screencentery-mapcentery-1.0f, 
//		  w*screentilesize+2.0f, h*screentilesize+2.0f, 0xff222222);
//		vr.flush();
		
		for (int y=0; y<h; y++)
		{
			for (int x=0; x<w; x++)
			{
				lr.addRestingPieceToBuffer(x*60,y*60, level.getPiece(x,y));
			}
		}		
		lr.flush();

		lr.startDrawing (screenwidth, screenheight, tooltilesize);
		
		// -- draw the decoration of the toolbar and selection box --
		vr.addRectangle(toolbarx-1.0f,toolbary-1.0f, tooltilesize+2.0f, (tooltilesize+tooltilespacing)*toolgroups.length-tooltilespacing+2.0f, 0xffffffff);
		vr.addRectangle(toolbarx, toolbary, tooltilesize, (tooltilesize+tooltilespacing)*toolgroups.length-tooltilespacing, 0xff000000);
		vr.addFrame(toolbarx-3.0f,toolbary+currenttool*(tooltilesize+tooltilespacing)-3.0f, tooltilesize+6.0f, tooltilesize+6.0f, 3.0f, 0xffffff00);
		if (toolselectionopen)
		{	int boxwidth = Math.min(toolgroups[currenttool].length, toolselectioncolumns) * (tooltilesize+tooltilespacing) - tooltilespacing;
			int boxheight = ((toolgroups[currenttool].length+toolselectioncolumns-1) / toolselectioncolumns) * (tooltilesize+tooltilespacing) - tooltilespacing;			
			int toolselectiony = toolbary+currenttool*(tooltilesize+tooltilespacing);
			vr.addRectangle(toolselectionx-2.0f, toolselectiony-2.0f, boxwidth+4.0f, boxheight+4.0f, 0xffffffff); 
			vr.addRectangle(toolselectionx-1.0f, toolselectiony-1.0f, boxwidth+2.0f, boxheight+2.0f, 0xff000000); 
		}
		vr.flush();
		
		// --- draw the tiles in the toolbar in selection box
		for (int i=0; i<toolgroups.length; i++)
		{
			drawTileOrCommand(toolbarx, toolbary+i*(tooltilesize+tooltilespacing), toolgroups[i][selectedtools[i]]);		
		}
		if (toolselectionopen)
		{	int toolselectiony = toolbary+currenttool*(tooltilesize+tooltilespacing);
			for (int i=0; i<toolgroups[currenttool].length; i++)
			{
				int row = i / toolselectioncolumns;
				int column = i % toolselectioncolumns;
				drawTileOrCommand(toolselectionx+column*(tooltilesize+tooltilespacing), toolselectiony+row*(tooltilesize+tooltilespacing), toolgroups[currenttool][i]);
			}		
		}
		
		
		// paint the menu button (but only if no menu is already present)
		if (game.getTopScreen()==this)
		{	menuButton.draw(game.vectorRenderer);
		}
		
		// flush everything to screen
		vr.flush();
		lr.flush();
	}
	
	private void drawTileOrCommand(int x, int y, int t)
	{
		switch (t)
		{	case MODE_MOVESCREEN:
				game.vectorRenderer.addCrossArrows(x,y,tooltilesize,tooltilesize, 0xffffffff); 
				break;
			case MODE_ZOOMSCREEN:
				game.vectorRenderer.addZoomArrows(x,y,tooltilesize,tooltilesize, 0xffffffff); 
				break;		
			default:
				game.levelRenderer.addSimplePieceToBuffer(x,y,(byte)t);
		}
	}


    // ---- touch event handlers called in GL thread ----
	@Override
	public void onPointerDown(int x, int y)
	{
		if (menuButton.onPointerDown(x,y))
		{	return;
		}

		// check if click on tool bar (opening the selection menu) 
		if (!toolselectionopen && x>=toolbarx && y>=toolbary && x<toolbarx+tooltilesize)
		{
			int s = (y-toolbary) / (tooltilesize+tooltilespacing);
			if (s>=0 && s<toolgroups.length)
			{
				currenttool = s;
				toolselectionopen = true;
				return;			
			}
		}
		
		if (!toolselectionopen)
		{
			int t = toolgroups[currenttool][selectedtools[currenttool]];
			if (t>0) tryPlaceTile(x,y,(byte)t);
		}

		pointerprevx = x;
		pointerprevy = y;
		pointerdownx = x;
		pointerdowny = y;
	}
	
	@Override
	public void onPointerUp()
	{
		menuButton.onPointerUp();		

		if (toolselectionopen)
		{
			toolselectionopen = false;
		}
	}
	
	@Override
	public void onPointerMove(int x, int y)	
	{
		menuButton.onPointerMove(x,y);

		if (toolselectionopen)
		{
			int toolselectiony = toolbary+currenttool*(tooltilesize+tooltilespacing);
			if (x>=toolselectionx && y>=toolselectiony && x<toolselectionx+toolselectioncolumns*(tooltilesize+tooltilespacing))
			{
				int row = (y-toolselectiony) / (tooltilesize+tooltilespacing);
				int column = (x-toolselectionx) / (tooltilesize+tooltilespacing);
				int i = row*toolselectioncolumns + column;
				if (i>=0 && i<toolgroups[currenttool].length)
				{
					selectedtools[currenttool] = i;
				}
			}			
		}
		else
		{
			int t = toolgroups[currenttool][selectedtools[currenttool]];			
			if (t>0)
			{	tryPlaceTile(x,y,(byte)t);
			} 
			else if (t==MODE_MOVESCREEN) 
			{
				mapcenterx -= (x-pointerprevx);
				mapcentery -= (y-pointerprevy);
			}
			else if (t==MODE_ZOOMSCREEN)
			{
				int refx = (pointerdownx - screenwidth/2);
				int refy = (pointerdowny - screenheight/2);
				
				// calculate where in the map the reference point was (in tiles)				
				float mappointerx = (mapcenterx + refx) / (screentilesize*1.0f);
				float mappointery = (mapcentery + refy) / (screentilesize*1.0f);
			
				// do the zooming			
				zoom = Math.min(Math.max(zoom + (y-pointerprevy), -500), 250);
				computeTileSize();
				
				// calculate where in the map, ther pointer is after zooming
				float mappointerx_after = (mapcenterx + refx) / (screentilesize*1.0f);
				float mappointery_after = (mapcentery + refy) / (screentilesize*1.0f);

				// apply scrolling to get same anchor pointer afterwards
				mapcenterx += (mappointerx - mappointerx_after) * screentilesize;
				mapcentery += (mappointery - mappointery_after) * screentilesize;

// System.out.println("before: "+mappointerx+","+mappointery+"  after: "+mappointerx_after+","+mappointery_after);
				
			}
		}
				
		pointerprevx = x;
		pointerprevy = y;		
    }


    @Override
    public void handleBackNavigation()
    {
    	// when in the editor screen, back navigation just calls up the ingame menu
    	createMenuScreen();    
    }	


	private void tryPlaceTile(int x, int y, byte piece)
	{
		int screencenterx = screenwidth/2;
		int screencentery = screenheight/2;

		int mapx =  x - screencenterx + mapcenterx;
		int mapy =  y - screencentery + mapcentery;
		
		int column = mapx>=0 ? mapx/screentilesize : -1 - (-mapx) / screentilesize; 
		int row =    mapy>=0 ?  mapy/screentilesize : -1 - (-mapy) / screentilesize;
				
		int[] delta = level.setPieceAndAdjustLoot(column,row,piece);
		if (delta!=null)
		{	mapcenterx -= delta[0]*screentilesize;
			mapcentery -= delta[1]*screentilesize;
			game.requestRender();
		} 				
	}
	
	
	public void createMenuScreen()
	{
		// do not open menu twice
		if (game.getTopScreen() instanceof PauseMenu)
		{	return;
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
	
}

