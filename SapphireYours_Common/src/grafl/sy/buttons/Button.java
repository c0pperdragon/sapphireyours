package grafl.sy.buttons;

import grafl.sy.game.Game;
import grafl.sy.renderer.VectorRenderer;

public class Button 
{
	Game game;
	
	float x;
	float y;
	float width;
	float height;
	Runnable triggeraction;
	
	boolean isPressed;
	
	
	public Button(Game game, float x, float y, float width, float height, Runnable triggeraction)
	{
		this.game = game;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.triggeraction = triggeraction;
		this.isPressed = false;
	}
	
	// need to be implemented - graphics appearance
	public void draw(VectorRenderer vr)	
	{	        	    	
	}
	
	public void setPosition(float x, float y)
	{	
		this.x = x;
		this.y = y;
	}
	
	// ------------------- handle touch input commands ------------
	public boolean onPointerDown(int x, int y)
	{
		if (x>=this.x && x<this.x+width && y>=this.y && y<this.y+height)
		{	isPressed = true;
			return true;		
		}
		return false;
	}
	
    public void onPointerUp()
	{
		if (isPressed)
		{	isPressed = false;
			triggeraction.run();
		}
	}
		
	public void onPointerMove(int x, int y)
	{
		if (!isPressed)
		{	return;
		}
		isPressed = (x>=this.x && x<this.x+width && y>=this.y && y<this.y+height);
	}



}
