package android.os;

public class Handler 
{
	public Handler()
	{
	}
	
	public final boolean post(Runnable r)
	{
		r.run();
		return true;
	}
}
