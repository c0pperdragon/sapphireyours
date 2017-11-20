var Walk = function()
{
    this.buffer = null;
    this.randomseed = 0;
};

Walk.MOVE_REST  = 0;
Walk.MOVE_UP    = 1;
Walk.MOVE_DOWN  = 2;
Walk.MOVE_LEFT  = 3;
Walk.MOVE_RIGHT = 4;
Walk.GRAB_UP    = 5;
Walk.GRAB_DOWN  = 6;
Walk.GRAB_LEFT  = 7;
Walk.GRAB_RIGHT = 8;
Walk.BOMB_UP    = 9;
Walk.BOMB_DOWN  = 10;
Walk.BOMB_LEFT  = 11;
Walk.BOMB_RIGHT = 12;
    
Walk.prototype.$ = function(json)
{
    this.buffer = [];
    this.randomseed = 0;

    this.initialize(Number.isInteger(json.randomseed) ? json.randomseed : 0);
    
    var a = json.moves;
    if (a && !Array.isArray(a)) a = [a];
    
    if (json.players === 2)     // having 2 moves for each turn
    {   for (var i=0; a && i<a.length; i++)
        {   var s = a[i];
            for (var j=0; s && j+1<s.length; j+=2)
            {   this.recordMovements(this.char2move(s.charCodeAt(j)), this.char2move(s.charCodeAt(j+1)));
            }
        }
    }
    else                            // only one move for each turn
    {   for (var i=0; a && i<a.length; i++)
        {   var s = a[i];
            for (var j=0; s && j<s.length; j++)
            {   this.recordMovement(this.char2move(s.charCodeAt(j)));
            }
        }
    }
    
    return this;
};
    
Walk.prototype.$2 = function(original)
{
    this.buffer = original.buffer.slice();
    this.randomseed = original.randomseed;
    return this;
};
    
Walk.prototype.toJSON = function()
{
    var hassecond = this.hasMovementsForSecondPlayer();
    var numturns = this.buffer.length;
    
    var a = [ ];
    var m = [ ];
    for (var i=0; i<numturns; i++)
    {   m.push(this.move2str(this.getMovement(0,i)));
        if (hassecond)
        {   m.push(this.move2str(this.getMovement(1,i)));
        }
        if (m.length>=40 || i===numturns-1) 
        {   a.push (m.join(""));
            m.length = 0;
        }
    }
    
    if (hassecond) 
    {   return {    randomseed: this.randomseed,
                    players:    2,
                    moves:      a                      
                };
    }
    else
    {   return {    randomseed: this.randomseed,
                    moves:      a                      
                };
    }
};
    
Walk.prototype.initialize = function(randomseed)
{
    this.randomseed = randomseed;
    this.buffer.length = 0;
};
    
Walk.prototype.getTurns = function()
{
    return this.buffer.length;
};
    
Walk.prototype.trimRecord = function(turns)
{    
    if (turns<this.buffer.length)
    {   this.buffer.length = turns;
    }
};
    
Walk.prototype.recordMovement = function(movement1)
{
    this.recordMovements(movement1, Walk.MOVE_REST);
};
    
Walk.prototype.recordMovements = function(movement1, movement2)
{
    this.buffer.push(movement1 | (movement2<<4));
};

Walk.prototype.getRandomSeed = function()
{
    return this.randomseed;
};
    
Walk.prototype.getMovement = function(player, turn)
{
    if (turn<0 || turn>=this.buffer.length)
    {   return Walk.MOVE_REST;
    }
    return (this.buffer[turn] >> (player*4)) & 0xf;
};
    
Walk.prototype.currentNumberOfCompleteTurns = function()
{
    return this.buffer.length;
};
    
Walk.prototype.hasMovementsForSecondPlayer = function()
{
    for (var i=0; i<this.buffer.length; i++)
    {   if ( ((this.buffer[i]>>4) & 0xf) != Walk.MOVE_REST)
        {   return true;
        }
    }
    return false;
};
    
Walk.prototype.char2move = function(c)
{
    switch (c)
    {   default:  return Walk.MOVE_REST;
        case 116: return Walk.MOVE_UP;      // 't'
        case 98:  return Walk.MOVE_DOWN;    // 'b'
        case 108: return Walk.MOVE_LEFT;    // 'l'
        case 114: return Walk.MOVE_RIGHT;   // 'r'
        case 84:  return Walk.GRAB_UP;      // 'T'
        case 66:  return Walk.GRAB_DOWN;    // 'B'
        case 76:  return Walk.GRAB_LEFT;     // 'L'
        case 82:  return Walk.GRAB_RIGHT;    // 'R'
        case 117: return Walk.BOMB_UP;      // 'u'
        case 99:  return Walk.BOMB_DOWN;     // 'c'
        case 109: return Walk.BOMB_LEFT;    // 'm'
        case 115: return Walk.BOMB_RIGHT;   // 's'
    }
}

Walk.prototype.move2str = function(m)
{
    return ".tblrTBLRucms".substring(m,m+1);
};

