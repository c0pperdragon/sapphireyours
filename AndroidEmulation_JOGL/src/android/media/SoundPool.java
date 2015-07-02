package android.media;

import java.util.Vector;

import android.content.res.AssetFileDescriptor;

import kuusisto.tinysound.TinySound;
import kuusisto.tinysound.Sound;

public class SoundPool 
{
	Vector<Sound> sounds;

	public SoundPool(int maxStreams, int streamType, int srcQuality)
	{
		TinySound.init();
	
		sounds = new Vector<Sound>();
	}
	
	public int load(AssetFileDescriptor afd, int priority)
	{
		Sound s = TinySound.loadSound(afd.getURL());
		if (s==null)
		{	return -1;
		}
		else
		{	sounds.addElement(s);
			return sounds.size()-1;
		}
	}

	public final int play(int soundID, float leftVolume, float rightVolume, int priority, int loop, float rate)
	{	
		float vol = (rightVolume+leftVolume)/2.0f; 
		if (vol<=0)
		{	return 1;	// succeeded in not playing anything
		}
		
		if (soundID>=0 && soundID<sounds.size())
		{
			sounds.elementAt(soundID).play(vol);
			return 1;		
		}
		
		return 0;
	}	
}

/*
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Clip; 
import javax.sound.sampled.FloatControl;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.UnsupportedAudioFileException;


public class SoundPool 
{
	Vector<Clip[]> clips;

	public SoundPool(int maxStreams, int streamType, int srcQuality)
	{
		clips = new Vector<Clip[]>();
	}
	
	public int load(AssetFileDescriptor afd, int priority)
	{   
     	try 
     	{	Clip[] clip = new Clip[4];
     		// create multiple clips for the same sound to be able to play them interleaved
     		for (int i=0; i<clip.length; i++)
     		{	// Open an audio input stream.
	        	AudioInputStream audioIn = AudioSystem.getAudioInputStream(afd.getURL());
	    	    // Get a sound clip resource.
    	    	clip[i] = AudioSystem.getClip();
	        	// Open audio clip and load samples from the audio input stream.
         		clip[i].open(audioIn);
     		}
         	clips.addElement(clip);
         	return clips.size()-1;
      	} 
      	catch (UnsupportedAudioFileException e) 
      	{	e.printStackTrace();
      	}
      	catch (IOException e) 
      	{	e.printStackTrace();
      	}
      	catch (LineUnavailableException e) 
      	{	e.printStackTrace();
      	}
      	return -1;
	}

	public final int play(int soundID, float leftVolume, float rightVolume, int priority, int loop, float rate)
	{
		float vol = (rightVolume+leftVolume)/2.0f; 
		if (vol<=0)
		{	return 1;	// succeeded in not playing anything
		}
		
		if (soundID>=0 && soundID<clips.size())
		{
			Clip[] clip = clips.elementAt(soundID);
			
			// use the instance 0 now and move to end of list
			Clip oldest = clip[0];
			System.arraycopy (clip,1, clip,0, clip.length-1);
			clip[clip.length-1] = oldest;
			
			// stop if still running
			if (oldest.isRunning())
         	{   oldest.stop();
         	}
			
			// try to set volume
			try 
			{	FloatControl gainControl=(FloatControl)oldest.getControl(FloatControl.Type.MASTER_GAIN);
				gainControl.setValue( ((float)Math.log10(vol))*20.0f);
			}
			catch (IllegalArgumentException e)
			{	System.out.println("can not set volume!");	
			}

         	oldest.setFramePosition(0); // rewind to the beginning         	
         	oldest.start();     // Start playing
         	
         	return 1;  // successs
		}      
		return 0;
   	}
			
	
}
*/
