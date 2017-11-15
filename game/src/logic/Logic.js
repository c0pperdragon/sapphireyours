var Logic = function() 
{
    this.map = null;                     // fixed-size buffer to hold current map   
    this.counters = null;                 // various counter values / flags that get modified in game
    this.transactions = null;           // the transaction buffer
    this.hasmoved = null;               // temporary info to prevent double-actions of pieces
    
    this.level = null;                 // level currently played
    this.walk = null;                  // the walk currently running
    this.turnsdone = 0
    this.numberofplayers = 0;
    
    this.visualrandomseed = 0;   // secondary random generator used for graphics appearances (not logic relevant) 
};
Logic.prototype.constructor = Logic;

// constant values
var MAPWIDTH  = 64;
var MAPHEIGHT = 64; 

// pieces in static level definition
var OUTSIDE           = 0;
var MAN1              = '1'.charCodeAt(0);
var MAN2              = '2'.charCodeAt(0);
var AIR               = ' '.charCodeAt(0);
var EARTH             = '.'.charCodeAt(0);
var SAND              = 's'.charCodeAt(0);
var SAND_FULL         = 'S'.charCodeAt(0);
var SAND_FULLEMERALD  = '}'.charCodeAt(0);
var WALL              = '#'.charCodeAt(0);
var ROUNDWALL         = 'A'.charCodeAt(0);
var GLASSWALL         = ':'.charCodeAt(0);
var STONEWALL         = '+'.charCodeAt(0);
var ROUNDSTONEWALL    = '|'.charCodeAt(0);
var WALLEMERALD       = '&'.charCodeAt(0);
var EMERALD           = '*'.charCodeAt(0);
var CITRINE           = ')'.charCodeAt(0); 
var SAPPHIRE          = '$'.charCodeAt(0);
var RUBY              = '('.charCodeAt(0);    
var ROCK              = '0'.charCodeAt(0);
var ROCKEMERALD       = 'e'.charCodeAt(0);
var BAG               = '@'.charCodeAt(0);
var BOMB              = 'Q'.charCodeAt(0);
var DOOR              = 'E'.charCodeAt(0);
var SWAMP             = '%'.charCodeAt(0);
var DROP              = '/'.charCodeAt(0);
var TIMEBOMB          = '!'.charCodeAt(0);
var ACTIVEBOMB5       = '?'.charCodeAt(0);
var TIMEBOMB10        = ']'.charCodeAt(0);
var CONVERTER         = 'c'.charCodeAt(0);
var BOX               = '['.charCodeAt(0);
var CUSHION           = '_'.charCodeAt(0);
var ELEVATOR          = '{'.charCodeAt(0);
//  public final static byte DISPENSER         = 'd'.charCodeAt(0);
var ACID              = 'a'.charCodeAt(0);
var KEYBLUE           = 'b'.charCodeAt(0);
var KEYRED            = 'r'.charCodeAt(0);
var KEYGREEN          = 'g'.charCodeAt(0);
var KEYYELLOW         = 'y'.charCodeAt(0);
var DOORBLUE          = 'B'.charCodeAt(0);
var DOORRED           = 'R'.charCodeAt(0);
var DOORGREEN         = 'G'.charCodeAt(0);
var DOORYELLOW        = 'Y'.charCodeAt(0);
var ONETIMEDOOR       = '='.charCodeAt(0);
var LORRYLEFT         = '5'.charCodeAt(0);
var LORRYUP           = '6'.charCodeAt(0);
var LORRYRIGHT        = '7'.charCodeAt(0);
var LORRYDOWN         = '8'.charCodeAt(0);
var BUGLEFT           = 'h'.charCodeAt(0);
var BUGUP             = 'u'.charCodeAt(0);
var BUGRIGHT          = 'k'.charCodeAt(0);
var BUGDOWN           = 'j'.charCodeAt(0);
var YAMYAMLEFT        = '<'.charCodeAt(0);
var YAMYAMUP          = '^'.charCodeAt(0);
var YAMYAMRIGHT       = '>'.charCodeAt(0);
var YAMYAMDOWN        = 'V'.charCodeAt(0);
var ROBOT             = 'o'.charCodeAt(0);
var ELEVATOR_TOLEFT   = '3'.charCodeAt(0);
var ELEVATOR_TORIGHT  = '4'.charCodeAt(0);
var GUN0              = '\''.charCodeAt(0);
var GUN1              = 'C'.charCodeAt(0);
var GUN2              = 'D'.charCodeAt(0);
var GUN3              = 'F'.charCodeAt(0);
    
    // pieces created during game   
var ROCK_FALLING      = 128;
var EMERALD_FALLING   = 129;
var BOMB_FALLING      = 130;
var BAG_FALLING       = 131;
var DOOR_OPENED       = 132;
var DOOR_CLOSING      = 133;
var DOOR_CLOSED       = 134;
var LORRYLEFT_FIXED   = 135;
var LORRYUP_FIXED     = 136;
var LORRYRIGHT_FIXED  = 137;
var LORRYDOWN_FIXED   = 138;
var BUGLEFT_FIXED     = 139;
var BUGUP_FIXED       = 140;
var BUGRIGHT_FIXED    = 141;
var BUGDOWN_FIXED     = 142;
var BOMB_EXPLODE      = 143;
var EXPLODE1_AIR      = 144;
var EXPLODE2_AIR      = 145;
var EXPLODE3_AIR      = 146;
var EXPLODE4_AIR      = 147;
var EXPLODE1_EMERALD  = 148;
var EXPLODE2_EMERALD  = 149;
var EXPLODE3_EMERALD  = 150;
var EXPLODE4_EMERALD  = 151;
var EXPLODE1_SAPPHIRE = 152;
var EXPLODE2_SAPPHIRE = 153;
var EXPLODE3_SAPPHIRE = 154;
var EXPLODE4_SAPPHIRE = 156;
var BIGBOMB_EXPLODE   = 157;
//  public final static byte YAMYAM_EXPLODE    = -30;
var BUG_EXPLODE       = 158;
var LORRY_EXPLODE     = 159;
var ACTIVEBOMB0       = 160;
var ACTIVEBOMB1       = 161;
var ACTIVEBOMB2       = 162;
var ACTIVEBOMB3       = 163;
var ACTIVEBOMB4       = 164;
var TIMEBOMB_EXPLODE  = 165;
var RUBY_FALLING      = 166;
var SAPPHIRE_FALLING  = 167;    
var BAG_OPENING       = 168;    
var SAPPHIRE_BREAKING = 169;    
var EXPLODE1_BAG      = 170;
var EXPLODE2_BAG      = 171;
var EXPLODE3_BAG      = 172;
var EXPLODE4_BAG      = 173;
var MAN1_LEFT         = 174;
var MAN2_LEFT         = 175;
var MAN1_RIGHT        = 176;
var MAN2_RIGHT        = 177;
var MAN1_UP           = 178;
var MAN2_UP           = 179;
var MAN1_DOWN         = 180;
var MAN2_DOWN         = 181;
var MAN1_PUSHLEFT     = 182;
var MAN2_PUSHLEFT     = 183;
var MAN1_PUSHRIGHT    = 184;
var MAN2_PUSHRIGHT    = 185;
var MAN1_PUSHUP       = 186;
var MAN2_PUSHUP       = 187;
var MAN1_PUSHDOWN     = 188;
var MAN2_PUSHDOWN     = 189;
var MAN1_DIGLEFT      = 190;
var MAN2_DIGLEFT      = 191;
var MAN1_DIGRIGHT     = 192;
var MAN2_DIGRIGHT     = 193;
var MAN1_DIGUP        = 194;
var MAN2_DIGUP        = 195;
var MAN1_DIGDOWN      = 196;
var MAN2_DIGDOWN      = 197;
var CITRINE_FALLING   = 198;
var CITRINE_BREAKING  = 199;
var ROCKEMERALD_FALLING= 200;
var CUSHION_BUMPING   = 201;
var EXPLODE1_RUBY     = 202;
var EXPLODE2_RUBY     = 203;
var EXPLODE3_RUBY     = 204;
var EXPLODE4_RUBY     = 205;
var ONETIMEDOOR_CLOSED= 206;
var EXPLODE1_TNT     = 207;
var EXPLODE2_TNT     = 208;
var EXPLODE3_TNT     = 209;
var EXPLODE4_TNT     = 210;
    
// virtual pieces (exist only during animations)
var EARTH_UP          = 220;
var EARTH_DOWN        = 221;
var EARTH_LEFT        = 222;
var EARTH_RIGHT       = 223;    
var LASER_H           = 224;
var LASER_V           = 225;
var LASER_BL          = 226;
var  LASER_BR         = 227;
var LASER_TL          = 228;
var LASER_TR          = 229;
var LASER_L           = 230;
var LASER_R           = 231;
var LASER_U           = 232;
var LASER_D           = 233;
var SWAMP_RIGHT       = 234;
var SWAMP_LEFT        = 235;
var SWAMP_UP          = 236;
var SWAMP_DOWN        = 237;


    // the counters are references with this index
//  public final static int CTR_NUMPLAYERS              = 0;
var CTR_MANPOSX1                = 1;
var CTR_MANPOSX2                = 2;
var CTR_MANPOSY1                = 3;
var CTR_MANPOSY2                = 4;
var CTR_EMERALDSCOLLECTED       = 5;
var CTR_EXITED_PLAYER1          = 6;
var CTR_EXITED_PLAYER2          = 7;
var CTR_KILLED_PLAYER1          = 8;
var CTR_KILLED_PLAYER2          = 9;
var CTR_TIMEBOMBS_PLAYER1       = 10;
var CTR_TIMEBOMBS_PLAYER2       = 11;
var CTR_KEYS_PLAYER1            = 12;
var CTR_KEYS_PLAYER2            = 13;
var CTR_RANDOMSEED              = 14;
var CTR_EMERALDSTOOMUCH         = 15;
    
    // opcodes for the transaction stack
var TRN_MASK        = 0xf0000000;
var TRN_STARTOFTURN = 0x00000000;
var TRN_COUNTER     = 0x10000000;
var TRN_TRANSFORM   = 0x20000000;
var TRN_CHANGESTATE = 0x30000000;
var TRN_MOVEUP      = 0x40000000;
var TRN_MOVEDOWN    = 0x50000000;
var TRN_MOVELEFT    = 0x60000000;
var TRN_MOVERIGHT   = 0x70000000;
var TRN_MOVEUP2     = 0x80000000;
var TRN_MOVEDOWN2   = 0x90000000;
var TRN_MOVELEFT2   = 0xa0000000;
var TRN_MOVERIGHT2  = 0xb0000000;
var TRN_HIGHLIGHT   = 0xc0000000; 


Logic.prototype.$ = function(transactionhistory)
{
    this.map = new Array[MAPWIDTH*MAPHEIGHT];       
    this.counters = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    this.transactions = new DiscardingStack().$(transactionhistory);
    this.hasmoved = new Array(MAPWIDTH*MAPHEIGHT);
    this.visualrandomseed = 23452;
};

Logic.prototype.attach = function(l, w)
{
    this.level = l;
    this.walk = w;
    this.reset();
};
    
    // moves the game-logic to the desired position.
    // it is guaranteed that the transaction buffer then holds at least all 
    // the modifications that lead to this turn, and the keep-location
    // is set to the first of these transactions
    // (exception: when moving to 0, no transactions are available)
Logic.prototype.gototurn = function(t)
{
        if (this.turnsdone<t)
        {   // moving forward is quite simple
            while (this.turnsdone<t)
            {   this.computeturn();
            }
        }
        else if (this.turnsdone>t)
        {   
            if (t==0)
            {   // moving backwards to 0 is just a reset
                this.reset();
            }
            else
            {   // otherwise try to roll back the turns.
                // this could fail on the way because the 
                // transactions were already discarded
                while (this.turnsdone>t)
                {   if (!this.rollback())
                    {   // when rollback indeed failed, just reset
                        // and start from begin
                        this.reset();
                        while (this.turnsdone<t)
                        {   this.computeturn();
                        }
                        return;
                    }
                }

                // to fix up everything, the keep-counter in the 
                // transaction buffer needs to be set correctly.
                // if this fails, also do a complete reset 
                for (int i = this.transactions.size()-1; i>=0; i--)
                {   if (this.transactions.get(i)==TRN_STARTOFTURN)
                    {   this.transactions.mayDiscard(i);
                        return;
                    }
                }
                // no STARTOFTURN - transaction could be found-
                // must completely recompute everything
                this.reset();
                while (this.turnsdone<t)
                {   this.computeturn();
                }               
            }
        }
}
    
    // resets the game logic to the initial state as defined in the Level
Logic.prototype.reset = function()
{
        this.turnsdone = 0;
        this.numberofplayers = 1;
        
        this.transactions.clear();       
        
        for (var i=0; i<this.map.length; i++) map[i]=OUTSIDE;
        var dw = this.level.datawidth;
        for (var y=0; y<this.level.dataheight; y++)
        {   for (var x=0; x<dw; x++) 
            {   this.map[x+y*MAPWIDTH] = this.level.mapdata[x+y*dw];
            }
        }               
        for (var i=0; i<this.counters.length; i++) this.counters[i]=0;

        // init start positions of players
        var populatedwidth = this.level.datawidth;
        for (var y=this.level.dataheight-1; y>=0; y--)
        {   for (var x=0; x<populatedwidth; x++)
            {   if (is(x,y,MAN1))
                {   this.counters[CTR_MANPOSX1] = x;
                    this.counters[CTR_MANPOSY1] = y;
                }
                else if (is(x,y,MAN2))
                {   counters[CTR_MANPOSX2] = x;
                    counters[CTR_MANPOSY2] = y; 
                    this.numberofplayers = 2;            
                }
            }
        }
                        
        this.counters[CTR_RANDOMSEED] = this.walk.getRandomSeed() & 0xffff;
        this.counters[CTR_EMERALDSTOOMUCH] = this.level.calculateMaximumLoot(true) - this.level.loot;
};

    
    // progress the game logic by one turn. everything that happens in the
    // game is also recorded in the transaction buffer.
    // the keep-location is set in the transaction buffer to point at the
    // first transaction which will set to a TRN_STARTOFTURN value.
Logic.prototype.computeturn = function()
{
        // everything from previous step may be deleted if necessary
        this.transactions.mayDiscard(this.transactions.size());
        this.transactions.push (TRN_STARTOFTURN);

        // clear the array of the moved flags
        for (var i=0; i<this.hasmoved.length; i++) 
        {   this.hasmoved[i] = false;
        }
        
        // special handling if man1 moves towards man2:  man2 will move first to allow close proximity while walking
        int num = this.getNumberOfPlayers();
        if (num==2 && this.man1_moves_toward_man2())
        {   this.playermove(1);
            this.playermove(0);
        }
        else
        {   for (var p=0; p<num; p++)
            {   this.playermove(p);      
            }
        }
        
        // after the players, all the pieces move
        this.piecesmove();           
        
        this.turnsdone++;
};

Logic.prototype.piecesmove = function()
    {
        // for the case a random decision is needed, take the value of the random seed counter
        var randomseed = this.counters[CTR_RANDOMSEED];
    
        // only pieces inside the populated area can actually move
        var populatedwidth = this.level.datawidth;
        for (var y=this.level.dataheight-1; y>=0; y--)
        {   for (var x=0; x<this.populatedwidth; x++)
            {   
                // when found a flag on a piece while processing, this piece must
                // not be moved in this turn again
                if (this.hasmoved(x,y))
                {   continue;
                }
                
                // huge decision - tree what to do with each piece 
                switch (this.piece(x,y))
                {   case DOOR:
                        if (this.counters[CTR_EMERALDSCOLLECTED]>=this.level.loot)
                        {   this.transform(x,y, DOOR_OPENED);
                        }
                        break;
                    case DOOR_CLOSING:
                        this.transform(x,y, DOOR_CLOSED);                        
                        break;
                    case ROCK:
                    {   if (this.is(x,y+1,AIR))
                        {   this.move(x,y, 0,1, ROCK_FALLING);
                        }
                        else if (this.is(x,y+1,SAND))
                        {   this.move(x,y, 0,1, ROCK);
                            this.transform(x,y+1, SAND_FULL);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,ROCK);
                            this.transform(x,y+1, ACID);                          
                        }
                        else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                        {   this.move (x,y,0,2,EMERALD_FALLING);
                            this.highlight (x,y+1, CONVERTER);                       
                        }
                        else if (this.may_roll_to_left(x,y+1, true))
                        {   this.move(x,y, -1,0,ROCK_FALLING);
                        }
                        else if (this.may_roll_to_right(x,y+1, true))
                        {   this.move(x,y, 1,0,ROCK_FALLING);
                        }
                        break;
                    }
                    case ROCK_FALLING:
                    {
                        if (!this.is_hit_by_non_bomb(x,y+1, ROCK_FALLING))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1,ROCK_FALLING);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,ROCK);     
                                this.transform(x,y+1,ACID);                      
                            }
                            else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                            {   this.move (x,y, 0,2,EMERALD_FALLING);
                                this.highlight (x,y+1, CONVERTER);                       
                            }
                            else if (this.is(x,y+1,CUSHION))
                            {   this.changestate(x,y,ROCK);
                                this.transform(x,y+1, CUSHION_BUMPING);
                                this.transform(x,y+1, CUSHION);
                            }
                            else
                            {   this.changestate(x,y,ROCK);
                            }
                        }
                        break;
                    }
                    case ROCKEMERALD:
                    {   if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,ROCKEMERALD_FALLING);
                        }
                        else if (this.is(x,y+1,SAND))
                        {   this.move(x,y,0,1,ROCKEMERALD);
                            this.transform(x,y+1,SAND_FULLEMERALD);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,ROCKEMERALD);
                            this.transform(x,y+1,ACID);  
                            this.changecounter(CTR_EMERALDSTOOMUCH,-1);                      
                        }
                        else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                        {   this.move (x,y,0,2,EMERALD_FALLING);
                            this.highlight (x,y+1, CONVERTER);                       
                        }
                        else if (this.may_roll_to_left(x,y+1, true))
                        {   this.move(x,y,-1,0,ROCKEMERALD_FALLING);
                        }
                        else if (this.may_roll_to_right(x,y+1, true))
                        {   this.move(x,y,1,0,ROCKEMERALD_FALLING);
                        }
                        break;
                    }
                    case ROCKEMERALD_FALLING:
                    {
                        if (!this.is_hit_by_non_bomb(x,y+1, ROCKEMERALD_FALLING))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1,ROCKEMERALD_FALLING);
                            }
                            else if (this.is(x,y+1,SAND))
                            {   this.move(x,y,0,1,ROCKEMERALD);
                                this.transform(x,y+1,SAND_FULLEMERALD);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,ROCKEMERALD);      
                                this.transform(x,y+1,ACID);  
                                this.changecounter(CTR_EMERALDSTOOMUCH,-1);                  
                            }
                            else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                            {   this.move (x,y,0,2,EMERALD_FALLING);
                                this.highlight (x,y+1, CONVERTER);                       
                            }
                            else if (this.is(x,y+1,CUSHION))
                            {   this.changestate(x,y,ROCKEMERALD);
                                this.transform(x,y+1, CUSHION_BUMPING);
                                this.transform(x,y+1, CUSHION);
                            }
                            else
                            {   this.changestate(x,y,ROCKEMERALD);
                            }
                        }
                        break;
                    }
                    case SAND_FULL:
                    {   if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,ROCK_FALLING);
                            this.transform(x,y,SAND);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,ROCK_FALLING);
                            this.transform(x,y, SAND);
                            this.transform(x,y+1, ACID);
                        }
                        else if (this.is(x,y+1,SAND))
                        {   this.move(x,y,0,1,ROCK);
                            this.transform(x,y, SAND);
                            this.transform(x,y+1, SAND_FULL);
                        }
                        break;
                    }
                    case SAND_FULLEMERALD:
                    {   if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,ROCKEMERALD_FALLING);
                            this.transform(x,y, SAND);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,ROCKEMERALD_FALLING);
                            this.transform(x,y, SAND);
                            this.transform(x,y+1, ACID);
                        }
                        else if (is(x,y+1,SAND))
                        {   this.move(x,y,0,1, ROCKEMERALD);
                            this.transform(x,y, SAND);
                            this.transform(x,y+1, SAND_FULLEMERALD);                     
                        }
                        break;
                    }
                    case EMERALD:
                    {   if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,EMERALD_FALLING);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,EMERALD);
                            this.transform(x,y+1,ACID);                          
                            this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                        }
                        else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                        {   this.move (x,y,0,2,SAPPHIRE_FALLING);
                            this.highlight (x,y+1, CONVERTER);
                        }
                        else if (this.may_roll_to_left(x,y+1, true))
                        {   this.move(x,y,-1,0,EMERALD_FALLING);
                        }
                        else if (this.may_roll_to_right(x,y+1, true))
                        {   this.move(x,y,1,0,EMERALD_FALLING);
                        }
                        else 
                        {
                            this.visualrandomseed = this.nextrandomseed(this.visualrandomseed);
                            if ((this.visualrandomseed & 31) == 0)
                            {
                                this.highlight(x,y,EMERALD);
                            }                               
                        }
                        break;
                    }
                    case EMERALD_FALLING:
                    {
                        if (!this.is_hit_by_non_bomb(x,y+1, EMERALD_FALLING))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1,EMERALD_FALLING);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,EMERALD);
                                this.transform(x,y+1,ACID);                          
                                this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                            }
                            else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                            {   this.move (x,y,0,2,SAPPHIRE_FALLING);
                                this.highlight (x,y+1, CONVERTER);                       
                            }
                            else if (this.is(x,y+1,CUSHION))
                            {   this.changestate(x,y,EMERALD);
                                this.transform(x,y+1, CUSHION_BUMPING);
                                this.transform(x,y+1, CUSHION);
                            }
                            else
                            {   this.changestate(x,y,EMERALD);
                            }
                        }
                        break;
                    }
                    case SAPPHIRE:
                    {   if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,SAPPHIRE_FALLING);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,SAPPHIRE);
                            this.transform(x,y+1,ACID);                      
                            this.changecounter(CTR_EMERALDSTOOMUCH,-2);
                        }
                        else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                        {   this.move (x,y,0,2,CITRINE_FALLING);
                            this.highlight (x,y+1, CONVERTER);                       
                        }
                        else if (this.may_roll_to_left(x,y+1, true))
                        {   this.move(x,y,-1,0,SAPPHIRE_FALLING);
                        }
                        else if (this.may_roll_to_right(x,y+1, true))
                        {   this.move(x,y,1,0,SAPPHIRE_FALLING);
                        }
                        else 
                        {
                            this.visualrandomseed = this.nextrandomseed(this.visualrandomseed);
                            if ((this.visualrandomseed & 31) == 0)
                            {
                                this.highlight(x,y,SAPPHIRE);
                            }                               
                        }
                        break;
                    }
                    case SAPPHIRE_FALLING:
                    {   if (!this.is_hit_by_non_bomb(x,y+1,SAPPHIRE_FALLING))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1, SAPPHIRE_FALLING);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,SAPPHIRE);
                                this.transform(x,y+1,ACID);                          
                                this.changecounter(CTR_EMERALDSTOOMUCH,-2);
                            }
                            else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                            {   this.move (x,y,0,2,CITRINE_FALLING);
                                this.highlight (x,y+1, CONVERTER);                       
                            }
                            else if (this.is(x,y+1,CUSHION))
                            {   this.changestate(x,y,SAPPHIRE);
                                this.transform(x,y+1, CUSHION_BUMPING);
                                this.transform(x,y+1, CUSHION);
                            }
                            else
                            {   this.changestate(x,y,SAPPHIRE);
                            }
                        }
                        break;
                    }
                    case SAPPHIRE_BREAKING:
                    {   this.transform(x,y, AIR);
                        break;
                    }
                    case CITRINE:
                    {   if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,CITRINE_FALLING);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,CITRINE);
                            this.transform(x,y+1,ACID);                          
                            this.changecounter(CTR_EMERALDSTOOMUCH,-3);
                        }
                        else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                        {   this.move (x,y, 0,2,CITRINE_FALLING);
                            this.highlight (x,y+1, CONVERTER);                       
                        }
                        else if (this.may_roll_to_left(x,y+1, true))
                        {   this.move(x,y,-1,0,CITRINE_FALLING);
                        }
                        else if (this.may_roll_to_right(x,y+1, true))
                        {   this.move(x,y,1,0,CITRINE_FALLING);
                        }
                        else 
                        {
                            this.visualrandomseed = this.nextrandomseed(this.visualrandomseed);
                            if ((this.visualrandomseed & 31) == 0)
                            {
                                this.highlight(x,y,CITRINE);
                            }                               
                        }
                        break;
                    }
                    case CITRINE_FALLING:
                    {   if (!this.is_hit_by_non_bomb(x,y+1,CITRINE_FALLING))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1,CITRINE_FALLING);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,CITRINE);
                                this.transform(x,y+1,ACID);                          
                                this.changecounter(CTR_EMERALDSTOOMUCH,-3);
                            }
                            else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                            {   this.move (x,y,0,2,CITRINE_FALLING);
                                this.highlight (x,y+1, CONVERTER);                       
                            }
                            else if (this.is(x,y+1,CUSHION))
                            {   this.changestate(x,y,CITRINE);
                                this.transform(x,y+1, CUSHION_BUMPING);
                                this.transform(x,y+1, CUSHION);
                            }
                            else
                            {   this.changestate(x,y,CITRINE_BREAKING);
                                this.transform(x,y,AIR);
                                this.changecounter(CTR_EMERALDSTOOMUCH, -4);
                            }
                        }
                        break;
                    }
                    case CITRINE_BREAKING:
                    {   this.transform(x,y,AIR);
                        break;
                    }
                    case RUBY:
                    {   if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,RUBY_FALLING);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,RUBY);
                            this.transform(x,y+1,ACID);                          
                            this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                        }
                        else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                        {   this.move (x,y,0,2,SAPPHIRE_FALLING);
                            this.highlight (x,y+1,CONVERTER);                        
                        }
                        else if (this.may_roll_to_left(x,y+1, true))
                        {   this.move(x,y,-1,0,RUBY_FALLING);
                        }
                        else if (this.may_roll_to_right(x,y+1, true))
                        {   this.move(x,y,1,0,RUBY_FALLING);
                        }
                        else 
                        {
                            this.visualrandomseed = this.nextrandomseed(this.visualrandomseed);
                            if ((this.visualrandomseed & 31) == 0)
                            {
                                this.highlight(x,y,RUBY);
                            }                               
                        }
                        break;
                    }
                    case RUBY_FALLING:
                    {
                        if (!this.is_hit_by_non_bomb(x,y+1, RUBY_FALLING))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1,RUBY_FALLING);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,RUBY);
                                this.transform(x,y+1,ACID);                          
                                this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                            }
                            else if (this.is(x,y+1,CONVERTER) && this.is(x,y+2,AIR))
                            {   this.move (x,y,0,2,SAPPHIRE_FALLING);
                                this.highlight (x,y+1, CONVERTER);                       
                            }
                            else if (this.is(x,y+1,CUSHION))
                            {   this.changestate(x,y,RUBY);
                                this.transform(x,y+1, CUSHION_BUMPING);
                                this.transform(x,y+1, CUSHION);
                            }
                            else
                            {   this.changestate(x,y,RUBY);
                            }
                        }
                        break;
                    }
                    case BAG:
                    {   if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,BAG_FALLING);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,BAG);
                            this.transform(x,y+1,ACID);                          
                            this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                        }
                        else if (this.may_roll_to_left(x,y+1, false))
                        {   this.move(x,y,-1,0,BAG_FALLING);
                        }
                        else if (this.may_roll_to_right(x,y+1, false))
                        {   this.move(x,y,1,0,BAG_FALLING);
                        }
                        break;
                    }
                    case BAG_FALLING:
                    {
                        if (!this.is_hit_by_non_bomb(x,y+1, BAG_FALLING))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1,BAG_FALLING);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,BAG);
                                this.transform(x,y+1,ACID);  
                                this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                            }
                            else if (this.is(x,y+1,CUSHION))
                            {   this.changestate(x,y, BAG);
                                this.transform(x,y+1, CUSHION_BUMPING);
                                this.transform(x,y+1, CUSHION);
                            }
                            else
                            {   this.changestate(x,y,BAG);
                            }
                        }
                        break;
                    }
                    case BAG_OPENING:
                    {   this.transform(x,y, EMERALD);
                        break;
                    }                               
                    

                    case BOMB:
                    {   if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,BOMB_FALLING);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,BOMB);
                            this.transform(x,y+1,ACID);                          
                        }
                        else if (this.may_roll_to_left(x,y+1, false))
                        {   this.move(x,y,-1,0,BOMB_FALLING);
                        }
                        else if (this.may_roll_to_right(x,y+1, false))
                        {   this.move(x,y,1,0,BOMB_FALLING);
                        }
                        break;
                    }
                    case BOMB_FALLING:
                        if (this.is(x,y+1,AIR))
                        {   this.move(x,y,0,1,BOMB_FALLING);
                        }
                        else if (this.is(x,y+1,ACID))
                        {   this.move(x,y,0,1,BOMB);
                            this.transform(x,y+1,ACID);                          
                        }
                        else if (this.is(x,y+1,CUSHION))
                        {   this.changestate(x,y,BOMB);
                            this.transform(x,y+1, CUSHION_BUMPING);
                            this.transform(x,y+1, CUSHION);
                        }
                        else if (this.is_living(x,y+1))
                        {   this.explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
                        }
                        else 
                        {   this.transform(x,y, BOMB_EXPLODE);
                        }
                        break;

                    case SWAMP_UP:
                    case SWAMP_LEFT:
                    case SWAMP_RIGHT:
                    case SWAMP_DOWN:
                        this.transform(x,y, SWAMP);
                        //$FALL-THROUGH$                            
                    case SWAMP:                     
                        if (this.level.swamprate>0)
                        {   randomseed = this.nextrandomseed(randomseed);
                            switch (randomseed % (4*this.level.getSwampRate()))
                            {   case 0: 
                                    this.highlight(x,y, SWAMP);
                                    if (this.is(x,y-1,EARTH))
                                    {   this.highlight(x,y-1, EARTH);
                                        this.transform(x,y-1, SWAMP_UP);
                                    }
                                    else if(this.is(x,y-1,AIR))
                                    {   this.transform(x,y-1, SWAMP_UP);                                 
                                    }
                                    break;
                                case 1:
                                    this.highlight(x,y, SWAMP);
                                    if (this.is(x-1,y,EARTH))
                                    {   this.highlight(x-1,y, EARTH);
                                        this.transform(x-1,y, SWAMP_LEFT);
                                    }
                                    else if (this.is(x-1,y,AIR))
                                    {   this.transform(x-1,y, SWAMP_LEFT);
                                        this.transform(x-1,y, DROP);     
                                    }
                                    break;
                                case 2:
                                    this.highlight(x,y, SWAMP);
                                    if (this.is(x+1,y,EARTH))
                                    {   this.highlight(x+1,y, EARTH);
                                        this.transform(x+1,y, SWAMP_RIGHT);                                  
                                    }
                                    else if (this.is(x+1,y,AIR))
                                    {   this.transform(x+1,y, SWAMP_RIGHT);
                                        this.transform(x+1,y, DROP);                                 
                                    }
                                    break;
                                case 3:
                                    this.highlight(x,y,SWAMP);
                                    if (this.is(x,y+1,EARTH))
                                    {   this.highlight(x,y+1, EARTH);
                                        this.transform(x,y+1, SWAMP_DOWN);                                                                   
                                    }
                                    else if (this.is(x,y+1,AIR))
                                    {   this.transform(x,y+1, DROP);                                 
                                    }
                                    break;
                                
                            }
                        }
                        break;
                        
                    case DROP:
                        if (!this.is_hit_by_non_bomb(x,y+1, DROP))
                        {   if (this.is(x,y+1,AIR))
                            {   this.move(x,y,0,1,DROP);
                            }
                            else if (this.is(x,y+1,ACID))
                            {   this.move(x,y,0,1,DROP);
                                this.transform(x,y+1,ACID);                          
                            }
                            else
                            {   this.transform(x,y, SWAMP);
                            }
                        }
                        break;                      
                        
                    case LORRYLEFT:
                    case LORRYLEFT_FIXED:
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x-1,y))
                        {   this.explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
                        }                       
                        else if (this.is(x,y+1,AIR) && this.is(x,y,LORRYLEFT)) 
                        {   this.transform(x,y,LORRYDOWN_FIXED);
                        }
                        else if (!this.is(x-1,y,AIR)) 
                        {   this.transform(x,y, LORRYUP);
                        }
                        else 
                        {   this.move(x,y,-1,0,LORRYLEFT);
                        }
                        break;
                    }
                    case LORRYUP:
                    case LORRYUP_FIXED:  
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x,y-1))
                        {   this.explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
                        }                       
                        else if (this.is(x-1,y,AIR) && this.is(x,y,LORRYUP)) 
                        {   this.transform(x,y,LORRYLEFT_FIXED);
                        } 
                        else if (!this.is(x,y-1,AIR)) 
                        {   this.transform(x,y,LORRYRIGHT);
                        }
                        else
                        {   this.move(x,y,0,-1, LORRYUP);
                        }
                        break;
                    }
                    case LORRYRIGHT:
                    case LORRYRIGHT_FIXED:
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x+1,y))
                        {   this.explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
                        }                       
                        else if (this.is(x,y-1,AIR) && this.is(x,y,LORRYRIGHT)) 
                        {   this.transform(x,y,LORRYUP_FIXED);
                        }
                        else if (!this.is(x+1,y,AIR)) 
                        {   this.transform(x,y, LORRYDOWN);
                        }
                        else 
                        {   this.move(x,y, 1,0, LORRYRIGHT);
                        }   
                        break;
                    }
                    case LORRYDOWN:
                    case LORRYDOWN_FIXED:
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x,y+1))
                        {   this.explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
                        }                       
                        else if (this.is(x+1,y,AIR) && this.is(x,y,LORRYDOWN)) 
                        {   this.transform(x,y, LORRYRIGHT_FIXED);
                        }
                        else if (!this.is(x,y+1,AIR)) 
                        {   this.transform(x,y,LORRYLEFT);
                        }
                        else                        
                        {   this.move(x,y, 0,1,LORRYDOWN);
                        }
                        break;
                    }   
                    case BUGLEFT:
                    case BUGLEFT_FIXED:
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x-1,y))
                        {   this.explode3x3(x,y, EXPLODE1_SAPPHIRE, EXPLODE1_EMERALD);
                        }                       
                        else if (this.is(x,y-1,AIR) && this.is(x,y,BUGLEFT)) 
                        {   this.transform(x,y, BUGUP_FIXED);
                        } 
                        else if (!this.is(x-1,y,AIR)) 
                        {   this.transform(x,y,BUGDOWN);
                        } 
                        else 
                        {   this.move(x,y,-1,0,BUGLEFT);
                        }
                        break;
                    }
                    case BUGUP:
                    case BUGUP_FIXED:  
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x,y-1))
                        {   this.explode3x3(x,y, EXPLODE1_SAPPHIRE, EXPLODE1_EMERALD);
                        }
                        else if (this.is(x+1,y,AIR) && this.is(x,y,BUGUP)) 
                        {   this.transform(x,y, BUGRIGHT_FIXED);
                        } 
                        else if (!this.is(x,y-1,AIR)) 
                        {   this.transform(x,y, BUGLEFT);
                        } 
                        else 
                        {   this.move(x,y,0,-1,BUGUP);
                        }
                        break;
                    }
                    case BUGRIGHT:
                    case BUGRIGHT_FIXED:
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x+1,y))
                        {   this.explode3x3(x,y, EXPLODE1_SAPPHIRE, EXPLODE1_EMERALD);
                        }                                                   
                        else if (this.is(x,y+1,AIR) && this.is(x,y,BUGRIGHT)) 
                        {   this.transform(x,y, BUGDOWN_FIXED);
                        }
                        else if (!this.is(x+1,y,AIR)) 
                        {   this.transform(x,y, BUGUP);
                        } 
                        else 
                        {   this.move(x,y, 1,0, BUGRIGHT);
                        }                       
                        break;
                    }
                    case BUGDOWN:
                    case BUGDOWN_FIXED:
                    {   if (this.is_neardestruct_target(x,y) || this.is_player_piece_at(x,y+1))
                        {   this.explode3x3(x,y, EXPLODE1_SAPPHIRE, EXPLODE1_EMERALD);
                        }                                                   
                        else if (this.is(x-1,y,AIR) && this.is(x,y,BUGDOWN)) {
                            this.transform(x,y,BUGLEFT_FIXED);
                        } 
                        else if (!this.is(x,y+1,AIR)) {
                            this.transform(x,y, BUGRIGHT);
                        } 
                        else
                        {   this.move(x,y, 0,1, BUGDOWN);
                        }
                        break;
                    }

                    case YAMYAMLEFT:
                    case YAMYAMRIGHT:
                    case YAMYAMUP:
                    case YAMYAMDOWN:
                    {   var ypiece = this.piece(x,y); 
                        var dx = (ypiece==YAMYAMLEFT) ? -1 : (ypiece==YAMYAMRIGHT) ? 1 : 0;
                        var dy = (ypiece==YAMYAMUP) ? -1 : (ypiece==YAMYAMDOWN) ? 1 : 0;                        
//                      if (is_neardestruct_target(x,y)) 
//                      {   explode3x3(x,y, EXPLODE1_RUBY, EXPLODE1_EMERALD);
//                      }
                        if (this.is_player_piece_at(x+dx,y+dy)) 
                        {   this.move (x,y, dx,dy, ypiece);
                            this.transform (x+dx,y+dy, EXPLODE1_RUBY);
                        }
                        else if (this.is(x+dx,y+dy,AIR))
                        {   this.move(x,y, dx,dy, ypiece);
                        }
                        else if (this.is(x+dx,y+dy,SAPPHIRE))
                        {   this.transform (x+dx,y+dy, AIR);
                            this.highlight(x,y, ypiece);
                            this.changecounter(CTR_EMERALDSTOOMUCH, -2); 
                        }
                        else
                        {   randomseed = nextrandomseed(randomseed);
                            switch (randomseed % 4)
                            {   case 0:  this.transform(x,y, YAMYAMLEFT);    break;
                                case 1:  this.transform(x,y, YAMYAMRIGHT);   break;
                                case 2:  this.transform(x,y, YAMYAMUP);  break;
                                case 3:  this.transform(x,y, YAMYAMDOWN);    break;
                            }
                            this.highlight(x,y, piece(x,y));                     
                        }
                        break;                      
                    }
                    
                    case ROBOT:
                    {       // determine position of nearest player
                            var nearx = 1000;
                            var neary = 1000;
                            for (var i=0; i<this.getNumberOfPlayers(); i++)
                            {   var px = this.getCounterAtStartOfTurn(CTR_MANPOSX1+i);       
                                var py = this.getCounterAtStartOfTurn(CTR_MANPOSY1+i);
                                if (Math.abs(px-x)+Math.abs(py-y) < Math.abs(nearx-x)+Math.abs(neary-y))
                                {   nearx = px;
                                    neary = py;
                                }
                            }
                            // determine direction to let robot walk
                            var dirx = 0;
                            var diry = 0;
                            var secdirx = 0;
                            var secdiry = 0;
                            if (Math.abs(neary-y)>Math.abs(nearx-x))
                            {   diry = neary<y ? -1 : 1;  // primary direction
                                secdirx = nearx<x ? -1 : (nearx>x ? 1 : 0);                         
                            }
                            else if (nearx!=x)
                            {   dirx = nearx<x ? -1 : 1;                    
                                secdiry = neary<y ? -1 : (neary>y ? 1 : 0);     
                            }
                            if (dirx!=0 || diry!=0)
                            {   if (this.is_player_piece_at(x+dirx,y+diry)) 
                                {   this.move (x,y, dirx,diry, ROBOT);
                                    this.transform (x+dirx,y+diry, EXPLODE1_AIR);
                                }
                                else if (this.is(x+dirx,y+diry,AIR) && !this.hasmoved(x+dirx,y+diry))
                                {   this.move (x,y,dirx,diry, ROBOT);
                                }
                                else if (this.is(x+secdirx,y+secdiry,AIR) && !this.hasmoved(x+secdirx,y+secdiry))
                                {   this.move (x,y, secdirx,secdiry, ROBOT);
                                }
                            }
                        //}
                        break;
                    }   
                    case ELEVATOR:
                    case ELEVATOR_TOLEFT:
                    case ELEVATOR_TORIGHT:
                        {   var lpiece = this.piece(x,y-1);
                            if (lpiece==EMERALD || lpiece==SAPPHIRE || lpiece==CITRINE || lpiece==RUBY || lpiece==BAG || lpiece==ROCK || lpiece==ROCKEMERALD || lpiece==BOMB)
                            {   if (!this.hasmoved(x,y-1) && this.is(x,y-2,AIR) )
                                {   this.move (x,y-1, 0,-1, lpiece);
                                    this.move (x,y, 0,-1, this.piece(x,y));
                                }
                            }
                            else if (lpiece==EMERALD_FALLING || lpiece==SAPPHIRE_FALLING || lpiece==CITRINE_FALLING || lpiece==RUBY_FALLING || lpiece==BAG_FALLING 
                            || lpiece==ROCKEMERALD_FALLING || lpiece==BOMB_FALLING || lpiece==BAG_OPENING || lpiece==SAPPHIRE_BREAKING)
                            {   // do not move down
                            }
                            else if (this.is(x,y+1,AIR))
                            {   this.move (x,y, 0,1, this.piece(x,y));
                            }
                        }
                        break;
                        
                    case DOOR_OPENED:
                        if (this.isSolved() && this.timeSinceAllExited()>1)
                        {   this.transform(x,y,DOOR_CLOSED);
                        }
                        break;
                        
                        // various incarnations of the gun that fire in proper sequence
                    case GUN0:
                        if (this.turnsdone%4 == 0)
                        {   this.add_laser_beam(x,y-1, 0,-1);                            
                            this.highlight(x,y,GUN0);
                        }                       
                        break;
                    case GUN1:
                        if (this.turnsdone%4 == 1)
                        {   this.add_laser_beam(x,y-1, 0,-1);                            
                            this.highlight(x,y,GUN1);
                        }
                        break;
                    case GUN2:
                        if (this.turnsdone%4 == 2)
                        {   this.add_laser_beam(x,y-1, 0,-1);                            
                            this.highlight(x,y,GUN2);
                        }
                        break;
                    case GUN3:
                        if (this.turnsdone%4 == 3)
                        {   this.add_laser_beam(x,y-1, 0,-1);                            
                            this.highlight(x,y,GUN3);
                        }
                        break;
                        
                    case BOMB_EXPLODE:
                        this.explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
                        break;
                    case TIMEBOMB_EXPLODE:
                        this.explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
                        break;
                    case LORRY_EXPLODE:
                        this.explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
                        break;
                    case BUG_EXPLODE:
                        this.explode3x3(x,y, EXPLODE1_SAPPHIRE, EXPLODE1_EMERALD);
                        break;
                    case BIGBOMB_EXPLODE:
                        this.explode5x5(x,y, EXPLODE1_TNT, EXPLODE1_TNT, EXPLODE1_AIR);
                        break;
                        
                    case EXPLODE1_AIR:
                        this.transform(x,y, EXPLODE2_AIR);
                        break;
                    case EXPLODE2_AIR:
                        this.transform(x,y, EXPLODE3_AIR);
                        break;
                    case EXPLODE3_AIR:
                        this.transform(x,y, EXPLODE4_AIR);
                        break;
                    case EXPLODE4_AIR:
                        this.transform(x,y, AIR);
                        break;

                    case EXPLODE1_TNT:
                        this.transform(x,y, EXPLODE2_TNT);
                        break;
                    case EXPLODE2_TNT:
                        this.transform(x,y, EXPLODE3_TNT);
                        break;
                    case EXPLODE3_TNT:
                        this.transform(x,y, EXPLODE4_TNT);
                        break;
                    case EXPLODE4_TNT:
                        this.transform(x,y, AIR);
                        break;
                        
                    case EXPLODE1_EMERALD:
                        this.transform(x,y, EXPLODE2_EMERALD);
                        break;
                    case EXPLODE2_EMERALD:
                        this.transform(x,y, EXPLODE3_EMERALD);
                        break;
                    case EXPLODE3_EMERALD:
                        this.transform(x,y, EXPLODE4_EMERALD);
                        break;
                    case EXPLODE4_EMERALD:
                        this.transform(x,y, EMERALD);
                        break;

                    case EXPLODE1_SAPPHIRE:
                        this.transform(x,y, EXPLODE2_SAPPHIRE);
                        break;
                    case EXPLODE2_SAPPHIRE:
                        this.transform(x,y, EXPLODE3_SAPPHIRE);
                        break;
                    case EXPLODE3_SAPPHIRE:
                        this.transform(x,y, EXPLODE4_SAPPHIRE);
                        break;
                    case EXPLODE4_SAPPHIRE:
                        this.transform(x,y, SAPPHIRE);
                        break;

                    case EXPLODE1_RUBY:
                        this.transform(x,y, EXPLODE2_RUBY);
                        break;
                    case EXPLODE2_RUBY:
                        this.transform(x,y, EXPLODE3_RUBY);
                        break;
                    case EXPLODE3_RUBY:
                        this.transform(x,y, EXPLODE4_RUBY);
                        break;
                    case EXPLODE4_RUBY:
                        this.transform(x,y, RUBY);
                        break;

                    case EXPLODE1_BAG:
                        this.transform(x,y, EXPLODE2_BAG);
                        break;
                    case EXPLODE2_BAG:
                        this.transform(x,y, EXPLODE3_BAG);
                        break;
                    case EXPLODE3_BAG:
                        this.transform(x,y, EXPLODE4_BAG);
                        break;
                    case EXPLODE4_BAG:
                        this.transform(x,y, BAG);
                        break;

                    case ACTIVEBOMB5:
                        this.transform(x,y, ACTIVEBOMB4);
                        break;
                    case ACTIVEBOMB4:
                        this.transform(x,y, ACTIVEBOMB3);
                        break;
                    case ACTIVEBOMB3:
                        this.transform(x,y, ACTIVEBOMB2);
                        break;
                    case ACTIVEBOMB2:
                        this.transform(x,y, ACTIVEBOMB1);
                        break;
                    case ACTIVEBOMB1:
                        this.transform(x,y, ACTIVEBOMB0);
                        break;
                    case ACTIVEBOMB0:
                        this.explode3x3(x,y, EXPLODE1_AIR, EXPLODE1_AIR);
                        break;
                }           
            }
        }
        
        // if the random seed got modified during the logic, need to store it back to the counters array
        if (randomseed != counters[CTR_RANDOMSEED])
        {   changecounter(CTR_RANDOMSEED, randomseed-counters[CTR_RANDOMSEED]);
        }
};
    
Logic.prototype.explode3x3 = function(x, y, centerdebris, outerdebris)
{
        this.transform(x,y, centerdebris);
        this.catch_in_explosion(x-1,y-1, outerdebris, false, 0,0);
        this.catch_in_explosion(x,y-1, outerdebris, false, 0,-1);
        this.catch_in_explosion(x+1,y-1, outerdebris, false, 0,0);
        this.catch_in_explosion(x-1,y, outerdebris, false, -1,0);
        this.catch_in_explosion(x+1,y, outerdebris, false, 1,0);
        this.catch_in_explosion(x-1,y+1, outerdebris, false, 0,0);
        this.catch_in_explosion(x,y+1, outerdebris, false, 0,1);
        this.catch_in_explosion(x+1,y+1, outerdebris, false, 0,0);
};
    
Logic.prototype.explode5x5 = function(x, y, centerdebris, outerdebris, rimdebris)
{
        this.transform(x,y, centerdebris);
        this.catch_in_explosion(x-1,y-1, outerdebris, true, 0,0);
        this.catch_in_explosion(x,y-1, outerdebris, true, 0,-1);
        this.catch_in_explosion(x+1,y-1, outerdebris, true, 0,0);
        this.catch_in_explosion(x-1,y, outerdebris, true, 0,-1);
        this.catch_in_explosion(x+1,y, outerdebris, true, 1,0);
        this.catch_in_explosion(x-1,y+1, outerdebris, true, 0,0);
        this.catch_in_explosion(x,y+1, outerdebris, true, 0,1);
        this.catch_in_explosion(x+1,y+1, outerdebris, true, 0,0);        
        this.catch_in_explosion(x-1,y-2, rimdebris, false, 0,0);
        this.catch_in_explosion(x,y-2, rimdebris, false, 0,-1);
        this.catch_in_explosion(x+1,y-2, rimdebris, false, 0,0);
        this.catch_in_explosion(x+2,y-1, rimdebris, false, 0,0);
        this.catch_in_explosion(x+2,y, rimdebris, false, 1,0);
        this.catch_in_explosion(x+2,y+1, rimdebris, false, 0,0);
        this.catch_in_explosion(x-2,y-1, rimdebris, false, 0,0);
        this.catch_in_explosion(x-2,y, rimdebris, false, 0,-1);
        this.catch_in_explosion(x-2,y+1, rimdebris, false, 0,0);
        this.catch_in_explosion(x-1,y+2, rimdebris, false, 0,0);
        this.catch_in_explosion(x,y+2, rimdebris, false, 0,1);
        this.catch_in_explosion(x+1,y+2, rimdebris, false, 0,0);
};
    
Logic.prototype.catch_in_explosion = function(x, y, debris, totalexplode, outwarddirectionx, outwarddirectiony)
{
        switch(this.piece(x,y))
        {   case OUTSIDE:               
                this.can_not_create_debris(debris);
                break;      // will not be blasted
            case WALL:
            case ROUNDWALL:
            case GLASSWALL:
                if (totalexplode)
                {   this.transform(x,y,debris);      // will only be blasted by big explosions
                }
                else
                {   this.can_not_create_debris(debris);
                }
                break;
            case TIMEBOMB_EXPLODE:
            case BOMB_EXPLODE:
            case BIGBOMB_EXPLODE:
//          case YAMYAM_EXPLODE: 
            case BUG_EXPLODE:
            case LORRY_EXPLODE:
                this.can_not_create_debris(debris);      
                break;     // will explode anyway
            case BOMB:
            case BOMB_FALLING:
                this.can_not_create_debris(debris);
                this.transform(x,y, BOMB_EXPLODE);   // will explode in next turn
                break;
            case TIMEBOMB:
            case ACTIVEBOMB0:
            case ACTIVEBOMB1:
            case ACTIVEBOMB2:
            case ACTIVEBOMB3:
            case ACTIVEBOMB4:
            case ACTIVEBOMB5:   
                this.can_not_create_debris(debris);
                this.transform(x,y, TIMEBOMB_EXPLODE);   // will explode in next turn
                break;
            case TIMEBOMB10:
                this.can_not_create_debris(debris);
                this.transform(x,y, BIGBOMB_EXPLODE);  // will explode in next turn
                break;
            case LORRYLEFT:
            case LORRYLEFT_FIXED:
            case LORRYRIGHT:
            case LORRYRIGHT_FIXED:
            case LORRYUP:
            case LORRYUP_FIXED:
            case LORRYDOWN:
            case LORRYDOWN_FIXED:  
                this.can_not_create_debris(debris);
                this.transform(x,y, LORRY_EXPLODE);     // will explode in next turn
                break;
            case BUGLEFT:
            case BUGLEFT_FIXED:
            case BUGRIGHT:
            case BUGRIGHT_FIXED:
            case BUGUP:
            case BUGUP_FIXED:
            case BUGDOWN:
            case BUGDOWN_FIXED:
                this.can_not_create_debris(debris);
                this.transform(x,y, BUG_EXPLODE);        // will explode in next turn
                break;
            case YAMYAMLEFT:
            case YAMYAMRIGHT:
            case YAMYAMUP:
            case YAMYAMDOWN:    
                this.can_not_create_debris(debris);
                this.transform(x,y, EXPLODE1_RUBY);      // will turn into ruby after explosion
                break;
            case WALLEMERALD:            
                this.can_not_create_debris(debris);
                this.transform(x,y, EXPLODE1_EMERALD);    // will turn into emerald after explosion
                break;
            case ROCKEMERALD: 
                this.can_not_create_debris(debris);
                this.transform(x,y, EXPLODE1_EMERALD);  // will turn into emerald after explosion
                break;
            case SAND_FULLEMERALD:
                this.can_not_create_debris(debris);
                this.transform(x,y, EXPLODE1_EMERALD);    // will turn into emerald after explosion
                break;              
            case BOX: 
                this.can_not_create_debris(debris);
                this.transform(x,y, EXPLODE1_BAG);       // will turn into bag after explosion
                break;
            case RUBY:
            case RUBY_FALLING:
                // add laser beam
                if (outwarddirectionx!=0 || outwarddirectiony!=0)
                {                   
                    this.highlight (x,y, outwarddirectionx>0
                                    ? LASER_R
                                    : outwarddirectionx<0
                                      ? LASER_L
                                      : (outwarddirectiony<0 ? LASER_U:LASER_D) );
                    this.add_laser_beam(x+outwarddirectionx,y+outwarddirectiony, outwarddirectionx,outwarddirectiony);               
                }
                if (totalexplode)           // additionally will be destroyed by big explosion
                {   this.transform(x,y, debris);
                }
                else
                {   this.can_not_create_debris(debris);
                }
                break;
            case EMERALD:
            case EMERALD_FALLING:
            case BAG:
            case BAG_FALLING:
                this.transform(x,y, debris);
                this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                break;
            case SAPPHIRE:
            case SAPPHIRE_FALLING:
                this.transform(x,y, debris);
                this.changecounter(CTR_EMERALDSTOOMUCH,-2);
                break;
            case CITRINE:
            case CITRINE_FALLING:
                this.transform(x,y, debris);
                this.changecounter(CTR_EMERALDSTOOMUCH,-3);
                break;
                
            case EXPLODE1_EMERALD:
            case EXPLODE2_EMERALD:
            case EXPLODE3_EMERALD:
            case EXPLODE4_EMERALD:
            case EXPLODE1_BAG:
            case EXPLODE2_BAG:
            case EXPLODE3_BAG:
            case EXPLODE4_BAG:
                this.transform(x,y, debris);
                this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                break;
            case EXPLODE1_SAPPHIRE:
            case EXPLODE2_SAPPHIRE:
            case EXPLODE3_SAPPHIRE:
            case EXPLODE4_SAPPHIRE:
                this.transform(x,y, debris);
                this.changecounter(CTR_EMERALDSTOOMUCH,-2);
                break;
            case EXPLODE1_RUBY:
            case EXPLODE2_RUBY:
            case EXPLODE3_RUBY:
            case EXPLODE4_RUBY:
                if (totalexplode)           // additionally will be destroyed by big explosion
                {   this.transform(x,y, debris);
                    this.changecounter(CTR_EMERALDSTOOMUCH,-1);
                }
                else
                {   this.can_not_create_debris(debris);
                }
                break;
                
            default:
                this.transform(x,y, debris);
                break;
         }
};
    
Logic.prototype.can_not_create_debris = function(debris)
{
        switch (debris)
        {   case EXPLODE1_EMERALD:
                this.changecounter(CTR_EMERALDSTOOMUCH, -1);
                break;  
            case EXPLODE1_SAPPHIRE:
                this.changecounter(CTR_EMERALDSTOOMUCH, -2);
                break;  
            case EXPLODE1_RUBY:
                this.changecounter(CTR_EMERALDSTOOMUCH, -1);
                break;  
            case EXPLODE1_BAG:
                this.changecounter(CTR_EMERALDSTOOMUCH, -1);
                break;  
        }
};
    
    /**
     *  Return:  true, if the logic here takes over the falling object (the caller must not touch this object anymore)
     */ 
Logic.prototype.is_hit_by_non_bomb = function(x, y, bywhat)
{
        switch (this.piece(x,y))
        {   case LORRYLEFT:
            case LORRYLEFT_FIXED:
            case LORRYRIGHT:
            case LORRYRIGHT_FIXED:
            case LORRYUP:
            case LORRYUP_FIXED:
            case LORRYDOWN:
            case LORRYDOWN_FIXED:  
                this.transform(x,y, LORRY_EXPLODE);
                return false;
            case BUGLEFT:
            case BUGLEFT_FIXED:
            case BUGRIGHT:
            case BUGRIGHT_FIXED:
            case BUGUP:
            case BUGUP_FIXED:
            case BUGDOWN:
            case BUGDOWN_FIXED:
                this.transform(x,y, BUG_EXPLODE);
                return false;
            case YAMYAMLEFT:
            case YAMYAMRIGHT:
            case YAMYAMUP:
            case YAMYAMDOWN:    
                this.move(x,y-1, 0,1, bywhat);
                this.catch_in_explosion(x,y, EXPLODE1_RUBY, false, 0,0);           // yamyams get smashed by any falling object
                return true;
            case BOMB:
            case BOMB_FALLING:
                this.transform(x,y, BOMB_EXPLODE);
                return false;
            case SAPPHIRE:
            case SAPPHIRE_FALLING:
                if (bywhat==ROCK_FALLING)      // sapphire gets crushed by a stone
                {   if (this.hasmoved(x,y))
                    {   this.changestate(x,y, SAPPHIRE_BREAKING);
                        this.changestate(x,y-1, ROCK);  // decelerate rock 
                    } else
                    {   this.changestate(x,y, SAPPHIRE_BREAKING);
                        this.transform(x,y, AIR);        
                        this.move(x,y-1, 0,1, ROCK);  // decelerate rock, but move down anyway
                    }
                    this.changecounter(CTR_EMERALDSTOOMUCH, -2); 
                    return true;
                }
                return false;
            case CITRINE:
            case CITRINE_FALLING:
                if (this.hasmoved(x,y))
                {   this.changestate(x,y, CITRINE_BREAKING);
                } else
                {   this.changestate(x,y, CITRINE_BREAKING);
                    this.transform(x,y, AIR);    
                }
                this.changecounter(CTR_EMERALDSTOOMUCH, -3);                 
                return false;   
            case BAG:
                if (bywhat==ROCK_FALLING)      // bag gets opened by stone
                {   if (this.hasmoved(x,y))
                    {   this.changestate(x,y, BAG_OPENING);
                    } 
                    else
                    {   this.changestate(x,y, BAG_OPENING);
                        this.transform(x,y, EMERALD);
                    }
                    this.changestate (x,y-1, ROCK);
                    return true;
                }
                return false;
            case BAG_FALLING:
                if (bywhat==ROCK_FALLING)       // when a falling rock tries to open a falling bag, this must not happen right now, but 
                                                // the rock keeps falling for an additional turn and tries again
                {   return true;
                }
                return false;
            case ROBOT:
                this.move(x,y-1, 0,1, bywhat);
                this.catch_in_explosion(x,y, EXPLODE1_AIR, false, 0,0);           // robots get smashed by any falling object
                return true;
            default:
                if (this.is_player_piece_at(x,y))
                {   this.move(x,y-1, 0,1, bywhat);
                    this.catch_in_explosion(x,y, EXPLODE1_AIR, false, 0,0);       // players get smashed by any falling object
                    return true;
                }
                return false;
        }                
};
    
Logic.prototype.is_neardestruct_target = function (int x, int y) 
{
        var pi = this.piece(x,y-1);
        var wpp;
        
        // check presence of player/enemies on directly adjacent square
        var player0adjacent = false;
        var player1adjacent = false;
        if (pi==SWAMP || pi==SWAMP_LEFT || pi==SWAMP_RIGHT || pi==SWAMP_UP || pi==SWAMP_DOWN)
        {   return true;
        }
        if ((wpp=this.whose_player_piece(pi))>=0)
        {   if (wpp==0) player0adjacent = true;
            else        player1adjacent = true; 
        }
        pi = this.piece(x,y+1);
        if (pi==SWAMP || pi==SWAMP_LEFT || pi==SWAMP_RIGHT || pi==SWAMP_UP || pi==SWAMP_DOWN)
        {   return true;
        }
        if ((wpp=this.whose_player_piece(pi))>=0)
        {   if (wpp==0) player0adjacent = true;
            else        player1adjacent = true; 
        }
        pi = this.piece(x-1,y);
        if (pi==SWAMP || pi==SWAMP_LEFT || pi==SWAMP_RIGHT || pi==SWAMP_UP || pi==SWAMP_DOWN)
        {   return true;
        }
        if ((wpp=this.whose_player_piece(pi))>=0)
        {   if (wpp==0) player0adjacent = true;
            else        player1adjacent = true; 
        }
        pi = this.piece(x+1,y);
        if (pi==SWAMP || pi==SWAMP_LEFT || pi==SWAMP_RIGHT || pi==SWAMP_UP || pi==SWAMP_DOWN)
        {   return true;
        }
        if ((wpp=this.whose_player_piece(pi))>=0)
        {   if (wpp==0) player0adjacent = true;
            else        player1adjacent = true; 
        }

        // check presence of player on diagonally adjacent square
        boolean player0diagonally = false;
        boolean player1diagonally = false;      
        if ((wpp=this.whose_player_piece(this.piece(x-1,y-1)))>=0)
        {   if (wpp==0) player0diagonally = true;
            else        player1diagonally = true; 
        }
        if ((wpp=this.whose_player_piece(this.piece(x+1,y-1)))>=0)
        {   if (wpp==0) player0diagonally = true;
            else        player1diagonally = true; 
        }
        if ((wpp=this.whose_player_piece(this.piece(x-1,y+1)))>=0)
        {   if (wpp==0) player0diagonally = true;
            else        player1diagonally = true; 
        }
        if ((wpp=this.whose_player_piece(this.piece(x+1,y+1)))>=0)
        {   if (wpp==0) player0diagonally = true;
            else        player1diagonally = true; 
        }
        
        // trigger explosion only if player can indeed be reached
        if (player0diagonally || player0adjacent)
        {   // trigger is caused by a player being directly next to monster at begin of turn
            if (this.is_next_to_origin_position_of_player(x,y,0))
            {   return true;
            }
            // additionally trigger if player was already in reach before turn and is
            // now directly next to monster (player moved deeper in danger zone)
            if (player0adjacent && this.is_near_origin_position_of_player(x,y,0))
            {   return true;
            }           
        }

        // trigger explosion only if player can indeed be reached
        if (player1diagonally || player1adjacent)
        {   // trigger is caused by a player being directly next to monster at begin of turn
            if (this.is_next_to_origin_position_of_player(x,y,1))
            {   return true;
            }
            // additionally trigger if player was already in reach before turn and is
            // now directly next to monster (player moved deeper in danger zone)
            if (player1adjacent && this.is_near_origin_position_of_player(x,y,1))
            {   return true;
            }           
        }
        return false;
};
    
Logic.prototype.is_next_to_origin_position_of_player = function(x, y, playeridx)
{
        var px = this.getCounterAtStartOfTurn(CTR_MANPOSX1+playeridx);       
        var py = this.getCounterAtStartOfTurn(CTR_MANPOSY1+playeridx);
        return Math.abs(px-x) + Math.abs(py-y)==1;
};
    
Logic.prototype.is_near_origin_position_of_player = function(x, y, playeridx)
{
        var px = this.getCounterAtStartOfTurn(CTR_MANPOSX1+playeridx);       
        var py = this.getCounterAtStartOfTurn(CTR_MANPOSY1+playeridx);
        return Math.abs(px-x)<=1 && Math.abs(py-y)<=1;
};
    
Logic.prototype.add_laser_beam (x, y, dx, dy)
{
        var startx = x;
        var starty = y;
        var startdx = dx;
        var startdy = dy;
        var length=1000;
        
        while (length>0) 
        {   length--;

            switch (this.piece(x,y)) 
            {   case EMERALD:
                case EMERALD_FALLING:
                    switch (dx+10*dy)
                    {   case -10:                   
                            dx = -1;
                            dy = 0; 
                            this.highlight (x,y, LASER_BL);
                            break;
                        case 10:  
                            dx = 1;
                            dy = 0;
                            this.highlight (x,y, LASER_TR);
                            break;
                        case -1:
                            dx = 0;
                            dy = 1;
                            this.highlight (x,y, LASER_BR);
                            break;
                        case 1:
                            dx = 0;
                            dy = -1;
                            this.highlight (x,y, LASER_TL);  
                            break;              
                    }
                    break;

                case SAPPHIRE:
                case SAPPHIRE_FALLING:
                    switch (dx+10*dy)
                    {   case -10:                   
                            dx = 1;
                            dy = 0; 
                            this.highlight (x,y, LASER_BR);
                            break;
                        case 10:  
                            dx = -1;
                            dy = 0;
                            this.highlight (x,y, LASER_TL);
                            break;
                        case -1:
                            dx = 0;
                            dy = -1;
                            this.highlight (x,y, LASER_TR);
                            break;
                        case 1:
                            dx = 0;
                            dy = 1;
                            this.highlight (x,y, LASER_BL);
                            break;                  
                    }
                    break;
                
                case CITRINE:
                case CITRINE_FALLING:
                    dx = -dx;
                    dy = -dy;
                    this.highlight (x,y, dx>0 ? LASER_R 
                                         : dx<0 ? LASER_L
                                                : dy<0 ? LASER_U : LASER_D);
                    break;

            case GUN0:
            case GUN1:
            case GUN2:
            case GUN3:
                    // lasers go through guns in upward direction (to be able to stack guns)
                    if (dy==-1)                                 
                    {   this.highlight(x,y, this.piece(x,y));
                        this.highlight (x,y, LASER_V);
                    }
                    // guns are destroyed if hit in other directions
                    else
                    {   this.catch_in_explosion(x,y,EXPLODE1_AIR, false, 0,0);
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
                this.highlight (x,y, dx==0 ? LASER_V : LASER_H);
                break;

            default:
                this.catch_in_explosion(x,y, EXPLODE1_AIR, false, 0,0);
                this.highlight (x,y, dx>0 ? LASER_L 
                                     : dx<0 ? LASER_R
                                            : dy<0 ? LASER_D : LASER_U);
                return;
            }

            // at last continues travel
            x+=dx;
            y+=dy;

            if (x==startx && y==starty && dx==startdx && dy==startdy)
            {   return;     // laser entered a cycle
            }       
        }
 
};
    
    
Logic.prototype.playermove = function (int player)
{
        // determine piece and position of this player
        var x = this.counters[CTR_MANPOSX1+player];
        var y = this.counters[CTR_MANPOSY1+player];
        
        // when player has exited or is killed, increase counter to allow gracefull game-end, but do not continue further actions
        if (this.counters[CTR_EXITED_PLAYER1+player]>0)
        {   this.changecounter(CTR_EXITED_PLAYER1+player, 1);
            return;     
        }
        if (this.counters[CTR_KILLED_PLAYER1+player]>0)
        {   this.changecounter(CTR_KILLED_PLAYER1+player, 1);
            return;
        }
        
        // when there is no longer a man-piece on the expected position, the player must have been killed in previous turn
        if (!this.is_player_piece_at(x,y))
        {   this.changecounter(CTR_KILLED_PLAYER1+player, 1);
            return;
        }
                
        // decode the possibilities and the direction
        var grab=false;
        var setbomb=false;
        var dx = 0;
        var dy = 0;
        var manpiece = this.piece(x,y);
        
        var m = this.walk.getMovement(player, turnsdone);
        switch (m)
        {   case Walk.MOVE_REST:
                //  revert player piece to the proper neutral state
                manpiece = (MAN1 + player); // switch (manpiece)
                if (!this.is(x,y,manpiece))
                {   this.transform(x,y,manpiece);
                }
                // add blink animation
                else
                {
                    this.visualrandomseed = this.nextrandomseed(this.visualrandomseed);
                    if ((this.visualrandomseed & 7) == 0)
                    {
                        this.highlight(x,y,manpiece);
                    }                               
                }
                return;
            case Walk.MOVE_LEFT:  dx = -1; manpiece=(MAN1_LEFT-player); break;
            case Walk.MOVE_RIGHT: dx = 1;  manpiece=(MAN1_RIGHT-player); break;
            case Walk.MOVE_UP:    dy = -1; manpiece=(MAN1_UP-player); break;
            case Walk.MOVE_DOWN:  dy = 1;  manpiece=(MAN1_DOWN-player); break;
            case Walk.GRAB_LEFT:  dx = -1;  grab = true;  manpiece=(MAN1_LEFT-player); break;
            case Walk.GRAB_RIGHT: dx = 1;  grab = true; manpiece=(MAN1_RIGHT-player); break;
            case Walk.GRAB_UP:    dy = -1; grab = true;  manpiece=(MAN1_UP-player); break;
            case Walk.GRAB_DOWN:  dy = 1;  grab = true;  manpiece=(MAN1_DOWN-player); break;
            case Walk.BOMB_LEFT:  dx = -1; setbomb = true; manpiece=(MAN1_LEFT-player); break;
            case Walk.BOMB_RIGHT: dx = 1; setbomb = true; manpiece=(MAN1_RIGHT-player); break;
            case Walk.BOMB_UP:    dy = -1; setbomb = true; manpiece=(MAN1_UP-player); break;
            case Walk.BOMB_DOWN:  dy = 1; setbomb = true; manpiece=(MAN1_DOWN-player); break;           
        }
        // disable bomb setting if not already in possession of a bomb (to prevent picking and placing a bomb in same turn)
        if (this.counters[CTR_TIMEBOMBS_PLAYER1+player]==0) 
        {   setbomb=false;
        }
        
        // try to grab/dig an object without moving 
        if (grab)
        {   if (this.is(x+dx,y+dy,EARTH))
            {   manpiece += (MAN1_DIGLEFT - MAN1_LEFT);   // need to show different image when digging
                this.transform(x+dx,y+dy,AIR);       
            }
            else
            {   this.trypickup(player, x+dx,y+dy);           
            }
        }
        // leave through exit
        else if (this.is(x+dx,y+dy,DOOR_OPENED))
        {
            this.highlight(x+dx,y+dy, DOOR_OPENED);  
            this.move (x,y, dx,dy, manpiece);
            this.transform(x+dx,y+dy, DOOR_CLOSING);
            
            this.changecounter (CTR_MANPOSX1+player, dx);
            this.changecounter (CTR_MANPOSY1+player, dy);
            this.changecounter (CTR_EXITED_PLAYER1+player, 1);
            
            // optionally place a goodbye-bomb 
            int cidx = CTR_TIMEBOMBS_PLAYER1+player;
            if (setbomb && this.counters[cidx]>0)
            {   this.changecounter(cidx,-1);
                this.transform(x,y, ACTIVEBOMB5);
            }
        }
        // try to move to the given position, collecting things on the way, or pushing them aside
        else 
        {   
            // if something is in the way try to pick it up
            if (!this.is(x+dx,y+dy,AIR))
            {   this.trypickup(player, x+dx,y+dy);
            }
            // check if there still is something in the way that may be pushed or otherwise removed
            var otherpiece =  this.piece(x+dx,y+dy);
            switch (otherpiece)
            {   case EARTH:
                    // hint for the display logic
                    switch (dx+10*dy)
                    {   case -10:       
                            this.transform (x+dx,y+dy, EARTH_UP);
                            break;
                        case 10:     
                            this.transform (x+dx,y+dy, EARTH_DOWN);
                            break;
                        case -1:     
                            this.transform (x+dx,y+dy, EARTH_LEFT);
                            break;
                        case 1:      
                            this.transform (x+dx,y+dy, EARTH_RIGHT);
                            break;
                    }
                    // transform target to air
                    this.transform(x+dx,y+dy, AIR);
                    manpiece += (MAN1_DIGLEFT - MAN1_LEFT);   // need to show different image when digging
                    break;
                case ROCK:  
                case ROCKEMERALD:
                case BAG:
                case BOMB:  
                    if (dx!=0 && dy==0)     // horizontal moves only
                    {   if (this.is(x+2*dx,y,AIR))
                        {   this.move (x+dx,y+dy, dx,dy,  otherpiece);
                            // check if need to change into falling variation immediately
                            if (this.would_fall_in_next_step(otherpiece, x+dx*2,y))
                            {   switch (otherpiece)
                                {   case ROCK:        this.changestate(x+2*dx,y, ROCK_FALLING); break; 
                                    case ROCKEMERALD: this.changestate(x+2*dx,y, ROCKEMERALD_FALLING); break;
                                    case BAG:         this.changestate(x+2*dx,y, BAG_FALLING); break;
                                    case BOMB:        this.changestate(x+2*dx,y, BOMB_FALLING); break;
                                }
                            }                           
                        }
                        manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push
                    } 
                    break;
                case BOX:   
                case CUSHION:
                    if (this.is(x+2*dx,y+2*dy,AIR))
                    {   this.move (x+dx,y+dy, dx,dy, this.piece(x+dx,y+dy));
                    }
                    manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
                    break;
                case GUN0:
                    if (this.is(x+2*dx,y+2*dy,AIR)  &&  (this.turnsdone%4!=0))    // must refuse pushing if laser is about to shoot now
                    {   this.move (x+dx,y+dy, dx,dy, this.piece(x+dx,y+dy));                          
                    }
                    manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
                    break;              
                case GUN1:
                    if (this.is(x+2*dx,y+2*dy,AIR)  &&  (this.turnsdone%4!=1))    // must refuse pushing if laser is about to shoot now
                    {   this.move (x+dx,y+dy, dx,dy, piece(x+dx,y+dy));                          
                    }
                    manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
                    break;              
                case GUN2:
                    if (this.is(x+2*dx,y+2*dy,AIR)  &&  (this.turnsdone%4!=2))    // must refuse pushing if laser is about to shoot now
                    {   this.move (x+dx,y+dy, dx,dy, piece(x+dx,y+dy));                          
                    }
                    manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
                    break;              
                case GUN3:
                    if (is(x+2*dx,y+2*dy,AIR)  &&  (this.turnsdone%4!=3))    // must refuse pushing if laser is about to shoot now
                    {   this.move (x+dx,y+dy, dx,dy, piece(x+dx,y+dy));                          
                    }
                    manpiece += (MAN1_PUSHLEFT - MAN1_LEFT);  // need to show different image when trying to push 
                    break;              
            }
            // if nothing is in the way then, do the movement and optionally leave bomb
            otherpiece =  this.piece(x+dx,y+dy);
            if (otherpiece==AIR)
            {   
                this.move (x,y, dx,dy, manpiece);
                this.changecounter (CTR_MANPOSX1+player, dx);
                this.changecounter (CTR_MANPOSY1+player, dy);
            }
            // check if player wants to go through one-time door
            else if (otherpiece==ONETIMEDOOR && this.is(x+2*dx,y+2*dy,AIR))
            {
                this.move (x,y, 2*dx,2*dy, manpiece);
                this.changecounter (CTR_MANPOSX1+player, 2*dx);
                this.changecounter (CTR_MANPOSY1+player, 2*dy);
                this.transform (x+dx,y+dy, ONETIMEDOOR_CLOSED);              
            }
            // check if player wants to go through a colored door
            else if ( (otherpiece==DOORRED || otherpiece==DOORGREEN
                    || otherpiece==DOORBLUE || otherpiece==DOORYELLOW)
                && this.is(x+2*dx,y+2*dy,AIR) && this.have_matching_key(player,otherpiece) )
            {
                this.move (x,y, 2*dx,2*dy, manpiece);
                this.changecounter (CTR_MANPOSX1+player, 2*dx);          
                this.changecounter (CTR_MANPOSY1+player, 2*dy);          
                this.highlight(x+dx,y+dy, otherpiece); 
            }
                
            // check if want to place a bomb at moving          
            var cidx = CTR_TIMEBOMBS_PLAYER1+player;
            if (setbomb && this.counters[cidx]>0 && this.is(x,y,AIR))
            {   this.changecounter(cidx,-1);
                this.transform(x,y, ACTIVEBOMB5);            
            }
        }
        
        // bring player piece to correct state if not already done
        x = this.counters[CTR_MANPOSX1+player];
        y = this.counters[CTR_MANPOSY1+player];
        if (!this.is(x,y,manpiece) && this.is_player_piece_at(x,y)) {
            this.transform(x,y,manpiece);
        }                   
};

Logic.prototype.trypickup = function(player, x, y)
{
        // cause necessary effect after picking up object
        switch (this.piece(x,y))
        {   case EMERALD:
                this.changecounter(CTR_EMERALDSCOLLECTED, 1);
                break;
            case SAPPHIRE:
                this.changecounter(CTR_EMERALDSCOLLECTED, 2);
                break;
            case CITRINE:
                this.changecounter(CTR_EMERALDSCOLLECTED, 3);
                break;
            case RUBY:  
                this.changecounter(CTR_EMERALDSCOLLECTED, 1);
                break;
            case TIMEBOMB:
                this.changecounter(CTR_TIMEBOMBS_PLAYER1+player, 1);
                break;
            case TIMEBOMB10:
                this.changecounter(CTR_TIMEBOMBS_PLAYER1+player, 10);
                break;
            case KEYRED:
                if ((this.counters[CTR_KEYS_PLAYER1+player]&0x01) == 0)
                {   this.changecounter(CTR_KEYS_PLAYER1+player, 0x01);
                }
                break;
            case KEYGREEN:
                if ((this.counters[CTR_KEYS_PLAYER1+player]&0x02) == 0)
                {   this.changecounter(CTR_KEYS_PLAYER1+player, 0x02);
                }
                break;
            case KEYBLUE:
                if ((this.counters[CTR_KEYS_PLAYER1+player]&0x04) == 0)
                {   this.changecounter(CTR_KEYS_PLAYER1+player, 0x04);
                }
                break;
            case KEYYELLOW:
                if ((this.counters[CTR_KEYS_PLAYER1+player]&0x08) == 0)
                {   this.changecounter(CTR_KEYS_PLAYER1+player, 0x08);
                }
                break;
            default:    // can not be picked - just keep object where it is
            {   return;
            }
        }
        // remove the object from the map
        this.transform (x,y,AIR);
};
    
    /**
     *  Simple implementation of a Fibonacci LFSR. This method computes the next value for the shift register
     *  given the current value. To work around the all-0 case, a 1 is injected instead.  
     */ 
Logic.prototype.nextrandomseed = function(seed)
{   
        // work-around for all-0 case
        if (seed==0)
        {   seed=1;
        }
        // calculate next bit from the current state
        for (var i=0; i<3; i++)
        {   var bit = ((seed>>15) ^ (seed>>13) ^ (seed>>12) ^ (seed>>10)) & 1;
            seed = ((seed << 1) ^ bit) & 0xffff;
        }
//System.out.println("seed ("+seed%4+")");
        return seed;
};
    

    // -------- queries to check for some conditions of the map -----------
Logic.prototype.piece = function(x, y)
{
        if (x<0 || x>=MAPWIDTH || y<0 || y>=MAPHEIGHT)
        {   return OUTSIDE;
        }
        return this.map[x+y*MAPWIDTH];
};
     
Logic.prototype.is = function(x, y, p)
{
        return this.piece(x,y)==p;
};
    
Logic.prototype.hasmoved = function(x,y)
{
        return this.hasmoved[x+y*MAPWIDTH];
};
    
Logic.prototype.may_roll_to_left = function(x, y, isconvertible)
{
        var p = this.piece(x,y);
        if (!this.has_rounded_top(p) && p!=ELEVATOR_TOLEFT)
        {   return false;
        }
        if (!this.is(x-1,y-1,AIR))
        {   return false;
        }
        int pl = this.piece(x-1,y);
        if (pl==AIR || pl==ACID || (isconvertible && pl==CONVERTER && this.is(x-1,y+1,AIR)))
        {   if (p==ELEVATOR_TOLEFT) 
            {   this.highlight(x,y, ELEVATOR_TOLEFT);
            }
            return true;
        }
        return false;       
};
    
Logic.prototype.may_roll_to_right = function(x,y,isconvertible)
{
        var p = this.piece(x,y);
        if (!this.has_rounded_top(p) && p!=ELEVATOR_TORIGHT)
        {   return false;
        }
        if (!this.is(x+1,y-1,AIR))
        {   return false;
        }
        var pr = this.piece(x+1,y);
        if (pr==AIR || pr==ACID || (isconvertible && pr==CONVERTER && is(x+1,y+1,AIR)))
        {   
            if (p==ELEVATOR_TORIGHT)
            {   this.highlight(x,y, ELEVATOR_TORIGHT);
            }
            return true;
        }
        return false;
};

Logic.prototype.has_rounded_top = function(piece)
{   
        switch (piece)
        {   case ROCK:
            case ROCKEMERALD:
            case BAG:
            case BOMB:
            case ROUNDWALL:
            case ROUNDSTONEWALL:
            case DOOR:
            case DOOR_OPENED:
//          case DOOR_CLOSING:
            case DOOR_CLOSED:
//          case DOORBLUE:
//          case DOORRED:
//          case DOORGREEN:
//          case DOORYELLOW:
            case EMERALD:
            case SAPPHIRE:
            case CITRINE:
            case RUBY:
            case KEYBLUE:
            case KEYRED:
            case KEYGREEN:
            case KEYYELLOW:
            case CUSHION:   return true;
        }
        return false;
};

Logic.prototype.is_player_piece_at = function(x, y)
{   
     return this.whose_player_piece(this.piece(x,y))>=0;
};

Logic.prototype.whose_player_piece = function(tile)
{   
        switch (tile)
        {   case MAN1:
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
};

Logic.prototype.would_fall_in_next_step = function(piece, x, y)
{
        switch (this.piece(x,y+1)) {
        case AIR:
        case ACID:     return true;
        }
        return false;
};

Logic.prototype.is_living = function(x, y)
{
        switch (this.piece(x,y))
        {   case LORRYLEFT:
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
        return this.is_player_piece_at(x,y);
};

Logic.prototype.isVisiblyEquivalent = function(p1, p2)
{
        if (p1==ROCK || p1==ROCK_FALLING)
        {   return p2==ROCK || p2==ROCK_FALLING;
        }
        if (p1==ROCKEMERALD || p1==ROCKEMERALD_FALLING)
        {   return p2==ROCKEMERALD || p2==ROCKEMERALD_FALLING;
        }
        if (p1==EMERALD || p1==EMERALD_FALLING)
        {   return p2==EMERALD || p2==EMERALD_FALLING;
        }
        if (p1==CITRINE || p1==CITRINE_FALLING || p1==CITRINE_BREAKING)
        {   return p2==CITRINE || p2==CITRINE_FALLING || p2==CITRINE_BREAKING;
        }
        if (p1==SAPPHIRE || p1==SAPPHIRE_FALLING || p1==SAPPHIRE_BREAKING)
        {   return p2==SAPPHIRE || p2==SAPPHIRE_FALLING || p2==SAPPHIRE_BREAKING;
        }
        if (p1==BAG || p1==BAG_FALLING || p1==BAG_OPENING)
        {   return p2==BAG || p2==BAG_FALLING || p2==BAG_OPENING;
        }
        if (p1==RUBY || p1==RUBY_FALLING)
        {   return p2==RUBY || p2==RUBY_FALLING;
        }
        if (p1==BOMB || p1==BOMB_FALLING)
        {   return p2==BOMB || p2==BOMB_FALLING;
        }
        if ( p1==GUN0 || p1==GUN1 || p1==GUN2 || p1==GUN3)
        {   return p2==GUN0 || p2==GUN1 || p2==GUN2 || p2==GUN3;
        }
        return false;
};

Logic.prototype.have_matching_key = function(player, otherpiece)
{
        var kflags = this.counters[CTR_KEYS_PLAYER1+player];
    
        switch (otherpiece)
        {   case DOORRED:       return (kflags & 0x01) != 0;
            case DOORGREEN:     return (kflags & 0x02) != 0;
            case DOORBLUE:      return (kflags & 0x04) != 0;
            case DOORYELLOW:    return (kflags & 0x08) != 0;
        }
        return false;
};

Logic.prototype.man1_moves_toward_man2 = function()
{
        var x1 = counters[CTR_MANPOSX1];
        var y1 = counters[CTR_MANPOSY1];
        var x2 = counters[CTR_MANPOSX2];
        var y2 = counters[CTR_MANPOSY2];
        
        switch (this.walk.getMovement(0, turnsdone))
        {   case Walk.MOVE_LEFT: 
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
};
    
    
    
    // tries to undo the previous turn. this is done by popping the transactions
    // from the stack and inverting the effect of each one.
    // if the stacks runs before a STARTOFTURN - transaction could be found, this
    // method just returns false. The caller must then completely reset the 
    // game logic to clear things up. 
    // the position of the keep-location will be undefined in any case.
Logic.prototype.rollback = function()
{
        while (this.transactions.size()>0)
        {
            var t = this.transactions.pop();
            switch (t & TRN_MASK)
            {   case TRN_STARTOFTURN:
                {   this.turnsdone--;
                    return true;
                }
                case TRN_COUNTER:
                {   var index = (t>>16) & 0x0fff;
                    var increment = (t<<16) >> 16;
                    this.counters[index] = this.counters[index] - increment;
                    break;
                }
                case TRN_TRANSFORM:
                case TRN_CHANGESTATE:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = )oldpiece;
                    break;
                }
                case TRN_MOVEDOWN:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+(y+1)*MAPWIDTH] = AIR;
                    break;
                }
                case TRN_MOVEUP:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+(y-1)*MAPWIDTH] = AIR;
                    break;
                }
                case TRN_MOVELEFT:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+y*MAPWIDTH-1] = AIR;
                    break;
                }
                case TRN_MOVERIGHT:
                {   var x = (t>>22) & 0x03f;
                    vary = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+y*MAPWIDTH+1] = AIR;
                    break;
                }
                case TRN_MOVEDOWN2:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+(y+2)*MAPWIDTH] = AIR;
                    break;
                }
                case TRN_MOVEUP2:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+(y-2)*MAPWIDTH] = AIR;
                    break;
                }
                case TRN_MOVELEFT2:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+y*MAPWIDTH-2] = AIR;
                    break;
                }
                case TRN_MOVERIGHT2:
                {   var x = (t>>22) & 0x03f;
                    var y = (t>>16) & 0x03f;
                    var oldpiece = (t>>8) & 0xff;
                    this.map[x+y*MAPWIDTH] = oldpiece;
                    this.map[x+y*MAPWIDTH+2] = AIR;
                    break;
                }
                case TRN_HIGHLIGHT:
                {   break;      // nothing to do. highlights do not change state
                }
                default:
                {   throw Error("Transaction can not be undone");
                }
            }
        }
        return false;
};
    
    
    //  ------ modifications of the map that cause one or more entries in the transaction table -----
    
Logic.prototype.changecounter = function(index, increment)
{
        this.counters[index] += increment;
        // in case of a counter change that can not fit into a "short", need to add multiple change transactions
        // ATTENTION: This should normally only happen for values that are "just" too big to fit into a short, like
        // some changes of a 16 bit unsigned value for the random generator 
        while (increment>32767)
        {   this.transactions.push (TRN_COUNTER | (index<<16) | 0x7fff);
            this.increment -= 32767; 
        }
        while (increment<-32768)
        {   this.transactions.push (TRN_COUNTER | (index<<16) | 0x8000);
            this.increment += 32768; 
        }
        this.transactions.push (TRN_COUNTER | (index<<16) | (increment&0xffff));         
};

Logic.prototype.transform = function(x, y, newpiece)
{
        var index = x+y*MAPWIDTH;
        var oldpiece = this.map[index];
        if (oldpiece != newpiece && this.isVisiblyEquivalent(oldpiece,newpiece) )
        {   throw new Error("Must not use transform for different but visibly equivalent pieces: "
                    +oldpiece+"->"+newpiece);
        }
        this.map[index] = newpiece;
        this.hasmoved[index] = true;
        this.transactions.push (TRN_TRANSFORM | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
};

Logic.prototype.changestate = function(x, y, newpiece)
{
    var index = x+y*MAPWIDTH;
    var oldpiece = this.map[index];
    if (!this.isVisiblyEquivalent(oldpiece,newpiece) )
        {   throw new Error("Can not use changestate for not visibly equivalent pieces:" 
                +oldpiece_i+"->"+newpiece_i);
        }
        this.map[index] = newpiece;
        this.transactions.push (TRN_CHANGESTATE | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
};

Logic.prototype.highlight = function(x, y, highlightpiece)
{
    this.transactions.push (TRN_HIGHLIGHT | (x<<22) | (y<<16) | highlightpiece );
};

Logic.prototype.move = function(x, y, dx, dy, newpiece)
{
        // when space to move to is not empty - let disappear piece before
        if (!this.is(x+dx,y+dy,AIR))
        {   this.transform(x+dx,y+dy,AIR);
        }
        // move and transform piece on the way
        var index = x+y*MAPWIDTH;
        var index2 = x+dx + (y+dy)*MAPWIDTH;
        var oldpiece = map[index];
        this.map[index] = AIR;
        this.map[index2] = newpiece;     
        this.hasmoved[index2] = true;
        
        // store what happened into transaction log
        switch (dx+10*dy)
        {   case 10:
            {   this.transactions.push (TRN_MOVEDOWN | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            case -10:
            {   this.transactions.push (TRN_MOVEUP | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            case -1:
            {   this.transactions.push (TRN_MOVELEFT | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            case 1:
            {   this.transactions.push (TRN_MOVERIGHT | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            case 20:
            {   this.transactions.push (TRN_MOVEDOWN2 | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            case -20:
            {   this.transactions.push (TRN_MOVEUP2 | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            case -2:
            {   this.transactions.push (TRN_MOVELEFT2 | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            case 2:
            {   this.transactions.push (TRN_MOVERIGHT2 | (x<<22) | (y<<16) | (oldpiece<<8) | newpiece );
                break;
            }
            default:
                throw new Error("Move direction out of range: "+dx+","+dy);
        }
};
    
    // -- debug methods ---
Logic.prototype.printDump = function()
{
        // write counters
        console.log(this.turnsdone, "turns. ",this.counters);

        // write information about transaction buffer
        console.log(this.transactions.size(),"transactions(",this.transactions.keepingSize(),"kept)");
        
        // write content of the map
        for (var y=0; y<MAPHEIGHT; y++)
        {   var l = "";
            for (var x=0; x<MAPWIDTH; x++)
            {   var c = map[x+y*MAPWIDTH];
                if (c!=OUTSIDE) {
                    l = l + String.fromCharCode(c);
                }
            }
            if (l.length>0) console.log(l);
        }
};
    
    // --------- query methods to extract public game info ------
Logic.prototype.isKilled = function()
{
    return this.counters[CTR_KILLED_PLAYER1] + this.counters[CTR_KILLED_PLAYER2] > 0;
};

Logic.prototype.isSolved = function()
{
    return this.timeSinceAllExited()>0;
};
    
Logic.prototype.isOverForSomeTime = function()
{
    var killtimeout = 6;
    var wintimeout = 7;
    if (this.counters[CTR_KILLED_PLAYER1] > killtimeout) return true;
    if (this.counters[CTR_KILLED_PLAYER2] > killtimeout) return true;
    return this.timeSinceAllExited()>wintimeout;         
};
    
Logic.prototype.totalTimeForSolution = function()
{
    if (!this.isSolved()) return 0;
    return turnsdone - this.timeSinceAllExited() + 1;
};
    
Logic.prototype.timeSinceAllExited = function()
{
    if (this.getNumberOfPlayers()<=1)
    {   return this.counters[CTR_EXITED_PLAYER1];
    }
    else
    {   return Math.min(this.counters[CTR_EXITED_PLAYER1],this.counters[CTR_EXITED_PLAYER2]);
    }
};
    
Logic.prototype.getCounter = function(int ctr)
{   
        return this.counters[ctr];
};
    
Logic.prototype.getCounterAtStartOfTurn = function(int ctr)
{
        var value = this.counters[ctr];
        for (var idx=this.getAnimationBufferSize()-1; idx>=0; idx--)
        {   var trn = this.getAnimation(idx);
            if ( (trn&TRN_MASK) == TRN_COUNTER)
            {   var index = (trn>>16) & 0x0fff;             
                if (index==ctr)
                {   value -= ((trn<<16)>>16);
                }
            }
        }
        return value;
};
    
Logic.prototype.getPopulatedWidth = function()
{
    return this.level.datawidth;
};
        
Logic.prototype.getPopulatedHeight = function()
{
    return this.level.dataheight;
};

Logic.prototype.getNumberOfPlayers = function()
{
    return this.numberofplayers;
};

Logic.prototype.getTurnsInWalk = function()
{   
    return this.walk.getTurns();
};
    
//  public byte getPiece(int index)
//  {   return map[index];
//  }
//  public byte getPieceInPopulatedArea(int x, int y)
//  {
//      return map[1+x+(1+y)*MAPWIDTH];
//  }
    
Logic.prototype.getPlayerPositionX = function(idx)
{
    return this.counters[CTR_MANPOSX1+idx];
};

Logic.prototype.getPlayerPositionY = function(idx)
{
    return this.counters[CTR_MANPOSY1+idx];
};

//  public int calculateXInPopulatedArea(int pos)
//  {   
//      return (pos % MAPWIDTH)-1;
//  }
//  public int calculateYInPopulatedArea(int pos)
//  {   
//      return (pos / MAPWIDTH)-1;
//  }
Logic.prototype.getAnimationBufferSize = function()
{
    return this.transactions.keepingSize();
};

Logic.prototype.getAnimation = function(idx)
{
    return this.transactions.get(this.transactions.size()-this.transactions.keepingSize()+idx);
};
    
Logic.prototype.getNumberOfEmeraldsStillNeeded = function()
{   return this.level.loot - this.counters[CTR_EMERALDSCOLLECTED];
};
    
Logic.prototype.canStillGetEnoughEmeralds = function()
{   
    return this.counters[CTR_EMERALDSTOOMUCH] >= 0;
};
    
Logic.prototype.getTurnsDone = function()
{   
    return this.turnsdone;
};
    
Logic.prototype.getCollectedKeys = function(player)
{       
    return this.counters[CTR_KEYS_PLAYER1+player];
};
    
Logic.prototype.getCollectedTimeBombs = function(player)
{   
    return this.counters[CTR_TIMEBOMBS_PLAYER1+player];
};
    
