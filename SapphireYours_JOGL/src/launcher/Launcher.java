package launcher;


public class Launcher 
{	
	public static void main(String[] args)
	{	
		Thread t = new MainThread();		
		t.start();
	}    
}

