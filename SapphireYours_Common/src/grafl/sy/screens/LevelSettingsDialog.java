package grafl.sy.screens;

import android.view.KeyEvent;
import grafl.sy.buttons.BackButton;
import grafl.sy.buttons.ButtonSet;
import grafl.sy.buttons.IncreaseValueButton;
import grafl.sy.buttons.ReduceValueButton;
import grafl.sy.game.Game;
import grafl.sy.logic.Level;
import grafl.sy.renderer.TextRenderer;
import grafl.sy.renderer.VectorRenderer;

public class LevelSettingsDialog extends Screen
{
	Level level;
	int totalloot;

	int dialogx;
	int dialogy;
	int dialogwidth;
	int dialogheight;
	
	ButtonSet  buttons;
	int selectedline;

	public LevelSettingsDialog(Game game, Level level)
	{
		super(game);
		this.level = level;
		this.totalloot = level.calculateMaximumLoot(false);
		this.buttons = new ButtonSet(false);		
		this.selectedline = -1;						
	}
	
	@Override
	public void resize(int width, int height)
	{
		super.resize(width,height);
		drawOrLayout(false);
	}

	@Override
	public boolean isOverlay()
	{	return true;
	}
	


	public void draw()
	{
		drawOrLayout(true);
	}
	
	private void drawOrLayout(boolean draw)
	{
		float scaling = game.detailScale;		
		float th = 27*scaling;
		float lspace = 5*scaling; 
		int border = (int) (15*scaling);				
		 
		VectorRenderer vr = game.vectorRenderer;				
		TextRenderer tr = game.textRenderer;				

		// layout depends on menu width which depends on the screen size
		dialogwidth = Math.min(300, screenwidth);					
		dialogx = (screenwidth-dialogwidth)/2;
		int col = 0xff000000;
		int bgcolor = 0xffbbbbbb;
		int labelx = dialogx + border;
		int valuex = dialogx+dialogwidth-dialogwidth/3;
		int valuewidth = dialogwidth/3-20;
		int buttonx1 = valuex - dialogwidth/4;
		int buttonx2 = valuex + dialogwidth/4;
		int y = dialogy+border;	 // when painting from top to bottom increase y position
				
		// at first call or after size change, initialize buttons
		if (!draw)		
		{	
			buttons = new ButtonSet(false);
			selectedline = game.usingKeyboardInput ? 0: -1;
		}
		// when in drawing mode, initialize renderers and draw background and all buttons
		else
		{	vr.startDrawing (screenwidth, screenheight);
			tr.startDrawing (screenwidth, screenheight);		
			vr.addRoundedRect(dialogx,dialogy,dialogwidth,dialogheight, 20*scaling, 20*scaling+1, bgcolor);
			buttons.draw(vr);
		}

		// add caption
		if (draw)
		{	tr.addString ("Level Settings", labelx, y, th, false, col, TextRenderer.WEIGHT_PLAIN);
		}
		y += th + 2*lspace;
		

		// add difficulty text
		int difficultyliney = y - dialogy;
		if (draw)
		{
			tr.addString ("Difficulty", labelx, y, th, false, col, TextRenderer.WEIGHT_PLAIN);
			String difname = Game.getNameForDifficulty(level.getDifficulty());
			float tw = tr.determineStringWidth(difname, th);
			int c = col;
			if (selectedline==0)
			{	c = bgcolor;
				vr.addRectangle(valuex-valuewidth/2,y,valuewidth,th, col);
			}
			tr.addString (difname, valuex-tw/2,y, th, false, c, TextRenderer.WEIGHT_BOLD);
		}		
		y += th + lspace;
		
		// add category name
		int categoryliney = y - dialogy;
		if (draw)
		{
			tr.addString ("Category", labelx, y, th, false, col, TextRenderer.WEIGHT_PLAIN);
			String catname = Game.getNameForCategory(level.getCategory());
			float tw = tr.determineStringWidth(catname, th);
			int c = col;
			if (selectedline==1)
			{	c = bgcolor;
				vr.addRectangle(valuex-valuewidth/2,y,valuewidth,th, col);
			}
			tr.addString (catname, valuex-tw/2,y, th, false, c, TextRenderer.WEIGHT_BOLD);
		}		
		y += th +lspace;
		
		// add loot speed
		int lootliney = y - dialogy;
		if (draw)
		{
			tr.addString ("Collect", labelx, y, th, false, col, TextRenderer.WEIGHT_PLAIN);
			String ltxt;
			int l = level.getLoot();
			if (l<totalloot)
			{	ltxt = "- " + (totalloot-l);
			}
			else if (l>totalloot)
			{	ltxt = "+ " + (l-totalloot);
			}
			else
			{	ltxt = "All";
			}
			float tw = tr.determineStringWidth(ltxt, th);
			int c = col;
			if (selectedline==2)
			{	c = bgcolor;
				vr.addRectangle(valuex-valuewidth/2,y,valuewidth,th, col);
			}
			tr.addString (ltxt, valuex-tw/2,y, th, false, c, TextRenderer.WEIGHT_BOLD);
		}		
		y += th + lspace;

		// add swamp speed
		int swamprateliney = y - dialogy;
		if (draw)
		{
			tr.addString ("Swamp", labelx, y, th, false, col, TextRenderer.WEIGHT_PLAIN);
			String sptxt = ""+level.getSwampRate();
			float tw = tr.determineStringWidth(sptxt, th);
			int c = col;
			if (selectedline==3)
			{	c = bgcolor;
				vr.addRectangle(valuex-valuewidth/2,y,valuewidth,th, col);
			}
			tr.addString (sptxt, valuex-tw/2,y, th, false, c, TextRenderer.WEIGHT_BOLD);
		}		
		y += th + lspace;
		
		
		
		if (!draw)
		{
			// compute the dialog size for subsequent paints
			y+= border;
			dialogheight = y - dialogy;
			dialogy = screenheight/2 - dialogheight/2; 		
			
			// add buttons at correct y positions
			buttons.add(
				new ReduceValueButton(game, buttonx1, dialogy+difficultyliney, th,th,
				 	new Runnable(){public void run(){selectedline=-1; reduceDifficulty();}}
			));
			buttons.add(
				new IncreaseValueButton(game, buttonx2-th, dialogy+difficultyliney, th,th, 
					new Runnable(){public void run(){selectedline=-1;incrementDifficulty();}}
			));

			buttons.add(
				new ReduceValueButton(game, buttonx1, dialogy+categoryliney, th,th,
				 	new Runnable(){public void run(){selectedline=-1;reduceCategory();}}
			));
			buttons.add(
				new IncreaseValueButton(game, buttonx2-th, dialogy+categoryliney, th,th, 
					new Runnable(){public void run(){selectedline=-1;incrementCategory();}}
			));
			
			buttons.add(
				new ReduceValueButton(game, buttonx1, dialogy+lootliney, th,th,
				 	new Runnable(){public void run(){selectedline=-1;reduceLoot();}}
			));
			buttons.add(
				new IncreaseValueButton(game, buttonx2-th, dialogy+lootliney, th,th, 
					new Runnable(){public void run(){selectedline=-1;incrementLoot();}}
			));
			
			buttons.add(
				new ReduceValueButton(game, buttonx1, dialogy+swamprateliney, th,th,
				 	new Runnable(){public void run(){selectedline=-1;reduceSwampRate();}}
			));
			buttons.add(
				new IncreaseValueButton(game, buttonx2-th, dialogy+swamprateliney, th,th, 
					new Runnable(){public void run(){selectedline=-1;incrementSwampRate();}}
			));
			
			// add exit button
			buttons.add(
				new BackButton(game, dialogx+dialogwidth-border-th, dialogy+border, th,th,
				 	new Runnable(){public void run(){ game.removeScreen();}}
			));			
		}
		else
		{	// flush everything to screen
			vr.flush();
			tr.flush();
		}
	}
	
    @Override
	public void onPointerDown(int x, int y)
	{	
		buttons.onPointerDown(x,y);		
	}
    @Override
	public void onPointerUp()
	{
		buttons.onPointerUp();		
	}
    @Override
	public void onPointerMove(int x, int y)
	{	
		buttons.onPointerMove(x,y);		
	}
	@Override	
    public void handleKeyEvent(KeyEvent event)
    {
    	if (event.getAction()==KeyEvent.ACTION_DOWN)
		{
			switch (event.getKeyCode())
			{	case KeyEvent.KEYCODE_DPAD_UP:
					selectedline = Math.max(selectedline-1,0);
					break;
				case KeyEvent.KEYCODE_DPAD_DOWN:
					selectedline = Math.min(selectedline+1,3);
					break;
				case KeyEvent.KEYCODE_DPAD_LEFT:
					switch (selectedline)
					{	case 0: reduceDifficulty(); 
								break;
						case 1: reduceCategory(); 
								break;
						case 2: reduceLoot(); 
								break;
						case 3: reduceSwampRate(); 
								break;
						default: selectedline=0;
								break;
					}
					break;
				case KeyEvent.KEYCODE_DPAD_RIGHT:
					switch (selectedline)
					{	case 0: incrementDifficulty(); 
								break;
						case 1: incrementCategory(); 
								break;
						case 2: incrementLoot(); 
								break;
						case 3: incrementSwampRate(); 
								break;
						default: selectedline=0;
								break;
					}
					break;
				case KeyEvent.KEYCODE_ENTER:			
					game.removeScreen();
					break;
			}
		}
    
		// buttons.handleKeyEvent(event);				    
    }
	
	private void reduceDifficulty()
	{
		level.setDifficulty(Math.max(level.getDifficulty()-1,1));		
	}
	private void incrementDifficulty()
	{
		level.setDifficulty(Math.min(level.getDifficulty()+1,9));			
	}
	
	private void reduceCategory()
	{
		level.setCategory(Math.max(level.getCategory()-1,0));		
	}
	private void incrementCategory()
	{
		level.setCategory(Math.min(level.getCategory()+1,6));			
	}
	
	private void reduceLoot()
	{
		level.setLoot(Math.max(level.getLoot()-1,0));		
	}
	private void incrementLoot()
	{
		level.setLoot(level.getLoot()+1);			
	}

	private void reduceSwampRate()
	{
		level.setSwampRate(Math.max(level.getSwampRate()-1,0));		
	}
	private void incrementSwampRate()
	{
		level.setSwampRate(level.getSwampRate()+1);			
	}
	
	
}
