
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
    
    // default piece appearances: are provided as full-blown animations, 
    // even if often only the first animation step is used. This makes it easy to
    // add highlighting effects to otherwise unmoving pieces.
    this.piecetiles = null;             // int[][]
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
//    this.anim_sapphire_fall = null; 
    this.anim_sapphire_away = null; 
//    this.anim_sapphire_shine = null; 
    this.anim_sapphire_break = null; 
//    this.anim_emerald_fall = null;
    this.anim_emerald_away = null;
//    this.anim_emerald_shine = null;
//    this.anim_citrine_fall = null;
    this.anim_citrine_away = null;
//    this.anim_citrine_shine = null;
    this.anim_citrine_break = null;
//    this.anim_ruby_fall = null;
    this.anim_ruby_away = null;   
//    this.anim_ruby_shine = null;  
    this.anim_rock_left = null;
    this.anim_rock_right = null;
    this.anim_rockemerald_left = null;
    this.anim_rockemerald_right = null;
    this.anim_bag_left = null;
    this.anim_bag_right = null;
    this.anim_bag_opening = null;
//    this.anim_bomb_fall = null;
    this.anim_bomb_left = null;
    this.anim_bomb_right = null;
//    this.anim_sand = null;
    this.anim_explode0_air = null;
    this.anim_explode1_air = null;
    this.anim_explode2_air = null;
    this.anim_explode3_air = null;
    this.anim_explode4_air = null;
    this.anim_explode3_emerald = null;
    this.anim_explode4_emerald = null;
    this.anim_explode3_sapphire = null;
    this.anim_explode4_sapphire = null;
    this.anim_explode3_ruby = null;
    this.anim_explode4_ruby = null;
    this.anim_explode3_bag = null;
    this.anim_explode4_bag = null;
    this.anim_explode0_tnt = null;
    this.anim_explode1_tnt = null;
    this.anim_explode2_tnt = null;
    this.anim_explode3_tnt = null;
    this.anim_explode4_tnt = null;
//    this.anim_door_red = null;
//    this.anim_door_green = null;
//    this.anim_door_blue = null;
//    this.anim_door_yellow = null;
//    this.anim_door_onetime = null;
    this.anim_door_opening = null;
    this.anim_door_closing = null;
//    this.anim_cushion = null;
    this.anim_gunfire = null;
//    this.anim_swamp = null;
    this.anim_swamp_left = null;
    this.anim_swamp_right = null;
    this.anim_swamp_up = null;
    this.anim_swamp_down = null;
    this.anim_drop_left = null;
    this.anim_drop_right = null;
    this.anim_createdrop = null;
//    this.anim_drop = null;
    this.anim_drophit = null;
//    this.anim_lorry_left = null;
//    this.anim_lorry_right = null;
//    this.anim_lorry_up = null;
//    this.anim_lorry_down = null;  
    this.anim_lorry_left_up = null;
    this.anim_lorry_left_down = null;
    this.anim_lorry_up_right = null;
    this.anim_lorry_up_left = null;
    this.anim_lorry_right_down = null;
    this.anim_lorry_right_up = null;
    this.anim_lorry_down_left = null;
    this.anim_lorry_down_right = null;
//    this.anim_bug_left = null;
//    this.anim_bug_right = null;
//    this.anim_bug_up = null;
//    this.anim_bug_down = null;    
    this.anim_bug_left_up = null;
    this.anim_bug_left_down = null;
    this.anim_bug_up_right = null;
    this.anim_bug_up_left = null;
    this.anim_bug_right_down = null;
    this.anim_bug_right_up = null;
    this.anim_bug_down_left = null;
    this.anim_bug_down_right = null;
    this.anim_yamyam = null;
    this.anim_timebomb_away = null;
    this.anim_timebomb_placement = null;
    this.anim_timebomb10_away = null;
    this.anim_keyred_away = null;
    this.anim_keyblue_away = null;
    this.anim_keygreen_away = null;
    this.anim_keyyellow_away = null;
//    this.anim_elevator = null;
//    this.anim_elevatorleft = null;
//    this.anim_elevatorright = null;
    this.anim_elevatorleft_throw = null;
    this.anim_elevatorright_throw = null;    
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
};
LevelRenderer.prototype = Object.create(TileRenderer.prototype);

LevelRenderer.FRAMESPERSTEP = 15;

    // set up opengl  and load textures
LevelRenderer.prototype.$ = function(gl)
{   
    TileRenderer.prototype.$.call(this,gl, 
    [   "1man", "2man", 
        "1walklft", "1walkrgt", "1walkup", "1walkdwn", 
        "1diglft", "1digrgt", "1digup", "1digdwn","1pushlft", "1pushrgt",
        "2walklft", "2walkrgt", "2walkup", "2walkdwn",
        "2diglft", "2digrgt", "2digup", "2digdwn",
        "2pushlft", "2pushrgt", "Earth All","Wall All", "Wall Round All",
        "Earth Right", "Sand", "Glass", "Stone Wall", "Round Stone Wall",
        "Wall Emerald", "Emerald", "Emerald Shine", "Citrine", "Citrine Shine",
        "Sapphire", "Sapphire Shine", "Ruby", "Ruby Shine",
        "Stone", "Stone Right", "Stone Left", "Stone Emerald", "Bag", "Bomb", "Bomb Push",
        "Bomb Falling", "Exit Closed", "Exit", "Swamp", "Swamp Move", "Swamp Grow", 
        "Drop Left", "Drop Right", "Drop Down", "Drop Hit", "Drop", "Converter",
        "Timebomb", "Tickbomb", "TNT", "Safe", "Pillow", "Elevator", "Elevator Left",
        "Elevator Right", "Elevator Left Throw", "Elevator Right Throw", "Gun", "Gun Fire",
        "Acid", "Acid Edge Left", "Acid Edge Right", "Acid Edge Both",
        "Key Blue", "Key Red", "Key Green", "Key Yellow", 
        "Door Blue", "Door Red", "Door Green", "Door Yellow", "Door Onetime",
        "Door Onetime Closed", "Lorry", "Bug", 
        "YamYam Left", "YamYam Up", "YamYam Right", "YamYam Down", "YamYam", "Robot",
        "Explosion", "Explosion Deep", "Sapphire Break", "Citrine Break", "Bag Open",
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

    // loading the default piece animations and some context specific piece animations
    this.piecetiles = new Array(256);
    Game.fillarray(this.piecetiles, null);
    
    this.piecetiles[AIR] = [];
    this.piecetiles[MAN1] = this.getAnimation("1man");
    this.piecetiles[MAN1_LEFT] = this.getAnimation("1walklft");
    this.piecetiles[MAN1_RIGHT] = this.getAnimation("1walkrgt");
    this.piecetiles[MAN1_UP] = this.getAnimation("1walkup");
    this.piecetiles[MAN1_DOWN] = this.getAnimation("1walkdwn");
    this.piecetiles[MAN1_DIGLEFT] = this.getAnimation("1diglft");
    this.piecetiles[MAN1_DIGRIGHT] = this.getAnimation("1digrgt");
    this.piecetiles[MAN1_DIGUP] = this.getAnimation("1digup");
    this.piecetiles[MAN1_DIGDOWN] = this.getAnimation("1digdwn");
    this.piecetiles[MAN1_PUSHLEFT] = this.getAnimation("1pushlft");
    this.piecetiles[MAN1_PUSHRIGHT] = this.getAnimation("1pushrgt");
    this.piecetiles[MAN1_PUSHUP] = this.getAnimation("1walkup");
    this.piecetiles[MAN1_PUSHDOWN] = this.getAnimation("1walkdwn");    
    this.piecetiles[MAN2] = this.getAnimation("2man");                
    this.piecetiles[MAN2_LEFT] = this.getAnimation("2walklft");
    this.piecetiles[MAN2_RIGHT] = this.getAnimation("2walkrgt");
    this.piecetiles[MAN2_UP] = this.getAnimation("2walkup");
    this.piecetiles[MAN2_DOWN] = this.getAnimation("2walkdwn");
    this.piecetiles[MAN2_DIGLEFT] = this.getAnimation("2diglft");
    this.piecetiles[MAN2_DIGRIGHT] = this.getAnimation("2digrgt");
    this.piecetiles[MAN2_DIGUP] = this.getAnimation("2digup");
    this.piecetiles[MAN2_DIGDOWN] = this.getAnimation("2digdwn");
    this.piecetiles[MAN2_PUSHLEFT] = this.getAnimation("2pushlft");
    this.piecetiles[MAN2_PUSHRIGHT] = this.getAnimation("2pushrgt");
    this.piecetiles[MAN2_PUSHUP] = this.getAnimation("2walkup");
    this.piecetiles[MAN2_PUSHDOWN] = this.getAnimation("2walkdwn");
    
    this.earthtiles = new Array(16);
    for (var i=0; i<16; i++) 
    {   this.earthtiles[i] = this.createAnimationDescription( (this.getImage("Earth All")) [15-i] );
    }               
    this.piecetiles[EARTH] = this.earthtiles[0];
    
    this.walltiles =  new Array(9);
    var wall = this.getImage("Wall All");
    this.walltiles[0] = this.createAnimationDescription(wall[5]);  // nothing - wall - nothing      
    this.walltiles[1] = this.createAnimationDescription(wall[6]);  // wall    - wall - nothing
    this.walltiles[2] = this.createAnimationDescription(wall[2]);  // rounded - wall - nothing          
    this.walltiles[3] = this.createAnimationDescription(wall[7]);  // nothing - wall - wall         
    this.walltiles[4] = this.createAnimationDescription(wall[8]);  // wall    - wall - wall         
    this.walltiles[5] = this.createAnimationDescription(wall[0]);  // rounded - wall - wall     ??          
    this.walltiles[6] = this.createAnimationDescription(wall[3]);  // nothing - wall - rounded          
    this.walltiles[7] = this.createAnimationDescription(wall[1]);  // wall    - wall - rounded  ??          
    this.walltiles[8] = this.createAnimationDescription(wall[4]);  // rounded - wall - rounded          
    this.piecetiles[WALL] = this.walltiles[0];
    
    this.roundwalltiles = new Array(4);
    var rwall =  this.getImage("Wall Round All");
    for (var i=0; i<4; i++) 
    {   this.roundwalltiles[i] = this.createAnimationDescription(rwall[i]);
    }               
    this.piecetiles[ROUNDWALL] = this.roundwalltiles[0];
    
    this.acidtiles_noedge = new Array(2);
    this.acidtiles_noedge[0] = this.getSubAnimation("Acid",0,2);
    this.acidtiles_noedge[1] = this.getSubAnimation("Acid",1,2)        
    var acidedge = this.getAnimation("Acid Edge Left");
    this.acidtiles_leftedge = new Array(2);
    this.acidtiles_leftedge[0] = this.createOverlayAnimation(this.acidtiles_noedge[0], acidedge);
    this.acidtiles_leftedge[1] = this.createOverlayAnimation(this.acidtiles_noedge[1], acidedge);
    acidedge = this.getImage("Acid Edge Right");
    this.acidtiles_rightedge = new Array(2);
    this.acidtiles_rightedge[0] = this.createOverlayAnimation(this.acidtiles_noedge[0], acidedge);
    this.acidtiles_rightedge[1] = this.createOverlayAnimation(this.acidtiles_noedge[1], acidedge);
    acidedge = this.getImage("Acid Edge Both");
    this.acidtiles_bothedges = new Array(2);
    this.acidtiles_bothedges[0] = this.createOverlayAnimation(this.acidtiles_noedge[0], acidedge);
    this.acidtiles_bothedges[1] = this.createOverlayAnimation(this.acidtiles_noedge[1], acidedge);    
    this.piecetiles[ACID] = this.acidtiles_noedge;
    
    this.piecetiles[SAND] = this.getImage("Sand");
    this.piecetiles[GLASSWALL] = this.getImage("Glass");
    this.piecetiles[STONEWALL] = this.getImage("Stone Wall");
    this.piecetiles[ROUNDSTONEWALL] = this.getImage("Round Stone Wall");
    this.piecetiles[WALLEMERALD] = this.getImage("Wall Emerald");
    this.piecetiles[EMERALD] = this.getAnimation("Emerald Shine");
    this.piecetiles[EMERALD_FALLING] = this.getAnimation("Emerald");
    this.piecetiles[CITRINE] = this.getAnimation("Citrine Shine");
    this.piecetiles[CITRINE_FALLING] = this.getAnimation("Citrine");
    this.piecetiles[SAPPHIRE] = this.getAnimation("Sapphire Shine")
    this.piecetiles[SAPPHIRE_FALLING] = this.getAnimation("Sapphire");    
    this.piecetiles[RUBY] = this.getAnimation("Ruby Shine");
    this.piecetiles[RUBY_FALLING] = this.getAnimation("Ruby");
    this.piecetiles[ROCK] = this.getAnimation("Stone");
    this.piecetiles[ROCK_FALLING] = this.getAnimation("Stone");
    this.piecetiles[ROCKEMERALD] = this.getAnimation("Stone Emerald");
    this.piecetiles[ROCKEMERALD_FALLING] = this.getAnimation("Stone Emerald");
    this.piecetiles[BAG] = this.getAnimation("Bag");
    this.piecetiles[BAG_FALLING] = this.getAnimation("Bag");
    this.piecetiles[BOMB] = this.getAnimation("Bomb");         
    this.piecetiles[BOMB_FALLING] = this.getAnimation("Bomb Falling");
    this.piecetiles[DOOR] = this.getAnimation("Exit Closed");
    this.piecetiles[DOOR_CLOSED] = this.getAnimation("Exit Closed");    
    this.piecetiles[DOOR_OPENED] = this.getAnimation("Exit");
    this.piecetiles[DOOR_CLOSING] = this.getAnimation("Exit");
    this.piecetiles[SWAMP] = this.getAnimation("Swamp Move");    
    this.piecetiles[DROP] = this.getAnimation("Drop");  
    this.piecetiles[CONVERTER] = this.getAnimation("Converter");
    this.piecetiles[TIMEBOMB] = this.getAnimation("Timebomb");    
    this.piecetiles[ACTIVEBOMB4] = this.getAnimation("Timebomb");    
    this.piecetiles[ACTIVEBOMB2] = this.getAnimation("Timebomb");    
    this.piecetiles[ACTIVEBOMB0] = this.getAnimation("Timebomb");   
    this.piecetiles[ACTIVEBOMB5] = this.getAnimation("Tickbomb");
    this.piecetiles[ACTIVEBOMB3] = this.getAnimation("Tickbomb");
    this.piecetiles[ACTIVEBOMB1] = this.getAnimation("Tickbomb");   
    this.piecetiles[TIMEBOMB10] = this.getAnimation("TNT");
    this.piecetiles[BOX] = this.getAnimation("Safe");
    this.piecetiles[CUSHION] = this.getAnimation("Pillow");
    this.piecetiles[ELEVATOR] = this.getAnimation("Elevator");
    this.piecetiles[ELEVATOR_TOLEFT] = this.getAnimation("Elevator Left");
    this.piecetiles[ELEVATOR_TORIGHT] = this.getAnimation("Elevator Right");
    this.piecetiles[GUN0] = this.getAnimation("Gun");
    this.piecetiles[GUN1] = this.getAnimation("Gun");
    this.piecetiles[GUN2] = this.getAnimation("Gun");
    this.piecetiles[GUN3] = this.getAnimation("Gun"); 
    this.piecetiles[KEYBLUE] = this.getAnimation("Key Blue");
    this.piecetiles[KEYRED] = this.getAnimation("Key Red");
    this.piecetiles[KEYGREEN] = this.getAnimation("Key Green");
    this.piecetiles[KEYYELLOW] = this.getAnimation("Key Yellow");
    this.piecetiles[DOORBLUE] = this.getAnimation("Door Blue");
    this.piecetiles[DOORRED] = this.getAnimation("Door Red");
    this.piecetiles[DOORGREEN] = this.getAnimation("Door Green");
    this.piecetiles[DOORYELLOW] = this.getAnimation("Door Yellow");
    this.piecetiles[ONETIMEDOOR] = this.getAnimation("Door Onetime");
    this.piecetiles[ONETIMEDOOR_CLOSED] = this.getAnimation("Door Onetime Closed");
    this.piecetiles[LORRYLEFT] = this.getAnimation("Lorry");
    this.piecetiles[LORRYLEFT_FIXED] = this.piecetiles[LORRYLEFT];
    this.piecetiles[LORRYDOWN] = this.createRotatedAnimation(this.piecetiles[LORRYLEFT],90);
    this.piecetiles[LORRYDOWN_FIXED] = this.piecetiles[LORRYDOWN];    
    this.piecetiles[LORRYRIGHT] = this.createRotatedAnimation(this.piecetiles[LORRYLEFT],180);
    this.piecetiles[LORRYRIGHT_FIXED] = this.piecetiles[LORRYRIGHT];
    this.piecetiles[LORRYUP] = this.createRotatedAnimation(this.piecetiles[LORRYLEFT],270)
    this.piecetiles[LORRYUP_FIXED] = this.piecetiles[LORRYUP];
    this.piecetiles[BUGRIGHT] = this.getAnimation("Bug");
    this.piecetiles[BUGRIGHT_FIXED] = this.piecetiles[BUGRIGHT];    
    this.piecetiles[BUGUP] = this.createRotatedAnimation(this.piecetiles[BUGRIGHT],90);
    this.piecetiles[BUGUP_FIXED] = this.piecetiles[BUGUP];
    this.piecetiles[BUGLEFT] = this.createRotatedAnimation(this.piecetiles[BUGRIGHT],180);
    this.piecetiles[BUGLEFT_FIXED] = this.piecetiles[BUGLEFT];
    this.piecetiles[BUGDOWN] = this.createRotatedAnimation(this.piecetiles[BUGRIGHT],270);
    this.piecetiles[BUGDOWN_FIXED] = this.piecetiles[BUGDOWN];
    this.piecetiles[YAMYAMLEFT] = this.getAnimation("YamYam Left");
    this.piecetiles[YAMYAMUP] = this.getAnimation("YamYam Up");
    this.piecetiles[YAMYAMRIGHT] = this.getAnimation("YamYam Right");
    this.piecetiles[YAMYAMDOWN] = this.getAnimation("YamYam Down");    
    this.piecetiles[ROBOT] = this.getAnimation("Robot");
    this.piecetiles[SAND_FULL] = this.createOverlayAnimation(this.piecetiles[ROCK], this.piecetiles[SAND] );    
    this.piecetiles[SAND_FULLEMERALD] = this.createOverlayAnimation(this.piecetiles[ROCKEMERALD], this.piecetiles[SAND] );
    
    
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
    
    this.anim_man1_nonmoving = this.createAnimationDescription(this.getImage("1man")[0]); 
    this.anim_man2_nonmoving = this.createAnimationDescription(this.getImage("2man")[0]); 
    this.anim_rock_right = this.createAnimationDescription(this.getImage("Stone Right")[0]);    
    this.anim_rock_left = this.createAnimationDescription(this.getImage("Stone Left")[0]);
    this.anim_bag_right = this.createAnimationDescription(this.getImage("Bag")[0]);
    this.anim_bag_left = this.createRevertedAnimation(this.anim_bag_right);
    this.anim_bomb_left = this.createAnimationDescription(this.getImage("Bomb Push")[0]);
    this.anim_bomb_right = this.createRevertedAnimation(this.anim_bomb_left);        
    this.anim_door_opening = this.getAnimation("Exit"); 
    this.anim_door_closing = this.createRevertedAnimation(this.anim_door_opening);    
    this.anim_swamp_up = this.getAnimation("Swamp Grow");
    this.anim_swamp_left = this.createRotatedAnimation(this.anim_swamp_up, 90);
    this.anim_swamp_right = this.createRotatedAnimation(this.anim_swamp_up, -90);      
    this.anim_swamp_down = this.createRotatedAnimation(this.anim_swamp_up, -180);      
    this.anim_drop_left = this.getAnimation("Drop Left");    
    this.anim_drop_right = this.getAnimation("Drop Right");    
    this.anim_createdrop = this.getAnimation("Drop Down");    
    this.anim_drophit = this.getAnimation("Drop Hit");   
    this.anim_elevatorleft_throw = this.getAnimation("Elevator Left Throw");
    this.anim_elevatorright_throw = this.getAnimation("Elevator Right Throw");    
    this.anim_gunfire = this.getAnimation("Gun Fire");
    this.anim_lorry_right_up = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 0,90);
    this.anim_lorry_up_left = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 90,180);
    this.anim_lorry_left_down = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 180,270);
    this.anim_lorry_down_right = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 270,360);
    this.anim_lorry_right_down = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 0,-90);
    this.anim_lorry_down_left = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 270,180);
    this.anim_lorry_left_up = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 180, 90);
    this.anim_lorry_up_right = this.createRotatingAnimation(this.piecetiles[LORRYRIGHT], 90, 0);
    this.anim_bug_right_up = this.createRotatingAnimation(this.piecetiles[BUGRIGHT], 0,90);
    this.anim_bug_up_left = this.createRotatingAnimation(this.piecetiles[BUGRIGHT], 90,180);
    this.anim_bug_left_down = this.createRotatingAnimation(this.piecetiles[BUGRIGHT], 180,270);
    this.anim_bug_down_right = this.createRotatingAnimation(this.piecetiles[BUGRIGHT], 270,360);
    this.anim_bug_right_down = this.createRotatingAnimation(this.piecetiles[BUGRIGHT], 0,-90);
    this.anim_bug_down_left = this.createRotatingAnimation(this.piecetiles[BUGRIGHT], 270,180);
    this.anim_bug_left_up = this.createRotatingAnimation(this.piecetiles[BUGRIGHT], 180, 90);
    this.anim_bug_up_right = this.createRotatingAnimation(this.piecetiles[BUGRIGHT], 90, 0);        
    this.anim_yamyam = this.getAnimation ("YamYam");           
    this.anim_explode0_air = this.getSubAnimation("Explosion", 0, 5);
    this.anim_explode1_air = this.getSubAnimation("Explosion", 1, 5);
    this.anim_explode2_air = this.getSubAnimation("Explosion", 2, 5);
    this.anim_explode3_air = this.getSubAnimation("Explosion", 3, 5);
    this.anim_explode4_air = this.getSubAnimation("Explosion", 4, 5);    
    this.anim_explode3_emerald = this.createOverlayAnimation(this.piecetiles[EMERALD], this.anim_explode3_air);
    this.anim_explode4_emerald = this.createOverlayAnimation(this.piecetiles[EMERALD], this.anim_explode4_air);
    this.anim_explode3_sapphire = this.createOverlayAnimation(this.piecetiles[SAPPHIRE], this.anim_explode3_air);
    this.anim_explode4_sapphire = this.createOverlayAnimation(this.piecetiles[SAPPHIRE], this.anim_explode4_air);
    this.anim_explode3_ruby = this.createOverlayAnimation(this.piecetiles[RUBY], this.anim_explode3_air);
    this.anim_explode4_ruby = this.createOverlayAnimation(this.piecetiles[RUBY], this.anim_explode4_air);
    this.anim_explode3_bag = this.createOverlayAnimation(this.piecetiles[BAG], this.anim_explode3_air);
    this.anim_explode4_bag = this.createOverlayAnimation(this.piecetiles[BAG], this.anim_explode4_air);        
    this.piecetiles[BOMB_EXPLODE]      = this.anim_explode0_air;    
    this.piecetiles[BIGBOMB_EXPLODE]   = this.anim_explode0_air;    
    this.piecetiles[BUG_EXPLODE]       = this.anim_explode0_air;    
    this.piecetiles[LORRY_EXPLODE]     = this.anim_explode0_air;       
    this.piecetiles[TIMEBOMB_EXPLODE]  = this.anim_explode0_air;
    this.piecetiles[EXPLODE1_AIR]      = this.anim_explode0_air;
    this.piecetiles[EXPLODE2_AIR]      = this.anim_explode1_air;  
    this.piecetiles[EXPLODE3_AIR]      = this.anim_explode2_air;   
    this.piecetiles[EXPLODE4_AIR]      = this.anim_explode3_air;    
    this.piecetiles[EXPLODE1_EMERALD]  = this.anim_explode0_air;
    this.piecetiles[EXPLODE2_EMERALD]  = this.anim_explode1_air;
    this.piecetiles[EXPLODE3_EMERALD]  = this.anim_explode2_air;
    this.piecetiles[EXPLODE4_EMERALD]  = this.anim_explode3_emerald;  
    this.piecetiles[EXPLODE1_SAPPHIRE] = this.anim_explode0_air;    
    this.piecetiles[EXPLODE2_SAPPHIRE] = this.anim_explode1_air;   
    this.piecetiles[EXPLODE3_SAPPHIRE] = this.anim_explode2_air; 
    this.piecetiles[EXPLODE4_SAPPHIRE] = this.anim_explode3_sapphire;
    this.piecetiles[EXPLODE1_RUBY]     = this.anim_explode0_air;    
    this.piecetiles[EXPLODE2_RUBY]     = this.anim_explode1_air;   
    this.piecetiles[EXPLODE3_RUBY]     = this.anim_explode2_air; 
    this.piecetiles[EXPLODE4_RUBY]     = this.anim_explode3_ruby;
    this.piecetiles[EXPLODE1_BAG]      = this.anim_explode0_air; 
    this.piecetiles[EXPLODE2_BAG]      = this.anim_explode1_air;    
    this.piecetiles[EXPLODE3_BAG]      = this.anim_explode2_air;    
    this.piecetiles[EXPLODE4_BAG]      = this.anim_explode3_bag;  
    this.anim_explode0_tnt = this.getSubAnimation("Explosion Deep", 0,5);
    this.anim_explode1_tnt = this.getSubAnimation("Explosion Deep", 1,5);
    this.anim_explode2_tnt = this.getSubAnimation("Explosion Deep", 2,5);
    this.anim_explode3_tnt = this.getSubAnimation("Explosion Deep", 3,5);
    this.anim_explode4_tnt = this.getSubAnimation("Explosion Deep", 4,5);
    this.piecetiles[EXPLODE1_TNT]      = this.anim_explode0_tnt; 
    this.piecetiles[EXPLODE2_TNT]      = this.anim_explode1_tnt;    
    this.piecetiles[EXPLODE3_TNT]      = this.anim_explode2_tnt;    
    this.piecetiles[EXPLODE4_TNT]      = this.anim_explode3_tnt;                   
        
    this.anim_sapphire_break = this.getAnimation("Sapphire Break");
    this.anim_citrine_break = this.getAnimation("Citrine Break");
//    this.anim_sand = this.createAnimationDescription([this.piecetiles[SAND][0]]);    
    this.anim_bag_opening = this.getAnimation("Bag Open");

    this.anim_sapphire_away = this.createShrinkAnimationDescription(this.piecetiles[SAPPHIRE][0]);
    this.anim_emerald_away = this.createShrinkAnimationDescription(this.piecetiles[EMERALD][0]); 
    this.anim_citrine_away = this.createShrinkAnimationDescription(this.piecetiles[CITRINE][0]);
    this.anim_ruby_away = this.createShrinkAnimationDescription(this.piecetiles[RUBY][0]);   
    this.anim_timebomb_away = this.createShrinkAnimationDescription(this.piecetiles[TIMEBOMB][0]);
    this.anim_timebomb_placement = this.createRotatingAnimation(
        this.createRevertedAnimation(this.createShrinkAnimationDescription(this.piecetiles[ACTIVEBOMB5][0])), 20,0);
    this.anim_timebomb10_away = this.createShrinkAnimationDescription(this.piecetiles[TIMEBOMB10][0]);
    this.anim_keyred_away = this.createShrinkAnimationDescription(this.piecetiles[KEYRED][0]);
    this.anim_keyblue_away = this.createShrinkAnimationDescription(this.piecetiles[KEYBLUE][0]);
    this.anim_keygreen_away = this.createShrinkAnimationDescription(this.piecetiles[KEYGREEN][0]);
    this.anim_keyyellow_away = this.createShrinkAnimationDescription(this.piecetiles[KEYYELLOW][0]);
    
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
    for (var i=0; i<a.length; i++)
    {   var t = (segment + i/LevelRenderer.FRAMESPERSTEP) / totalsegments;        
        a[i] = tiles[Math.floor(t*numtiles)];
    }
//console.log("subanimation",filename,segment,totalsegments,tiles,"->",a);    
    // patch for now: revert animation
    var b = [a[0]];
    for (var i=a.length-1; i>=0; i--)
    {   b.push(a[i]);
    }
    return b;    
}
  
LevelRenderer.prototype.createAnimationDescription = function(tile)
{
    var a = new Array(LevelRenderer.FRAMESPERSTEP);    
    for (var i=0; i<a.length; i++)
    {   a[i] = tile;
    }
    return a;
};
    
LevelRenderer.prototype.createShrinkAnimationDescription = function(tile)
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
            
        var frames_until_endposition = i%LevelRenderer.FRAMESPERSTEP;
        var degree = end - Math.floor((frames_until_endposition*(end-start))/LevelRenderer.FRAMESPERSTEP);
        r = (r + degree + 3600) % 360;
        b[i] = t | ((s+r*60)<<16);      
    }
    return b;   
};
            
   
// -------------- draw the whole scene as defined by the logic -----------
LevelRenderer.prototype.draw = function
(   displaywidth, displayheight, screentilesize,
    logic, frames_until_endposition, 
    offx0, offy0, offx1, offy1
)
{           
    // start up the rendering    
    this.startDrawing(displaywidth, displayheight, screentilesize, offx0,offy0, offx1,offy1);

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
            {   var anim = this.determineTileAt(logic,x,y); 
                if (anim!=null)
                {   this.addNonMoveAnimationToBuffers(screentilesize,0, anim, x,y);
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
                    {   this.addNonMoveAnimationToBuffers(screentilesize,frameindex, anim, x,y);
                    }
                    break;
                }   
                case TRN_MOVEDOWN:
                {   this.addMoveAnimationToBuffers(screentilesize,frameindex, oldpiece,newpiece, x,y, 0,1, logic);
                    break;
                }
                case TRN_MOVEUP:
                {   this.addMoveAnimationToBuffers(screentilesize,frameindex, oldpiece,newpiece, x,y, 0,-1, logic);
                    break;
                }
                case TRN_MOVELEFT:
                {   this.addMoveAnimationToBuffers(screentilesize,frameindex, oldpiece,newpiece, x,y, -1,0, logic);
                    break;
                }
                case TRN_MOVERIGHT:
                {   this.addMoveAnimationToBuffers(screentilesize,frameindex, oldpiece,newpiece, x,y, 1,0, logic);
                    break;
                }
                case TRN_MOVEDOWN2:
                {   this.addMoveAnimationToBuffers(screentilesize,frameindex, oldpiece,newpiece, x,y, 0,2, logic);
                    break;
                }
                case TRN_MOVEUP2:
                {   this.addMoveAnimationToBuffers(screentilesize,frameindex, oldpiece,newpiece, x,y, 0,-2, logic);
                    break;
                }
                case TRN_MOVELEFT2:
                {   this.addMoveAnimationToBuffers(screentilesize,frameindex, oldpiece,newpiece, x,y, -2,0, logic);
                    break;
                }
                case TRN_MOVERIGHT2:
                {   this.addMoveAnimationToBuffers(screentilesize,frameindex, oldpiece,newpiece, x,y, 2,0, logic);
                    break;
                }                   
                case TRN_HIGHLIGHT:
                {   var anim = this.determineHighlightAnimation(newpiece, x,y,logic);
                    if (anim!=null)
                    {   this.addNonMoveAnimationToBuffers(screentilesize,frameindex, anim, x,y);
                    }           
                    break;
                }                   
            }               
    }
                        
    // send accumulated data to the screen
    this.flush();        
};
            
LevelRenderer.prototype.addMoveAnimationToBuffers = function
(   screentilesize, frameindex, oldpiece, newpiece, x1, y1, dx, dy, logic )
{    
    var anim = this.determineMoveAnimation(oldpiece,newpiece,x1,y1,dx,dy,logic);
    if (anim)
    {   // determine correct position
        var x2 = x1 + dx;
        var y2 = y1 + dy;
        var d = screentilesize*frameindex/LevelRenderer.FRAMESPERSTEP;
        var px = screentilesize*x1+d*(x2-x1);
        var py = screentilesize*y1+d*(y2-y1);
        for (var i=frameindex; i<anim.length; i+=LevelRenderer.FRAMESPERSTEP)
        {   this.addTile(px,py,anim[i]);
        }
    }   
};

LevelRenderer.prototype.addNonMoveAnimationToBuffers = function(screentilesize, frameindex, anim, x1, y1)
{
    for (var i=frameindex; i<anim.length; i+=LevelRenderer.FRAMESPERSTEP)
    {   this.addTile(screentilesize*x1,screentilesize*y1,anim[i]);
    }
};
        
LevelRenderer.prototype.determineMoveAnimation = function(oldpiece, newpiece, x, y, dx, dy, logic)
{
    switch (oldpiece)
    {   case ROCK:
        case ROCK_FALLING:
        {   if (dx<0) { return this.anim_rock_left; }
            else if (dx>0) { return this.anim_rock_right; }
            break;
        }
        case ROCKEMERALD:
        case ROCKEMERALD_FALLING:
        {   if (dx<0) { return this.anim_rockemerald_left; }
            else if (dx>0) { return this.anim_rockemerald_right; }               
            break;
        }
        case BAG:
        case BAG_FALLING:
        case BAG_OPENING:
        {   if (dx<0) { return this.anim_bag_left; }
            else if (dx>0) { return this.anim_bag_right; }                           
            break;
        }
        case BOMB:
        case BOMB_FALLING:
        {   if (dx<0) { return this.anim_bomb_left; }
            else if (dx>0) { return this.anim_bomb_right; }
            else if (dy>=0) { return this.anim_bomb_fall; }       
            break;      
        }
        case ELEVATOR:
        {   if (dy<0) { return this.anim_elevator; }
            break;
        }
        case ELEVATOR_TOLEFT:
        {   if (dy<0) { return this.anim_elevatorleft; }
            break;
        }
        case ELEVATOR_TORIGHT:
        {   if (dy<0) { return this.anim_elevatorright; }
            break;
        }
    }

    // when no animation is explicitly defined, use the default animation of the new piece (covers many "falling" and "pushing" actions)
    return this.piecetiles[newpiece];
};
    
LevelRenderer.prototype.determineTransformAnimation = function (oldpiece, newpiece, originatingx, originatingy, logic)
{
    switch (oldpiece)
    {   
//        case ROCK:
//        case ROCK_FALLING:    
//        {   if (newpiece==SAND_FULL) { return this.anim_sand; }
//            break;
//        }
//        case ROCKEMERALD:
//        case ROCKEMERALD_FALLING:     
//        {   if (newpiece==SAND_FULLEMERALD) { return this.anim_sand; }
//            break;
//        }
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
        case EXPLODE1_AIR: { return this.anim_explode1_air; }
        case EXPLODE2_AIR: { return this.anim_explode2_air; }
        case EXPLODE3_AIR: { return this.anim_explode3_air; }
        case EXPLODE4_AIR: { return this.anim_explode4_air; }          
        case EXPLODE1_EMERALD: { return this.anim_explode1_air; }
        case EXPLODE2_EMERALD: { return this.anim_explode2_air; }
        case EXPLODE3_EMERALD: { return this.anim_explode3_emerald; }
        case EXPLODE4_EMERALD: { return this.anim_explode4_emerald; }
        case EXPLODE1_SAPPHIRE: { return this.anim_explode1_air; }
        case EXPLODE2_SAPPHIRE: { return this.anim_explode2_air; }
        case EXPLODE3_SAPPHIRE: { return this.anim_explode3_sapphire; }
        case EXPLODE4_SAPPHIRE: { return this.anim_explode4_sapphire; }
        case EXPLODE1_RUBY: { return this.anim_explode1_air; }
        case EXPLODE2_RUBY: { return this.anim_explode2_air; }
        case EXPLODE3_RUBY: { return this.anim_explode3_ruby; }
        case EXPLODE4_RUBY: { return this.anim_explode4_ruby; }
        case EXPLODE1_BAG: { return this.anim_explode1_air; }
        case EXPLODE2_BAG: { return this.anim_explode2_air; }
        case EXPLODE3_BAG: { return this.anim_explode3_bag; }
        case EXPLODE4_BAG: { return this.anim_explode4_bag; }
        case EXPLODE1_TNT: { return this.anim_explode1_tnt; }
        case EXPLODE2_TNT: { return this.anim_explode2_tnt; }
        case EXPLODE3_TNT: { return this.anim_explode3_tnt; }
        case EXPLODE4_TNT: { return this.anim_explode4_tnt; }
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
        case SWAMP_UP: { return  this.anim_swamp_up; }
        case SWAMP_DOWN: { return (oldpiece==EARTH) ? this.anim_swamp_down : null; }
        case SWAMP_LEFT: { return (oldpiece==EARTH) ? this.anim_swamp_left : null; }
        case SWAMP_RIGHT: { return (oldpiece==EARTH) ? this.anim_swamp_right : null; }
        case SWAMP: 
        {   if (oldpiece==DROP) { return this.anim_drophit; }
            break;
        }
        case DOOR_OPENED:
        {   if (oldpiece==DOOR) { return this.anim_door_opening; }
            else { return null; }
        }
        case DOOR_CLOSING: { return null; }
        case DOOR_CLOSED: { return this.anim_door_closing; }
        case ONETIMEDOOR_CLOSED: { return this.anim_door_onetime; }
        case CUSHION: 
        {   if (oldpiece==CUSHION_BUMPING) { return null; }
            break;
        }
        case CUSHION_BUMPING:
        {   if (oldpiece==CUSHION) { return this.piecetiles[CUSHION]; }
            break;
        }    
        case EXPLODE1_AIR:
        case EXPLODE1_EMERALD:
        case EXPLODE1_SAPPHIRE:
        case EXPLODE1_RUBY:
        case EXPLODE1_BAG:
        {   return this.anim_explode0_air;
        }
        case EXPLODE1_TNT: { return this.anim_explode0_tnt; }
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
        
        case YAMYAMLEFT:          
        case YAMYAMRIGHT:         
        case YAMYAMUP:            
        case YAMYAMDOWN:          
        {   return this.anim_yamyam;
        }
    }        
    
    return this.piecetiles[highlightpiece];
}; 
    
LevelRenderer.prototype.determineTileAt = function(logic, x, y)
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
        case ACID:
        {   var n = logic.getTurnsDone()&1;
            var pl = logic.piece(x-1,y);
            var pr = logic.piece(x+1,y);
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
            case SWAMP_UP:
            case SWAMP_DOWN:
            case SWAMP_LEFT:
            case SWAMP_RIGHT:         
            case MAN1_DIGLEFT:
            case MAN2_DIGLEFT:
            case MAN1_DIGRIGHT:
            case MAN2_DIGRIGHT:
            case MAN1_DIGUP:
            case MAN2_DIGUP:
            case MAN1_DIGDOWN:
            case MAN2_DIGDOWN:    return false;           
            default:                    return true;
        }
    }    
}
    
   
// --------------------------- direct piece tile rendering -----------------

LevelRenderer.prototype.addSimplePieceToBuffer = function(x, y, piece)
{       
/*
        int[] anim = piecetiles[piece&0xff];
        if (anim!=null)
        {   
            addTile(x,y,anim[0]);
            if (anim.length > FRAMESPERSTEP)
            {   addTile(x,y, anim[FRAMESPERSTEP]);
            }
        }
*/        
};
