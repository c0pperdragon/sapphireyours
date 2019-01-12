"use strict";
var KeyEvent = {
    
    BACK:   0x00001006,  // back/cancel
    FORWARD:0x00001007,  // start or contect dependent

    UP:     0x00001000,         
    DOWN:   0x00001001,
    LEFT:   0x00001002,
    RIGHT:  0x00001003,
    A:      0x00001004,  // confirmation (or main action)
    B:      0x00001005,  // auxiliary action
    
    UP2:    0x00001010,         
    DOWN2:  0x00001011,
    LEFT2:  0x00001012,
    RIGHT2: 0x00001013,
    A2:     0x00001014,
    B2:     0x00001015,

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
            case "Enter":           { return KeyEvent.FORWARD; }
            case " ":    
            case "Space":           { return KeyEvent.A; }
            case "Shift":
            case "ShiftLeft":       { return KeyEvent.B; }
            case "Esc":
            case "Escape":          { return KeyEvent.BACK; }
            case "W":
            case "w":
            case "KeyW":            { return KeyEvent.UP2; }
            case "S":
            case "s":
            case "KeyS":            { return KeyEvent.DOWN2; }
            case "A":
            case "a":
            case "KeyA":            { return KeyEvent.LEFT2; }
            case "D":
            case "d":
            case "KeyD":            { return KeyEvent.RIGHT2; }
            case "Q":
            case "q":
            case "KeyQ":            { return KeyEvent.A2; }
            case "E":
            case "e":
            case "KeyE":            { return KeyEvent.B2; }

            default:                
            {   console.log("unknown key ["+c+"]");
                if (c>0 && c<256) return c;
                else              return 32;  
            }
        }
    }
};
