package grafl.sy.buttons;

import grafl.sy.game.Game;
import grafl.sy.renderer.VectorRenderer;
 
public class BackButton extends Button 
{
	final static int[] shape_exitbutton = { 
		0,10, -70,80, 0,0, -80,70, -10,0, -10,0, -80,-70, 0,0, -70,-80, 0,-10, 0,-10, 
		70,-80, 0,0, 80,-70, 10,0, 10,0, 80,70, 0,0, 70,80, 0,10		 	
	};
	  

	public BackButton(Game game, float x, float y, float width, float height, Runnable triggeraction)
	{
		super(game,x,y,width,height,triggeraction);	
	}
	
	public void draw(VectorRenderer vr)	
	{	        	    	
		vr.addRoundedRect(x,y,width,height, width/2, width/2+1.0f, isPressed ?  0xff666666 : 0xdd000000);
    	vr.addShape(x+width/2,y+height/2, shape_exitbutton, (width*4)/10, 0xffbbbbbb);
	}
	

}
