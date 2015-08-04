package grafl.sy.renderer;

import java.util.Vector;

public class FreespaceManager 
{
	int totalarea;
	Vector<int[]> spaces;		// contains [x,y,w,h]
	
	public FreespaceManager(int width, int height)
	{
		totalarea = width*height;
		spaces = new Vector<int[]>();
		spaces.addElement (new int[]{0,0,width, height});
	}
		
	public int[] allocateArea(int w, int h) 
	{	
		int[] bestarea=null;
		int bestwaste=Integer.MAX_VALUE;
		
		// find a space that is big enough for the request, but will lead to smallest waste
		for (int i=0; i<spaces.size(); i++)
		{	int[] test = spaces.elementAt(i);
			if (w>test[2] || h>test[3])
			{	continue;		// does not fit
			}
			int waste = Math.min((test[2]-w)*h, (test[3]-h)*w);
			if (waste<bestwaste)
			{	bestarea = test;
				waste = bestwaste;
			}
		}
		// when nothing could be found, this is an error condition
		if (bestarea==null)
		{	throw new IllegalArgumentException("Can not allocate space of size "+w+","+h);
		}
		
		// allocate the description for the newly allocated area
		int[] allocated = new int[]{bestarea[0],bestarea[1],w,h};
		
		// the waste is smaller when cutting along a horizontal line 
		if ((bestarea[2]-w)*h < (bestarea[3]-h)*w)
		{	// have produced some waste which will nevertheless be keep
			if (w<bestarea[2])	
			{	int[] wastearea = new int[]{ bestarea[0]+w, bestarea[1], bestarea[2]-w, h};
//				System.out.println ("Produced waste area: "+area2string(wastearea));
				spaces.addElement(wastearea);
			}
			// reduce size of the best area for further use
//			System.out.print("Cut away "+h+" from top side of "+area2string(bestarea));			
			bestarea[1] += h;
			bestarea[3] -= h;
//			System.out.println(" -> "+area2string(bestarea));
		}
		// the waste is smaller when cutting along a vertical line 
		else
		{	
			// have produced some waste which will nevertheless be keep
			if (h<bestarea[3])	
			{	int[] wastearea = new int[]{ bestarea[0], bestarea[1]+h, w, bestarea[3]-h};
//				System.out.println ("Produced waste area: "+area2string(wastearea));
				spaces.addElement(wastearea);
			}
			// reduce size of the best area for further use
//			System.out.print("Cut away "+w+" from left side of "+area2string(bestarea));			
			bestarea[0] += w;
			bestarea[2] -= w;		
//			System.out.println(" -> "+area2string(bestarea));
		}
		   		
		return allocated;
	}
		
	public float calculateUsage()
	{
		int unused=0;
		for (int i=0; i<spaces.size(); i++)
		{	int[] space = spaces.elementAt(i);
			unused += space[2]*space[3];
		}
		return (totalarea-unused)/(float)totalarea;
	}
	
	static String area2string(int[] area)
	{	
		return "["+area[0]+","+area[1]+","+area[2]+","+area[3]+"]";
	}

}

