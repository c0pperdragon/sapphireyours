package grafl.sy.buttons;

import grafl.sy.game.Game;
import grafl.sy.renderer.VectorRenderer;

public class MenuButton extends Button
{
	final static int[] shape_menubutton = { 
	    -70,-62,-70,-62,  -70,-37, 70,-62, 70,-37,70,-37,
	    -70,-12,-70,-12,  -70,13, 70,-12, 70,13,70,13,	    
	    -70,38,-70,38,  -70,63, 70,38, 70,63,70,63
	};


	public MenuButton(Game game, float x, float y, float width, float height, Runnable triggeraction)
	{
		super(game,x,y,width,height,triggeraction);	
	}

	public void draw(VectorRenderer vr)	
	{	        	 
		vr.addRoundedRect(x,y,width,height, width/2, width/2+1.0f, isPressed ?  0xff666666 : 0xdd000000);
    	vr.addShape(x+width/2,y+height/2, shape_menubutton, width/3.0f, 0xffffffff);
	}



}
