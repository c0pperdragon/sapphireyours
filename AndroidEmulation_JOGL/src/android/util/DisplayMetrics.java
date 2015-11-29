package android.util;

public class DisplayMetrics
{
	public int widthPixels;
	public int heightPixels;
	public int densityDpi;
	public float xdpi;
	public float ydpi;
	
	public DisplayMetrics(int width, int height, int dpi)
	{
		widthPixels = width;						
		heightPixels = height;
		densityDpi = dpi;
		xdpi = dpi;				
		ydpi = dpi;			
	}	
}
