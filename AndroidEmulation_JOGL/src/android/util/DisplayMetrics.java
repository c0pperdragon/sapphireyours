package android.util;

public class DisplayMetrics
{
	public int widthPixels;
	public int heightPixels;
	public int densityDpi;
	public float xdpi;
	public float ydpi;
	
	public DisplayMetrics()
	{
		// default values averaging a standard HD-monitor
		widthPixels = 1920;						
		heightPixels = 1080;
		densityDpi = 90;
		xdpi = 90;				
		ydpi = 90;		
	}	
}
