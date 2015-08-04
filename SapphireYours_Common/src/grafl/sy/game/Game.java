package grafl.sy.game;

import static android.opengl.GLES20.*;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.util.Vector;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import org.json.JSONException;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.AssetFileDescriptor;
import android.media.MediaPlayer;
import android.opengl.GLSurfaceView;
import android.os.Handler;
import android.util.DisplayMetrics;
import android.view.KeyEvent;
import android.view.MotionEvent;
import grafl.sy.logic.Level;
import grafl.sy.logic.LevelPack;
import grafl.sy.logic.Walk;
import grafl.sy.renderer.GfxRenderer;
import grafl.sy.renderer.LevelRenderer;
import grafl.sy.renderer.TextRenderer;
import grafl.sy.renderer.VectorRenderer;
import grafl.sy.screens.GameScreen;
import grafl.sy.screens.MainMenuScreen;
import grafl.sy.screens.Screen;
import grafl.sy.sound.LevelSoundPlayer;

public class Game extends GLSurfaceView implements GLSurfaceView.Renderer  
{
	public final static boolean DEVELOPERMODE = !true;
 	final static int DEFAULTSOLVEDGRADE = -3*60;  // 3 minutes waiting time before level is considered "known"
//	static SimpleProfiler profiler_onsound = new SimpleProfiler("Game.sound", 5);

	final public Context context;
	final Runnable exitCall;
	final Handler asyncHandler;
	final SharedPreferences preferences;
	private int screenwidth;         // size of surface in pixel
	private int screenheight;
	
	public final float detailScale;
	public final float levelScale;
	public final int minButtonSize;  
		
	public LevelRenderer levelRenderer;
	public TextRenderer textRenderer;
	public VectorRenderer vectorRenderer;
	public GfxRenderer gfxRenderer;
	
	public LevelSoundPlayer soundPlayer;
	public MediaPlayer musicPlayer;
	public String musicName;			
			
	private MotionEventSimplifier motionEventSimplifier; 
	private Vector<Screen> screens;
	public boolean usingKeyboardInput;

	public Vector<LevelPack> levelpacks;

 	// construction of game object (handles loading of persistant state also)			
    public Game(Context context, Runnable exitCall, Handler asyncHandler, SharedPreferences preferences)
    {
        super(context);        
        this.context = context;
        this.exitCall = exitCall;
        this.asyncHandler = asyncHandler;
        this.preferences = preferences;
        
        setEGLContextClientVersion(2);
        setRenderer(this);        
        setRenderMode(GLSurfaceView.RENDERMODE_CONTINUOUSLY); 

        this.screenwidth = 1;
        this.screenheight = 1;		
        this.screens = new Vector<Screen>();
        this.levelpacks = new Vector<LevelPack>();
        
		// calculate the detail scale level
    	DisplayMetrics metrics = context.getResources().getDisplayMetrics();    	
    	float dpi = metrics.densityDpi;    	
    	float size_cm = (float) (Math.sqrt(metrics.heightPixels*metrics.heightPixels + metrics.widthPixels*metrics.widthPixels) / (dpi/2.54f)); 
    	 
    	// for displays, that fit into a palm (<15 cm diag), will have smaller game details in relation to dpi 
    	if (size_cm < 15)
    	{	detailScale = dpi / 150; 
    		levelScale = dpi / 250;
    	}
    	// for displays that will be held in both hands normally, use this relation
    	else if (size_cm < 40)
    	{	detailScale = dpi / 120;
    		levelScale = detailScale;
    	}
    	// for big screens, have a completely different calculation because the screen
    	// is normally much farther from the eye
    	else 
    	{	detailScale = dpi / 90; 
    		levelScale = detailScale;   		
    	}
		
		// calculate the minimum size needed for buttons in order for the user to hit them (8mm)
		this.minButtonSize = (int) (dpi/2.54f*0.9f);
        
        // default to touch/mouse input unless otherwise directed 
        usingKeyboardInput = false;

        // clear the music player object - will be immediately filled 
        musicPlayer = null;
        startMusic("silence");

        // load sounds directly at startup (and do not release them)
        soundPlayer = new LevelSoundPlayer(context, asyncHandler);

		// load all levels at startup
		loadLevels();
	
		// facility to simplify tough events to a easy-to-handle single-pointer interface 
		motionEventSimplifier = new MotionEventSimplifier();

        // create the main menu screen
        addScreen (new MainMenuScreen(this));
        
        // if necessary load some stored state and continue
        loadGameState();
    }
    
    public void loadLevels()
    {
    	levelpacks.setSize(0);    	
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
    }
    
    
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
        			GameScreen gs = new GameScreen(this, l,walk, false,false,false);
					addScreen(gs);
					gs.afterScreenCreation(); 	        		
        		}
        		catch (JSONException e)	{} 	
        	}        	
        }
    }
        

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
	
	/** 
	 * Write the level pack that contains the level. The the level can not found (which means it is probably a new 
	 * level), place it into the "User Levels" pack. If this pack not yet exists, create this also.
	 */ 
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
	
        
    // -------------- handling of opening/closing screens --------------
    public void addScreen(Screen screen)
    {
    	screens.add(screen);
    }
    
    public void removeScreen()
    {
    	if (screens.size()<=1)
    	{	clearGameState();   // when leaving game on purpose, do not keep stored game state
    		screens.clear();
    		exitCall.run();		// after closing last remaining screen, try to exit program
    	}
    	else
    	{	
    		Screen olds = screens.elementAt(screens.size()-1);
    		screens.removeElementAt(screens.size()-1);
    		Screen news = screens.elementAt(screens.size()-1);
    		olds.discard();    		
    		news.reactivate();
    	}    	
    }
    
    public Screen getTopScreen()
    {
    	return screens.size()>0 ? screens.lastElement() : null;	
    }
    
    	
    
    // --- SurfaceView.Renderer interface called in opengl thread -----
    @Override
    public void onSurfaceCreated(GL10 unused, EGLConfig config) 
    {
    	loadRenderers();	
	}

    @Override
    public void onSurfaceChanged(GL10 unused, int width, int height)
    {
    	screenwidth = width;
    	screenheight = height;    	
    }
    
	
    @Override
    public void onDrawFrame(GL10 unused) 
    {
    	// topmost screen always gets the tick action (other screens do not animate)
		if (screens.size()>0)
		{	screens.lastElement() . tick();
		}
//profiler_ondraw.done(2);
		    
// profiler_ondraw.start();
		glViewport(0,0,screenwidth,screenheight);
	    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);        	
		glEnable(GL_BLEND);
		glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);	
		
		// paint current contents of all the screens begin from the bottom still visible screen
		int bottom = 0;
		for (int i=1; i<screens.size(); i++)
		{	if (!screens.elementAt(i).isOverlay())
			{	bottom = i; 
			}	
		}
// profiler_ondraw.done(0);
		
		for (int i=bottom; i<screens.size(); i++)
		{	Screen s = screens.elementAt(i);
			if (s.screenwidth!=screenwidth || s.screenheight!=screenheight)
			{	s.resize(screenwidth,screenheight);
			}
			s . draw();
		}
//profiler_ondraw.done(1);
				
        glDisable(GL_BLEND);
//profiler_ondraw.done(3);
 	}

    // --------- loading renderers (will be triggered by system or by user key ----
    public void loadRenderers()
    {
    	// (re)initialize renderers  (create opengl state)
		levelRenderer = null;		
		textRenderer = null;
		vectorRenderer = null;
		gfxRenderer = null;
		
//System.out.println("start loading renderers");		
		if ( (textRenderer = new TextRenderer(context)).hasError())
		{	exitCall.run();
			return;
		}
//System.out.println("TextRenderer loaded");		
		if ( (levelRenderer = new LevelRenderer(context)).hasError())
		{	exitCall.run();
			return;
		}
//System.out.println("LevelRenderer loaded");		
		if ( (vectorRenderer = new VectorRenderer(context)).hasError())
		{	exitCall.run();
			return;
		}
//System.out.println("VectorRenderer loaded");
		if ( (gfxRenderer = new GfxRenderer(context)).hasError())
		{	exitCall.run();
			return;
		}
		    
    }
 	
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
    
/*    
	// ---- create level sub-lists by filtering for some criteria
	public Vector<Level> getIntroductionLevels()
	{	
		Vector<Level> filtered = new Vector<Level>();  
		for (int i=0; i<numberOfIntroLevels; i++)
		{	filtered.addElement(levels.elementAt(i));
		}
//		Collections.sort(filtered,new Level.TitleComparator());		
//		Collections.sort(filtered,new Level.DifficultyComparator());
		return filtered;			
	}

	public Vector<Level> getLevelsForDifficulty(int difficulty)
	{	
		Vector<Level> filtered = new Vector<Level>();  
		for (Level l:levels)
		{	int ld = l.getDifficulty();
			if (ld==difficulty || (difficulty<0 && (ld<1 || ld>9)))
			{	filtered.addElement(l);
			}
		}
		Collections.sort(filtered,new Level.TitleComparator());		
		return filtered;			
	}
	
	public Vector<Level> getLevelsForCategory(int category)
	{	
		Vector<Level> filtered = new Vector<Level>();  
		for (Level l:levels)
		{	int lc = l.getCategory();
			if (lc==category || (category<0 && (lc<0 || lc>7)))
			{	filtered.addElement(l);
			}			
		}
		Collections.sort(filtered,new Level.TitleComparator());
		Collections.sort(filtered,new Level.DifficultyComparator());
		return filtered;			
	}
*/	
	public Level findLevel(String title)
	{
		for (LevelPack p:levelpacks)
		{	
			Level l = p.findLevel(title);
			if (l!=null)
			{	return l;
			}
		}
		return null;
	}
	
	public void startMusic(String filename)
	{
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
	}
	
	public void stopMusic()
	{
		startMusic(null);
	}
		
    
	public void startCategoryMusic(int category)
	{
		switch (category)
		{
			case 0:  // "Fun"
			    startMusic("Time");
				break;				
			case 1:	// "Travel"
				startMusic("Calm");
				break;
			case 2:	// "Action"
				startMusic("Action");
				break;
			case 3: // "Fight"
				startMusic("Granite");
				break;
			case 4:	// "Puzzle"
			    startMusic("Crystal");
				break;
			case 5: // "Science"
				startMusic("Only Solutions");
				break;
			case 6: // "Work"
				startMusic("Nightshift");
				break;				
		}
	}

    
    // --------------------- static toolbox methods ------------------------------
    public static int getColorForDifficulty(int difficulty)
    {
    	switch(difficulty)
    	{	//case 0:		// Tutorial 
    		//	return argb(87,179,255);
    		case 1:		// Simple
    			return argb(170,120,255);
    		case 2:		// Easy
    			return argb(30,150,255);
    		case 3:		// Moderate
    			return argb(40,215,215);
    		case 4:		// Normal
    			return argb(50,255,0);
    		case 5:		// Tricky
				return argb(240,240,0);
    		case 6:		// Tough
    			return argb(255,139,0);
    		case 7:		// Difficult
    			return argb(255,70,0);
    		case 8:		// Hard
    			return argb(255,40,40);
    		case 9:		// M.A.D.
    			return argb(255,0,100);
    		default:
				return argb(170,170,170);
    	}
    }
    
    public static String getNameForDifficulty(int difficulty)
    {
    	switch(difficulty)
    	{	//case 0:		   
    		//	return "Tutorial";
    		case 1:		
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
    }

	public static String getNameForCategory(int category)    
	{	
		switch (category)
		{	case 0: 
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
	}
	

	private static int argb(int r, int g, int b)
	{
		return 0xff000000 | (r<<16) | (g<<8) | (b<<0);	
	}
    

     	
}

