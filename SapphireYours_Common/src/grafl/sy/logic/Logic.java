package grafl.sy.logic;

import java.util.Arrays;

public class Logic 
{
	public final static int MAPWIDTH  = 64;
	public final static int MAPHEIGHT = 64; 

	// pieces in static level definition
	public final static byte OUTSIDE           = 0;
	public final static byte MAN1              = '1';
	public final static byte MAN2              = '2';
	public final static byte AIR               = ' ';
	public final static byte EARTH             = '.';
	public final static byte SAND              = 's';
	public final static byte SAND_FULL         = 'S';
	public final static byte SAND_FULLEMERALD  = '}';
	public final static byte WALL              = '#';
	public final static byte ROUNDWALL         = 'A';
	public final static byte GLASSWALL         = ':';
	public final static byte STONEWALL         = '+';
	public final static byte ROUNDSTONEWALL    = '|';
	public final static byte WALLEMERALD       = '&';
	public final static byte EMERALD           = '*';
	public final static byte CITRINE           = ')'; 
	public final static byte SAPPHIRE          = '$';
	public final static byte RUBY              = '(';	
	public final static byte ROCK              = '0';
	public final static byte ROCKEMERALD       = 'e';
	public final static byte BAG               = '@';
	public final static byte BOMB              = 'Q';
	public final static byte DOOR              = 'E';
	public final static byte SWAMP             = '%';
	public final static byte DROP              = '/';
	public final static byte TIMEBOMB          = '!';
	public final static byte ACTIVEBOMB5       = '?';
	public final static byte TIMEBOMB10        = ']';
	public final static byte CONVERTER         = 'c';
	public final static byte BOX               = '[';
	public final static byte CUSHION           = '_';
	public final static byte ELEVATOR          = '{';
//	public final static byte DISPENSER         = 'd';
	public final static byte ACID              = 'a';
	public final static byte KEYBLUE           = 'b';
	public final static byte KEYRED            = 'r';
	public final static byte KEYGREEN          = 'g';
	public final static byte KEYYELLOW         = 'y';
	public final static byte DOORBLUE          = 'B';
	public final static byte DOORRED           = 'R';
	public final static byte DOORGREEN         = 'G';
	public final static byte DOORYELLOW        = 'Y';
	public final static byte ONETIMEDOOR       = '=';
	public final static byte LORRYLEFT         = '5';
	public final static byte LORRYUP           = '6';
	public final static byte LORRYRIGHT        = '7';
	public final static byte LORRYDOWN         = '8';
	public final static byte BUGLEFT           = 'h';
	public final static byte BUGUP             = 'u';
	public final static byte BUGRIGHT          = 'k';
	public final static byte BUGDOWN           = 'j';
	public final static byte YAMYAMLEFT        = '<';
	public final static byte YAMYAMUP          = '^';
	public final static byte YAMYAMRIGHT       = '>';
	public final static byte YAMYAMDOWN        = 'V';
	public final static byte ROBOT             = 'o';
	public final static byte ELEVATOR_TOLEFT   = '3';
	public final static byte ELEVATOR_TORIGHT  = '4';
	public final static byte GUN0              = '\'';
	public final static byte GUN1              = 'C';
	public final static byte GUN2              = 'D';
	public final static byte GUN3              = 'F';
	
	// pieces created during game	
	public final static byte ROCK_FALLING      = -1;
	public final static byte EMERALD_FALLING   = -2;
	public final static byte BOMB_FALLING      = -3;
	public final static byte BAG_FALLING       = -4;	
	public final static byte DOOR_OPENED       = -5;
	public final static byte DOOR_CLOSING      = -6;
	public final static byte DOOR_CLOSED       = -7;
	public final static byte LORRYLEFT_FIXED   = -8;
	public final static byte LORRYUP_FIXED     = -9;
	public final static byte LORRYRIGHT_FIXED  = -10;
	public final static byte LORRYDOWN_FIXED   = -11;
	public final static byte BUGLEFT_FIXED     = -12;
	public final static byte BUGUP_FIXED       = -13;
	public final static byte BUGRIGHT_FIXED    = -14;
	public final static byte BUGDOWN_FIXED     = -15;
	public final static byte BOMB_EXPLODE      = -16;
	public final static byte EXPLODE1_AIR      = -17;
	public final static byte EXPLODE2_AIR      = -18;
	public final static byte EXPLODE3_AIR      = -19;
	public final static byte EXPLODE4_AIR      = -20;
	public final static byte EXPLODE1_EMERALD  = -21;
	public final static byte EXPLODE2_EMERALD  = -22;
	public final static byte EXPLODE3_EMERALD  = -23;
	public final static byte EXPLODE4_EMERALD  = -24;
	public final static byte EXPLODE1_SAPPHIRE = -25;
	public final static byte EXPLODE2_SAPPHIRE = -26;
	public final static byte EXPLODE3_SAPPHIRE = -27;
	public final static byte EXPLODE4_SAPPHIRE = -28;
	public final static byte BIGBOMB_EXPLODE   = -29;
//	public final static byte YAMYAM_EXPLODE    = -30;
	public final static byte BUG_EXPLODE       = -31;
	public final static byte LORRY_EXPLODE     = -32;
	public final static byte ACTIVEBOMB0       = -33;
	public final static byte ACTIVEBOMB1       = -34;
	public final static byte ACTIVEBOMB2       = -35;
	public final static byte ACTIVEBOMB3       = -36;
	public final static byte ACTIVEBOMB4       = -37;
	public final static byte TIMEBOMB_EXPLODE  = -38;
	public final static byte RUBY_FALLING      = -39;
	public final static byte SAPPHIRE_FALLING  = -40;
	public final static byte BAG_OPENING       = -41;
	public final static byte SAPPHIRE_BREAKING = -42;
	public final static byte EXPLODE1_BAG      = -43;
	public final static byte EXPLODE2_BAG      = -44;
	public final static byte EXPLODE3_BAG      = -45;
	public final static byte EXPLODE4_BAG      = -46;
	public final static byte MAN1_LEFT         = -50;
	public final static byte MAN2_LEFT         = -51;
	public final static byte MAN1_RIGHT        = -52;
	public final static byte MAN2_RIGHT        = -53;
	public final static byte MAN1_UP           = -54;
	public final static byte MAN2_UP           = -55;
	public final static byte MAN1_DOWN         = -56;
	public final static byte MAN2_DOWN         = -57;
	public final static byte MAN1_PUSHLEFT     = -58;
	public final static byte MAN2_PUSHLEFT     = -59;
	public final static byte MAN1_PUSHRIGHT    = -60;
	public final static byte MAN2_PUSHRIGHT    = -61;
	public final static byte MAN1_PUSHUP       = -62;
	public final static byte MAN2_PUSHUP       = -63;
	public final static byte MAN1_PUSHDOWN     = -64;
	public final static byte MAN2_PUSHDOWN     = -65;
	public final static byte MAN1_DIGLEFT      = -66;
	public final static byte MAN2_DIGLEFT      = -67;
	public final static byte MAN1_DIGRIGHT     = -68;
	public final static byte MAN2_DIGRIGHT     = -69;
	public final static byte MAN1_DIGUP        = -70;
	public final static byte MAN2_DIGUP        = -71;
	public final static byte MAN1_DIGDOWN      = -72;
	public final static byte MAN2_DIGDOWN      = -73;
	public final static byte EARTH_UP          = -74;
	public final static byte EARTH_DOWN        = -75;
	public final static byte EARTH_LEFT        = -76;
	public final static byte EARTH_RIGHT       = -77;
	public final static byte LASER_H           = -78;
	public final static byte LASER_V           = -79;
	public final static byte LASER_BL          = -80;
	public final static byte LASER_BR          = -81;
	public final static byte LASER_TL          = -83;
	public final static byte LASER_TR          = -82;
	public final static byte CITRINE_FALLING   = -83;
	public final static byte CITRINE_BREAKING  = -84;
	public final static byte ROCKEMERALD_FALLING= -85;
	public final static byte CUSHION_BUMPING   = -86;
	public final static byte SWAMP_RIGHT       = -87;
	public final static byte SWAMP_LEFT        = -88;
	public final static byte SWAMP_UP          = -89;
	public final static byte SWAMP_DOWN        = -90;
	public final static byte EXPLODE1_RUBY     = -91;
	public final static byte EXPLODE2_RUBY     = -92;
	public final static byte EXPLODE3_RUBY     = -93;
	public final static byte EXPLODE4_RUBY     = -94;
//	public final static byte GUN0              = -95;
//	public final static byte GUN1              = -96;
//	public final static byte GUN2              = -97;
//	public final static byte GUN3              = -98;
	public final static byte ONETIMEDOOR_CLOSED= -99;
	public final static byte EXPLODE1_TNT     = -100;
	public final static byte EXPLODE2_TNT     = -101;
	public final static byte EXPLODE3_TNT     = -102;
	public final static byte EXPLODE4_TNT     = -103;
	public final static byte LASER_L          = -104;
	public final static byte LASER_R          = -105;
	public final static byte LASER_U          = -106;
	public final static byte LASER_D          = -107;

	// the counters are references with this index
//	public final static int CTR_NUMPLAYERS              = 0;
	public final static int CTR_MANPOSX1                = 1;
	public final static int CTR_MANPOSX2                = 2;
	public final static int CTR_MANPOSY1                = 3;
	public final static int CTR_MANPOSY2                = 4;
	public final static int CTR_EMERALDSCOLLECTED       = 5;
	public final static int CTR_EXITED_PLAYER1          = 6;
	public final static int CTR_EXITED_PLAYER2          = 7;
	public final static int CTR_KILLED_PLAYER1          = 8;
	public final static int CTR_KILLED_PLAYER2          = 9;
	public final static int CTR_TIMEBOMBS_PLAYER1       = 10;
	public final static int CTR_TIMEBOMBS_PLAYER2       = 11;
	public final static int CTR_KEYS_PLAYER1            = 12;
	public final static int CTR_KEYS_PLAYER2            = 13;
	public final static int CTR_RANDOMSEED              = 14;
	public final static int CTR_EMERALDSTOOMUCH         = 15;
	
	// opcodes for the transaction stack
	public final static int TRN_MASK        = 0xf0000000;
	public final static int TRN_STARTOFTURN = 0x00000000;
	public final static int TRN_COUNTER     = 0x10000000;
	public final static int TRN_TRANSFORM   = 0x20000000;
	public final static int TRN_CHANGESTATE = 0x30000000;
	public final static int TRN_MOVEUP      = 0x40000000;
	public final static int TRN_MOVEDOWN    = 0x50000000;
	public final static int TRN_MOVELEFT    = 0x60000000;
	public final static int TRN_MOVERIGHT   = 0x70000000;
	public final static int TRN_MOVEUP2     = 0x80000000;
	public final static int TRN_MOVEDOWN2   = 0x90000000;
	public final static int TRN_MOVELEFT2   = 0xa0000000;
	public final static int TRN_MOVERIGHT2  = 0xb0000000;
	public final static int TRN_HIGHLIGHT   = 0xc0000000;	

	final byte[] map;                     // fixed-size buffer to hold current map	
	final int[] counters;                 // various counter values / flags that get modified in game
	final DiscardingStack transactions;   // the transaction buffer
	final boolean[] hasmoved;			  // temporary info to prevent double-actions of pieces
	
	Level level;	            // level currently played
	Walk walk;                  // the walk currently running
	int turnsdone;
	int numberofplayers;
	
	int visualrandomseed;   // secondary random generator used for graphics appearances (not logic relevant) 

	public Logic(int transactionhistory)
	{
		map = new byte[MAPWIDTH*MAPHEIGHT];		
		counters = new int[16];
		transactions = new DiscardingStack(transactionhistory);
		hasmoved = new boolean[MAPWIDTH*MAPHEIGHT];
		visualrandomseed = 23452;
	}
	
	public void attach(Level l, Walk w)
	{
		level = l;
		walk = w;
		reset();
	}
	
	
	// moves the game-logic to the desired position.
	// it is guaranteed that the transaction buffer then holds at least all 
	// the modifications that lead to this turn, and the keep-location
	// is set to the first of these transactions
	// (exception: when moving to 0, no transactions are available)
	public void gototurn(int t)
	{
		if (turnsdone<t)
		{	// moving forward is quite simple
			while (turnsdone<t)
			{	computeturn();
			}
		}
		else if (turnsdone>t)
		{	
			if (t==0)
			{	// moving backwards to 0 is just a reset
				reset();
			}
			else
			{	// otherwise try to roll back the turns.
				// this could fail on the way because the 
				// transactions were already discarded
				while (turnsdone>t)
				{	if (!rollback())
					{	// when rollback indeed failed, just reset
						// and start from begin
						reset();
						while (turnsdone<t)
						{	computeturn();
						}
						return;
					}
				}

				// to fix up everything, the keep-counter in the 
				// transaction buffer needs to be set correctly.
				// if this fails, also do a complete reset 
				for (int i = transactions.size()-1; i>=0; i--)
				{	if (transactions.get(i)==TRN_STARTOFTURN)
					{	transactions.mayDiscard(i);
						return;
					}
				}
				// no STARTOFTURN - transaction could be found-
				// must completely recompute everything
				reset();
				while (turnsdone<t)
				{	computeturn();
				}				
			}
		}
	}
	
	// resets the game logic to the initial state as defined in the Level
	private void reset()
	{
		turnsdone = 0;
		numberofplayers = 1;
		
		transactions.clear();		
		
		Arrays.fill(map,(byte)OUTSIDE);
		int dw = level.datawidth;
		for (int y=0; y<level.dataheight; y++)
		{	System.arraycopy(level.mapdata,y*dw, map,y*MAPWIDTH, dw);
		}		
		
		Arrays.fill(counters,0);
//		counters[CTR_NUMPLAYERS] = 1;

		// init start positions of players
		int populatedwidth = level.datawidth;
		for (int y=level.dataheight-1; y>=0; y--)
		{	for (int x=0; x<populatedwidth; x++)
			{	if (is(x,y,MAN1))
				{	counters[CTR_MANPOSX1] = x;
					counters[CTR_MANPOSY1] = y;
				}
				else if (is(x,y,MAN2))
				{	counters[CTR_MANPOSX2] = x;
					counters[CTR_MANPOSY2] = y;	
					numberofplayers = 2;			
				}
			}
		}
						
		counters[CTR_RANDOMSEED] = walk.getRandomSeed() & 0xffff;
		counters[CTR_EMERALDSTOOMUCH] = level.calculateMaximumLoot(true) - level.loot;
	}

	
	// progress the game logic by one turn. everything that happens in the
	// game is also recorded in the transaction buffer.
	// the keep-location is set in the transaction buffer to point at the
	// first transaction which will set to a TRN_STARTOFTURN value.
	private void computeturn()
	{
		// everything from previous step may be deleted if necessary
		transactions.mayDiscard(transactions.size());
		transactions.push (TRN_STARTOFTURN);

		// clear the array of the moved flags
		Arrays.fill(hasmoved,false);
		
		// special handling if man1 moves towards man2:  man2 will move first to allow close proximity while walking
		int num = getNumberOfPlayers();
		if (num==2 && man1_moves_toward_man2())
		{	playermove(1);
			playermove(0);
		}
		else
		{	for (int p=0; p<num; p++)
			{	playermove(p);		
			}
		}
		
		// after the players, all the pieces move
		piecesmove();			
		
		turnsdone++;
	}

	private void piecesmove()
	{
		// for the case a random decision is needed, take the value of the random seed counter
		int randomseed = counters[CTR_RANDOMSEED];
	
		// only pieces inside the populated area can actually move
		int populatedwidth = level.datawidth;
		for (int y=level.dataheight-1; y>=0; y--)
		{	for (int x=0; x<populatedwidth; x++)
			{	
				// when found a flag on a piece while processing, this piece must
				// not be moved in this turn again
				if (hasmoved(x,y))
				{	continue;
				}
				
				// huge decision - tree what to do with each piece 
				switch (piece(x,y))
				{	case DOOR:
						if (counters[CTR_EMERALDSCOLLECTED]>=level.loot)
						{	transform(x,y, DOOR_OPENED);
						}
						break;
					case DOOR_CLOSING:
						transform(x,y, DOOR_CLOSED);						
						break;
					case ROCK:
					{	if (is(x,y+1,AIR))
						{	move(x,y, 0,1, ROCK_FALLING);
						}
						else if (is(x,y+1,SAND))
						{	move(x,y, 0,1, ROCK);
							transform(x,y+1, SAND_FULL);
						}
						else if (is(x,y+1,ACID))
						{	move(x,y,0,1,ROCK);
							transform(x,y+1,ACID);							
						}
						else if (is(x,y+1,CONVERTER) && is(x,y+2,AIR))
						{	move (x,y,0,2,EMERALD_FALLING);
							highlight (x,y+1, CONVERTER);						
						}
						else if (may_roll_to_left(x,y+1, true))
						{	move(x,y, -1,0,ROCK_FALLING);
						}
						else if (may_roll_to_right(x,y+1, true))
						{	move(x,y, 1,0,ROCK_FALLING);
						}
						break;
					}
					case ROCK_FALLING:
					{
						if (!is_hit_by_non_bomb(x,y+1, ROCK_FALLING))
						{	if (is(x,y+1,AIR))
							{	move(x,y,0,1,ROCK_FALLING);
							}
							else if (is(x,y+1,ACID))
							{	move(x,y,0,1,ROCK);		
								transform(x,y+1,ACID);						
							}
							else if (is(x,y+1,CONVERTER) && is(x,y+2,AIR))
							{	move (x,y, 0,2,EMERALD_FALLING);
								highlight (x,y+1, CONVERTER);						
							}
							else if (is(x,y+1,CUSHION))
							{	changestate(x,y,ROCK);
								transform(x,y+1, CUSHION_BUMPING);
								transform(x,y+1, CUSHION);
							}
							else
							{	changestate(x,y,ROCK);
							}
						}
						break;
					}
					case ROCKEMERALD:
					{	if (is(x,y+1,AIR))
						{	move(x,y,0,1,ROCKEMERALD_FALLING);
						}
						else if (is(x,y+1,SAND))
						{	move(x,y,0,1,ROCKEMERALD);
							transform(x,y+1,SAND_FULLEMERALD);
						}
						else if (is(x,y+1,ACID))
						{	move(x,y,0,1,ROCKEMERALD);
							transform(x,y+1,ACID);	
							changecounter(CTR_EMERALDSTOOMUCH,-1);						
						}
						else if (is(x,y+1,CONVERTER) && is(x,y+2,AIR))
						{	move (x,y,0,2,EMERALD_FALLING);
							highlight (x,y+1, CONVERTER);						
						}
						else if (may_roll_to_left(x,y+1, true))
						{	move(x,y,-1,0,ROCKEMERALD_FALLING);
						}
						else if (may_roll_to_right(x,y+1, true))
						{	move(x,y,1,0,ROCKEMERALD_FALLING);
						}
						break;
					}
					case ROCKEMERALD_FALLING:
					{
						if (!is_hit_by_non_bomb(x,y+1, ROCKEMERALD_FALLING))
						{	if (is(x,y+1,AIR))
							{	move(x,y,0,1,ROCKEMERALD_FALLING);
							}
							else if (is(x,y+1,SAND))
							{	move(x,y,0,1,ROCKEMERALD);
								transform(x,y+1,SAND_FULLEMERALD);
							}
							else if (is(x,y+1,ACID))
							{	move(x,y,0,1,ROCKEMERALD);		
								transform(x,y+1,ACID);	
								changecounter(CTR_EMERALDSTOOMUCH,-1);					
							}
							else if (is(x,y+1,CONVERTER) && is(x,y+2,AIR))
							{	move (x,y,0,2,EMERALD_FALLING);
								highlight (x,y+1, CONVERTER);						
							}
							else if (is(x,y+1,CUSHION))
							{	changestate(x,y,ROCKEMERALD);
								transform(x,y+1, CUSHION_BUMPING);
								transform(x,y+1, CUSHION);
							}
							else
							{	changestate(x,y,ROCKEMERALD);
							}
						}
						break;
					}
					case SAND_FULL:
					{	if (is(x,y+1,AIR))
						{	move(x,y,0,1,ROCK_FALLING);
						    transform(x,y,SAND);
						}
						else if (is(x,y+1,ACID))
						{	move(x,y,0,1,ROCK_FALLING);
						    transform(x,y, SAND);
						    transform(x,y+1, ACID);
						}
						else if (is(x,y+1,SAND))
						{	move(x,y,0,1,ROCK);
							transform(x,y, SAND);
							transform(x,y+1, SAND_FULL);						
						}
						break;
					}
					case SAND_FULLEMERALD:
					{	if (is(x,y+1,AIR))
						{	move(x,y,0,1,ROCKEMERALD_FALLING);
						    transform(x,y, SAND);
						}
						else if (is(x,y+1,ACID))
						{	move(x,y,0,1,ROCKEMERALD_FALLING);
						    transform(x,y, SAND);
						    transform(x,y+1, ACID);
						}
						else if (is(x,y+1,SAND))
						{	move(x,y,0,1,ROCKEMERALD);
							transform(x,y, SAND);
							transform(x,y+1, SAND_FULLEMERALD);						
						}
						break;
					}
					case EMERALD:
					{	if (is(x,y+1,AIR))
						{	move(x,y,0,1,EMERALD_FALLING);
						}
						else if (is(x,y+1,ACID))
						{	move(x,y,0,1,EMERALD);
							transform(x,y+1,ACID);							
			       		 	changecounter(CTR_EMERALDSTOOMUCH,-1);
						}
						else if (is(x,y+1,CONVERTER) && is(x,y+2,AIR))
						{	move (x,y,0,2,SAPPHIRE_FALLING);
							highlight (x,y+1, CONVERTER);						
						}
						else if (may_roll_to_left(x,y+1, true))
						{	move(x,y,-1,0,EMERALD_FALLING);
						}
						else if (may_roll_to_right(x,y+1, true))
						{	move(x,y,1,0,EMERALD_FALLING);
						}
						else 
						{
							visualrandomseed = nextrandomseed(visualrandomseed);
							if ((visualrandomseed & 31) == 0)
							{
								highlight(x,y,EMERALD);
							}								
						}
						break;
					}
					case EMERALD_FALLING:
					{
						if (!is_hit_by_non_bomb(x,y+1, EMERALD_FALLING))
						{	if (is(x,y+1,AIR))
							{	move(x,y,0,1,EMERALD_FALLING);
							}
							else if (is(x,y+1,ACID))
							{	move(x,y,0,1,EMERALD);
								transform(x,y+1,ACID);							
				       		 	changecounter(CTR_EMERALDSTOOMUCH,-1);
							}
							else if (is(x,y+1,CONVERTER) && is(x,y+2,AIR))
							{	move (x,y,0,2,SAPPHIRE_FALLING);
								highlight (x,y+1, CONVERTER);						
							}
							else if (is(x,y+1,CUSHION))
							{	changestate(x,y,EMERALD);
								transform(x,y+1, CUSHION_BUMPING);
								transform(x,y+1, CUSHION);
							}
							else
							{	changestate(x,y,EMERALD);
							}
						}
						break;
					}
					case SAPPHIRE:
					{	if (is(x,y+1,AIR))
						{	move(x,y,0,1,SAPPHIRE_FALLING);
						}
						else if (is(x,y+1,ACID))
						{	move(x,y,0,1,SAPPHIRE);
							transform(x,y+1,ACID);						
			       		 	changecounter(CTR_EMERALDSTOOMUCH,-2);
						}
						else if (is(x,y+1,CONVERTER) && is(x,y+2,AIR))
						{	move (x,y,0,2,CITRINE_FALLING);
							highlight (x,y+1, CONVERTER);						
						}
						else if (may_roll_to_left(x,y+1, true))
						{	move(x,y,-1,0,SAPPHIRE_FALLING);
						}
						else if (may_roll_to_right(x,y+1, true))
						{	move(x,y,1,0,SAPPHIRE_FALLING);
						}
						else 
						{
							visualrandomseed = nextrandomseed(visualrandomseed);
							if ((visualrandomseed & 31) == 0)
							{
								highlight(x,y,SAPPHIRE);
							}								
						}
						break;
					}
					case SAPPHIRE_FALLING:
					{	if (!is_hit_by_non_bomb(x,y+1,SAPPHIRE_FALLING))
						{	if (is(x,y+1,AIR))
							{	move(x,y,0,1, SAPPHIRE_FALLING);
							}
							else if (is(x,y+1,ACID))
							{	move(x,y,0,1,SAPPHIRE);
								transform(x,y+1,ACID);							
				       		 	changecounter(CTR_EMERALDSTOOMUCH,-2);
							}
							else if (is(x,y+1,CONVERTER) && is(x,y+2,AIR))
							{	move (x,y,0,2,CITRINE_FALLING);
								highlight (x,y+1, CONVERTER);						
							}
							else if (is(x,y+1,CUSHION))
							{	changestate(x,y,SAPPHIRE);
								transform(x,y+1, CUSHION_BUMPING);
								transform(x,y+1, CUSHION);
							}
							else
							{	changestate(x,y,SAPPHIRE);
							}
						}
						break;
					}
					case SAPPHIRE_BREAKING:
					{	transform(x,y, AIR);
						break;
					}
					case CITRINE:
					{	if (is(x,y+1,AIR))
						{	move(x,y,0,1,CITRINE_FALLING);
						}
						else if (is(x,y+1,ACID))
						{	move(x,y,0,1,CITRINE);
							transform(x,y+1,ACID);							
				       		changecounter(CTR_EMERALDSTOOMUCH,-3);
				       	}
						else if (is(x,y+1,CONVERTER) && is(x,y+2,AIR))
						{	move (x,y, 0,2,CITRINE_FALLING);
							highlight (x,y+1, CONVERTER);						
						}
						else if (may_roll_to_left(x,y+1, true))
						{	move(x,y,-1,0,CITRINE_FALLING);
						}
						else if (may_roll_to_right(x,y+1, true))
						{	move(x,y,1,0,CITRINE_FALLING);
						}
						else 
						{
							visualrandomseed = nextrandomseed(visualrandomseed);
							if ((visualrandomseed & 31) == 0)
							{
								highlight(x,y,CITRINE);
							}								
						}
						break;
					}
					case CITRINE_FALLING:
					{	if (!is_hit_by_non_bomb(x,y+1,CITRINE_FALLING))
						{	if (is(x,y+1,AIR))
							{	move(x,y,0,1,CITRINE_FALLING);
							}
							else if (is(x,y+1,ACID))
							{	move(x,y,0,1,CITRINE);
								transform(x,y+1,ACID);							
				       		 	changecounter(CTR_EMERALDSTOOMUCH,-3);
							}
							else if (is(x,y+1,CONVERTER) && is(x,y+2,AIR))
							{	move (x,y,0,2,CITRINE_FALLING);
								highlight (x,y+1, CONVERTER);						
							}
							else if (is(x,y+1,CUSHION))
							{	changestate(x,y,CITRINE);
								transform(x,y+1, CUSHION_BUMPING);
								transform(x,y+1, CUSHION);
							}
							else
							{	changestate(x,y,CITRINE_BREAKING);
								transform(x,y,AIR);
								changecounter(CTR_EMERALDSTOOMUCH, -4);
							}
						}
						break;
					}
					case CITRINE_BREAKING:
					{	transform(x,y,AIR);
						break;
					}
					case RUBY:
					{	if (is(x,y+1,AIR))
						{	move(x,y,0,1,RUBY_FALLING);
						}
						else if (is(x,y+1,ACID))
						{	move(x,y,0,1,RUBY);
							transform(x,y+1,ACID);							
			       		 	changecounter(CTR_EMERALDSTOOMUCH,-1);
						}
						else if (is(x,y+1,CONVERTER) && is(x,y+2,AIR))
						{	move (x,y,0,2,SAPPHIRE_FALLING);
							highlight (x,y+1,CONVERTER);						
						}
						else if (may_roll_to_left(x,y+1, true))
						{	move(x,y,-1,0,RUBY_FALLING);
						}
						else if (may_roll_to_right(x,y+1, true))
						{	move(x,y,1,0,RUBY_FALLING);
						}
						else 
						{
							visualrandomseed = nextrandomseed(visualrandomseed);
							if ((visualrandomseed & 31) == 0)
							{
								highlight(x,y,RUBY);
							}								
						}
						break;
					}
					case RUBY_FALLING:
					{
						if (!is_hit_by_non_bomb(x,y+1, RUBY_FALLING))
						{	if (is(x,y+1,AIR))
							{	move(x,y,0,1,RUBY_FALLING);
							}
							else if (is(x,y+1,ACID))
							{	move(x,y,0,1,RUBY);
								transform(x,y+1,ACID);							
				       		 	changecounter(CTR_EMERALDSTOOMUCH,-1);
							}
							else if (is(x,y+1,CONVERTER) && is(x,y+2,AIR))
							{	move (x,y,0,2,SAPPHIRE_FALLING);
								highlight (x,y+1, CONVERTER);						
							}
							else if (is(x,y+1,CUSHION))
							{	changestate(x,y,RUBY);
								transform(x,y+1, CUSHION_BUMPING);
								transform(x,y+1, CUSHION);
							}
							else
							{	changestate(x,y,RUBY);
							}
						}
						break;
					}
					case BAG:
					{	if (is(x,y+1,AIR))
						{	move(x,y,0,1,BAG_FALLING);
						}
						else if (is(x,y+1,ACID))
						{	move(x,y,0,1,BAG);
							transform(x,y+1,ACID);							
			       		 	changecounter(CTR_EMERALDSTOOMUCH,-1);
						}
						else if (may_roll_to_left(x,y+1, false))
						{	move(x,y,-1,0,BAG_FALLING);
						}
						else if (may_roll_to_right(x,y+1, false))
						{	move(x,y,1,0,BAG_FALLING);
						}
						break;
					}
					case BAG_FALLING:
					{
						if (!is_hit_by_non_bomb(x,y+1, BAG_FALLING))
						{	if (is(x,y+1,AIR))
							{	move(x,y,0,1,BAG_FALLING);
							}
							else if (is(x,y+1,ACID))
							{	move(x,y,0,1,BAG);
								transform(x,y+1,ACID);	
				       		 	changecounter(CTR_EMERALDSTOOMUCH,-1);
							}
							else if (is(x,y+1,CUSHION))
							{	changestate(x,y, BAG);
								transform(x,y+1, CUSHION_BUMPING);
								transform(x,y+1, CUSHION);
							}
							else
							{	changestate(x,y,BAG);
							}
						}
						break;
					}
					case BAG_OPENING:
					{	transform(x,y, EMERALD);
						break;
					}								
					

					case BOMB:
					{	if (is(x,y+1,AIR))
						{	move(x,y,0,1,BOMB_FALLING);
						}
						else if (is(x,y+1,ACID))
						{	move(x,y,0,1,BOMB);
							transform(x,y+1,ACID);							
						}
						else if (may_roll_to_left(x,y+1, false))
						{	move(x,y,-1,0,BOMB_FALLING);
						}
						else if (may_roll_to_right(x,y+1, false))
						{	move(x,y,1,0,BOMB_FALLING);
						}
						break;
					}
					case BOMB_FALLING:
						if (is(x,y+1,AIR))
						{	move(x,y,0,1,BOMB_FALLING);
						}
						else if (is(x,y+1,ACID))
						{	move(x,y,0,1,BOMB);
							transform(x,y+1,ACID);							
						}
						else if (is(x,y+1,CUSHION))
						{	changestate(x,y,BOMB);
							transform(x,y+1, CUSHION_BUMPING);
							transform(x,y+1, CUSHION);
						}
						else if (is_living(x,y+1))
						{	explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
						}
						else 
						{	transform(x,y, BOMB_EXPLODE);
						}
						break;

					case SWAMP_UP:
					case SWAMP_LEFT:
					case SWAMP_RIGHT:
					case SWAMP_DOWN:
						transform(x,y, SWAMP);
						//$FALL-THROUGH$							
					case SWAMP:						
						if (level.swamprate>0)
						{	randomseed = nextrandomseed(randomseed);
							switch (randomseed % (4*level.getSwampRate()))
							{	case 0:	
									highlight(x,y, SWAMP);
									if (is(x,y-1,EARTH))
									{	highlight(x,y-1, EARTH);
										transform(x,y-1, SWAMP_UP);
									}
									else if(is(x,y-1,AIR))
									{	transform(x,y-1, SWAMP_UP);									
									}
									break;
								case 1:
									highlight(x,y, SWAMP);
									if (is(x-1,y,EARTH))
									{	highlight(x-1,y, EARTH);
										transform(x-1,y, SWAMP_LEFT);
									}
									else if (is(x-1,y,AIR))
									{	transform(x-1,y, SWAMP_LEFT);
										transform(x-1,y, DROP);		
									}
									break;
								case 2:
									highlight(x,y, SWAMP);
									if (is(x+1,y,EARTH))
									{	highlight(x+1,y, EARTH);
										transform(x+1,y, SWAMP_RIGHT);									
									}
									else if (is(x+1,y,AIR))
									{	transform(x+1,y, SWAMP_RIGHT);
										transform(x+1,y, DROP);									
									}
									break;
								case 3:
									highlight(x,y,SWAMP);
									if (is(x,y+1,EARTH))
									{	highlight(x,y+1, EARTH);
										transform(x,y+1, SWAMP_DOWN);																	
									}
									else if (is(x,y+1,AIR))
									{	transform(x,y+1, DROP);									
									}
									break;
								
							}
						}
						break;
						
					case DROP:
						if (!is_hit_by_non_bomb(x,y+1, DROP))
						{	if (is(x,y+1,AIR))
							{	move(x,y,0,1,DROP);
							}
							else if (is(x,y+1,ACID))
							{	move(x,y,0,1,DROP);
								transform(x,y+1,ACID);							
							}
							else
							{	transform(x,y, SWAMP);
							}
						}
						break;						
						
					case LORRYLEFT:
					case LORRYLEFT_FIXED:
					{	if (is_neardestruct_target(x,y) || is_player_piece_at(x-1,y))
						{	explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
						}						
						else if (is(x,y+1,AIR) && is(x,y,LORRYLEFT)) 
						{	transform(x,y,LORRYDOWN_FIXED);
						}
						else if (!is(x-1,y,AIR)) 
						{	transform(x,y, LORRYUP);
						}
						else 
						{	move(x,y,-1,0,LORRYLEFT);
						}
						break;
					}
					case LORRYUP:
					case LORRYUP_FIXED:  
					{	if (is_neardestruct_target(x,y) || is_player_piece_at(x,y-1))
						{	explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
						}						
						else if (is(x-1,y,AIR) && is(x,y,LORRYUP)) 
						{	transform(x,y,LORRYLEFT_FIXED);
						} 
						else if (!is(x,y-1,AIR)) 
						{	transform(x,y,LORRYRIGHT);
						}
						else
						{	move(x,y,0,-1, LORRYUP);
						}
						break;
					}
					case LORRYRIGHT:
					case LORRYRIGHT_FIXED:
					{	if (is_neardestruct_target(x,y) || is_player_piece_at(x+1,y))
						{	explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
						}						
						else if (is(x,y-1,AIR) && is(x,y,LORRYRIGHT)) 
						{	transform(x,y,LORRYUP_FIXED);
						}
						else if (!is(x+1,y,AIR)) 
						{	transform(x,y, LORRYDOWN);
						}
						else 
						{	move(x,y, 1,0, LORRYRIGHT);
						}	
						break;
					}
					case LORRYDOWN:
					case LORRYDOWN_FIXED:
					{	if (is_neardestruct_target(x,y) || is_player_piece_at(x,y+1))
						{	explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
						}						
		                else if (is(x+1,y,AIR) && is(x,y,LORRYDOWN)) 
		                {	transform(x,y, LORRYRIGHT_FIXED);
						}
						else if (!is(x,y+1,AIR)) 
						{	transform(x,y,LORRYLEFT);
						}
						else 						
						{	move(x,y, 0,1,LORRYDOWN);
						}
						break;
					}	
					case BUGLEFT:
					case BUGLEFT_FIXED:
					{	if (is_neardestruct_target(x,y) || is_player_piece_at(x-1,y))
						{	explode3x3(x,y, EXPLODE1_SAPPHIRE, EXPLODE1_EMERALD);
						}						
						else if (is(x,y-1,AIR) && is(x,y,BUGLEFT)) 
						{	transform(x,y, BUGUP_FIXED);
						} 
						else if (!is(x-1,y,AIR)) 
						{ 	transform(x,y,BUGDOWN);
						} 
						else 
						{	move(x,y,-1,0,BUGLEFT);
						}
						break;
					}
					case BUGUP:
					case BUGUP_FIXED:  
					{	if (is_neardestruct_target(x,y) || is_player_piece_at(x,y-1))
						{	explode3x3(x,y, EXPLODE1_SAPPHIRE, EXPLODE1_EMERALD);
						}
						else if (is(x+1,y,AIR) && is(x,y,BUGUP)) 
						{	transform(x,y, BUGRIGHT_FIXED);
						} 
						else if (!is(x,y-1,AIR)) 
						{	transform(x,y, BUGLEFT);
						} 
						else 
						{	move(x,y,0,-1,BUGUP);
						}
						break;
					}
					case BUGRIGHT:
					case BUGRIGHT_FIXED:
					{	if (is_neardestruct_target(x,y) || is_player_piece_at(x+1,y))
						{	explode3x3(x,y, EXPLODE1_SAPPHIRE, EXPLODE1_EMERALD);
						}													
						else if (is(x,y+1,AIR) && is(x,y,BUGRIGHT)) 
						{	transform(x,y, BUGDOWN_FIXED);
						}
						else if (!is(x+1,y,AIR)) 
						{	transform(x,y, BUGUP);
						} 
						else 
						{	move(x,y, 1,0, BUGRIGHT);
						}						
						break;
					}
					case BUGDOWN:
					case BUGDOWN_FIXED:
					{	if (is_neardestruct_target(x,y) || is_player_piece_at(x,y+1))
						{	explode3x3(x,y, EXPLODE1_SAPPHIRE, EXPLODE1_EMERALD);
						}													
						else if (is(x-1,y,AIR) && is(x,y,BUGDOWN)) {
							transform(x,y,BUGLEFT_FIXED);
						} 
						else if (!is(x,y+1,AIR)) {
							transform(x,y, BUGRIGHT);
						} 
						else
						{   move(x,y, 0,1, BUGDOWN);
						}
						break;
					}

					case YAMYAMLEFT:
					case YAMYAMRIGHT:
					case YAMYAMUP:
					case YAMYAMDOWN:
					{	byte ypiece = piece(x,y); 
						int dx = (ypiece==YAMYAMLEFT) ? -1 : (ypiece==YAMYAMRIGHT) ? 1 : 0;
						int dy = (ypiece==YAMYAMUP) ? -1 : (ypiece==YAMYAMDOWN) ? 1 : 0;						
//						if (is_neardestruct_target(x,y)) 
//						{	explode3x3(x,y, EXPLODE1_RUBY, EXPLODE1_EMERALD);
//						}
						if (is_player_piece_at(x+dx,y+dy)) 
						{	move (x,y, dx,dy, ypiece);
							transform (x+dx,y+dy, EXPLODE1_RUBY);
						}
						else if (is(x+dx,y+dy,AIR))
						{	move(x,y, dx,dy, ypiece);
						}
						else if (is(x+dx,y+dy,SAPPHIRE))
						{	transform (x+dx,y+dy, AIR);
							highlight(x,y, ypiece);
		            		changecounter(CTR_EMERALDSTOOMUCH, -2);	
						}
						else
						{	randomseed = nextrandomseed(randomseed);
							switch (randomseed % 4)
							{	case 0:  transform(x,y, YAMYAMLEFT);	break;
								case 1:  transform(x,y, YAMYAMRIGHT);	break;
								case 2:  transform(x,y, YAMYAMUP);	break;
								case 3:  transform(x,y, YAMYAMDOWN);	break;
							}
							highlight(x,y, piece(x,y));						
						}
						break;						
					}
					
					case ROBOT:
					{	//randomseed = nextrandomseed(randomseed);
						//if (randomseed%3==0)	// robot speed can not be changed
						//{
							// determine position of nearest player
							int nearx = 1000;
							int neary = 1000;
							for (int i=0; i<getNumberOfPlayers(); i++)
							{	int px = getCounterAtStartOfTurn(CTR_MANPOSX1+i);		
								int py = getCounterAtStartOfTurn(CTR_MANPOSY1+i);
								if (abs(px-x)+abs(py-y) < abs(nearx-x)+abs(neary-y))
								{	nearx = px;
									neary = py;
								}
							}
							// determine direction to let robot walk
							int dirx = 0;
							int diry = 0;
							int secdirx = 0;
							int secdiry = 0;
							if (abs(neary-y)>abs(nearx-x))
							{	diry = neary<y ? -1 : 1;  // primary direction
								secdirx = nearx<x ? -1 : (nearx>x ? 1 : 0);							
							}
							else if (nearx!=x)
							{	dirx = nearx<x ? -1 : 1;					
								secdiry = neary<y ? -1 : (neary>y ? 1 : 0);		
							}
							if (dirx!=0 || diry!=0)
							{	if (is_player_piece_at(x+dirx,y+diry)) 
								{	move (x,y, dirx,diry, ROBOT);
									transform (x+dirx,y+diry, EXPLODE1_AIR);
								}
								else if (is(x+dirx,y+diry,AIR) && !hasmoved(x+dirx,y+diry))
								{	move (x,y,dirx,diry, ROBOT);
								}
								else if (is(x+secdirx,y+secdiry,AIR) && !hasmoved(x+secdirx,y+secdiry))
								{	move (x,y, secdirx,secdiry, ROBOT);
								}
							}
						//}
						break;
					}	
					case ELEVATOR:
					case ELEVATOR_TOLEFT:
					case ELEVATOR_TORIGHT:
						{	byte lpiece = piece(x,y-1);
							if (lpiece==EMERALD || lpiece==SAPPHIRE || lpiece==CITRINE || lpiece==RUBY || lpiece==BAG || lpiece==ROCK || lpiece==ROCKEMERALD || lpiece==BOMB)
							{  	if (!hasmoved(x,y-1) && is(x,y-2,AIR) )
								{	move (x,y-1, 0,-1, lpiece);
									move (x,y, 0,-1, piece(x,y));
								}
							}
							else if (lpiece==EMERALD_FALLING || lpiece==SAPPHIRE_FALLING || lpiece==CITRINE_FALLING || lpiece==RUBY_FALLING || lpiece==BAG_FALLING 
							|| lpiece==ROCKEMERALD_FALLING || lpiece==BOMB_FALLING || lpiece==BAG_OPENING || lpiece==SAPPHIRE_BREAKING)
							{	// do not move down
							}
							else if (is(x,y+1,AIR))
							{	move (x,y, 0,1, piece(x,y));
							}
						}
						break;
						
					case DOOR_OPENED:
						if (isSolved() && timeSinceAllExited()>1)
						{	transform(x,y,DOOR_CLOSED);
						}
						break;
						
						// various incarnations of the gun that fire in proper sequence
					case GUN0:
						if (turnsdone%4 == 0)
						{	add_laser_beam(x,y-1, 0,-1);    						
							highlight(x,y,GUN0);
						}						
						break;
					case GUN1:
						if (turnsdone%4 == 1)
						{	add_laser_beam(x,y-1, 0,-1);    						
							highlight(x,y,GUN1);
						}
						break;
					case GUN2:
						if (turnsdone%4 == 2)
						{	add_laser_beam(x,y-1, 0,-1);    						
							highlight(x,y,GUN2);
						}
						break;
					case GUN3:
						if (turnsdone%4 == 3)
						{	add_laser_beam(x,y-1, 0,-1);    						
							highlight(x,y,GUN3);
						}
						break;
						
		            case BOMB_EXPLODE:
						explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
						break;
		            case TIMEBOMB_EXPLODE:
						explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
						break;
		            case LORRY_EXPLODE:
						explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
						break;
		            case BUG_EXPLODE:
						explode3x3(x,y, EXPLODE1_SAPPHIRE, EXPLODE1_EMERALD);
						break;
		            case BIGBOMB_EXPLODE:
						explode5x5(x,y, EXPLODE1_TNT, EXPLODE1_TNT, EXPLODE1_AIR);
						break;
						
		            case EXPLODE1_AIR:
		            	transform(x,y, EXPLODE2_AIR);
		            	break;
		            case EXPLODE2_AIR:
		            	transform(x,y, EXPLODE3_AIR);
		            	break;
		            case EXPLODE3_AIR:
		            	transform(x,y, EXPLODE4_AIR);
		            	break;
		            case EXPLODE4_AIR:
		            	transform(x,y, AIR);
		            	break;

		            case EXPLODE1_TNT:
		            	transform(x,y, EXPLODE2_TNT);
		            	break;
		            case EXPLODE2_TNT:
		            	transform(x,y, EXPLODE3_TNT);
		            	break;
		            case EXPLODE3_TNT:
		            	transform(x,y, EXPLODE4_TNT);
		            	break;
		            case EXPLODE4_TNT:
		            	transform(x,y, AIR);
		            	break;
		            	
		            case EXPLODE1_EMERALD:
		            	transform(x,y, EXPLODE2_EMERALD);
		            	break;
		            case EXPLODE2_EMERALD:
		            	transform(x,y, EXPLODE3_EMERALD);
		            	break;
		            case EXPLODE3_EMERALD:
		            	transform(x,y, EXPLODE4_EMERALD);
		            	break;
		            case EXPLODE4_EMERALD:
		            	transform(x,y, EMERALD);
		            	break;

		            case EXPLODE1_SAPPHIRE:
		            	transform(x,y, EXPLODE2_SAPPHIRE);
		            	break;
		            case EXPLODE2_SAPPHIRE:
		            	transform(x,y, EXPLODE3_SAPPHIRE);
		            	break;
		            case EXPLODE3_SAPPHIRE:
		            	transform(x,y, EXPLODE4_SAPPHIRE);
		            	break;
		            case EXPLODE4_SAPPHIRE:
		            	transform(x,y, SAPPHIRE);
		            	break;

		            case EXPLODE1_RUBY:
		            	transform(x,y, EXPLODE2_RUBY);
		            	break;
		            case EXPLODE2_RUBY:
		            	transform(x,y, EXPLODE3_RUBY);
		            	break;
		            case EXPLODE3_RUBY:
		            	transform(x,y, EXPLODE4_RUBY);
		            	break;
		            case EXPLODE4_RUBY:
		            	transform(x,y, RUBY);
		            	break;

		            case EXPLODE1_BAG:
		            	transform(x,y, EXPLODE2_BAG);
		            	break;
		            case EXPLODE2_BAG:
		            	transform(x,y, EXPLODE3_BAG);
		            	break;
		            case EXPLODE3_BAG:
		            	transform(x,y, EXPLODE4_BAG);
		            	break;
		            case EXPLODE4_BAG:
		            	transform(x,y, BAG);
		            	break;

		            case ACTIVEBOMB5:
		            	transform(x,y, ACTIVEBOMB4);
		            	break;
		            case ACTIVEBOMB4:
		            	transform(x,y, ACTIVEBOMB3);
		            	break;
		            case ACTIVEBOMB3:
		            	transform(x,y, ACTIVEBOMB2);
		            	break;
		            case ACTIVEBOMB2:
		            	transform(x,y, ACTIVEBOMB1);
		            	break;
		            case ACTIVEBOMB1:
		            	transform(x,y, ACTIVEBOMB0);
		            	break;
		            case ACTIVEBOMB0:
		            	explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
		            	break;
				}			
			}
		}
		
		// if the random seed got modified during the logic, need to store it back to the counters array
		if (randomseed != counters[CTR_RANDOMSEED])
		{	changecounter(CTR_RANDOMSEED, randomseed-counters[CTR_RANDOMSEED]);
		}
	}
	
	private void explode3x3(int x, int y, byte centerdebris, byte outerdebris)
	{
		transform(x,y, centerdebris);
		catch_in_explosion(x-1,y-1, outerdebris, false, 0,0);
		catch_in_explosion(x,y-1, outerdebris, false, 0,-1);
		catch_in_explosion(x+1,y-1, outerdebris, false, 0,0);
		catch_in_explosion(x-1,y, outerdebris, false, -1,0);
		catch_in_explosion(x+1,y, outerdebris, false, 1,0);
		catch_in_explosion(x-1,y+1, outerdebris, false, 0,0);
		catch_in_explosion(x,y+1, outerdebris, false, 0,1);
		catch_in_explosion(x+1,y+1, outerdebris, false, 0,0);
	}
	
	private void explode5x5(int x, int y, byte centerdebris, byte outerdebris, byte rimdebris)
	{
		transform(x,y, centerdebris);
		catch_in_explosion(x-1,y-1, outerdebris, true, 0,0);
		catch_in_explosion(x,y-1, outerdebris, true, 0,-1);
		catch_in_explosion(x+1,y-1, outerdebris, true, 0,0);
		catch_in_explosion(x-1,y, outerdebris, true, 0,-1);
		catch_in_explosion(x+1,y, outerdebris, true, 1,0);
		catch_in_explosion(x-1,y+1, outerdebris, true, 0,0);
		catch_in_explosion(x,y+1, outerdebris, true, 0,1);
		catch_in_explosion(x+1,y+1, outerdebris, true, 0,0);		
		catch_in_explosion(x-1,y-2, rimdebris, false, 0,0);
		catch_in_explosion(x,y-2, rimdebris, false, 0,-1);
		catch_in_explosion(x+1,y-2, rimdebris, false, 0,0);
		catch_in_explosion(x+2,y-1, rimdebris, false, 0,0);
		catch_in_explosion(x+2,y, rimdebris, false, 1,0);
		catch_in_explosion(x+2,y+1, rimdebris, false, 0,0);
		catch_in_explosion(x-2,y-1, rimdebris, false, 0,0);
		catch_in_explosion(x-2,y, rimdebris, false, 0,-1);
		catch_in_explosion(x-2,y+1, rimdebris, false, 0,0);
		catch_in_explosion(x-1,y+2, rimdebris, false, 0,0);
		catch_in_explosion(x,y+2, rimdebris, false, 0,1);
		catch_in_explosion(x+1,y+2, rimdebris, false, 0,0);
	}
	
	private void catch_in_explosion(int x, int y, byte debris, boolean totalexplode, int outwarddirectionx, int outwarddirectiony)
	{
		switch(piece(x,y))
		{	case OUTSIDE: 	 			
	 			can_not_create_debris(debris);
	 			break;		// will not be blasted
			case WALL:
			case ROUNDWALL:
		 	case GLASSWALL:
		 		if (totalexplode)
		 		{	transform(x,y,debris);		// will only be blasted by big explosions
		 		}
		 		else
	 			{	can_not_create_debris(debris);
	 			}
		 		break;
		 	case TIMEBOMB_EXPLODE:
		 	case BOMB_EXPLODE:
		 	case BIGBOMB_EXPLODE:
//		 	case YAMYAM_EXPLODE: 
		 	case BUG_EXPLODE:
		 	case LORRY_EXPLODE:
	 			can_not_create_debris(debris);	 	
		 		break;     // will explode anyway
		 	case BOMB:
		 	case BOMB_FALLING:
	 			can_not_create_debris(debris);
		 		transform(x,y, BOMB_EXPLODE);   // will explode in next turn
            	break;
		 	case TIMEBOMB:
            case ACTIVEBOMB0:
            case ACTIVEBOMB1:
            case ACTIVEBOMB2:
            case ACTIVEBOMB3:
            case ACTIVEBOMB4:
            case ACTIVEBOMB5:	
	 			can_not_create_debris(debris);
            	transform(x,y, TIMEBOMB_EXPLODE);   // will explode in next turn
            	break;
            case TIMEBOMB10:
	 			can_not_create_debris(debris);
            	transform(x,y, BIGBOMB_EXPLODE);  // will explode in next turn
            	break;
            case LORRYLEFT:
            case LORRYLEFT_FIXED:
            case LORRYRIGHT:
            case LORRYRIGHT_FIXED:
            case LORRYUP:
            case LORRYUP_FIXED:
            case LORRYDOWN:
            case LORRYDOWN_FIXED:  
	 			can_not_create_debris(debris);
            	transform(x,y, LORRY_EXPLODE);     // will explode in next turn
            	break;
            case BUGLEFT:
            case BUGLEFT_FIXED:
            case BUGRIGHT:
            case BUGRIGHT_FIXED:
            case BUGUP:
            case BUGUP_FIXED:
            case BUGDOWN:
            case BUGDOWN_FIXED:
	 			can_not_create_debris(debris);
            	transform(x,y, BUG_EXPLODE);		// will explode in next turn
            	break;
            case YAMYAMLEFT:
            case YAMYAMRIGHT:
            case YAMYAMUP:
            case YAMYAMDOWN: 	
	 			can_not_create_debris(debris);
            	transform(x,y, EXPLODE1_RUBY);      // will turn into ruby after explosion
            	break;
            case WALLEMERALD:            
	 			can_not_create_debris(debris);
	 			transform(x,y, EXPLODE1_EMERALD);	 // will turn into emerald after explosion
            	break;
            case ROCKEMERALD: 
	 			can_not_create_debris(debris);
            	transform(x,y, EXPLODE1_EMERALD);  // will turn into emerald after explosion
            	break;
            case SAND_FULLEMERALD:
	 			can_not_create_debris(debris);
	 			transform(x,y, EXPLODE1_EMERALD);	 // will turn into emerald after explosion
				break;            	
            case BOX: 
	 			can_not_create_debris(debris);
            	transform(x,y, EXPLODE1_BAG);       // will turn into bag after explosion
            	break;
            case RUBY:
            case RUBY_FALLING:
            	// add laser beam
            	if (outwarddirectionx!=0 || outwarddirectiony!=0)
            	{	            	
					highlight (x,y, outwarddirectionx>0
					                ? LASER_R
					                : outwarddirectionx<0
					                  ? LASER_L
					                  : (outwarddirectiony<0 ? LASER_U:LASER_D) );
            		add_laser_beam(x+outwarddirectionx,y+outwarddirectiony, outwarddirectionx,outwarddirectiony);            	
            	}
            	if (totalexplode)           // additionally will be destroyed by big explosion
            	{	transform(x,y, debris);
            	}
            	else
            	{	can_not_create_debris(debris);
            	}
            	break;
            case EMERALD:
            case EMERALD_FALLING:
            case BAG:
            case BAG_FALLING:
       		 	transform(x,y, debris);
       		 	changecounter(CTR_EMERALDSTOOMUCH,-1);
       		 	break;
            case SAPPHIRE:
            case SAPPHIRE_FALLING:
       		 	transform(x,y, debris);
       		 	changecounter(CTR_EMERALDSTOOMUCH,-2);
       		 	break;
            case CITRINE:
            case CITRINE_FALLING:
       		 	transform(x,y, debris);
       		 	changecounter(CTR_EMERALDSTOOMUCH,-3);
       		 	break;
       		 	
            case EXPLODE1_EMERALD:
            case EXPLODE2_EMERALD:
            case EXPLODE3_EMERALD:
            case EXPLODE4_EMERALD:
            case EXPLODE1_BAG:
            case EXPLODE2_BAG:
            case EXPLODE3_BAG:
            case EXPLODE4_BAG:
       		 	transform(x,y, debris);
       		 	changecounter(CTR_EMERALDSTOOMUCH,-1);
				break;
            case EXPLODE1_SAPPHIRE:
            case EXPLODE2_SAPPHIRE:
            case EXPLODE3_SAPPHIRE:
            case EXPLODE4_SAPPHIRE:
       		 	transform(x,y, debris);
       		 	changecounter(CTR_EMERALDSTOOMUCH,-2);
				break;
            case EXPLODE1_RUBY:
            case EXPLODE2_RUBY:
            case EXPLODE3_RUBY:
            case EXPLODE4_RUBY:
            	if (totalexplode)           // additionally will be destroyed by big explosion
            	{	transform(x,y, debris);
            		changecounter(CTR_EMERALDSTOOMUCH,-1);
            	}
            	else
            	{	can_not_create_debris(debris);
            	}
				break;
       		 	
            default:
       		 	transform(x,y, debris);
       		 	break;
		 }
	}
	
	private void can_not_create_debris(byte debris)
	{
		switch (debris)
		{	case EXPLODE1_EMERALD:
				changecounter(CTR_EMERALDSTOOMUCH, -1);
				break;	
			case EXPLODE1_SAPPHIRE:
				changecounter(CTR_EMERALDSTOOMUCH, -2);
				break;	
			case EXPLODE1_RUBY:
				changecounter(CTR_EMERALDSTOOMUCH, -1);
				break;	
			case EXPLODE1_BAG:
				changecounter(CTR_EMERALDSTOOMUCH, -1);
				break;	
		}
	}
	
	/**
	 *	Return:  true, if the logic here takes over the falling object (the caller must not touch this object anymore)
	 */ 
	private boolean is_hit_by_non_bomb(int x, int y, byte bywhat)
	{
		switch (piece(x,y))
		{	case LORRYLEFT:
        	case LORRYLEFT_FIXED:
        	case LORRYRIGHT:
        	case LORRYRIGHT_FIXED:
        	case LORRYUP:
        	case LORRYUP_FIXED:
        	case LORRYDOWN:
        	case LORRYDOWN_FIXED:  
        		transform(x,y, LORRY_EXPLODE);
        		return false;
            case BUGLEFT:
            case BUGLEFT_FIXED:
            case BUGRIGHT:
            case BUGRIGHT_FIXED:
            case BUGUP:
            case BUGUP_FIXED:
            case BUGDOWN:
            case BUGDOWN_FIXED:
            	transform(x,y, BUG_EXPLODE);
            	return false;
            case YAMYAMLEFT:
            case YAMYAMRIGHT:
            case YAMYAMUP:
            case YAMYAMDOWN: 	
            	move(x,y-1, 0,1, bywhat);
            	catch_in_explosion(x,y, EXPLODE1_RUBY, false, 0,0);           // yamyams get smashed by any falling object
            	return true;
		 	case BOMB:
		 	case BOMB_FALLING:
            	transform(x,y, BOMB_EXPLODE);
            	return false;
		 	case SAPPHIRE:
		 	case SAPPHIRE_FALLING:
		 		if (bywhat==ROCK_FALLING)      // sapphire gets crushed by a stone
            	{	if (hasmoved(x,y))
            		{	changestate(x,y, SAPPHIRE_BREAKING);
            			changestate(x,y-1, ROCK);  // decelerate rock 
            		} else
            		{	changestate(x,y, SAPPHIRE_BREAKING);
            			transform(x,y, AIR);		
            			move(x,y-1, 0,1, ROCK);  // decelerate rock, but move down anyway
            		}
            		changecounter(CTR_EMERALDSTOOMUCH, -2);	
            		return true;
            	}
            	return false;
		 	case CITRINE:
		 	case CITRINE_FALLING:
		 		if (hasmoved(x,y))
            	{	changestate(x,y, CITRINE_BREAKING);
            	} else
            	{	changestate(x,y, CITRINE_BREAKING);
            		transform(x,y, AIR);	
            	}
           		changecounter(CTR_EMERALDSTOOMUCH, -3);	            	
           		return false;	
            case BAG:
            	if (bywhat==ROCK_FALLING)      // bag gets opened by stone
            	{	if (hasmoved(x,y))
            		{	changestate(x,y, BAG_OPENING);
            		} 
            		else
            		{	changestate(x,y, BAG_OPENING);
        				transform(x,y, EMERALD);
            		}
            		changestate (x,y-1, ROCK);
            		return true;
            	}
            	return false;
            case BAG_FALLING:
				if (bywhat==ROCK_FALLING)		// when a falling rock tries to open a falling bag, this must not happen right now, but 
				                                // the rock keeps falling for an additional turn and tries again
				{	return true;
				}
				return false;
            case ROBOT:
            	move(x,y-1, 0,1, bywhat);
            	catch_in_explosion(x,y, EXPLODE1_AIR, false, 0,0);           // robots get smashed by any falling object
            	return true;
          	default:
          		if (is_player_piece_at(x,y))
			 	{	move(x,y-1, 0,1, bywhat);
			 		catch_in_explosion(x,y, EXPLODE1_AIR, false, 0,0);       // players get smashed by any falling object
			 		return true;
				}
				return false;
		}
            	
	}
	

	private boolean is_neardestruct_target (int x, int y) 
	{
		byte pi = piece(x,y-1);
		int wpp;
		
		// check presence of player/enemies on directly adjacent square
		boolean player0adjacent = false;
		boolean player1adjacent = false;
		if (pi==SWAMP || pi==SWAMP_LEFT || pi==SWAMP_RIGHT || pi==SWAMP_UP || pi==SWAMP_DOWN)
		{	return true;
		}
		if ((wpp=whose_player_piece(pi))>=0)
		{	if (wpp==0) player0adjacent = true;
			else        player1adjacent = true; 
		}
		pi = piece(x,y+1);
		if (pi==SWAMP || pi==SWAMP_LEFT || pi==SWAMP_RIGHT || pi==SWAMP_UP || pi==SWAMP_DOWN)
		{	return true;
		}
		if ((wpp=whose_player_piece(pi))>=0)
		{	if (wpp==0) player0adjacent = true;
			else        player1adjacent = true; 
		}
 		pi = piece(x-1,y);
		if (pi==SWAMP || pi==SWAMP_LEFT || pi==SWAMP_RIGHT || pi==SWAMP_UP || pi==SWAMP_DOWN)
		{	return true;
		}
		if ((wpp=whose_player_piece(pi))>=0)
		{	if (wpp==0) player0adjacent = true;
			else        player1adjacent = true; 
		}
		pi = piece(x+1,y);
		if (pi==SWAMP || pi==SWAMP_LEFT || pi==SWAMP_RIGHT || pi==SWAMP_UP || pi==SWAMP_DOWN)
		{	return true;
		}
		if ((wpp=whose_player_piece(pi))>=0)
		{	if (wpp==0) player0adjacent = true;
			else        player1adjacent = true; 
		}

		// check presence of player on diagonally adjacent square
		boolean player0diagonally = false;
		boolean player1diagonally = false;		
		if ((wpp=whose_player_piece(piece(x-1,y-1)))>=0)
		{	if (wpp==0) player0diagonally = true;
			else        player1diagonally = true; 
		}
		if ((wpp=whose_player_piece(piece(x+1,y-1)))>=0)
		{	if (wpp==0) player0diagonally = true;
			else        player1diagonally = true; 
		}
		if ((wpp=whose_player_piece(piece(x-1,y+1)))>=0)
		{	if (wpp==0) player0diagonally = true;
			else        player1diagonally = true; 
		}
		if ((wpp=whose_player_piece(piece(x+1,y+1)))>=0)
		{	if (wpp==0) player0diagonally = true;
			else        player1diagonally = true; 
		}
		
		// trigger explosion only if player can indeed be reached
		if (player0diagonally || player0adjacent)
		{	// trigger is caused by a player being directly next to monster at begin of turn
			if (is_next_to_origin_position_of_player(x,y,0))
			{	return true;
			}
			// additionally trigger if player was already in reach before turn and is
			// now directly next to monster (player moved deeper in danger zone)
			if (player0adjacent && is_near_origin_position_of_player(x,y,0))
			{	return true;
			}			
		}

		// trigger explosion only if player can indeed be reached
		if (player1diagonally || player1adjacent)
		{	// trigger is caused by a player being directly next to monster at begin of turn
			if (is_next_to_origin_position_of_player(x,y,1))
			{	return true;
			}
			// additionally trigger if player was already in reach before turn and is
			// now directly next to monster (player moved deeper in danger zone)
			if (player1adjacent && is_near_origin_position_of_player(x,y,1))
			{	return true;
			}			
		}
	    return false;
	}
	
	private boolean is_next_to_origin_position_of_player(int x, int y, int playeridx)
	{
		int px = getCounterAtStartOfTurn(CTR_MANPOSX1+playeridx);		
		int py = getCounterAtStartOfTurn(CTR_MANPOSY1+playeridx);
		return Math.abs(px-x) + Math.abs(py-y)==1;
	}
	
	private boolean is_near_origin_position_of_player(int x, int y, int playeridx)
	{
		int px = getCounterAtStartOfTurn(CTR_MANPOSX1+playeridx);		
		int py = getCounterAtStartOfTurn(CTR_MANPOSY1+playeridx);
		return Math.abs(px-x)<=1 && Math.abs(py-y)<=1;
	}
	
	
	private void add_laser_beam (int x, int y, int dx, int dy)
	{
		int startx = x;
		int starty = y;
		int startdx = dx;
		int startdy = dy;
		int length=1000;
		
		while (length>0) 
		{	length--;

			switch (piece(x,y)) 
			{	case EMERALD:
				case EMERALD_FALLING:
					switch (dx+10*dy)
					{	case -10:  					
							dx = -1;
							dy = 0; 
							highlight (x,y, LASER_BL);
							break;
						case 10:  
							dx = 1;
							dy = 0;
							highlight (x,y, LASER_TR);
							break;
						case -1:
							dx = 0;
							dy = 1;
							highlight (x,y, LASER_BR);
							break;
						case 1:
							dx = 0;
							dy = -1;
							highlight (x,y, LASER_TL);	
							break;				
					}
					break;

				case SAPPHIRE:
				case SAPPHIRE_FALLING:
					switch (dx+10*dy)
					{	case -10:  					
							dx = 1;
							dy = 0; 
							highlight (x,y, LASER_BR);
							break;
						case 10:  
							dx = -1;
							dy = 0;
							highlight (x,y, LASER_TL);
							break;
						case -1:
							dx = 0;
							dy = -1;
							highlight (x,y, LASER_TR);
							break;
						case 1:
							dx = 0;
							dy = 1;
							highlight (x,y, LASER_BL);
							break;					
					}
					break;
				
				case CITRINE:
				case CITRINE_FALLING:
					dx = -dx;
					dy = -dy;
					highlight (x,y, dx>0 ? LASER_R 
					                     : dx<0 ? LASER_L
					                            : dy<0 ? LASER_U : LASER_D);
					break;

			case GUN0:
			case GUN1:
			case GUN2:
			case GUN3:
					// lasers go through guns in upward direction (to be able to stack guns)
					if (dy==-1)									
					{	highlight(x,y, piece(x,y));
						highlight (x,y, LASER_V);
					}
					// guns are destroyed if hit in other directions
					else
					{	catch_in_explosion(x,y,EXPLODE1_AIR, false, 0,0);
						return;
					}
					break;
			case AIR:
			case BOMB_EXPLODE:
			case BIGBOMB_EXPLODE:
			case TIMEBOMB_EXPLODE:
			case BUG_EXPLODE:
			case LORRY_EXPLODE:
			case EXPLODE1_AIR: 
			case EXPLODE2_AIR: 
			case EXPLODE3_AIR: 
			case EXPLODE4_AIR: 
			case EXPLODE1_EMERALD: 
			case EXPLODE2_EMERALD: 
			case EXPLODE3_EMERALD: 
			case EXPLODE4_EMERALD: 
			case EXPLODE1_SAPPHIRE: 
			case EXPLODE2_SAPPHIRE: 
			case EXPLODE3_SAPPHIRE: 
			case EXPLODE4_SAPPHIRE: 
			case EXPLODE1_BAG: 
			case EXPLODE2_BAG: 
			case EXPLODE3_BAG: 
			case EXPLODE4_BAG: 
			case RUBY:
			case RUBY_FALLING:
			case GLASSWALL:
				highlight (x,y, dx==0 ? LASER_V : LASER_H);
				break;

			default:
				catch_in_explosion(x,y, EXPLODE1_AIR, false, 0,0);
				highlight (x,y, dx>0 ? LASER_L 
					                 : dx<0 ? LASER_R
					                        : dy<0 ? LASER_D : LASER_U);
				return;
			}

			// at last continues travel
			x+=dx;
			y+=dy;

		 	if (x==startx && y==starty && dx==startdx && dy==startdy)
		 	{	return;		// laser entered a cycle
		 	}		
		}

//		System.out.println ("maximum laser length exeeded");
		return;		
	}
	
	
	private void playermove(int player)
	{
		// determine piece and position of this player
		int x = counters[CTR_MANPOSX1+player];
		int y = counters[CTR_MANPOSY1+player];
		
		// when player has exited or is killed, increase counter to allow gracefull game-end, but do not continue further actions
		if (counters[CTR_EXITED_PLAYER1+player]>0)
		{	changecounter(CTR_EXITED_PLAYER1+player, 1);
			return;		
		}
		if (counters[CTR_KILLED_PLAYER1+player]>0)
		{	changecounter(CTR_KILLED_PLAYER1+player, 1);
			return;
		}
		
		// when there is no longer a man-piece on the expected position, the player must have been killed in previous turn
		if (!is_player_piece_at(x,y))
		{	changecounter(CTR_KILLED_PLAYER1+player, 1);
			return;
		}
				
		// decode the possibilities and the direction
		boolean grab=false;
		boolean setbomb=false;
		int dx = 0;
		int dy = 0;
		byte manpiece = piece(x,y);
		
		int m = walk.getMovement(player, turnsdone);
		switch (m)
		{	case Walk.MOVE_REST:
				// 	revert player piece to the proper neutral state
				manpiece = (byte)(MAN1 + player); // switch (manpiece)
				if (!is(x,y,manpiece))
				{	transform(x,y,manpiece);
				}
				// add blink animation
				else
				{
					visualrandomseed = nextrandomseed(visualrandomseed);
					if ((visualrandomseed & 7) == 0)
					{
						highlight(x,y,manpiece);
					}								
				}
				return;
			case Walk.MOVE_LEFT:  dx = -1; manpiece=(byte)(MAN1_LEFT-player); break;
			case Walk.MOVE_RIGHT: dx = 1;  manpiece=(byte)(MAN1_RIGHT-player); break;
			case Walk.MOVE_UP:    dy = -1; manpiece=(byte)(MAN1_UP-player); break;
			case Walk.MOVE_DOWN:  dy = 1;  manpiece=(byte)(MAN1_DOWN-player); break;
			case Walk.GRAB_LEFT:  dx = -1;  grab = true;  manpiece=(byte)(MAN1_LEFT-player); break;
			case Walk.GRAB_RIGHT: dx = 1;  grab = true; manpiece=(byte)(MAN1_RIGHT-player); break;
			case Walk.GRAB_UP:    dy = -1; grab = true;  manpiece=(byte)(MAN1_UP-player); break;
			case Walk.GRAB_DOWN:  dy = 1;  grab = true;  manpiece=(byte)(MAN1_DOWN-player); break;
			case Walk.BOMB_LEFT:  dx = -1; setbomb = true; manpiece=(byte)(MAN1_LEFT-player); break;
			case Walk.BOMB_RIGHT: dx = 1; setbomb = true; manpiece=(byte)(MAN1_RIGHT-player); break;
			case Walk.BOMB_UP:    dy = -1; setbomb = true; manpiece=(byte)(MAN1_UP-player); break;
			case Walk.BOMB_DOWN:  dy = 1; setbomb = true; manpiece=(byte)(MAN1_DOWN-player); break;
			
//			case Walk.CALL_ASSISTANT:
//				if (player==0 && getNumberOfPlayers()==1)
//				{	int[] p = findPlayer2SpawnPosition(x,y);
//					if (p!=null)
//					{	int px = p[0];
//						int py = p[1];
//						trypickup(1,px,py);
//						if (is(px,py,AIR) || is(px,py,EARTH))
//						{	transform (p[0],p[1], MAN2);
//							changecounter_to(CTR_MANPOSX2, p[0]);
//							changecounter_to(CTR_MANPOSY2, p[1]);
//							changecounter(CTR_NUMPLAYERS,1);
//						}										
//					}					
//				}
//				return;
		}
		// disable bomb setting if not already in possession of a bomb (to prevent picking and placing a bomb in same turn)
		if (counters[CTR_TIMEBOMBS_PLAYER1+player]==0) 
		{	setbomb=false;
		}
		
		// try to grab/dig an object without moving 
		if (grab)
		{	if (is(x+dx,y+dy,EARTH))
			{	manpiece += (MAN1_DIGLEFT - MAN1_LEFT);   // need to show different image when digging
				transform(x+dx,y+dy,AIR);		
			}
			else
			{	trypickup(player, x+dx,y+dy);			
			}
		}
		// leave through exit
		else if (is(x+dx,y+dy,DOOR_OPENED))
		{
			highlight(x+dx,y+dy, DOOR_OPENED);	
			move (x,y, dx,dy, manpiece);
			transform(x+dx,y+dy, DOOR_CLOSING);
			
			changecounter (CTR_MANPOSX1+player, dx);
			changecounter (CTR_MANPOSY1+player, dy);
			changecounter (CTR_EXITED_PLAYER1+player, 1);
			
			// optionally place a goodbye-bomb 
			int cidx = CTR_TIMEBOMBS_PLAYER1+player;
			if (setbomb && counters[cidx]>0)
			{	changecounter(cidx,-1);
				transform(x,y, ACTIVEBOMB5);
			}
		}
		// try to move to the given position, collecting things on the way, or pushing them aside
		else 
		{	
			// if something is in the way try to pick it up
			if (!is(x+dx,y+dy,AIR))
			{	trypickup(player, x+dx,y+dy);
			}
			// check if there still is something in the way that may be pushed or otherwise removed
			byte otherpiece =  piece(x+dx,y+dy);
			switch (otherpiece)
			{	case EARTH:
					// hint for the display logic
					switch (dx+10*dy)
					{	case -10:		
							transform (x+dx,y+dy, EARTH_UP);
							break;
						case 10: 	 
							transform (x+dx,y+dy, EARTH_DOWN);
							break;
						case -1: 	 
							transform (x+dx,y+dy, EARTH_LEFT);
							break;
						case 1: 	 
							transform (x+dx,y+dy, EARTH_RIGHT);
							break;
					}
					// transform target to air
					transform(x+dx,y+dy, AIR);
					manpiece += (MAN1_DIGLEFT - MAN1_LEFT);   // need to show different image when digging
					break;
				case ROCK:	
				case ROCKEMERALD:
				case BAG:
				case BOMB:	
					if (dx!=0 && dy==0)		// horizontal moves only
					{	if (is(x+2*dx,y,AIR))
						{	move (x+dx,y+dy, dx,dy,  otherpiece);
							// check if need to change into falling variation immediately
							if (would_fall_in_next_step(otherpiece, x+dx*2,y))
							{	switch (otherpiece)
								{	case ROCK:        changestate(x+2*dx,y, ROCK_FALLING); break; 
									case ROCKEMERALD: changestate(x+2*dx,y, ROCKEMERALD_FALLING); break;
									case BAG:         changestate(x+2*dx,y, BAG_FALLING); break;
									case BOMB:        changestate(x+2*dx,y, BOMB_FALLING); break;
								}
							}							
						}
						manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push
					} 
					break;
				case BOX:	
				case CUSHION:
					if (is(x+2*dx,y+2*dy,AIR))
					{	move (x+dx,y+dy, dx,dy, piece(x+dx,y+dy));
					}
					manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
					break;
				case GUN0:
					if (is(x+2*dx,y+2*dy,AIR)  &&  (turnsdone%4!=0))	// must refuse pushing if laser is about to shoot now
					{	move (x+dx,y+dy, dx,dy, piece(x+dx,y+dy));    						
					}
					manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
					break;				
				case GUN1:
					if (is(x+2*dx,y+2*dy,AIR)  &&  (turnsdone%4!=1))	// must refuse pushing if laser is about to shoot now
					{	move (x+dx,y+dy, dx,dy, piece(x+dx,y+dy));   						
					}
					manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
					break;				
				case GUN2:
					if (is(x+2*dx,y+2*dy,AIR)  &&  (turnsdone%4!=2))	// must refuse pushing if laser is about to shoot now
					{	move (x+dx,y+dy, dx,dy, piece(x+dx,y+dy));  						
					}
					manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
					break;				
				case GUN3:
					if (is(x+2*dx,y+2*dy,AIR)  &&  (turnsdone%4!=3))	// must refuse pushing if laser is about to shoot now
					{	move (x+dx,y+dy, dx,dy, piece(x+dx,y+dy));   						
					}
					manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
					break;				
			}
			// if nothing is in the way then, do the movement and optionally leave bomb
			otherpiece =  piece(x+dx,y+dy);
			if (otherpiece==AIR)
			{	
				move (x,y, dx,dy, manpiece);
				changecounter (CTR_MANPOSX1+player, dx);
				changecounter (CTR_MANPOSY1+player, dy);
			}
			// check if player wants to go through one-time door
			else if (otherpiece==ONETIMEDOOR && is(x+2*dx,y+2*dy,AIR))
			{
				move (x,y, 2*dx,2*dy, manpiece);
				changecounter (CTR_MANPOSX1+player, 2*dx);
				changecounter (CTR_MANPOSY1+player, 2*dy);
				transform (x+dx,y+dy, ONETIMEDOOR_CLOSED);				
			}
			// check if player wants to go through a colored door
			else if ( (otherpiece==DOORRED || otherpiece==DOORGREEN
					|| otherpiece==DOORBLUE || otherpiece==DOORYELLOW)
				&& is(x+2*dx,y+2*dy,AIR) && have_matching_key(player,otherpiece) )
			{
				move (x,y, 2*dx,2*dy, manpiece);
				changecounter (CTR_MANPOSX1+player, 2*dx);			
				changecounter (CTR_MANPOSY1+player, 2*dy);			
				highlight(x+dx,y+dy, otherpiece); 
			}
				
			// check if want to place a bomb at moving			
			int cidx = CTR_TIMEBOMBS_PLAYER1+player;
			if (setbomb && counters[cidx]>0 && is(x,y,AIR))
			{	changecounter(cidx,-1);
				transform(x,y, ACTIVEBOMB5);			
			}
		}
		
		// bring player piece to correct state if not already done
		x = counters[CTR_MANPOSX1+player];
		y = counters[CTR_MANPOSY1+player];
		if (!is(x,y,manpiece) && is_player_piece_at(x,y)) {
			transform(x,y,(byte)(manpiece));
		}					
	}
	private void trypickup(int player, int x, int y)
	{
		// cause necessary effect after picking up object
		switch (piece(x,y))
		{	case EMERALD:
				changecounter(CTR_EMERALDSCOLLECTED, 1);
				break;
			case SAPPHIRE:
				changecounter(CTR_EMERALDSCOLLECTED, 2);
				break;
			case CITRINE:
				changecounter(CTR_EMERALDSCOLLECTED, 3);
				break;
			case RUBY:	
				changecounter(CTR_EMERALDSCOLLECTED, 1);
				break;
			case TIMEBOMB:
				changecounter(CTR_TIMEBOMBS_PLAYER1+player, 1);
				break;
			case TIMEBOMB10:
				changecounter(CTR_TIMEBOMBS_PLAYER1+player, 10);
				break;
			case KEYRED:
				if ((counters[CTR_KEYS_PLAYER1+player]&0x01) == 0)
				{	changecounter(CTR_KEYS_PLAYER1+player, 0x01);
				}
				break;
			case KEYGREEN:
				if ((counters[CTR_KEYS_PLAYER1+player]&0x02) == 0)
				{	changecounter(CTR_KEYS_PLAYER1+player, 0x02);
				}
				break;
			case KEYBLUE:
				if ((counters[CTR_KEYS_PLAYER1+player]&0x04) == 0)
				{	changecounter(CTR_KEYS_PLAYER1+player, 0x04);
				}
				break;
			case KEYYELLOW:
				if ((counters[CTR_KEYS_PLAYER1+player]&0x08) == 0)
				{	changecounter(CTR_KEYS_PLAYER1+player, 0x08);
				}
				break;
			default:	// can not be picked - just keep object where it is
			{	return;
			}
		}
		// remove the object from the map
		transform (x,y,AIR);
	}
		
	
	
	/**
	 *  Simple implementation of a Fibonacci LFSR. This method computes the next value for the shift register
	 *  given the current value. To work around the all-0 case, a 1 is injected instead.  
	 */ 
	private static int nextrandomseed(int seed)
	{	
		// work-around for all-0 case
		if (seed==0)
		{	seed=1;
		}
		// calculate next bit from the current state
		for (int i=0; i<3; i++)
		{	int bit = ((seed>>15) ^ (seed>>13) ^ (seed>>12) ^ (seed>>10)) & 1;
			seed = ((seed << 1) ^ bit) & 0xffff;
		}
//System.out.println("seed ("+seed%4+")");
		return seed;
	}		
	
		
	private static int abs(int v)
	{	
		return (v<0) ? -v : v;
	}
	
	// -------- queries to check for some conditions of the map -----------
	public byte piece(int x, int y)
	{
		if (x<0 || x>=MAPWIDTH || y<0 || y>=MAPHEIGHT)
		{	return OUTSIDE;
		}
		return map[x+y*MAPWIDTH];
	}
	 
	private boolean is(int x, int y, byte p)
	{
		return piece(x,y)==p;
	} 
	
	private boolean hasmoved(int x, int y)
	{
		return hasmoved[x+y*MAPWIDTH];
	}
	
	private boolean may_roll_to_left(int x, int y, boolean isconvertible)
	{
		int p = piece(x,y);
		if (!has_rounded_top(p) && p!=ELEVATOR_TOLEFT)
		{	return false;
		}
		if (!is(x-1,y-1,AIR))
		{	return false;
		}
		int pl = piece(x-1,y);
		if (pl==AIR || pl==ACID || (isconvertible && pl==CONVERTER && is(x-1,y+1,AIR)))
		{	if (p==ELEVATOR_TOLEFT) 
			{	highlight(x,y, ELEVATOR_TOLEFT);
			}
			return true;
		}
		return false;		
	}
	private boolean may_roll_to_right(int x,int y, boolean isconvertible)
	{
		int p = piece(x,y);
		if (!has_rounded_top(p) && p!=ELEVATOR_TORIGHT)
		{	return false;
		}
		if (!is(x+1,y-1,AIR))
		{	return false;
		}
		int pr = piece(x+1,y);
		if (pr==AIR || pr==ACID || (isconvertible && pr==CONVERTER && is(x+1,y+1,AIR)))
		{	
			if (p==ELEVATOR_TORIGHT)
			{	highlight(x,y, ELEVATOR_TORIGHT);
			}
			return true;
		}
		return false;
	}
	private boolean has_rounded_top(int piece)
	{	
		switch (piece)
		{	case ROCK:
			case ROCKEMERALD:
			case BAG:
			case BOMB:
			case ROUNDWALL:
			case ROUNDSTONEWALL:
			case DOOR:
			case DOOR_OPENED:
//			case DOOR_CLOSING:
			case DOOR_CLOSED:
//			case DOORBLUE:
//			case DOORRED:
//			case DOORGREEN:
//			case DOORYELLOW:
			case EMERALD:
			case SAPPHIRE:
			case CITRINE:
			case RUBY:
			case KEYBLUE:
			case KEYRED:
			case KEYGREEN:
			case KEYYELLOW:
			case CUSHION:	return true;
		}
		return false;
	}
	private boolean is_player_piece_at(int x, int y)
	{	
		return whose_player_piece(piece(x,y))>=0;
	}
	public static int whose_player_piece(byte tile)
	{	
		switch (tile)
		{	case MAN1:
			case MAN1_LEFT:
			case MAN1_RIGHT:
			case MAN1_UP:
			case MAN1_DOWN:
			case MAN1_PUSHLEFT:
			case MAN1_PUSHRIGHT:
			case MAN1_PUSHUP:
			case MAN1_PUSHDOWN:
			case MAN1_DIGLEFT:
			case MAN1_DIGRIGHT:
			case MAN1_DIGUP:
			case MAN1_DIGDOWN:
				return 0;
			case MAN2:	
			case MAN2_LEFT:
			case MAN2_RIGHT:
			case MAN2_UP:
			case MAN2_DOWN:
			case MAN2_PUSHLEFT:
			case MAN2_PUSHRIGHT:				
			case MAN2_PUSHUP:
			case MAN2_PUSHDOWN:				
			case MAN2_DIGLEFT:
			case MAN2_DIGRIGHT:				
			case MAN2_DIGUP:
			case MAN2_DIGDOWN:				
				return 1;			
		}
		return -1;
	}

	private boolean would_fall_in_next_step(byte piece, int x, int y)
	{
		switch (piece(x,y+1)) {
		case AIR:
		case ACID:	   return true;
		}
		return false;
	}
	private boolean is_living(int x, int y)
	{
		switch (piece(x,y))
		{	case LORRYLEFT:
			case LORRYLEFT_FIXED:
			case LORRYRIGHT:
			case LORRYRIGHT_FIXED:
			case LORRYUP:
			case LORRYUP_FIXED:
			case LORRYDOWN:
			case LORRYDOWN_FIXED:
			case BUGLEFT: 
			case BUGLEFT_FIXED:
			case BUGRIGHT:
			case BUGRIGHT_FIXED:
			case BUGUP:
			case BUGUP_FIXED:
			case BUGDOWN:
			case BUGDOWN_FIXED:
			case YAMYAMLEFT:
			case YAMYAMRIGHT:	
			case YAMYAMUP:
			case YAMYAMDOWN:
				return true;
		}
		return is_player_piece_at(x,y);
	}
	private boolean isVisiblyEquivalent(byte p1, byte p2)
	{
		if (p1==ROCK || p1==ROCK_FALLING)
		{	return p2==ROCK || p2==ROCK_FALLING;
		}
		if (p1==ROCKEMERALD || p1==ROCKEMERALD_FALLING)
		{	return p2==ROCKEMERALD || p2==ROCKEMERALD_FALLING;
		}
		if (p1==EMERALD || p1==EMERALD_FALLING)
		{	return p2==EMERALD || p2==EMERALD_FALLING;
		}
		if (p1==CITRINE || p1==CITRINE_FALLING || p1==CITRINE_BREAKING)
		{	return p2==CITRINE || p2==CITRINE_FALLING || p2==CITRINE_BREAKING;
		}
		if (p1==SAPPHIRE || p1==SAPPHIRE_FALLING || p1==SAPPHIRE_BREAKING)
		{	return p2==SAPPHIRE || p2==SAPPHIRE_FALLING || p2==SAPPHIRE_BREAKING;
		}
		if (p1==BAG || p1==BAG_FALLING || p1==BAG_OPENING)
		{	return p2==BAG || p2==BAG_FALLING || p2==BAG_OPENING;
		}
		if (p1==RUBY || p1==RUBY_FALLING)
		{	return p2==RUBY || p2==RUBY_FALLING;
		}
		if (p1==BOMB || p1==BOMB_FALLING)
		{	return p2==BOMB || p2==BOMB_FALLING;
		}
//		if (p1==DOOR_OPENED || p1==DOOR_CLOSING)
//		{	return p2==DOOR_OPENED || p2==DOOR_CLOSING;
//		}
		if ( p1==GUN0 || p1==GUN1 || p1==GUN2 || p1==GUN3)
		{	return p2==GUN0 || p2==GUN1 || p2==GUN2 || p2==GUN3;
		}
		return false;
	}
	private boolean have_matching_key(int player, byte otherpiece)
	{
		int kflags = counters[CTR_KEYS_PLAYER1+player];
	
		switch (otherpiece)
		{	case DOORRED: 		return (kflags & 0x01) != 0;
			case DOORGREEN: 	return (kflags & 0x02) != 0;
			case DOORBLUE:	 	return (kflags & 0x04) != 0;
			case DOORYELLOW: 	return (kflags & 0x08) != 0;
		}
		return false;
	}
	private boolean man1_moves_toward_man2()
	{
		int x1 = counters[CTR_MANPOSX1];
		int y1 = counters[CTR_MANPOSY1];
		int x2 = counters[CTR_MANPOSX2];
		int y2 = counters[CTR_MANPOSY2];
		
		switch (walk.getMovement(0, turnsdone))
		{	case Walk.MOVE_LEFT: 
			case Walk.BOMB_LEFT:  
				return x2<x1;
			case Walk.MOVE_RIGHT:
			case Walk.BOMB_RIGHT:
				return x2>x1; 
			case Walk.MOVE_UP:    
			case Walk.BOMB_UP:
				return y2<y1;
			case Walk.MOVE_DOWN: 
			case Walk.BOMB_DOWN:  
				return y2>y1;
		}		
		return false; 
	}
	
//	private int[] findPlayer2SpawnPosition(int x, int y)
//	{
//		if (can_be_walked_to(x-1,y))
//		{	return new int[]{x-1,y};
//		}
//		if (can_be_walked_to(x+1,y))
//		{	return new int[]{x+1,y};
//		}
//		if (can_be_walked_to(x,y-1))
//		{	return new int[]{x,y-1};
//		}
//		if (can_be_walked_to(x,y+1))
//		{	return new int[]{x,y+1};
//		}
//		if (have_matching_key(piece(x-1,y)) && is(x-2,y,AIR))
//		{	return new int[]{x-2,y};
//		}
//		if (have_matching_key(piece(x+1,y)) && is(x+2,y,AIR))
//		{	return new int[]{x+2,y};
//		}
//		if (have_matching_key(piece(x,y-1)) && is(x,y-2,AIR))
//		{	return new int[]{x,y-2};
//		}
//		if (have_matching_key(piece(x,y+1)) && is(x,y+2,AIR))
//		{	return new int[]{x,y+2};
//		}		
//		return null;
//	}	
//	private boolean can_be_walked_to(int x, int y)
//	{
//		switch (piece(x,y))
//		{	case AIR:
//			case EARTH:
//			case EMERALD:
//			case SAPPHIRE:
//			case CITRINE:
//			case RUBY:	
//			case TIMEBOMB:
//			case TIMEBOMB10:
//			case KEYRED:
//			case KEYGREEN:
//			case KEYBLUE:
//			case KEYYELLOW:
//				return true;
//		}
//		return false;
//	}	
	
	
	// tries to undo the previous turn. this is done by popping the transactions
	// from the stack and inverting the effect of each one.
	// if the stacks runs before a STARTOFTURN - transaction could be found, this
	// method just returns false. The caller must then completely reset the 
	// game logic to clear things up. 
	// the position of the keep-location will be undefined in any case.
	private boolean rollback()
	{
		while (transactions.size()>0)
		{
			int t = transactions.pop();
			switch (t & TRN_MASK)
			{	case TRN_STARTOFTURN:
				{	turnsdone--;
					return true;
				}
				case TRN_COUNTER:
				{	int index = (t>>16) & 0x0fff;
					int increment = (int)((short)(t & 0xffff));
					counters[index] = counters[index] - increment;
					break;
				}
				case TRN_TRANSFORM:
				case TRN_CHANGESTATE:
				{	int x = (t>>22) & 0x03f;
					int y = (t>>16) & 0x03f;
					int oldpiece = (t>>8) & 0xff;
					map[x+y*MAPWIDTH] = (byte)oldpiece;
					break;
				}
				case TRN_MOVEDOWN:
				{	int x = (t>>22) & 0x03f;
					int y = (t>>16) & 0x03f;
					int oldpiece = (t>>8) & 0xff;
					map[x+y*MAPWIDTH] = (byte)oldpiece;
					map[x+(y+1)*MAPWIDTH] = AIR;
					break;
				}
				case TRN_MOVEUP:
				{	int x = (t>>22) & 0x03f;
					int y = (t>>16) & 0x03f;
					int oldpiece = (t>>8) & 0xff;
					map[x+y*MAPWIDTH] = (byte)oldpiece;
					map[x+(y-1)*MAPWIDTH] = AIR;
					break;
				}
				case TRN_MOVELEFT:
				{	int x = (t>>22) & 0x03f;
					int y = (t>>16) & 0x03f;
					int oldpiece = (t>>8) & 0xff;
					map[x+y*MAPWIDTH] = (byte)oldpiece;
					map[x+y*MAPWIDTH-1] = AIR;
					break;
				}
				case TRN_MOVERIGHT:
				{	int x = (t>>22) & 0x03f;
					int y = (t>>16) & 0x03f;
					int oldpiece = (t>>8) & 0xff;
					map[x+y*MAPWIDTH] = (byte)oldpiece;
					map[x+y*MAPWIDTH+1] = AIR;
					break;
				}
				case TRN_MOVEDOWN2:
				{	int x = (t>>22) & 0x03f;
					int y = (t>>16) & 0x03f;
					int oldpiece = (t>>8) & 0xff;
					map[x+y*MAPWIDTH] = (byte)oldpiece;
					map[x+(y+2)*MAPWIDTH] = AIR;
					break;
				}
				case TRN_MOVEUP2:
				{	int x = (t>>22) & 0x03f;
					int y = (t>>16) & 0x03f;
					int oldpiece = (t>>8) & 0xff;
					map[x+y*MAPWIDTH] = (byte)oldpiece;
					map[x+(y-2)*MAPWIDTH] = AIR;
					break;
				}
				case TRN_MOVELEFT2:
				{	int x = (t>>22) & 0x03f;
					int y = (t>>16) & 0x03f;
					int oldpiece = (t>>8) & 0xff;
					map[x+y*MAPWIDTH] = (byte)oldpiece;
					map[x+y*MAPWIDTH-2] = AIR;
					break;
				}
				case TRN_MOVERIGHT2:
				{	int x = (t>>22) & 0x03f;
					int y = (t>>16) & 0x03f;
					int oldpiece = (t>>8) & 0xff;
					map[x+y*MAPWIDTH] = (byte)oldpiece;
					map[x+y*MAPWIDTH+2] = AIR;
					break;
				}
				case TRN_HIGHLIGHT:
				{	break;		// nothing to do. highlights do not change state
				}
				default:
				{	throw new IllegalStateException("Transaction can not be undone");
				}
			}
		}
		return false;
	}
	
	
	//  ------ modifications of the map that cause one or more entries in the transaction table -----
	
	private void changecounter(int index, int increment)
	{
		counters[index] += increment;
		// in case of a counter change that can not fit into a "short", need to add multiple change transactions
		// ATTENTION: This should normally only happen for values that are "just" too big to fit into a short, like
		// some changes of a 16 bit unsigned value for the random generator 
		while (increment>32767)
		{	transactions.push (TRN_COUNTER | (index<<16) | 0x7fff);
			increment -= 32767;	
		}
		while (increment<-32768)
		{	transactions.push (TRN_COUNTER | (index<<16) | 0x8000);
			increment += 32768;	
		}
		transactions.push (TRN_COUNTER | (index<<16) | (increment&0xffff));			
	}
	private void transform(int x, int y, byte newpiece)
	{
		int index = x+y*MAPWIDTH;
		int oldpiece_i = ((int)map[index]) & 0xff;
		int newpiece_i = ((int)newpiece) & 0xff;
		if (oldpiece_i != newpiece_i && isVisiblyEquivalent((byte)oldpiece_i,newpiece) )
		{	throw new IllegalArgumentException("Must not use transform for different but visibly equivalent pieces: "
					+oldpiece_i+"->"+newpiece_i);
		}
		map[index] = (byte) newpiece;
		hasmoved[index] = true;
		transactions.push (TRN_TRANSFORM | (x<<22) | (y<<16) | (oldpiece_i<<8) | newpiece_i );
	}
	private void changestate(int x, int y, byte newpiece)
	{
		int index = x+y*MAPWIDTH;
		int oldpiece_i = ((int)map[index]) & 0xff;
		int newpiece_i = ((int)newpiece) & 0xff;
		if (!isVisiblyEquivalent((byte)oldpiece_i,newpiece) )
		{	throw new IllegalArgumentException("Can not use changestate for not visibly equivalent pieces:" 
				+oldpiece_i+"->"+newpiece_i);
		}
		map[index] = (byte) newpiece;
		transactions.push (TRN_CHANGESTATE | (x<<22) | (y<<16) | (oldpiece_i<<8) | newpiece_i );
	}
	private void highlight(int x, int y, byte highlightpiece)
	{
		int highlightpiece_i = highlightpiece & 0xff;
		transactions.push (TRN_HIGHLIGHT | (x<<22) | (y<<16) | highlightpiece_i );
	}
	private void move(int x, int y, int dx, int dy, byte newpiece)
	{
		// when space to move to is not empty - let disappear piece before
		if (!is(x+dx,y+dy,AIR))
		{	transform(x+dx,y+dy,AIR);
		}
		// move and transform piece on the way
		int index = x+y*MAPWIDTH;
		int index2 = x+dx + (y+dy)*MAPWIDTH;
		int oldpiece_i = ((int)map[index]) & 0xff;
		int newpiece_i = ((int)newpiece) & 0xff;
		map[index] = AIR;
		map[index2] = newpiece;		
		hasmoved[index2] = true;
		
		// store what happened into transaction log
		switch (dx+10*dy)
		{	case 10:
			{	transactions.push (TRN_MOVEDOWN | (x<<22) | (y<<16) | (oldpiece_i<<8) | newpiece_i );
				break;
			}
			case -10:
			{	transactions.push (TRN_MOVEUP | (x<<22) | (y<<16) | (oldpiece_i<<8) | newpiece_i );
				break;
			}
			case -1:
			{	transactions.push (TRN_MOVELEFT | (x<<22) | (y<<16) | (oldpiece_i<<8) | newpiece_i );
				break;
			}
			case 1:
			{	transactions.push (TRN_MOVERIGHT | (x<<22) | (y<<16) | (oldpiece_i<<8) | newpiece_i );
				break;
			}
			case 20:
			{	transactions.push (TRN_MOVEDOWN2 | (x<<22) | (y<<16) | (oldpiece_i<<8) | newpiece_i );
				break;
			}
			case -20:
			{	transactions.push (TRN_MOVEUP2 | (x<<22) | (y<<16) | (oldpiece_i<<8) | newpiece_i );
				break;
			}
			case -2:
			{	transactions.push (TRN_MOVELEFT2 | (x<<22) | (y<<16) | (oldpiece_i<<8) | newpiece_i );
				break;
			}
			case 2:
			{	transactions.push (TRN_MOVERIGHT2 | (x<<22) | (y<<16) | (oldpiece_i<<8) | newpiece_i );
				break;
			}
			default:
				throw new IllegalArgumentException("Move direction out of range: "+dx+","+dy);
		}
	}
	
	
	// -- debug methods ---
	public void printDump()
	{
		// write counters
		System.out.print(turnsdone);
		System.out.print(" turns. ");
		for (int i=0; i<counters.length; i++)
		{	System.out.print(counters[i]);
			System.out.print(" ");
		}
		System.out.println();

		// write information about transaction buffer
		System.out.print(transactions.size());
		System.out.print(" transactions (");
		System.out.print(transactions.keepingSize());
		System.out.print(" kept)");
		System.out.println();
		
		// write content of the map
		for (int y=0; y<MAPHEIGHT; y++)
		{	boolean didprint=false;
			for (int x=0; x<MAPWIDTH; x++)
			{	byte c = map[x+y*MAPWIDTH];
				if (c!=OUTSIDE) {
					System.out.print( (char) ( ((int)c) & 0xff) );
					didprint=true;
				}
			}
			if (didprint)
			{	System.out.println();
			}
		}
	}
	
	// --------- query methods to extract public game info ------
	public boolean isKilled()
	{
		return counters[CTR_KILLED_PLAYER1] + counters[CTR_KILLED_PLAYER2] > 0;
	}
	public boolean isSolved()
	{
		return timeSinceAllExited()>0;
	}
	
	public boolean isOverForSomeTime()
	{
		int killtimeout = 6;
		int wintimeout = 7;
		if (counters[CTR_KILLED_PLAYER1] > killtimeout) return true;
		if (counters[CTR_KILLED_PLAYER2] > killtimeout) return true;
		return timeSinceAllExited()>wintimeout;		  	
	}
	
	public int totalTimeForSolution()
	{
		if (!isSolved()) return 0;
		return turnsdone - timeSinceAllExited() + 1;
	}
	
	public int timeSinceAllExited()
	{
		if (getNumberOfPlayers()<=1)
		{	return counters[CTR_EXITED_PLAYER1];
		}
		else
		{	return Math.min(counters[CTR_EXITED_PLAYER1],counters[CTR_EXITED_PLAYER2]);
		}
	}
	
	public int getCounter(int ctr)
	{	
		return counters[ctr];
	}
	
	public int getCounterAtStartOfTurn(int ctr)
	{
		int value = counters[ctr];
    	for (int idx=getAnimationBufferSize()-1; idx>=0; idx--)
    	{	int trn = getAnimation(idx);
    		if ( (trn&TRN_MASK) == TRN_COUNTER)
    		{	int index = (trn>>16) & 0x0fff;				
				if (index==ctr)
				{	value -= (int)((short)(trn & 0xffff));
				}
    		}
    	}
		return value;
	}
	
	public int getPopulatedWidth()
	{
		return level.datawidth;
	}
		
	public int getPopulatedHeight()
	{
		return level.dataheight;
	}
	public int getNumberOfPlayers()
	{
		return numberofplayers;
	}
	public int getTurnsInWalk()
	{	
		return walk.getTurns();
	}
	
//	public byte getPiece(int index)
//	{	return map[index];
//	}
//	public byte getPieceInPopulatedArea(int x, int y)
//	{
//		return map[1+x+(1+y)*MAPWIDTH];
//	}
	public int getPlayerPositionX(int idx)
	{
		return counters[CTR_MANPOSX1+idx];
	}
	public int getPlayerPositionY(int idx)
	{
		return counters[CTR_MANPOSY1+idx];
	}
//	public int calculateXInPopulatedArea(int pos)
//	{	
//		return (pos % MAPWIDTH)-1;
//	}
//	public int calculateYInPopulatedArea(int pos)
//	{	
//		return (pos / MAPWIDTH)-1;
//	}
	public int getAnimationBufferSize()
	{
		return transactions.keepingSize();
	}
	public int getAnimation(int idx)
	{
		return transactions.get(transactions.size()-transactions.keepingSize()+idx);
	}
	
	public int getNumberOfEmeraldsStillNeeded()
	{	return level.loot - counters[CTR_EMERALDSCOLLECTED];
	}
	
	public boolean canStillGetEnoughEmeralds()
	{	
		return counters[CTR_EMERALDSTOOMUCH] >= 0;
	}
	
	public int getTurnsDone()
	{	return turnsdone;
	}
	
	public int getCollectedKeys(int player)
	{		
		return counters[CTR_KEYS_PLAYER1+player];
	}	
	
	public int getCollectedTimeBombs(int player)
	{	
		return counters[CTR_TIMEBOMBS_PLAYER1+player];
	}
	
}


