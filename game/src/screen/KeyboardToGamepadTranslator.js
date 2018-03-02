"use strict";
var KeyboardToGamepadTranslator = function()
{
    this.listener1 = null;
    this.listener2 = null;
    
    this.numpressed = 0;
    this.pressedkeys = null;
    this.switchedcontrols = false;
};

KeyboardToGamepadTranslator.prototype.$ = function(listener1,listener2)
{
    this.listener1 = listener1;
    this.listener2 = listener2;
        
    this.numpressed = 0;
    this.pressedkeys = new Array(100);
    for (var i=0; i<this.pressedkeys.length; i++) this.pressedkeys[i] = 0;
    this.switchedcontrols = false;
    
    return this;
};

    // forget any stored state and reset to start values 
KeyboardToGamepadTranslator.prototype.reset = function()
{
    this.numpressed = 0; 
};

    // key input from the computer keyboard 
KeyboardToGamepadTranslator.prototype.keyDown = function(keycode)
{
    // avoid array overflow
    if (this.numpressed>=this.pressedkeys.length)
    {   return;
    }       
    // check if key is already in list - do nothing if already pressed
    for (var i=0; i<this.numpressed; i++)
    {   if (this.pressedkeys[i]==keycode)
        {   return;
        }
    }
    // append key into list
    this.pressedkeys[this.numpressed] = keycode;
    this.numpressed++;
    
    // send change info to listeners    
    this.sendGamePadStates();
};
    
KeyboardToGamepadTranslator.prototype.keyUp = function(keycode)
{
    // remove the keycode from the list if present (otherwise no action)
    var writecursor=0;
    for (var i=0; i<this.numpressed; i++)
    {   // copy everything that does not need to be removed
        if (this.pressedkeys[i]!=keycode)
        {   this.pressedkeys[writecursor] = this.pressedkeys[i];
            writecursor++;
        } 
    }
    this.numpressed=writecursor;
        
    // send change info to listeners    
    this.sendGamePadStates();
};   
    
KeyboardToGamepadTranslator.prototype.switchControls = function(isswitched)
{
    this.switchedcontrols = isswitched;
    this.sendGamePadStates();
};
    
KeyboardToGamepadTranslator.prototype.hasSwitchedControls = function()
{
    return this.switchedcontrols;    
};
    
    
    /** Send current state of the game pads to the listeners. 
     *  Probably nothing has changed, but the listeners will check this.
     */ 
KeyboardToGamepadTranslator.prototype.sendGamePadStates = function()
{
    // check all currently pressed keys (in order of time of press) and determine
    // which game pad should do which things.
    // By overwriting the direction it makes sure that the latest direction key
    // for a device is used.
    var dir0 = GamePadInputBuffer.DIRECTION_NONE;
    var dir1 = GamePadInputBuffer.DIRECTION_NONE;
    var action1_0 = false;
    var action1_1 = false;      
    var action2_0 = false;
    var action2_1 = false;      
    for (var i=0; i<this.numpressed; i++)
    {   switch (this.pressedkeys[i])
        {   case KeyEvent.KEYCODE_DPAD_UP:
                dir0 = GamePadInputBuffer.DIRECTION_UP;
                break;
            case KeyEvent.KEYCODE_DPAD_DOWN:    
                dir0 = GamePadInputBuffer.DIRECTION_DOWN;
                break;
            case KeyEvent.KEYCODE_DPAD_LEFT:    
                dir0 = GamePadInputBuffer.DIRECTION_LEFT;
                break;
            case KeyEvent.KEYCODE_DPAD_RIGHT:   
                dir0 = GamePadInputBuffer.DIRECTION_RIGHT;
                break;
            case KeyEvent.KEYCODE_SPACE:
                dir0 = GamePadInputBuffer.DIRECTION_WAIT;
                break;              
            case KeyEvent.KEYCODE_DPAD2_UP:    
                dir1 = GamePadInputBuffer.DIRECTION_UP;
                break;
            case KeyEvent.KEYCODE_DPAD2_DOWN:    
                dir1 = GamePadInputBuffer.DIRECTION_DOWN;
                break;
            case KeyEvent.KEYCODE_DPAD2_LEFT:    
                dir1 = GamePadInputBuffer.DIRECTION_LEFT;
                break;
            case KeyEvent.KEYCODE_DPAD2_RIGHT:    
                dir1 = GamePadInputBuffer.DIRECTION_RIGHT;
                break;
            case KeyEvent.KEYCODE_CTRL_LEFT:
            case KeyEvent.KEYCODE_CTRL_RIGHT:
                action1_0 = true;
                break;
            case KeyEvent.KEYCODE_SHIFT_LEFT:
            case KeyEvent.KEYCODE_SHIFT_RIGHT:
                action2_0 = true;
                break;
            case KeyEvent.KEYCODE_DPAD2_BUTTON1:
                action2_1 = true;
                break;
            case KeyEvent.KEYCODE_DPAD2_BUTTON2:
                action1_1 = true;
                break;
        }
    }   

    // switch listeners if needed       
    var l1 = this.listener1;
    var l2 = this.listener2;
    if (this.switchedcontrols)
    {   l1 = this.listener2;
        l2 = this.listener1;
    }       
        
    // send collected state to both listeners (or to the same if only one player is present)
    l1.setAction1Button(0, action1_0);
    l1.setAction2Button(0, action2_0);
    l1.setDirection(0, dir0);
    l2.setAction1Button(1, action1_1);
    l2.setAction2Button(1, action2_1);
    l2.setDirection(1, dir1);
};   
    
/*    
KeyboardToGamepadTranslator.prototype.isKeyForSecondaryInput = function(keycode)
{
    switch (keycode)
    {   case KeyEvent.KEYCODE_R:    
        case KeyEvent.KEYCODE_F:    
        case KeyEvent.KEYCODE_D:    
        case KeyEvent.KEYCODE_G:    
        case KeyEvent.KEYCODE_S:
        case KeyEvent.KEYCODE_A:
            return true;
    }
    return false;
};
*/