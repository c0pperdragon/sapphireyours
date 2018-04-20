"use strict";
var LevelSoundPlayer = function()
{
    this.all = null;
    this.tmp_counters = null;
    
    this.sound_acid = null;
    this.sound_bagconv = null;
    this.sound_bagfall = null;
    this.sound_bagopen = null;
//  public final Sound sound_bagroll;
//  public final Sound sound_blastvip;
//  public final Sound sound_bombroll;
    this.sound_bombtick = null;
    this.sound_bug = null;
//  public final Sound sound_clock;
    this.sound_cushion = null;
    this.sound_die = null;
    this.sound_dig = null;
    this.sound_drop = null;
    this.sound_elevator = null;
    this.sound_emldconv = null;
    this.sound_emldfall = null;
    this.sound_emldroll = null;
    this.sound_exitclos = null;
    this.sound_exitopen = null;
    this.sound_explode = null;
    this.sound_grabbomb = null;
    this.sound_grabemld = null;
    this.sound_grabkey = null;
    this.sound_grabruby = null;
    this.sound_grabsphr = null;
    this.sound_laser = null;
    this.sound_lorry = null;
    this.sound_lose = null;
    this.sound_pcushion = null;
    this.sound_push = null;
    this.sound_pushbag = null;
    this.sound_pushbomb = null;
    this.sound_pushbox = null;
    this.sound_robot = null;
    this.sound_rubyconv = null;
    this.sound_rubyfall = null;
    this.sound_rubyroll = null;
    this.sound_setbomb = null;
    this.sound_sphrbrk = null;
    this.sound_sphrconv = null;
    this.sound_sphrfall = null;
    this.sound_sphrroll = null;
    this.sound_stnconv = null;
    this.sound_stnfall = null;
    this.sound_stnhard = null;
    this.sound_stnroll = null;
    this.sound_swamp = null;
    this.sound_usedoor = null;
//  public final Sound sound_wheel;
    this.sound_win = null;
    this.sound_yamyam = null;
};

LevelSoundPlayer.volumetable = 
[
    100, 
    100, 90, 80, 70, 60, 55, 50, 45, 40, 35, 
    30,  27, 25, 22, 20, 18, 16, 14, 12, 11, 
    10, 9, 8, 7, 6, 5, 3, 2, 1, 0, 
];

LevelSoundPlayer.prototype.$ = function()
{
    this.all = [];
    this.tmp_counters = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    
    this.sound_acid = this.load("acid");        
    this.sound_bagconv = this.load("bagconv");
    this.sound_bagfall = this.load("bagfall");   
    this.sound_bagopen = this.load("bagopen");
    this.sound_bagroll = this.load("bagroll");
//      sound_bombroll = this.load("bombroll");
    this.sound_bombtick = this.load("bombtick");
    this.sound_bug = this.load("bug");
    this.sound_cushion = this.load("cushion");
    this.sound_die = this.load("die");
    this.sound_dig = this.load("dig");
    this.sound_drop = this.load("drop");
    this.sound_elevator = this.load("elevator");
    this.sound_emldconv = this.load("emldconv");
    this.sound_emldfall = this.load("emldfall");
    this.sound_emldroll = this.load("emldroll");
    this.sound_exitclos = this.load("exitclos");
    this.sound_exitopen = this.load("exitopen");
    this.sound_explode = this.load("explode");
    this.sound_grabbomb = this.load("grabbomb");
    this.sound_grabemld = this.load("grabemld");
    this.sound_grabkey = this.load("grabkey");
    this.sound_grabruby = this.load("grabruby");
    this.sound_grabsphr = this.load("grabsphr");
    this.sound_laser = this.load("laser");
    this.sound_lorry = this.load("lorry");
    this.sound_lose = this.load("lose");
    this.sound_pcushion = this.load("pcushion");
    this.sound_push = this.load("push");
    this.sound_pushbag = this.load("pushbag");
    this.sound_pushbomb = this.load("pushbomb");
    this.sound_pushbox = this.load("pushbox");
    this.sound_robot = this.load("robot");
    this.sound_rubyconv = this.load("rubyconv");
    this.sound_rubyfall = this.load("rubyfall");
    this.sound_rubyroll = this.load("rubyroll");
    this.sound_setbomb = this.load("setbomb");
    this.sound_sphrbrk = this.load("sphrbrk");
    this.sound_sphrfall = this.load("sphrfall");
    this.sound_sphrconv = this.load("sphrconv");
    this.sound_sphrroll = this.load("sphrroll");
    this.sound_stnconv = this.load("stnconv");
    this.sound_stnfall = this.load("stnfall");
    this.sound_stnhard = this.load("stnhard");
    this.sound_stnroll = this.load("stnroll");
    this.sound_swamp = this.load("swamp");
    this.sound_usedoor = this.load("usedoor");
    this.sound_win = this.load("win");
    this.sound_yamyam = this.load("yamyam");
    
    return this;
};

LevelSoundPlayer.prototype.load = function(filename)
{
    var s = 
    {   howl: new Howl({ src: [ "sound/" + filename + ".wav" ]  }),
        volume: 0
    };
    this.all.push(s);
    return s;
};

/**
 * Decodes everything that has happened in the logic in this step and will
// prepare playing sounds as needed.
 * Return: true, if a sound was played that should lead to a screen shake effect
 */
LevelSoundPlayer.prototype.preparePlaying = function(logic)
{
    var shake = false;

    // clear all volume values of all sounds
    for (var i=0; i<this.all.length; i++) { this.all[i].volume = 0; }
    
    // init the temporary counters
    for (var i=0; i<this.tmp_counters.length; i++) { this.tmp_counters[i] = logic.counters[i]; }
    
    // scan in reverse to make it possible to keep track of the counter values
    var animstart = logic.getFistAnimationOfTurn();
    var animend = logic.getAnimationBufferSize();    
    for (var idx=animend-1; idx>=animstart; idx--)    
    {   var trn = logic.getAnimation(idx);
        var x = (trn>>22) & 0x03f;
        var y = (trn>>16) & 0x03f;
        var vol = this.determineSoundEffectVolume(logic,x,y);
        switch (trn & OPCODE_MASK)
        {   case TRN_TRANSFORM: 
            {   var oldpiece = ((trn>>8)&0xff);
                var newpiece = (trn & 0xff);
                var sound = this.determineTransformSound(logic, oldpiece, newpiece);
                if (sound!=null)
                {   sound.volume = Math.max(sound.volume, vol);
                    if (sound==this.sound_explode && vol>=70) { shake = true; }
                }
                break;
            }
            case TRN_MOVEDOWN:
            {   this.createSoundForMoveTransaction(trn, 0,1, vol);
                break;
            }
            case TRN_MOVEUP:
            {   this.createSoundForMoveTransaction(trn, 0,-1, vol);
                break;
            }
            case TRN_MOVELEFT:
            {   this.createSoundForMoveTransaction(trn, -1,0, vol);
                break;
            }
            case TRN_MOVERIGHT:
            {   this.createSoundForMoveTransaction(trn, 1,0, vol);
                break;
            }
            case TRN_MOVEDOWN2:
            {   this.createSoundForMoveTransaction(trn, 0,2, vol);
                break;
            }
            case TRN_MOVEUP2:
            {   this.createSoundForMoveTransaction(trn, 0,-2, vol);
                break;
            }
            case TRN_MOVELEFT2:
            {   this.createSoundForMoveTransaction(trn, -2,0, vol);
                break;
            }
            case TRN_MOVERIGHT2:
            {   this.createSoundForMoveTransaction(trn, 2,0, vol);
                break;
            }
            case TRN_HIGHLIGHT:
            {   //int mapindex = (trn>>16) & 0x0fff;
                var highlightpiece = trn&0xff;
                var sound = this.determineHighlightSound(highlightpiece);
                if (sound!=null) { sound.volume = Math.max(sound.volume, vol); }
                break;
            }    
            case TRN_COUNTER:
            {   var index = (trn>>20) & 0xff;
                var increment = trn & 0xfffff;
                if (increment >= 0x80000) increment-=0x100000;
                this.tmp_counters[index] -= increment;
                var sound = this.determineCounterSound(logic,index,increment,this.tmp_counters);
                if (sound!=null) { sound.volume = 100; };
                break;
            }           
        }
    }    
    // tell calling program about shake effect
    return shake;    
};

LevelSoundPlayer.prototype.playNow = function()
{
    // play all sounds that have been decided need playing
    for (var i=0; i<this.all.length; i++) 
    {   var s = this.all[i];
        if (s.volume>0) 
        {   s.howl.volume(s.volume/100.0);
            s.howl.play(); 
        }
    }
};
    
LevelSoundPlayer.prototype.createSoundForMoveTransaction = function (trn,dx,dy,vol)
{   var oldpiece = ((trn>>8)&0xff);
    var newpiece = (trn & 0xff);
    var sound = this.determineMoveSound(oldpiece, newpiece, dx, dy);
    if (sound!=null) { sound.volume = Math.max(sound.volume, vol); }
};   
    
LevelSoundPlayer.prototype.determineSoundEffectVolume = function(logic, x, y)
{   // determine distance to nearest player
    var mindist = LevelSoundPlayer.volumetable.length-1;
    for (var i=0; i<logic.getNumberOfPlayers(); i++)
    {   var d = Math.max
        (   Math.abs(logic.getPlayerPositionX(i) - x),
            Math.abs(logic.getPlayerPositionY(i) - y)
        );
        if (d < mindist) { mindist = d; }           
    }
    return LevelSoundPlayer.volumetable[mindist];
};
    
    
    // ------------- determine sound effects for various things that happen in the game -----
    
LevelSoundPlayer.prototype.determineTransformSound = function(logic, oldpiece, newpiece)
{
    // special handling for game solving or for dying
    if (logic.whose_player_piece(oldpiece)>=0 && logic.whose_player_piece(newpiece)<0)
    {   if (newpiece==DOOR_CLOSING)       
        {   return this.sound_exitclos;
        }
        else
        {   return this.sound_die;
        }
    }       

    switch (oldpiece)
    {   case EARTH:
        {   if 
            (   newpiece==AIR || 
                newpiece==EARTH_UP || 
                newpiece==EARTH_DOWN || 
                newpiece==EARTH_LEFT || 
                newpiece==EARTH_RIGHT
            )
            {   return this.sound_dig;
            }
            break;
        }
        case ROCK_FALLING:
//        case ROCKEMERALD_FALLING:
        {   if (newpiece==ROCK) // || newpiece==ROCKEMERALD)
            {   return this.sound_stnfall;
            }
            break;
        }
        case BAG_FALLING:
        {   if (newpiece==BAG) { return this.sound_bagfall; }
            break;
        }
        case EMERALD_FALLING:
        {   if (newpiece==EMERALD) { return this.sound_emldfall; }
            break;
        }
        case SAPPHIRE_FALLING:
        {   if (newpiece==SAPPHIRE) { return this.sound_sphrfall; }
            break;
        }
        case RUBY_FALLING:
        {   if (newpiece==RUBY) { return this.sound_rubyfall; }
            break;
        }
        case BOMB_FALLING: 
        {   if (newpiece==BOMB) { return this.sound_cushion; }
            break;
        }
        case CITRINE_FALLING:
        {   if (newpiece==CITRINE) { return this.sound_cushion; }
            break;
        }
        case EMERALD:
        {   if (newpiece==AIR) { return this.sound_grabemld; }
            break;
        }
        case SAPPHIRE:
        {   if (newpiece==AIR) { return this.sound_grabsphr; }
            break;
        }
        case RUBY:
        {   if (newpiece==AIR) { return this.sound_grabruby; }
            break;
        }
        case CITRINE:
        {   if (newpiece==AIR) { return this.sound_grabruby; }
            break;
        }
        case SAPPHIRE_BREAKING: 
        {   return this.sound_sphrbrk; 
        }
        case CITRINE_BREAKING:
        {   return this.sound_sphrbrk;
        }    
        case TIMEBOMB:
        case TIMEBOMB10:
        {   if (newpiece==AIR) { return this.sound_grabbomb; }
            break;
        }
        case KEYRED:
        case KEYBLUE:
        case KEYGREEN:
        case KEYYELLOW:
        {   if (newpiece==AIR) { return this.sound_grabkey; }
            break;
        }
        case BAG:
        {   if (newpiece==EMERALD || newpiece==BAG_OPENING)
            {   return this.sound_bagopen;
            }               
            break;          
        }
        case ACTIVEBOMB5:
        case ACTIVEBOMB4:
        case ACTIVEBOMB3:
        case ACTIVEBOMB2:
        case ACTIVEBOMB1:
        case ACTIVEBOMB0:
        {   return this.sound_bombtick;
        }
        case DROP:    
        {   return this.sound_drop;  
        }   
    }
    
    switch (newpiece)
    {   case ACID:
        {   if (oldpiece!=newpiece) { return this.sound_acid; }
            break;
        }
        case BUGUP:
        case BUGDOWN:
        case BUGLEFT:
        case BUGRIGHT:
        case BUGUP_FIXED:
        case BUGDOWN_FIXED:
        case BUGLEFT_FIXED:
        case BUGRIGHT_FIXED:
        {   return this.sound_bug;
        }
        case LORRYUP:
        case LORRYDOWN:
        case LORRYLEFT:
        case LORRYRIGHT:
        case LORRYUP_FIXED:
        case LORRYDOWN_FIXED:
        case LORRYLEFT_FIXED:
        case LORRYRIGHT_FIXED:    
        {   return this.sound_lorry;             
        }
        case SWAMP:
        {   return this.sound_swamp;
        }    
//          case Logic.DOOR_CLOSED:
//              return sound_exitclos;
        case DOOR_OPENED:
        {   return this.sound_exitopen;
        }     
        case EXPLODE1_AIR:
        case EXPLODE1_EMERALD:
        case EXPLODE1_SAPPHIRE:
        case EXPLODE1_RUBY:
        case EXPLODE1_BAG:
        {   return this.sound_explode;
        }    
        case ACTIVEBOMB5:
        {   return this.sound_setbomb;
        }
        case ONETIMEDOOR_CLOSED:
        {   return this.sound_usedoor;
        }
        return null;
    }
};
    
LevelSoundPlayer.prototype.determineMoveSound = function(oldpiece, newpiece, dx, dy)
{
    switch (oldpiece)
    {   case ROCK:
        case ROCK_FALLING:
        {   if (dx<0||dx>0)
            {   return newpiece==ROCK_FALLING ? this.sound_stnroll : this.sound_push;
            }
            else if (dy>=2)
            {   return this.sound_stnconv;
            }
            break;
        }
//        case ROCKEMERALD:
//        case ROCKEMERALD_FALLING:
//        {   if (dx<0||dx>0)
//            {   return newpiece==ROCKEMERALD_FALLING ? this.sound_stnroll : this.sound_push;
//            }
//            else if (dy>=2)
//            {   return this.sound_rubyconv;  // use now for this type of conversion
//            }
//            break;              
//        }
        case BAG:
        case BAG_FALLING:
        {   if (dx<0||dx>0)
            {   return newpiece==BAG_FALLING ? this.sound_pushbomb : this.sound_pushbag;
            }
            break;
        }
        case EMERALD:
        case EMERALD_FALLING:
        {   if (dx<0||dx>0)
            {   return this.sound_emldroll;
            }
            else if (dy>=2)
            {   return this.sound_emldconv;
            }
            break;
        }
        case SAPPHIRE:
        case SAPPHIRE_FALLING:
        {   if (dx<0||dx>0)
            {   return this.sound_sphrroll;
            }
            else if (dy>=2)
            {   return this.sound_sphrconv;
            }
            break;
        }
        case RUBY:
        case RUBY_FALLING:
        {   if (dx<0||dx>0)
            {   return sound_rubyroll;
            }
            else if (dy>=2)
            {   return sound_rubyconv;
            }
            break;
        }
        case CITRINE:
        case CITRINE_FALLING:
        {   if (dx<0||dx>0)
            {   // return sound_rubyroll;
            }
            break;
        }
        case BOMB:
        {   if (dx<0||dx>0)
            {   return newpiece==BOMB_FALLING ? this.sound_pushbomb : this.sound_pushbomb;
            }
            break;
        }
        case CUSHION:
        {   return this.sound_pcushion;
        }
        case BOX:
        {   return this.sound_pushbox;
        }
        case ELEVATOR:
        {   return this.sound_elevator;
        }
        case ROBOT:
        {   return this.sound_robot;             
        }
    }
    switch (newpiece)
    {   case BUGUP:
        case BUGDOWN:
        case BUGLEFT:
        case BUGRIGHT:
        case BUGUP_FIXED:
        case BUGDOWN_FIXED:
        case BUGLEFT_FIXED:
        case BUGRIGHT_FIXED:
        {   return this.sound_bug;
        }
        case LORRYUP:
        case LORRYDOWN:
        case LORRYLEFT:
        case LORRYRIGHT:
        case LORRYUP_FIXED:
        case LORRYDOWN_FIXED:
        case LORRYLEFT_FIXED:
        case LORRYRIGHT_FIXED:    
        {   return this.sound_lorry;             
        }
    }
    return null;    
};

LevelSoundPlayer.prototype.determineHighlightSound = function(highlightpiece)
{
    switch (highlightpiece)
    {   case LASER_H:
        case LASER_V:
        case LASER_BL:
        case LASER_BR:
        case LASER_TL:
        case LASER_TR:
        {   return this.sound_laser;
        }
        case DOORRED:
        case DOORBLUE:
        case DOORGREEN:
        case DOORYELLOW:
        {   return this.sound_usedoor;
        }       
        case CUSHION_BUMPING:
        {   return this.sound_cushion;           
        }
    }
    return null;
};

LevelSoundPlayer.prototype.determineCounterSound = function(logic, index, increment, countersbefore)
{
    var cb = countersbefore[index];
    if (index==CTR_EXITED_PLAYER1 || index==CTR_EXITED_PLAYER2)
    {   var since = 0;
        if (logic.getNumberOfPlayers()<=1)
        {   since = countersbefore[CTR_EXITED_PLAYER1];
        }
        else
        {   since = Math.min(countersbefore[CTR_EXITED_PLAYER1],countersbefore[CTR_EXITED_PLAYER2]);
        }
        if (since==3) { return this.sound_win; }
    }
        
    if (index==CTR_EMERALDSTOOMUCH && cb>=0 && cb+increment<0)
    {   return this.sound_lose;
    }
    return null;            
};

