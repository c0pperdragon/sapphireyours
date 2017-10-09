
var Game = function()  
{   this.context = null;
    this.exitcall = null;
    
    this.screenwidth = 0;         // size of surface in pixel
    this.screenheight = 0;	
    this.detailScale = 0;
    this.levelScale = 0;
    this.minButtonSize = 0;

    this.levelRenderer = null;
    this.textRenderer = null;
    this.vectorRenderer = null;
    this.gfxRenderer = null;

    this.soundPlayer = null;
    this.musicPlayer = null;
    this.musicName = null;

    this.screens = null;
    this.needRedraw = false;
    this.usingKeyboardInput = false;

    this.levelpacks = null;
};
Game.prototype.constructor = Game;


Game.DEVELOPERMODE = !true;
Game.DEFAULTSOLVEDGRADE = -3*60;  // 3 minutes waiting time before level is considered "known"
//	static SimpleProfiler profiler_onsound = new SimpleProfiler("Game.sound", 5);


// construction of game object (handles loading of persistant state also)
Game.prototype.$ = function(canvas,exitcall)
{
    this.context = canvas.getContext
    (   "webgl", 
        {   antialias: false,
            alpha: false,    
        }   
    );
    this.exitcall = exitcall;
    
    this.screenwidth = 500;
    this.screenheight = 500;		
    this.screens = [];
    this.levelpacks = [];
        
    // calculate the detail scale level
    var dpi = 90; // metrics.densityDpi;    	
    var size_cm = 50; // (Math.sqrt(metrics.heightPixels*metrics.heightPixels + metrics.widthPixels*metrics.widthPixels) / (dpi/2.54f)); 
    	 
    // for displays, that fit into a palm (<15 cm diag), will have smaller game details in relation to dpi 
    if (size_cm < 15)
    {   this.detailScale = dpi / 220; 
        this.levelScale = dpi / 220;
    }
    // for displays that will be held in both hands normally, use this relation
    else if (size_cm < 40)
    {   this.detailScale = dpi / 120;
        this.levelScale = detailScale;
    }
    // for big screens, have a completely different calculation because the screen
    // is normally much farther from the eye
    else 
    {   this.detailScale = dpi / 90; 
        this.levelScale = this.detailScale;   		
    }

    // calculate the minimum size needed for buttons in order for the user to hit them (8mm)
    this.minButtonSize = (dpi/2.54*0.9);
        
    // create the renderers and load data
    this.loadRenderers();
        
    // default to touch/mouse input unless otherwise directed 
    this.usingKeyboardInput = false;

    // clear the music player object - will be immediately filled 
    this.musicPlayer = null;
    this.startMusic("silence");

    // load sounds directly at startup (and do not release them)
    this.soundPlayer = null; // new LevelSoundPlayer(context, asyncHandler);

    // load all levels at startup
    this.loadLevels();

    // create the main menu screen
//    addScreen (new MainMenuScreen().$(this));
    this.addScreen (new TestScreen().$(this));
                
//    // if necessary load some stored state and continue
//    loadGameState();

    // set up game loop
    var that = this;
    window.requestAnimationFrame (ftick);
    function ftick() 
    {   window.requestAnimationFrame(ftick);
        that.tick();
    };   

    return this;
};
    
Game.prototype.loadLevels = function()
{
    levelpacks = [];
/*    
    	readUserLevelPacks();    	   
		readIntegratedLevelPack("Lesson 1: Mining", "tutorial1", false);
		readIntegratedLevelPack("Lesson 2: Explosives", "tutorial2", false);
		readIntegratedLevelPack("Lesson 3: Maze", "tutorial3", false);
		readIntegratedLevelPack("Lesson 4: Enemies", "tutorial4", false);
		readIntegratedLevelPack("Lesson 5: Machinery", "tutorial5", false);
	    readIntegratedLevelPack("Teamwork", "twoplayer", true);
		readIntegratedLevelPack("Advanced 1", "advanced1", true);
		readIntegratedLevelPack("Advanced 2", "advanced2", true);
		readIntegratedLevelPack("Advanced 3", "advanced3", true);
	    readIntegratedLevelPack("Extended 1", "extended1", true);
	    readIntegratedLevelPack("Extended 2", "extended2", true);
	    readIntegratedLevelPack("Extended 3", "extended3", true);
	    readIntegratedLevelPack("Extended 4", "extended4", true);
	    readIntegratedLevelPack("Extended 5", "extended5", true);
	    readIntegratedLevelPack("Extended 6", "extended6", true);
	    readIntegratedLevelPack("Extended 7", "extended7", true);
		readIntegratedLevelPack("Mission Possible", "mission", false);
*/        
};
    
/*    
    // persistent state handling
    private void storeGameState()
    {		
		// find an open game screen to check if there is some unfinished game running
		GameScreen gamescreen = null;
		for (int i=0; i<screens.size(); i++)
		{	if (screens.elementAt(i) instanceof GameScreen)
			{	gamescreen = (GameScreen) screens.elementAt(i);
				break;
			}
		}
		// when there is a game screen open, store data 
		if (gamescreen!=null)
		{	SharedPreferences.Editor edit = preferences.edit();
			edit.putString("unfinished_title", gamescreen.getCurrentLevelTitle());
			edit.putString("unfinished_walk", gamescreen.getCurrentWalkSerialized());
			edit.apply();
			gamescreen.flushRecordingTimeMeasurement();			
		}
		// otherwise clear previous data if still present
		else
		{	clearGameState();
		}
    }
        
    private void clearGameState()
    {
		if (preferences.contains("unfinished_title"))
		{	SharedPreferences.Editor edit = preferences.edit();
			edit.remove("unfinished_title");
			edit.remove("unfinished_walk");
			edit.apply();			
		}    
    }

    private void loadGameState()
    {
        // when there is some persistent game state, try to re-create the game, but also clear the state as soon as possible
        // (to prevent a faulty game state to completely ruin the installation)
        if (preferences.contains("unfinished_title"))
        {	String t = preferences.getString("unfinished_title", "");
        	String w = preferences.getString("unfinished_walk", "");        	
        	clearGameState();
        	
        	Level l = findLevel(t);
        	if (l!=null)
        	{	try
        		{	Walk walk = new Walk(w);
        			GameScreen gs = new GameScreen(this, l,walk, false,false);
					addScreen(gs);
					gs.afterScreenCreation(); 	        		
        		}
        		catch (JSONException e)	{} 	
        	}        	
        }
    }
*/        
/*
   	// ---------------- handling of global game information ---------
 	
	public void setLevelSolvedGrade(Level l, int solutiongrade)
	{
		String key = "state_"+l.getTitle();
		if (solutiongrade > preferences.getInt(key,DEFAULTSOLVEDGRADE) )
		{	SharedPreferences.Editor edit = preferences.edit();
			edit.putInt(key, solutiongrade);
			edit.apply();
		}
	}
	
	public int getLevelSolvedGrade(Level l)
	{
		String key = "state_"+l.getTitle();
		return preferences.getInt(key,DEFAULTSOLVEDGRADE);
	}
		
	public void setMusicActive(boolean active)
	{
		SharedPreferences.Editor edit = preferences.edit();
		edit.putInt("music", active ? 1 : 0);
		edit.apply();
	}		

	public boolean getMusicActive()
	{
		return preferences.getInt("music",1) != 0;
	}		
		
	public void readIntegratedLevelPack(String name, String filename, boolean sort)
	{
		try 
		{	InputStream is = context.getAssets().open("levels/"+filename+".sylev");
			try 
			{	levelpacks.addElement(new LevelPack(name, is, sort, null));
			} 
			catch (Exception e)
			{	is.close();
				throw e;
			}
			is.close();				
        } catch (Exception e)
    	{	e.printStackTrace();    		
    	}	
	}		

	public void readUserLevelPacks()
	{		
		try 
		{	for (String n: context.fileList())
			{
				if (n.toLowerCase().endsWith(".sylev"))
				{
					InputStream is = context.openFileInput(n);
					try {
						levelpacks.addElement(new LevelPack(n.substring(0,n.length()-6), is, false, n));			
					}
					catch (Exception e)
					{	is.close();
						throw e;
					}
					is.close();				
				}
			}
        } catch (Exception e)
    	{	e.printStackTrace();    		
    	}				
	}
*/	
	/** 
	 * Write the level pack that contains the level. The the level can not found (which means it is probably a new 
	 * level), place it into the "User Levels" pack. If this pack not yet exists, create this also.
	 */ 
/*     
	public void writeUserLevel(Level l)
	{
		// find the pack which contains the level
		LevelPack pack = null;
		LevelPack defaultpack = null;
		for (LevelPack p:levelpacks)
		{
			if (p.isWriteable())
			{	if (p.containsLevel(l))
				{
					pack = p;			
				}
				else if (p.getName().equals("User Levels"))
				{	defaultpack = p;
				}
			}
		}	
		// when the level belongs to a pack, just store the pack
		if (pack!=null)
		{
			writeLevelPack(pack);							
		}
		// when not found, need to add level to the default pack
		else
		{
			// must create default pack if needed
			if (defaultpack==null)
			{
				defaultpack = new LevelPack("User Levels", "User Levels.sylev");
				levelpacks.insertElementAt(defaultpack,0);
				pack = defaultpack;			
			}					
			defaultpack.addLevel(l);
			
			writeLevelPack(defaultpack);
		}
	
	}
	
	public void writeLevelPack(LevelPack p)
	{
		try {
			OutputStream os = context.openFileOutput(p.filename, 0);
			try {
				PrintStream ps = new PrintStream(os, false, "utf-8");
				p.print (ps);
				ps.close();
			}
			catch (Exception e) {}
			os.close();
		} 
		catch (Exception e) {}
	}
*/	

// constant game loop
Game.prototype.tick = function()
{
    // topmost screen always gets the tick action (other screens do not animate)
    if (this.screens.length>0)
    {   this.getTopScreen().tick();
    }
    
    // when anything changed in the display, redraw
    if (this.needRedraw) 
    {   this.needRedraw = false;
        this.draw();
    }
};

Game.prototype.draw = function()
{
    var gl = this.context;
    gl.viewport(0,0,this.screenwidth,this.screenheight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // paint current contents of all the screens begin from the bottom still visible screen
    var bottom = 0;
    for (var i=1; i<this.screens.length; i++)
    {   if (!this.screens[i].isOverlay())
        {   bottom = i; 
        }
    }
    
    for (var i=bottom; i<this.screens.length; i++)
    {   var s = this.screens[i];
        if (s.screenwidth!=this.screenwidth || s.screenheight!=this.screenheight)
        {   s.resize(this.screenwidth,this.screenheight);
        }
        s . draw();
    }
    
    gl.disable(gl.BLEND);       
};
        
// -------------- handling of opening/closing screens and screens notifying changes -------
    
Game.prototype.setDirty = function()    
{    this.needRedraw = true;
};
    
Game.prototype.addScreen = function(screen)
{   this.screens.push(screen);
    this.needRedraw = true;
};
    
Game.prototype.removeScreen = function()
{
    this.needRedraw = true;
    if (this.screens.length<=1)
    {   //	clearGameState();   // when leaving game on purpose, do not keep stored game state
        this.screens = [];
        (this.exitcall)();		// after closing last remaining screen, try to exit program
    }
    else
    {   var olds = screens.pop();
        var news = screens[screens.length-1];
        olds.discard();    		
        news.reactivate();
    }
};
    
Game.prototype.getTopScreen = function()
{
    return this.screens.length>0 ? this.screens[this.screens.length-1] : null;
};
        

// --------- loading renderers (will be triggered by system or by user key ----
Game.prototype.loadRenderers = function()
{
    // (re)initialize renderers  (create opengl state)
    this.levelRenderer = null;		
    this.textRenderer = null;
    this.vectorRenderer = null;
    this.gfxRenderer = null;

    console.log("start loading renderers");

    this.vectorRenderer = new VectorRenderer().$(this.context);
    console.log(this.vectorRenderer);
    if (this.vectorRenderer.hasError())
    {   (this.exitcall)();
        return;
    }
    console.log("VectorRenderer loaded");
/*    
    if ( (this.textRenderer = new TextRenderer().$(this.context)).hasError())
    {   (this.exitcall)();
        return;
    }
    console.log("TextRenderer loaded");
    
    if ( (this.levelRenderer = new LevelRenderer().$(context)).hasError())
    {   (this.exitcall)();
        return; 
    }
    console.log("LevelRenderer loaded");
    if ( (this.gfxRenderer = new GfxRenderer().$(context)).hasError())
    {   (this.exitcall)();
        return;
    }
    console.log("GfxRenderer loaded");    
*/    
}
 
 /*
 	// ---- handling of events in the GL thread 
    public void handleTouchEvent(final MotionEvent event) 
    {
    	usingKeyboardInput = false;
        
        if (screens.size()>0) 
        {	motionEventSimplifier.handleTouchEvent(event, screens.lastElement());
        }
    }	

    public void handleKeyEvent(final KeyEvent event) 
    {
    	int action = event.getAction();
    	int code = event.getKeyCode();
    	
    	// check if there was really some keyboard input (not virtual key actions)
    	if (code!=KeyEvent.KEYCODE_BACK && code!=KeyEvent.KEYCODE_MENU) 
    	{	usingKeyboardInput = true;
    	}
    	
		if (action==KeyEvent.ACTION_DOWN && screens.size()>0 && (code==KeyEvent.KEYCODE_BACK || code==0x0000006f))
       	{	screens.lastElement().handleBackNavigation();
       	}        			
       	else if (screens.size()>0)
       	{	
			screens.lastElement().handleKeyEvent(event);
        }
    }	
 	
 		
 	
 	
    // ---- they are called in the android UI thread - must pass through to GL thread ---
    @Override
    public boolean onTouchEvent(final MotionEvent event) {
        queueEvent(
        	new Runnable() {
        		public void run() {
        			handleTouchEvent(event);
        		}
        	}
        );
        return true;
    }	

    @Override
    public boolean onKeyDown(final int keyCode, final KeyEvent event) {
        queueEvent(
        	new Runnable() {
        		public void run() {
        			handleKeyEvent(event);
        		}
        	}
        );
        // consume certain events to make sure, the system does not respond to those
		return (event.getAction()==KeyEvent.ACTION_DOWN && event.getKeyCode()==KeyEvent.KEYCODE_BACK);	
    }	
	@Override
    public boolean onKeyUp(final int keyCode, final KeyEvent event)
    {
        queueEvent(
        	new Runnable() {
        		public void run() {
        			handleKeyEvent(event);
        		}
        	}
        );
        return false;
    }
    
    @Override 
    public void onPause()
    {
        queueEvent(
        	new Runnable() {
        		public void run() {
        			storeGameState();
        		}
        	}
        );
    	super.onPause();
    }
*/    

Game.prototype.startMusic = function(filename)
{
/*    
    // keep already running music
    if (musicPlayer!=null && musicName.equals(filename))
    {
			return;
		}
	
		if (musicPlayer!=null)
		{
			musicPlayer.release();
			musicPlayer=null;
		}
		if (filename!=null)
		{
		
			try
			{				
				AssetFileDescriptor afd = context.getAssets().openFd("music/"+filename+".mp3");
				musicPlayer = new MediaPlayer();
				musicPlayer.setDataSource (afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
				musicPlayer.prepare();
				musicPlayer.setLooping(true);
				musicPlayer.start();
				musicName = filename;				
			}
			catch (IOException e) {}
			
		}
*/        
};

Game.prototype.stopMusic = function()
{
    this.startMusic(null);
};

Game.prototype.startCategoryMusic = function (category)
{
    switch (category)
    {   case 0:  // "Fun"
            this.startMusic("Time");
            break;				
        case 1:	// "Travel"
            this.startMusic("Calm");
            break;
        case 2:	// "Action"
            this.startMusic("Action");
            break;
        case 3: // "Fight"
            this.startMusic("Granite");
            this.break;
        case 4:	// "Puzzle"
            this.startMusic("Crystal");
            this.break;
        case 5: // "Science"
            this.startMusic("Only Solutions");
            break;
        case 6: // "Work"
            this.startMusic("Time");
            this.break;        
    }
};

    
// --------------------- static toolbox methods ------------------------------

Game.getColorForDifficulty = function(difficulty)
{
    switch(difficulty)
    {   case 1:     // Simple
            return Game.argb(170,120,255);
        case 2:     // Easy
            return Game.argb(30,150,255);
        case 3:     // Moderate
            return Game.argb(40,215,215);
        case 4:     // Normal
            return Game.argb(50,255,0);
        case 5:     // Tricky
            return Game.argb(240,240,0);
        case 6:     // Tough
            return Game.argb(255,139,0);
        case 7:     // Difficult
            return Game.argb(255,70,0);
        case 8:     // Hard
            return Game.argb(255,40,40);
        case 9:		// M.A.D.
            return Game.argb(255,0,100);
        default:
            return Game.argb(170,170,170);
    }
};
    
Game.getNameForDifficulty = function(difficulty)
{
    switch(difficulty)
    {   case 1:
            return "Simple";
        case 2:
            return "Easy";
        case 3:
            return "Straight";
        case 4:
            return "Normal";
        case 5:
            return "Tricky";
        case 6:
            return "Tough";
        case 7:
            return "Difficult";
        case 8:
            return "Hard";
        case 9:
            return "M.A.D.";
        default:
            return "unrated";
    }
};

Game.getNameForCategory = function(category)    
{
    switch (category)
    {   case 0: 
            return "Fun";
        case 1:
            return "Travel";            
        case 2:
            return "Action";
        case 3:
            return "Fight";
        case 4:	
            return "Puzzle";
        case 5:	
            return "Science";
        case 6:
            return "Work";
        default:
            return "unknown";
    }
};
    
Game.argb = function(r, g, b)
{
    return 0xff000000 | (r<<16) | (g<<8) | (b<<0);
};

