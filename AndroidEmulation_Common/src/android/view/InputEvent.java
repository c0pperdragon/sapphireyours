package android.view;

public abstract class InputEvent
{
	private int action;

	public InputEvent(int action)
	{		
		this.action = action;
	}

	public final int getAction ()
	{
		return action;		
	}

}
