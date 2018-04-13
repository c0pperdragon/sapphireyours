"use strict";
var PauseMenu = function()
{   Screen.call(this);
    
    this.listener = null;
    this.level = null;
    this.navigateBackAction = 0;

    this.numactions = 0;
    this.numpriorityactions = 0;
    this.actions = null;
    this.defaultaction = 0;
    this.message = null;
    this.none_action_label = null;
    
    this.selected = 0;

    // data for layout (computed before first rendering)
    this.title = null;
    this.info = null;
    this.menux = 0.0;
    this.menuy = 0.0;
    this.menuwidth = 0.0;
    this.menuheight = 0.0;
    
    this.iconwidth = 0.0;
    this.iconheight = 0.0;
    this.action0x = 0.0;
    this.action0y = 0.0;
    this.actiondx = 0.0;
    this.lowactionwidth = 0.0;
    this.lowactionheight = 0.0;
    this.lowaction0x = 0.0;
    this.lowaction0y = 0.0;
    this.lowactiondy = 0.0;
};
PauseMenu.prototype = Object.create(Screen.prototype);
    
PauseMenu.MENUACTION_NONEACTION = 0;
PauseMenu.MENUACTION_START = 1;
PauseMenu.MENUACTION_RESTART = 2;
PauseMenu.MENUACTION_REPLAY = 3;
PauseMenu.MENUACTION_SHOWDEMO = 4;
PauseMenu.MENUACTION_NEXTLEVEL = 5;
PauseMenu.MENUACTION_STOREWALK = 6;
PauseMenu.MENUACTION_UNDO = 7;
PauseMenu.MENUACTION_EXIT = 8;
PauseMenu.MENUACTION_LEAVEDEMO = 9;
PauseMenu.MENUACTION_CONTINUERECORDING = 10;
PauseMenu.MENUACTION_LEAVEREPLAY = 11;
PauseMenu.MENUACTION_SINGLESTEP_ON = 12;
PauseMenu.MENUACTION_SINGLESTEP_OFF = 13;
PauseMenu.MENUACTION_FORWARD = 14;
PauseMenu.MENUACTION_BACKWARD = 15;
PauseMenu.MENUACTION_FASTFORWARD = 16;
PauseMenu.MENUACTION_FASTBACKWARD = 17;
PauseMenu.MENUACTION_SLOWMOTION = 18;
PauseMenu.MENUACTION_SHOWDEMO2 = 19;
PauseMenu.MENUACTION_SHOWDEMO3 = 20;
PauseMenu.MENUACTION_TESTLEVEL = 21;
PauseMenu.MENUACTION_DISCARDCHANGES = 22;
PauseMenu.MENUACTION_EXITEDITOR = 23;
PauseMenu.MENUACTION_EXITTOEDITOR = 24;
PauseMenu.MENUACTION_EDITLEVEL = 25;
PauseMenu.MENUACTION_CONTINUEEDIT = 26;
PauseMenu.MENUACTION_EDITSETTINGS = 27;
PauseMenu.MENUACTION_EDITNAME = 28;
PauseMenu.MENUACTION_EDITAUTHOR = 29;
PauseMenu.MENUACTION_EDITINFO = 30;
PauseMenu.MENUACTION_MUSIC_ON = 31;
PauseMenu.MENUACTION_MUSIC_OFF = 32;
PauseMenu.MENUACTION_MUSIC_ON_POPUP = 33;
PauseMenu.MENUACTION_MUSIC_OFF_POPUP = 34;

PauseMenu.actionlabels =  [
        "", "Start", "Restart", "Replay solution", "Show demo", "Next",
        "Use as demo", "Undo", "Exit", "To Game", "Continue", "To Game", 
        "Single step: OFF", "Single step: ON", 
        "Forward", "Backward", "Fast", "Fast Backward", "Slow Motion",
        "Show demo 2", "Show demo 3", "Test", "Discard", "Exit", "To Editor",
        "Level Editor", "Edit", "Level Settings", "Name", "Author", "Info", 
        "Music: OFF", "Music: ON", "Music: OFF", "Music: ON"    
    ];
    

PauseMenu.prototype.$ = function(game, listener, level, navigateBackAction)
{   Screen.prototype.$.call(this,game); 

    this.listener = listener;
    this.level = level;
    this.navigateBackAction = navigateBackAction;
        
    this.actions = [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0];
    this.numactions = 0;
    this.numpriorityactions = 0;
    this.defaultaction = 0;
    this.message = null;
    this.selected = -1;      
    
    this.layout();
    return this;
};


PauseMenu.prototype.isOverlay = function()
{   return true;
};
    
PauseMenu.prototype.addDefaultAction = function(action)
{
    this.addPriorityAction(action);
    this.defaultaction = this.numpriorityactions-1;
    
    if (this.selected<0 && this.game.usingKeyboardInput)
    {   this.selected = this.defaultaction;
    }           
};
    
PauseMenu.prototype.addPriorityAction = function(action)
{
    Game.arraycopy (this.actions,this.numpriorityactions,this.actions,
         this.numpriorityactions+1,this.numactions-this.numpriorityactions);               
    this.actions[this.numpriorityactions] = action;
    this.numpriorityactions++;
    this.numactions++;
};

PauseMenu.prototype.addAction = function(action)
{
    this.actions[this.numactions] = action;
    this.numactions++;
};
    
PauseMenu.prototype.addNonAction = function(label)
{
    this.actions[this.numactions] = PauseMenu.MENUACTION_NONEACTION;
    this.numactions++;
    this.none_action_label = label;
};
    
PauseMenu.prototype.setMessage = function(message)
{
    this.message = message;
};
            
PauseMenu.prototype.draw = function()
{
    this.drawOrLayout(true);
};

PauseMenu.prototype.layout = function()
{
    this.drawOrLayout(false);
};
    
PauseMenu.prototype.drawOrLayout = function(draw)
{
    var scaling = 1;       
    var th = 20;
    var th2 = 35
    var vr = this.game.vectorRenderer;                
    var tr = this.game.textRenderer;                

    // layout depends on menu width which depends on the screen size                
    this.menuwidth = Math.min(400, this.game.screenwidth);                 
    this.menux = 10; // (this.game.screenwidth-this.menuwidth)/2;
    var bgcolor = 0xcc000000; // darken(Game.getColorForDifficulty(level.getDifficulty()));
    var col = Game.getColorForDifficulty(this.level.getDifficulty());
                
    // at first call or after size change, create word wrapped string
    if (!draw)      
    {   this.title = tr.wordWrap(this.level.getTitle(), th2, this.menuwidth-100);
        if (this.message!=null)
        {   this.info = tr.wordWrap(this.message, th, this.menuwidth-60);
        }
        else 
        {   this.info = (this.level.getHint()==null) 
                 ? []
                 : tr.wordWrap(this.level.getHint(), th, this.menuwidth-60);
        }      
    }
    // when in drawing mode, initialize renderers and create background
    else
    {   vr.startDrawing ();
        tr.startDrawing ();        
//        vr.addRectangle(this.menux,0,this.menuwidth,this.game.screenheight, bgcolor);           
        vr.addRoundedRect(this.menux,this.menuy,this.menuwidth,this.menuheight, 3,4, bgcolor);
    }
    
    // add category/difficulty icon
    if (draw)
    {   var centerx = this.menux + this.menuwidth - 60;
        var centery = this.menuy + 25;
        var ico = Game.getIconForCategory(this.level.getCategory());
        tr.addIconGlyph(ico, centerx,centery, 45, col);
    }

    var y = this.menuy + 30;  // inner border
    var x = this.menux + 30;  // inner border          
        
    // level title
    for (var i=0; this.title && i<this.title.length; i++)
    {   if (draw)
        {   tr.addString(this.title[i], x,y, th2, false, 0xffaaaaaa, TextRenderer.WEIGHT_PLAIN);
        }
        y += th2*0.8;        
    }
    y += 12;
    
    // author
    var t = this.level.getAuthor();
    if (t!=null && t.length>0)
    {   if (draw)
        {   // var x2 = tr.addString("by ", x,y, th, false, 0xffaaaaaa, TextRenderer.WEIGHT_PLAIN);
            tr.addString("by "+t, x,y, th, false, 0xffffffff, TextRenderer.WEIGHT_BOLD);
        }
        y += th;        
    }
    // info         
    y += 2*th;
    if (this.info && this.info.length>0)
    {   for (var i=0; i<this.info.length; i++)
        {   if (draw)
            {   if (this.message!=null)  // info comes from an important message: display it centered
                {   tr.addString(this.info[i], this.menux+this.menuwidth/2-tr.determineStringWidth(this.info[i],th)/2
                        ,y, th, false, 0xffaaaaaa, TextRenderer.WEIGHT_BOLD);
                }
                else    
                {   tr.addString(this.info[i], x,y, th, false, 0xffaaaaaa, TextRenderer.WEIGHT_BOLD);
                }
            }       
            y += th;                
        }
        y+=th;
    }

    var hicol = Game.getColorForDifficulty(this.level.getDifficulty());
    var locol = 0xff393939;         
    var cornerradius = 4.0;
    // the action icons
    // memorize this layout info for touch input handling
    this.iconwidth = 70;
    this.iconheight = 70;
    this.actiondx = this.iconwidth+10; 
    this.action0x = 30; // (this.menuwidth - ((this.numpriorityactions-1)*this.actiondx+this.iconwidth) )/ 2;
    this.action0y = y-this.menuy;
    // really draw
    if (draw)
    {   for (var i=0; i<this.numpriorityactions; i++)
        {   var action = this.actions[i];
            var s = PauseMenu.actionlabels[action];
            var fc = hicol;
            var bc = locol;
            if (this.selected==i)
            {
                fc = locol;
                bc = hicol;
            }
            vr.addRoundedRect(this.menux+this.action0x+this.actiondx*i, 
                this.menuy+this.action0y, this.iconwidth,this.iconheight, 
                cornerradius, cornerradius+1, bc);   
            this.drawActionIcon (tr, action, 
                this.menux+this.action0x+this.actiondx*i+this.iconwidth/6, 
                this.menuy+this.action0y+this.iconwidth/6,  
                2*this.iconwidth/3,
                2*this.iconwidth/3, 
                fc);
            if (this.selected==i)
            {   tr.addString (s,  
                    this.menux+this.action0x+this.actiondx*i+(this.iconwidth-tr.determineStringWidth(s,th))/2, 
                    this.menuy+this.action0y+this.iconheight+8, 
                    th, false, hicol, TextRenderer.WEIGHT_PLAIN);
            }
        }
    }       
    y+= this.iconheight + 50;
        
    // non-priority actions (in bottom part of menu)
    this.lowactionwidth = this.menuwidth - 60;
    this.lowactionheight = 30;
    this.lowaction0x = this.menuwidth/2 - this.lowactionwidth/2;
    this.lowaction0y = y-this.menuy;
    this.lowactiondy = this.lowactionheight+4;
        
    for (var i=this.numpriorityactions; i<this.numactions; i++)
    {   var action = this.actions[i];
        if (draw)
        {   // vr.addRectangle(menux,y-1,menuwidth,1, 0x66000000);
            var fc = hicol;
            var bc = locol;
            if (this.selected==i)
            {
                fc = locol;
                bc = hicol;
            }
            vr.addRoundedRect(this.menux+this.lowaction0x, y, this.lowactionwidth,
                this.lowactionheight, cornerradius, cornerradius+1, bc);                 
            var s = (action!=PauseMenu.MENUACTION_NONEACTION) ? PauseMenu.actionlabels[action] 
                                                              : this.none_action_label;
            
            var colonidx = s.indexOf(':');
            if (colonidx>0)  
            {   var tail = s.substring(colonidx+1);
                s = s.substring(0,colonidx);
                tr.addString
                (   tail,  
                    this.menux+this.lowaction0x+this.lowactionwidth-10,
                    y+this.lowactiondy/2-th/2, 
                    th, 
                    true, 
                    i==this.selected ? bgcolor : fc, 
                    TextRenderer.WEIGHT_PLAIN
                );            
            }             
            tr.addString
            (   s,  
                this.menux+this.lowaction0x+10,
                y+this.lowactiondy/2-th/2, 
                th, 
                false, 
                i==this.selected ? bgcolor : fc, 
                TextRenderer.WEIGHT_PLAIN
            );            
        }
        y+= this.lowactiondy;
    }
    y += 6;
        
    // memorize menu size
    this.menuheight = y - this.menuy;
    this.menuy = this.game.screenheight - 10 - this.menuheight;

    if (draw)
    {   vr.flush();
        tr.flush();
    }
};    
    
PauseMenu.prototype.drawActionIcon = function(tr, action, x, y, width, height, argb)
{
    switch (action)
    {   case PauseMenu.MENUACTION_START:
        case PauseMenu.MENUACTION_CONTINUERECORDING:
            tr.addIconGlyph(313, x,y,height, argb);
//            vr.addPlayArrow(x,y,width,height, 1, argb);
            break;
        case PauseMenu.MENUACTION_UNDO:
            tr.addIconGlyph(315, x,y,height, argb);
//            vr.addPlayArrow(x,y,width,height, -1, argb);
            break;
        case PauseMenu.MENUACTION_FORWARD:
            tr.addIconGlyph(313, x,y,height, argb);
//          vr.addForwardArrow(x,y,width,height, 1, argb);
            break;
        case PauseMenu.MENUACTION_BACKWARD:
            tr.addMirrorIconGlyph(313, x,y,height, argb);
//            vr.addForwardArrow(x,y,width,height, -1, argb);
            break;          
            
        case PauseMenu.MENUACTION_FASTFORWARD:
            tr.addIconGlyph(311, x,y,height, argb);
//            vr.addFastForwardArrow(x,y,width,height, 1,argb);
            break;

        case PauseMenu.MENUACTION_FASTBACKWARD:
            tr.addMirrorIconGlyph(311, x,y,height, argb);
//            vr.addFastForwardArrow(x,y,width,height, -1,argb);
            break;

        case PauseMenu.MENUACTION_EXIT:
        case PauseMenu.MENUACTION_EXITTOEDITOR:
        case PauseMenu.MENUACTION_EXITEDITOR:
            tr.addMirrorIconGlyph(301, x,y,height, argb);
//            vr.addCross(x,y,width,height, argb);
            break;              

        case PauseMenu.MENUACTION_LEAVEDEMO:
        case PauseMenu.MENUACTION_LEAVEREPLAY:
            tr.addIconGlyph(300, x,y,height, argb);
//            vr.addSquare(x,y,width,height,argb);
            break;

        case PauseMenu.MENUACTION_NEXTLEVEL:
            tr.addMirrorIconGlyph(300, x,y,height, argb);
//            vr.addNextLevelArrow(x,y,width,height,argb);
            break;

        case PauseMenu.MENUACTION_TESTLEVEL:
            tr.addIconGlyph(313, x,y,height, argb);
//            vr.addPlayArrow(x,y,width,height, 1, argb);
            break;              
                
        case PauseMenu.MENUACTION_DISCARDCHANGES:
            tr.addIconGlyph(302, x,y,height, argb);
//            vr.addFastForwardArrow(x,y,width,height, -1,argb);
            break;
                                
        case PauseMenu.MENUACTION_CONTINUEEDIT:
            tr.addIconGlyph(303, x,y,height, argb);
//            vr.addSquare(x,y,width,height, argb);
            break;              

//        default:
//        {   vr.startStrip();        
//            vr.addStripCorner(x+width/4,y+height/4,  argb);
//            vr.addStripCorner(x+width/4,y+(height*3)/4, argb);
//            vr.addStripCorner(x+(width*3)/4, y+height/2, argb);
//            break;
//        }
    }   
};
    
PauseMenu.prototype.drawCategoryIcon = function(vr, x, y, width, height, category, argb)
{
    vr.addRoundedRect(x,y,width,height, width/2,width/2+1, argb);       
};
    
PauseMenu.prototype.findAction = function(x, y)
{
    for (var i=0; i<this.numpriorityactions; i++)
    {   var ax = this.menux + this.action0x + i*this.actiondx;
        var ay = this.menuy + this.action0y;
        if (x>=ax && x<ax+this.iconwidth && y>=ay && y<ay+this.iconheight)
        {   return i;
        } 
    }   
    for (var i=this.numpriorityactions; i<this.numactions; i++)
    {   var ax = this.menux + this.lowaction0x;
        var ay = this.menuy + this.lowaction0y + (i-this.numpriorityactions) * this.lowactiondy;
        if (x>=ax && x<ax+this.lowactionwidth && y>=ay && y<ay+this.lowactionheight)
        {   return i;
        } 
    }   
    return -1;
};
        
PauseMenu.prototype.contrastcolor = function(argb)
{
    var r = (argb>>16)&0xff;
    var g = (argb>>8)&0xff;
    var b = (argb>>0)&0xff;
    if ((r+g+b)/3 < 0)
    {   return 0xffffffff;
    }
    else
    {   return 0xff000000;
    }   
}; 
    
    // ------ key handler ------
PauseMenu.prototype.onResize = function()
{   
    this.layout();
};
    
PauseMenu.prototype.onBackNavigation = function()
{
    if (this.navigateBackAction>=0)
    {   this.game.removeScreen();
        this.listener.menuAction(this.navigateBackAction);            
    }
};
        
PauseMenu.prototype.onKeyDown = function(code)
{   
    switch (code)
    {   case KeyEvent.KEYCODE_DPAD_UP:
        {   if (this.selected<0)
            {   this.selected=this.defaultaction;
            }
            else if (this.selected>this.numpriorityactions) 
            {   this.selected--;
            }
            else if (this.selected==this.numpriorityactions)
            {   this.selected=this.defaultaction;
            }
            break;                  
        }
        case KeyEvent.KEYCODE_DPAD_DOWN:
        {   if (this.selected<0)
            {   this.selected=this.defaultaction;
            }
            else if (this.selected<this.numpriorityactions && this.numactions>this.numpriorityactions)
            {   this.selected = this.numpriorityactions;
            }
            else if (this.selected+1<this.numactions) 
            {   this.selected++;
            }
            break;
        }
        case KeyEvent.KEYCODE_DPAD_LEFT:
        {   if (this.selected<0)
            {   this.selected=this.defaultaction;
            }
            else if (this.selected<this.numpriorityactions && this.selected>0)
            {   this.selected--;
            }
            break;
        }
        case KeyEvent.KEYCODE_DPAD_RIGHT:
        {   if (this.selected<0)
            {   this.selected=this.defaultaction;
            }
            else if (this.selected+1<this.numpriorityactions)
            {   this.selected++;
            }
            break;
        }
        case KeyEvent.KEYCODE_ENTER:
        {   if (this.selected<0)
            {   this.selected=this.defaultaction;
            }
            else if (this.actions[this.selected]!=PauseMenu.MENUACTION_NONEACTION)
            {   this.game.removeScreen();
                this.listener.menuAction(this.actions[this.selected]); 
                return;
            }
            break;
        }           
    }
    this.setDirty();
};
    
PauseMenu.prototype.onPointerDown = function(x, y)
{
    var sel = this.findAction(x,y);
    if (sel!==this.selected)
    {   this.selected = sel;
        this.setDirty();
    }
};
    
PauseMenu.prototype.onPointerUp = function()
{
    if (this.selected>=0 && this.actions[this.selected]!=PauseMenu.MENUACTION_NONEACTION)
    {   this.game.removeScreen();
        this.listener.menuAction(this.actions[this.selected]);
    }
};
    
PauseMenu.prototype.onPointerMove = function(x, y)
{
    var s = this.findAction(x,y);
    if (this.selected!=s)
    {   this.selected=-1;
    }
};
