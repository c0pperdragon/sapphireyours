package grafl.sy.screens;

import grafl.sy.logic.Walk;

public class GamePadInputBuffer 
{
	final static int DIRECTION_NONE = -1;
	final static int DIRECTION_UP = 0;
	final static int DIRECTION_DOWN = 1;
	final static int DIRECTION_LEFT = 2;
	final static int DIRECTION_RIGHT = 3;
	final static int DIRECTION_WAIT = 4;

	public final static int MODE_NORMAL = 0;
	public final static int MODE_GRAB = 1;
	public final static int MODE_BOMB = 2;

	int numdirections;
	int[] directiondevice;
	int[] directionstack;
	int numaction1buttons;
	int[] action1device;
	int numaction2buttons;
	int[] action2device;

	int nummoves;
	int[] movebuffer;

	int actionmode;
	boolean actionmode_was_used;
	
	GamePadInputBuffer()
	{	
		numdirections = 0;
		directiondevice = new int[10];
		directionstack = new int[10];
		numaction1buttons = 0;
		action1device = new int[10];
		numaction2buttons = 0;
		action2device = new int[10];
		nummoves = 0;
		movebuffer = new int[20];
		actionmode = MODE_NORMAL;
		actionmode_was_used = false;
	}

	// forget any stored state and reset to start values 
	public void reset()
	{
		numdirections = 0;	
		numaction1buttons = 0;	
		numaction2buttons = 0;
		nummoves = 0;	
		actionmode = MODE_NORMAL;
	}
		
	// ---------------- input from game pad devices ---------------
	
	/**
	 * A press/release of the action1 button  (the "grab" action)
	 */
	public void setAction1Button(int device, boolean pressed)
	{
		// memorize previous state of the action key
		boolean prev = numaction1buttons>0;	
	
		// insert press-info for device into array if not aready present
		if (pressed)
		{	if (!inArray(action1device,numaction1buttons,device))
			{	action1device[numaction1buttons++] = device;
			}
		}
		// remove occurrences of device from array if present 
		else			
		{	numaction1buttons = removeFromArray(action1device,numaction1buttons,device);
		}
		
		// check if state of buttons has changed - must adjust action mode
		boolean now = numaction1buttons>0;
		if (now && !prev)
		{	actionmode = MODE_GRAB; 
			actionmode_was_used = false;
		}
		else if (prev&&!now)
		{	if (actionmode==MODE_GRAB && actionmode_was_used)
			{	actionmode = MODE_NORMAL;
			}
		}	
	}

	/**
	 * A press/release of the action2 button  (the "bomb" action)
	 */
	public void setAction2Button(int device, boolean pressed)
	{
		// memorize previous state of the action key
		boolean prev = numaction2buttons>0;	
	
		// insert press-info for device into array if not already present
		if (pressed)
		{	if (!inArray(action2device,numaction2buttons,device))
			{	action2device[numaction2buttons++] = device;
			}
		}
		// remove occurrences of device from array if present 
		else			
		{	numaction2buttons = removeFromArray(action2device,numaction2buttons,device);
		}
		
		// check if state of buttons has changed - must adjust action mode
		boolean now = numaction2buttons>0;
		if (now && !prev)
		{	actionmode = MODE_BOMB; 
			actionmode_was_used = false;
		}
		else if (prev&&!now)
		{	if (actionmode==MODE_BOMB && actionmode_was_used)
			{	actionmode = MODE_NORMAL;
			}
		}	
	}
		
	/**
	 * Change of the directional pad  (only 4 directions and the idle state are supported) 
	 */
	public void setDirection(int device, int dir)
	{
		// memorize previous direction state
		int prev = currentDirection();
	
		// add a direction info to the stack or just update an existing one 
		updatestack: 
		if (dir>=0)
		{	// check for presence
			for (int i=0; i<numdirections; i++)
			{	if (directiondevice[i]==device)
				{	// only update
					directionstack[i]=dir;
					break updatestack;
				}
			}
			// not found - insert now
			if (numdirections<directiondevice.length)
			{	directiondevice[numdirections] = device;
				directionstack[numdirections]=dir;
				numdirections++;
			}
		}	
		// need to remove a direction info from the stack
		else
		{	int writecursor=0;
			for (int i=0; i<numdirections; i++)
			{	// copy everything that does not need to be removed
				if (directiondevice[i]!=device)
				{	directiondevice[writecursor] = directiondevice[i];
					directionstack[writecursor] = directionstack[i];
					writecursor++;
				} 
			}
			numdirections=writecursor;
		}
		
		// if direction state was changed, do post-processing
		int curr = currentDirection(); 
		if (curr!=prev)		
		{	// enqueue command for new direction (but not the none-direction)
			if (curr!=DIRECTION_NONE && nummoves<movebuffer.length)
			{	movebuffer[nummoves] = generateMovement();
				nummoves++;
			}
//			// after releasing a direction pad and no action button is pressed, the game reverts from grab mode 
//			if (prev!=DIRECTION_NONE && actionmode==MODE_GRAB && numaction1buttons==0)
//			{	actionmode = MODE_NORMAL;
//			}
		}					
	}			
	
	
	private static boolean inArray(int[] a, int len, int value)
	{
		for (int i=0; i<len; i++)
		{	if (a[i]==value)
			{	return true;
			}
		}
		return false;		
	}
	
	private static int removeFromArray(int[] a, int len, int value)
	{
		int writecursor=0;
		for (int i=0; i<len; i++)
		{	// copy everything that does not need to be removed
			if (a[i]!=value)
			{	a[writecursor] = a[i];
				a[writecursor] = a[i];
				writecursor++;
			} 
		}
		return writecursor;
	}
	
	/**
	 * Determine to which direction the pad (or the recently used one) is currently pointing
	 */
	private int currentDirection()
	{
		if (numdirections>0)
		{	return directionstack[numdirections-1];
		}
		else
		{	return DIRECTION_NONE;
		}	
	}
	
	/**
	 * Determine the movement to do right now. This depends on the current direction and the action mode
	 */
	private int generateMovement()
	{
		int dir = currentDirection();
		
		if (dir>=0 && dir<=3)
		{	if (actionmode==MODE_NORMAL)
			{	return Walk.MOVE_UP + dir;
			}
			else if (actionmode==MODE_GRAB)
			{	actionmode_was_used = true;
				if (numaction1buttons==0)		// when action button 1 is not pressed, revert to normal mode
				{	actionmode = MODE_NORMAL;
				}
				return Walk.GRAB_UP + dir;
			}
			else if (actionmode==MODE_BOMB)
			{	actionmode_was_used = true;
				if (numaction2buttons==0)		// when action button 2 is not pressed, revert to normal mode
				{	actionmode = MODE_NORMAL;
				}
				return Walk.BOMB_UP + dir;
			}
		}
		return Walk.MOVE_REST;	
	}
	

	// ----------------let game retrieve movement commands  --------------
	 
	/**
	 * Retrieve the next command to be used for a player.
	 */
	public int nextMovement()
	{
		if (nummoves>0)
		{	int m = movebuffer[0];
			nummoves--;
			if (nummoves>0)
			{	System.arraycopy (movebuffer,1, movebuffer,0, nummoves);
			}
			return m;
		}
		else
		{	return generateMovement();
		}
	}

	public boolean hasNextMovement()
	{
		return nummoves>0 || currentDirection()>=0;
	}

	/**
	 * Get current action mode  (normal, grab, bomb) 
	 */
	public int getActionMode()
	{
		return actionmode;
	}


}
