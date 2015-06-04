import android.content.ContextImpl;
import android.content.SharedPreferencesImpl;
import android.opengl.GLSurfaceView;
import android.os.Handler;
import grafl.sy.game.Game;

public class Launcher {	

    public static void main(String[] s)
   	{	   		
   		GameCloser c = new GameCloser();
   		Game g = new Game(new ContextImpl(), c, new Handler(), new SharedPreferencesImpl("SapphireYours") );
   		c.setGame(g);
   	    g.runWithJOGL("Sapphire Yours 4.0");
    }
    
}

	class GameCloser implements Runnable
	{
		boolean triggeredthread;
		Game game;
		public GameCloser()
		{
			triggeredthread=false;
			game = null;
		}
		public void setGame(Game game)
		{	
			this.game = game;
		}
		public void run()
		{
			if (triggeredthread)
			{
				game.setRenderMode(GLSurfaceView.RENDERMODE_WHEN_DIRTY);
				try { Thread.sleep(200); } catch (InterruptedException e) {}
				System.exit(0);
			}
			else
			{
				triggeredthread = true;
				new Thread(this).start();
			}
		}
	}
