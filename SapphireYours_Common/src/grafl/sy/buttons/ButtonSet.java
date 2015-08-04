package grafl.sy.buttons;

import grafl.sy.renderer.VectorRenderer;

import java.util.Vector;

import android.view.KeyEvent;

public class ButtonSet 
{
	Vector<Button> buttons;
	int keyboardfocus;

	public ButtonSet(boolean keynavigation)
	{
		buttons = new Vector<Button>();
		keyboardfocus = keynavigation ? 0:-1;
	}
	
	public void clear()
	{
		buttons.clear();
	}
	
	public void add(Button b)
	{
		buttons.add(b);		
	}
	
	public void draw(VectorRenderer vr)
	{	
		int border = 2; 
		
		int idx=0;		
		for (Button b:buttons)
		{
			if (idx==keyboardfocus)
			{
				vr.addFrame(b.x-border, b.y-border, b.width+2*border, b.height+2*border, border, 0xffff0000);
			}
		
			b.draw(vr);
			idx++;
		}
	}
	
	public void onPointerDown(int x, int y)
	{
		for (Button b:buttons)
		{	b.onPointerDown(x,y);
		}	
		keyboardfocus = -1;
	}	
	public void onPointerUp()
	{
		for (Button b:buttons)
		{	b.onPointerUp();
		}	
		keyboardfocus = -1;
	}	
	public void onPointerMove(int x, int y)
	{	
		for (Button b:buttons)
		{	b.onPointerMove(x,y);		
		}
	}
	
    public void handleKeyEvent(KeyEvent event)
    {
		if (event.getAction()==KeyEvent.ACTION_DOWN)
		{
			switch (event.getKeyCode())
			{	case KeyEvent.KEYCODE_DPAD_LEFT:
				{	int f = findNextButton(-1,0);
					if (f>=0) keyboardfocus=f;
					break;
				}
    			case KeyEvent.KEYCODE_DPAD_RIGHT:
    			{	int f = findNextButton(1,0);
					if (f>=0) keyboardfocus=f;
					break;
    			}    		
    			case KeyEvent.KEYCODE_DPAD_UP:
    			{	int f = findNextButton(0,-1);
					if (f>=0) keyboardfocus=f;
					break;
    			}
    			case KeyEvent.KEYCODE_DPAD_DOWN:
    			{	int f = findNextButton(0,1);
					if (f>=0) keyboardfocus=f;
					break;
    			}    		
    			case KeyEvent.KEYCODE_ENTER:
    				if (keyboardfocus>=0 && keyboardfocus<buttons.size())
    				{	Button b = buttons.elementAt(keyboardfocus);
    					if (b.triggeraction!=null)
						{	b.triggeraction.run();
						}
    				}    				
	    			break;							
			}
		
		}
    
    }
    
    public int findNextButton(int dx, int dy)
    {
    	if (keyboardfocus<0 || keyboardfocus>=buttons.size())
    	{	return 0;
    	}
    	Button b = buttons.elementAt(keyboardfocus);
    	
    	float best_dsq = 10.0e30f;
    	int best=-1;
    	for (int i=0; i<buttons.size(); i++)
    	{
    		Button other = buttons.elementAt(i);
    		if (dx<0) 
    		{	if (other.x>=b.x) continue;
    		}
    		if (dx>0)
    		{	if (other.x<=b.x) continue;
    		}
    		if (dy<0) 
    		{	if (other.y>=b.y) continue;
    		}
    		if (dy>0)
    		{	if (other.y<=b.y) continue;
    		}
    		float dsq = (other.x-b.x)*(other.x-b.x) + (other.y-b.y)*(other.y-b.y);
    		if (dsq<best_dsq)
    		{	best_dsq = dsq;
    			best = i;
    		} 
    	}
    	return best;    
    }

}
