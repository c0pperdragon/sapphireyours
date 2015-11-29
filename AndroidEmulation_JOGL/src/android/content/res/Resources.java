package android.content.res;

import android.util.DisplayMetrics;

public class Resources 
{
	DisplayMetrics displaymetrics;
	
	public Resources(DisplayMetrics displaymetrics)
	{
		this.displaymetrics = displaymetrics;
	}

	public DisplayMetrics getDisplayMetrics()
	{
		return displaymetrics;
	}
}
