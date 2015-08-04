package grafl.sy.screens;

import android.view.KeyEvent;
import grafl.sy.game.Game;
import grafl.sy.logic.Level;
import grafl.sy.renderer.TextRenderer;
import grafl.sy.renderer.VectorRenderer;

public class PauseMenu extends Screen
{
	public final static int MENUACTION_NONEACTION = 0;
	public final static int MENUACTION_START = 1;
	public final static int MENUACTION_RESTART = 2;
	public final static int MENUACTION_REPLAY = 3;
	public final static int MENUACTION_SHOWDEMO = 4;
	public final static int MENUACTION_NEXTLEVEL = 5;
	public final static int MENUACTION_STOREWALK = 6;
	public final static int MENUACTION_UNDO = 7;
	public final static int MENUACTION_EXIT = 8;
	public final static int MENUACTION_LEAVEDEMO = 9;
	public final static int MENUACTION_CONTINUERECORDING = 10;
	public final static int MENUACTION_LEAVEREPLAY = 11;
	public final static int MENUACTION_SINGLESTEP_ON = 12;
	public final static int MENUACTION_SINGLESTEP_OFF = 13;
	public final static int MENUACTION_FORWARD = 14;
	public final static int MENUACTION_BACKWARD = 15;
	public final static int MENUACTION_FASTFORWARD = 16;
	public final static int MENUACTION_FASTBACKWARD = 17;
	public final static int MENUACTION_SLOWMOTION = 18;
	public final static int MENUACTION_SHOWDEMO2 = 19;
	public final static int MENUACTION_SHOWDEMO3 = 20;
	public final static int MENUACTION_TESTLEVEL = 21;
	public final static int MENUACTION_DISCARDCHANGES = 22;
	public final static int MENUACTION_EXITEDITOR = 23;
	public final static int MENUACTION_EXITTOEDITOR = 24;
	public final static int MENUACTION_EDITLEVEL = 25;
	public final static int MENUACTION_CONTINUEEDIT = 26;
	public final static int MENUACTION_EDITSETTINGS = 27;
	public final static int MENUACTION_EDITNAME = 28;
	public final static int MENUACTION_EDITAUTHOR = 29;
	public final static int MENUACTION_EDITINFO = 30;
	public final static int MENUACTION_MUSIC_ON = 31;
	public final static int MENUACTION_MUSIC_OFF = 32;
	public final static int MENUACTION_MUSIC_ON_POPUP = 33;
	public final static int MENUACTION_MUSIC_OFF_POPUP = 34;
	

	final static String[] actionlabels =  {	
		"", "Start", "Restart", "Replay solution", "Show demo", "Next",
		"Use as demo", "Undo", "Exit", "To Game", "Continue", "To Game", 
		"Single step: OFF", "Single step: ON", 
		"Forward", "Backward", "Fast", "Fast Backward", "Slow Motion",
		"Show demo 2", "Show demo 3", "Test", "Discard", "Exit", "To Editor",
		"Level Editor", "Edit", "Level Settings", "Name", "Author", "Info", 
		"Music: OFF", "Music: ON", "Music: OFF", "Music: ON"
	};
	

	MenuListener listener;
	Level level;
	int navigateBackAction;	

    int numactions;
	int numpriorityactions;
    int[] actions;
    int defaultaction;
	String message;
    String none_action_label;
    
    int selected;

	// data for layout (computed before first rendering)
	String[] info;
	float menux;
	float menuy;
	float menuwidth;
	float menuheight;
	
	float iconwidth;
	float iconheight;
	float action0x;
	float action0y;
	float actiondx;
	float lowactionwidth;
	float lowactionheight;
	float lowaction0x;
	float lowaction0y;
	float lowactiondy;

	// static layout info

	public PauseMenu(Game game, MenuListener listener, Level level, int navigateBackAction)
	{
		super(game);
		this.listener = listener;
		this.level = level;
		this.navigateBackAction = navigateBackAction;
		
		actions = new int[20];
		numactions = 0;
		numpriorityactions = 0;
		defaultaction = 0;
		message = null;
		selected = -1;		
	}

	@Override
	public void resize(int width, int height)
	{
		super.resize(width,height);
		layout();
		
		if (selected<0 && game.usingKeyboardInput)
		{	selected = defaultaction;
		}		
	}

	public void reactivate()
	{
		layout();
	}


	@Override
	public boolean isOverlay()
	{	return true;
	}
	
	public void addDefaultAction(int action)
	{
		addPriorityAction(action);
		defaultaction = numpriorityactions-1;
	}
	
	public void addPriorityAction(int action)
	{
		System.arraycopy (actions,numpriorityactions,actions,numpriorityactions+1,numactions-numpriorityactions);				
		actions[numpriorityactions] = action;
		numpriorityactions++;
		numactions++;
	}

	public void addAction(int action)
	{
		actions[numactions] = action;
		numactions++;
	}
	
	public void addNonAction(String label)
	{
		actions[numactions] = MENUACTION_NONEACTION;
		numactions++;
		none_action_label = label;
	}		
	
	public void setMessage(String message)
	{
		this.message = message;
	}

		 	
	public void draw()
	{
		drawOrLayout(true);
	}
	public void layout()
	{
		drawOrLayout(false);
	}
	
	private void drawOrLayout(boolean draw)
	{
		float scaling = game.detailScale;		
		float th = 27*scaling;

		VectorRenderer vr = game.vectorRenderer;				
		TextRenderer tr = game.textRenderer;				

		// layout depends on menu width which depends on the screen size				
		menuwidth = Math.min(400, screenwidth);					
		menux = (screenwidth-menuwidth)/2;
		int bgcolor = 0xcc000000; // darken(Game.getColorForDifficulty(level.getDifficulty()));
				
		// at first call or after size change, create word wrapped string
		if (!draw)		
		{	if (message!=null)
			{	info = tr.wordWrap(message, th, menuwidth-60*scaling);
			}
			else 
			{	info = (level.getHint()==null) ? new String[0] : tr.wordWrap(level.getHint(), th, menuwidth-60*scaling);
			}			
		}
		// when in drawing mode, initialize renderers and create background
		else
		{	vr.startDrawing (screenwidth, screenheight);
			tr.startDrawing (screenwidth, screenheight);		
//			vr.addRoundedRect(menux,menuy,menuwidth,menuheight, 20*scaling, 20*scaling+1, bgcolor);			
			vr.addRectangle(menux,0,menuwidth,screenheight, bgcolor);			
		}
	
		// add category/difficulty icon
		if (draw)
		{	float centerx = menux + menuwidth - 65*scaling;
			float centery = menuy + 65*scaling;
			float is = 90*scaling;
			int d = level.getDifficulty();
			int c = level.getCategory();
			drawCategoryIcon(vr, centerx-is/2, centery-is/2, is,is, c, Game.getColorForDifficulty(d));
			
			int col = contrastcolor(Game.getColorForDifficulty(d));			
			String s = Game.getNameForDifficulty(d);
			float sw = tr.determineStringWidth(s, th);
			tr.addString (s, centerx-sw/2,centery-th, th, false, col, TextRenderer.WEIGHT_PLAIN);
			s = Game.getNameForCategory(c);
			sw = tr.determineStringWidth(s, th);
			tr.addString (s, centerx-sw/2,centery, th, false, col, TextRenderer.WEIGHT_PLAIN);			
		}

		float y = menuy + 40*scaling;  // inner border
		float x = menux + 30*scaling;  // inner border		
		
		// level title
		String t = level.getTitle();
		if (t!=null)
		{	if (draw)
			{	tr.addString(t, x,y, th, false, 0xffffffff, TextRenderer.WEIGHT_BOLD);
			}
			y += th;		
		}
		// author
		t = level.getAuthor();
		if (t!=null && t.length()>0)
		{	if (draw)
			{	float x2 = tr.addString("by ", x,y, th, false, 0xffaaaaaa, TextRenderer.WEIGHT_PLAIN);
				tr.addString(t, x2,y, th, false, 0xffaaaaaa, TextRenderer.WEIGHT_PLAIN);
			}
			y += th;		
		}
		// info 		
		y = menuy + 40*scaling + 3*th;
		if (info.length>0)
		{	for (int i=0; i<info.length; i++)
			{	if (draw)
				{	if (message!=null)	// info comes from an important message: display it centered
					{	tr.addString(info[i], menux+menuwidth/2-tr.determineStringWidth(info[i],th)/2,y, th, false, 0xffffffff, TextRenderer.WEIGHT_PLAIN);
					}
					else	
					{	tr.addString(info[i], x,y, th, false, 0xffffffff, TextRenderer.WEIGHT_PLAIN);
					}
				}		
				y += 30*scaling;				
			}
			y+=th;
		}

		int hicol = Game.getColorForDifficulty(level.getDifficulty());
		int locol = 0xff393939;			
		float cornerradius = 4.0f;
		// the action icons
		// memorize this layout info for touch input handling
		iconwidth = 90*scaling;
		iconheight = 100*scaling;
		actiondx = iconwidth+4*scaling;	
		action0x = (menuwidth - ((numpriorityactions-1)*actiondx+iconwidth) )/ 2;
		action0y = y-menuy;
		// really draw
		if (draw)
		{	for (int i=0; i<numpriorityactions; i++)
			{	int action = actions[i];
				String s = actionlabels[action];
				int fc = hicol;
				int bc = locol;
				if (selected==i)
				{
					fc = locol;
					bc = hicol;
				}
				vr.addRoundedRect(menux+action0x+actiondx*i, menuy+action0y, iconwidth,iconheight, cornerradius, cornerradius+1, bc);	
				drawActionIcon (vr, action, menux+action0x+actiondx*i+iconwidth/6, menuy+action0y+iconwidth/12,  2*iconwidth/3,2*iconwidth/3, fc);
				tr.addString (s,  menux+action0x+actiondx*i+(iconwidth-tr.determineStringWidth(s,th))/2, menuy+action0y+iconheight-th-th/4, th, false, fc, TextRenderer.WEIGHT_PLAIN);
			}
		}		
		y+= iconheight + 30*scaling;
		
		// non-priority actions (in bottom part of menu)
		lowactionwidth = iconwidth + actiondx*2;
		lowactionheight = Math.max(game.minButtonSize, th*1.5f);
		lowaction0x = menuwidth/2 - lowactionwidth/2;
		lowaction0y = y-menuy;
		lowactiondy = lowactionheight+4.0f*scaling;
		
		for (int i=numpriorityactions; i<numactions; i++)
		{	int action = actions[i];
			if (draw)
			{	// vr.addRectangle(menux,y-1,menuwidth,1, 0x66000000);
				int fc = hicol;
				int bc = locol;
				if (selected==i)
				{
					fc = locol;
					bc = hicol;
				}
				vr.addRoundedRect(menux+lowaction0x, y, lowactionwidth, lowactionheight, cornerradius, cornerradius+1, bc); 				
				String s = (action!=MENUACTION_NONEACTION) ? actionlabels[action] : none_action_label;
				tr.addString(s, menux+(menuwidth-tr.determineStringWidth(s,th))/2,y+lowactiondy/2-th/2, th, false, 
					i==selected ? bgcolor : fc, TextRenderer.WEIGHT_PLAIN);
			}
			y+= lowactiondy;
		}
		
//		y+= 20*scaling; // inner border

		// memorize menu size
		menuheight = y - menuy;
		menuy = (screenheight - menuheight)/2;
		
		if (draw)
		{	vr.flush();
			tr.flush();
		}
	}
	
	
	private void drawActionIcon(VectorRenderer vr, int action, float x, float y, float width, float height, int argb)
	{
		switch (action)
		{	case MENUACTION_START:
			case MENUACTION_CONTINUERECORDING:
			 	vr.addPlayArrow(x,y,width,height, 1, argb);
			 	break;
			case MENUACTION_UNDO:
				vr.addPlayArrow(x,y,width,height, -1, argb);
				break;
			case MENUACTION_FORWARD:
				vr.addForwardArrow(x,y,width,height, 1, argb);
				break;
			case MENUACTION_BACKWARD:
				vr.addForwardArrow(x,y,width,height, -1, argb);
				break;			
			
			case MENUACTION_FASTFORWARD:
				vr.addFastForwardArrow(x,y,width,height, 1,argb);
				break;

			case MENUACTION_FASTBACKWARD:
				vr.addFastForwardArrow(x,y,width,height, -1,argb);
				break;

			case MENUACTION_EXIT:
			case MENUACTION_EXITTOEDITOR:
			case MENUACTION_EXITEDITOR:
				vr.addCross(x,y,width,height, argb);
				break;				

			case MENUACTION_LEAVEDEMO:
			case MENUACTION_LEAVEREPLAY:
				vr.addSquare(x,y,width,height,argb);
				break;

			case MENUACTION_NEXTLEVEL:
				vr.addNextLevelArrow(x,y,width,height,argb);
				break;

			case MENUACTION_TESTLEVEL:
			 	vr.addPlayArrow(x,y,width,height, 1, argb);
			 	break;				
			 	
			case MENUACTION_DISCARDCHANGES:
				vr.addFastForwardArrow(x,y,width,height, -1,argb);
			 	break;
			 					
			case MENUACTION_CONTINUEEDIT:
				vr.addSquare(x,y,width,height, argb);
			 	break;				

			default:
			{	vr.startStrip();		
				vr.addStripCorner(x+width/4,y+height/4,  argb);
				vr.addStripCorner(x+width/4,y+(height*3)/4, argb);
				vr.addStripCorner(x+(width*3)/4, y+height/2, argb);
				break;
			}
		}	
	}
	
	private void drawCategoryIcon(VectorRenderer vr, float x, float y, float width, float height, int category, int argb)
	{
		vr.addRoundedRect(x,y,width,height, width/2,width/2+1, argb);		
	}
	
	private int findAction(float x, float y)
	{
		for (int i=0; i<numpriorityactions; i++)
		{	float ax = menux + action0x + i*actiondx;
			float ay = menuy + action0y;
			if (x>=ax && x<ax+iconwidth && y>=ay && y<ay+iconheight)
			{	return i;
			} 
		}	
		for (int i=numpriorityactions; i<numactions; i++)
		{	float ax = menux + lowaction0x;
			float ay = menuy + lowaction0y + (i-numpriorityactions) * lowactiondy;
			if (x>=ax && x<ax+lowactionwidth && y>=ay && y<ay+lowactionheight)
			{	return i;
			} 
		}	
		return -1;
	}
		
	private static int contrastcolor(int argb)
	{
		int r = (argb>>16)&0xff;
		int g = (argb>>8)&0xff;
		int b = (argb>>0)&0xff;
		if ((r+g+b)/3 < 0)
		{	return 0xffffffff;
		}
		else
		{	return 0xff000000;
		}	
	} 
	
	// ------ key handler ------
	@Override
	public void handleBackNavigation()
	{
		if (navigateBackAction>=0)
		{	game.removeScreen();
			listener.menuAction(navigateBackAction);			
		}
	}
		
	@Override
    public void handleKeyEvent(KeyEvent event)
    {	
    	if (event.getAction()==KeyEvent.ACTION_DOWN)
    	{	switch (event.getKeyCode())
    		{	case KeyEvent.KEYCODE_DPAD_UP:
    				if (selected<0)
    				{	selected=defaultaction;
    				}
    				else if (selected>numpriorityactions) 
    				{	selected--;
    				}
    				else if (selected==numpriorityactions)
    				{	selected=defaultaction;
    				}
					break;    				
    			case KeyEvent.KEYCODE_DPAD_DOWN:
    				if (selected<0)
    				{	selected=defaultaction;
    				}
    				else if (selected<numpriorityactions && numactions>numpriorityactions)
    				{	selected = numpriorityactions;
    				}
    				else if (selected+1<numactions) 
    				{	selected++;
    				}
					break;
    			case KeyEvent.KEYCODE_DPAD_LEFT:
    				if (selected<0)
    				{	selected=defaultaction;
    				}
    				else if (selected<numpriorityactions && selected>0)
    				{	selected--;
    				}
					break;
    			case KeyEvent.KEYCODE_DPAD_RIGHT:
    				if (selected<0)
    				{	selected=defaultaction;
    				}
    				else if (selected+1<numpriorityactions)
    				{	selected++;
    				}
					break;
    			case KeyEvent.KEYCODE_ENTER:
    				if (selected<0)
    				{	selected=defaultaction;
    				}
    				else if (actions[selected]!=MENUACTION_NONEACTION)
	    			{	game.removeScreen();
	    				listener.menuAction(actions[selected]);	    				
	    				return;
	    			}
	    			break;
    		}    		
    	}
    	
    	super.handleKeyEvent(event);
    }
	
    // ---- touch event handlers called in GL thread ----
	@Override
	public void onPointerDown(int x, int y)
	{
		selected = findAction(x,y);
	}
	
	@Override
	public void onPointerUp()
	{
		if (selected>=0 && actions[selected]!=MENUACTION_NONEACTION)
		{	game.removeScreen();
			listener.menuAction(actions[selected]);
		}
	}
	
	@Override
	public void onPointerMove(int x, int y)
	{
		int s = findAction(x,y);
		if (selected!=s)
		{	selected=-1;
		}
    }
	
	
	

}
