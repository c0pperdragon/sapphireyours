
var LevelRenderer = function() 
{   TileRenderer.call(this);

    this.doneLoading = false;
    this.tmp_disable_static_tile = null;
    
    // non-moving piece appearances: can be a combination multiple tiles - therefore an array is provided    
    // default translation of piece code to tile indizes
    this.piecetiles = null;
    // special tiles for context specific appearances
    this.earthtiles = null;
    this.walltiles = null;
    this.roundwalltiles = null;
    this.acidtiles_leftedge = null;
    this.acidtiles_rightedge = null;
    this.acidtiles_bothedges = null;
    this.acidtiles_noedge = null;
    
    // animation information
    this.anim_man1_left = null;
    this.anim_man1_right = null;
    this.anim_man1_up = null;
    this.anim_man1_down = null;
    this.anim_man1_digleft = null;
    this.anim_man1_digright = null;
    this.anim_man1_digup = null;
    this.anim_man1_digdown = null;
    this.anim_man1_pushleft = null;
    this.anim_man1_pushright = null;
    this.anim_man1_pushup = null;
    this.anim_man1_pushdown = null;
    this.anim_man1_blink = null;
    this.anim_man2_left = null;
    this.anim_man2_right = null;
    this.anim_man2_up = null;
    this.anim_man2_down = null;
    this.anim_man2_digleft = null;
    this.anim_man2_digright = null;
    this.anim_man2_digup = null;
    this.anim_man2_digdown = null;
    this.anim_man2_pushleft = null;
    this.anim_man2_pushright = null;
    this.anim_man2_pushup = null;
    this.anim_man2_pushdown = null;
    this.anim_man2_blink = null;
    
    this.anim_earth_up = null;
    this.anim_earth_down = null;
    this.anim_earth_left = null;
    this.anim_earth_right = null;
    
    this.anim_sapphire_fall = null; 
    this.anim_sapphire_away = null; 
    this.anim_sapphire_shine = null; 
    this.anim_sapphire_break = null; 
    this.anim_emerald_fall = null;
    this.anim_emerald_away = null;
    this.anim_emerald_shine = null;
    this.anim_citrine_fall = null;
    this.anim_citrine_away = null;
    this.anim_citrine_shine = null;
    this.anim_citrine_break = null;
    this.anim_ruby_fall = null;
    this.anim_ruby_away = null;   
    this.anim_ruby_shine = null;  
    this.anim_rock_left = null;
    this.anim_rock_right = null;
    this.anim_rockemerald_left = null;
    this.anim_rockemerald_right = null;
    this.anim_bag_left = null;
    this.anim_bag_right = null;
    this.anim_bag_opening = null;
    this.anim_bomb_fall = null;
    this.anim_bomb_left = null;
    this.anim_bomb_right = null;
    this.anim_sand = null;
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
    this.anim_door_red = null;
    this.anim_door_green = null;
    this.anim_door_blue = null;
    this.anim_door_yellow = null;
    this.anim_door_onetime = null;
    this.anim_door_opening = null;
    this.anim_door_closing = null;
    this.anim_cushion = null;
    this.anim_gunfire = null;
    this.anim_swamp = null;
    this.anim_swamp_left = null;
    this.anim_swamp_right = null;
    this.anim_swamp_up = null;
    this.anim_swamp_down = null;
    this.anim_drop_left = null;
    this.anim_drop_right = null;
    this.anim_createdrop = null;
    this.anim_drop = null;
    this.anim_drophit = null;
    this.anim_lorry_left = null;
    this.anim_lorry_right = null;
    this.anim_lorry_up = null;
    this.anim_lorry_down = null;  
    this.anim_lorry_left_up = null;
    this.anim_lorry_left_down = null;
    this.anim_lorry_up_right = null;
    this.anim_lorry_up_left = null;
    this.anim_lorry_right_down = null;
    this.anim_lorry_right_up = null;
    this.anim_lorry_down_left = null;
    this.anim_lorry_down_right = null;
    this.anim_bug_left = null;
    this.anim_bug_right = null;
    this.anim_bug_up = null;
    this.anim_bug_down = null;    
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
    this.anim_elevator = null;
    this.anim_elevatorleft = null;
    this.anim_elevatorright = null;
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
    this.tmp_disable_static_tile = (new Array(MAPWIDTH*MAPHEIGHT)).map(x=>false);
    
    return this;
};

LevelRenderer.prototype.isLoaded = function()    
{   
    if (this.doneLoading) return true;
    if (!TileRenderer.prototype.isLoaded.call(this)) return false;


    // prepare special animation redirects 
    this.piecetiles = (new Array(256)).fill(null);
    this.earthtiles = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]
    this.walltiles =  [null,null,null,null,null,null,null,null,null]
    this.roundwalltiles = [null,null,null,null];
    this.acidtiles_leftedge = [null,null];
    this.acidtiles_rightedge = [null,null];
    this.acidtiles_bothedges = [null,null];
    this.acidtiles_noedge = [null,null];

    this.piecetiles[MAN1] = this.getImage("1man");
    this.anim_man1_blink = this.createAnimationDescription(this.getImage("1man"));
    this.piecetiles[MAN2] = this.getImage("2man");        
    this.anim_man2_blink = this.createAnimationDescription(this.getImage("2man"));
    this.piecetiles[MAN1_LEFT] = this.getImage("1walklft");
    this.anim_man1_left = this.createAnimationDescription(this.getImage("1walklft"));
    this.piecetiles[MAN1_RIGHT] = this.getImage("1walkrgt");
    this.anim_man1_right = this.createAnimationDescription(this.getImage("1walkrgt"));
    this.piecetiles[MAN1_UP] = this.getImage("1walkup");
    this.anim_man1_up = this.createAnimationDescription(this.getImage("1walkup"));
    this.piecetiles[MAN1_DOWN] = this.getImage("1walkdwn");
    this.anim_man1_down = this.createAnimationDescription(this.getImage("1walkdwn"));
    this.piecetiles[MAN1_DIGLEFT] = this.getImage("1diglft");
    this.anim_man1_digleft = this.createAnimationDescription(this.getImage("1diglft"));
    this.piecetiles[MAN1_DIGRIGHT] = this.getImage("1digrgt");
    this.anim_man1_digright = this.createAnimationDescription(this.getImage("1digrgt"));
    this.piecetiles[MAN1_DIGUP] = this.getImage("1digup");
    this.anim_man1_digup = this.createAnimationDescription(this.getImage("1digup"));
    this.piecetiles[MAN1_DIGDOWN] = this.getImage("1digdwn");
    this.anim_man1_digdown = this.createAnimationDescription(this.getImage("1digdwn"));
    this.piecetiles[MAN1_PUSHLEFT] = this.anim_man1_pushleft = this.createAnimationDescription(this.getImage("1pushlft"));
    this.piecetiles[MAN1_PUSHRIGHT] = this.anim_man1_pushright = this.createAnimationDescription(this.getImage("1pushrgt"));
    this.piecetiles[MAN1_PUSHUP] = this.anim_man1_pushup = this.anim_man1_up;
    this.piecetiles[MAN1_PUSHDOWN] = this.anim_man1_pushdown = this.anim_man1_down;
    this.piecetiles[MAN2_LEFT] = this.getImage("2walklft");
    this.anim_man2_left = this.createAnimationDescription(this.getImage("2walklft"));
    this.piecetiles[MAN2_RIGHT] = this.getImage("2walkrgt");
    this.anim_man2_right = this.createAnimationDescription(this.getImage("2walkrgt"));
    this.piecetiles[MAN2_UP] = this.getImage("2walkup");
    this.anim_man2_up = this.createAnimationDescription(this.getImage("2walkup"));
    this.piecetiles[MAN2_DOWN] = this.getImage("2walkdwn");
    this.anim_man2_down = this.createAnimationDescription(this.getImage("2walkdwn"));
    this.piecetiles[MAN2_DIGLEFT] = this.getImage("2diglft");
    this.anim_man2_digleft = this.createAnimationDescription(this.getImage("2diglft"));
    this.piecetiles[MAN2_DIGRIGHT] = this.getImage("2digrgt");
    this.anim_man2_digright = this.createAnimationDescription(this.getImage("2digrgt"));
    this.piecetiles[MAN2_DIGUP] = this.getImage("2digup");
    this.anim_man2_digup = this.createAnimationDescription(this.getImage("2digup"));
    this.piecetiles[MAN2_DIGDOWN] = this.getImage("2digdwn");
    this.anim_man2_digdown = this.createAnimationDescription(this.getImage("2digdwn"));        
    this.piecetiles[MAN2_PUSHLEFT] = this.anim_man2_pushleft = this.createAnimationDescription(this.getImage("2pushlft"));
    this.piecetiles[MAN2_PUSHRIGHT] = this.anim_man2_pushright = this.createAnimationDescription(this.getImage("2pushrgt"));
    this.piecetiles[MAN2_PUSHUP] = this.anim_man2_pushup = this.anim_man2_up;
    this.piecetiles[MAN2_PUSHDOWN] = this.anim_man2_pushdown = this.anim_man2_down;
    this.piecetiles[EARTH] = this.getImage("Earth All");    
    for (var i=0; i<16; i++) 
    {   this.earthtiles[i] = this.createAnimationDescription( [ (this.getImage("Earth All")) [15-i] ] );
    }               
    var wall = this.piecetiles[WALL] = this.getImage("Wall All");
    this.walltiles[0] = this.createAnimationDescription([wall[5]]);  // nothing - wall - nothing      
    this.walltiles[1] = this.createAnimationDescription([wall[6]]);  // wall    - wall - nothing
    this.walltiles[2] = this.createAnimationDescription([wall[2]]);  // rounded - wall - nothing          
    this.walltiles[3] = this.createAnimationDescription([wall[7]]);  // nothing - wall - wall         
    this.walltiles[4] = this.createAnimationDescription([wall[8]]);  // wall    - wall - wall         
    this.walltiles[5] = this.createAnimationDescription([wall[0]]);  // rounded - wall - wall     ??          
    this.walltiles[6] = this.createAnimationDescription([wall[3]]);  // nothing - wall - rounded          
    this.walltiles[7] = this.createAnimationDescription([wall[1]]);  // wall    - wall - rounded  ??          
    this.walltiles[8] = this.createAnimationDescription([wall[4]]);  // rounded - wall - rounded          
    var rwall = this.piecetiles[ROUNDWALL] = this.getImage("Wall Round All");
    for (var i=0; i<4; i++) 
    {   this.roundwalltiles[i] = this.createAnimationDescription([rwall[i]]);
    }               
    this.anim_earth_right = new Array(16);
    var anim_removal = this.createAnimationDescription(this.getImage("Earth Right")); 
    for (var i=0; i<16; i++) this.anim_earth_right[i] = this.joinAnimationDescriptions(this.earthtiles[i], anim_removal);
    this.anim_earth_up = new Array(16);
    anim_removal = this.createRotatedAnimation(anim_removal, 90);
    for (var i=0; i<16; i++) this.anim_earth_up[i] = this.joinAnimationDescriptions(this.earthtiles[i], anim_removal);
    this.anim_earth_left = new Array(16);
    anim_removal = this.createRotatedAnimation(anim_removal, 90);
    for (var i=0; i<16; i++) this.anim_earth_left[i] = this.joinAnimationDescriptions(this.earthtiles[i], anim_removal);       
    this.anim_earth_down = new Array(16);
    anim_removal = this.createRotatedAnimation(anim_removal, 90);
    for (var i=0; i<16; i++) this.anim_earth_down[i] = this.joinAnimationDescriptions(this.earthtiles[i], anim_removal);
        
    this.piecetiles[SAND] = this.getImage("Sand");
    this.piecetiles[GLASSWALL] = this.getImage("Glass");
    this.piecetiles[STONEWALL] = this.getImage("Stone Wall");
    this.piecetiles[ROUNDSTONEWALL] = this.getImage("Round Stone Wall");
    this.piecetiles[WALLEMERALD] = this.getImage("Wall Emerald");
    this.piecetiles[EMERALD] = this.piecetiles[EMERALD_FALLING] = this.getImage("Emerald");
    this.anim_emerald_fall = this.createAnimationDescription(this.getImage("Emerald"));
    this.anim_emerald_shine = this.createAnimationDescription(this.getImage("Emerald Shine"));
    this.piecetiles[CITRINE] = this.piecetiles[CITRINE_FALLING] = this.getImage("Citrine");
    this.anim_citrine_fall = this.createAnimationDescription(this.getImage("Citrine"));    
    this.anim_citrine_shine = this.createAnimationDescription(this.getImage("Citrine Shine"));
    this.piecetiles[SAPPHIRE] = this.piecetiles[SAPPHIRE_FALLING] = this.getImage("Sapphire");
    this.anim_sapphire_fall = this.createAnimationDescription(this.getImage("Sapphire"));    
    this.anim_sapphire_shine = this.createAnimationDescription(this.getImage("Sapphire Shine"));
    this.piecetiles[RUBY] = this.piecetiles[RUBY_FALLING] = this.getImage("Ruby");
    this.anim_ruby_fall = this.createAnimationDescription(this.getImage("Ruby"));    
    this.anim_ruby_shine = this.createAnimationDescription(this.getImage("Ruby Shine"));
    this.piecetiles[ROCK] = this.piecetiles[ROCK_FALLING] = this.getImage("Stone"); 
    this.anim_rock_right = this.createAnimationDescription(this.getImage("Stone Right"));    
    this.anim_rock_left = this.createAnimationDescription(this.getImage("Stone Left"));
    this.piecetiles[ROCKEMERALD] = this.piecetiles[ROCKEMERALD_FALLING] = this.getImage("Stone Emerald");
    this.anim_rockemerald_right = this.createAnimationDescription(this.getImage("Stone Emerald"));
    this.anim_rockemerald_left = this.createRevertedAnimation(this.anim_rockemerald_right);
    this.piecetiles[BAG] = this.piecetiles[BAG_FALLING] = this.getImage("Bag");
    this.anim_bag_right = this.createAnimationDescription(this.getImage("Bag"));
    this.anim_bag_left = this.createRevertedAnimation(this.anim_bag_right);
    this.piecetiles[BOMB] = this.getImage("Bomb");         
    this.anim_bomb_left = this.createAnimationDescription(this.getImage("Bomb Push"));
    this.anim_bomb_right = this.createRevertedAnimation(this.anim_bomb_left);
    this.piecetiles[BOMB_FALLING] = this.getImage("Bomb Falling");
    this.anim_bomb_fall = this.createAnimationDescription(this.getImage("Bomb Falling"));
    this.piecetiles[DOOR] = this.piecetiles[DOOR_CLOSED] = this.getImage("Exit Closed");    
    this.piecetiles[DOOR_OPENED] = this.piecetiles[DOOR_CLOSING] = this.getImage("Exit");  
    this.anim_door_opening = this.createAnimationDescription(this.getImage("Exit")); 
    this.anim_door_closing = this.createRevertedAnimation(this.anim_door_opening);
    this.piecetiles[SWAMP] = this.getImage("Swamp");
    this.piecetiles[SWAMP_UP & 0xff] = this.piecetiles[SWAMP];
    this.piecetiles[SWAMP_DOWN & 0xff] = this.piecetiles[SWAMP];
    this.piecetiles[SWAMP_LEFT & 0xff] = this.piecetiles[SWAMP];
    this.piecetiles[SWAMP_RIGHT & 0xff] = this.piecetiles[SWAMP];        
    this.anim_swamp = this.createAnimationDescription(this.getImage("Swamp Move"));    
    this.anim_swamp_up = this.createAnimationDescription(this.getImage("Swamp Grow"));
    this.anim_swamp_left = this.createRotatedAnimation(this.anim_swamp_up, 90);
    this.anim_swamp_right = this.createRotatedAnimation(this.anim_swamp_up, -90);      
    this.anim_swamp_down = this.createRotatedAnimation(this.anim_swamp_up, -180);    
    this.anim_drop_left = this.createAnimationDescription(this.getImage("Drop Left"));        
    this.anim_drop_right = this.createAnimationDescription(this.getImage("Drop Right"));
    this.anim_createdrop = this.createAnimationDescription(this.getImage("Drop Down"));
    this.anim_drophit = this.createAnimationDescription(this.getImage("Drop Hit"));
    this.piecetiles[DROP] = this.getImage("Drop");  
    this.anim_drop = this.createAnimationDescription(this.getImage("Drop"));        
    this.piecetiles[CONVERTER] = this.createAnimationDescription(this.getImage("Converter"));
    this.piecetiles[TIMEBOMB] = this.piecetiles[ACTIVEBOMB4] 
    = this.piecetiles[ACTIVEBOMB2] = this.piecetiles[ACTIVEBOMB0] = this.getImage("Timebomb");
    this.piecetiles[ACTIVEBOMB5] = this.piecetiles[ACTIVEBOMB3] 
    = this.piecetiles[ACTIVEBOMB1] = this.getImage("Tickbomb");
    this.piecetiles[TIMEBOMB10] = this.getImage("TNT");
    this.piecetiles[BOX] = this.getImage("Safe");
    this.piecetiles[CUSHION] = this.getImage("Pillow");
    this.anim_cushion = this.createAnimationDescription(this.getImage("Pillow"));
    this.piecetiles[ELEVATOR] = this.getImage("Elevator");
    this.anim_elevator = this.createAnimationDescription(this.getImage("Elevator"));
    this.piecetiles[ELEVATOR_TOLEFT] = this.getImage("Elevator Left");
    this.anim_elevatorleft = this.createAnimationDescription(this.getImage("Elevator Left"));
    this.piecetiles[ELEVATOR_TORIGHT] = this.getImage("Elevator Right");
    this.anim_elevatorright = this.createAnimationDescription(this.getImage("Elevator Right"));    
    this.anim_elevatorleft_throw = this.createAnimationDescription(this.getImage("Elevator Left Throw"));
    this.anim_elevatorright_throw = this.createAnimationDescription(this.getImage("Elevator Right Throw"));
    this.piecetiles[GUN0] = this.getImage("Gun");
    this.piecetiles[GUN1] = this.piecetiles[GUN0];
    this.piecetiles[GUN2] = this.piecetiles[GUN0];
    this.piecetiles[GUN3] = this.piecetiles[GUN0];    
    this.anim_gunfire = this.createAnimationDescription(this.getImage("Gun Fire"));
    var acid = this.getImage("Acid");
    this.piecetiles[ACID] = this.createAnimationDescription(acid); 
    this.acidtiles_noedge[0] = this.createAnimationDescription( acid.slice(0,Math.floor(acid-length/2)) );
    this.acidtiles_noedge[1] = this.createAnimationDescription( acid.slice(Math.floor(acid-length/2)) );
    var acid = this.getImage("Acid Edge Left");
    this.acidtiles_leftedge[0] = this.joinAnimationDescriptions(this.acidtiles_noedge[0], this.createAnimationDescription(acid));
    this.acidtiles_leftedge[1] = this.joinAnimationDescriptions(this.acidtiles_noedge[1], this.createAnimationDescription(acid));
    acid = this.getImage("Acid Edge Right");
    this.acidtiles_rightedge[0] = this.joinAnimationDescriptions(this.acidtiles_noedge[0], this.createAnimationDescription(acid));
    this.acidtiles_rightedge[1] = this.joinAnimationDescriptions(this.acidtiles_noedge[1], this.createAnimationDescription(acid));
    acid = this.getImage("Acid Edge Both");
    this.acidtiles_bothedges[0] = this.joinAnimationDescriptions(this.acidtiles_noedge[0], this.createAnimationDescription(acid));
    this.acidtiles_bothedges[1] = this.joinAnimationDescriptions(this.acidtiles_noedge[1], this.createAnimationDescription(acid));
    this.piecetiles[KEYBLUE] = this.getImage("Key Blue");
    this.piecetiles[KEYRED] = this.getImage("Key Red");
    this.piecetiles[KEYGREEN] = this.getImage("Key Green");
    this.piecetiles[KEYYELLOW] = this.getImage("Key Yellow");
    this.piecetiles[DOORBLUE] = this.getImage("Door Blue");
    this.anim_door_blue = this.createAnimationDescription(this.getImage("Door Blue"));
    this.piecetiles[DOORRED] = this.getImage("Door Red");
    this.anim_door_red = this.createAnimationDescription(this.getImage("Door Red"));
    this.piecetiles[DOORGREEN] = this.getImage("Door Green");
    this.anim_door_green = this.createAnimationDescription(this.getImage("Door Green"));
    this.piecetiles[DOORYELLOW] = this.getImage("Door Yellow");
    this.anim_door_yellow = this.createAnimationDescription(this.getImage("Door Yellow"));
        
    this.piecetiles[ONETIMEDOOR] = this.getImage("Door Onetime");
    this.anim_door_onetime = this.createAnimationDescription(this.getImage("Door Onetime"));
    this.piecetiles[ONETIMEDOOR_CLOSED] = this.getImage("Door Onetime Closed");
        
    this.anim_lorry_left = this.createAnimationDescription(this.getImage("Lorry"));
    this.piecetiles[LORRYLEFT] = this.piecetiles[LORRYLEFT_FIXED] = this.anim_lorry_left;
    this.anim_lorry_down = this.createRotatedAnimation(this.anim_lorry_left,90);
    this.piecetiles[LORRYDOWN] = this.piecetiles[LORRYDOWN_FIXED] = this.anim_lorry_down;
    this.anim_lorry_right = this.createRotatedAnimation(this.anim_lorry_left,180);
    this.piecetiles[LORRYRIGHT] = this.piecetiles[LORRYRIGHT_FIXED] = this.anim_lorry_right;
    this.anim_lorry_up = this.createRotatedAnimation(this.anim_lorry_left,270);         
    this.piecetiles[LORRYUP] = this.piecetiles[LORRYUP_FIXED] = this.anim_lorry_up;
    this.anim_lorry_right_up = this.createRotatingAnimation(this.anim_lorry_right, 0,90);
    this.anim_lorry_up_left = this.createRotatingAnimation(this.anim_lorry_right, 90,180);
    this.anim_lorry_left_down = this.createRotatingAnimation(this.anim_lorry_right, 180,270);
    this.anim_lorry_down_right = this.createRotatingAnimation(this.anim_lorry_right, 270,360);
    this.anim_lorry_right_down = this.createRotatingAnimation(this.anim_lorry_right, 0,-90);
    this.anim_lorry_down_left = this.createRotatingAnimation(this.anim_lorry_right, 270,180);
    this.anim_lorry_left_up = this.createRotatingAnimation(this.anim_lorry_right, 180, 90);
    this.anim_lorry_up_right = this.createRotatingAnimation(this.anim_lorry_right, 90, 0);
    this.anim_bug_right = this.createAnimationDescription(this.getImage("Bug"));
    this.piecetiles[BUGRIGHT] = this.piecetiles[BUGRIGHT_FIXED] = this.anim_bug_right;
    this.anim_bug_up = this.createRotatedAnimation(this.anim_bug_right,90);
    this.piecetiles[BUGUP] = this.piecetiles[BUGUP_FIXED] = this.anim_bug_up;
    this.anim_bug_left = this.createRotatedAnimation(this.anim_bug_right,180);
    this.piecetiles[BUGLEFT] = this.piecetiles[BUGLEFT_FIXED] = this.anim_bug_left;
    this.anim_bug_down = this.createRotatedAnimation(this.anim_bug_right,270);                
    this.piecetiles[BUGDOWN] = this.piecetiles[BUGDOWN_FIXED] = this.anim_bug_down;
    this.anim_bug_right_up = this.createRotatingAnimation(this.anim_bug_right, 0,90);
    this.anim_bug_up_left = this.createRotatingAnimation(this.anim_bug_right, 90,180);
    this.anim_bug_left_down = this.createRotatingAnimation(this.anim_bug_right, 180,270);
    this.anim_bug_down_right = this.createRotatingAnimation(this.anim_bug_right, 270,360);
    this.anim_bug_right_down = this.createRotatingAnimation(this.anim_bug_right, 0,-90);
    this.anim_bug_down_left = this.createRotatingAnimation(this.anim_bug_right, 270,180);
    this.anim_bug_left_up = this.createRotatingAnimation(this.anim_bug_right, 180, 90);
    this.anim_bug_up_right = this.createRotatingAnimation(this.anim_bug_right, 90, 0);
        
    this.piecetiles[YAMYAMLEFT] = this.getImage("YamYam Left");
    this.piecetiles[YAMYAMUP] = this.getImage("YamYam Up");
    this.piecetiles[YAMYAMRIGHT] = this.getImage("YamYam Right");
    this.piecetiles[YAMYAMDOWN] = this.getImage("YamYam Down");    
    this.anim_yamyam = this.createAnimationDescription(this.getImage ("YamYam"));   
    this.piecetiles[ROBOT] = this.getImage("Robot");

    this.piecetiles[SAND_FULL] = this.joinAnimationDescriptions(this.piecetiles[ROCK], this.piecetiles[SAND] );    
    this.piecetiles[SAND_FULLEMERALD] = this.joinAnimationDescriptions(this.piecetiles[ROCKEMERALD], this.piecetiles[SAND] );
        
    var expl = this.getImage("Explosion");
    var num = expl.length;
    this.anim_explode0_air = this.createAnimationDescription(expl.slice(0, Math.floor(num/5)));
    this.anim_explode1_air = this.createAnimationDescription(expl.slice(Math.floor(num/5), Math.floor(2*num/5)));
    this.anim_explode2_air = this.createAnimationDescription(expl.slice(Math.floor(2*num/5), Math.floor(3*num/5)));
    this.anim_explode3_air = this.createAnimationDescription(expl.slice(Math.floor(3*num/5), Math.floor(4*num/5)));
    this.anim_explode4_air = this.createAnimationDescription(expl.slice(Math.floor(4*num/5), Math.floor(5*num/5)));
    this.anim_explode3_emerald = this.joinAnimationDescriptions(this.piecetiles[EMERALD], this.anim_explode3_air);
    this.anim_explode4_emerald = this.joinAnimationDescriptions(this.piecetiles[EMERALD], this.anim_explode4_air);
    this.anim_explode3_sapphire = this.joinAnimationDescriptions(this.piecetiles[SAPPHIRE], this.anim_explode3_air);
    this.anim_explode4_sapphire = this.joinAnimationDescriptions(this.piecetiles[SAPPHIRE], this.anim_explode4_air);
    this.anim_explode3_ruby = this.joinAnimationDescriptions(this.piecetiles[RUBY], this.anim_explode3_air);
    this.anim_explode4_ruby = this.joinAnimationDescriptions(this.piecetiles[RUBY], this.anim_explode4_air);
    this.anim_explode3_bag = this.joinAnimationDescriptions(this.piecetiles[BAG], this.anim_explode3_air);
    this.anim_explode4_bag = this.joinAnimationDescriptions(this.piecetiles[BAG], this.anim_explode4_air);        
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
    expl = this.getImage("Explosion Deep");
    num = expl.length;
    this.anim_explode0_tnt = this.createAnimationDescription(expl.slice(0, Math.floor(num/5)));
    this.anim_explode1_tnt = this.createAnimationDescription(expl.slice(Math.floor(num/5), Math.floor(2*num/5)));
    this.anim_explode2_tnt = this.createAnimationDescription(expl.slice(Math.floor(2*num/5), Math.floor(3*num/5)));
    this.anim_explode3_tnt = this.createAnimationDescription(expl.slice(Math.floor(3*num/5), Math.floor(4*num/5)));
    this.anim_explode4_tnt = this.createAnimationDescription(expl.slice(Math.floor(4*num/5), Math.floor(5*num/5)));
    this.piecetiles[EXPLODE1_TNT]      = this.anim_explode0_tnt; 
    this.piecetiles[EXPLODE2_TNT]      = this.anim_explode1_tnt;    
    this.piecetiles[EXPLODE3_TNT]      = this.anim_explode2_tnt;    
    this.piecetiles[EXPLODE4_TNT]      = this.anim_explode3_tnt;                   
        
    this.anim_sapphire_break = this.createAnimationDescription(this.getImage("Sapphire Break"));        
    this.anim_citrine_break = this.createAnimationDescription(this.getImage("Citrine Break"));    
    this.anim_sand = this.createAnimationDescription([this.piecetiles[SAND][0]]);    
    this.anim_bag_opening = this.createAnimationDescription(this.getImage ("Bag Open"));

    this.anim_sapphire_away = this.createShrinkAnimationDescription(this.piecetiles[SAPPHIRE][0]);
    this.anim_emerald_away = this.createShrinkAnimationDescription(this.piecetiles[EMERALD][0]); 
    this.anim_citrine_away = this.createShrinkAnimationDescription(this.piecetiles[CITRINE][0]);
    this.anim_ruby_away = this.createShrinkAnimationDescription(this.piecetiles[RUBY][0]);   
    this.anim_timebomb_away = this.createShrinkAnimationDescription(this.piecetiles[TIMEBOMB][0]);
    this.anim_timebomb_placement = this.createRotatingAnimation(this.createRevertedAnimation(this.createShrinkAnimationDescription(this.piecetiles[ACTIVEBOMB5][0])), 20,0);
    this.anim_timebomb10_away = this.createShrinkAnimationDescription(this.piecetiles[TIMEBOMB10][0]);
    this.anim_keyred_away = this.createShrinkAnimationDescription(this.piecetiles[KEYRED][0]);
    this.anim_keyblue_away = this.createShrinkAnimationDescription(this.piecetiles[KEYBLUE][0]);
    this.anim_keygreen_away = this.createShrinkAnimationDescription(this.piecetiles[KEYGREEN][0]);
    this.anim_keyyellow_away = this.createShrinkAnimationDescription(this.piecetiles[KEYYELLOW][0]);
    
    this.anim_laser_v = this.createAnimationDescription(this.getImage("Laser"));
    this.anim_laser_h = this.createRotatedAnimation(this.anim_laser_v, 90);
    this.anim_laser_br = this.createAnimationDescription(this.getImage("Laser Side"));     
    this.anim_laser_tr = this.createRotatedAnimation(this.anim_laser_br, 90);
    this.anim_laser_tl = this.createRotatedAnimation(this.anim_laser_br, 180);
    this.anim_laser_bl = this.createRotatedAnimation(this.anim_laser_br, 270);    
    this.anim_laser_down = this.createAnimationDescription(this.getImage("Laser Reflect"));       
    this.anim_laser_right = this.createRotatedAnimation(this.anim_laser_down, 90);     
    this.anim_laser_up = this.createRotatedAnimation(this.anim_laser_down, 180);       
    this.anim_laser_left = this.createRotatedAnimation(this.anim_laser_down, 270); 
    
    
    // finished defining all animations
    this.doneLoading = true;
    return true;
};
        
LevelRenderer.prototype.createAnimationDescription = function(tiles)
{
    var numtiles = tiles.length;
    var a = new Array(LevelRenderer.FRAMESPERSTEP);
    
    for (var i=0; i<a.length; i++)
    {   a[i] = tiles[ Math.floor(((LevelRenderer.FRAMESPERSTEP-1-i)*numtiles) / LevelRenderer.FRAMESPERSTEP) ];
    }
    return a;
};
    
LevelRenderer.prototype.createShrinkAnimationDescription = function(tile)
{
    var a = new Array(LevelRenderer.FRAMESPERSTEP);
    for (var i=0; i<a.length; i++)
    {   a[i] = tile + (Math.floor((60*(LevelRenderer.RAMESPERSTEP-i))/LevelRenderer.FRAMESPERSTEP) << 16);
    }
    return a;
};

LevelRenderer.prototype.joinAnimationDescriptions = function(tiles1, tiles2)
{
    return tiles1.concat(tiles2);
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
    tmp_disable_static_tile.fill(false);    
    
    var animstart = 0;
    var animend = 0;
    if (frames_until_endposition>0)
    {   animstart = logic.getFistAnimationOfTurn();
        animend = logic.getAnimationBufferSize();
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
                    if ((logic.piece(x,y) & 0xff) == p)     // highlights disable static rest image of same piece
                    {
                        tmp_disable_static_tile[x+y*MAPWIDTH] = true;
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
                {   this.addRestingAnimationToBuffers(screentilesize,frames_until_endposition, anim, x,y);
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
                    {   this.addRestingAnimationToBuffers(screentilesize,frames_until_endposition, anim, x,y);
                    }
                    break;
                }   
                case TRN_MOVEDOWN:
                {   this.addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, 0,1, logic);
                    break;
                }
                case TRN_MOVEUP:
                {   this.addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, 0,-1, logic);
                    break;
                }
                case TRN_MOVELEFT:
                {   this.addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, -1,0, logic);
                    break;
                }
                case TRN_MOVERIGHT:
                {   this.addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, 1,0, logic);
                    break;
                }
                case TRN_MOVEDOWN2:
                {   this.addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, 0,2, logic);
                    break;
                }
                case TRN_MOVEUP2:
                {   this.addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, 0,-2, logic);
                    break;
                }
                case TRN_MOVELEFT2:
                {   this.addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, -2,0, logic);
                    break;
                }
                case TRN_MOVERIGHT2:
                {   this.addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, 2,0, logic);
                    break;
                }                   
                case TRN_HIGHLIGHT:
                {   var anim = this.determineHighlightAnimation(newpiece, x,y,logic);
                    if (anim!=null)
                    {   this.addRestingAnimationToBuffers(screentilesize,frames_until_endposition, anim, x,y);
                    }           
                    break;
                }                   
            }               
    }
                        
    // send accumulated data to the screen
    this.flush();        
};
            
LevelRenderer.prototype.addMoveAnimationToBuffers = function
(   screentilesize, frames_until_endposition, oldpiece, newpiece, x1, y1, dx, dy, logic )
{
    var anim = this.determineMoveAnimation(oldpiece,newpiece,x1,y1,dx,dy,logic);
    if (anim!=null)
    {   // determine correct position
        var x2 = x1 + dx;
        var y2 = y1 + dy;
        var d = screentilesize*(LevelRenderer.FRAMESPERSTEP-frames_until_endposition)/LevelRenderer.FRAMESPERSTEP;
        var px = screentilesize*x1+d*(x2-x1);
        var py = screentilesize*y1+d*(y2-y1);
                
        // when wanting to use an animation, pick the correct tile
        if (anim.length<=LevelRenderer.FRAMESPERSTEP)
        {   this.addTile(px,py,anim[frames_until_endposition]);
        }
        // draw two images superimposed over each other
        else
        {   this.addTile(px,py,anim[frames_until_endposition]);
            this.addTile(px,py,anim[LevelRenderer.FRAMESPERSTEP+frames_until_endposition]);
        }
    }   
};
    
LevelRenderer.prototype.addRestingAnimationToBuffers = function(screentilesize, frames_until_endposition, anim, x1, y1)
{
    // when wanting to use an animation, pick the correct tile
    if (anim.length<=LevelRenderer.FRAMESPERSTEP)
    {   this.addTile(screentilesize*x1,screentilesize*y1,anim[frames_until_endposition]);
    }
    // draw two images superimposed over each other
    else
    {   this.addTile(screentilesize*x1,screentilesize*y1,anim[frames_until_endposition]);
        this.addTile(screentilesize*x1,screentilesize*y1,anim[LevelRenderer.FRAMESPERSTEP+frames_until_endposition]);
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
        case EMERALD:
        case EMERALD_FALLING:
        {   if (dy>=0) { return this.anim_emerald_fall; }
            break;              
        }
        case SAPPHIRE:
        case SAPPHIRE_FALLING:
        {   if (dy>=0) { return this.anim_sapphire_fall; }
            break;          
        }
        case CITRINE:
        case CITRINE_FALLING:
        {   if (dy>=0) { return this.anim_citrine_fall; }
            break;
        }
        case RUBY:
        case RUBY_FALLING:
        {   if (dy>=0) { return this.anim_ruby_fall; }
            break;              
        }
        case BOMB:
        case BOMB_FALLING:
        {   if (dx<0) { return this.anim_bomb_left; }
            else if (dx>0) { return this.anim_bomb_right; }
            else if (dy>=0) { return this.anim_bomb_fall; }       
            break;      
        }
        case DROP:
        {   return anim_drop;   
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
    switch (newpiece)
    {   case MAN1_LEFT: { return this.anim_man1_left; }
        case MAN1_RIGHT: { return this.anim_man1_right; }
        case MAN1_UP: { return this.anim_man1_up; }
        case MAN1_DOWN: { return this.anim_man1_down; }
        case MAN1_DIGLEFT: { return this.anim_man1_digleft; }
        case MAN1_DIGRIGHT: { return this.anim_man1_digright; }
        case MAN1_DIGUP:  { return this.anim_man1_digup; }
        case MAN1_DIGDOWN: { return this.anim_man1_digdown; }
        case MAN1_PUSHLEFT: { return this.anim_man1_pushleft; }
        case MAN1_PUSHRIGHT: { return this.anim_man1_pushright; }
        case MAN1_PUSHUP: { return this.anim_man1_pushup; }
        case MAN1_PUSHDOWN: { return this.anim_man1_pushdown; }
        case MAN2_LEFT: { return this.anim_man2_left; }
        case MAN2_RIGHT: { return this.anim_man2_right; }
        case MAN2_UP: { return this.anim_man2_up; }
        case MAN2_DOWN: { return this.anim_man2_down; }
        case MAN2_DIGLEFT: { return this.anim_man2_digleft; }
        case MAN2_DIGRIGHT: { return this.anim_man2_digright; }
        case MAN2_DIGUP: { return this.anim_man2_digup; }
        case MAN2_DIGDOWN: { return this.anim_man2_digdown; }
        case MAN2_PUSHLEFT: { return this.anim_man2_pushleft; }
        case MAN2_PUSHRIGHT: { return this.anim_man2_pushright; }
        case MAN2_PUSHUP: { return this.anim_man2_pushup; }
        case MAN2_PUSHDOWN: { return this.anim_man2_pushdown; }                
        case LORRYRIGHT: { return this.anim_lorry_right; }
        case LORRYLEFT: { return this.anim_lorry_left; }
        case LORRYUP: { return this.anim_lorry_up; }
        case LORRYDOWN: { return this.anim_lorry_down; }
        case BUGRIGHT: { return this.anim_bug_right; }
        case BUGLEFT: { return this.anim_bug_left; }
        case BUGUP: { return this.anim_bug_up; }
        case BUGDOWN: { return this.anim_bug_down; }
    }
    // when no animation is explicitly defined, use the still-stand animation of the new piece (covers many "falling" and "pushing" actions)
    return this.piecetiles[newpiece & 0xff];
};
    
LevelRenderer.prototype.determineTransformAnimation = function (oldpiece, newpiece, originatingx, originatingy, logic)
{
    switch (oldpiece)
    {   case ROCK:
        case ROCK_FALLING:    
        {   if (newpiece==SAND_FULL) { return this.anim_sand; }
            break;
        }
        case ROCKEMERALD:
        case ROCKEMERALD_FALLING:     
        {   if (newpiece==SAND_FULLEMERALD) { return this.anim_sand; }
            break;
        }
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
    {   case ACTIVEBOMB5:
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
        case MAN1_DIGLEFT: { return this.anim_man1_digleft; }
        case MAN1_DIGRIGHT: { return this.anim_man1_digright; }
        case MAN1_DIGUP: { return this.anim_man1_digup; }
        case MAN1_DIGDOWN: { return this.anim_man1_digdown; }
        case MAN1_PUSHLEFT: { return this.anim_man1_pushleft; }
        case MAN1_PUSHRIGHT: { return this.anim_man1_pushright; }
        case MAN1_PUSHUP: { return this.anim_man1_pushup; }
        case MAN1_PUSHDOWN: { return this.anim_man1_pushdown; }
        case MAN2_DIGLEFT: { return this.anim_man2_digleft; }
        case MAN2_DIGRIGHT: { return this.anim_man2_digright; }
        case MAN2_DIGUP: { return this.anim_man2_digup; }
        case MAN2_DIGDOWN: { return this.anim_man2_digdown; }
        case MAN2_PUSHLEFT: { return this.anim_man2_pushleft; }
        case MAN2_PUSHRIGHT: { return this.anim_man2_pushright; }
        case MAN2_PUSHUP: { return this.anim_man2_pushup; }
        case MAN2_PUSHDOWN: { return this.anim_man2_pushdown; }
        case CUSHION: 
        {   if (oldpiece==CUSHION_BUMPING) { return null; }
            break;
        }
        case CUSHION_BUMPING:
        {   if (oldpiece==CUSHION) { return this.anim_cushion; }
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
    // when no animation is explicitly defined, use the still-stand animation of the new piece (covers many "falling" and "pushing" actions)
    return this.piecetiles[newpiece & 0xff]; 
};

LevelRenderer.prototype.determineHighlightAnimation = function (highlightpiece, originatingx, originatingy, logic)
{
    switch (highlightpiece)
    {   case EARTH:
        {   return this.earthtiles[this.earthJaggedConfiguration(logic, originatingx, originatingy)];
        }
        case EMERALD: { return this.anim_emerald_shine; }
        case SAPPHIRE: { return this.anim_sapphire_shine; }
        case RUBY: { return this.anim_ruby_shine; }
        case CITRINE:{ return this.anim_citrine_shine; }
        case MAN1: { return this.anim_man1_blink; }
        case MAN2: { return this.anim_man2_blink; }     
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
        case DOORBLUE: { return this.anim_door_blue; }
        case DOORGREEN: { return this.anim_door_green; }
        case DOORYELLOW: { return this.anim_door_yellow; }
        case DOORRED: { return this.anim_door_red; }
        case CUSHION: { return this.anim_cushion; }
        case SWAMP: { return this.anim_swamp; }
        case GUN0:
        case GUN1:
        case GUN2:
        case GUN3:
        {   return this.anim_gunfire;
        }       
        case YAMYAMLEFT:          
        case YAMYAMRIGHT:         
        case YAMYAMUP:            
        case YAMYAMDOWN:          
        {   return this.anim_yamyam;
        }
        case CUSHION_BUMPING: { return this.anim_cushion; }
        case CONVERTER: { return this.piecetiles[CONVERTER]; }              
        case DOOR_OPENED: { return this.piecetiles[DOOR_OPENED&0xff]; }
        case ELEVATOR_TOLEFT: { return this.anim_elevatorleft_throw; }
        case ELEVATOR_TORIGHT: { return this.anim_elevatorright_throw; }
    }        
    return null;        // no default for highlight 
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
            {   if (pr===ACID) { return acidtiles_leftedge[n]; }
                else { return acidtiles_bothedges[n]; }               
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
