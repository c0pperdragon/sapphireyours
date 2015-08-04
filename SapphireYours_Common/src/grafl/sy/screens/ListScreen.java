package grafl.sy.screens;

import grafl.sy.buttons.BackButton;
import grafl.sy.buttons.Button;
import grafl.sy.game.Game;
import grafl.sy.renderer.TextRenderer;
import android.view.KeyEvent;

public class ListScreen extends Screen
{
	final static int EDGEGLOWTIME = 20;
	final static float DECELERATION = 0.5f;

	Button closeButton;
	boolean canCloseWithSpacebar; 

	ListEntry[] captions;
	ListEntry[] entries;
	
	int selected;
	int listscrolly;
	int listscrollyprevious;	// maintained by the tick action
	float freescrollspeed;      // maintained by the tick action
	
	int topedgeglowtime;
	int bottomedgeglowtime;	

	int listx;
	int listy;
	int listwidth;
	int listheight;
//	int captionheight;
//	int bodyheight;
	int contentheight;
	int tilesize;
	int buttonsize;
	
	int outerborder;	
	int innerborder;
	int textpadding; 
	
	int timeofpointerisactive;
	int activepointery;
	boolean activepointerwasmoved;
	

//	final static int[] shape_closebutton = { 
//		-100,-100, -95,-95, 100,-100, 95,-95, 100,100, 95,95, -100,100, -95,95, -100,-100, -95,-95,-95,-95,
//	    -75,-55,-75,-55, -55,-75, -20,0, 0,-20, 0,20, 20,0, 55,75, 75,55,75,55,
//	    -75,55,-75,55,  -55,75, -20,0, 20,0,20,0,
//	    55,-75,55,-75,  75,-55, 0,-20, 20,0                                  
//	};
	
	public ListScreen(Game game, ListEntry[] captions, ListEntry[] listentries)
	{
		super(game);
		this.captions = captions;
		this.entries = listentries;
		timeofpointerisactive = 0;
		
		selected = game.usingKeyboardInput ? 0:-1;
	}
	
	public void setCloseWithSpaceBar()
	{
		canCloseWithSpacebar = true;
	}
	
	public void updateEntries(ListEntry[] listentries)
	{
		this.entries = listentries;
		resize(screenwidth,screenheight);	// re-calculate layout
	}

	@Override
	public void resize(int screenwidth, int screenheight)
	{
		super.resize (screenwidth,screenheight);
		
		// when screen size changes (even the first time), must invalidate the touch selection
		// and (re-)calculate the layout 
		calculateLayout();			
		delimitScrollPosition();
		if (selected>=0)
		{	bringSelectedInView();
		}
		
		closeButton = new BackButton(game, listx+listwidth-buttonsize-buttonsize/10, listy+buttonsize/10,
								     buttonsize,buttonsize, 
									  new Runnable(){ public void run(){ 	handleBackNavigation(); }} );
	}

	@Override
	public void draw()
	{		
//		// determine which entry should be temporarily highlighed
//		ListEntry highlighted = null;
//		int highlightdelay = contentheight>bodyheight ? 3 : 1;
//		if (timeofpointerisactive>highlightdelay && !activepointerwasmoved)		// to be tuned...
//		{	highlighted = findEntry((int) (activepointery - (listy+captionheight-listscrolly)) );
//		}

		// first part:  static part of the screen
		// initialize renderers
		game.textRenderer.startDrawing (screenwidth, screenheight);
		game.vectorRenderer.startDrawing (screenwidth, screenheight);
		game.levelRenderer.startDrawing (screenwidth, screenheight, tilesize);
		
		// add decoration
//		game.vectorRenderer.addRectangle(0,0,screenwidth,screenheight, 0xcc000000);
		game.vectorRenderer.addRectangle(listx,listy,listwidth,listheight, 0xcc000000);
		game.vectorRenderer.addFrame(listx-outerborder, listy-outerborder, 
		      listwidth+2*outerborder, listheight+2*outerborder, outerborder, 0xffffffff);
//		game.vectorRenderer.addRectangle(listx,listy+captionheight-innerborder, listwidth,innerborder, 0xffffffff);
		
		if (topedgeglowtime>0)
		{	int thick = topedgeglowtime/5;
			game.vectorRenderer.addRectangle(listx,listy,listwidth,thick, 0xccffffff);		
		}
		if (bottomedgeglowtime>0)
		{	int thick = bottomedgeglowtime/5;
			game.vectorRenderer.addRectangle(listx,listy+listheight-thick,listwidth,thick, 0xccffffff);		
		}
			 			 					 		
		// draw the list caption 
		int x = listx; 	
		int y = listy-listscrolly; 
		for (int i=0; i<captions.length; i++)
		{	y += drawEntry (captions[i], x,y, false, true);
		}

		// on top of all place the close button
		if (closeButton!=null)
		{	closeButton.draw(game.vectorRenderer);
		}
						
		// draw the list body (with proper clipping applied) 
		for (int i=0; i<entries.length; i++)
		{	ListEntry e = entries[i];
			y += drawEntry (e, x,y, i==selected, false);
		}
				
		// flush to indeed render it to screen
		game.vectorRenderer.flush();  // color areas go below text
		game.levelRenderer.flush();  // images go below text
		game.textRenderer.flush();   // text goes on top		
	}
	
	
	private void calculateLayout()
	{
		float scaling = game.detailScale;

		outerborder = 2;
		innerborder = 1;
		textpadding = (int)(6*scaling);
		
		listwidth = Math.min(screenwidth, (int) (500*scaling));
		listx = (screenwidth-listwidth)/2;
		
		contentheight=0;
		for (int i=0; i<captions.length; i++)
		{	calculateEntryHeight(captions[i], listwidth,true);
			contentheight += captions[i].height;
		}		
		for (int i=0; i<entries.length; i++)
		{	calculateEntryHeight(entries[i], listwidth,false);
			contentheight += entries[i].height;
		}
		
//		int visibleheight = Math.min(screenheight, captionheight+contentheight);
//		bodyheight = visibleheight-captionheight;

		listheight = Math.min(screenheight, contentheight);
		listy = (screenheight-listheight)/2;		
		
		tilesize = (int) (30*scaling);
		buttonsize = (int) (40*scaling);
	}

	
	private void calculateEntryHeight(ListEntry entry, int width, boolean iscaption)
	{
		entry.width = width;
		entry.height = (int)(entry.size*game.detailScale);

		// find a font size that still fits into the border
		int th = (int) (entry.height*1.2f);
		while (entry.text!=null && th>2 && game.textRenderer.determineStringWidth(entry.text, th)+textpadding*2 > entry.width)
		{	th--;
		}		
		entry.textheight = th;

		// increase the list entry height in order to get a hitable button
		if (!iscaption)
		{	entry.height = Math.max(entry.height,game.minButtonSize);
		}
	}
	
	
	
	private int drawEntry(ListEntry entry, int x, int y, boolean isselected, boolean iscaption)
	{	
		if (isselected)
		{	game.vectorRenderer.addRectangle(x,y, entry.width,entry.height, 0xcc888888);
		}
		if (!iscaption)
		{	game.vectorRenderer.addRectangle(x,y+entry.height, entry.width,1, 0xcc555555);
		}
		
//		if (entry.icontile>=0)
//		{	int tilespace = (tilesize*5)/3;
//			if (entry.icontile>0) 
//			{	game.levelRenderer.addTileToBuffer(x+(tilespace-tilesize)/2, y+(entry.height-tilesize)/2, entry.icontile);
//			}
//			x += tilespace;		
//		}
				
		if (entry.text!=null)
		{	game.textRenderer.addString(entry.text, x+textpadding,
				(int)(y+(entry.height-entry.textheight)/2.0-entry.textheight*0.1), entry.textheight, false, 
				 entry.argb, TextRenderer.WEIGHT_PLAIN);
		}
		
		return entry.height;
	}

	private void bringSelectedInView()
	{	
		int y = -listscrolly;
		for (int i=0; i<captions.length; i++)
		{	y+= captions[i].height;
		}
		for (int i=0; i<entries.length; i++)
		{	ListEntry e = entries[i];
			if (i==selected) 
			{	if (y<0)
				{	listscrolly += y;
				}	
				if (y+e.height>listheight)
				{	listscrolly += (y+e.height)-listheight;
				}
				return;
			}
			y += e.height;
		}
	}	

	private boolean delimitScrollPosition()
	{
		if (listscrolly<0)
		{	listscrolly = 0;
			if (contentheight>listheight) 
			{	topedgeglowtime = EDGEGLOWTIME;
				return true;
			}
		}
		if (listscrolly>contentheight-listheight)
		{	listscrolly = contentheight-listheight;
			if (contentheight>listheight) 
			{	bottomedgeglowtime = EDGEGLOWTIME;
				return true;
			}
		}
		return false;
	}

	private int findEntry(int y_in_body)
	{
		int y = 0;
		for (int i=0; i<captions.length; i++)
		{	y += captions[i].height;
		}
		for (int i=0; i<entries.length; i++)
		{	ListEntry e = entries[i];
			if (y_in_body>=y && y_in_body<y+e.height) 
			{	return i;
			}
			y += e.height;
		}
		return -1;
	}


    // ---- key event handlers called in GL thread ----
    public void handleKeyEvent(KeyEvent event)
    {	
    
    	if (event.getAction()==KeyEvent.ACTION_DOWN)
    	{	switch (event.getKeyCode())
    		{	case KeyEvent.KEYCODE_DPAD_UP:
    				if (selected<0)
    				{	selected=0;
    					bringSelectedInView();
    				}
    				else if (selected>0) 
    				{	selected--;
    					bringSelectedInView();
    				}
					break;    				
    			case KeyEvent.KEYCODE_DPAD_DOWN:
    				if (selected<0)
    				{	selected=0;
    					bringSelectedInView();
    				}
    				else if (selected<entries.length-1) 
    				{	selected++;
    					bringSelectedInView();
    				}
					break;
    			case KeyEvent.KEYCODE_ENTER:
    				if (selected==-1 && entries.length>0)
    				{	selected=0;
    				}
    				else
	    			{	if (selected>=0 && selected<entries.length)	    			
	    				{	onEntrySelected(entries[selected]);
	    				}
	    			}
	    			break;
    			case KeyEvent.KEYCODE_SPACE:
    				if (canCloseWithSpacebar)
    				{	handleBackNavigation();				    					
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
		if (closeButton!=null && closeButton.onPointerDown(x,y))
		{	return;
		}
				
    	
    	if (x>=listx && x<listx+listwidth && y>=listy && y<listy+listheight)  
    	{	timeofpointerisactive = 1;
    		activepointerwasmoved = false;
    		activepointery = y;

    		selected =  findEntry(activepointery - (listy-listscrolly));    		
    	}
	}
	
	@Override
	public void onPointerUp()
	{
		if (closeButton!=null)
		{	closeButton.onPointerUp();
		}

		if (timeofpointerisactive==0) return;
    	timeofpointerisactive = 0;

  		if (activepointerwasmoved)
  		{	delimitScrollPosition();
    	}
    	else
    	{	// this was just a tap on the device - must select list entry
			if (selected>=0 && selected<entries.length)
    		{	onEntrySelected(entries[selected]);
    			return;
    		}
    	}	
	}
	
	@Override
	public void onPointerMove(int x, int y)
	{
		if (closeButton!=null)
		{	closeButton.onPointerMove(x,y);
		}
		
		if (timeofpointerisactive==0) return;
    			
		int dy = y - activepointery;
					
		if (Math.abs(dy) > game.minButtonSize/4)	// check if it was a drag movement 
		{	activepointerwasmoved=true;
		}
		if (activepointerwasmoved)
		{	activepointery += dy;    				
			listscrolly -= dy;
			delimitScrollPosition();
			selected = -1;
		}
    }

	// --- animator tick for doing self-running actions --- 
	@Override
	public void tick()
	{
		if (timeofpointerisactive>0 && timeofpointerisactive<Integer.MAX_VALUE)
		{	timeofpointerisactive++;
		}
		
		// measure scroll speed  (in pixels / frame) while not running free
		if (timeofpointerisactive!=0)
		{	freescrollspeed = listscrolly - listscrollyprevious;
//		System.out.println("speed: "+freescrollspeed);				
		}
		// free scrolling action
		else
		{	listscrolly += freescrollspeed;
			if (delimitScrollPosition())
			{	freescrollspeed=0;
			}
			else if (freescrollspeed>0) 
			{	freescrollspeed = Math.max(0, freescrollspeed-DECELERATION);
			}
			else
			{	freescrollspeed = Math.min(0, freescrollspeed+DECELERATION);
			}
		}
		listscrollyprevious = listscrolly;	
		
		if (topedgeglowtime>0) topedgeglowtime--;	
		if (bottomedgeglowtime>0) bottomedgeglowtime--;	
	}

	// ----------- need to be overwritten by subclasses if want to handle actions --------
	public void onEntrySelected(ListEntry entry)
	{
	}

}
