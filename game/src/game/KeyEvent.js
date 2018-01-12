
var KeyEvent = {
    
    KEYCODE_BACK:        0x00000004,
    KEYCODE_DPAD_UP:     0x00000013,     
    KEYCODE_DPAD_DOWN:   0x00000014,
    KEYCODE_DPAD_LEFT:   0x00000015,
    KEYCODE_DPAD_RIGHT:  0x00000016,
    KEYCODE_DPAD_CENTER: 0x00000017,
//  KEYCODE_CTRL_LEFT   = 0x00000071,
//  KEYCODE_CTRL_RIGHT  = 0x00000072,
    KEYCODE_SHIFT_LEFT:  0x0000003b,
    KEYCODE_SHIFT_RIGHT: 0x0000003c,
    KEYCODE_TAB:         0x0000003d,
    KEYCODE_SPACE:       0x0000003e,
    KEYCODE_ENTER:       0x00000042,
    KEYCODE_DEL:         0x00000043,
    KEYCODE_MENU:        0x00000052,
    KEYCODE_SEARCH:      0x00000054,
//  KEYCODE_ESCAPE      = 0x0000006f,

    toNumericCode: function(c)
    {   
        switch (c) 
        {   case "ArrowUp":         return KeyEvent.KEYCODE_DPAD_UP;
            case "ArrowDown":       return KeyEvent.KEYCODE_DPAD_DOWN;
            case "ArrowLeft":       return KeyEvent.KEYCODE_DPAD_LEFT;
            case "ArrowRight":      return KeyEvent.KEYCODE_DPAD_RIGHT;
            case "Enter":           return KeyEvent.KEYCODE_ENTER;
            default:                return KeyEvent.KeyCODE_SPACE;
        }
    }
};
