package android.os;

public class SystemClock 
{
	static boolean init = false;
	static long starttime = 0;
	
	public static long uptimeMillis()
	{
		if (!init)
		{	starttime = System.nanoTime();
			init = true;
			return 0;
		}
		return (System.nanoTime() - starttime) / 1000000;
	}
}
