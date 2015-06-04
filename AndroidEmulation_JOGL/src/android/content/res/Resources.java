package android.content.res;

import android.util.DisplayMetrics;

public class Resources 
{
	DisplayMetrics displaymetrics;
	
	public Resources()
	{
		displaymetrics = new DisplayMetrics();
	}

	public DisplayMetrics getDisplayMetrics()
	{
		return displaymetrics;
	}
}
