package android.media;

import jaco.mp3.player.MP3Player;
import java.net.URL;

public class MediaPlayer 
{
	URL url;
	MP3Player mp3player;

	public MediaPlayer()
	{
		url = null;
		mp3player = null;
	}

	public void setDataSource (URL fd, long offset, long length)
	{
		url = fd;
	}
	
	public void prepare()
	{
   		mp3player = new MP3Player(url);		
	}
	
	public void setLooping(boolean loop)
	{
		if (mp3player!=null)
		{	
			mp3player.setRepeat(loop);
		}
	}
	
	public void start()
	{
   		mp3player.play();   		
	}
	
	public void release()
	{	
		url = null;
		if (mp3player!=null)
		{	mp3player.stop();
			mp3player = null;
		}
	}	
	
}
