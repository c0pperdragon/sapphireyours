package grafl.sy.screens;

import android.view.KeyEvent;
import grafl.sy.buttons.Button;
import grafl.sy.buttons.PauseButton;
import grafl.sy.game.Game;
import grafl.sy.logic.Level;
import grafl.sy.logic.Logic;
import grafl.sy.logic.Walk;
import grafl.sy.renderer.LevelRenderer;
import grafl.sy.renderer.TextRenderer;
import grafl.sy.renderer.VectorRenderer;

public class GameScreen extends Screen implements MenuListener
{
	final static int PLAYMODE_RECORD = 0;
	final static int PLAYMODE_DEMO   = 1;
	final static int PLAYMODE_UNDO   = 2;
	final static int PLAYMODE_REPLAY = 3;

	private Level level;
	private Logic logic;
	private Walk walk;
	private boolean canFindNextLevel;
	private boolean startFromEditor;
	private boolean canModify;
	
	int step;
	int frames_left;	 
	int playmode;
	int playbackspeed;	
	int slowmotion_counter;
	boolean singlestep;	
    long time_at_record_start;
	boolean diduse_undo;
	boolean diduse_singlestep;

	int screentilesize;
	int screenscrollx0;
	int screenscrolly0;
	int screenscrollx1;
	int screenscrolly1;	
	
	int statusbarx1;
	int statusbary1;

	GamePadInputBuffer[] gamePadMUX;
	KeyboardToGamepadTranslator keyboardTranslator;
	TouchInputGrid[] inputGrid;
	Button menuButton;
	TimeCalculator timeCalc;
	
	int inputfocushighlightplayer; 
	int inputfocushighlightx;
	int inputfocushighlighty;
	int inputmodeswitchtime;
	int screenshaketime;


	public GameScreen(Game game, Level le, Walk unfinishedwalk, boolean canFindNextLevel, boolean startFromEditor, boolean canModify)
	{	           
		super(game);				
		
		this.level = le;
		this.canFindNextLevel = canFindNextLevel;
		this.startFromEditor = startFromEditor;
		this.canModify = canModify;
        logic = null;
        frames_left=0;
        playmode = PLAYMODE_RECORD;
        
        // re-start existing walk
        if (unfinishedwalk!=null)
        {	walk = unfinishedwalk;
	        step = walk.getTurns();
        }
        // build new walk
        else 
        {	walk = new Walk(10000);
	    	walk.initialize((int)(Math.random()*1000000));
	    	step = 0;
        }
	    logic = new Logic(10000);
    	logic.attach(le,walk);
    	logic.gototurn(step);
                
        gamePadMUX = new GamePadInputBuffer[]{ new GamePadInputBuffer(), new GamePadInputBuffer() };
        keyboardTranslator = new KeyboardToGamepadTranslator(gamePadMUX[0], gamePadMUX[1]);
        inputGrid = new TouchInputGrid[]{new TouchInputGrid(game, 0x998888ff), new TouchInputGrid(game, 0xaa77ff55)};
        
        timeCalc = new TimeCalculator();        			
	}

	public void afterScreenCreation()
	{
		if (!startFromEditor)
		{	createMenuScreen(step!=0);
		}		
		if (game.getMusicActive()) 
		{	game.startCategoryMusic(level.getCategory());
		}        
	}
		
	@Override
	public void discard()
	{
		game.stopMusic();
	}

	@Override
	public void resize(int screenwidth, int screenheight)
	{
		super.resize(screenwidth, screenheight);

		float scale = game.detailScale;	
		float statusbarheight = scale*50;
		float space = scale*5;
		
		// (re)create menu button
		menuButton = new PauseButton(game, screenwidth-statusbarheight-space, screenheight-statusbarheight-space, 
							statusbarheight,statusbarheight,new Runnable(){ public void run(){ 	createMenuScreen(true); }} );
		
		// calculate the current scrolling position
		adjustScrolling(true);		
	}

	@Override
	public void tick()
	{
		int frames = timeCalc.calculateLogicFrames();

   		switch (playmode)
   		{	case PLAYMODE_RECORD:
				for (int i=0; i<frames; i++)
				{	gameRecording();
				}
				adjustScrolling(false);

				if (logic.isOverForSomeTime()) 
				{	createMenuScreen(false);
				}
				break;
				
			case PLAYMODE_DEMO:
			case PLAYMODE_REPLAY:
				for (int i=0; i<frames; i++)
				{	gamePlayback();
				}
				adjustScrolling(true);				
				break;
			case PLAYMODE_UNDO:
				for (int i=0; i<frames; i++)
				{	gameUndo();
				}
				adjustScrolling(true);
				break;
   		}

	}


	@Override
	public void draw()
	{			
		// handle screen shaking feature
		int screenshake=0;
		if (screenshaketime>0)
		{	screenshaketime--;
			screenshake = 1 * (screenshaketime%2);
		}		
	
		// paint the level tiles in a big action
		LevelRenderer lr = game.levelRenderer; 
		if (lr!=null && (logic!=null))
        {  	lr.draw(screenwidth, screenheight, screentilesize, logic, frames_left,
        	 screenscrollx0, screenscrolly0+screenshake, screenscrollx1, screenscrolly1+screenshake); 
        }

		float statusbarheight = screentilesize*0.833f;
		float statustextheight = statusbarheight*0.8f;
		float statustilesize = statusbarheight*0.8f;		
		float hspace = statusbarheight/10.0f;
	
		// set up the renderers
		lr.startDrawing(screenwidth,screenheight, (int)statustilesize);		
        TextRenderer tr = game.textRenderer;
        tr.startDrawing(screenwidth, screenheight);
        VectorRenderer vr = game.vectorRenderer;
        vr.startDrawing(screenwidth, screenheight);

		// add a focus highlight
		if (inputmodeswitchtime>0)
		{	inputmodeswitchtime--;
		}   		
		if (inputfocushighlightx>=0 && inputfocushighlighty>=0 && inputmodeswitchtime>0)
		{	
			vr.addInputFocusMarker (
				inputfocushighlightx+(inputfocushighlightplayer==0?screenscrollx0:screenscrollx1)-screentilesize/2, 
				inputfocushighlighty+(inputfocushighlightplayer==0?screenscrolly0:screenscrolly1)-screentilesize/2, 
				screentilesize, screentilesize, 
				((((inputmodeswitchtime%20)*255)/20)<<24) | 0x00ffffff);			
		}

		// paint the automatic play arrow very big over the top of the screen
		if (playmode!=PLAYMODE_RECORD && game.getTopScreen()==this)
		{	float iconsize = screentilesize * 6.0f;
			int color = 0x887799ff;
			float x = (screenwidth-iconsize)/2; 
			float y = (screenheight-iconsize)/2; 
			if (playmode==PLAYMODE_UNDO)
			{	vr.addPlayArrow(x,y, iconsize,iconsize, -1, color);
			}
			else if (playmode==PLAYMODE_REPLAY || playmode==PLAYMODE_DEMO)
			{	if(playbackspeed>1)
				{	vr.addFastForwardArrow(x,y,iconsize,iconsize, 1, color);
				}
				else if (playbackspeed>0)
				{	vr.addForwardArrow(x,y,iconsize,iconsize, 1, color);
				}
				else if (playbackspeed<-1)
				{	vr.addFastForwardArrow(x,y,iconsize,iconsize, -1, color);
				}
				else if (playbackspeed<0)
				{	vr.addForwardArrow(x,y,iconsize,iconsize, -1, color);					
				}
				else
				{	vr.addSlowMotionArrow(x,y,iconsize,iconsize, 1,color);
				}				
			}
		}			 	

        // paint status display
		float x2 = screenwidth-hspace - statusbarheight - 2*hspace;
		float y2 = screenheight-hspace;
		float y1 = y2-statusbarheight;
		float x1 = x2 - hspace;
		float ycenter = (y1+y2)/2;
						
        // gem count-down
        x1 -= hspace;
        int needed = logic.getNumberOfEmeraldsStillNeeded();
        x1 = tr.addNumber(needed<0 ? 0:needed,  x1,ycenter-statustextheight/2,statustextheight, true,  logic.canStillGetEnoughEmeralds() ? 0xffffffff : 0xffff3333, TextRenderer.WEIGHT_BOLD);
        x1 -= hspace;
        lr.addSimplePieceToBuffer ((int)(x1-statustilesize),(int)(ycenter-statustilesize/2),Logic.EMERALD);  
		x1 = x1 - statustilesize - hspace;
        
		// add collected bombs and keys
		int keys = logic.getCollectedKeys(0);
		int bombs = logic.getCollectedTimeBombs(0);
		if (keys!=0)
		{	if ((keys&0x01) != 0)
			{	lr.addSimplePieceToBuffer ((int)(x1-statustilesize),(int)(ycenter-statustilesize/2),Logic.KEYRED);  
				x1-=statustilesize;
			}
			if ((keys&0x02) != 0)
			{	lr.addSimplePieceToBuffer ((int)(x1-statustilesize),(int)(ycenter-statustilesize/2),Logic.KEYGREEN);  
				x1-=statustilesize;
			}
			if ((keys&0x04) != 0)
			{	lr.addSimplePieceToBuffer ((int)(x1-statustilesize),(int)(ycenter-statustilesize/2),Logic.KEYBLUE);  
				x1-=statustilesize;
			}
			if ((keys&0x08) != 0)
			{	lr.addSimplePieceToBuffer ((int)(x1-statustilesize),(int)(ycenter-statustilesize/2),Logic.KEYYELLOW);  
				x1-=statustilesize;
			}
			x1 -= hspace;
		}
		if (bombs>0)
		{	x1 = tr.addNumber(bombs,  x1,ycenter-statustextheight/2,statustextheight, true,  0xffffffff, TextRenderer.WEIGHT_BOLD);	
			x1 -= hspace;
			lr.addSimplePieceToBuffer ((int)(x1-statustilesize),(int)(ycenter-statustilesize/2),Logic.TIMEBOMB);
			x1 = x1 - statustilesize - hspace;  
		}			
               
		// background area
//		vr.addRectangle (x1,y1,x2-x1,y2-y1, 0x77333333);
		x1 -= hspace;
		vr.addRoundedRect(x1, y1, x2-x1,y2-y1, statusbarheight/2, statusbarheight/2+1.0f, 0xdd000000);

		// memorize the position of the status bar  (is clickable to allow bomb-dropping)
		statusbarx1 = (int)x1;
		statusbary1 = (int)y1;

		// add left extension for status bar that holds the move counter (in seconds) and the player 2 status
		{
			x1 = hspace;
			x2 = x1 + hspace;
			float y = ycenter-statustextheight/2;
			
			int sec = (logic.getTurnsDone() * LevelRenderer.FRAMESPERSTEP - frames_left) / 600;  // fix rate: 600 logic-frames / second
			int min = sec/60;
			sec = sec%60;
			
			x2 += hspace;
			x2 = tr.addNumber(min, x2,y,statustextheight, false,  0xffffffff, TextRenderer.WEIGHT_PLAIN);
			x2 = tr.addString(sec<10?":0":":", x2,y,statustextheight, false,  0xffffffff, TextRenderer.WEIGHT_PLAIN);
			x2 = tr.addNumber(sec, x2,y,statustextheight, false,  0xffffffff, TextRenderer.WEIGHT_PLAIN);
			x2 += hspace;
			
			// add collected bombs
			 keys = logic.getCollectedKeys(1);
			bombs = logic.getCollectedTimeBombs(1);
			if (keys!=0)
			{	if ((keys&0x01) != 0)
				{	lr.addSimplePieceToBuffer ((int)(x2),(int)(ycenter-statustilesize/2),Logic.KEYRED);  
					x2+=statustilesize;
				}
				if ((keys&0x02) != 0)
				{	lr.addSimplePieceToBuffer ((int)(x2),(int)(ycenter-statustilesize/2),Logic.KEYGREEN);  
					x2+=statustilesize;
				}
				if ((keys&0x04) != 0)
				{	lr.addSimplePieceToBuffer ((int)(x2),(int)(ycenter-statustilesize/2),Logic.KEYBLUE);  
					x2+=statustilesize;
				}
				if ((keys&0x08) != 0)
				{	lr.addSimplePieceToBuffer ((int)(x2),(int)(ycenter-statustilesize/2),Logic.KEYYELLOW);  
					x2+=statustilesize;
				}
				x2 += hspace;
			}
			if (bombs>0)
			{	x2 += hspace;
				lr.addSimplePieceToBuffer ((int)(x2),(int)(ycenter-statustilesize/2),Logic.TIMEBOMB);
				x2 = x2 + statustilesize + hspace; 	
				x2 = tr.addNumber(bombs,  x2,ycenter-statustextheight/2,statustextheight, false,  0xffffffff, TextRenderer.WEIGHT_BOLD);	
				x2 += hspace;
			}			

			vr.addRoundedRect(x1, y1, x2-x1,y2-y1, statusbarheight/2, statusbarheight/2+1.0f, 0xdd000000);
		}
		

		// paint the menu button (but only if no menu is already present)
		if (game.getTopScreen()==this)
		{	menuButton.draw(game.vectorRenderer);
		}

		// flush everything to the screen in correct order
		vr.flush();						
        tr.flush();    // paint text on top of box         
		lr.flush();		// paint images on top of box

		// paint the touch motion raster(s)
		for (int i=0; i<inputGrid.length; i++)		
		{	inputGrid[i].draw(screenwidth, screenheight);
		}
	}

	public void reactivate()
	{
		super.reactivate();

		for (int i=0; i<gamePadMUX.length; i++)
		{	gamePadMUX[i].reset();
		}		
		keyboardTranslator.reset();
		for (int i=0; i<inputGrid.length; i++)
		{	inputGrid[i].reset();
		}			
		
		timeCalc.reset();	
	}
		

	private void adjustScrolling(boolean force)
	{
		// determine chosen size of the screen tiles
		screentilesize = (int)(60 * game.levelScale);
//		if (!pinchHandler.isPinchInProgress())
//		{	screentilesize = ((screentilesize+7) / 15) * 15;
//		}
		if (screentilesize<5) 
		{	screentilesize=5;
		}
		

    	inputfocushighlightx = -1;
    	inputfocushighlighty = -1;    	
		int populatedwidth = logic.getPopulatedWidth();
		int populatedheight = logic.getPopulatedHeight();					

		// first parse of the transaction data to extract the information about player movements
    	int playerx_at_end_0 = logic.getPlayerPositionX(0);
    	int playerx_at_begin_0 = playerx_at_end_0;
    	int playery_at_end_0 = logic.getPlayerPositionY(0);
    	int playery_at_begin_0 = playery_at_end_0;
    	int playerx_at_end_1 = logic.getPlayerPositionX(1);
    	int playerx_at_begin_1 = playerx_at_end_1;
    	int playery_at_end_1 = logic.getPlayerPositionY(1);
    	int playery_at_begin_1 = playery_at_end_1;

    	if (frames_left>0)
    	{
    		int num = logic.getAnimationBufferSize();
    		for (int idx=0; idx<num; idx++)
    		{
    			int trn = logic.getAnimation(idx);
    			if ((trn & Logic.TRN_MASK)==Logic.TRN_COUNTER)    			
    			{		int index = (trn>>16) & 0x0fff;
    					int increment = (int)(short)(trn & 0xffff);
    					switch (index) 
    					{	case Logic.CTR_MANPOSX1:
    							playerx_at_begin_0 -= increment;
    							break;
    						case Logic.CTR_MANPOSY1:
    							playery_at_begin_0 -= increment;
    							break;
    						case Logic.CTR_MANPOSX2:
    							playerx_at_begin_1 -= increment;
    							break;
    						case Logic.CTR_MANPOSY2:
    							playery_at_begin_1 -= increment;
    							break;
    					}    					
    			}			
    		}
    	}
    	
    	// compute current player positions
    	int playerposx0 = interpolatePixels(playerx_at_begin_0*screentilesize+screentilesize/2,
        			                        playerx_at_end_0*screentilesize+screentilesize/2, frames_left); 
       	int playerposy0 = interpolatePixels(playery_at_begin_0*screentilesize+screentilesize/2, 
        			                        playery_at_end_0*screentilesize+screentilesize/2, frames_left);
		int playerposx1 = interpolatePixels(playerx_at_begin_1*screentilesize+screentilesize/2, 
	        		                        playerx_at_end_1*screentilesize+screentilesize/2, frames_left); 
	    int playerposy1 = interpolatePixels(playery_at_begin_1*screentilesize+screentilesize/2, 
	        			                    playery_at_end_1*screentilesize+screentilesize/2, frames_left);	        			         			        			
// System.out.println("pos0: "+playerposx0+","+playerposy0);
	        
		// when input is switched to second player, move highlight there also 
		if (logic.getNumberOfPlayers()>1 && keyboardTranslator.hasSwitchedControls())
		{	inputfocushighlightx = playerposx1;
			inputfocushighlighty = playerposy1;
			inputfocushighlightplayer = 1;
		}  	
		// otherwise keep first player highlighted
		else 
		{	inputfocushighlightx = playerposx0;
			inputfocushighlighty = playerposy0;			
			inputfocushighlightplayer = 0;
		}
    		        
   		// when target was selected, use the arrow head as player position
		if (inputGrid[0].hasDestination())
		{ 
		 	playerposx0 = inputGrid[0].getDestinationX() * screentilesize + screentilesize/2;
        	playerposy0 = inputGrid[0].getDestinationY() * screentilesize + screentilesize/2;
       	}       	
		if (inputGrid[1].hasDestination())
		{ 
		 	playerposx1 = inputGrid[1].getDestinationX() * screentilesize + screentilesize/2;
   	    	playerposy1 = inputGrid[1].getDestinationY() * screentilesize + screentilesize/2;
  		}

       	// when only one player, computation is quite easy
       	if (logic.getNumberOfPlayers()<=1)
		{        	
	       	// when scrolling is not locked, compute the desired scroll position
    	   	if (force || !inputGrid[0].isTouchInProgress())       		
	        {  	// when scrolling is re-enabled, do fast scrolling to the target position
    	    	int step = force ? 1000000000 : (screentilesize/3);	 
        		screenscrollx0 = approach(screenscrollx0, calculateScreenOffsetX(screenwidth, screentilesize, playerposx0, populatedwidth, true), step);
        		screenscrolly0 = approach(screenscrolly0, calculateScreenOffsetY(screenheight, screentilesize, playerposy0, populatedheight, true), step);
			}		        		    	
			// use the values also for second set of values to only get a single screen
			screenscrollx1 = screenscrollx0;    		
			screenscrolly1 = screenscrolly0;    		
    	}
    	
		// for the two-player mode, the calculation is also done with locking the scolling when any drag is in progress
    	else
    	{	
    		// when the players are near together, compute an average position
			int splitthreasholdx = screenwidth/4;
	        int splitthreasholdy = screenheight/4;  
		    // in two-player mode, when the players are not too far separated, use a middle-position for both views
			if ( Math.abs(playerposx0 - playerposx1) < 2*splitthreasholdx)
			{	playerposx0 = playerposx1 = (playerposx0 + playerposx1)/2;	
			}
			// otherwise tear apart the views
			else if (playerposx0<playerposx1)
			{	playerposx0+=splitthreasholdx;
				playerposx1-=splitthreasholdx;			
			}
			else
			{	playerposx0-=splitthreasholdx;
				playerposx1+=splitthreasholdx;			
			}							
			if ( Math.abs(playerposy0 - playerposy1) < 2*splitthreasholdy)
			{	playerposy0 = playerposy1 = (playerposy0 + playerposy1)/2;	
			} 
			else if (playerposy0<playerposy1)
			{	playerposy0+=splitthreasholdy;
				playerposy1-=splitthreasholdy;			
			}
			else
			{	playerposy0-=splitthreasholdy;
				playerposy1+=splitthreasholdy;			
			}	       

	       	// when scrolling is not locked, compute the desired scroll position
    	   	if (force || (!inputGrid[0].isTouchInProgress() && !inputGrid[1].isTouchInProgress()))       		
	        {  	// when scrolling is re-enabled, do fast scrolling to the target position
    	    	int step = force ? 1000000000 : (screentilesize/3);	 
        		screenscrollx0 = approach(screenscrollx0, calculateScreenOffsetX(screenwidth, screentilesize, playerposx0, populatedwidth, true), step);
        		screenscrolly0 = approach(screenscrolly0, calculateScreenOffsetY(screenheight, screentilesize, playerposy0, populatedheight, true), step);
        		screenscrollx1 = approach(screenscrollx1, calculateScreenOffsetX(screenwidth, screentilesize, playerposx1, populatedwidth, true), step);
        		screenscrolly1 = approach(screenscrolly1, calculateScreenOffsetY(screenheight, screentilesize, playerposy1, populatedheight, true), step);
			}		        		    	
    	}
    	       	
        // after computation send current scrolling information to the touch input handler(s)
        inputGrid[0].synchronizeWithGame(screenscrollx0, screenscrolly0, screentilesize, playerx_at_end_0, playery_at_end_0);
		if (inputGrid.length>1)
		{   inputGrid[1].synchronizeWithGame(screenscrollx1, screenscrolly1, screentilesize, playerx_at_end_1, playery_at_end_1);
		}
//System.out.println("scroll: "+screenscrollx0+","+screenscrolly0+"  "+screenscrollx1+","+screenscrolly1);		
	}
	
	private int approach(int value, int target, int step)
	{	
		if (value<target)
		{	if (value+step<target)
			{	return value+step;
			}
		}
		else if (value>target)
		{	if (value-step>target)
			{	return value-step;
			}
		}
		return target;				
	}
	
	private int interpolatePixels(int pix1, int pix2, int frames_until_endposition)
	{
		int f2 = LevelRenderer.FRAMESPERSTEP - frames_until_endposition;
		return (pix1*frames_until_endposition + pix2*f2) / LevelRenderer.FRAMESPERSTEP;		
	}
	
	private int calculateScreenOffsetX(int displaywidth, int screentilewidth, int pixelx, int populatedwidth, boolean stopatedges)
	{
		int lw = screentilewidth*populatedwidth;  // size of the populated area in pixel
		// when level fits into display completely, just simply center it 
		if (displaywidth>lw)
		{	return (displaywidth - lw) / 2;			
		}
		// move screen to have player in center
		int ox = displaywidth/2 - pixelx;
		// but stop at edges in single-player mode
		if (stopatedges)
		{	if (ox>0) 
			{	ox=0;		
			}
			else if (ox+lw<displaywidth)
			{	ox = displaywidth-lw;
			}
		}
		return ox;
	}
	private int calculateScreenOffsetY(int displayheight, int screentileheight, int pixely, int populatedheight, boolean stopatedges)
	{
		int lh = screentileheight*populatedheight;
		// when level fits into display completely, just simply center it 
		if (displayheight>=lh)
		{	return (displayheight - lh) / 2;			
		}
		// move screen to have player in center
		int oy = displayheight/2 - pixely;
		// but stop at edges in single-player mode
		if (stopatedges)
		{	if (oy>0) 
			{	oy=0;		
			}
			else if (oy+lh<displayheight)
			{	oy = displayheight-lh;
			}
		}
		return oy;
	}
	



	private void gameRecording()
	{
       	frames_left--;
       	if (frames_left<0)
       	{       		
       		// prevent time progress in singlestep mode when no movement is present
       		if (singlestep && !(logic.isSolved() || logic.isKilled()))
       		{	boolean havemove = false;
       			for (int i=0; i<gamePadMUX.length; i++)
				{	havemove = havemove || inputGrid[i].hasNextMovement() || gamePadMUX[i].hasNextMovement();        	
				}       		
       			if (!havemove)
       			{	frames_left=0;
       				return;
       			}
       		}
       	
       		// normal game progress
       		step++;
       		while (walk.currentNumberOfCompleteTurns()<step)
       		{	int m0 = inputGrid[0].nextMovement();  
       			if (m0!=Walk.MOVE_REST)
       			{	gamePadMUX[0].reset();       				
       			}
       			else
       			{	m0 = gamePadMUX[0].nextMovement();
       				if (m0!=Walk.MOVE_REST)
       				{	inputGrid[0].reset();
       					inputmodeswitchtime = 0;
       				}
       			}
				int m1 = inputGrid[1].nextMovement();  
       			if (m1!=Walk.MOVE_REST)
       			{	gamePadMUX[1].reset();
       			}
       			else
       			{	m1 = gamePadMUX[1].nextMovement();
       				if (m1!=Walk.MOVE_REST)
       				{	inputGrid[1].reset();
       					inputmodeswitchtime = 0;
       				}
       			}       			
				walk.recordMovement(m0,m1);
			}
       		
       		logic.gototurn(step);
       		frames_left = LevelRenderer.FRAMESPERSTEP-1;
			if (game.soundPlayer.playStep(logic))
			{	screenshaketime = 3;
			}
       	}
	}
	
	private void gamePlayback()
	{
		if (playbackspeed==0)	// this means slow motion forward   
		{	slowmotion_counter++;
			if (slowmotion_counter<10)
			{	return;
			}
			slowmotion_counter=0;
			frames_left--;
		}
		else
		{	frames_left -= playbackspeed;      
		}
		
	    while (frames_left<0)	       	
	    {	if (step<=logic.getTurnsInWalk())
       		{	step++;
       			logic.gototurn(step);
       			frames_left += LevelRenderer.FRAMESPERSTEP;       		
				if (playbackspeed==1) 
				{	if (game.soundPlayer.playStep(logic))
					{	screenshaketime = 3;
					}
				}       		
       		}
       		else
       		{	frames_left = 0;
       			createMenuScreen(true);
       		}	     
       	}
	    while (frames_left>=LevelRenderer.FRAMESPERSTEP || (step==0 && frames_left>0))	       	
	    {	if (step>0)
       		{	step--;
       			logic.gototurn(step);
       			frames_left -= LevelRenderer.FRAMESPERSTEP;       		
       		}
       		else
       		{	frames_left = 0;
       			createMenuScreen(true);
       		}	     
       	}       	
	}
	
//	private void gamePlaybackSeek(int offset)
//	{
//		frames_left = 0;
//		if (offset<0)
//		{	step = Math.max(offset+step,0);
//			logic.gototurn(step);
//		}
//		else if (offset>0)
//		{	step = Math.min(offset+step, logic.getTurnsInWalk());
//			logic.gototurn(step);
//		}
//	}
	

	private void gameUndo()
	{
		if (step<=0)
		{	playmode=PLAYMODE_RECORD;	
			createMenuScreen(false);
		}
		else
		{  	frames_left++;
       		if (frames_left>LevelRenderer.FRAMESPERSTEP-1)
       		{	step--;
	       		logic.gototurn(step);
				walk.trimRecord(step);
       			frames_left = 0;
			    if ( step<=0)    	
			    {	playmode = PLAYMODE_RECORD;
					createMenuScreen(false);			    
			    }
			}
		}
	}

    private void startRecordingTimeMeasurement()
    {
		time_at_record_start = System.currentTimeMillis();   
    }
    private void stopRecordingTimeMeasurement()
    {	
    	if (time_at_record_start>0)
    	{ 	int seconds = (int) ((System.currentTimeMillis() - time_at_record_start) / 1000);
    		time_at_record_start = 0;
    		if (seconds>0)
    		{	int solvegrade = game.getLevelSolvedGrade(level);
    			if (solvegrade<0)
    			{	solvegrade += seconds;
    				if (solvegrade>0)
    				{	solvegrade=0;
    				}
    				game.setLevelSolvedGrade(level, solvegrade);
    			}
    		}
    	}    
    }
	public void flushRecordingTimeMeasurement()
	{
		if (time_at_record_start>0)
		{	stopRecordingTimeMeasurement();
			startRecordingTimeMeasurement();
		}	
	}
	
	
	public void createMenuScreen(boolean onlypopup)
	{
		// do not open menu twice
		if (game.getTopScreen() instanceof PauseMenu)
		{	return;
		}
		
		// remove arrow that could still be in the queue
		for (int i=0; i<inputGrid.length; i++)
		{	inputGrid[i].reset();
		}				
	
		stopRecordingTimeMeasurement();
		
		// create the menu screen
		PauseMenu m = new PauseMenu(game,this, level, PauseMenu.MENUACTION_EXIT);
		
		// this only a small user-triggered menu for commands during game progress
		if(onlypopup)
		{	
			if (playmode==PLAYMODE_RECORD || playmode==PLAYMODE_UNDO)
			{	//captions.add(new ListEntry("Game in progress", col, -1,-1,ListEntry.MEDIUM) );
				//captions.add(new ListEntry(null, col, -1,-1, ListEntry.SPACER));
				m.addPriorityAction(PauseMenu.MENUACTION_UNDO);
				m.addDefaultAction(PauseMenu.MENUACTION_CONTINUERECORDING);
				m.addPriorityAction(startFromEditor ? PauseMenu.MENUACTION_EXITTOEDITOR : PauseMenu.MENUACTION_EXIT);
				m.addAction(PauseMenu.MENUACTION_RESTART);				
				if (level.getDifficulty()>=5 || Game.DEVELOPERMODE)
				{	if (singlestep) 
					{	m.addAction(PauseMenu.MENUACTION_SINGLESTEP_OFF);
					}
					else 
					{	m.addAction(PauseMenu.MENUACTION_SINGLESTEP_ON);
					}
				}
				if (level.numberOfDemos()>0)
				{	int solvegrade = game.getLevelSolvedGrade(level);
					if (solvegrade>=0 || Game.DEVELOPERMODE) 
					{	m.addAction(PauseMenu.MENUACTION_SHOWDEMO);						
						if (level.numberOfDemos()>1)
						{	m.addAction(PauseMenu.MENUACTION_SHOWDEMO2);
						}
						if (level.numberOfDemos()>2)
						{	m.addAction(PauseMenu.MENUACTION_SHOWDEMO3);
						}								
					}
					else  
					{	m.addNonAction("Demo in "+buildTimeString(-solvegrade));
					}
				}				
			}
			else if (playmode==PLAYMODE_DEMO || playmode==PLAYMODE_REPLAY)
			{	if (step<logic.getTurnsInWalk())
				{	m.addPriorityAction(PauseMenu.MENUACTION_FASTFORWARD);
					m.addDefaultAction(PauseMenu.MENUACTION_FORWARD);
					if (step>0)
					{	m.addAction(PauseMenu.MENUACTION_BACKWARD);
						m.addAction(PauseMenu.MENUACTION_FASTBACKWARD);
					}
					m.addAction(PauseMenu.MENUACTION_SLOWMOTION);
				}
				else 
				{	m.addPriorityAction(PauseMenu.MENUACTION_FASTBACKWARD);
					m.addDefaultAction(PauseMenu.MENUACTION_BACKWARD);
				}
				m.addPriorityAction(playmode==PLAYMODE_DEMO ? PauseMenu.MENUACTION_LEAVEDEMO : PauseMenu.MENUACTION_LEAVEREPLAY);
				m.addAction(startFromEditor ? PauseMenu.MENUACTION_EXITTOEDITOR : PauseMenu.MENUACTION_EXIT);
				m.setMessage(playmode==PLAYMODE_DEMO ? "Viewing demo" : "Viewing replay");
			}
			m.addAction(game.getMusicActive() ? PauseMenu.MENUACTION_MUSIC_OFF_POPUP : PauseMenu.MENUACTION_MUSIC_ON_POPUP); 					
		}
		// this menu will be used before start of game or after the end (non-user triggered)
		else
		{	
			if (playmode!=PLAYMODE_RECORD)
			{	System.out.println("Must not open 'big' in-game menu outside record mode");
				return;
			}
					
			if (logic.isKilled())
			{	m.addPriorityAction(PauseMenu.MENUACTION_RESTART);
				m.addDefaultAction(PauseMenu.MENUACTION_UNDO);				
				m.addPriorityAction(startFromEditor ? PauseMenu.MENUACTION_EXITTOEDITOR : PauseMenu.MENUACTION_EXIT);				
				if (game.getLevelSolvedGrade(level)>=0 || Game.DEVELOPERMODE)
				{	if (level.numberOfDemos()>0)
					{	m.addAction(PauseMenu.MENUACTION_SHOWDEMO);
					}
					if (level.numberOfDemos()>1)
					{	m.addAction(PauseMenu.MENUACTION_SHOWDEMO2);
					}
					if (level.numberOfDemos()>2)
					{	m.addAction(PauseMenu.MENUACTION_SHOWDEMO3);
					}
				}
				m.setMessage("Player was killed.");
			}
			else if (logic.isSolved()) 
			{	if (canFindNextLevel)
				{	m.addDefaultAction(PauseMenu.MENUACTION_NEXTLEVEL);
				}
				m.addPriorityAction(startFromEditor ? PauseMenu.MENUACTION_EXITTOEDITOR : PauseMenu.MENUACTION_EXIT);
				m.addAction(PauseMenu.MENUACTION_RESTART);
				m.addAction(PauseMenu.MENUACTION_REPLAY);
//				m.addAction(PauseMenu.MENUACTION_SHOWDEMO);
				if (startFromEditor)
				{	m.addAction(PauseMenu.MENUACTION_STOREWALK);
				}

				// check if the solution was done without assistances
				if (diduse_singlestep)
				{	m.setMessage("Solved using single steps.");
					game.setLevelSolvedGrade(level,1);
				}
				else if (diduse_undo)
				{	m.setMessage("Solved using undo.");
					game.setLevelSolvedGrade(level,1);
				}
				else {
					int time = logic.totalTimeForSolution();
					m.setMessage("Directly solved in "+getTurnTimeString(time)+"!");
					game.setLevelSolvedGrade(level,2);
				}
			}
			else if (step==0)
			{	m.addDefaultAction(PauseMenu.MENUACTION_START);
				m.addPriorityAction(startFromEditor ? PauseMenu.MENUACTION_EXITTOEDITOR : PauseMenu.MENUACTION_EXIT);				
				if (game.getLevelSolvedGrade(level)>=0 || Game.DEVELOPERMODE)
				{	if (level.numberOfDemos()>0)
					{	m.addAction(PauseMenu.MENUACTION_SHOWDEMO);
					}
					if (level.numberOfDemos()>1)
					{	m.addAction(PauseMenu.MENUACTION_SHOWDEMO2);
					}
					if (level.numberOfDemos()>2)
					{	m.addAction(PauseMenu.MENUACTION_SHOWDEMO3);
					}
				}
				if (canModify & !startFromEditor)
				{
					m.addAction(PauseMenu.MENUACTION_EDITLEVEL);								
				}
			}		
			else		// this should never be used...
			{	System.out.println("invalid state at menu creation!");
			}
			m.addAction(game.getMusicActive() ? PauseMenu.MENUACTION_MUSIC_OFF : PauseMenu.MENUACTION_MUSIC_ON); 					
		}

		game.addScreen(m);
	}

	private String getTurnTimeString(int turns)
	{
		int hsec = (turns * LevelRenderer.FRAMESPERSTEP) / 6;   // fix rate: 600 logic-frames / second
		int sec = hsec/100;
		int min = sec/60;
		hsec = hsec%100;   
		sec = sec%60;
		return min+(sec<10?":0":":")+sec+(hsec<10?":0":":")+hsec;
	}


	// -------------------- actions from the ingame-menu ---------------
	public void menuAction(int id)
	{	
		switch (id)
		{	case PauseMenu.MENUACTION_EXIT:
			case PauseMenu.MENUACTION_EXITTOEDITOR:
				game.removeScreen();
				break;

			case PauseMenu.MENUACTION_START:	
			case PauseMenu.MENUACTION_RESTART:
				diduse_undo = false;
				diduse_singlestep = singlestep;

				step=0;
        		frames_left=0;
        		playmode = PLAYMODE_RECORD;
       			walk.initialize((int)(Math.random()*1000000));
       			logic.attach(level,walk);
				adjustScrolling(true);
				startRecordingTimeMeasurement();
				break;
				
			case PauseMenu.MENUACTION_CONTINUERECORDING:
				playmode = PLAYMODE_RECORD;			
				startRecordingTimeMeasurement();
				break;

//			case PauseMenu.MENUACTION_CALLASSISTANT:
//				playmode = PLAYMODE_RECORD;
//				startRecordingTimeMeasurement();
//				walk.recordMovement(Walk.CALL_ASSISTANT);    		
//				break;
				
			case PauseMenu.MENUACTION_LEAVEDEMO:
				logic.attach(level,walk);
				logic.gototurn(walk.getTurns());
				step=walk.getTurns();
        		frames_left=0;
				playmode=PLAYMODE_RECORD;
				adjustScrolling(true);
				startRecordingTimeMeasurement();
				break;
			
			case PauseMenu.MENUACTION_LEAVEREPLAY:
				logic.attach(level,walk);
				logic.gototurn(walk.getTurns());
				step=walk.getTurns();
        		frames_left=0;
				playmode=PLAYMODE_RECORD;
				adjustScrolling(true);
				createMenuScreen(false);
				startRecordingTimeMeasurement();
				break;						

			case PauseMenu.MENUACTION_REPLAY:
				step=0;
	        	frames_left=0;
	        	playmode = PLAYMODE_REPLAY;
	        	playbackspeed = 1;
	        	slowmotion_counter = 0;
	        	logic.gototurn(step);				
				break;
				
			case PauseMenu.MENUACTION_SHOWDEMO:
			case PauseMenu.MENUACTION_SHOWDEMO2:
			case PauseMenu.MENUACTION_SHOWDEMO3:
				{	int idx = id==(PauseMenu.MENUACTION_SHOWDEMO) ? 0 : (1 + (id-PauseMenu.MENUACTION_SHOWDEMO2));
					if (level.numberOfDemos()>idx)
					{	logic.attach(level,level.getDemo(idx));
						step=0;
		        		frames_left=0;
		        		playmode = PLAYMODE_DEMO;
		        		playbackspeed = 1;
			        	slowmotion_counter = 0;
						adjustScrolling(true);
					}
				}
				break;
				
			case PauseMenu.MENUACTION_NEXTLEVEL:
			{	game.removeScreen();
				Screen top = game.getTopScreen();
				if (top!=null && top instanceof MainMenuScreen)
				{	((MainMenuScreen)top).startSubsequentLevel(level);
				}
				break;
			}
			case PauseMenu.MENUACTION_STOREWALK:
				level.setDemo(walk);
				game.removeScreen();
				break;
			case PauseMenu.MENUACTION_EDITLEVEL:
				game.removeScreen();
				Screen top = game.getTopScreen();
				if (top!=null && top instanceof MainMenuScreen)
				{	((MainMenuScreen)top).startEditingSelectedLevel();
				}				
				break;				
			
			case PauseMenu.MENUACTION_UNDO:
				playmode = PLAYMODE_UNDO;
				diduse_undo = true;
				break;
							
			case PauseMenu.MENUACTION_SINGLESTEP_ON:
				singlestep = true;
				diduse_singlestep = true;
				createMenuScreen(true);
				break;		
				
			case PauseMenu.MENUACTION_SINGLESTEP_OFF:
				singlestep = false;
				createMenuScreen(true);
				break;		
				
			case PauseMenu.MENUACTION_FORWARD:
				playbackspeed = 1;
				break;
			case PauseMenu.MENUACTION_BACKWARD:
				playbackspeed = -1;
				break;				
			case PauseMenu.MENUACTION_FASTFORWARD:
				playbackspeed = 16;
				break;				
			case PauseMenu.MENUACTION_FASTBACKWARD:
				playbackspeed = -16;
				break;				
			case PauseMenu.MENUACTION_SLOWMOTION:
				playbackspeed = 0;		// value 0 has special meaning	
				break;
				
			case PauseMenu.MENUACTION_MUSIC_OFF:
				game.setMusicActive(false);
				game.stopMusic();
				createMenuScreen(false);
				break;			
			case PauseMenu.MENUACTION_MUSIC_OFF_POPUP:
				game.setMusicActive(false);
				game.stopMusic();
				break;		 
			case PauseMenu.MENUACTION_MUSIC_ON:
				game.setMusicActive(true);
				game.startCategoryMusic(level.getCategory());
				createMenuScreen(false);
				break;
			case PauseMenu.MENUACTION_MUSIC_ON_POPUP:
				game.setMusicActive(true);
				game.startCategoryMusic(level.getCategory());
				break;		 			
		}
	}
	
    @Override
    public void handleBackNavigation()
    {
    	// when in the game screen, back navigation just calls up the ingame menu
    	createMenuScreen(true);    
    }	

	@Override
    public void handleKeyEvent(KeyEvent event)
    {        
    	int action = event.getAction();
    	int code = event.getKeyCode();
    	
		// in record mode use up- and down-events     	    	
    	if (playmode==PLAYMODE_RECORD)
    	{	if (action==KeyEvent.ACTION_DOWN)
	    	{	if ((code==KeyEvent.KEYCODE_ENTER || code==KeyEvent.KEYCODE_TAB) && logic.getNumberOfPlayers()>1)	
	    		{	//if (twousermode)
	    			//{	twousermode = false;
	    			//}
	    			//else
	    			//{
	    				keyboardTranslator.switchControls(!keyboardTranslator.hasSwitchedControls());
	    			//}
	    			inputmodeswitchtime = 60;
					adjustScrolling(true);	    		
	    		}
	    		else
	    		{	//if (keyboardTranslator.isKeyForSecondaryInput(code) && logic.getNumberOfPlayers()>1) 
	    			//{	// twousermode = true;
	    			//	if (keyboardTranslator.hasSwitchedControls())
	    			//	{	keyboardTranslator.switchControls(false);
					//		adjustScrolling(true);
	    			//	}	    		
	    			//}
	    			keyboardTranslator.keyDown(code);
	    		}  
			}
	    	else if (action==KeyEvent.ACTION_UP)
	    	{	keyboardTranslator.keyUp(code);
			}
    	}
    	// outside record mode, any down-event calls up the menu
    	else if (action==KeyEvent.ACTION_DOWN)    	
    	{	createMenuScreen(true);    	
    	}
    }
    
    @Override
	public void onPointerDown(int x, int y)
	{	
	
		if (menuButton.onPointerDown(x,y))
		{	return;
		}

		if (playmode==PLAYMODE_RECORD)
		{	
			for (int i=0; i<inputGrid.length; i++)
			{	if (inputGrid[i].onPointerDown(x,y, true))
				{	return;
				}
			}
			for (int i=0; i<inputGrid.length; i++)
			{	if (inputGrid[i].onPointerDown(x,y, false))
				{	return;
				}
			}			
		}
				
		super.onPointerDown(x,y);
	}
	
    @Override
	public void onPointerUp()
	{
		 menuButton.onPointerUp();		

		// in record mode, all pointer up events call up the menu
    	if (playmode!=PLAYMODE_RECORD)
    	{	createMenuScreen(true);
    		return;
    	}    	

		if (playmode==PLAYMODE_RECORD)
		{	for (int i=0; i<inputGrid.length; i++)
			{	inputGrid[i].onPointerUp();
			}				
		}
		
		super.onPointerUp();
	}
	
    @Override
	public void onPointerMove(int x, int y)
	{
		menuButton.onPointerMove(x,y);		

		if (playmode==PLAYMODE_RECORD)
		{	for (int i=0; i<inputGrid.length; i++)
			{	inputGrid[i].onPointerMove(x,y);
			}				
		}
				
		super.onPointerMove(x,y);
	}
	
	// methods to extract data to make it persistent
	public String getCurrentLevelTitle()
	{
		return level.getTitle();  
	}
	public String getCurrentWalkSerialized()
	{
		return walk.toJSON(); 
	}
    
}
