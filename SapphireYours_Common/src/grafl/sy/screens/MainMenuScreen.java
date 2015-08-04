package grafl.sy.screens;


import android.view.KeyEvent;
import grafl.sy.game.Game;
import grafl.sy.logic.LevelPack;
import grafl.sy.logic.Level;
import grafl.sy.renderer.TextRenderer;

public class MainMenuScreen extends Screen 
{
	final static int MENUENTRY_NEWLEVEL = 0;
	final static int MENUENTRY_EXIT = 1;	
	final static String[] menuentrytext = { "New Level", "Exit" }; 


	int selectedcolumn;
	int selectedrow;
	
	int numcolumns;  // how many columns are in the screen 
	int menucolumn;	 // in which column is the main menu located

	public MainMenuScreen (Game game)
	{
		super(game);
		
		this.selectedcolumn = 0;
		this.selectedrow = 0;
		
		reactivate();			
	}
	
	
	public void reactivate()
	{
		// compute some layout data
		numcolumns = game.levelpacks.size() + 1;
		menucolumn = 0;
		
		for (int i=0; i<game.levelpacks.size(); i++)
		{
			if (game.levelpacks.elementAt(i).isWriteable()) 
			{	menucolumn=i+1;
			}		
		}
	}
	
	
	
	
	public void draw()
	{
		int colwidth = 300;
		int rowheight = 30;
		int left = screenwidth/2 - colwidth/2 - selectedcolumn*colwidth;
		int top = 50;
	
	
		// set up renderers
		game.textRenderer.startDrawing (screenwidth, screenheight);
		game.vectorRenderer.startDrawing (screenwidth, screenheight);
		game.gfxRenderer.startDrawing (screenwidth, screenheight);
		
		// add background
		game.gfxRenderer.addGraphic(game.gfxRenderer.TITLEPICTURE, 10,10,(screenheight-20)*0.2f,screenheight-20);
		game.gfxRenderer.flush();
		
		int background = 0xff393939;
		int menuhighlight = 0xffffffff;
		
		// draw selection
		Level selectedlevel = getSelectedLevel(); 
		int cornerradius = 4;			
		if (selectedlevel!=null)
		{	game.vectorRenderer.addRoundedRect(left+selectedcolumn*colwidth, top+selectedrow*rowheight, colwidth,rowheight, 
				cornerradius,cornerradius+1, Game.getColorForDifficulty(selectedlevel.getDifficulty()) );
		}
		else if (selectedcolumn==menucolumn)
		{
			game.vectorRenderer.addRoundedRect(left+selectedcolumn*colwidth, top+selectedrow*rowheight, colwidth,rowheight, 
				cornerradius,cornerradius+1, menuhighlight );
		}			
		game.vectorRenderer.flush();

		// draw all columns of the main menu
		for (int col=0; col<numcolumns; col++)
		{
			float x = left+col*colwidth;
			if (x+colwidth < 0) continue;
			if (x > screenwidth) continue;
								
			LevelPack p = getLevelPack(col);
			if (p!=null)
			{	game.textRenderer.addString(p.name, left+col*colwidth, top-rowheight-15, rowheight, false, 0xffffffff, TextRenderer.WEIGHT_BOLD);		
		
				for (int row=0; row<p.levels.length; row++)
				{
					float y = top+row*rowheight;						
				
					Level l = p.levels[row];
					game.textRenderer.addString(l.getTitle(), 
						x+rowheight, y, rowheight, false,
						selectedlevel==l ? background : Game.getColorForDifficulty(l.getDifficulty()),
						TextRenderer.WEIGHT_PLAIN);
						
					short[] icon = null;	
					switch (game.getLevelSolvedGrade(l))
					{	case 0:	icon = game.gfxRenderer.FINISHEDMARKER_VISITED;
								break;
						case 1: icon = game.gfxRenderer.FINISHEDMARKER_SOLVED;
								break;
						case 2:	icon = game.gfxRenderer.FINISHEDMARKER_PERFECT;
								break;
					}
					if (icon!=null)
					{
						game.gfxRenderer.addGraphic(icon, x,y+rowheight*0.1f,rowheight*0.8f,rowheight*0.8f);
					}
				}
			}
			else if (col==menucolumn)
			{
				game.textRenderer.addString("Sapphire Yours", left+col*colwidth, top-rowheight-15, rowheight, false, 0xffffffff, TextRenderer.WEIGHT_BOLD);
				
				for (int row=0; row<menuentrytext.length; row++)
				{											
					float y = top+row*rowheight;						
				
					game.textRenderer.addString(menuentrytext[row], 
						x+rowheight, y, rowheight, false,
						(selectedcolumn==col && selectedrow==row) ? background : menuhighlight,
						TextRenderer.WEIGHT_PLAIN);				
				}
			}				
		}	
		
		// flush everything to screen
		game.textRenderer.flush();
		game.gfxRenderer.flush();		
	}

	private void bringSelectedInView()
	{
	}



	// -- mapping of rows/columns to the level list ---
	
	private int getRows(int column)
	{
		if (column==menucolumn)
		{	return menuentrytext.length; 
		}
		else if (column<menucolumn)
		{
			return game.levelpacks.elementAt(column).numberOfLevels();	
		}
		else 
		{
			return game.levelpacks.elementAt(column-1).numberOfLevels();	
		}
	}

	private LevelPack getLevelPack(int column)
	{
		if (column==menucolumn)
		{	return null; 
		}
		return game.levelpacks.elementAt(column<menucolumn ? column : column-1);
	}

	private Level getLevel(int column, int row)
	{
		LevelPack p = getLevelPack(column);
		if (p==null)
		{	return null; 
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
		
	private Level getSelectedLevel()
	{
		return getLevel(selectedcolumn, selectedrow);
	}


	public void startSelectedLevel()
	{
		Level l = getSelectedLevel();
		if (l!=null)
		{
			LevelPack lp = getLevelPack(selectedcolumn);			
			GameScreen gs = new GameScreen(game, l, null, 
				selectedcolumn<game.levelpacks.size()-1 || selectedrow<lp.levels.length-1, false, lp.isWriteable());
			game.addScreen(gs);
			gs.afterScreenCreation(); 			
		}	    			
	}

	public void startEditingSelectedLevel()
	{
		Level l = getSelectedLevel();
		if (l!=null)
		{	
			EditorScreen es = new EditorScreen(game, l);
			game.addScreen(es);
			es.afterScreenCreation();
		}	    			
	}

	public void startSubsequentLevel(Level current)
	{
		boolean found=false;
		for (int col=0; col<game.levelpacks.size(); col++)
		{
			LevelPack lp = game.levelpacks.elementAt(col);
			for (int row=0; row<lp.levels.length; row++)
			{
				if (found)
				{	selectedcolumn = col;
					selectedrow = row;
					startSelectedLevel();
					return;
				}					
				if (lp.levels[row]==current)
				{	
					found = true;
				}
			}
		}
	}

    // ---- key event handlers called in GL thread ----
    public void handleKeyEvent(KeyEvent event)
    {	
    	if (event.getAction()==KeyEvent.ACTION_DOWN)
    	{	switch (event.getKeyCode())
    		{	
    			case KeyEvent.KEYCODE_DPAD_LEFT:
    				if (selectedcolumn>0)
    				{	selectedcolumn--;
						if (selectedrow<0)
						{	selectedrow=0;
						}
						else if (selectedrow>=getRows(selectedcolumn))
						{	selectedrow = getRows(selectedcolumn)-1;
						}
    					bringSelectedInView();
    				}
					break;    				
    			case KeyEvent.KEYCODE_DPAD_RIGHT:
    				if (selectedcolumn<numcolumns-1)
    				{	selectedcolumn++;
						if (selectedrow<0)
						{	selectedrow=0;
						}
						else if (selectedrow>=getRows(selectedcolumn))
						{	selectedrow = getRows(selectedcolumn)-1;
						}
    					bringSelectedInView();
    				}
					break;
    		
    			case KeyEvent.KEYCODE_DPAD_UP:
    				if (selectedrow<0)
    				{	selectedrow=0;
    					bringSelectedInView();
    				}
    				else if (selectedrow>0) 
    				{	selectedrow--;
    					bringSelectedInView();
    				}
					break;    				
    			case KeyEvent.KEYCODE_DPAD_DOWN:
    				if (selectedrow<0)
    				{	selectedrow=0;
    					bringSelectedInView();
    				}
    				else if (selectedrow<getRows(selectedcolumn)-1)
    				{	selectedrow++;
    					bringSelectedInView();
    				}
					break;
    			case KeyEvent.KEYCODE_ENTER:
    				if (selectedrow<0)
    				{	selectedrow=0;
    				}
    				else
	    			{	
	    				startSelectedLevel();
	    			}
	    			break;
    			case KeyEvent.KEYCODE_SPACE:
    			{	EditorScreen s = new EditorScreen(game, new Level());
					game.addScreen(s);
					s.afterScreenCreation();
					break;
    			}
    		}    		
    	}
    	
    	super.handleKeyEvent(event);
    }
	
	
}

