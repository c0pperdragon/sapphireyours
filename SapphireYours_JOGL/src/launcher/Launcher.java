package launcher;

import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.Window;

import javax.imageio.ImageIO;

import android.content.ContextImpl;
import android.content.SharedPreferencesImpl;
import android.os.Handler;
import grafl.sy.game.Game;

public class Launcher 
{	
	public static void main(String[] args)
	{	
		Thread t = new MainThread();		
		t.start();
	}    
}

class MainThread extends Thread
{
	public MainThread()
	{
		super(null,null,"GameThread",1000000);			
	}

    public void run()
   	{	   		
   		SplashScreen splash = new SplashScreen();
   	   	
   		Game g = new Game(new ContextImpl("SapphireYours"), 
   		                  new Runnable(){ public void run(){System.exit(0);}},
   		                  new Handler(), 
   		                  new SharedPreferencesImpl("SapphireYours") );
   	    g.startWithJOGL("Sapphire Yours 4.0");

		splash.dispose();

		g.stopMusic();		   	    
   	    g.runWithJOGL();
    }
}


class SplashScreen extends Window
{

	private static final long serialVersionUID = 1L;
	Image image;
	
	public SplashScreen()
	{
		super(null);		
		
		image = null;
		try
		{	
			image = ImageIO.read(getClass().getResource("/gfx/splash.png"));
					
			int w = image.getWidth(null);
			int h = image.getHeight(null);	
			Dimension d = Toolkit.getDefaultToolkit().getScreenSize();		

			setSize(w,h);			
			setLocation((d.width-w)/2, (d.height-h)/2);
		} catch (Exception e) {}		
				
		
		setVisible(true);
		toFront();
	}
	
	public void paint(Graphics g)
	{
		if (image!=null)
		{	g.drawImage(image, 0,0, null);
		}
	} 


}

