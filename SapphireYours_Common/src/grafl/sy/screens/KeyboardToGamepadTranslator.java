package grafl.sy.screens;

import android.view.KeyEvent;

public class KeyboardToGamepadTranslator 
{
	GamePadInputBuffer listener1;
	GamePadInputBuffer listener2;	
	
	int numpressed;
	int[] pressedkeys;
	boolean switchedcontrols;
	
	public KeyboardToGamepadTranslator(GamePadInputBuffer listener1, GamePadInputBuffer listener2)
	{
		this.listener1 = listener1;
		this.listener2 = listener2;
		
		numpressed = 0;
		pressedkeys = new int[100];
		switchedcontrols = false;
	}

	// forget any stored state and reset to start values 
	public void reset()
	{
		numpressed = 0;	
	}

	// key input from the computer keyboard	
	public void keyDown(int keycode)
	{
		// avoid array overflow
		if (numpressed>=pressedkeys.length)
		{	return;
		}		
		// check if key is already in list - do nothing if already pressed
		for (int i=0; i<numpressed; i++)
		{	if (pressedkeys[i]==keycode)
			{	return;
			}
		}
		// append key into list
		pressedkeys[numpressed] = keycode;
		numpressed++;
	
		// send change info to listeners 	
		sendGamePadStates();
	}
	
	public void keyUp(int keycode)
	{
		// remove the keycode from the list if present (otherwise no action)
		int writecursor=0;
		for (int i=0; i<numpressed; i++)
		{	// copy everything that does not need to be removed
			if (pressedkeys[i]!=keycode)
			{	pressedkeys[writecursor] = pressedkeys[i];
				writecursor++;
			} 
		}
		numpressed=writecursor;
		
		// send change info to listeners 	
		sendGamePadStates();
	}	
	
	public void switchControls(boolean isswitched)
	{
		switchedcontrols = isswitched;
		sendGamePadStates();
	}
	
	public boolean hasSwitchedControls()
	{
		return switchedcontrols;	
	}
	
	
	/** Send current state of the game pads to the listeners. 
	 *  Probably nothing has changed, but the listeners will check this.
	 */ 
	private void sendGamePadStates()
	{
		// check all currently pressed keys (in order of time of press) and determine
		// which game pad should do which things.
		// By overwriting the direction it makes sure that the latest direction key
		// for a device is used.
		int dir0 = GamePadInputBuffer.DIRECTION_NONE;
		int dir1 = GamePadInputBuffer.DIRECTION_NONE;
		boolean action1_0 = false;
		boolean action1_1 = false;		
		boolean action2_0 = false;
		boolean action2_1 = false;		
		for (int i=0; i<numpressed; i++)
		{	switch (pressedkeys[i])
			{	case KeyEvent.KEYCODE_DPAD_UP:
					dir0 = GamePadInputBuffer.DIRECTION_UP;
					break;
				case KeyEvent.KEYCODE_DPAD_DOWN:	
					dir0 = GamePadInputBuffer.DIRECTION_DOWN;
					break;
				case KeyEvent.KEYCODE_DPAD_LEFT:	
					dir0 = GamePadInputBuffer.DIRECTION_LEFT;
					break;
				case KeyEvent.KEYCODE_DPAD_RIGHT:	
					dir0 = GamePadInputBuffer.DIRECTION_RIGHT;
					break;
				case KeyEvent.KEYCODE_SPACE:
					dir0 = GamePadInputBuffer.DIRECTION_WAIT;
					break;				
				case KeyEvent.KEYCODE_R:	
					dir1 = GamePadInputBuffer.DIRECTION_UP;
					break;
				case KeyEvent.KEYCODE_F:	
					dir1 = GamePadInputBuffer.DIRECTION_DOWN;
					break;
				case KeyEvent.KEYCODE_D:	
					dir1 = GamePadInputBuffer.DIRECTION_LEFT;
					break;
				case KeyEvent.KEYCODE_G:	
					dir1 = GamePadInputBuffer.DIRECTION_RIGHT;
					break;
				case 0x00000071:	  // CTRL_LEFT
				case 0x00000072:	  // CTRL_RIGHT
					action1_0 = true;
					break;
				case KeyEvent.KEYCODE_SHIFT_LEFT:
				case KeyEvent.KEYCODE_SHIFT_RIGHT:
					action2_0 = true;
					break;
				case KeyEvent.KEYCODE_S:
					action2_1 = true;
					break;
				case KeyEvent.KEYCODE_A:
					action1_1 = true;
					break;
			}
		}	

		// switch listeners if needed		
		GamePadInputBuffer l1 = listener1;
		GamePadInputBuffer l2 = listener2;
		if (switchedcontrols)
		{	l1 = listener2;
			l2 = listener1;
		}		
		// send collected state to both listeners (or to the same if only one player is present)
		l1.setAction1Button(0, action1_0);
		l1.setAction2Button(0, action2_0);
		l1.setDirection(0, dir0);
		l2.setAction1Button(1, action1_1);
		l2.setAction2Button(1, action2_1);
		l2.setDirection(1, dir1);
	}	
	
	
	public boolean isKeyForSecondaryInput(int keycode)
	{
		switch (keycode)
		{	case KeyEvent.KEYCODE_R:	
			case KeyEvent.KEYCODE_F:	
			case KeyEvent.KEYCODE_D:	
			case KeyEvent.KEYCODE_G:	
			case KeyEvent.KEYCODE_S:
			case KeyEvent.KEYCODE_A:
				return true;
		}
		return false;
	}		
}
