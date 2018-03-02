"use strict";
var GameScreen = function()
{   Screen.call(this);

    this.level = null;
    this.logic = null;
    this.walk = null;
    this.canFindNextLevel = false;
    this.startFromEditor = false;
    
    this.step = 0;
    this.frames_left = 0;
    this.playmode = 0;
    this.playbackspeed = 0;
    this.slowmotion_counter = 0;
    this.singlestep = false;
    this.time_at_record_start = 0;
    this.diduse_undo = false;
    this.diduse_singlestep = false;

    this.screentilesize = 0;
    this.screenscrollx0 = 0;
    this.screenscrolly0 = 0;
    this.screenscrollx1 = 0;
    this.screenscrolly1 = 0;
    
    this.statusbarx1 = 0;
    this.statusbary1 = 0;

    this.gamePadMUX = null;
    this.keyboardTranslator = null;
    this.inputGrid = null;
    this.menuButton = null;
    
    this.inputfocushighlightplayer = 0;
    this.inputfocushighlightx = 0;
    this.inputfocushighlighty = 0;
    this.inputmodeswitchtime = 0;
    this.screenshaketime = 0;
}
GameScreen.prototype = Object.create(Screen.prototype);
    
GameScreen.PLAYMODE_RECORD = 0;
GameScreen.PLAYMODE_DEMO   = 1;
GameScreen.PLAYMODE_UNDO   = 2;
GameScreen.PLAYMODE_REPLAY = 3;


GameScreen.prototype.$ = function (game, le, unfinishedwalk, canFindNextLevel, startFromEditor)
{   Screen.prototype.$.call(this,game);        

    this.level = le;
    this.canFindNextLevel = canFindNextLevel;
    this.startFromEditor = startFromEditor;
    this.logic = null;
    this.frames_left=0;
    this.playmode = GameScreen.PLAYMODE_RECORD;
        
    // re-start existing walk
    if (unfinishedwalk!=null)
    {   this.walk = unfinishedwalk;
        this.step = walk.getTurns();
    }
    // build new walk
    else 
    {   this.walk = new Walk().$randomseed(Math.floor(Math.random()*1000000));
        this.step = 0;
    }
    this.logic = new Logic().$();
    this.logic.attach(this.level,this.walk);
    this.logic.gototurn(this.step);
                
    this.gamePadMUX = [ new GamePadInputBuffer().$(), new GamePadInputBuffer().$() ];
    this.keyboardTranslator = new KeyboardToGamepadTranslator().$(this.gamePadMUX[0], this.gamePadMUX[1]);
    this.inputGrid = [ new TouchInputGrid().$(game, 0x998888ff), new TouchInputGrid().$(game, 0xaa77ff55) ];        
    
    this.layout();
    
    return this;
}

GameScreen.prototype.layout = function()
{
    var statusbarheight = 50;
    var space = 5;
        
    // (re)create menu button
    var that = this;
    this.menuButton = new PauseButton(this.game, 
        this.game.screenwidth-this.statusbarheight-space, 
        this.game.screenheight-this.statusbarheight-space, 
        this.statusbarheight,this.statusbarheight, 
            function(){ that.createMenuScreen(true); } 
    );
        
    // calculate the current scrolling position
    this.adjustScrolling(true);      
}

GameScreen.prototype.afterScreenCreation = function()
{
    if (!this.startFromEditor)
    {   this.createMenuScreen(this.step!=0);
    }       
    if (this.game.getMusicActive()) 
    {   this.game.startCategoryMusic(this.level.getCategory());
    }        
}
        
GameScreen.prototype.discard = function()
{
    this.game.stopMusic();
}


GameScreen.prototype.tick = function()
{
    var frames = 1; // this.timeCalc.calculateLogicFrames();

    switch (this.playmode)
    {   case GameScreen.PLAYMODE_RECORD:
            for (var i=0; i<frames; i++)
            {   this.gameRecording();
            }
            this.adjustScrolling(false);

            if (this.logic.isOverForSomeTime()) 
            {   this.createMenuScreen(false);
            }
            break;
            
        case GameScreen.PLAYMODE_DEMO:
        case GameScreen.PLAYMODE_REPLAY:
            for (var i=0; i<frames; i++)
            {   this.gamePlayback();
            }
            this.adjustScrolling(true);              
            break;           
            
        case GameScreen.PLAYMODE_UNDO:
            for (var i=0; i<frames; i++)
            {   this.gameUndo();
            }
            this.adjustScrolling(true);
            break;
    }
    
    this.setDirty();
};

GameScreen.prototype.draw = function()
{           
    var screenwidth = this.game.screenwidth;
    var screenheight = this.game.screenheight;

    // handle screen shaking feature
    var screenshake=0;
    if (this.screenshaketime>0)
    {   this.screenshaketime--;
        screenshake = 1 * (this.screenshaketime%2);
    }       
    
    // paint the level tiles in a big action
    var lr = this.game.levelRenderer; 
    if (lr!=null && (this.logic!=null))
    {   lr.draw(screenwidth, screenheight, 
            this.screentilesize, this.logic, this.frames_left,
            this.screenscrollx0, this.screenscrolly0+screenshake, 
            this.screenscrollx1, this.screenscrolly1+screenshake); 
    }

    var statusbarheight = this.screentilesize*0.833;
    var statustextheight = this.statusbarheight*0.8;
    var statustilesize = this.statusbarheight*0.8;        
    var hspace = this.statusbarheight/10.0;
    
    // set up the renderers for decoration rendering
    lr.startDrawing(screenwidth,screenheight, this.statustilesize);     
    var tr = this.game.textRenderer;
    tr.startDrawing(screenwidth,screenheight);
    var vr = this.game.vectorRenderer;
    vr.startDrawing(screenwidth, screenheight);

    // add a focus highlight
    if (this.inputmodeswitchtime>0)
    {   this.inputmodeswitchtime--;
    }           
    if (this.inputfocushighlightx>=0 && this.inputfocushighlighty>=0 && this.inputmodeswitchtime>0)
    {   
        vr.addInputFocusMarker (
          this.inputfocushighlightx+(this.inputfocushighlightplayer==0
                  ?this.screenscrollx0:this.screenscrollx1)-this.screentilesize/2, 
          this.inputfocushighlighty+(this.inputfocushighlightplayer==0
                  ?this.screenscrolly0:this.screenscrolly1)-this.screentilesize/2, 
          this.screentilesize, this.screentilesize, 
           ((((this.inputmodeswitchtime%20)*255)/20)<<24) | 0x00ffffff
        );            
    }

    // paint the automatic play arrow very big over the top of the screen
    if (this.playmode!=GameScreen.PLAYMODE_RECORD && this.game.getTopScreen()==this)
    {   var iconsize = this.screentilesize * 6.0;
        var color = 0x887799ff;
        var x = (screenwidth-iconsize)/2; 
        var y = (screenheight-iconsize)/2; 
        if (this.playmode==GameScreen.PLAYMODE_UNDO)
        {   vr.addPlayArrow(x,y, iconsize,iconsize, -1, color);
        }
        else if (this.playmode==GameScreen.PLAYMODE_REPLAY || this.playmode==GameScreen.PLAYMODE_DEMO)
        {   if(this.playbackspeed>1)
            {   vr.addFastForwardArrow(x,y,iconsize,iconsize, 1, color);
            }
            else if (this.playbackspeed>0)
            {   vr.addForwardArrow(x,y,iconsize,iconsize, 1, color);
            }
            else if (this.playbackspeed<-1)
            {   vr.addFastForwardArrow(x,y,iconsize,iconsize, -1, color);
            }
            else if (this.playbackspeed<0)
            {   vr.addForwardArrow(x,y,iconsize,iconsize, -1, color);                   
            }
            else
            {   vr.addSlowMotionArrow(x,y,iconsize,iconsize, 1,color);
            }               
        }
    }               

    // paint status display
    var x2 = screenwidth-hspace - statusbarheight - 2*hspace;
    var y2 = screenheight-hspace;
    var y1 = this.y2-statusbarheight;
    var x1 = x2 - hspace;
    var ycenter = (y1+y2)/2;
                        
    // gem count-down
    x1 -= hspace;
    var needed = this.logic.getNumberOfEmeraldsStillNeeded();
    x1 = tr.addNumber(needed<0 ? 0:needed,  x1,ycenter-statustextheight/2,statustextheight, 
        true,  this.logic.canStillGetEnoughEmeralds() ? 0xffffffff : 0xffff3333, TextRenderer.WEIGHT_BOLD);
    x1 -= hspace;
    lr.addSimplePieceToBuffer (x1-statustilesize,ycenter-statustilesize/2,Logic.EMERALD);  
    x1 = x1 - statustilesize - hspace;
        
    // add collected bombs and keys of first player
    var keys = this.logic.getCollectedKeys(0);
    var bombs = this.logic.getCollectedTimeBombs(0);
    if (keys!=0)
    {   if ((keys&0x01) != 0)
        {   lr.addSimplePieceToBuffer (x1-statustilesize,ycenter-statustilesize/2,Logic.KEYRED);  
            x1-=statustilesize;
        }
        if ((keys&0x02) != 0)
        {   lr.addSimplePieceToBuffer (x1-statustilesize,ycenter-statustilesize/2,Logic.KEYGREEN);  
            x1-=statustilesize;
        }
        if ((keys&0x04) != 0)
        {   lr.addSimplePieceToBuffer (x1-statustilesize,ycenter-statustilesize/2,Logic.KEYBLUE);  
            x1-=statustilesize;
        }
        if ((keys&0x08) != 0)
        {   lr.addSimplePieceToBuffer (x1-statustilesize,ycenter-statustilesize/2,Logic.KEYYELLOW);  
            x1-=statustilesize;
        }
        x1 -= hspace;
    }
    if (bombs>0)
    {   x1 = tr.addNumber(bombs,  x1,ycenter-statustextheight/2,statustextheight, 
             true,  0xffffffff, TextRenderer.WEIGHT_BOLD); 
        x1 -= hspace;
        lr.addSimplePieceToBuffer (x1-statustilesize,ycenter-statustilesize/2,Logic.TIMEBOMB);
        x1 = x1 - statustilesize - hspace;  
    }           
               
    // background area
    x1 -= hspace;
    vr.addRoundedRect(x1, y1, x2-x1,y2-y1, statusbarheight/2, statusbarheight/2+1.0, 0xdd000000);

    // memorize the position of the status bar  (is clickable to allow bomb-dropping)
    this.statusbarx1 = Math.floor(x1);
    this.statusbary1 = Math.floor(y1);

    // add left extension for status bar that holds the move counter (in seconds) and the player 2 status
    {
        x1 = hspace;
        x2 = x1 + hspace;
        var y = ycenter-statustextheight/2;
            
        var sec = Math.floor((this.logic.getTurnsDone() * LevelRenderer.FRAMESPERSTEP - this.frames_left) / 600);  // fix rate: 600 logic-frames / second
        var min = Math.floor(sec/60);
        sec = sec%60;
            
        x2 += hspace;
        x2 = tr.addNumber(min, x2,y,statustextheight, false,  0xffffffff, TextRenderer.WEIGHT_PLAIN);
        x2 = tr.addString(sec<10?":0":":", x2,y,statustextheight, false,  0xffffffff, TextRenderer.WEIGHT_PLAIN);
        x2 = tr.addNumber(sec, x2,y,statustextheight, false,  0xffffffff, TextRenderer.WEIGHT_PLAIN);
        x2 += hspace;
            
        // add collected bombs
        keys = this.logic.getCollectedKeys(1);
        bombs = this.logic.getCollectedTimeBombs(1);
        if (keys!=0)
        {   if ((keys&0x01) != 0)
            {   lr.addSimplePieceToBuffer (x2,ycenter-statustilesize/2,Logic.KEYRED);  
                x2+=statustilesize;
            }
            if ((keys&0x02) != 0)
            {   lr.addSimplePieceToBuffer (x2,ycenter-statustilesize/2,Logic.KEYGREEN);  
                x2+=statustilesize;
            }
            if ((keys&0x04) != 0)
            {   lr.addSimplePieceToBuffer (x2,ycenter-statustilesize/2,Logic.KEYBLUE);  
                x2+=statustilesize;
            }
            if ((keys&0x08) != 0)
            {   lr.addSimplePieceToBuffer (x2,ycenter-statustilesize/2,Logic.KEYYELLOW);  
                x2+=statustilesize;
            }
            x2 += hspace;
        }
        if (bombs>0)
        {   x2 += hspace;
            lr.addSimplePieceToBuffer (x2,ycenter-statustilesize/2,Logic.TIMEBOMB);
            x2 = x2 + statustilesize + hspace;  
            x2 = tr.addNumber(bombs,  x2,ycenter-statustextheight/2,statustextheight, 
                 false,  0xffffffff, TextRenderer.WEIGHT_BOLD);    
            x2 += hspace;
        }           

        vr.addRoundedRect(x1, y1, x2-x1,y2-y1, statusbarheight/2, statusbarheight/2+1.0, 0xdd000000);
    }
        

    // paint the menu button (but only if no menu is already present)
    if (this.game.getTopScreen()==this)
    {   this.menuButton.draw(this.game.vectorRenderer);
    }

    // flush everything to the screen in correct order
    vr.flush();                     
    tr.flush();    // paint text on top of box         
    lr.flush();     // paint images on top of box

    // paint the touch motion raster(s)
    for (var i=0; i<this.inputGrid.length; i++)      
    {   this.inputGrid[i].draw(screenwidth, screenheight);
    }
};


GameScreen.prototype.reactivate = function()
{
    Screen.prototype.reactivate.call(this);
    for (var i=0; i<this.gamePadMUX.length; i++)
    {   this.gamePadMUX[i].reset();
    }       
    this.keyboardTranslator.reset();
    for (var i=0; i<this.inputGrid.length; i++)
    {   this.inputGrid[i].reset();
    }                   
};

        
GameScreen.prototype.adjustScrolling = function(force)
{
    // determine chosen size of the screen tiles
    this.screentilesize = 60;

    var screenwidth = this.game.screenwidth;
    var screenheight = this.game.screenheight;
    var screentilesize = this.screentilesize;
    var frames_left = this.frames_left;

    this.inputfocushighlightx = -1;
    this.inputfocushighlighty = -1;      
    var populatedwidth = this.logic.getPopulatedWidth();
    var populatedheight = this.logic.getPopulatedHeight();                   

    // first parse of the transaction data to extract the information about player movements
    var playerx_at_end_0 = this.logic.getPlayerPositionX(0);
    var playerx_at_begin_0 = playerx_at_end_0;
    var playery_at_end_0 = this.logic.getPlayerPositionY(0);
    var playery_at_begin_0 = playery_at_end_0;
    var playerx_at_end_1 = this.logic.getPlayerPositionX(1);
    var playerx_at_begin_1 = playerx_at_end_1;
    var playery_at_end_1 = this.logic.getPlayerPositionY(1);
    var playery_at_begin_1 = playery_at_end_1;

    if (frames_left>0)
    {
        var animstart = this.logic.getFistAnimationOfTurn();
        var animend = this.logic.getAnimationBufferSize();
        for (var idx=animstart; idx<animend; idx++)
        {
            var trn = this.logic.getAnimation(idx);
            if ((trn & OPCODE_MASK)==TRN_COUNTER)              
            {   var index = (trn>>20) & 0xff;
                var increment = trn & 0xfffff;
                if (increment>=0x80000) increment-=0x100000; // sign extend
                switch (index) 
                {   case CTR_MANPOSX1:
                        playerx_at_begin_0 -= increment;
                        break;
                    case CTR_MANPOSY1:
                        playery_at_begin_0 -= increment;
                        break;
                    case CTR_MANPOSX2:
                        playerx_at_begin_1 -= increment;
                        break;
                    case CTR_MANPOSY2:
                        playery_at_begin_1 -= increment;
                        break;
                }                       
            }           
        }
    }
        
    // compute current player positions
    var playerposx0 = interpolatePixels(playerx_at_begin_0*screentilesize+screentilesize/2,
                                            playerx_at_end_0*screentilesize+screentilesize/2, frames_left); 
    var playerposy0 = interpolatePixels(playery_at_begin_0*screentilesize+screentilesize/2, 
                                            playery_at_end_0*screentilesize+screentilesize/2, frames_left);
    var playerposx1 = interpolatePixels(playerx_at_begin_1*screentilesize+screentilesize/2, 
                                            playerx_at_end_1*screentilesize+screentilesize/2, frames_left); 
    var playerposy1 = interpolatePixels(playery_at_begin_1*screentilesize+screentilesize/2, 
                                            playery_at_end_1*screentilesize+screentilesize/2, frames_left);                                                             
                                           
    // when input is switched to second player, move highlight there also 
    if (this.logic.getNumberOfPlayers()>1 && this.keyboardTranslator.hasSwitchedControls())
    {   this.inputfocushighlightx = playerposx1;
        this.inputfocushighlighty = playerposy1;
        this.inputfocushighlightplayer = 1;
    }   
    // otherwise keep first player highlighted
    else 
    {   this.inputfocushighlightx = playerposx0;
        this.inputfocushighlighty = playerposy0;         
        this.inputfocushighlightplayer = 0;
    }
                    
    // when target was selected, use the arrow head as player position
    if (this.inputGrid[0].hasDestination())
    { 
        playerposx0 = this.inputGrid[0].getDestinationX() * screentilesize + screentilesize/2;
        playerposy0 = this.inputGrid[0].getDestinationY() * screentilesize + screentilesize/2;
    }           
    if (this.inputGrid[1].hasDestination())
    { 
        playerposx1 = this.inputGrid[1].getDestinationX() * screentilesize + screentilesize/2;
        playerposy1 = this.inputGrid[1].getDestinationY() * screentilesize + screentilesize/2;
    }

    // when only one player, computation is quite easy
    if (this.logic.getNumberOfPlayers()<=1)
    {
        // when scrolling is not locked, compute the desired scroll position
        if (force || !this.inputGrid[0].isTouchInProgress())             
        {   // when scrolling is re-enabled, do fast scrolling to the target position
            var step = force ? 1000000000 : (screentilesize/3);  
            this.screenscrollx0 = approach(this.screenscrollx0, 
                calculateScreenOffsetX(screenwidth, screentilesize, playerposx0, populatedwidth, true), step);
            this.screenscrolly0 = approach(this.screenscrolly0, 
                calculateScreenOffsetY(screenheight, screentilesize, playerposy0, populatedheight, true), step);
        }                               
        // use the values also for second set of values to only get a single screen
        this.screenscrollx1 = this.screenscrollx0;            
        this.screenscrolly1 = this.screenscrolly0;   
    }
        
    // for the two-player mode, the calculation is also done with locking the scolling when any drag is in progress
    else
    {   
        // when the players are near together, compute an average position
        var splitthreasholdx = screenwidth/4;
        var splitthreasholdy = screenheight/4;  
        // in two-player mode, when the players are not too far separated, use a middle-position for both views
        if ( Math.abs(playerposx0 - playerposx1) < 2*splitthreasholdx)
        {   playerposx0 = playerposx1 = (playerposx0 + playerposx1)/2;  
        }
        // otherwise tear apart the views
        else if (playerposx0<playerposx1)
        {   playerposx0+=splitthreasholdx;
            playerposx1-=splitthreasholdx;          
        }
        else
        {   playerposx0-=splitthreasholdx;
            playerposx1+=splitthreasholdx;          
        }                           
        if ( Math.abs(playerposy0 - playerposy1) < 2*splitthreasholdy)
        {   playerposy0 = playerposy1 = (playerposy0 + playerposy1)/2;  
        } 
        else if (playerposy0<playerposy1)
        {   playerposy0+=splitthreasholdy;
            playerposy1-=splitthreasholdy;          
        }
        else
        {   playerposy0-=splitthreasholdy;
            playerposy1+=splitthreasholdy;          
        }          

        // when scrolling is not locked, compute the desired scroll position
        if (force || (!this.inputGrid[0].isTouchInProgress() && !this.inputGrid[1].isTouchInProgress()))              
        {   // when scrolling is re-enabled, do fast scrolling to the target position
            var step = force ? 1000000000 : (screentilesize/3);  
            this.screenscrollx0 = approach(this.screenscrollx0, 
                calculateScreenOffsetX(screenwidth, screentilesize, playerposx0, populatedwidth, true), step);
            this.screenscrolly0 = approach(this.screenscrolly0, 
                calculateScreenOffsetY(screenheight, screentilesize, playerposy0, populatedheight, true), step);
            this.screenscrollx1 = approach(this.screenscrollx1, 
                calculateScreenOffsetX(screenwidth, screentilesize, playerposx1, populatedwidth, true), step);
            this.screenscrolly1 = approach(this.screenscrolly1, 
                calculateScreenOffsetY(screenheight, screentilesize, playerposy1, populatedheight, true), step);
        }
    }
   
    // after computation send current scrolling information to the touch input handler(s)
    this.inputGrid[0].synchronizeWithGame(
            this.screenscrollx0, this.screenscrolly0, screentilesize, playerx_at_end_0, playery_at_end_0);
    if (this.inputGrid.length>1)
    {   this.inputGrid[1].synchronizeWithGame(
            this.screenscrollx1, this.screenscrolly1, screentilesize, playerx_at_end_1, playery_at_end_1);
    }
    
    function approach(value, target, step)
    {   
        if (value<target)
        {   if (value+step<target)
            {   return Math.round(value+step);
            }
        }
        else if (value>target)
        {   if (value-step>target)
            {   return Math.round(value-step);
            }
        }
        return Math.round(target);
    }    
    function interpolatePixels(pix1, pix2, frames_until_endposition)
    {
        var f2 = LevelRenderer.FRAMESPERSTEP - frames_until_endposition;
        return (pix1*frames_until_endposition + pix2*f2) / LevelRenderer.FRAMESPERSTEP;     
    }
    function calculateScreenOffsetX(displaywidth, screentilewidth, pixelx, populatedwidth, stopatedges)
    {
        var lw = screentilewidth*populatedwidth;  // size of the populated area in pixel
        // when level fits into display completely, just simply center it 
        if (displaywidth>lw)
        {   return (displaywidth - lw) / 2;
        }
        // move screen to have player in center
        var ox = (displaywidth/2) - pixelx;
        // but stop at edges in single-player mode
        if (stopatedges)
        {   if (ox>0) 
            {   ox=0;       
            }
            else if (ox+lw<displaywidth)
            {   ox = displaywidth-lw;
            }
        }
        return ox;
    }            
    function calculateScreenOffsetY(displayheight, screentileheight, pixely, populatedheight, stopatedges)
    {
        var lh = screentileheight*populatedheight;
        // when level fits into display completely, just simply center it 
        if (displayheight>=lh)
        {   return (displayheight - lh) / 2;
        }
        // move screen to have player in center
        var oy = (displayheight/2) - pixely;
        // but stop at edges in single-player mode
        if (stopatedges)
        {   if (oy>0) 
            {   oy=0;       
            }
            else if (oy+lh<displayheight)
            {   oy = displayheight-lh;
            }
        }
        return oy;
    }
};
    
    
GameScreen.prototype.gameRecording = function()
{
    this.frames_left--;
    if (this.frames_left<0)
    {               
        // prevent time progress in singlestep mode when no movement is present
        if (this.singlestep && !(this.logic.isSolved() || this.logic.isKilled()))
        {   var havemove = false;
            for (var i=0; i<this.gamePadMUX.length; i++)
            {   havemove = havemove || this.inputGrid[i].hasNextMovement() || this.gamePadMUX[i].hasNextMovement();           
            }               
            if (!havemove)
            {   this.frames_left=0;
                return;
            }
        }
        
        // normal game progress
        this.step++;
        while (this.walk.currentNumberOfCompleteTurns()<this.step)
        {   var m0 = this.inputGrid[0].nextMovement();  
            if (m0!=Walk.MOVE_REST)
            {   this.gamePadMUX[0].reset();                      
            }
            else
            {   m0 = this.gamePadMUX[0].nextMovement();
                if (m0!=Walk.MOVE_REST)
                {   this.inputGrid[0].reset();
                    this.inputmodeswitchtime = 0;
                }
            }
            var m1 = this.inputGrid[1].nextMovement();  
            if (m1!=Walk.MOVE_REST)
            {   this.gamePadMUX[1].reset();
            }
            else
            {   m1 = this.gamePadMUX[1].nextMovement();
                if (m1!=Walk.MOVE_REST)
                {   this.inputGrid[1].reset();
                    this.inputmodeswitchtime = 0;
                }
            }    
            this.walk.recordMovements(m0,m1);
        }
            
        this.logic.gototurn(this.step);
        this.frames_left = LevelRenderer.FRAMESPERSTEP-1;
        if (this.game.soundPlayer.preparePlaying(this.logic))
        {   this.screenshaketime = 3;
        }
        this.game.soundPlayer.playNow();
    }
};
    
GameScreen.prototype.gamePlayback = function()
{
    if (this.playbackspeed==0)   // this means slow motion forward   
    {   this.slowmotion_counter++;
        if (this.slowmotion_counter<10)
        {   return;
        }
        this.slowmotion_counter=0;
        this.frames_left--;
    }
    else
    {   this.frames_left -= this.playbackspeed;      
    }
        
    while (this.frames_left<0)           
    {   if (this.step<=this.logic.getTurnsInWalk())
        {   this.step++;
            this.logic.gototurn(this.step);
            this.frames_left += LevelRenderer.FRAMESPERSTEP;             
            if (this.playbackspeed==1) 
            {   if (this.game.soundPlayer && this.game.soundPlayer.playStep(this.logic))
                {   screenshaketime = 3;
                }
            }               
        }
        else
        {   this.frames_left = 0;
            this.createMenuScreen(true);
        }        
    }
    while (this.frames_left>=LevelRenderer.FRAMESPERSTEP || (this.step==0 && this.frames_left>0))          
    {   if (this.step>0)
        {   this.step--;
            this.logic.gototurn(this.step);
            this.frames_left -= LevelRenderer.FRAMESPERSTEP;             
        }
        else
        {   this.frames_left = 0;
            this.createMenuScreen(true);
        }        
    }           
};
    
//  private void gamePlaybackSeek(int offset)
//  {
//      frames_left = 0;
//      if (offset<0)
//      {   step = Math.max(offset+step,0);
//          logic.gototurn(step);
//      }
//      else if (offset>0)
//      {   step = Math.min(offset+step, logic.getTurnsInWalk());
//          logic.gototurn(step);
//      }
//  }
    

GameScreen.prototype.gameUndo = function()
{
    if (this.step<=0)
    {   this.playmode=GameScreen.PLAYMODE_RECORD;   
        this.createMenuScreen(false);
    }
    else
    {   this.frames_left++;
        if (this.frames_left>LevelRenderer.FRAMESPERSTEP-1)
        {   this.step--;
            this.logic.gototurn(this.step);
            this.walk.trimRecord(this.step);
            this.frames_left = 0;
            if ( this.step<=0)       
            {   this.playmode = GameScreen.PLAYMODE_RECORD;
                this.createMenuScreen(false);                
            }
        }
    }
};

GameScreen.prototype.startRecordingTimeMeasurement = function()
{
    this.time_at_record_start = Game.currentTimeMillis();   
};

GameScreen.prototype.stopRecordingTimeMeasurement = function()
{   
    if (this.time_at_record_start>0)
    {   var seconds = Math.floor((Game.currentTimeMillis() - this.time_at_record_start) / 1000);
        this.time_at_record_start = 0;
        if (seconds>0)
        {   var solvegrade = this.game.getLevelSolvedGrade(this.level);
            if (solvegrade<0)
            {   solvegrade += seconds;
                if (solvegrade>0) { solvegrade=0; }
                this.game.setLevelSolvedGrade(this.level, solvegrade);
            }
        }
    }    
};
    
GameScreen.prototype.createMenuScreen = function(onlypopup)
{
    // do not open menu twice
    if (this.game.getTopScreen() != this)
    {   return;
    }        
    // remove arrow that could still be in the queue
    for (var i=0; i<this.inputGrid.length; i++)
    {   this.inputGrid[i].reset();
    }               
    
    this.stopRecordingTimeMeasurement();
        
    // create the menu screen
    var m = new PauseMenu().$(this.game,this, this.level, PauseMenu.MENUACTION_EXIT);
        
    // this only a small user-triggered menu for commands during game progress
    if(onlypopup)
    {   
        if (this.playmode==GameScreen.PLAYMODE_RECORD || this.playmode==GameScreen.PLAYMODE_UNDO)
        {   m.addPriorityAction(PauseMenu.MENUACTION_UNDO);
            m.addDefaultAction(PauseMenu.MENUACTION_CONTINUERECORDING);
            m.addPriorityAction(this.startFromEditor ? PauseMenu.MENUACTION_EXITTOEDITOR : PauseMenu.MENUACTION_EXIT);
            m.addAction(PauseMenu.MENUACTION_RESTART);              
            if (this.level.getDifficulty()>=5 || Game.DEVELOPERMODE)
            {   if (this.singlestep) 
                {   m.addAction(PauseMenu.MENUACTION_SINGLESTEP_OFF);
                }
                else 
                {   m.addAction(PauseMenu.MENUACTION_SINGLESTEP_ON);
                }
            }
            if (this.level.numberOfDemos()>0)
            {   var solvegrade = this.game.getLevelSolvedGrade(this.level);
                if (solvegrade>=0 || Game.DEVELOPERMODE) 
                {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO);                     
                    if (this.level.numberOfDemos()>1)
                    {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO2);
                    }
                    if (this.level.numberOfDemos()>2)
                    {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO3);
                    }                               
                }
                else  
                {   m.addNonAction("Demo in "+Game.buildTimeString(-solvegrade));
                }
            }               
        }
        else if (this.playmode==GameScreen.PLAYMODE_DEMO || this.playmode==GameScreen.PLAYMODE_REPLAY)
        {   if (this.step<this.logic.getTurnsInWalk())
            {   m.addPriorityAction(PauseMenu.MENUACTION_FASTFORWARD);
                m.addDefaultAction(PauseMenu.MENUACTION_FORWARD);
                if (this.step>0)
                {   m.addAction(PauseMenu.MENUACTION_BACKWARD);
                    m.addAction(PauseMenu.MENUACTION_FASTBACKWARD);
                }
                m.addAction(PauseMenu.MENUACTION_SLOWMOTION);
            }
            else 
            {   m.addPriorityAction(PauseMenu.MENUACTION_FASTBACKWARD);
                m.addDefaultAction(PauseMenu.MENUACTION_BACKWARD);
            }
            m.addPriorityAction(this.playmode==GameScreen.PLAYMODE_DEMO ? PauseMenu.MENUACTION_LEAVEDEMO : PauseMenu.MENUACTION_LEAVEREPLAY);
            m.addAction(this.startFromEditor ? PauseMenu.MENUACTION_EXITTOEDITOR : PauseMenu.MENUACTION_EXIT);
            m.setMessage(this.playmode==GameScreen.PLAYMODE_DEMO ? "Viewing demo" : "Viewing replay");
        }
        m.addAction(this.game.getMusicActive() ? PauseMenu.MENUACTION_MUSIC_OFF_POPUP : PauseMenu.MENUACTION_MUSIC_ON_POPUP);                    
    }
    // this menu will be used before start of game or after the end (non-user triggered)
    else
    {   
        if (this.playmode!=GameScreen.PLAYMODE_RECORD)
        {   console.log("Must not open 'big' in-game menu outside record mode");
            return;
        }
                    
        if (this.logic.isKilled())
        {   m.addPriorityAction(PauseMenu.MENUACTION_RESTART);
            m.addDefaultAction(PauseMenu.MENUACTION_UNDO);              
            m.addPriorityAction(this.startFromEditor ? PauseMenu.MENUACTION_EXITTOEDITOR : PauseMenu.MENUACTION_EXIT);               
            if (this.game.getLevelSolvedGrade(this.level)>=0 || Game.DEVELOPERMODE)
            {   if (this.level.numberOfDemos()>0)
                {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO);
                }
                if (this.level.numberOfDemos()>1)
                {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO2);
                }
                if (this.level.numberOfDemos()>2)
                {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO3);
                }
            }
            m.setMessage("Player was killed.");
        }
        else if (this.logic.isSolved()) 
        {   if (this.canFindNextLevel)
            {   m.addDefaultAction(PauseMenu.MENUACTION_NEXTLEVEL);
            }
            m.addPriorityAction(this.startFromEditor ? PauseMenu.MENUACTION_EXITTOEDITOR : PauseMenu.MENUACTION_EXIT);
            m.addAction(PauseMenu.MENUACTION_RESTART);
            m.addAction(PauseMenu.MENUACTION_REPLAY);
            if (this.startFromEditor)
            {   m.addAction(PauseMenu.MENUACTION_STOREWALK);
            }

            // check if the solution was done without assistances
            if (this.diduse_singlestep)
            {   m.setMessage("Solved using single steps.");
                this.game.setLevelSolvedGrade(this.level,1);
            }
            else if (this.diduse_undo)
            {   m.setMessage("Solved using undo.");
                this.game.setLevelSolvedGrade(this.level,1);
            }
            else 
            {   var time = this.logic.totalTimeForSolution();
                m.setMessage("Directly solved in "+getTurnTimeString(time)+"!");
                this.game.setLevelSolvedGrade(this.level,2);
            }
        }
        else if (this.step==0)
        {   m.addDefaultAction(PauseMenu.MENUACTION_START);
            m.addPriorityAction(this.startFromEditor ? PauseMenu.MENUACTION_EXITTOEDITOR : PauseMenu.MENUACTION_EXIT);               
            if (this.game.getLevelSolvedGrade(this.level)>=0 || Game.DEVELOPERMODE)
            {   if (this.level.numberOfDemos()>0)
                {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO);
                }
                if (this.level.numberOfDemos()>1)
                {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO2);
                }
                if (this.level.numberOfDemos()>2)
                {   m.addAction(PauseMenu.MENUACTION_SHOWDEMO3);
                }
            }
        }       
        else        // this should never be used...
        {   console.log("invalid state at menu creation!");
        }
        m.addAction(this.game.getMusicActive() ? PauseMenu.MENUACTION_MUSIC_OFF : PauseMenu.MENUACTION_MUSIC_ON);                   
    }

    m.layout();
    this.game.addScreen(m);

    function getTurnTimeString(turns)
    {
        var hsec = Math.floor(turns * LevelRenderer.FRAMESPERSTEP / 0.6);   // fix rate: 60 logic-frames / second
        var sec = Math.floor(hsec/100);
        var min = Math.floor(sec/60);
        hsec = hsec%100;   
        sec = sec%60;
        return min+(sec<10?":0":":")+sec+(hsec<10?":0":":")+hsec;
    }    
};

    // -------------------- actions from the ingame-menu ---------------
GameScreen.prototype.menuAction = function(id)
{   
    switch (id)
    {   case PauseMenu.MENUACTION_EXIT:
        case PauseMenu.MENUACTION_EXITTOEDITOR:
        {   this.game.removeScreen();
            break;
        }
        case PauseMenu.MENUACTION_START:    
        case PauseMenu.MENUACTION_RESTART:
        {   this.diduse_undo = false;
            this.diduse_singlestep = this.singlestep;

            this.step=0;
            this.frames_left=0;
            this.playmode = GameScreen.PLAYMODE_RECORD;
            this.walk.initialize(Math.floor((Math.random()*1000000)));
            this.logic.attach(this.level,this.walk);
            this.adjustScrolling(true);
            this.startRecordingTimeMeasurement();
            break;
        }       
        case PauseMenu.MENUACTION_CONTINUERECORDING:
        {   this.playmode = GameScreen.PLAYMODE_RECORD;         
            this.startRecordingTimeMeasurement();
            break;
        }       
        case PauseMenu.MENUACTION_LEAVEDEMO:
        {   this.logic.attach(this.level,this.walk);
            this.logic.gototurn(this.walk.getTurns());
            this.step=this.walk.getTurns();
            this.frames_left=0;
            this.playmode=GameScreen.PLAYMODE_RECORD;
            this.adjustScrolling(true);
            this.startRecordingTimeMeasurement();
            break;
        } 
        case PauseMenu.MENUACTION_LEAVEREPLAY:
        {   this.logic.attach(this.level,this.walk);
            this.logic.gototurn(this.walk.getTurns());
            this.step=this.walk.getTurns();
            this.frames_left=0;
            this.playmode=GameScreen.PLAYMODE_RECORD;
            this.adjustScrolling(true);
            this.createMenuScreen(false);
            this.startRecordingTimeMeasurement();
            break;                      
        }
        case PauseMenu.MENUACTION_REPLAY:
        {   this.step=0;
            this.frames_left=0;
            this.playmode = GameScreen.PLAYMODE_REPLAY;
            this.playbackspeed = 1;
            this.slowmotion_counter = 0;
            this.logic.gototurn(this.step);               
            break;
        }    
        case PauseMenu.MENUACTION_SHOWDEMO:
        case PauseMenu.MENUACTION_SHOWDEMO2:
        case PauseMenu.MENUACTION_SHOWDEMO3:
        {   var idx = id==(PauseMenu.MENUACTION_SHOWDEMO) ? 0 : (1 + (id-PauseMenu.MENUACTION_SHOWDEMO2));
            if (this.level.numberOfDemos()>idx)
            {   this.logic.attach(this.level,this.level.getDemo(idx));
                this.step=0;
                this.frames_left=0;
                this.playmode = GameScreen.PLAYMODE_DEMO;
                this.playbackspeed = 1;
                this.slowmotion_counter = 0;
                this.adjustScrolling(true);
            }            
            break;
        }       
        case PauseMenu.MENUACTION_NEXTLEVEL:
        {   this.game.removeScreen();
            var top = this.game.getTopScreen();
            if (top!=null)
            {   top.startSubsequentLevel();
            }
            break;
        }
        case PauseMenu.MENUACTION_STOREWALK:
        {   this.level.setDemo(walk);
            this.game.removeScreen();
            break;
        }
        case PauseMenu.MENUACTION_UNDO:
        {   this.playmode = GameScreen.PLAYMODE_UNDO;
            this.diduse_undo = true;
            break;
        }                   
        case PauseMenu.MENUACTION_SINGLESTEP_ON:
        {   this.singlestep = true;
            this.diduse_singlestep = true;
            this.createMenuScreen(true);
            break;      
        }        
        case PauseMenu.MENUACTION_SINGLESTEP_OFF:
        {   this.singlestep = false;
            this.createMenuScreen(true);
            break;      
        }        
        case PauseMenu.MENUACTION_FORWARD:
        {   this.playbackspeed = 1;
            break;
        }
        case PauseMenu.MENUACTION_BACKWARD:
        {   this.playbackspeed = -1;
            break;              
        }
        case PauseMenu.MENUACTION_FASTFORWARD:
        {   this.playbackspeed = 16;
            break;              
        }
        case PauseMenu.MENUACTION_FASTBACKWARD:
        {   this.playbackspeed = -16;
            break;              
        }
        case PauseMenu.MENUACTION_SLOWMOTION:
        {   this.playbackspeed = 0;      // value 0 has special meaning  
            break;
        }    
        case PauseMenu.MENUACTION_MUSIC_OFF:
        {   this.game.setMusicActive(false);
            this.game.stopMusic();
            this.createMenuScreen(false);
            break;                      
        }
        case PauseMenu.MENUACTION_MUSIC_OFF_POPUP:
        {   this.game.setMusicActive(false);
            this.game.stopMusic();
            break;       
        }
        case PauseMenu.MENUACTION_MUSIC_ON:
        {   this.game.setMusicActive(true);
            this.game.startCategoryMusic(this.level.getCategory());
            this.createMenuScreen(false);
            break;
        }
        case PauseMenu.MENUACTION_MUSIC_ON_POPUP:
        {   this.game.setMusicActive(true);
            this.game.startCategoryMusic(this.level.getCategory());
            break;                  
        }
    }
};

GameScreen.prototype.onResize = function()
{   
    this.layout();
};
    
GameScreen.prototype.onBackNavigation = function()
{
    // when in the game screen, back navigation just calls up the ingame menu
    this.createMenuScreen(true);    
};

GameScreen.prototype.onKeyDown = function(code)
{        
    // in record mode use up- and down-events               
    if (this.playmode==GameScreen.PLAYMODE_RECORD)
    {   if ((code==KeyEvent.KEYCODE_ENTER || code==KeyEvent.KEYCODE_TAB) && this.logic.getNumberOfPlayers()>1)   
        {   //if (twousermode)
                    //{ twousermode = false;
                    //}
                    //else
                    //{
                        keyboardTranslator.switchControls(!keyboardTranslator.hasSwitchedControls());
                    //}
            this.inputmodeswitchtime = 60;
            this.adjustScrolling(true);              
        }
        else
        {   //if (keyboardTranslator.isKeyForSecondaryInput(code) && logic.getNumberOfPlayers()>1) 
                    //{ // twousermode = true;
                    //  if (keyboardTranslator.hasSwitchedControls())
                    //  {   keyboardTranslator.switchControls(false);
                    //      adjustScrolling(true);
                    //  }               
                    //}
            this.keyboardTranslator.keyDown(code);           
        }
    }
    // outside record mode, any down-event calls up the menu
    else      
    {   this.createMenuScreen(true);     
    }
};
    
GameScreen.prototype.onKeyUp = function(code)
{
    if (this.playmode==GameScreen.PLAYMODE_RECORD)
    {   this.keyboardTranslator.keyUp(code);
    }
};
    
    
GameScreen.prototype.onPointerDown = function(x,y)
{   
    if (this.menuButton.onPointerDown(x,y))
    {   return;
    }

    if (this.playmode==GameScreen.PLAYMODE_RECORD)
    {   
        for (var i=0; i<this.inputGrid.length; i++)
        {   if (this.inputGrid[i].onPointerDown(x,y, true))
            {   return;
            }
        }
        for (var i=0; i<this.inputGrid.length; i++)
        {   if (this.inputGrid[i].onPointerDown(x,y, false))
            {   return;
            }
        }           
    }
             
    Screen.prototype.onPointerDown.call(this,x,y);
};
    
GameScreen.prototype.onPointerUp = function()
{
    this.menuButton.onPointerUp();      

    // in record mode, all pointer up events call up the menu
    if (this.playmode!=GameScreen.PLAYMODE_RECORD)
    {   this.createMenuScreen(true);
        return;
    }       

    if (this.playmode==GameScreen.PLAYMODE_RECORD)
    {   for (var i=0; i<this.inputGrid.length; i++)
        {   this.inputGrid[i].onPointerUp();
        }               
    }
        
    Screen.prototype.onPointerUp.call(this);
};
    
GameScreen.prototype.onPointerMove = function(x, y)
{
    this.menuButton.onPointerMove(x,y);      

    if (this.playmode==GameScreen.PLAYMODE_RECORD)
    {   for (var i=0; i<this.inputGrid.length; i++)
        {   this.inputGrid[i].onPointerMove(x,y);
        }               
    }
                
    Screen.prototype.onPointerMove.call(this,x,y);
};
    
/*
    // methods to extract data to make it persistent
    public String getCurrentLevelTitle()
    {
        return level.getTitle();  
    }
    public String getCurrentWalkSerialized()
    {
        return walk.toJSON(); 
    }
*/    

