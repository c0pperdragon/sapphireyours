"use strict";
var KeyEvent = {
    
    UP:     0x00001000,         
    DOWN:   0x00001001,
    LEFT:   0x00001002,
    RIGHT:  0x00001003,
    A:      0x00001004,  // confirmation (or main action)
    B:      0x00001005,  // auxiliary action
    X:      0x00001006,  // back/cancel
    Y:      0x00001007,  // switch
    
    UP2:    0x00001010,         
    DOWN2:  0x00001011,
    LEFT2:  0x00001012,
    RIGHT2: 0x00001013,
    A2:     0x00001014,
    B2:     0x00001015,
    X2:     0x00001016,
    Y2:     0x00001017,
    
    EDIT:        0x00002000,
    TEST:        0x00002001,
    SAVE:        0x00002002,

    toNumericCode: function(c)
    {   switch (c)         
        {   case "Up":
            case "ArrowUp":         { return KeyEvent.UP; }
            case "Down":
            case "ArrowDown":       { return KeyEvent.DOWN; }
            case "Left":
            case "ArrowLeft":       { return KeyEvent.LEFT; }
            case "Right":
            case "ArrowRight":      { return KeyEvent.RIGHT; }
            case "Enter":           
            case "Space":
            case "Control":
            case "ControlLeft":     { return KeyEvent.A; }
            case "Shift":
            case "ShiftLeft":       { return KeyEvent.B; }
            case "Esc":
            case "Escape":          { return KeyEvent.X; }
            case "Backspace":       { return KeyEvent.Y; }

            case "R":
            case "r":
            case "KeyR":            { return KeyEvent.UP2; }
            case "F":
            case "f":
            case "KeyF":            { return KeyEvent.DOWN2; }
            case "D":
            case "d":
            case "KeyD":            { return KeyEvent.LEFT2; }
            case "G":
            case "g":
            case "KeyG":            { return KeyEvent.RIGHT2; }
            case "A":
            case "a":
            case "KeyA":            { return KeyEvent.A2; }
            case "S":
            case "s":
            case "KeyS":            { return KeyEvent.B2; }

            case "e":               { return KeyEvent.EDIT; }
            case "t":               { return KeyEvent.TEST; }
            case "w":               { return KeyEvent.SAVE; }
            default:                
            {   console.log("unknown key ["+c+"]");
                if (c>0 && c<256) return c;
                else              return 32;  
            }
        }
    }
};
