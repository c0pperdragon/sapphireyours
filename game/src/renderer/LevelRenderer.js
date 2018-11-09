"use strict";
// Tile specifier: A single 16-bit number encodes the index in the global tile 
// texture as well as rotation and shrinking effect. The opengl vertex shader will
// do the proper transformation when provided with this tile specifier.
// Organization of tiles to form animations: 
// All animations always consist of 15 FRAMESPERSTEP number of steps. 
// Normally these are just provided as an array of 15 tile specifiers. To form
// more complex objects, tile specifiers can be overlayed by appending 15 
// (or any multiple of this) more tile specifiers.


var LevelRenderer = function() 
{   TileRenderer.call(this);

    this.doneLoading = false;
    this.tmp_disable_static_tile = null;
    
    // default piece tiles: holding an animation for the case of highlight    
    // when not highlighting, only show the keyframe
    this.piecetiles = null;             // int[][]
    this.alternatepiecetiles = null;
    // special animations for context specific appearances 
    this.earthtiles = null;             // int[][] 
    this.walltiles = null;              // int[][]
    this.roundwalltiles = null;         // int[][]
    this.acidtiles_leftedge = null;     // int[][]  - contains two phases of animation 
    this.acidtiles_rightedge = null;    // int[][]  - contains two phases of animation 
    this.acidtiles_bothedges = null;    // int[][]  - contains two phases of animation 
    this.acidtiles_noedge = null;       // int[][]  - contains two phases of animation 
    
    // special animation information
    this.anim_earth_up = null;          // int[][]  -- contains animation for each configuration
    this.anim_earth_down = null;        // int[][]  -- contains animation for each configuration
    this.anim_earth_left = null;        // int[][]  -- contains animation for each configuration
    this.anim_earth_right = null;       // int[][]  -- contains animation for each configuration    
    
    this.anim_man1_nonmoving = null;
    this.anim_man2_nonmoving = null;
    this.anim_sapphire_away = null; 
    this.anim_sapphire_break = null; 
    this.anim_emerald_away = null;
    this.anim_citrine_away = null;
    this.anim_citrine_break = null;
    this.anim_ruby_away = null;   
    this.anim_rock_left = null;
    this.anim_rock_right = null;
    this.anim_bag_left = null;
    this.anim_bag_right = null;
    this.anim_bag_opening = null;
    this.anim_bomb_left = null;
    this.anim_bomb_right = null;
    this.anim_swamp_left = null;
    this.anim_swamp_right = null;
    this.anim_swamp_up = null;
    this.anim_swamp_down = null;
    this.anim_drop_left = null;
    this.anim_drop_right = null;
    this.anim_createdrop = null;
    this.anim_drophit = null;
    this.anim_lorry_left_up = null;
    this.anim_lorry_left_down = null;
    this.anim_lorry_up_right = null;
    this.anim_lorry_up_left = null;
    this.anim_lorry_right_down = null;
    this.anim_lorry_right_up = null;
    this.anim_lorry_down_left = null;
    this.anim_lorry_down_right = null;
    this.anim_bug_left_up = null;
    this.anim_bug_left_down = null;
    this.anim_bug_up_right = null;
    this.anim_bug_up_left = null;
    this.anim_bug_right_down = null;
    this.anim_bug_right_up = null;
    this.anim_bug_down_left = null;
    this.anim_bug_down_right = null;
    this.anim_timebomb_away = null;
    this.anim_timebomb_placement = null;
    this.anim_timebomb10_away = null;
    this.anim_keyred_away = null;
    this.anim_keyblue_away = null;
    this.anim_keygreen_away = null;
    this.anim_keyyellow_away = null;
    this.anim_pillow_move = null;    
    this.anim_laser_h = null;
    this.anim_laser_v = null;
    this.anim_laser_bl = null;
    this.anim_laser_br = null;
    this.anim_laser_tl = null;
    this.anim_laser_tr = null;
    this.anim_laser_left = null;  
    this.anim_laser_right = null; 
    this.anim_laser_up = null;    
    this.anim_laser_down = null; 
    this.anim_exit_closing = null;
    
    this.idle_converter = null;
};
LevelRenderer.prototype = Object.create(TileRenderer.prototype);

LevelRenderer.FRAMESPERSTEP = 15;

    // set up opengl  and load textures
LevelRenderer.prototype.$ = function(game)
{   
    TileRenderer.prototype.$.call(this,game, 
    [   "1man", "2man", 
        "1walklft", "1walkrgt", "1walkup", "1walkdwn", "1pushlft", "1pushrgt",
        "2walklft", "2walkrgt", "2walkup", "2walkdwn", "2pushlft", "2pushrgt", 
        "Earth All","Wall All", "Wall Round All",
        "Earth Right", "Sand", "Glass", "Stone Wall", "Round Stone Wall",
        "Wall Emerald", "Emerald", "Citrine", "Sapphire", "Ruby", 
        "Stone Right", "Bag", "Bomb", 
        "Exit Open", "Exit", "Swamp Move", "Swamp Grow", 
        "Drop Left", "Drop Right", "Drop Down", "Drop", "Converter", "Converter Working",
        "Timebomb", "Tickbomb", "TNT", "Safe", "Pillow", "Pillow Move", 
        "Elevator", "Conveyor Left", "Conveyor Right", 
        "Gun", "Acid", "Acid Left End", "Acid Right End", "Acid Both Ends",
        "Key Blue", "Key Red", "Key Green", "Key Yellow", 
        "Door Blue", "Door Red", "Door Green", "Door Yellow", "Door Onetime",
        "Door Onetime Closed", "Lorry", "Bug", 
        "YamYam Left", "YamYam Up", "YamYam Right", "YamYam Down", "YamYam", "Robot",
        "Explosion", "Explosion Deep", "Sapphire Break", "Citrine Break", 
        "Laser", "Laser Side", "Laser Reflect"
    ]);
    this.doneLoading = false;
    this.tmp_disable_static_tile = new Array(MAPWIDTH*MAPHEIGHT);
    Game.fillarray(this.tmp_disable_static_tile, false);
    return this;
};

LevelRenderer.prototype.isLoaded = function()    
{   
    if (this.doneLoading) return true;
    if (!TileRenderer.prototype.isLoaded.call(this)) return false;

    // ---- loading the piece tiles for key frame positions -----
    this.piecetiles = new Array(256);    
    this.alternatepiecetiles = new Array(256);    
    Game.fillarray(this.piecetiles, []);        
    // this.piecetiles[OUTSIDE] 
    this.piecetiles[MAN1] = this.getAnimation("1man");
    this.piecetiles[MAN2] = this.getAnimation("2man");                
    // this.piecetiles[AIR]
    // this.piecetiles[EARTH]     // has context-depending tiles
    this.piecetiles[SAND] = this.getAnimation("Sand");
    this.piecetiles[SAND_FULL] = this.createOverlayAnimation(this.getAnimation("Stone Right"), this.getAnimation("Sand") );    
    // this.piecetiles[WALL]       // has context-depending tiles
    // this.piecetiles[ROUNDWALL]  // has context-depending tiles
    this.piecetiles[GLASSWALL] = this.getAnimation("Glass");
    this.piecetiles[STONEWALL] = this.getAnimation("Stone Wall");
    this.piecetiles[ROUNDSTONEWALL] = this.getAnimation("Round Stone Wall");
    this.piecetiles[WALLEMERALD] = this.getAnimation("Wall Emerald");
    this.piecetiles[EMERALD] = this.getAnimation("Emerald");
    this.piecetiles[CITRINE] = this.getAnimation("Citrine");
    this.piecetiles[SAPPHIRE] = this.getAnimation("Sapphire")
    this.piecetiles[RUBY] = this.getAnimation("Ruby");
    this.piecetiles[ROCK] = this.createStillAnimation(this.getAnimation("Stone Right"));
//    this.piecetiles[ROCKEMERALD] = this.getAnimation("Stone Emerald");
    this.piecetiles[BAG] = this.createStillAnimation(this.getAnimation("Bag"));
    this.piecetiles[BOMB] = this.getAnimation("Bomb");         
    this.piecetiles[DOOR] = this.getAnimation("Exit");
    this.piecetiles[SWAMP] = this.getAnimation("Swamp Move");    
    this.piecetiles[DROP] = this.getAnimation("Drop");
    this.piecetiles[TIMEBOMB] = this.getAnimation("Timebomb");    
    this.piecetiles[ACTIVEBOMB5] = this.getAnimation("Tickbomb");
    this.piecetiles[TIMEBOMB10] = this.getAnimation("TNT");
    this.piecetiles[CONVERTER] = this.getAnimation("Converter Working");
    this.piecetiles[BOX] = this.getAnimation("Safe");
    this.piecetiles[CUSHION] = this.getAnimation("Pillow");
    this.piecetiles[ELEVATOR] = this.getAnimation("Elevator");
    this.piecetiles[CONVEYORLEFT] = this.getAnimation("Conveyor Left");
    this.piecetiles[CONVEYORLEFT].idling = true;
    this.piecetiles[CONVEYORRIGHT] = this.getAnimation("Conveyor Right");
    this.piecetiles[CONVEYORRIGHT].idling = true;
    // this.piecetiles[ACID]     // has context-depending tiles
    this.piecetiles[KEYBLUE] = this.getAnimation("Key Blue");
    this.piecetiles[KEYRED] = this.getAnimation("Key Red");
    this.piecetiles[KEYGREEN] = this.getAnimation("Key Green");
    this.piecetiles[KEYYELLOW] = this.getAnimation("Key Yellow");
    this.piecetiles[DOORBLUE] = this.getAnimation("Door Blue");
    this.piecetiles[DOORRED] = this.getAnimation("Door Red");
    this.piecetiles[DOORGREEN] = this.getAnimation("Door Green");
    this.piecetiles[DOORYELLOW] = this.getAnimation("Door Yellow");
    this.piecetiles[ONETIMEDOOR] = this.getAnimation("Door Onetime");
    this.piecetiles[LORRYLEFT] = this.createRotatedAnimation(this.getAnimation("Lorry"),180);
    this.piecetiles[LORRYDOWN] = this.createRotatedAnimation(this.getAnimation("Lorry"),-90);
    this.piecetiles[LORRYRIGHT] = this.createRotatedAnimation(this.getAnimation("Lorry"),0);
    this.piecetiles[LORRYUP] = this.createRotatedAnimation(this.getAnimation("Lorry"),90)
    this.piecetiles[BUGRIGHT] = this.createRotatedAnimation(this.getAnimation("Bug"), -90);
    this.piecetiles[BUGUP] = this.createRotatedAnimation(this.getAnimation("Bug"),0);
    this.piecetiles[BUGLEFT] = this.createRotatedAnimation(this.getAnimation("Bug"),90);
    this.piecetiles[BUGDOWN] = this.createRotatedAnimation(this.getAnimation("Bug"),180);
    this.piecetiles[YAMYAMLEFT] = this.getAnimation("YamYam Left");
    this.piecetiles[YAMYAMUP] = this.getAnimation("YamYam Up");
    this.piecetiles[YAMYAMRIGHT] = this.getAnimation("YamYam Right");
    this.piecetiles[YAMYAMDOWN] = this.getAnimation("YamYam Down");    
    this.piecetiles[YAMYAM] = this.getAnimation("YamYam");    
    this.piecetiles[YAMYAM_EXPLODE] = null; // this.getSubAnimation("Explosion", 0, 5);
    this.piecetiles[ROBOT] = this.getAnimation("Robot");
    this.piecetiles[ROBOT].idling = true;
    this.piecetiles[GUN0] = this.getAnimation("Gun");
    this.piecetiles[GUN1] = this.getAnimation("Gun");
    this.piecetiles[GUN2] = this.getAnimation("Gun");
    this.piecetiles[GUN3] = this.getAnimation("Gun"); 
    this.piecetiles[ROCK_FALLING] = this.createStillAnimation(this.getAnimation("Stone Right"));
    this.piecetiles[EMERALD_FALLING] = this.getAnimation("Emerald");
    this.piecetiles[BOMB_FALLING] = this.getAnimation("Bomb");
    this.piecetiles[BAG_FALLING] = this.createStillAnimation(this.getAnimation("Bag"));
    this.piecetiles[DOOR_OPENED] = this.getAnimation("Exit Open");
    this.piecetiles[DOOR_CLOSING] = this.getAnimation("Exit Open");
    this.piecetiles[DOOR_CLOSED] = this.getAnimation("Exit");
    this.piecetiles[LORRYLEFT_FIXED] = this.createRotatedAnimation(this.getAnimation("Lorry"),180);
    this.piecetiles[LORRYDOWN_FIXED] = this.createRotatedAnimation(this.getAnimation("Lorry"),270);
    this.piecetiles[LORRYRIGHT_FIXED] = this.createRotatedAnimation(this.getAnimation("Lorry"),0);
    this.piecetiles[LORRYUP_FIXED] = this.createRotatedAnimation(this.getAnimation("Lorry"),90)
    this.piecetiles[BUGRIGHT_FIXED] = this.createRotatedAnimation(this.getAnimation("Bug"),-90);
    this.piecetiles[BUGUP_FIXED] = this.createRotatedAnimation(this.getAnimation("Bug"),0);
    this.piecetiles[BUGLEFT_FIXED] = this.createRotatedAnimation(this.getAnimation("Bug"),90);
    this.piecetiles[BUGDOWN_FIXED] = this.createRotatedAnimation(this.getAnimation("Bug"),180);
    this.piecetiles[BOMB_EXPLODE] = this.createOverlayAnimation(this.getAnimation("Bomb"),this.getSubAnimation("Explosion", 0, 5));
    this.piecetiles[EXPLODE1_AIR] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_AIR] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_AIR] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_AIR] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_EMERALD] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_EMERALD] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_EMERALD] = this.createOverlayAnimation(this.getAnimation("Emerald"),this.getSubAnimation("Explosion", 3, 5));
    this.piecetiles[EXPLODE4_EMERALD] = this.createOverlayAnimation(this.getAnimation("Emerald"),this.getSubAnimation("Explosion", 4, 5));
    this.piecetiles[EXPLODE1_SAPPHIRE] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_SAPPHIRE] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_SAPPHIRE] = this.createOverlayAnimation(this.getAnimation("Sapphire"),this.getSubAnimation("Explosion", 3, 5));
    this.piecetiles[EXPLODE4_SAPPHIRE] = this.createOverlayAnimation(this.getAnimation("Sapphire"),this.getSubAnimation("Explosion", 4, 5));
    this.piecetiles[BIGBOMB_EXPLODE] = this.createOverlayAnimation(this.getAnimation("TNT"),this.getSubAnimation("Explosion Deep", 0, 5));
    this.piecetiles[BUG_EXPLODE] = null; // this.getSubAnimation("Explosion", 0, 5);
    this.piecetiles[LORRY_EXPLODE] = null; // this.getSubAnimation("Explosion", 0, 5);
    this.piecetiles[ACTIVEBOMB0] = this.getAnimation("Timebomb");
    this.piecetiles[ACTIVEBOMB1] = this.getAnimation("Tickbomb");
    this.piecetiles[ACTIVEBOMB2] = this.getAnimation("Timebomb");
    this.piecetiles[ACTIVEBOMB3] = this.getAnimation("Tickbomb");
    this.piecetiles[ACTIVEBOMB4] = this.getAnimation("Timebomb");
    this.piecetiles[TIMEBOMB_EXPLODE] = this.createOverlayAnimation(this.getAnimation("Tickbomb"),this.getSubAnimation("Explosion", 0, 5));
    this.piecetiles[RUBY_FALLING] = this.getAnimation("Ruby");
    this.piecetiles[SAPPHIRE_FALLING] = this.getAnimation("Sapphire"); 
    this.piecetiles[BAG_OPENING] = this.getAnimation("Bag");
    this.piecetiles[SAPPHIRE_BREAKING] = this.getAnimation("Sapphire Break");
    this.piecetiles[EXPLODE1_BAG] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_BAG] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_BAG] = this.createOverlayAnimation(
		this.createStillAnimation(this.getAnimation("Bag")),
		this.getSubAnimation("Explosion", 3, 5));
    this.piecetiles[EXPLODE4_BAG] = this.createOverlayAnimation(
		this.createStillAnimation(this.getAnimation("Bag")),
		this.getSubAnimation("Explosion", 4, 5));
    this.piecetiles[MAN1_LEFT] = this.getSubAnimation("1walklft", 0,2);
    this.piecetiles[MAN1_RIGHT] = this.getSubAnimation("1walkrgt", 0,2);
    this.piecetiles[MAN1_UP] = this.getAnimation("1walkup");
    this.piecetiles[MAN1_DOWN] = this.getAnimation("1walkdwn");    
    this.piecetiles[MAN1_DIGLEFT] = this.getSubAnimation("1walklft", 0,2);
    this.piecetiles[MAN1_DIGRIGHT] = this.getSubAnimation("1walkrgt", 0,2);
    this.piecetiles[MAN1_DIGUP] = this.getSubAnimation("1walkup", 0,2);
    this.piecetiles[MAN1_DIGDOWN] = this.getSubAnimation("1walkdwn", 0,2);
    this.piecetiles[MAN1_PUSHLEFT] = this.getSubAnimation("1pushlft", 0,2);
    this.piecetiles[MAN1_PUSHRIGHT] = this.getSubAnimation("1pushrgt", 0,2);
    this.piecetiles[MAN1_PUSHUP] = this.getAnimation("1walkup");
    this.piecetiles[MAN1_PUSHDOWN] = this.getAnimation("1walkdwn");    
    this.alternatepiecetiles[MAN1_LEFT] = this.getSubAnimation("1walklft", 1,2);
    this.alternatepiecetiles[MAN1_RIGHT] = this.getSubAnimation("1walkrgt", 1,2);
    this.alternatepiecetiles[MAN1_DIGLEFT] = this.getSubAnimation("1walklft", 1,2);
    this.alternatepiecetiles[MAN1_DIGRIGHT] = this.getSubAnimation("1walkrgt", 1,2);
    this.alternatepiecetiles[MAN1_PUSHLEFT] = this.getSubAnimation("1pushlft", 1,2);
    this.alternatepiecetiles[MAN1_PUSHRIGHT] = this.getSubAnimation("1pushrgt", 1,2);    
    this.piecetiles[MAN2_LEFT] = this.getSubAnimation("2walklft", 0,2);
    this.piecetiles[MAN2_RIGHT] = this.getSubAnimation("2walkrgt", 0,2);
    this.piecetiles[MAN2_UP] = this.getAnimation("2walkup");
    this.piecetiles[MAN2_DOWN] = this.getAnimation("2walkdwn");
    this.piecetiles[MAN2_DIGLEFT] = this.getSubAnimation("2walklft", 0,2);
    this.piecetiles[MAN2_DIGRIGHT] = this.getSubAnimation("2walkrgt", 0,2);
    this.piecetiles[MAN2_DIGUP] = this.getSubAnimation("2walkup", 0,2);
    this.piecetiles[MAN2_DIGDOWN] = this.getSubAnimation("2walkdwn", 0,2);
    this.piecetiles[MAN2_PUSHLEFT] = this.getSubAnimation("2pushlft", 0,2);
    this.piecetiles[MAN2_PUSHRIGHT] = this.getSubAnimation("2pushrgt", 0,2);
    this.piecetiles[MAN2_PUSHUP] = this.getAnimation("2walkup");
    this.piecetiles[MAN2_PUSHDOWN] = this.getAnimation("2walkdwn");
    this.alternatepiecetiles[MAN2_LEFT] = this.getSubAnimation("2walklft", 1,2);
    this.alternatepiecetiles[MAN2_RIGHT] = this.getSubAnimation("2walkrgt", 1,2);
    this.alternatepiecetiles[MAN2_DIGLEFT] = this.getSubAnimation("2walklft", 1,2);
    this.alternatepiecetiles[MAN2_DIGRIGHT] = this.getSubAnimation("2walkrgt", 1,2);
    this.alternatepiecetiles[MAN2_PUSHLEFT] = this.getSubAnimation("2pushlft", 1,2);
    this.alternatepiecetiles[MAN2_PUSHRIGHT] = this.getSubAnimation("2pushrgt", 1,2);    
    this.piecetiles[CITRINE_FALLING] = this.getAnimation("Citrine");
    this.piecetiles[CITRINE_BREAKING] = this.getAnimation("Citrine");
    this.piecetiles[ONETIMEDOOR_CLOSED] = this.getAnimation("Door Onetime Closed");
    this.piecetiles[EXPLODE1_TNT] = this.getSubAnimation("Explosion Deep", 1, 5);
    this.piecetiles[EXPLODE2_TNT] = this.getSubAnimation("Explosion Deep", 2, 5);
    this.piecetiles[EXPLODE3_TNT] = this.getSubAnimation("Explosion Deep", 3, 5);
    this.piecetiles[EXPLODE4_TNT] = this.getSubAnimation("Explosion Deep", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM0] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM0] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM0] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM0] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM1] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM1] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM1] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM1] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM2] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM2] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM2] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM2] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM3] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM3] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM3] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM3] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM4] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM4] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM4] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM4] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM5] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM5] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM5] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM5] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM6] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM6] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM6] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM6] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM7] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM7] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM7] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM7] = this.getSubAnimation("Explosion", 4, 5);
    this.piecetiles[EXPLODE1_YAMYAM8] = this.getSubAnimation("Explosion", 1, 5);
    this.piecetiles[EXPLODE2_YAMYAM8] = this.getSubAnimation("Explosion", 2, 5);
    this.piecetiles[EXPLODE3_YAMYAM8] = this.getSubAnimation("Explosion", 3, 5);
    this.piecetiles[EXPLODE4_YAMYAM8] = this.getSubAnimation("Explosion", 4, 5);

    // ---- context depending tile animations ---
    this.earthtiles = new Array(16);
    for (var i=0; i<16; i++) 
    {   this.earthtiles[i] = this.getSubAnimation("Earth All", 15-i, 16);
    }                   
    this.piecetiles[EARTH] = this.earthtiles[0];
    this.walltiles =  new Array(9);
    this.walltiles[0] = this.getSubAnimation("Wall All", 5, 9);  // nothing - wall - nothing      
    this.walltiles[1] = this.getSubAnimation("Wall All", 6, 9);  // wall    - wall - nothing
    this.walltiles[2] = this.getSubAnimation("Wall All", 2, 9);  // rounded - wall - nothing          
    this.walltiles[3] = this.getSubAnimation("Wall All", 7, 9);  // nothing - wall - wall         
    this.walltiles[4] = this.getSubAnimation("Wall All", 8, 9);  // wall    - wall - wall         
    this.walltiles[5] = this.getSubAnimation("Wall All", 0, 9);  // rounded - wall - wall     ??          
    this.walltiles[6] = this.getSubAnimation("Wall All", 3, 9);  // nothing - wall - rounded          
    this.walltiles[7] = this.getSubAnimation("Wall All", 1, 9);  // wall    - wall - rounded  ??          
    this.walltiles[8] = this.getSubAnimation("Wall All", 4, 9);  // rounded - wall - rounded          
    this.piecetiles[WALL] = this.walltiles[0];
    this.roundwalltiles = new Array(4);
    for (var i=0; i<4; i++) 
    {   this.roundwalltiles[i] = this.getSubAnimation("Wall Round All", i, 4);
    }                   
    this.piecetiles[ROUNDWALL] = this.roundwalltiles[0];
    this.acidtiles_noedge = new Array(2);
    this.acidtiles_noedge[0] = this.getSubAnimation("Acid",0,2);
    this.acidtiles_noedge[0].idling = true;
    this.acidtiles_noedge[1] = this.getSubAnimation("Acid",1,2)        
    this.acidtiles_noedge[1].idling = true;
    this.acidtiles_leftedge = new Array(2);
    this.acidtiles_leftedge[0] = this.getSubAnimation("Acid Left End",0,2);
    this.acidtiles_leftedge[0].idling = true;
    this.acidtiles_leftedge[1] = this.getSubAnimation("Acid Left End",1,2);
    this.acidtiles_leftedge[1].idling = true;
    this.acidtiles_rightedge = new Array(2);
    this.acidtiles_rightedge[0] = this.getSubAnimation("Acid Right End",0,2);
    this.acidtiles_rightedge[0].idling = true;
    this.acidtiles_rightedge[1] = this.getSubAnimation("Acid Right End",1,2);
    this.acidtiles_rightedge[1].idling = true;
    this.acidtiles_bothedges = new Array(2);
    this.acidtiles_bothedges[0] = this.getSubAnimation("Acid Both Ends",0,2);
    this.acidtiles_bothedges[0].idling = true;
    this.acidtiles_bothedges[1] = this.getSubAnimation("Acid Both Ends",1,2);
    this.acidtiles_bothedges[1].idling = true;
    this.piecetiles[ACID] = this.acidtiles_noedge[0];
    
       
    // load animations that can not be directly attached to a piece as their default 
    // (and piece tiles that are complicated to calculated in the code above)    
    this.anim_earth_right = new Array(16);
    var anim_removal = this.getAnimation("Earth Right");
    for (var i=0; i<16; i++) 
    {   this.anim_earth_right[i] = this.createOverlayAnimation(this.earthtiles[i], anim_removal);
    }
    this.anim_earth_up = new Array(16);
    anim_removal = this.createRotatedAnimation(anim_removal, 90);
    for (var i=0; i<16; i++) 
    {   this.anim_earth_up[i] = this.createOverlayAnimation(this.earthtiles[i], anim_removal);
    }
    this.anim_earth_left = new Array(16);
    anim_removal = this.createRotatedAnimation(anim_removal, 90);
    for (var i=0; i<16; i++)
    {   this.anim_earth_left[i] = this.createOverlayAnimation(this.earthtiles[i], anim_removal);       
    }
    this.anim_earth_down = new Array(16);
    anim_removal = this.createRotatedAnimation(anim_removal, 90);
    for (var i=0; i<16; i++) 
    {   this.anim_earth_down[i] = this.createOverlayAnimation(this.earthtiles[i], anim_removal);
    }
    
    this.anim_man1_nonmoving = this.createStillAnimation(this.piecetiles[MAN1]);
    this.anim_man2_nonmoving = this.createStillAnimation(this.piecetiles[MAN2]);
    this.anim_rock_right = this.getAnimation("Stone Right");    
    this.anim_rock_left = this.createRevertedAnimation(this.anim_rock_right);
    this.anim_bag_right = this.createRotatingAnimation(this.createStillAnimation(this.getAnimation("Bag")), 0,-360);
    this.anim_bag_left = this.createRotatingAnimation(this.createStillAnimation(this.getAnimation("Bag")), 0,360);
    this.anim_bomb_left = this.getAnimation("Bomb");
    this.anim_bomb_right = this.createRevertedAnimation(this.getAnimation("Bomb"));        
    this.anim_sapphire_break = this.getAnimation("Sapphire Break");
    this.anim_citrine_break = this.getAnimation("Citrine Break");
    this.anim_bag_opening = this.getAnimation("Bag");
    this.anim_door_opening = this.getAnimation("Exit"); 
    this.anim_door_closing = this.createRevertedAnimation(this.getAnimation("Exit"));    
    this.anim_swamp_up = this.getAnimation("Swamp Grow");
    this.anim_swamp_left = this.createRotatedAnimation(this.anim_swamp_up, 90);
    this.anim_swamp_right = this.createRotatedAnimation(this.anim_swamp_up, -90);      
    this.anim_swamp_down = this.createRotatedAnimation(this.anim_swamp_up, -180);      
    this.anim_drop_left = this.getAnimation("Drop Left");    
    this.anim_drop_right = this.getAnimation("Drop Right");    
    this.anim_createdrop = this.getAnimation("Drop Down");    
    this.anim_drophit = this.createOverlayAnimation(this.getAnimation("Drop"),this.getAnimation("Swamp Grow"));   
    this.anim_pillow_move = this.getAnimation("Pillow Move");
    this.anim_lorry_right_up = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 0,90);
    this.anim_lorry_up_left = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 90,180);
    this.anim_lorry_left_down = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 180,270);
    this.anim_lorry_down_right = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 270,360);
    this.anim_lorry_right_down = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 0,-90);
    this.anim_lorry_down_left = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 270,180);
    this.anim_lorry_left_up = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 180, 90);
    this.anim_lorry_up_right = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 90, 0);
    this.anim_bug_right_up = this.createRotatingAnimation(this.piecetiles[BUGUP], -90,0);
    this.anim_bug_up_left = this.createRotatingAnimation(this.piecetiles[BUGUP], 0,90);
    this.anim_bug_left_down = this.createRotatingAnimation(this.piecetiles[BUGUP], 90,180);
    this.anim_bug_down_right = this.createRotatingAnimation(this.piecetiles[BUGUP], 180,270);
    this.anim_bug_right_down = this.createRotatingAnimation(this.piecetiles[BUGUP], 270,180);
    this.anim_bug_down_left = this.createRotatingAnimation(this.piecetiles[BUGUP], 180,90);
    this.anim_bug_left_up = this.createRotatingAnimation(this.piecetiles[BUGUP], 90, 0);
    this.anim_bug_up_right = this.createRotatingAnimation(this.piecetiles[BUGUP], 0, -90);        
    this.anim_sapphire_away = this.createShrinkAnimation(this.piecetiles[SAPPHIRE][0]);
    this.anim_emerald_away = this.createShrinkAnimation(this.piecetiles[EMERALD][0]); 
    this.anim_citrine_away = this.createShrinkAnimation(this.piecetiles[CITRINE][0]);
    this.anim_ruby_away = this.createShrinkAnimation(this.piecetiles[RUBY][0]);   
    this.anim_timebomb_away = this.createShrinkAnimation(this.piecetiles[TIMEBOMB][0]);
    this.anim_timebomb_placement = this.createRotatingAnimation(
        this.createRevertedAnimation(this.createShrinkAnimation(this.piecetiles[ACTIVEBOMB5][0])), 20,0);
    this.anim_timebomb10_away = this.createShrinkAnimation(this.piecetiles[TIMEBOMB10][0]);
    this.anim_keyred_away = this.createShrinkAnimation(this.piecetiles[KEYRED][0]);
    this.anim_keyblue_away = this.createShrinkAnimation(this.piecetiles[KEYBLUE][0]);
    this.anim_keygreen_away = this.createShrinkAnimation(this.piecetiles[KEYGREEN][0]);
    this.anim_keyyellow_away = this.createShrinkAnimation(this.piecetiles[KEYYELLOW][0]);    
    this.anim_laser_v = this.getAnimation("Laser");
    this.anim_laser_h = this.createRotatedAnimation(this.anim_laser_v, 90);
    this.anim_laser_br = this.getAnimation("Laser Side");
    this.anim_laser_tr = this.createRotatedAnimation(this.anim_laser_br, 90);
    this.anim_laser_tl = this.createRotatedAnimation(this.anim_laser_br, 180);
    this.anim_laser_bl = this.createRotatedAnimation(this.anim_laser_br, 270);    
    this.anim_laser_down = this.getAnimation("Laser Reflect");
    this.anim_laser_right = this.createRotatedAnimation(this.anim_laser_down, 90);     
    this.anim_laser_up = this.createRotatedAnimation(this.anim_laser_down, 180);       
    this.anim_laser_left = this.createRotatedAnimation(this.anim_laser_down, 270); 
    this.anim_exit_closing = this.createRevertedAnimation(this.getAnimation("Exit"));
    
    this.idle_converter = this.getAnimation("Converter");
    this.idle_converter.idling = true;  // store extra attribute into array
    
    // finished defining all animations
    this.doneLoading = true;
    return true;
};

LevelRenderer.prototype.getAnimation = function(filename)
{
    return this.getSubAnimation(filename,0,1);
};

LevelRenderer.prototype.getSubAnimation = function(filename, segment, totalsegments)
{
    var tiles = this.getImage(filename);
    var numtiles = tiles.length;
    var a = new Array(LevelRenderer.FRAMESPERSTEP);
    for (var i=0; i<LevelRenderer.FRAMESPERSTEP; i++)
    {   var t = LevelRenderer.FRAMESPERSTEP*segment + i;
        a[i] = tiles[Math.floor(t*numtiles / (LevelRenderer.FRAMESPERSTEP*totalsegments))];
    }
    return a;
}
 
LevelRenderer.prototype.createStillAnimation = function(tileanimation)
{
    var a = new Array(LevelRenderer.FRAMESPERSTEP);    
    for (var i=0; i<a.length; i++)
    {   a[i] = tileanimation[0];
    }
    return a;
};
    
LevelRenderer.prototype.createShrinkAnimation = function(tile)
{
    var a = new Array(LevelRenderer.FRAMESPERSTEP);
    for (var i=0; i<a.length; i++)
    {   a[i] = tile + (Math.floor((60*i)/LevelRenderer.FRAMESPERSTEP) << 16);
    }
    return a;
};

LevelRenderer.prototype.createOverlayAnimation = function(a1,a2)
{
    return a1.concat(a2);
};
        
LevelRenderer.prototype.createRevertedAnimation = function(a)
{
    var b = new Array(a.length);
    for (var j=0; j<a.length; j+=LevelRenderer.FRAMESPERSTEP)     
    {   for (var i=0; i<LevelRenderer.FRAMESPERSTEP; i++)
        {   var i2 = (i==0) ? 0 : LevelRenderer.FRAMESPERSTEP-i;  
            b[j+i] = a[j+i2];       
        }
    }
    return b;   
};
        
LevelRenderer.prototype.createRotatedAnimation = function(a, degree)
{
    var b = new Array(a.length);
    for (var i=0; i<a.length; i++)
    {   var t = a[i] & 0xffff;
        var s = (a[i]>>16)%60;
        var r = Math.floor((a[i]>>16)/60);
        r = (r + degree + 3600) % 360;
        b[i] = t | ((s+r*60)<<16);      
    }
    return b;   
};
    
LevelRenderer.prototype.createRotatingAnimation = function(a, start, end)
{
    var b = new Array(a.length);
    for (var i=0; i<a.length; i++)
    {   var t = a[i] & 0xffff;
        var s = ((a[i]>>16)&0xffff) % 60;
        var r = Math.floor(((a[i]>>16)&0xffff) / 60);
            
        var degree = start + Math.floor((i*(end-start))/LevelRenderer.FRAMESPERSTEP);
        r = (r + degree + 3600) % 360;
        b[i] = t | ((s+r*60)<<16);      
    }
    return b;   
};
            
   
// -------------- draw the whole scene as defined by the logic -----------
LevelRenderer.prototype.draw = function(logic, frames_until_endposition)
{               
    // determine which part of the logic area needs to be painted
    var populatedwidth = logic.level.datawidth;
    var populatedheight = logic.level.dataheight;

    // do first parse of dynamic info to determine which static tiles should be suppressed
    var tmp_disable_static_tile = this.tmp_disable_static_tile;
    Game.fillarray(tmp_disable_static_tile,false);    
    
    var animstart = 0;
    var animend = 0;
    var frameindex = 0;
    if (frames_until_endposition>0)
    {   animstart = logic.getFistAnimationOfTurn();
        animend = logic.getAnimationBufferSize();
        frameindex = LevelRenderer.FRAMESPERSTEP - frames_until_endposition;
    }
    
    for (var idx=animstart; idx<animend; idx++)
    {       var trn = logic.getAnimation(idx);
            var x = (trn>>22) & 0x03f;
            var y = (trn>>16) & 0x03f;
            switch (trn & OPCODE_MASK)
            {   case TRN_TRANSFORM:
                {   tmp_disable_static_tile[x+y*MAPWIDTH] = true;
                    break;
                }
                case TRN_MOVEDOWN:
                {   tmp_disable_static_tile[x+(y+1)*MAPWIDTH] = true;
                    break;
                }
                case TRN_MOVEUP:
                {   tmp_disable_static_tile[x+(y-1)*MAPWIDTH] = true;
                    break;
                }
                case TRN_MOVELEFT:
                {   tmp_disable_static_tile[x+y*MAPWIDTH-1] = true;
                    break;
                }
                case TRN_MOVERIGHT:
                {   tmp_disable_static_tile[x+y*MAPWIDTH+1] = true;
                    break;
                }
                case TRN_MOVEDOWN2:
                {   tmp_disable_static_tile[x+(y+1)*MAPWIDTH] = true;
                    tmp_disable_static_tile[x+(y+2)*MAPWIDTH] = true;
                    break;
                }
                case TRN_MOVEUP2:
                {   tmp_disable_static_tile[x+(y-1)*MAPWIDTH] = true;
                    tmp_disable_static_tile[x+(y-2)*MAPWIDTH] = true;
                    break;
                }
                case TRN_MOVELEFT2:
                {   tmp_disable_static_tile[x+y*MAPWIDTH-1] = true;
                    tmp_disable_static_tile[x+y*MAPWIDTH-2] = true;
                    break;
                }
                case TRN_MOVERIGHT2:
                {   tmp_disable_static_tile[x+y*MAPWIDTH+1] = true;
                    tmp_disable_static_tile[x+y*MAPWIDTH+2] = true;
                    break;
                }  
                case TRN_HIGHLIGHT:
                {   var p = trn & 0xff;
                    if (logic.piece(x,y) == p)     // highlights disable static rest image of same piece
                    {   tmp_disable_static_tile[x+y*MAPWIDTH] = true;
                    }
                    break;
                }       
            }               
    }       
        
    // paint the non-suppressed static tiles 
    for (var y=0; y<populatedheight; y++)
    {   for (var x=0; x<populatedwidth; x++)
        {   if (!tmp_disable_static_tile[x+y*MAPWIDTH])
            {   var anim = this.determineTileAt(logic,frameindex===0,x,y); 
                if (anim!=null)  
                {   if (anim.idling) 
                    {   this.addNonMoveAnimationToBuffers(frameindex, anim, x,y);
                    }
                    else
                    {   this.addNonMoveAnimationToBuffers(0, anim, x,y);
                    }
                }
            }
        }
    }       
        
    // do second parse of dynamic info to create animation tiles 
    for (var idx=animstart; idx<animend; idx++)
    {       var trn = logic.getAnimation(idx);
            var x = (trn>>22) & 0x03f;
            var y = (trn>>16) & 0x03f;
            var oldpiece = ((trn>>8)&0xff);
            var newpiece = (trn & 0xff);
            switch (trn & OPCODE_MASK)
            {   case TRN_TRANSFORM:
                {   var anim = this.determineTransformAnimation(oldpiece, newpiece, x,y, logic);
                    if (anim!=null)
                    {   this.addNonMoveAnimationToBuffers(frameindex, anim, x,y);
                    }
                    break;
                }   
                case TRN_MOVEDOWN:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, 0,1, logic);
                    break;
                }
                case TRN_MOVEUP:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, 0,-1, logic);
                    break;
                }
                case TRN_MOVELEFT:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, -1,0, logic);
                    break;
                }
                case TRN_MOVERIGHT:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, 1,0, logic);
                    break;
                }
                case TRN_MOVEDOWN2:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, 0,2, logic);
                    break;
                }
                case TRN_MOVEUP2:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, 0,-2, logic);
                    break;
                }
                case TRN_MOVELEFT2:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, -2,0, logic);
                    break;
                }
                case TRN_MOVERIGHT2:
                {   this.addMoveAnimationToBuffers(frameindex, oldpiece,newpiece, x,y, 2,0, logic);
                    break;
                }                   
                case TRN_HIGHLIGHT:
                {   var anim = this.determineHighlightAnimation(newpiece, x,y,logic);
                    if (anim!=null)
                    {   this.addNonMoveAnimationToBuffers(frameindex, anim, x,y);
                    }           
                    break;
                }                   
            }               
    }
};
            
LevelRenderer.prototype.addMoveAnimationToBuffers = function
(   frameindex, oldpiece, newpiece, x1, y1, dx, dy, logic )
{    
    var anim = this.determineMoveAnimation
    (   oldpiece,newpiece,x1,y1,dx,dy, 
        frameindex>7, logic
    );
    if (anim)
    {   // determine correct position
        var x2 = x1 + dx;
        var y2 = y1 + dy;
        var d = 60*frameindex/LevelRenderer.FRAMESPERSTEP;
        var px = 60*x1+d*(x2-x1);
        var py = 60*y1+d*(y2-y1);
		// special movement handling for the bag animations
		if (anim===this.anim_bag_left || anim===this.anim_bag_right)
		{	py -= 7 * (Math.cos(frameindex*2*Math.PI/LevelRenderer.FRAMESPERSTEP)-1);
		}			
        for (var i=frameindex; i<anim.length; i+=LevelRenderer.FRAMESPERSTEP)
        {   this.addTile(px,py,anim[i]);
        }
    }   
};

LevelRenderer.prototype.addNonMoveAnimationToBuffers = function(frameindex, anim, x1, y1)
{
    for (var i=frameindex; i<anim.length; i+=LevelRenderer.FRAMESPERSTEP)
    {   this.addTile(60*x1,60*y1,anim[i]);
    }
};
        
LevelRenderer.prototype.determineMoveAnimation = function
(   oldpiece, newpiece, x, y, dx, dy, 
    secondhalf, logic
)
{
    switch (oldpiece)
    {   case ROCK:
        case ROCK_FALLING:
        {   if (oldpiece!=newpiece || logic.is_player_piece_at(x,y)
			  || (oldpiece===ROCK && newpiece==ROCK && logic.is(x,y+1,ELEVATOR))) 
            {   if (dx<0) { return this.anim_rock_left; }
                else if (dx>0) { return this.anim_rock_right; }
            }
            break;
        }
        case BAG:
        case BAG_FALLING:
        case BAG_OPENING:
        {   if (oldpiece!=newpiece || logic.is_player_piece_at(x,y)
			|| (oldpiece===BAG && newpiece==BAG && logic.is(x,y+1,ELEVATOR)))
            {   if (dx<0) { return this.anim_bag_left; }
                else if (dx>0) { return this.anim_bag_right; }                           
            }
            break;
        }
        case BOMB:
        case BOMB_FALLING:
        {   if (dx<0) { return this.anim_bomb_left; }
            else if (dx>0) { return this.anim_bomb_right; }
            break;      
        }
        case CUSHION:
        {   return this.anim_pillow_move;
        }
    }
    
    var eventurn = (logic.getTurnsDone()&1)==1;
    var t1 = (eventurn && this.alternatepiecetiles[oldpiece]) || this.piecetiles[oldpiece];
    var t2 = (eventurn && this.alternatepiecetiles[newpiece]) || this.piecetiles[newpiece];
    
    // when doing "far" animations, there could be a change of visual in the middle of the action
    if (Math.abs(dx)>1 || Math.abs(dy)>1)
    {   return secondhalf ? t2 : t1;
    }
    
    // when no animation is explicitly defined, use the default animation 
    return t2;
};
    
LevelRenderer.prototype.determineTransformAnimation = function (oldpiece, newpiece, originatingx, originatingy, logic)
{
    switch (oldpiece)
    {   
        case BAG:
        case BAG_FALLING:
        case BAG_OPENING:             
        {   if (newpiece==EMERALD) { return this.anim_bag_opening; }
            break;
        }
        case EMERALD:
        {   if (newpiece==AIR) { return this.anim_emerald_away; }
            break;
        }
        case SAPPHIRE:
        {   if (newpiece==AIR) { return this.anim_sapphire_away; }
            break;              
        }
        case SAPPHIRE_BREAKING:
        {   if (newpiece==AIR) { return this.anim_sapphire_break; }
            break;              
        }
        case CITRINE:
        {   if (newpiece==AIR) { return this.anim_citrine_away; }
            break;              
        }
        case CITRINE_BREAKING:
        {   if (newpiece==AIR) { return this.anim_citrine_break; }
            break;              
        }
        case RUBY:
        {   if (newpiece==AIR) { return this.anim_ruby_away; }
            break;              
        }
        case TIMEBOMB:
        {   if (newpiece==AIR) { return this.anim_timebomb_away; }
            break;              
        }
        case TIMEBOMB10:
        {   if (newpiece==AIR) { return this.anim_timebomb10_away; }
            break;              
        }
        case KEYRED:
        {   if (newpiece==AIR) { return this.anim_keyred_away; }
            break;              
        }
        case KEYBLUE:
        {   if (newpiece==AIR) { return this.anim_keyblue_away; }
            break;              
        }
        case KEYGREEN:
        {   if (newpiece==AIR) { return this.anim_keygreen_away; }
            break;              
        }
        case KEYYELLOW:
        {   if (newpiece==AIR) { return this.anim_keyyellow_away; }
            break;              
        }
        case EARTH_UP:    
        {   return this.anim_earth_up[this.earthJaggedConfiguration(logic,originatingx,originatingy)]; 
        }
        case EARTH_DOWN:  
        {   return this.anim_earth_down[this.earthJaggedConfiguration(logic,originatingx,originatingy)];
        }
        case EARTH_LEFT:  
        {   return this.anim_earth_left[this.earthJaggedConfiguration(logic,originatingx,originatingy)];
        }
        case EARTH_RIGHT: 
        {   return this.anim_earth_right[this.earthJaggedConfiguration(logic,originatingx,originatingy)];
        }
        case LORRYLEFT:
        case LORRYLEFT_FIXED:
        {   if (newpiece==LORRYUP || newpiece==LORRYUP_FIXED) { return this.anim_lorry_left_up; }
            else if (newpiece==LORRYDOWN || newpiece==LORRYDOWN_FIXED) { return this.anim_lorry_left_down; }
            break;
        }
        case LORRYRIGHT:
        case LORRYRIGHT_FIXED:
        {   if (newpiece==LORRYDOWN || newpiece==LORRYDOWN_FIXED) { return this.anim_lorry_right_down; }
            else if (newpiece==LORRYUP || newpiece==LORRYUP_FIXED) { return this.anim_lorry_right_up; }
            break;
        }
        case LORRYDOWN:
        case LORRYDOWN_FIXED:
        {   if (newpiece==LORRYLEFT || newpiece==LORRYLEFT_FIXED) { return this.anim_lorry_down_left; }
            else if (newpiece==LORRYRIGHT || newpiece==LORRYRIGHT_FIXED) { return this.anim_lorry_down_right; }
            break;
        }
        case LORRYUP:
        case LORRYUP_FIXED:
        {   if (newpiece==LORRYLEFT || newpiece==LORRYLEFT_FIXED) { return this.anim_lorry_up_left; }
            else if (newpiece==LORRYRIGHT || newpiece==LORRYRIGHT_FIXED) { return this.anim_lorry_up_right; }
            break;
        }
        case BUGLEFT:
        case BUGLEFT_FIXED:
        {   if (newpiece==BUGUP || newpiece==BUGUP_FIXED) { return this.anim_bug_left_up; }
            else if (newpiece==BUGDOWN || newpiece==BUGDOWN_FIXED) { return this.anim_bug_left_down; }
            break;
        }   
        case BUGRIGHT:
        case BUGRIGHT_FIXED:
        {   if (newpiece==BUGDOWN || newpiece==BUGDOWN_FIXED) { return this.anim_bug_right_down; }
            else if (newpiece==BUGUP || newpiece==BUGUP_FIXED) { return this.anim_bug_right_up; }
            break;
        }
        case BUGDOWN:
        case BUGDOWN_FIXED:
        {   if (newpiece==BUGLEFT || newpiece==BUGLEFT_FIXED) { return this.anim_bug_down_left; }
            else if (newpiece==BUGRIGHT || newpiece==BUGRIGHT_FIXED) { return this.anim_bug_down_right; }
            break;
        }
        case BUGUP:
        case BUGUP_FIXED:
        {   if (newpiece==BUGLEFT || newpiece==BUGLEFT_FIXED) { return this.anim_bug_up_left; }
            else if (newpiece==BUGRIGHT || newpiece==BUGRIGHT_FIXED) { return this.anim_bug_up_right; }
            break;
        }
    }
    switch (newpiece)
    {   case MAN1: { return this.anim_man1_nonmoving; }
        case MAN2: { return this.anim_man2_nonmoving; }   
        case ACTIVEBOMB5:
        {   if (oldpiece==AIR) { return this.anim_timebomb_placement; }
            break;
        }
        case DROP:
        {   if (oldpiece==AIR) { return this.anim_createdrop; }
            else if (oldpiece==SWAMP_LEFT) { return this.anim_drop_left; }
            else if (oldpiece==SWAMP_RIGHT) { return this.anim_drop_right; }
            break;
        }
        case SWAMP_UP: { return this.anim_swamp_up; }
        case SWAMP_DOWN: { return (oldpiece==EARTH) ? this.anim_swamp_down : null; }
        case SWAMP_LEFT: { return (oldpiece==EARTH) ? this.anim_swamp_left : null; }
        case SWAMP_RIGHT: { return (oldpiece==EARTH) ? this.anim_swamp_right : null; }
        case SWAMP: 
        {   if (oldpiece==DROP) { return this.anim_drophit; }
            else                { return null;  }  // do not draw over direction-dependent animation
        }
        case DOOR_OPENED: 
        {   if (oldpiece==DOOR) return this.piecetiles[DOOR]; 
            break;
        }
        case DOOR_CLOSING: 
        {   return null;  // prevent man being over-drawn by door
        }
        case DOOR_CLOSED: 
        {   if (oldpiece==DOOR_CLOSING) { return this.anim_exit_closing; }
            break;
        }
        case ONETIMEDOOR_CLOSED: { return this.piecetiles[ONETIMEDOOR]; }
        case CUSHION: 
        {   if (oldpiece==CUSHION_BUMPING) { return null; }
            break;
        }
        case CUSHION_BUMPING:
        {   if (oldpiece==CUSHION) { return this.piecetiles[CUSHION]; }
            break;
        }    
        case SAND_FULL:
        {   return this.piecetiles[SAND];
            break;
        }
        case ACID:
        {   var n = 1 - logic.getTurnsDone()&1;
            var pl = logic.piece(originatingx-1,originatingy);
            var pr = logic.piece(originatingx+1,originatingy);
            if (pl===ACID)
            {   if (pr==ACID) { return this.acidtiles_noedge[n]; }
                else { return this.acidtiles_rightedge[n]; }
            }
            else
            {   if (pr===ACID) { return this.acidtiles_leftedge[n]; }
                else { return this.acidtiles_bothedges[n]; }               
            }
        }
    }
    // when no animation is explicitly defined, use the default animation of the new piece (covers many "falling" and "pushing" actions)
    return this.piecetiles[newpiece]; 
};

LevelRenderer.prototype.determineHighlightAnimation = function (highlightpiece, originatingx, originatingy, logic)
{
    switch (highlightpiece)
    {   case EARTH:
        {   return this.earthtiles[this.earthJaggedConfiguration(logic, originatingx, originatingy)];
        }
        case LASER_V: { return this.anim_laser_v; }
        case LASER_H: { return this.anim_laser_h; }
        case LASER_BL: { return this.anim_laser_bl; }
        case LASER_BR: { return this.anim_laser_br; }
        case LASER_TL: { return this.anim_laser_tl; }
        case LASER_TR: { return this.anim_laser_tr; }
        case LASER_L: { return this.anim_laser_left; }
        case LASER_R: { return this.anim_laser_right; }
        case LASER_U: { return this.anim_laser_up; }
        case LASER_D: { return this.anim_laser_down; }
    }        
    
    return this.piecetiles[highlightpiece];
}; 
    
LevelRenderer.prototype.determineTileAt = function(logic, iskeyframe, x, y)
{   
    // various appearances of the earth piece
    var p = logic.piece(x,y);
    switch (p)
    {   case EARTH:
        {   var jagged = this.earthJaggedConfiguration(logic,x,y);
            return this.earthtiles[jagged];         
        }
        case WALL:
        {   var c=0;
            var p2 = logic.piece(x-1,y);
            if (p2===WALL) {   c++; }
            else if (p2==ROUNDWALL) { c+=2; }
            p2 = logic.piece(x+1,y);
            if (p2===WALL) { c+=3; }
            else if (p2===ROUNDWALL) { c+=6; }
            return this.walltiles[c];
        }
        case ROUNDWALL:
        {   var c=0;
            var pl = logic.piece(x-1,y);
            var pr = logic.piece(x+1,y);
            if (pl===WALL || pl===ROUNDWALL) { c++; }
            if (pr==WALL || pr==ROUNDWALL) { c+=2; }
            return this.roundwalltiles[c];
        }
        case CONVERTER: 
        {   return this.idle_converter; 
        }
        case ACID:
        {   var n = (iskeyframe?logic.getTurnsDone():logic.getTurnsDone()-1)&1;
            var pl = logic.piece(x-1,y);
            var pr = logic.piece(x+1,y);
            var t;
            if (pl===ACID)
            {   if (pr==ACID) { t=this.acidtiles_noedge[n]; }
                else { t=this.acidtiles_rightedge[n]; }
            }
            else
            {   if (pr===ACID) { t=this.acidtiles_leftedge[n]; }
                else { t=this.acidtiles_bothedges[n]; }               
            }
            return t;
        }
        case MAN1_LEFT:
        case MAN1_RIGHT:
        case MAN1_PUSHLEFT:
        case MAN1_PUSHRIGHT:
        case MAN1_DIGLEFT:
        case MAN1_DIGRIGHT:
        case MAN2_LEFT:
        case MAN2_RIGHT:
        case MAN2_PUSHLEFT:
        case MAN2_PUSHRIGHT:
        case MAN2_DIGLEFT:
        case MAN2_DIGRIGHT:
        {   // check if need alternate animation for odd turns
            if (((iskeyframe?logic.getTurnsDone():logic.getTurnsDone()-1)&1) == 0)
            {   return this.alternatepiecetiles[p];
            }
            break;
        }                   
    }    
    // default handling of resting pieces
    return this.piecetiles[p];       
};
    
LevelRenderer.prototype.earthJaggedConfiguration = function(logic, x, y)
{
    if (makesEarthEdgeJagged(logic.piece(x,y-1)))
    {   if (makesEarthEdgeJagged(logic.piece(x,y+1)))                       
        {   if (makesEarthEdgeJagged(logic.piece(x-1,y)))
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 0:4;                      
            }
            else
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 3:10;                         
            }
        }
        else
        {   if (makesEarthEdgeJagged(logic.piece(x-1,y)))                       
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 2:9;                      
            }
            else
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 8:14;                         
            }
        }
    }
    else
    {   if (makesEarthEdgeJagged(logic.piece(x,y+1)))                       
        {   if (makesEarthEdgeJagged(logic.piece(x-1,y)))                       
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 1:7;                      
            }
            else
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 6:13;                         
            }
        }
        else
        {   if (makesEarthEdgeJagged(logic.piece(x-1,y)))                       
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 5:12;                         
            }
            else
            {   return makesEarthEdgeJagged(logic.piece(x+1,y)) ? 11:15;                        
            }
        }
    }   

    function makesEarthEdgeJagged(piece)
    {
        switch (piece)
        {   case EARTH: 
            case WALL:  
            case STONEWALL: 
            case GLASSWALL: 
            case WALLEMERALD:
            case SWAMP:             
            case SAND:
            case SAND_FULL:             
            case MAN1_DIGLEFT:
            case MAN2_DIGLEFT:
            case MAN1_DIGRIGHT:
            case MAN2_DIGRIGHT:
            case MAN1_DIGUP:
            case MAN2_DIGUP:
            case MAN1_DIGDOWN:
            case MAN2_DIGDOWN:      return false;            
            default:                return true;
        }
    }    
}
    
   
// --------------------------- direct piece tile rendering -----------------

LevelRenderer.prototype.addDecorationPieceToBuffer = function(pixelx, pixely, piece)
{       
        var anim = this.piecetiles[piece];
        if (anim)
        {   this.addDecorationTile(pixelx,pixely,anim[0]);
        }
};

LevelRenderer.prototype.addRestingPieceToBuffer = function(x, y, piece)
{       
        var anim = this.piecetiles[piece];
        if (anim)
        {   for (var i=0; i<anim.length; i+=LevelRenderer.FRAMESPERSTEP)
            {   this.addTile(x,y,anim[i]);
            }
        }
};
