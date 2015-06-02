import android.content.ContextImpl;
import android.content.SharedPreferencesImpl;
import android.os.Handler;
import grafl.sy.game.Game;

public class Launcher {
    public static void main(String[] s)
   	{	(new Game(new ContextImpl(), new Runnable() { public void run() { System.exit(0); }}, new Handler(), new SharedPreferencesImpl("SapphireYours") ))
   	       .runWithJOGL("Sapphire Yours 4.0");
    }
    
}
