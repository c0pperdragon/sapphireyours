
var LevelRenderer = function() 
{   TileRenderer.call(this);

    this.doneLoading = false;
    this.tmp_disable_static_tile = null;
    
    // translation of piece code to tile indizes
    this.piece2tile = null;
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

LevelRenderer.FRAMESPERSTEP = 15;

    // set up opengl  and load textures
LevelRenderer.prototype.$ = function(gl)
{   TileRenderer.call(this);

    this.doneLoading = false;
        
    // temporary data
    this.tmp_disable_static_tile = new Array(Logic.MAPWWIDTH*Logic.MAPHEIGHT);
    for (var i=0; i<Logic.MAPWWIDTH*Logic.MAPHEIGHT; i++) this.tmp_disable_static_tile[i]=false;
        
    // prepare special animation redirects 
    this.piece2tile = new Array(256);  
    this.earthtiles = new Array(16);   
    this.walltiles = new Array(9);     
    this.roundwalltiles = new Array(4);
    this.acidtiles_leftedge = new Array(2);
    this.acidtiles_rightedge = new Array(2);
    this.acidtiles_bothedges = new Array(2);
    this.acidtiles_noedge = new Array(2);
    
    // trigger loading tiles 
    this.anim_man1_blink = this.piece2tile[Logic.MAN1] = this.load("1man");
    this.anim_man2_blink = this.piece2tile[Logic.MAN2] = this.load("2man");    
    this.anim_man1_left = this.piece2tile[Logic.MAN1_LEFT] = this.load("1walklft");
    this.anim_man1_right = this.piece2tile[Logic.MAN1_RIGHT] = this.load("1walkrgt");
    this.anim_man1_up = this.piece2tile[Logic.MAN1_UP] = this.load("1walkup");        
    this.anim_man1_down = this.piece2tile[Logic.MAN1_DOWN] = this.load("1walkdwn");
    this.anim_man1_digleft = this.piece2tile[Logic.MAN1_DIGLEFT] = this.load("1diglft");
    this.anim_man1_digright = this.piece2tile[Logic.MAN1_DIGRIGHT] = this.loadImage("1digrgt");
    this.anim_man1_digup = this.piece2tile[Logic.MAN1_DIGUP] = this.load("1digup");    
    this.anim_man1_digdown = this.piece2tile[Logic.MAN1_DIGDOWN] = this.load("1digdwn");
    this.anim_man1_pushleft = this.piece2tile[Logic.MAN1_PUSHLEFT] = this.load("1pushlft");
    this.anim_man1_pushright = piece2tile[Logic.MAN1_PUSHRIGHT] =  this.load("1pushrgt");
    this.piece2tile[Logic.MAN1_PUSHUP] = this.anim_man1_pushup = this.anim_man1_up;
    this.piece2tile[Logic.MAN1_PUSHDOWN] = this.anim_man1_pushdown = this.anim_man1_down;
    this.anim_man2_left = this.piece2tile[Logic.MAN2_LEFT] = this.load("2walklft");
    this.anim_man2_right = this.piece2tile[Logic.MAN2_RIGHT] = this.load("2walkrgt");
    this.anim_man2_up = this.piece2tile[Logic.MAN2_UP] = this.load("2walkup");
    this.anim_man2_down = this.piece2tile[Logic.MAN2_DOWN] = this.load("2walkdwn");
    this.anim_man2_digleft = this.piece2tile[Logic.MAN2_DIGLEFT] = this.load("2diglft");
    this.anim_man2_digright = this.piece2tile[Logic.MAN2_DIGRIGHT] = this.load("2digrgt");
    this.anim_man2_digup = this.piece2tile[Logic.MAN2_DIGUP] = this.load("2digup");
    this.anim_man2_digdown = this.piece2tile[Logic.MAN2_DIGDOWN] = this.load("2digdwn");
    this.anim_man2_pushleft = this.piece2tile[Logic.MAN2_PUSHLEFT] = this.load("2pushlft");
    this.anim_man2_pushright = this.piece2tile[Logic.MAN2_PUSHRIGHT] = this.load("2pushrgt");
    this.anim_man2_pushup = this.piece2tile[Logic.MAN2_PUSHUP] = anim_man2_up;
    this.anim_man2_pushdown = this.piece2tile[Logic.MAN2_PUSHDOWN] = anim_man2_down;
    this.piece2tile[Logic.EARTH] = this.load("Earth All");
    this.piece2tile[Logic.WALL] = this.load("Wall All");
    this.piece2tile[Logic.ROUNDWALL] = this.load("Wall Round All");
    this.anim_earth_right = this.load("Earth Right");
    this.piece2tile[Logic.SAND] = this.load("Sand");
    this.piece2tile[Logic.GLASSWALL] = this.load("Glass");
    this.piece2tile[Logic.STONEWALL] = this.load("Stone Wall");
    this.piece2tile[Logic.ROUNDSTONEWALL] = this.load("Round Stone Wall");
    this.piece2tile[Logic.WALLEMERALD] = load("Wall Emerald");
    this.anim_emerald_fall = this.piece2tile[Logic.EMERALD] = this.piece2tile[Logic.EMERALD_FALLING] = this.load("Emerald");   
    this.anim_emerald_shine = this.load("Emerald Shine");
    this.anim_citrine_fall = this.piece2tile[Logic.CITRINE] = this.piece2tile[Logic.CITRINE_FALLING] = load("Citrine");
    this.anim_citrine_shine = this.load("Citrine Shine");
    this.anim_sapphire_fall = this.piece2tile[Logic.SAPPHIRE] = this.piece2tile[Logic.SAPPHIRE_FALLING] = this.load("Sapphire");
    this.anim_sapphire_shine = this.load("Sapphire Shine");
    this.anim_ruby_fall = this.piece2tile[Logic.RUBY] = this.piece2tile[Logic.RUBY_FALLING] = this.load(h, "Ruby");
    this.anim_ruby_shine = load("Ruby Shine");
        

        piece2tile[Logic.ROCK] = piece2tile[Logic.ROCK_FALLING&0xff] = loadImage(h, "Stone"); 
        loadImage(h, "Stone Right");
        anim_rock_right = createAnimationDescription(h.first,h.last);
        loadImage(h, "Stone Left");
        anim_rock_left = createAnimationDescription(h.first,h.last);
        piece2tile[Logic.ROCKEMERALD] = piece2tile[Logic.ROCKEMERALD_FALLING&0xff] = loadImage(h, "Stone Emerald");
        anim_rockemerald_right = createAnimationDescription(h.first,h.last);
        anim_rockemerald_left = createRevertedAnimation(anim_rockemerald_right);
        piece2tile[Logic.BAG] = piece2tile[Logic.BAG_FALLING&0xff] = loadImage(h, "Bag");
        anim_bag_right = createAnimationDescription(h.first,h.last);
        anim_bag_left = createAnimationDescription(h.last,h.first);
        piece2tile[Logic.BOMB] = loadImage(h, "Bomb"); 
        loadImage(h, "Bomb Push");
        anim_bomb_left = createAnimationDescription(h.first,h.last);
        anim_bomb_right = createAnimationDescription(h.first,h.last);
        piece2tile[Logic.BOMB_FALLING&0xff] = loadImage(h, "Bomb Falling");
        anim_bomb_fall = createAnimationDescription(h.first,h.last);
        piece2tile[Logic.DOOR&0xff] = piece2tile[Logic.DOOR_CLOSED&0xff] = loadImage(h, "Exit Closed");    
        piece2tile[Logic.DOOR_OPENED&0xff] = piece2tile[Logic.DOOR_CLOSING&0xff] = loadImage(h, "Exit");  
        anim_door_opening = createAnimationDescription(h.first,h.last); 
        anim_door_closing = createRevertedAnimation(anim_door_opening);
        piece2tile[Logic.SWAMP] = loadImage(h, "Swamp");
        piece2tile[Logic.SWAMP_UP & 0xff] = piece2tile[Logic.SWAMP];
        piece2tile[Logic.SWAMP_DOWN & 0xff] = piece2tile[Logic.SWAMP];
        piece2tile[Logic.SWAMP_LEFT & 0xff] = piece2tile[Logic.SWAMP];
        piece2tile[Logic.SWAMP_RIGHT & 0xff] = piece2tile[Logic.SWAMP];
        loadImage(h, "Swamp Move");
        anim_swamp = createAnimationDescription(h.first, h.last);
        loadImage(h, "Swamp Grow");
        anim_swamp_up = createAnimationDescription(h.first, h.last);
        anim_swamp_left = createRotatedAnimation(anim_swamp_up, 90);
        anim_swamp_right = createRotatedAnimation(anim_swamp_up, -90);      
        anim_swamp_down = createRotatedAnimation(anim_swamp_up, -180);
        loadImage(h, "Drop Left");
        anim_drop_left = createAnimationDescription(h.first, h.last);
        loadImage(h, "Drop Right");
        anim_drop_right = createAnimationDescription(h.first, h.last);
        loadImage(h, "Drop Down");
        anim_createdrop = createAnimationDescription(h.first, h.last);
        loadImage(h, "Drop Hit");
        anim_drophit = createAnimationDescription(h.first, h.last);     
        piece2tile[Logic.DROP] = loadImage(h, "Drop");  // loadImage(h, "drop");
        anim_drop = createAnimationDescription(h.first, h.last);
        loadImage(h, "Converter");
        piece2tile[Logic.CONVERTER] = createAnimationDescription(h.first,h.last);
        piece2tile[Logic.TIMEBOMB] = piece2tile[Logic.ACTIVEBOMB4&0xff] = piece2tile[Logic.ACTIVEBOMB2&0xff] = piece2tile[Logic.ACTIVEBOMB0&0xff] = loadImage(h, "Timebomb");
        piece2tile[Logic.ACTIVEBOMB5&0xff] = piece2tile[Logic.ACTIVEBOMB3&0xff] = piece2tile[Logic.ACTIVEBOMB1&0xff] = loadImage(h, "Tickbomb");
        piece2tile[Logic.TIMEBOMB10] = loadImage(h, "TNT");
        piece2tile[Logic.BOX] = loadImage(h, "Safe");
        piece2tile[Logic.CUSHION] = loadImage(h, "Pillow");
        anim_cushion = createAnimationDescription(h.first,h.last);
        piece2tile[Logic.ELEVATOR] = loadImage(h, "Elevator");
        anim_elevator = createAnimationDescription(h.last,h.first);
        piece2tile[Logic.ELEVATOR_TOLEFT] = loadImage(h, "Elevator Left");
        anim_elevatorleft = createAnimationDescription(h.last, h.first);
        piece2tile[Logic.ELEVATOR_TORIGHT] = loadImage(h, "Elevator Right");
        anim_elevatorright = createAnimationDescription(h.last, h.first);
        loadImage(h, "Elevator Left Throw");
        anim_elevatorleft_throw = createAnimationDescription(h.first,h.last);
        loadImage(h, "Elevator Right Throw");
        anim_elevatorright_throw = createAnimationDescription(h.first,h.last);
        piece2tile[Logic.GUN0] = loadImage(h, "Gun");
        piece2tile[Logic.GUN1] = piece2tile[Logic.GUN0];
        piece2tile[Logic.GUN2] = piece2tile[Logic.GUN0];
        piece2tile[Logic.GUN3] = piece2tile[Logic.GUN0];
        loadImage(h, "Gun Fire");
        anim_gunfire = createAnimationDescription(h.first,h.last);
        loadImage(h, "Acid");
        piece2tile[Logic.ACID] = createAnimationDescription(h.first,h.last); 
        acidtiles_noedge[0] = createAnimationDescription(h.first, (h.first+h.last)/2);
        acidtiles_noedge[1] = createAnimationDescription((h.first+h.last)/2, h.last);
        loadImage(h, "Acid Edge Left");
        acidtiles_leftedge[0] = joinAnimationDescriptions(acidtiles_noedge[0], createAnimationDescription(h.first,h.last));
        acidtiles_leftedge[1] = joinAnimationDescriptions(acidtiles_noedge[1], createAnimationDescription(h.first,h.last));
        loadImage(h, "Acid Edge Right");
        acidtiles_rightedge[0] = joinAnimationDescriptions(acidtiles_noedge[0], createAnimationDescription(h.first,h.last));
        acidtiles_rightedge[1] = joinAnimationDescriptions(acidtiles_noedge[1], createAnimationDescription(h.first,h.last));
        loadImage(h, "Acid Edge Both");
        acidtiles_bothedges[0] = joinAnimationDescriptions(acidtiles_noedge[0], createAnimationDescription(h.first,h.last));
        acidtiles_bothedges[1] = joinAnimationDescriptions(acidtiles_noedge[1], createAnimationDescription(h.first,h.last));
        piece2tile[Logic.KEYBLUE] = loadImage(h, "Key Blue");
        piece2tile[Logic.KEYRED] = loadImage(h, "Key Red");
        piece2tile[Logic.KEYGREEN] = loadImage(h, "Key Green");
        piece2tile[Logic.KEYYELLOW] = loadImage(h, "Key Yellow");
        piece2tile[Logic.DOORBLUE] = loadImage(h, "Door Blue");
        anim_door_blue = createAnimationDescription(h.first,h.last);
        piece2tile[Logic.DOORRED] = loadImage(h, "Door Red");
        anim_door_red = createAnimationDescription(h.first,h.last);
        piece2tile[Logic.DOORGREEN] = loadImage(h, "Door Green");
        anim_door_green = createAnimationDescription(h.first,h.last);
        piece2tile[Logic.DOORYELLOW] = loadImage(h, "Door Yellow");
        anim_door_yellow = createAnimationDescription(h.first,h.last);
        
        loadImage(h, "Door Onetime");
        piece2tile[Logic.ONETIMEDOOR] = createAnimationDescription(h.last);
        anim_door_onetime = createAnimationDescription(h.last,h.first);
        piece2tile[Logic.ONETIMEDOOR_CLOSED&0xff] = loadImage(h, "Door Onetime Closed");    
        
        loadImage(h, "Lorry");
        anim_lorry_left = createAnimationDescription(h.first,h.last);
        piece2tile[Logic.LORRYLEFT] = piece2tile[Logic.LORRYLEFT_FIXED&0xff] = anim_lorry_left;
        anim_lorry_down =  createRotatedAnimation(anim_lorry_left,90);
        piece2tile[Logic.LORRYDOWN] = piece2tile[Logic.LORRYDOWN_FIXED&0xff] = anim_lorry_down;
        anim_lorry_right = createRotatedAnimation(anim_lorry_left,180);
        piece2tile[Logic.LORRYRIGHT] = piece2tile[Logic.LORRYRIGHT_FIXED&0xff] = anim_lorry_right;
        anim_lorry_up = createRotatedAnimation(anim_lorry_left,270);         
        piece2tile[Logic.LORRYUP] = piece2tile[Logic.LORRYUP_FIXED&0xff] = anim_lorry_up;
        anim_lorry_right_up = createRotatingAnimation(anim_lorry_right, 0,90);
        anim_lorry_up_left = createRotatingAnimation(anim_lorry_right, 90,180);
        anim_lorry_left_down = createRotatingAnimation(anim_lorry_right, 180,270);
        anim_lorry_down_right = createRotatingAnimation(anim_lorry_right, 270,360);
        anim_lorry_right_down = createRotatingAnimation(anim_lorry_right, 0,-90);
        anim_lorry_down_left = createRotatingAnimation(anim_lorry_right, 270,180);
        anim_lorry_left_up = createRotatingAnimation(anim_lorry_right, 180, 90);
        anim_lorry_up_right = createRotatingAnimation(anim_lorry_right, 90, 0);
        
        loadImage(h, "Bug");
        anim_bug_right = createAnimationDescription(h.first,h.last);
        piece2tile[Logic.BUGRIGHT] = piece2tile[Logic.BUGRIGHT_FIXED&0xff] = anim_bug_right;
        anim_bug_up =  createRotatedAnimation(anim_bug_right,90);
        piece2tile[Logic.BUGUP] = piece2tile[Logic.BUGUP_FIXED&0xff] = anim_bug_up;
        anim_bug_left =  createRotatedAnimation(anim_bug_right,180);
        piece2tile[Logic.BUGLEFT] = piece2tile[Logic.BUGLEFT_FIXED&0xff] = anim_bug_left;
        anim_bug_down =  createRotatedAnimation(anim_bug_right,270);                
        piece2tile[Logic.BUGDOWN] = piece2tile[Logic.BUGDOWN_FIXED&0xff] = anim_bug_down;
        anim_bug_right_up = createRotatingAnimation(anim_bug_right, 0,90);
        anim_bug_up_left = createRotatingAnimation(anim_bug_right, 90,180);
        anim_bug_left_down = createRotatingAnimation(anim_bug_right, 180,270);
        anim_bug_down_right = createRotatingAnimation(anim_bug_right, 270,360);
        anim_bug_right_down = createRotatingAnimation(anim_bug_right, 0,-90);
        anim_bug_down_left = createRotatingAnimation(anim_bug_right, 270,180);
        anim_bug_left_up = createRotatingAnimation(anim_bug_right, 180, 90);
        anim_bug_up_right = createRotatingAnimation(anim_bug_right, 90, 0);
        
        piece2tile[Logic.YAMYAMLEFT] = loadImage(h, "YamYam Left");
        piece2tile[Logic.YAMYAMUP] = loadImage(h, "YamYam Up");
        piece2tile[Logic.YAMYAMRIGHT] = loadImage(h, "YamYam Right");
        piece2tile[Logic.YAMYAMDOWN] = loadImage(h, "YamYam Down");
        loadImage (h,"YamYam");
        anim_yamyam = createAnimationDescription(h.first,h.last);   
        piece2tile[Logic.ROBOT] = loadImage(h, "Robot");        

        piece2tile[Logic.SAND_FULL] = joinAnimationDescriptions(piece2tile[Logic.ROCK], piece2tile[Logic.SAND] );    
        piece2tile[Logic.SAND_FULLEMERALD] = joinAnimationDescriptions(piece2tile[Logic.ROCKEMERALD], piece2tile[Logic.SAND] );    
        
        loadImage(h, "Explosion");
        int num = (h.last-h.first)+1;   
        anim_explode0_air = createAnimationDescription(h.first, h.first+num/5-1);
        anim_explode1_air = createAnimationDescription(h.first+num/5, h.first+2*num/5-1);
        anim_explode2_air = createAnimationDescription(h.first+2*num/5, h.first+3*num/5-1);
        anim_explode3_air = createAnimationDescription(h.first+3*num/5, h.first+4*num/5-1);
        anim_explode4_air = createAnimationDescription(h.first+4*num/5, h.first+5*num/5-1);
        anim_explode3_emerald = joinAnimationDescriptions(piece2tile[Logic.EMERALD], anim_explode3_air);
        anim_explode4_emerald = joinAnimationDescriptions(piece2tile[Logic.EMERALD], anim_explode4_air);
        anim_explode3_sapphire = joinAnimationDescriptions(piece2tile[Logic.SAPPHIRE], anim_explode3_air);
        anim_explode4_sapphire = joinAnimationDescriptions(piece2tile[Logic.SAPPHIRE], anim_explode4_air);
        anim_explode3_ruby = joinAnimationDescriptions(piece2tile[Logic.RUBY], anim_explode3_air);
        anim_explode4_ruby = joinAnimationDescriptions(piece2tile[Logic.RUBY], anim_explode4_air);
        anim_explode3_bag = joinAnimationDescriptions(piece2tile[Logic.BAG], anim_explode3_air);
        anim_explode4_bag = joinAnimationDescriptions(piece2tile[Logic.BAG], anim_explode4_air);        
        piece2tile[Logic.BOMB_EXPLODE&0xff]      = anim_explode0_air;    
        piece2tile[Logic.BIGBOMB_EXPLODE&0xff]   = anim_explode0_air;    
        piece2tile[Logic.BUG_EXPLODE&0xff]       = anim_explode0_air;    
        piece2tile[Logic.LORRY_EXPLODE&0xff]     = anim_explode0_air;       
        piece2tile[Logic.TIMEBOMB_EXPLODE&0xff]  = anim_explode0_air;
        piece2tile[Logic.EXPLODE1_AIR&0xff]      = anim_explode0_air;
        piece2tile[Logic.EXPLODE2_AIR&0xff]      = anim_explode1_air;  
        piece2tile[Logic.EXPLODE3_AIR&0xff]      = anim_explode2_air;   
        piece2tile[Logic.EXPLODE4_AIR&0xff]      = anim_explode3_air;    
        piece2tile[Logic.EXPLODE1_EMERALD&0xff]  = anim_explode0_air;
        piece2tile[Logic.EXPLODE2_EMERALD&0xff]  = anim_explode1_air;
        piece2tile[Logic.EXPLODE3_EMERALD&0xff]  = anim_explode2_air;
        piece2tile[Logic.EXPLODE4_EMERALD&0xff]  = anim_explode3_emerald;  
        piece2tile[Logic.EXPLODE1_SAPPHIRE&0xff] = anim_explode0_air;    
        piece2tile[Logic.EXPLODE2_SAPPHIRE&0xff] = anim_explode1_air;   
        piece2tile[Logic.EXPLODE3_SAPPHIRE&0xff] = anim_explode2_air; 
        piece2tile[Logic.EXPLODE4_SAPPHIRE&0xff] = anim_explode3_sapphire;
        piece2tile[Logic.EXPLODE1_RUBY&0xff]     = anim_explode0_air;    
        piece2tile[Logic.EXPLODE2_RUBY&0xff]     = anim_explode1_air;   
        piece2tile[Logic.EXPLODE3_RUBY&0xff]     = anim_explode2_air; 
        piece2tile[Logic.EXPLODE4_RUBY&0xff]     = anim_explode3_ruby;
        piece2tile[Logic.EXPLODE1_BAG&0xff]      = anim_explode0_air; 
        piece2tile[Logic.EXPLODE2_BAG&0xff]      = anim_explode1_air;    
        piece2tile[Logic.EXPLODE3_BAG&0xff]      = anim_explode2_air;    
        piece2tile[Logic.EXPLODE4_BAG&0xff]      = anim_explode3_bag;                   
        loadImage(h, "Explosion Deep");
        num = (h.last-h.first)+1;   
        anim_explode0_tnt = createAnimationDescription(h.first, h.first+num/5-1);
        anim_explode1_tnt = createAnimationDescription(h.first+num/5, h.first+2*num/5-1);
        anim_explode2_tnt = createAnimationDescription(h.first+2*num/5, h.first+3*num/5-1);
        anim_explode3_tnt = createAnimationDescription(h.first+3*num/5, h.first+4*num/5-1);
        anim_explode4_tnt = createAnimationDescription(h.first+4*num/5, h.first+5*num/5-1);
        piece2tile[Logic.EXPLODE1_TNT&0xff]      = anim_explode0_tnt; 
        piece2tile[Logic.EXPLODE2_TNT&0xff]      = anim_explode1_tnt;    
        piece2tile[Logic.EXPLODE3_TNT&0xff]      = anim_explode2_tnt;    
        piece2tile[Logic.EXPLODE4_TNT&0xff]      = anim_explode3_tnt;                   



        loadImage(h,"Sapphire Break");
        anim_sapphire_break = createAnimationDescription(h.first,h.last);
        loadImage(h,"Citrine Break");
        anim_citrine_break = createAnimationDescription(h.first,h.last);    
        anim_sand = createAnimationDescription(piece2tile[Logic.SAND][0]);
        loadImage (h,"Bag Open");
        anim_bag_opening = createAnimationDescription(h.first,h.last);

        anim_sapphire_away = createShrinkAnimationDescription(piece2tile[Logic.SAPPHIRE][0]);
        anim_emerald_away = createShrinkAnimationDescription(piece2tile[Logic.EMERALD][0]); 
        anim_citrine_away = createShrinkAnimationDescription(piece2tile[Logic.CITRINE][0]);
        anim_ruby_away = createShrinkAnimationDescription(piece2tile[Logic.RUBY][0]);   
        anim_timebomb_away = createShrinkAnimationDescription(piece2tile[Logic.TIMEBOMB][0]);
        anim_timebomb_placement = createRotatingAnimation(createRevertedAnimation(createShrinkAnimationDescription(piece2tile[Logic.ACTIVEBOMB5][0])), 20,0);
        anim_timebomb10_away = createShrinkAnimationDescription(piece2tile[Logic.TIMEBOMB10][0]);
        anim_keyred_away = createShrinkAnimationDescription(piece2tile[Logic.KEYRED][0]);
        anim_keyblue_away = createShrinkAnimationDescription(piece2tile[Logic.KEYBLUE][0]);
        anim_keygreen_away = createShrinkAnimationDescription(piece2tile[Logic.KEYGREEN][0]);
        anim_keyyellow_away = createShrinkAnimationDescription(piece2tile[Logic.KEYYELLOW][0]);

        loadImage(h,"Laser");
        anim_laser_v = createAnimationDescription(h.first,h.last);
        anim_laser_h = createRotatedAnimation(anim_laser_v, 90);
        loadImage(h,"Laser Side");
        anim_laser_br = createAnimationDescription(h.first,h.last);     
        anim_laser_tr = createRotatedAnimation(anim_laser_br, 90);
        anim_laser_tl = createRotatedAnimation(anim_laser_br, 180);
        anim_laser_bl = createRotatedAnimation(anim_laser_br, 270);
        loadImage(h,"Laser Reflect");
        anim_laser_down = createAnimationDescription(h.first,h.last);       
        anim_laser_right = createRotatedAnimation(anim_laser_down, 90);     
        anim_laser_up = createRotatedAnimation(anim_laser_down, 180);       
        anim_laser_left = createRotatedAnimation(anim_laser_down, 270); 
};

Renderer.prototype.createDerivedAnimations = function ()
{
        // piece2tile[Logic.EARTH]
        for (int i=0; i<16; i++) 
        {   earthtiles[i] = createAnimationDescription(h.first+i);  
        }               

            // this.piece2tile[Logic.WALL]
        walltiles[0] = createAnimationDescription(h.first+5);  // nothing - wall - nothing      
        walltiles[1] = createAnimationDescription(h.first+6);  // wall    - wall - nothing
        walltiles[2] = createAnimationDescription(h.first+2);  // rounded - wall - nothing          
        walltiles[3] = createAnimationDescription(h.first+7);  // nothing - wall - wall         
        walltiles[4] = createAnimationDescription(h.first+8);  // wall    - wall - wall         
        walltiles[5] = createAnimationDescription(h.first+0);  // rounded - wall - wall     ??          
        walltiles[6] = createAnimationDescription(h.first+3);  // nothing - wall - rounded          
        walltiles[7] = createAnimationDescription(h.first+1);  // wall    - wall - rounded  ??          
        walltiles[8] = createAnimationDescription(h.first+4);  // rounded - wall - rounded          

        // this.piece2tile[Logic.ROUNDWALL]
        for (int i=0; i<4; i++) 
        {   roundwalltiles[i] = createAnimationDescription(h.first+i);
        }               

        
        int[] anim_removal = createAnimationDescription(h.first,h.last);         
        for (int i=0; i<16; i++) anim_earth_right[i] = joinAnimationDescriptions(earthtiles[i], anim_removal);      
        anim_earth_up = new int[16][];
        anim_removal = createRotatedAnimation(anim_removal, 90);
        for (int i=0; i<16; i++) anim_earth_up[i] = joinAnimationDescriptions(earthtiles[i], anim_removal);
        anim_earth_left = new int[16][];
        anim_removal = createRotatedAnimation(anim_removal, 90);
        for (int i=0; i<16; i++) anim_earth_left[i] = joinAnimationDescriptions(earthtiles[i], anim_removal);       
        anim_earth_down = new int[16][];
        anim_removal = createRotatedAnimation(anim_removal, 90);
        for (int i=0; i<16; i++) anim_earth_down[i] = joinAnimationDescriptions(earthtiles[i], anim_removal);       
        
};

Renderer.prototype.isLoaded = function()    
{   
    if (this.doneLoading) return true;
    if (TileRenderer.isLoaded.call(this)) 
    {   this.doneLoading = true;
        this.createDerivedAnimiations();
        return true;
    }   
    else 
    {   return false;
    }
};

Renderer.prototype.load = function (name) 
{
    var numbers = new Array(LevelRenderer.FRAMESPERSTEP);
    this.loadImage(name,numbers);
    return numbers;
};    


    

    
    // -------------- draw the whole scene as defined by the logic -----------
    public void draw(int displaywidth, int displayheight, int screentilesize, Logic logic, int frames_until_endposition, int offx0, int offy0, int offx1, int offy1)
    {           
//profiler_draw.start();    
        // start up the rendering               
        startDrawing(displaywidth, displayheight, screentilesize, offx0,offy0, offx1,offy1);

        // determine which part of the logic area needs to be painted
        int populatedwidth = logic.getPopulatedWidth();
        int populatedheight = logic.getPopulatedHeight();               

//profiler_draw.done(0);    

        // do first parse of dynamic info to determine which static tiles should be suppressed
        Arrays.fill(tmp_disable_static_tile,false);
        if (frames_until_endposition>0)
        {   int num = logic.getAnimationBufferSize();
            for (int idx=0; idx<num; idx++)
            {   int trn = logic.getAnimation(idx);
                int x = (trn>>22) & 0x03f;
                int y = (trn>>16) & 0x03f;
                switch (trn & Logic.TRN_MASK)
                {   case Logic.TRN_TRANSFORM:
                    {   tmp_disable_static_tile[x+y*Logic.MAPWIDTH] = true;
                        break;
                    }
                    case Logic.TRN_MOVEDOWN:
                    {   tmp_disable_static_tile[x+(y+1)*Logic.MAPWIDTH] = true;
                        break;
                    }
                    case Logic.TRN_MOVEUP:
                    {   tmp_disable_static_tile[x+(y-1)*Logic.MAPWIDTH] = true;
                        break;
                    }
                    case Logic.TRN_MOVELEFT:
                    {   tmp_disable_static_tile[x+y*Logic.MAPWIDTH-1] = true;
                        break;
                    }
                    case Logic.TRN_MOVERIGHT:
                    {   tmp_disable_static_tile[x+y*Logic.MAPWIDTH+1] = true;
                        break;
                    }
                    case Logic.TRN_MOVEDOWN2:
                    {   tmp_disable_static_tile[x+(y+1)*Logic.MAPWIDTH] = true;
                        tmp_disable_static_tile[x+(y+2)*Logic.MAPWIDTH] = true;
                        break;
                    }
                    case Logic.TRN_MOVEUP2:
                    {   tmp_disable_static_tile[x+(y-1)*Logic.MAPWIDTH] = true;
                        tmp_disable_static_tile[x+(y-2)*Logic.MAPWIDTH] = true;
                        break;
                    }
                    case Logic.TRN_MOVELEFT2:
                    {   tmp_disable_static_tile[x+y*Logic.MAPWIDTH-1] = true;
                        tmp_disable_static_tile[x+y*Logic.MAPWIDTH-2] = true;
                        break;
                    }
                    case Logic.TRN_MOVERIGHT2:
                    {   tmp_disable_static_tile[x+y*Logic.MAPWIDTH+1] = true;
                        tmp_disable_static_tile[x+y*Logic.MAPWIDTH+2] = true;
                        break;
                    }  
                    case Logic.TRN_HIGHLIGHT:
                    {
                        int p = trn & 0xff;
                        if ((logic.piece(x,y) & 0xff) == p)     // highlights disable static rest image of same piece
                        {
                            tmp_disable_static_tile[x+y*Logic.MAPWIDTH] = true;
                        }
                        break;
                    }       
                }               
            }                   
        }       
        
        // collect the non-suppressed static tiles 
        for (int y=0; y<populatedheight; y++)
        {   for (int x=0; x<populatedwidth; x++)
            {   if (!tmp_disable_static_tile[x+y*Logic.MAPWIDTH])
                {   int[] anim = determineTileAt(logic,x,y); 
                    if (anim!=null)
                    {   addRestingAnimationToBuffers(screentilesize,frames_until_endposition, anim, x,y);
                    }
                }
            }
        }       
        
        // do second parse of dynamic info to create animation tiles 
        if (frames_until_endposition>0)
        {   int num = logic.getAnimationBufferSize();
            for (int idx=0; idx<num; idx++)
            {   int trn = logic.getAnimation(idx);
                int x = (trn>>22) & 0x03f;
                int y = (trn>>16) & 0x03f;
                byte oldpiece = (byte)((trn>>8)&0xff);
                byte newpiece = (byte)(trn & 0xff);
                switch (trn & Logic.TRN_MASK)
                {   case Logic.TRN_TRANSFORM:
                    {   int[] anim = determineTransformAnimation(oldpiece, newpiece, x,y, logic);
                        if (anim!=null)
                        {   addRestingAnimationToBuffers(screentilesize,frames_until_endposition, anim, x,y);
                        }
                        break;
                    }   
                    case Logic.TRN_MOVEDOWN:
                    {   addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, 0,1, logic);
                        break;
                    }
                    case Logic.TRN_MOVEUP:
                    {   addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, 0,-1, logic);
                        break;
                    }
                    case Logic.TRN_MOVELEFT:
                    {   addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, -1,0, logic);
                        break;
                    }
                    case Logic.TRN_MOVERIGHT:
                    {   addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, 1,0, logic);
                        break;
                    }
                    case Logic.TRN_MOVEDOWN2:
                    {   addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, 0,2, logic);
                        break;
                    }
                    case Logic.TRN_MOVEUP2:
                    {   addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, 0,-2, logic);
                        break;
                    }
                    case Logic.TRN_MOVELEFT2:
                    {   addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, -2,0, logic);
                        break;
                    }
                    case Logic.TRN_MOVERIGHT2:
                    {   addMoveAnimationToBuffers(screentilesize,frames_until_endposition, oldpiece,newpiece, x,y, 2,0, logic);
                        break;
                    }                   
                    case Logic.TRN_HIGHLIGHT:
                    {   int[] anim = determineHighlightAnimation(newpiece, x,y,logic);
                        if (anim!=null)
                        {   addRestingAnimationToBuffers(screentilesize,frames_until_endposition, anim, x,y);
                        }           
                        break;
                    }                   
                }               
            }           
        }
//profiler_draw.done(1);    
        
//profiler_draw.done(2);    
                        
        // send accumulated data to the screen
        flush();        
//profiler_draw.done(4);
//profiler_draw.stop(); 
    }   
            
    private void addMoveAnimationToBuffers(int screentilesize, int frames_until_endposition, byte oldpiece, byte newpiece, int x1, int y1, int dx, int dy, Logic logic)
    {
        int[] anim = determineMoveAnimation(oldpiece,newpiece,x1,y1,dx,dy,logic);
        if (anim!=null)
        {   // determine correct position
            int x2 = x1 + dx;
            int y2 = y1 + dy;
            int d = screentilesize*(FRAMESPERSTEP-frames_until_endposition)/FRAMESPERSTEP;
            int px = screentilesize*x1+d*(x2-x1);
            int py = screentilesize*y1+d*(y2-y1);
                
            // when wanting to use an animation, pick the correct tile
            if (anim.length<=FRAMESPERSTEP)
            {   addTileToBuffer(px,py,anim[frames_until_endposition]);
            }
            // draw two images superimposed over each other
            else
            {   addTileToBuffer(px,py,anim[frames_until_endposition]);
                addTileToBuffer(px,py,anim[FRAMESPERSTEP+frames_until_endposition]);
            }
        }   
    }
    
    private void addRestingAnimationToBuffers(int screentilesize, int frames_until_endposition, int[] anim, int x1, int y1)
    {
    
        // when wanting to use an animation, pick the correct tile
        if (anim.length<=FRAMESPERSTEP)
        {   addTileToBuffer(screentilesize*x1,screentilesize*y1,anim[frames_until_endposition]);
        }
        // draw two images superimposed over each other
        else
        {   addTileToBuffer(screentilesize*x1,screentilesize*y1,anim[frames_until_endposition]);
            addTileToBuffer(screentilesize*x1,screentilesize*y1,anim[FRAMESPERSTEP+frames_until_endposition]);
        }
        
    }
    
    
        
    private int[] determineMoveAnimation(byte oldpiece, byte newpiece, int x, int y, int dx, int dy, Logic logic)
    {
        switch (oldpiece)
        {   
            case Logic.ROCK:
            case Logic.ROCK_FALLING:
                if (dx<0)
                {   return anim_rock_left;                  
                }
                else if (dx>0)
                {   return anim_rock_right;                 
                }
                break;
            case Logic.ROCKEMERALD:
            case Logic.ROCKEMERALD_FALLING:
                if (dx<0)
                {   return anim_rockemerald_left;                   
                }
                else if (dx>0)
                {   return anim_rockemerald_right;                  
                }               
                break;
            case Logic.BAG:
            case Logic.BAG_FALLING:
            case Logic.BAG_OPENING:
                if (dx<0)
                {   return anim_bag_left;                   
                }
                else if (dx>0)
                {   return anim_bag_right;                  
                }                           
                break;
            case Logic.EMERALD:
            case Logic.EMERALD_FALLING:
                if (dy>=0)
                {   return anim_emerald_fall;
                }
                break;              
            case Logic.SAPPHIRE:
            case Logic.SAPPHIRE_FALLING:
                if (dy>=0)
                {   return anim_sapphire_fall;
                }
                break;          
            case Logic.CITRINE:
            case Logic.CITRINE_FALLING:
                if (dy>=0) 
                {   return anim_citrine_fall;                               
                }
                break;
            case Logic.RUBY:
            case Logic.RUBY_FALLING:
                if (dy>=0) 
                {   return anim_ruby_fall;
                }
                break;              
            case Logic.BOMB:
            case Logic.BOMB_FALLING:
                if (dx<0)
                {   return anim_bomb_left;              
                }
                else if (dx>0)
                {   return anim_bomb_right;             
                }
                else if (dy>=0)
                {   return anim_bomb_fall;
                }       
                break;      
            case Logic.DROP:
                return anim_drop;   
                
            case Logic.ELEVATOR:
                if (dy<0)
                {   return anim_elevator;
                }
                break;
            case Logic.ELEVATOR_TOLEFT:
                if (dy<0)
                {   return anim_elevatorleft;
                }
                break;
            case Logic.ELEVATOR_TORIGHT:
                if (dy<0)
                {   return anim_elevatorright;
                }
                break;
                                            
        }

        switch (newpiece)
        {   
            case Logic.MAN1_LEFT:  
                return anim_man1_left;
            case Logic.MAN1_RIGHT:  
                return anim_man1_right;     
            case Logic.MAN1_UP:  
                return anim_man1_up;        
            case Logic.MAN1_DOWN:  
                return anim_man1_down;      
            case Logic.MAN1_DIGLEFT:  
                return anim_man1_digleft;       
            case Logic.MAN1_DIGRIGHT:  
                return anim_man1_digright;      
            case Logic.MAN1_DIGUP:  
                return anim_man1_digup;     
            case Logic.MAN1_DIGDOWN:  
                return anim_man1_digdown;       
            case Logic.MAN1_PUSHLEFT:  
                return anim_man1_pushleft;      
            case Logic.MAN1_PUSHRIGHT:  
                return anim_man1_pushright;     
            case Logic.MAN1_PUSHUP:  
                return anim_man1_pushup;        
            case Logic.MAN1_PUSHDOWN:  
                return anim_man1_pushdown;      
            case Logic.MAN2_LEFT:  
                return anim_man2_left;
            case Logic.MAN2_RIGHT: 
                return anim_man2_right;     
            case Logic.MAN2_UP:  
                return anim_man2_up;        
            case Logic.MAN2_DOWN:  
                return anim_man2_down;      
            case Logic.MAN2_DIGLEFT:  
                return anim_man2_digleft;       
            case Logic.MAN2_DIGRIGHT:  
                return anim_man2_digright;      
            case Logic.MAN2_DIGUP:  
                return anim_man2_digup;     
            case Logic.MAN2_DIGDOWN:  
                return anim_man2_digdown;       
            case Logic.MAN2_PUSHLEFT:  
                return anim_man2_pushleft;      
            case Logic.MAN2_PUSHRIGHT:  
                return anim_man2_pushright;     
            case Logic.MAN2_PUSHUP:  
                return anim_man2_pushup;        
            case Logic.MAN2_PUSHDOWN:  
                return anim_man2_pushdown;      
                
            case Logic.LORRYRIGHT:
                return anim_lorry_right;
            case Logic.LORRYLEFT:
                return anim_lorry_left;
            case Logic.LORRYUP:
                return anim_lorry_up;
            case Logic.LORRYDOWN:
                return anim_lorry_down;
            case Logic.BUGRIGHT:
                return anim_bug_right;
            case Logic.BUGLEFT:
                return anim_bug_left;
            case Logic.BUGUP:
                return anim_bug_up;
            case Logic.BUGDOWN:
                return anim_bug_down;
        }
        
        
        // when no animation is explicitly defined, use the still-stand animation of the new piece (covers many "falling" and "pushing" actions)
        return piece2tile[newpiece & 0xff];
    }
    
            
    private int[] determineTransformAnimation(byte oldpiece, byte newpiece, int originatingx, int originatingy, Logic logic)
    {
        switch (oldpiece)
        {   case Logic.ROCK:
            case Logic.ROCK_FALLING:    
                if (newpiece==Logic.SAND_FULL)
                {   return anim_sand;               
                }
                break;
            case Logic.ROCKEMERALD:
            case Logic.ROCKEMERALD_FALLING:     
                if (newpiece==Logic.SAND_FULLEMERALD)
                {   return anim_sand;               
                }
                break;
            case Logic.BAG:
            case Logic.BAG_FALLING:
            case Logic.BAG_OPENING:             
                if (newpiece==Logic.EMERALD)
                {   return anim_bag_opening;                
                }
                break;
            case Logic.EMERALD:
                if (newpiece==Logic.AIR) 
                {   return anim_emerald_away;       
                }
                break;
            case Logic.SAPPHIRE:
                if (newpiece==Logic.AIR) 
                {   return anim_sapphire_away;      
                }
                break;              
            case Logic.SAPPHIRE_BREAKING:
                if (newpiece==Logic.AIR)
                {   return anim_sapphire_break;
                }
                break;              
            case Logic.CITRINE:
                if (newpiece==Logic.AIR) 
                {   return anim_citrine_away;       
                }
                break;              
            case Logic.CITRINE_BREAKING:
                if (newpiece==Logic.AIR)
                {   return anim_citrine_break;
                }
                break;              
            case Logic.RUBY:
                if (newpiece==Logic.AIR) 
                {   return anim_ruby_away;      
                }
                break;              
            case Logic.TIMEBOMB:
                if (newpiece==Logic.AIR) 
                {   return anim_timebomb_away;      
                }
                break;              
            case Logic.TIMEBOMB10:
                if (newpiece==Logic.AIR) 
                {   return anim_timebomb10_away;        
                }
                break;              
            case Logic.KEYRED:
                if (newpiece==Logic.AIR) 
                {   return anim_keyred_away;        
                }
                break;              
            case Logic.KEYBLUE:
                if (newpiece==Logic.AIR) 
                {   return anim_keyblue_away;       
                }
                break;              
            case Logic.KEYGREEN:
                if (newpiece==Logic.AIR) 
                {   return anim_keygreen_away;      
                }
                break;              
            case Logic.KEYYELLOW:
                if (newpiece==Logic.AIR) 
                {   return anim_keyyellow_away;     
                }
                break;              

            case Logic.EARTH_UP:    
                return anim_earth_up[earthJaggedConfiguration(logic,originatingx,originatingy)];
            case Logic.EARTH_DOWN:  
                return anim_earth_down[earthJaggedConfiguration(logic,originatingx,originatingy)];
            case Logic.EARTH_LEFT:  
                return anim_earth_left[earthJaggedConfiguration(logic,originatingx,originatingy)];
            case Logic.EARTH_RIGHT: 
                return anim_earth_right[earthJaggedConfiguration(logic,originatingx,originatingy)];

            case Logic.LORRYLEFT:
            case Logic.LORRYLEFT_FIXED:
                if (newpiece==Logic.LORRYUP || newpiece==Logic.LORRYUP_FIXED)
                {   return anim_lorry_left_up;
                }
                else if (newpiece==Logic.LORRYDOWN || newpiece==Logic.LORRYDOWN_FIXED)
                {   return anim_lorry_left_down;
                }
                break;
            case Logic.LORRYRIGHT:
            case Logic.LORRYRIGHT_FIXED:
                if (newpiece==Logic.LORRYDOWN || newpiece==Logic.LORRYDOWN_FIXED)
                {   return anim_lorry_right_down;
                }
                else if (newpiece==Logic.LORRYUP || newpiece==Logic.LORRYUP_FIXED)
                {   return anim_lorry_right_up;
                }
                break;
            case Logic.LORRYDOWN:
            case Logic.LORRYDOWN_FIXED:
                if (newpiece==Logic.LORRYLEFT || newpiece==Logic.LORRYLEFT_FIXED)
                {   return anim_lorry_down_left;
                }
                else if (newpiece==Logic.LORRYRIGHT || newpiece==Logic.LORRYRIGHT_FIXED)
                {   return anim_lorry_down_right;
                }
                break;
            case Logic.LORRYUP:
            case Logic.LORRYUP_FIXED:
                if (newpiece==Logic.LORRYLEFT || newpiece==Logic.LORRYLEFT_FIXED)
                {   return anim_lorry_up_left;
                }
                else if (newpiece==Logic.LORRYRIGHT || newpiece==Logic.LORRYRIGHT_FIXED)
                {   return anim_lorry_up_right;
                }
                break;

            case Logic.BUGLEFT:
            case Logic.BUGLEFT_FIXED:
                if (newpiece==Logic.BUGUP || newpiece==Logic.BUGUP_FIXED)
                {   return anim_bug_left_up;
                }
                else if (newpiece==Logic.BUGDOWN || newpiece==Logic.BUGDOWN_FIXED)
                {   return anim_bug_left_down;
                }
                break;
            case Logic.BUGRIGHT:
            case Logic.BUGRIGHT_FIXED:
                if (newpiece==Logic.BUGDOWN || newpiece==Logic.BUGDOWN_FIXED)
                {   return anim_bug_right_down;
                }
                else if (newpiece==Logic.BUGUP || newpiece==Logic.BUGUP_FIXED)
                {   return anim_bug_right_up;
                }
                break;
            case Logic.BUGDOWN:
            case Logic.BUGDOWN_FIXED:
                if (newpiece==Logic.BUGLEFT || newpiece==Logic.BUGLEFT_FIXED)
                {   return anim_bug_down_left;
                }
                else if (newpiece==Logic.BUGRIGHT || newpiece==Logic.BUGRIGHT_FIXED)
                {   return anim_bug_down_right;
                }
                break;
            case Logic.BUGUP:
            case Logic.BUGUP_FIXED:
                if (newpiece==Logic.BUGLEFT || newpiece==Logic.BUGLEFT_FIXED)
                {   return anim_bug_up_left;
                }
                else if (newpiece==Logic.BUGRIGHT || newpiece==Logic.BUGRIGHT_FIXED)
                {   return anim_bug_up_right;
                }
                break;


            case Logic.EXPLODE1_AIR:  
                return anim_explode1_air;
            case Logic.EXPLODE2_AIR:  
                return anim_explode2_air;
            case Logic.EXPLODE3_AIR:  
                return anim_explode3_air;
            case Logic.EXPLODE4_AIR:  
                return anim_explode4_air;
                
            case Logic.EXPLODE1_EMERALD:  
                return anim_explode1_air;
            case Logic.EXPLODE2_EMERALD:  
                return anim_explode2_air;
            case Logic.EXPLODE3_EMERALD:  
                return anim_explode3_emerald;
            case Logic.EXPLODE4_EMERALD:  
                return anim_explode4_emerald;

            case Logic.EXPLODE1_SAPPHIRE:  
                return anim_explode1_air;
            case Logic.EXPLODE2_SAPPHIRE:  
                return anim_explode2_air;
            case Logic.EXPLODE3_SAPPHIRE:  
                return anim_explode3_sapphire;
            case Logic.EXPLODE4_SAPPHIRE:  
                return anim_explode4_sapphire;

            case Logic.EXPLODE1_RUBY:  
                return anim_explode1_air;
            case Logic.EXPLODE2_RUBY:  
                return anim_explode2_air;
            case Logic.EXPLODE3_RUBY:  
                return anim_explode3_ruby;
            case Logic.EXPLODE4_RUBY:  
                return anim_explode4_ruby;

            case Logic.EXPLODE1_BAG:  
                return anim_explode1_air;
            case Logic.EXPLODE2_BAG:  
                return anim_explode2_air;
            case Logic.EXPLODE3_BAG:  
                return anim_explode3_bag;
            case Logic.EXPLODE4_BAG:  
                return anim_explode4_bag;

            case Logic.EXPLODE1_TNT:  
                return anim_explode1_tnt;
            case Logic.EXPLODE2_TNT:  
                return anim_explode2_tnt;
            case Logic.EXPLODE3_TNT:  
                return anim_explode3_tnt;
            case Logic.EXPLODE4_TNT:  
                return anim_explode4_tnt;
        }
                
        switch (newpiece)
        {
            case Logic.ACTIVEBOMB5:
                if (oldpiece==Logic.AIR)
                {   return anim_timebomb_placement; 
                }
                break;
            case Logic.DROP:
                if (oldpiece==Logic.AIR)
                {   return anim_createdrop;
                }
                else if (oldpiece==Logic.SWAMP_LEFT)
                {   return anim_drop_left;
                }
                else if (oldpiece==Logic.SWAMP_RIGHT)
                {   return anim_drop_right;
                }
                break;
            case Logic.SWAMP_UP:
                return  anim_swamp_up;
            case Logic.SWAMP_DOWN:
                return (oldpiece==Logic.EARTH) ? anim_swamp_down : null;
            case Logic.SWAMP_LEFT:
                return (oldpiece==Logic.EARTH) ? anim_swamp_left : null;
            case Logic.SWAMP_RIGHT:
                return (oldpiece==Logic.EARTH) ? anim_swamp_right : null;
            case Logic.SWAMP:
                if (oldpiece==Logic.DROP)
                {   return anim_drophit;                
                }
                break;
            case Logic.DOOR_OPENED:             
                if (oldpiece==Logic.DOOR)
                {   return anim_door_opening;
                }
                else
                {   return null;
                }
            case Logic.DOOR_CLOSING:
                return null;                
            case Logic.DOOR_CLOSED:
                return anim_door_closing;   

            case Logic.ONETIMEDOOR_CLOSED:
                return anim_door_onetime;

            case Logic.MAN1_DIGLEFT:  
                return anim_man1_digleft;       
            case Logic.MAN1_DIGRIGHT:  
                return anim_man1_digright;      
            case Logic.MAN1_DIGUP:  
                return anim_man1_digup;     
            case Logic.MAN1_DIGDOWN:  
                return anim_man1_digdown;       
            case Logic.MAN1_PUSHLEFT:  
                return anim_man1_pushleft;      
            case Logic.MAN1_PUSHRIGHT:  
                return anim_man1_pushright;     
            case Logic.MAN1_PUSHUP:  
                return anim_man1_pushup;        
            case Logic.MAN1_PUSHDOWN:  
                return anim_man1_pushdown;      
            case Logic.MAN2_DIGLEFT:  
                return anim_man2_digleft;       
            case Logic.MAN2_DIGRIGHT:  
                return anim_man2_digright;      
            case Logic.MAN2_DIGUP:  
                return anim_man2_digup;     
            case Logic.MAN2_DIGDOWN:  
                return anim_man2_digdown;       
            case Logic.MAN2_PUSHLEFT:  
                return anim_man2_pushleft;      
            case Logic.MAN2_PUSHRIGHT:  
                return anim_man2_pushright;     
            case Logic.MAN2_PUSHUP:  
                return anim_man2_pushup;        
            case Logic.MAN2_PUSHDOWN:  
                return anim_man2_pushdown;
                
            case Logic.CUSHION:
                if (oldpiece==Logic.CUSHION_BUMPING)
                {   return null;
                }
                break;
            case Logic.CUSHION_BUMPING:
                if (oldpiece==Logic.CUSHION)
                {   return anim_cushion;
                }
                break;
                
            case Logic.EXPLODE1_AIR:
            case Logic.EXPLODE1_EMERALD:
            case Logic.EXPLODE1_SAPPHIRE:
            case Logic.EXPLODE1_RUBY:
            case Logic.EXPLODE1_BAG:
                return anim_explode0_air;
            case Logic.EXPLODE1_TNT:
                return anim_explode0_tnt;
            
        }
    
        // when no animation is explicitly defined, use the still-stand animation of the new piece (covers many "falling" and "pushing" actions)
        return piece2tile[newpiece & 0xff]; 
    }


    private int[] determineHighlightAnimation(byte highlightpiece, int originatingx, int originatingy, Logic logic)
    {
        switch (highlightpiece)
        {   case Logic.EARTH:
                return earthtiles[earthJaggedConfiguration(logic, originatingx, originatingy)];
        
            case Logic.EMERALD:
                return anim_emerald_shine;
            case Logic.SAPPHIRE:
                return anim_sapphire_shine;
            case Logic.RUBY:
                return anim_ruby_shine;
            case Logic.CITRINE:
                return anim_citrine_shine;
            case Logic.MAN1:
                return anim_man1_blink;
            case Logic.MAN2:
                return anim_man2_blink;
        
            case Logic.LASER_V:
                return anim_laser_v;
            case Logic.LASER_H:
                return anim_laser_h;
            case Logic.LASER_BL:
                return anim_laser_bl;
            case Logic.LASER_BR:
                return anim_laser_br;
            case Logic.LASER_TL:
                return anim_laser_tl;
            case Logic.LASER_TR:
                return anim_laser_tr;
            case Logic.LASER_L:
                return anim_laser_left;     
            case Logic.LASER_R:
                return anim_laser_right;        
            case Logic.LASER_U:
                return anim_laser_up;       
            case Logic.LASER_D:
                return anim_laser_down;     
            case Logic.DOORBLUE:
                return anim_door_blue;
            case Logic.DOORGREEN:
                return anim_door_green;
            case Logic.DOORYELLOW:
                return anim_door_yellow;
            case Logic.DOORRED:
                return anim_door_red;   
            case Logic.CUSHION:
                return anim_cushion;                    
            case Logic.SWAMP:
                return anim_swamp;
            case Logic.GUN0:
            case Logic.GUN1:
            case Logic.GUN2:
            case Logic.GUN3:
                return anim_gunfire;
                
            case Logic.YAMYAMLEFT:          
            case Logic.YAMYAMRIGHT:         
            case Logic.YAMYAMUP:            
            case Logic.YAMYAMDOWN:          
                return anim_yamyam;

            case Logic.CUSHION_BUMPING:
                return anim_cushion;                
                
            case Logic.CONVERTER:
                return piece2tile[Logic.CONVERTER];
                
            case Logic.DOOR_OPENED:
                return piece2tile[Logic.DOOR_OPENED&0xff];
                
            case Logic.ELEVATOR_TOLEFT:
                return anim_elevatorleft_throw;
            case Logic.ELEVATOR_TORIGHT:
                return anim_elevatorright_throw;
        }
        
        return null;        // no default for highlight 
    }
    
    private int[] determineTileAt(Logic logic, int x, int y)
    {   
        // various appearances of the earth piece
        int p = logic.piece(x,y) & 0xff;
        switch (p)
        {   case Logic.EARTH:
            {   return earthtiles[earthJaggedConfiguration(logic,x,y)];         
            }
            case Logic.WALL:
            {   int c=0;
                byte p2 = logic.piece(x-1,y);
                if (p2==Logic.WALL)
                {   c++;
                }
                else if (p2==Logic.ROUNDWALL)
                {   c+=2;
                }
                p2 = logic.piece(x+1,y);
                if (p2==Logic.WALL)
                {   c+=3;
                }
                else if (p2==Logic.ROUNDWALL)
                {
                    c+=6;
                }
                return walltiles[c];
            }
            case Logic.ROUNDWALL:
            {   int c=0;
                int pl = logic.piece(x-1,y);
                int pr = logic.piece(x+1,y);
                if (pl==Logic.WALL || pl==Logic.ROUNDWALL)
                {   c++;
                }
                if (pr==Logic.WALL || pr==Logic.ROUNDWALL)
                {   c+=2;
                }
                return roundwalltiles[c];
            }
            case Logic.ACID:
            {
                int n = logic.getTurnsDone()&1;
                int pl = logic.piece(x-1,y);
                int pr = logic.piece(x+1,y);
                if (pl==Logic.ACID)
                {   if (pr==Logic.ACID)
                    {   return acidtiles_noedge[n];
                    }
                    else
                    {   return acidtiles_rightedge[n];
                    }
                }
                else
                {   if (pr==Logic.ACID)
                    {   return acidtiles_leftedge[n];
                    }
                    else
                    {   return acidtiles_bothedges[n];
                    }               
                }
            }
        }
        
        // default handling of resting pieces
        return piece2tile[p];       
    }
    
    static int earthJaggedConfiguration(Logic logic, int x, int y)
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
    }
    
    static boolean makesEarthEdgeJagged(int piece)
    {
        switch (piece)
        {   case Logic.EARTH: 
            case Logic.WALL:  
            case Logic.STONEWALL: 
            case Logic.GLASSWALL: 
            case Logic.WALLEMERALD:
            case Logic.SWAMP_UP:
            case Logic.SWAMP_DOWN:
            case Logic.SWAMP_LEFT:
            case Logic.SWAMP_RIGHT:         
            case Logic.MAN1_DIGLEFT:
            case Logic.MAN2_DIGLEFT:
            case Logic.MAN1_DIGRIGHT:
            case Logic.MAN2_DIGRIGHT:
            case Logic.MAN1_DIGUP:
            case Logic.MAN2_DIGUP:
            case Logic.MAN1_DIGDOWN:
            case Logic.MAN2_DIGDOWN:    return false;           
            default:            return true;
        }
    }


    class LoadingState
    {
        final Context context;
        final Bitmap bitmap;
        final int[] pixels;
        final ByteBuffer bytebuffer;        
    
        int first;
        int last;
        int readcursor;
        
        LoadingState(Context context)
        {   
            this.context = context;
            pixels = new int[TILEWIDTH*TILEHEIGHT];
            bitmap = Bitmap.createBitmap(TILEWIDTH+2, TILEHEIGHT+2, Bitmap.Config.ARGB_8888);
            bytebuffer = ByteBuffer.allocate(4*(TILEWIDTH+2)*(TILEHEIGHT*2));

            first = 0;
            last = 0;
            readcursor = 0;
    
        }
    }
    
    
    private int[] createAnimationDescription(int firsttile, int finaltile)
    {
        int numtiles = (finaltile-firsttile)+1;
        int[] a = new int[FRAMESPERSTEP];
        for (int i=0; i<a.length; i++)
        {
            a[i] = firsttile + ((FRAMESPERSTEP-1-i)*numtiles) / FRAMESPERSTEP;
        }
        return a;
    }

    private int[] createAnimationDescription(int tile)
    {
        int[] a = new int[FRAMESPERSTEP];
        for (int i=0; i<a.length; i++)
        {   a[i] = tile;
        }
        return a;
    }
    
    private int[] createShrinkAnimationDescription(int tile)
    {
        int[] a = new int[FRAMESPERSTEP];
        for (int i=0; i<a.length; i++)
        {   a[i] = tile + (((60*(FRAMESPERSTEP-i))/FRAMESPERSTEP) << 16);
        }
        return a;
    }

    private int[] joinAnimationDescriptions(int[] x, int[] y)
    {
        int[] a = new int[x.length+y.length];
        System.arraycopy(x,0,a,0, x.length);
        System.arraycopy(y,0,a,x.length, y.length);
        return a;
    }
    
    
    private int[] createRevertedAnimation(int[] a)
    {
        int[] b = new int[a.length];
        for (int j=0; j<a.length; j+=FRAMESPERSTEP)     
        {   for (int i=0; i<FRAMESPERSTEP; i++)
            {   int i2 = (i==0) ? 0 : FRAMESPERSTEP-i;  
                b[j+i] = a[j+i2];       
            }
        }
        return b;   
    }
        
    private int[] createRotatedAnimation(int[] a, int degree)
    {
        int[] b = new int[a.length];
        for (int i=0; i<a.length; i++)
        {   int t = a[i] & 0xffff;
            int s = (a[i]>>16)%60;
            int r = (a[i]>>16)/60;
            r = (r + degree + 3600) % 360;
            b[i] = t | ((s+r*60)<<16);      
        }
        return b;   
    }
    
    private int[] createRotatingAnimation(int[] a, int start, int end)
    {
        int[] b = new int[a.length];
        for (int i=0; i<a.length; i++)
        {   int t = a[i] & 0xffff;
            int s = ((a[i]>>16)&0xffff) % 60;
            int r = ((a[i]>>16)&0xffff) / 60;
            
            int frames_until_endposition = i%FRAMESPERSTEP;
            int degree = end - (frames_until_endposition*(end-start))/FRAMESPERSTEP;
            r = (r + degree + 3600) % 360;
            b[i] = t | ((s+r*60)<<16);      
        }
        return b;   
    }
    
    
    
    // --------------------------------- tile rendering -----------------

    public void addSimplePieceToBuffer(int x, int y, byte piece)
    {       
        int[] anim = piece2tile[piece&0xff];
        if (anim!=null)
        {   
            addTileToBuffer(x,y,anim[0]);
            if (anim.length > FRAMESPERSTEP)
            {   addTileToBuffer(x,y, anim[FRAMESPERSTEP]);
            }
        }
    }
    

