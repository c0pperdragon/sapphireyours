package grafl.sy.sound;

import grafl.sy.logic.Logic;

import java.nio.IntBuffer;

import android.content.Context;
import android.media.AudioManager;
import android.media.SoundPool;
import android.os.Handler;

public class LevelSoundPlayer implements Runnable 
{
	private final Handler asyncHandler;	
	private final SoundPool pool;
	private IntBuffer playlist;
	int[] tmp_countervalues;
	
	public final Sound sound_acid;
	public final Sound sound_bagconv;
	public final Sound sound_bagfall;
	public final Sound sound_bagopen;
//	public final Sound sound_bagroll;
//	public final Sound sound_blastvip;
//	public final Sound sound_bombroll;
	public final Sound sound_bombtick;
	public final Sound sound_bug;
//	public final Sound sound_clock;
	public final Sound sound_cushion;
	public final Sound sound_die;
	public final Sound sound_dig;
	public final Sound sound_drop;
	public final Sound sound_elevator;
	public final Sound sound_emldconv;
	public final Sound sound_emldfall;
	public final Sound sound_emldroll;
	public final Sound sound_exitclos;
	public final Sound sound_exitopen;
	public final Sound sound_explode;
	public final Sound sound_grabbomb;
	public final Sound sound_grabemld;
	public final Sound sound_grabkey;
	public final Sound sound_grabruby;
	public final Sound sound_grabsphr;
	public final Sound sound_laser;
	public final Sound sound_lorry;
	public final Sound sound_lose;
	public final Sound sound_pcushion;
	public final Sound sound_push;
	public final Sound sound_pushbag;
	public final Sound sound_pushbomb;
	public final Sound sound_pushbox;
	public final Sound sound_robot;
	public final Sound sound_rubyconv;	
	public final Sound sound_rubyfall;
	public final Sound sound_rubyroll;
	public final Sound sound_setbomb;
	public final Sound sound_sphrbrk;
	public final Sound sound_sphrconv;
	public final Sound sound_sphrfall;
	public final Sound sound_sphrroll;
	public final Sound sound_stnconv;
	public final Sound sound_stnfall;
	public final Sound sound_stnhard;
	public final Sound sound_stnroll;
	public final Sound sound_swamp;
	public final Sound sound_usedoor;
//	public final Sound sound_wheel;
	public final Sound sound_win;
	public final Sound sound_yamyam;

	private final static int volumetable[] = {
	  	100, 
	  	100, 90, 80, 70, 60, 55, 50, 45, 40, 35, 
	 	30,  27, 25, 22, 20, 18, 16, 14, 12, 11, 
		10, 9, 8, 7, 6, 5, 3, 2, 1, 0, 
	 };

	public LevelSoundPlayer(Context context, Handler asyncHandler)
	{
		this.asyncHandler = asyncHandler;		
		pool = new SoundPool(5, AudioManager.STREAM_MUSIC, 0);	
		playlist = IntBuffer.allocate(300); 	
		tmp_countervalues = new int[16];
		
		sound_acid = load(context, "acid", 1); 		
	    sound_bagconv = load(context, "bagconv", 1);
	    sound_bagfall = load(context, "bagfall", 1);
	    sound_bagopen = load(context, "bagopen", 1);
//	    sound_bagroll = load(context, "bagroll", 1);
//	    sound_bombroll = load(context, "bombroll", 1);
	    sound_bombtick = load(context, "bombtick", 1);
	    sound_bug = load(context, "bug", 1);
	    sound_cushion = load(context, "cushion", 1);
	    sound_die = load(context, "die", 1);
	    sound_dig = load(context, "dig", 1);
	    sound_drop = load(context, "drop", 1);
	    sound_elevator = load(context, "elevator", 1);
	    sound_emldconv = load(context, "emldconv", 1);
	    sound_emldfall = load(context, "emldfall", 1);
	    sound_emldroll = load(context, "emldroll", 1);
	    sound_exitclos = load(context, "exitclos", 1);
	    sound_exitopen = load(context, "exitopen", 1);
	    sound_explode = load(context, "explode", 1);
	    sound_grabbomb = load(context, "grabbomb", 1);
	    sound_grabemld = load(context, "grabemld", 1);
	    sound_grabkey = load(context, "grabkey", 1);
	    sound_grabruby = load(context, "grabruby", 1);
	    sound_grabsphr = load(context, "grabsphr", 1);
	    sound_laser = load(context, "laser", 1);
	    sound_lorry = load(context, "lorry", 1);
	    sound_lose = load(context, "lose", 1);
	    sound_pcushion = load(context, "pcushion", 1);
	    sound_push = load(context, "push", 1);
	    sound_pushbag = load(context, "pushbag", 1);
	    sound_pushbomb = load(context, "pushbomb", 1);
	    sound_pushbox = load(context, "pushbox", 1);
	    sound_robot = load(context, "robot", 1);
	    sound_rubyconv = load(context, "rubyconv", 1);
	    sound_rubyfall = load(context, "rubyfall", 1);
	    sound_rubyroll = load(context, "rubyroll", 1);
	    sound_setbomb = load(context, "setbomb", 1);
	    sound_sphrbrk = load(context, "sphrbrk", 1);
	    sound_sphrfall = load(context, "sphrfall", 1);
	    sound_sphrconv = load(context, "sphrconv", 1);
	    sound_sphrroll = load(context, "sphrroll", 1);
	    sound_stnconv = load(context, "stnconv", 1);
	    sound_stnfall = load(context, "stnfall", 1);
	    sound_stnhard = load(context, "stnhard", 1);
	    sound_stnroll = load(context, "stnroll", 1);
	    sound_swamp = load(context, "swamp", 1);
	    sound_usedoor = load(context, "usedoor", 1);
	    sound_win = load(context, "win", 1);
	    sound_yamyam = load(context, "yamyam", 1);
	}
	
	public Sound load(Context context, String filename, int priority)
	{
		int id = -1;
		try 
		{	id = pool.load (context.getAssets().openFd ("sound/"+filename+".wav"), 1);
		} 
		catch (Exception e)
		{}

		return new Sound(id,priority); 	
	}
	
	/** 
	 * Directly play one single sound. May be used in menus or lists.
	 */
	public void play(Sound s)
	{
		// lock against reading by the UI thread
		synchronized (this)
		{
			s.addVolume(100);
		}
		asyncHandler.post(this);
	}
	
	/** 
	 * Must be called in the UI thread (via the asyncHandler) to not block the render thread for too long
	 * To keep lock time short, the necessary data is transfered from the Sound objects in a burst 
	 * and will then be played individually.
	 */
	
	public void run()
	{		
		playlist.clear();
		
		// lock against modifications from the game thread
		synchronized (this)
		{	// transfer all sounds that should be played to the list
	            sound_acid.toPlayList(playlist);
	            sound_bagconv.toPlayList(playlist);
	            sound_bagfall.toPlayList(playlist);
	            sound_bagopen.toPlayList(playlist);
//	            sound_bagroll.toPlayList(playlist);
//	            sound_bombroll.toPlayList(playlist);
	            sound_bombtick.toPlayList(playlist);
	            sound_bug.toPlayList(playlist);
	            sound_cushion.toPlayList(playlist);
	            sound_die.toPlayList(playlist);
	            sound_dig.toPlayList(playlist);
	            sound_drop.toPlayList(playlist);
	            sound_elevator.toPlayList(playlist);
	            sound_emldfall.toPlayList(playlist);
	            sound_emldroll.toPlayList(playlist);
	            sound_emldconv.toPlayList(playlist);
	            sound_exitclos.toPlayList(playlist);
	            sound_exitopen.toPlayList(playlist);
	            sound_explode.toPlayList(playlist);
	            sound_grabbomb.toPlayList(playlist);
	            sound_grabemld.toPlayList(playlist);
	            sound_grabkey.toPlayList(playlist);
	            sound_grabruby.toPlayList(playlist);
	            sound_grabsphr.toPlayList(playlist);
	            sound_laser.toPlayList(playlist);
	            sound_lorry.toPlayList(playlist);
	            sound_lose.toPlayList(playlist);
	            sound_pcushion.toPlayList(playlist);
	            sound_push.toPlayList(playlist);
	            sound_pushbag.toPlayList(playlist);
	            sound_pushbomb.toPlayList(playlist);
	            sound_pushbox.toPlayList(playlist);
	            sound_robot.toPlayList(playlist);
	            sound_rubyconv.toPlayList(playlist);
	            sound_rubyfall.toPlayList(playlist);
	            sound_rubyroll.toPlayList(playlist);
	            sound_setbomb.toPlayList(playlist);
	            sound_sphrbrk.toPlayList(playlist);
	            sound_sphrconv.toPlayList(playlist);
	            sound_sphrfall.toPlayList(playlist);
	            sound_sphrroll.toPlayList(playlist);
	            sound_stnconv.toPlayList(playlist);
	            sound_stnfall.toPlayList(playlist);
	            sound_stnhard.toPlayList(playlist);
	            sound_stnroll.toPlayList(playlist);
	            sound_swamp.toPlayList(playlist);
	            sound_usedoor.toPlayList(playlist);
	            sound_win.toPlayList(playlist);
	            sound_yamyam.toPlayList(playlist);
		}	

		playlist.flip();
		while (playlist.remaining()>0)
		{	int id = playlist.get();
			int priority = playlist.get();
			int volume = playlist.get();
			pool.play(id, volume/200.0f, volume/200.0f, priority*volume, 0, 1.0f);
		}	
	}
		
	
	/**
	 * Decodes everything that has happened in the logic in this step and will create sounds as 
	 * needed.
	 * Return: true, if a sound was played that should lead to a screen shake effect
	 */
	 	
	public boolean playStep(Logic logic)
	{
		boolean shake = false;
		
		// initialize the temporary counters with the values at end of step
		for (int i=0; i<tmp_countervalues.length; i++)
		{	tmp_countervalues[i] = logic.getCounter(i);
		}
	
		// must be locked against reading/modifications from the play thread
		synchronized (this)
		{	// scan in reverse to be possible to keep track of the counter values
			for (int idx=logic.getAnimationBufferSize()-1; idx>=0; idx--)
    		{	int trn = logic.getAnimation(idx);
				int vol = determineSoundEffectVolume(logic,(trn>>22) & 0x03f,(trn>>16) & 0x03f);    			  			
    			switch (trn & Logic.TRN_MASK)
    			{	case Logic.TRN_TRANSFORM:
    				case Logic.TRN_CHANGESTATE: 
    				{	//int mapindex = (trn>>16) & 0x0fff;
    					byte oldpiece = (byte)((trn>>8)&0xff);
    					byte newpiece = (byte)(trn & 0xff);    					
    					Sound sound = determineTransformSound(oldpiece, newpiece);
    					if (sound!=null)
    					{	sound.addVolume(vol);
    						if (sound==sound_explode && vol>=70)
    						{	shake = true;
    						}
    					}
    					break;
    				}	
    				case Logic.TRN_MOVEDOWN:
    					createSoundForMoveTransaction(trn, 0,1, vol);
    					break;
    				case Logic.TRN_MOVEUP:
    					createSoundForMoveTransaction(trn, 0,-1, vol);
    					break;
    				case Logic.TRN_MOVELEFT:
    					createSoundForMoveTransaction(trn, -1,0, vol);
    					break;
    				case Logic.TRN_MOVERIGHT:
    					createSoundForMoveTransaction(trn, 1,0, vol);
    					break;
    				case Logic.TRN_MOVEDOWN2:
    					createSoundForMoveTransaction(trn, 0,2, vol);
    					break;
    				case Logic.TRN_MOVEUP2:
    					createSoundForMoveTransaction(trn, 0,-2, vol);
    					break;
    				case Logic.TRN_MOVELEFT2:
    					createSoundForMoveTransaction(trn, -2,0, vol);
    					break;
    				case Logic.TRN_MOVERIGHT2:
    					createSoundForMoveTransaction(trn, 2,0, vol);
    					break;
    				case Logic.TRN_HIGHLIGHT:
    				{	//int mapindex = (trn>>16) & 0x0fff;
	    				byte highlightpiece = (byte)(trn&0xff);
    					Sound sound = determineHighlightSound(highlightpiece);
    					if (sound!=null)
   						{	sound.addVolume(vol);
   						}
   						break;
    				}    
    				case Logic.TRN_COUNTER:
    				{	int index = (trn>>16) & 0x0fff;
						int increment = (int)((short)(trn & 0xffff));
						tmp_countervalues[index] -= increment;
						Sound sound = determineCounterSound(logic,index,increment,tmp_countervalues);
    					if (sound!=null)
   						{	sound.addVolume(100);
   						}
   						break;
    				}
    							
    			}    			
    		}    		
    	}
				
		// let UI thread play the sounds
		asyncHandler.post(this);	
		
		return shake;
	}
	
	private void createSoundForMoveTransaction(int trn, int dx, int dy, int vol)
	{		
    	// int mapindex = (trn>>16) & 0x0fff;
    	byte oldpiece = (byte)((trn>>8)&0xff);
    	byte newpiece = (byte)(trn & 0xff);
    	Sound sound = determineMoveSound(oldpiece, newpiece, dx, dy);
    	if (sound!=null)
    	{	sound.addVolume(vol);
    	}
	}
	
	
	private int determineSoundEffectVolume(Logic logic, int x, int y)
	{
		// determine distance to nearest player
		int mindist = volumetable.length-1;
		for (int i=0; i<logic.getNumberOfPlayers(); i++)
		{	int d = Math.max(Math.abs(logic.getPlayerPositionX(i) - x),Math.abs(logic.getPlayerPositionY(i) - y));
			if (d < mindist)
			{	mindist = d;
			}			
		}
		// pick volume modifier according to distance (vol 100 = maximum volume)
		return volumetable[mindist];
	}
	
	
	// ------------- determine sound effects for various things that happen in the game -----
	
	private Sound determineTransformSound(byte oldpiece, byte newpiece)
	{
		if (Logic.whose_player_piece(oldpiece)>=0 && Logic.whose_player_piece(newpiece)<0)
		{	if (newpiece==Logic.DOOR_CLOSING)		
			{	return sound_exitclos;
			}
			else
			{	return sound_die;
			}
		}		

		switch (oldpiece)
		{	case Logic.EARTH:
				if (newpiece==Logic.AIR || newpiece==Logic.EARTH_UP || newpiece==Logic.EARTH_DOWN || newpiece==Logic.EARTH_LEFT || newpiece==Logic.EARTH_RIGHT)
				{	return sound_dig;
				}
				break;
			case Logic.ROCK_FALLING:
			case Logic.ROCKEMERALD_FALLING:
				if (newpiece==Logic.ROCK || newpiece==Logic.ROCKEMERALD)
				{	return sound_stnfall;
				}
				break;
			case Logic.BAG_FALLING:
				if (newpiece==Logic.BAG)
				{	return sound_bagfall;
				}
				break;
			case Logic.EMERALD_FALLING:
				if (newpiece==Logic.EMERALD)
				{	return sound_emldfall;
				}
				break;
			case Logic.SAPPHIRE_FALLING:
				if (newpiece==Logic.SAPPHIRE)
				{	return sound_sphrfall;
				}
				break;
			case Logic.RUBY_FALLING:
				if (newpiece==Logic.RUBY)
				{	return sound_rubyfall;
				}
				break;
			case Logic.BOMB_FALLING:
				if (newpiece==Logic.BOMB)
				{	return sound_cushion;
				}
				break;
			case Logic.CITRINE_FALLING:
				if (newpiece==Logic.CITRINE)
				{	return sound_cushion;
				}
				break;
				
			case Logic.EMERALD:
				if (newpiece==Logic.AIR)
				{	return sound_grabemld;
				}
				break;
			case Logic.SAPPHIRE:
				if (newpiece==Logic.AIR)
				{	return sound_grabsphr;
				}
				break;
			case Logic.RUBY:
				if (newpiece==Logic.AIR)
				{	return sound_grabruby;
				}
				break;
			case Logic.SAPPHIRE_BREAKING:
				return sound_sphrbrk;
			case Logic.CITRINE_BREAKING:
				return sound_sphrbrk;
				
			case Logic.TIMEBOMB:
			case Logic.TIMEBOMB10:
				if (newpiece==Logic.AIR)
				{	return sound_grabbomb;
				}
				break;
			case Logic.KEYRED:
			case Logic.KEYBLUE:
			case Logic.KEYGREEN:
			case Logic.KEYYELLOW:
				if (newpiece==Logic.AIR)
				{	return sound_grabkey;
				}
				break;
			
			case Logic.BAG:
				if (newpiece==Logic.EMERALD || newpiece==Logic.BAG_OPENING)
				{	return sound_bagopen;
				}				
				break;			
			case Logic.ACTIVEBOMB5:
			case Logic.ACTIVEBOMB4:
			case Logic.ACTIVEBOMB3:
			case Logic.ACTIVEBOMB2:
			case Logic.ACTIVEBOMB1:
			case Logic.ACTIVEBOMB0:
				return sound_bombtick;
			case Logic.DROP:	
				return sound_drop;	
		}	
		
		switch (newpiece)
		{	case Logic.ACID:
				if (oldpiece!=newpiece)
				{	return sound_acid;
				}
				break;
			case Logic.BUGUP:
			case Logic.BUGDOWN:
			case Logic.BUGLEFT:
			case Logic.BUGRIGHT:
			case Logic.BUGUP_FIXED:
			case Logic.BUGDOWN_FIXED:
			case Logic.BUGLEFT_FIXED:
			case Logic.BUGRIGHT_FIXED:
				return sound_bug;
			case Logic.LORRYUP:
			case Logic.LORRYDOWN:
			case Logic.LORRYLEFT:
			case Logic.LORRYRIGHT:
			case Logic.LORRYUP_FIXED:
			case Logic.LORRYDOWN_FIXED:
			case Logic.LORRYLEFT_FIXED:
			case Logic.LORRYRIGHT_FIXED:	
				return sound_lorry;				
			case Logic.SWAMP:
				return sound_swamp;
				
//			case Logic.DOOR_CLOSED:
//				return sound_exitclos;
			case Logic.DOOR_OPENED:
				return sound_exitopen;
				
			case Logic.EXPLODE1_AIR:
			case Logic.EXPLODE1_EMERALD:
			case Logic.EXPLODE1_SAPPHIRE:
			case Logic.EXPLODE1_BAG:
				return sound_explode;
				
			case Logic.ACTIVEBOMB5:
				return sound_setbomb;

			case Logic.ONETIMEDOOR_CLOSED:
				return sound_usedoor;
		}
		
		
		return null;
	}
	private Sound determineMoveSound(byte oldpiece, byte newpiece, int dx, int dy)
	{
		switch (oldpiece)
		{	case Logic.ROCK:
			case Logic.ROCK_FALLING:
				if (dx<0||dx>0)
				{	return newpiece==Logic.ROCK_FALLING ? sound_stnroll : sound_push;
				}
				else if (dy>=2)
				{	return sound_stnconv;
				}
				break;
			case Logic.ROCKEMERALD:
			case Logic.ROCKEMERALD_FALLING:
				if (dx<0||dx>0)
				{	return newpiece==Logic.ROCKEMERALD_FALLING ? sound_stnroll : sound_push;
				}
				else if (dy>=2)
				{	return sound_rubyconv;  // use now for this type of conversion
				}
				break;				
			case Logic.BAG:
			case Logic.BAG_FALLING:
				if (dx<0||dx>0)
				{	return newpiece==Logic.BAG_FALLING ? sound_pushbomb : sound_pushbag;
				}
				break;
			case Logic.EMERALD:
			case Logic.EMERALD_FALLING:
				if (dx<0||dx>0)
				{	return sound_emldroll;
				}
				else if (dy>=2)
				{	return sound_emldconv;
				}
				break;
			case Logic.SAPPHIRE:
			case Logic.SAPPHIRE_FALLING:
				if (dx<0||dx>0)
				{	return sound_sphrroll;
				}
				else if (dy>=2)
				{	return sound_sphrconv;
				}
				break;
			case Logic.RUBY:
			case Logic.RUBY_FALLING:
				if (dx<0||dx>0)
				{	return sound_rubyroll;
				}
				else if (dy>=2)
				{	return sound_rubyconv;
				}
				break;
			case Logic.CITRINE:
			case Logic.CITRINE_FALLING:
				if (dx<0||dx>0)
				{	// return sound_rubyroll;
				}
				break;
			case Logic.BOMB:
				if (dx<0||dx>0)
				{	return newpiece==Logic.BOMB_FALLING ? sound_pushbomb : sound_pushbomb;
				}
				break;
			case Logic.CUSHION:
				return sound_pcushion;
			case Logic.BOX:
				return sound_pushbox;
			case Logic.ELEVATOR:
				return sound_elevator;
				
			case Logic.ROBOT:
				return sound_robot;				
		}
		
		switch (newpiece)
		{	
			case Logic.BUGUP:
			case Logic.BUGDOWN:
			case Logic.BUGLEFT:
			case Logic.BUGRIGHT:
			case Logic.BUGUP_FIXED:
			case Logic.BUGDOWN_FIXED:
			case Logic.BUGLEFT_FIXED:
			case Logic.BUGRIGHT_FIXED:
				return sound_bug;
			case Logic.LORRYUP:
			case Logic.LORRYDOWN:
			case Logic.LORRYLEFT:
			case Logic.LORRYRIGHT:
			case Logic.LORRYUP_FIXED:
			case Logic.LORRYDOWN_FIXED:
			case Logic.LORRYLEFT_FIXED:
			case Logic.LORRYRIGHT_FIXED:	
				return sound_lorry;				
		}
		return null;	
	}
	private Sound determineHighlightSound(byte highlightpiece)
	{
		switch (highlightpiece)
		{	case Logic.LASER_H:
			case Logic.LASER_V:
			case Logic.LASER_BL:
			case Logic.LASER_BR:
			case Logic.LASER_TL:
			case Logic.LASER_TR:
				return sound_laser;
			
			case Logic.DOORRED:
			case Logic.DOORBLUE:
			case Logic.DOORGREEN:
			case Logic.DOORYELLOW:
				return sound_usedoor;
				
			case Logic.CUSHION_BUMPING:
				return sound_cushion;			
		}
		return null;
	}		
	private Sound determineCounterSound(Logic logic, int index, int increment, int[] countersbefore)									
	{
		int cb = countersbefore[index];
		
		if (index==Logic.CTR_EXITED_PLAYER1 || index==Logic.CTR_EXITED_PLAYER2)
		{	if (logic.timeSinceAllExited()==4)
			{	return sound_win;
			}
		}
		
		if (index==Logic.CTR_EMERALDSTOOMUCH && cb>=0 && cb+increment<0)
		{	return sound_lose;
		}
		return null;			
	}			

		
		
	/**
	 * Container for a sound effect of the game. When computing the necessary sounds for a step in the
	 * game, only volume information is updated here, and in a separate step the requested sounds
	 * will be started.
	 */ 
	class Sound
	{
		private int poolid;
		private int priority;		
		private int	volume;
		
		public Sound(int poolid, int priority)
		{	
			this.poolid = poolid;
			this.priority = priority;			
		} 
		
		public void addVolume(int volume)		
		{
			if (volume>this.volume)
			{	this.volume = volume;
			}
		}
		
		void toPlayList(IntBuffer playlist)
		{
			if (volume>0)
			{	playlist.put(poolid);
				playlist.put(priority);
				playlist.put(volume);
				volume = 0;
			}
		}
	}	
}
