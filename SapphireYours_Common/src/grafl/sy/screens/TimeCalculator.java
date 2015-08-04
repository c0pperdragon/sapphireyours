package grafl.sy.screens;

import android.os.SystemClock;

public class TimeCalculator 
{
	long lastmeasure;
	
	int numcalls;
	int total;
	
	public TimeCalculator()
	{
		lastmeasure = measure();
		numcalls = 0;
		total = 0;
	}

	public void reset()
	{
		lastmeasure = measure();
	}	

	public int calculateLogicFrames()
	{
		long now = measure();			
		
		//  cap time spans > 300 frames - must be some slow running device or application was paused  
		if (lastmeasure < now-300)
		{	lastmeasure = now-300;
		}

		int frames = (int) (now-lastmeasure);

		// the game is optimized for 60Hz = 10 steps per frame. try to keep it if having only small difference
		if (frames>=8 && frames<=12)
		{	frames = 10;
		}

		total += frames;
		numcalls ++;
//System.out.println("f: "+frames+" avg: "+(total*1.0f/numcalls));
			
		lastmeasure += frames;
		return frames;
	}
	
	
	private static long measure()
	{	
		return (SystemClock.uptimeMillis()*6)/10;        			// 600 logic frames per second
	}

}