"use strict";
var KeyEvent = {
    
    KEYCODE_BACK:        0x00000004,
    KEYCODE_DPAD_UP:     0x00000013,     
    KEYCODE_DPAD_DOWN:   0x00000014,
    KEYCODE_DPAD_LEFT:   0x00000015,
    KEYCODE_DPAD_RIGHT:  0x00000016,
    KEYCODE_DPAD_CENTER: 0x00000017,
    KEYCODE_CTRL_LEFT:   0x00000071,
    KEYCODE_CTRL_RIGHT:  0x00000072,
    KEYCODE_SHIFT_LEFT:  0x0000003b,
    KEYCODE_SHIFT_RIGHT: 0x0000003c,
    KEYCODE_TAB:         0x0000003d,
    KEYCODE_SPACE:       0x0000003e,
    KEYCODE_ENTER:       0x00000042,
    KEYCODE_DEL:         0x00000043,
    KEYCODE_MENU:        0x00000052,
    KEYCODE_SEARCH:      0x00000054,
    KEYCODE_DPAD2_UP:    0x00000020, 
    KEYCODE_DPAD2_DOWN:  0x00000021, 
    KEYCODE_DPAD2_LEFT:  0x00000022, 
    KEYCODE_DPAD2_RIGHT: 0x00000023, 
    KEYCODE_DPAD2_CENTER: 0x00000024,
    KEYCODE_DPAD2_BUTTON1: 0x00000025,
    KEYCODE_DPAD2_BUTTON2: 0x00000026, 

    toNumericCode: function(c)
    {   
        switch (c)         
        {   case "Esc":
            case "Escape":          { return KeyEvent.KEYCODE_BACK; }
            case "Up":
            case "ArrowUp":         { return KeyEvent.KEYCODE_DPAD_UP; }
            case "Down":
            case "ArrowDown":       { return KeyEvent.KEYCODE_DPAD_DOWN; }
            case "Left":
            case "ArrowLeft":       { return KeyEvent.KEYCODE_DPAD_LEFT; }
            case "Right":
            case "ArrowRight":      { return KeyEvent.KEYCODE_DPAD_RIGHT; }
            case "Space":           { return KeyEvent.KEYCODE_DPAD_CENTER; }
            case "Shift":
            case "ShiftLeft":       { return KeyEvent.KEYCODE_SHIFT_LEFT; }
            case "ShiftRight":      { return KeyEvent.KEYCODE_SHIFT_RIGHT; }
            case "Control":
            case "ControlLeft":     { return KeyEvent.KEYCODE_CTRL_LEFT; }
            case "ControlRight":    { return KeyEvent.KEYCODE_CTRL_RIGHT; }
            case "Enter":           { return KeyEvent.KEYCODE_ENTER; }
            case "r":
            case "KeyR":            { return KeyEvent.KEYCODE_DPAD2_UP; }
            case "f":
            case "KeyF":            { return KeyEvent.KEYCODE_DPAD2_DOWN; }
            case "d":
            case "KeyD":            { return KeyEvent.KEYCODE_DPAD2_LEFT; }
            case "g":
            case "KeyG":            { return KeyEvent.KEYCODE_DPAD2_RIGHT; }
            case "a":
            case "KeyA":            { return KeyEvent.KEYCODE_DPAD2_BUTTON1; }
            case "s":
            case "KeyS":            { return KeyEvent.KEYCODE_DPAD2_BUTTON2; }
            default:                
            {   //console.log("keycode",c);
                return KeyEvent.KeyCODE_SPACE;
            }
        }
    }
};
