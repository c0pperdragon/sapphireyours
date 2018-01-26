package grafl.sy.buttons;

import grafl.sy.game.Game;
import grafl.sy.renderer.VectorRenderer;

public class ReduceValueButton extends Button
{
	final static int[] shape_decbutton = { 
	    30,-80, -50,0, 30,80
	};


	public ReduceValueButton(Game game, float x, float y, float width, float height, Runnable triggeraction)
	{
		super(game,x,y,width,height,triggeraction);	
	}

	public void draw(VectorRenderer vr)	
	{	        	 
		vr.addRoundedRect(x,y,width,height, width/2, width/2+1.0f, isPressed ?  0xff666666 : 0xdd000000);
    	vr.addShape(x+width/2,y+height/2, shape_decbutton, width/3.0f, 0xffffffff);
	}



}
