package grafl.sy.screens;
 

import grafl.sy.game.Game;
import android.view.KeyEvent;

public abstract class Screen 
{
	public final Game game;	
	
	public int screenwidth;
	public int screenheight;
	
	public Screen(Game game)
	{
		this.game = game;
		screenwidth = 0;
		screenheight = 0;
	}
	
	public void resize(int width, int height)
	{
		screenwidth = width;
		screenheight = height;
	}
	
	public void discard()
	{
	}
	
	public void tick()
	{
	}
	
	public void draw()
	{
	}
		
				
	public void reactivate()
	{
	}
	
	public boolean isOverlay()
	{	return false;
	}
		
	
    // ---- key event handlers called in GL thread ----
    public void handleKeyEvent(KeyEvent event)
    {
    }
	
	public void handleBackNavigation()
	{
		game.removeScreen();	
	} 	
    
    /** interface for simplified touch events. 
     */       
	public void onPointerDown(int x, int y)
	{
	}
	public void onPointerUp()
	{
	}
	public void onPointerMove(int x, int y)
	{
	}


	// some toolbox methods to be used on various screens
	
	/** 
	 * 	Create string of the form m:ss of a given number of seconds. 
	 *  Only non-negative seconds work correctly.
	 */ 
	public static String buildTimeString(int seconds)
	{
		int m = Math.floor(seconds/60);
		int s = seconds%60;
        if (s>=10)
        {	return m+":"+s;
        }
        else
        {	return m+":0"+s;
        }			
	} 
	
}
