package grafl.util;

public class SimpleProfiler 
{
	final String name;
	final int loginterval;

	int runcounter;	
	boolean started;
	
	long startofcurrentstep;	
	long summedsteptimes[];
	long maxsteptimes[];
	 
	
	public SimpleProfiler (String name, int loginterval)
	{
		this.name = name;
		this.loginterval = loginterval; 

		this.runcounter = 0;
		this.summedsteptimes = new long[100];
		this.maxsteptimes = new long[100];
		
		System.out.println("SimpleProfiler "+name+" logs every "+loginterval+" calls");
	}

	public void start()
	{			
		if (runcounter>loginterval)
		{	long total = 0;
			for (int i=0; i<summedsteptimes.length; i++)
			{	total += summedsteptimes[i];
			}
			System.out.println(name+" after "+loginterval+" runs: avg "+(total/loginterval)+" ns");
			for (int i=0; i<summedsteptimes.length; i++)
			{	long t = summedsteptimes[i];
				if (t>0)
				{	System.out.println("Step "+i+": avg "+(t/loginterval)+" ns"+ " max "+maxsteptimes[i]+" ns");
					total += t;
				}	
			}
				
			for (int i=0; i<summedsteptimes.length; i++)
			{	summedsteptimes[i] = 0;
				maxsteptimes[i] = 0;
			}
			runcounter=1;		
		}
		else
		{	runcounter++;
		}	
		
		started = true;
		startofcurrentstep = System.nanoTime();
	}
	
	public void done(int step)
	{
		if (started)
		{	long now = System.nanoTime();
			long interval = now - startofcurrentstep;
			summedsteptimes[step] += interval;
			if (interval>maxsteptimes[step]) 
			{	maxsteptimes[step] = interval;
			}
			startofcurrentstep = now;
		}
//		else
//		{	System.out.println("step outside started frame");	
//		}
	}
	
	public void stop()
	{
		started=false;
	}
	
	
		
	 

}
