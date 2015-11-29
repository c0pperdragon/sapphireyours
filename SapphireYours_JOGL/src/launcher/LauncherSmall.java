package launcher;

import android.util.DisplayMetrics;

public class LauncherSmall
{
	public static void main(String[] args)
	{	
		MainThread t = new MainThread();
		
		t.setWindowSize(450,854);
		t.setDisplayMetrics(new DisplayMetrics(450,854, 250));
				
		t.start();
	}    

}
