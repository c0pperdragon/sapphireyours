package grafl.sy.game;

import grafl.sy.screens.Screen;
import android.view.MotionEvent;

public class MotionEventSimplifier 
{
	private int numactivepointers;
	private int[] activepointerids;


	public MotionEventSimplifier()
	{
		numactivepointers = 0;
		activepointerids = new int[10];
	}  
	
	public void reset()
	{
		numactivepointers = 0;
	}

    // ---- touch events (called in GL thread) ----
    /** This method does the translation of normal android MotionEvents to a 
     * simplified handler interface. 
     * Workarounds for some nasty implementation bugs are also done here.
     */
    public final void handleTouchEvent(MotionEvent event, Screen screen)
    {

    	switch (event.getActionMasked())
    	{	
    		case MotionEvent.ACTION_DOWN:
    		case MotionEvent.ACTION_POINTER_DOWN:
    		{	int aidx = event.getActionIndex ();
				int id = event.getPointerId(aidx);
				if (numactivepointers<activepointerids.length && findActivePointer(id)<0)
				{	activepointerids[numactivepointers] = id;
					numactivepointers++;
					if (numactivepointers==1)
					{	screen.onPointerDown((int)event.getX(aidx), (int)event.getY(aidx));
					}
				}
    			break;    		
    		}
    		case MotionEvent.ACTION_UP:
    		case MotionEvent.ACTION_POINTER_UP:
    		{	// compensate bug in android: when receiving an up action where pointers are no longer sent, consider the missing pointer as having gone up also
    			for (int i=numactivepointers-1; i>=0; i--)
    			{	if (event.findPointerIndex (activepointerids[i]) < 0)
    				{	removeActivePointerAnSendNotifications(i, screen);
    				}
    			}    		    			
    			int aidx = event.getActionIndex ();
				int id = event.getPointerId(aidx);
    			int activepos = findActivePointer(id);
    			if (activepos>=0)    			
    			{	removeActivePointerAnSendNotifications(activepos, screen);
    			}
    			break;
    		}
    		case MotionEvent.ACTION_MOVE:
    		{	// compensate bug in android: when receiving a move where pointers are no longer sent, consider the missing pointer as having gone up
    			for (int i=numactivepointers-1; i>=0; i--)
    			{	if (event.findPointerIndex (activepointerids[i]) < 0)
    				{	removeActivePointerAnSendNotifications(i, screen);
    				}
    			}    		
    			// traverse the movement info and build up data accordingly
    			for (int aidx=0; aidx<event.getPointerCount(); aidx++)
    			{	int id = event.getPointerId(aidx);
    				int activepos = findActivePointer(id);
    				// sanity check: must have this pointer as active
    				if (activepos==0)
    				{	screen.onPointerMove((int)event.getX(aidx), (int)event.getY(aidx));    				
    				}   			
    				// compensate bug in android - when receiving a move without previous pointer-down, inject one   
    				else if (numactivepointers<activepointerids.length)
					{	activepointerids[numactivepointers] = id;
						numactivepointers++;
						if (numactivepointers==1)
						{	screen.onPointerDown((int)event.getX(aidx), (int)event.getY(aidx));
						}
					}
    			}
    			break;
    		}
    		case MotionEvent.ACTION_CANCEL:
    		{	if (numactivepointers>0)
    			{	numactivepointers=0;
    				screen.onPointerUp();
    			}
    			break;
    		}
    	}
    }
    
	private int findActivePointer(int id)
	{	
		for (int i=0; i<numactivepointers; i++)
		{	if (activepointerids[i]==id)
			{ 	return i;
			}
		}
		return -1;
	}
	
	private void removeActivePointerAnSendNotifications(int pos, Screen screen)
	{	// must remove from list
    	for (int i=pos; i<numactivepointers-1; i++)
    	{	activepointerids[i] = activepointerids[i+1];
    	}
   		numactivepointers--;
   		// when last pointer was removed, just send pointer-up info    
    	if (numactivepointers<=0)
    	{	screen.onPointerUp();
    	}
    	// when this was the first (primary) pointer and there are other pointers, must switch over     	
    	else if (pos==0 && numactivepointers>0)
    	{
    		screen.onPointerUp();
    		screen.onPointerDown(0,0);
    	}
	}
	
    

}
