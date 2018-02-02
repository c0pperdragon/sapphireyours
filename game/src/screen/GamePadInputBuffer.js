
var GamePadInputBuffer = function()
{
    this.numdirections = 0
    this.directiondevice = null;
    this.directionstack = null;
    this.numaction1buttons = 0;
    this.action1device = null;
    this.numaction2buttons = 0;
    this.action2device = null;

    this.nummoves = 0;
    this.movebuffer = null;

    this.actionmode = 0;
    this.actionmode_was_used = false;
};

GamePadInputBuffer.DIRECTION_NONE = -1;
GamePadInputBuffer.DIRECTION_UP = 0;
GamePadInputBuffer.DIRECTION_DOWN = 1;
GamePadInputBuffer.DIRECTION_LEFT = 2;
GamePadInputBuffer.DIRECTION_RIGHT = 3;
GamePadInputBuffer.DIRECTION_WAIT = 4;

GamePadInputBuffer.MODE_NORMAL = 0;
GamePadInputBuffer.MODE_GRAB = 1;
GamePadInputBuffer.MODE_BOMB = 2;

GamePadInputBuffer.inArray = function(a, len, value)
{
    for (var i=0; i<len; i++)
    {   if (a[i]===value)
        {   return true;
        }
    }
    return false;       
};
GamePadInputBuffer.removeFromArray = function(a, len, value)
{
    var writecursor=0;
    for (var i=0; i<len; i++)
    {   // copy everything that does not need to be removed
        if (a[i]!=value)
        {   a[writecursor] = a[i];
            a[writecursor] = a[i];
            writecursor++;
        }  
    }
    return writecursor;
};
    
    
GamePadInputBuffer.prototype.$=function()
{   
    this.numdirections = 0;
    this.directiondevice = [0,0,0,0,0,0,0,0,0,0];
    this.directionstack = [0,0,0,0,0,0,0,0,0,0];
    this.numaction1buttons = 0;
    this.action1device = [0,0,0,0,0,0,0,0,0,0];
    this.numaction2buttons = 0;
    this.action2device = [0,0,0,0,0,0,0,0,0,0];
    this.nummoves = 0;
    this.movebuffer = [0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0];
    this.actionmode = GamePadInputBuffer.MODE_NORMAL;
    this.actionmode_was_used = false;
    
    return this;
};

    // forget any stored state and reset to start values 
GamePadInputBuffer.prototype.reset = function()
{
    this.numdirections = 0;  
    this.numaction1buttons = 0;  
    this.numaction2buttons = 0;
    this.nummoves = 0;   
    this.actionmode = MODE_NORMAL;
};
        
    // ---------------- input from game pad devices ---------------
    
    /**
     * A press/release of the action1 button  (the "grab" action)
     */
GamePadInputBuffer.prototype.setAction1Button = function(device,pressed)
{
    // memorize previous state of the action key
    var prev = this.numaction1buttons>0; 
    
    // insert press-info for device into array if not aready present
    if (pressed)
    {   if (!GamePadInputBuffer.inArray(this.action1device,this.numaction1buttons,device))
        {   this.action1device[this.numaction1buttons++] = device;
        }
    }
    // remove occurrences of device from array if present 
    else            
    {   this.numaction1buttons = GamePadInputBuffer.removeFromArray(this.action1device,this.numaction1buttons,device);
    }
        
    // check if state of buttons has changed - must adjust action mode
    var now = this.numaction1buttons>0;
    if (now && !prev)
    {   this.actionmode = GamePadInputBuffer.MODE_GRAB; 
        this.actionmode_was_used = false;
    }
    else if (prev&&!now)
    {   if (this.actionmode==GamePadInputBuffer.MODE_GRAB && this.actionmode_was_used)
        {   this.actionmode = GamePadInputBuffer.MODE_NORMAL;
        }
    }   
};

    /**
     * A press/release of the action2 button  (the "bomb" action)
     */
GamePadInputBuffer.prototype.setAction2Button = function(device,pressed)
{
    // memorize previous state of the action key
    var prev = this.numaction2buttons>0; 
    
    // insert press-info for device into array if not already present
    if (pressed)
    {   if (!GamePadInputBuffer.inArray(this.action2device,this.numaction2buttons,device))
        {   this.action2device[this.numaction2buttons++] = device;
        }
    }
    // remove occurrences of device from array if present 
    else            
    {   this.numaction2buttons = GamePadInputBuffer.removeFromArray(this.action2device,this.numaction2buttons,device);
    }
        
    // check if state of buttons has changed - must adjust action mode
    var now = this.numaction2buttons>0;
    if (now && !prev)
    {   this.actionmode = GamePadInputBuffer.MODE_BOMB; 
        this.actionmode_was_used = false;
    }
    else if (prev&&!now)
    {   if (this.actionmode==GamePadInputBuffer.MODE_BOMB && this.actionmode_was_used)
        {   this.actionmode = GamePadInputBuffer.MODE_NORMAL;
        }
    }   
};
        
    /**
     * Change of the directional pad  (only 4 directions and the idle state are supported) 
     */
GamePadInputBuffer.prototype.setDirection = function(device, dir)
{
    // memorize previous direction state
    var prev = this.currentDirection();
    
    // add a direction info to the stack or just update an existing one 
    updatestack: 
    if (dir>=0)
    {   // check for presence
        for (var i=0; i<this.numdirections; i++)
        {   if (this.directiondevice[i]==device)
            {   // only update
                this.directionstack[i]=dir;
                break updatestack;
            }
        }
        // not found - insert now
        if (this.numdirections<this.directiondevice.length)
        {   this.directiondevice[this.numdirections] = device;
            this.directionstack[this.numdirections]=dir;
            this.numdirections++;
        }
    }   
    // need to remove a direction info from the stack
    else
    {   var writecursor=0;
        for (var i=0; i<this.numdirections; i++)
        {   // copy everything that does not need to be removed
            if (this.directiondevice[i]!=device)
            {   this.directiondevice[writecursor] = this.directiondevice[i];
                this.directionstack[writecursor] = this.directionstack[i];
                writecursor++;
            } 
        }
        this.numdirections=writecursor;
    }
        
    // if direction state was changed, do post-processing
    var curr = this.currentDirection(); 
    if (curr!=prev)     
    {   // enqueue command for new direction (but not the none-direction)
        if (curr!=GamePadInputBuffer.DIRECTION_NONE && this.nummoves<this.movebuffer.length)
        {   this.movebuffer[this.nummoves] = this.generateMovement();
            this.nummoves++;
        }
//          // after releasing a direction pad and no action button is pressed, the game reverts from grab mode 
//          if (prev!=DIRECTION_NONE && actionmode==MODE_GRAB && numaction1buttons==0)
//          {   actionmode = MODE_NORMAL;
//          }
    }                   
};           
    
    /**
     * Determine to which direction the pad (or the recently used one) is currently pointing
     */
GamePadInputBuffer.prototype.currentDirection = function()
{
    if (this.numdirections>0)
    {   return this.directionstack[this.numdirections-1];
    }
    else
    {   return GamePadInputBuffer.DIRECTION_NONE;
    }   
};
    
    /**
     * Determine the movement to do right now. This depends on the current direction and the action mode
     */
GamePadInputBuffer.prototype.generateMovement = function()
{
    var dir = this.currentDirection();
        
    if (dir>=0 && dir<=3)
    {   if (this.actionmode==GamePadInputBuffer.MODE_NORMAL)
        {   return Walk.MOVE_UP + dir;
        }
        else if (this.actionmode==GamePadInputBuffer.MODE_GRAB)
        {   this.actionmode_was_used = true;
            if (this.numaction1buttons==0)       // when action button 1 is not pressed, revert to normal mode
            {   this.actionmode = GamePadInputBuffer.MODE_NORMAL;
            }
            return Walk.GRAB_UP + dir;
        }
        else if (this.actionmode==GamePadInputBuffer.MODE_BOMB)
        {   this.actionmode_was_used = true;
            if (this.numaction2buttons==0)       // when action button 2 is not pressed, revert to normal mode
            {   this.actionmode = GamePadInputBuffer.MODE_NORMAL;
            }
            return Walk.BOMB_UP + dir;
        }
    }
    return Walk.MOVE_REST;  
};
    

    // ----------------let game retrieve movement commands  --------------
     
    /**
     * Retrieve the next command to be used for a player.
     */
GamePadInputBuffer.prototype.nextMovement = function()
{
    if (this.nummoves>0)
    {   var m = this.movebuffer[0];
        this.nummoves--;
        if (this.nummoves>0)
        {   for (var i=0; i<this.nummoves-1; i++)
            {   this.movebuffer[i] = this.movebuffer[i+1];
            }
        }
        return m;
    }
    else
    {   return this.generateMovement();
    }
};

GamePadInputBuffer.prototype.hasNextMovement = function()
{
    return this.nummoves>0 || this.currentDirection()>=0;
};

    /**
     * Get current action mode  (normal, grab, bomb) 
     */
GamePadInputBuffer.prototype.getActionMode = function()
{
    return this.actionmode;
};
