package grafl.sy;

import grafl.sy.game.Game;

import android.app.Activity;
import android.content.Context;
import android.media.AudioManager;
import android.os.Bundle;
import android.os.Handler;
import android.view.KeyEvent;

public class FullscreenActivity extends Activity {

    private Game game;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setVolumeControlStream(AudioManager.STREAM_MUSIC);
        game = new Game(this, new Runnable() { public void run() { finish(); } } , 
        			new Handler(), getPreferences(Context.MODE_PRIVATE));
        setContentView(game);        
    }

    
    @Override
    protected void onResume() {
        super.onResume();
        game.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        game.onPause();
    }
    
    @Override
	public boolean onKeyUp(int keyCode, KeyEvent event) {
		return game.onKeyUp(keyCode,event) || super.onKeyUp(keyCode,event);
    }
    @Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		return game.onKeyDown(keyCode,event) || super.onKeyDown(keyCode, event); 
    }

}