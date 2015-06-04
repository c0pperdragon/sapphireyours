package android.view;

public class View implements KeyEvent.Callback
{
	// notification that the app enters pause mode. this is a good position to store persistent data
    public void onPause()
    {
    }

	// event handler to be overwritten
    public boolean onTouchEvent(final MotionEvent event) 
    {
    	return false;
    }
    
    // key event handler to be overwritten
    public boolean	onKeyDown(int keyCode, KeyEvent event)
    {
    	return false;
    }
	public boolean	onKeyLongPress(int keyCode, KeyEvent event)
	{
		return false;
	}
	public boolean	onKeyMultiple(int keyCode, int count, KeyEvent event)
	{
		return false;
	}
	public boolean	onKeyUp(int keyCode, KeyEvent event)
	{
		return false;
	}
	
}
