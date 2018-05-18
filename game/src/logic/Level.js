"use strict";
// constant values
var MAPWIDTH  = 64;
var MAPHEIGHT = 64; 

// pieces in static level definition
var OUTSIDE           = 0;
var MAN1              = '1'.charCodeAt(0);
var MAN2              = '2'.charCodeAt(0);
var AIR               = ' '.charCodeAt(0);
var EARTH             = '.'.charCodeAt(0);
var SAND              = 's'.charCodeAt(0);
var SAND_FULL         = 'S'.charCodeAt(0);
//var SAND_FULLEMERALD  = '}'.charCodeAt(0);
var WALL              = '#'.charCodeAt(0);
var ROUNDWALL         = 'A'.charCodeAt(0);
var GLASSWALL         = ':'.charCodeAt(0);
var STONEWALL         = '+'.charCodeAt(0);
var ROUNDSTONEWALL    = '|'.charCodeAt(0);
var WALLEMERALD       = '&'.charCodeAt(0);
var EMERALD           = '*'.charCodeAt(0);
var CITRINE           = ')'.charCodeAt(0); 
var SAPPHIRE          = '$'.charCodeAt(0);
var RUBY              = '('.charCodeAt(0);    
var ROCK              = '0'.charCodeAt(0);
//var ROCKEMERALD       = 'e'.charCodeAt(0);
var BAG               = '@'.charCodeAt(0);
var BOMB              = 'Q'.charCodeAt(0);
var DOOR              = 'E'.charCodeAt(0);
var SWAMP             = '%'.charCodeAt(0);
var DROP              = '/'.charCodeAt(0);
var TIMEBOMB          = '!'.charCodeAt(0);
var ACTIVEBOMB5       = '?'.charCodeAt(0);
var TIMEBOMB10        = ']'.charCodeAt(0);
var CONVERTER         = 'c'.charCodeAt(0);
var BOX               = '['.charCodeAt(0);
var CUSHION           = '_'.charCodeAt(0);
var ELEVATOR          = '{'.charCodeAt(0);
var ELEVATOR_TOLEFT   = '3'.charCodeAt(0);
var ELEVATOR_TORIGHT  = '4'.charCodeAt(0);
//  public final static byte DISPENSER         = 'd'.charCodeAt(0);
var ACID              = 'a'.charCodeAt(0);
var KEYBLUE           = 'b'.charCodeAt(0);
var KEYRED            = 'r'.charCodeAt(0);
var KEYGREEN          = 'g'.charCodeAt(0);
var KEYYELLOW         = 'y'.charCodeAt(0);
var DOORBLUE          = 'B'.charCodeAt(0);
var DOORRED           = 'R'.charCodeAt(0);
var DOORGREEN         = 'G'.charCodeAt(0);
var DOORYELLOW        = 'Y'.charCodeAt(0);
var ONETIMEDOOR       = '='.charCodeAt(0);
var LORRYLEFT         = 'h'.charCodeAt(0);
var LORRYUP           = 'u'.charCodeAt(0);
var LORRYRIGHT        = 'k'.charCodeAt(0);
var LORRYDOWN         = 'j'.charCodeAt(0);
var BUGLEFT           = '5'.charCodeAt(0);
var BUGUP             = '6'.charCodeAt(0);
var BUGRIGHT          = '7'.charCodeAt(0);
var BUGDOWN           = '8'.charCodeAt(0);
var YAMYAM            = 'X'.charCodeAt(0);
var YAMYAMLEFT        = '<'.charCodeAt(0);
var YAMYAMUP          = '^'.charCodeAt(0);
var YAMYAMRIGHT       = '>'.charCodeAt(0);
var YAMYAMDOWN        = 'V'.charCodeAt(0);
var ROBOT             = 'o'.charCodeAt(0);
var GUN0              = '\''.charCodeAt(0);
var GUN1              = 'C'.charCodeAt(0);
var GUN2              = 'D'.charCodeAt(0);
var GUN3              = 'F'.charCodeAt(0);

var DEFAULTSWAMPRATE = 30;
var DEFAULTROBOTSPEED = 1;
var DEFAULTYAMYAMREMAINDERS = [ RUBY,RUBY,RUBY, RUBY,RUBY,RUBY, RUBY,RUBY,RUBY];

var Level = function()
{
    this.title = null;
    this.author = null;
    this.hint = null;
    this.difficulty = 0;
    this.category = 0;
    this.players = 0;                // number of players
    this.loot = 0;                   // number of emeralds to collect
    this.swamprate = 0;              // swamp spreading speed
    this.robotspeed = 0;             // probability for robot step 
    this.yamyamremainders = null;    // YamYam remainders definition
    
    this.datawidth = 0;
    this.dataheight = 0;
    this.mapdata = null;        // contains datawidth*dataheight pieces
    
    this.demos = null;          // contains the stored demos
};
    

Level.prototype.$ = function(json) 
{
    this.title = json.title && json.title.constructor == String ? json.title : "";
    this.author = json.author && json.author.constructor == String ? json.author : "";
    this.hint = json.hint && json.author.constructor == String ? json.hint : "";
    this.difficulty = Game.isInteger(json.difficulty) ? Number(json.difficulty) : 1;
    this.category = Game.isInteger(json.category) ? Number(json.category) : 0;    
    this.loot = Game.isInteger(json.loot) ? Number(json.loot) : 0;    
    this.swamprate = Game.isInteger(json.swamprate) ? Number(json.swamprate) : DEFAULTSWAMPRATE;
    this.robotspeed = Game.isInteger(json.robotspeed) ? Number(json.robotspeed) : DEFAULTROBOTSPEED;
    this.yamyamremainders = json.yamyamremainders  && json.yamyamremainders.constructor==String 
            ? parseremainders(json.yamyamremainders) : DEFAULTYAMYAMREMAINDERS;
    
    this.demos = [];
    for (var i=0; Array.isArray(json.demos) && i<json.demos.length; i++) 
    {   var dj = json.demos[i];
        if (dj) this.demos.push(new Walk().$(dj));
    }
    
    if (!Array.isArray(json.map))
    {    // fallback to a 1x1 map if no mapdata is present
        this.datawidth=1;
        this.dataheight=1;
        this.mapdata = [49];
        this.players=1;
    }
    else
    {   this.dataheight = Math.min(json.map.length, MAPHEIGHT);
        this.datawidth  = Math.min(this.determineLongestString(json.map), MAPWIDTH);
        this.mapdata = new Array(this.datawidth*this.dataheight);
        var foundp1=false;
        var foundp2=false;
        for (var y=0; y<this.dataheight; y++)
        {   var l = json.map[y];
            for (var x=0; x<this.datawidth; x++)
            {   var p = ((l && l.constructor==String && l.length>x) ? l.charCodeAt(x) : AIR);
                if (p==MAN1) 
                {   if (foundp1) 
                    {   p=AIR;
                    }
                    foundp1=true;
                }
                if (p==MAN2) 
               {    if (foundp2) 
                    {   p=AIR;
                    }
                    foundp2=true;
                }
                this.mapdata[x+y*this.datawidth] =  p;
            }
        }
        this.players = (foundp2) ? 2 : 1;
    }    
    return this;
    
    function parseremainders(str)
    {   var rem = [RUBY,RUBY,RUBY, RUBY,RUBY,RUBY, RUBY,RUBY,RUBY];
        for (var i=0; i<9 && i<str.length; i++)
        {   var c = str.charCodeAt(i);
            if (c>=30 && c<128) rem[i]=c;
        }
        return rem;
    }
};

Level.prototype.toJSON = function()
{
    var o = { title: this.title, 
              difficulty: this.difficulty,
              category: this.category,
              loot: this.loot,
              map: [],
              demos: [],
            };            
    if (this.author.length>0)
    {   o.author = this.author;
    }
    if (this.hint.length>0)
    {   o.hint = this.hint;
    }
    if (this.swamprate!=DEFAULTSWAMPRATE)
    {   o.swamprate = this.swamprate;
    }
    if (this.swamprate!=DEFAULTSWAMPRATE)
    {   o.swamprate = this.swamprate;
    }
    if (this.robotspeed!=DEFAULTROBOTSPEED)
    {   o.robotspeed = this.robotspeed;
    }
    if (this.yamyamremainders.join(" ")!=DEFAULTYAMYAMREMAINDERS.join(" "))
    {   var r = "";
        for (var i=0; i<this.yamyamremainders.length; i++)
        {   r = r + String.fromCharCode(this.yamyamremainders[i]);
        }
        o.yamyamremainders = r;
    }
    for (var y=0; y<this.dataheight; y++)
    {   var l = [];
        for (var x=0; x<this.datawidth; x++)
        {   l.push(String.fromCharCode(this.mapdata[x+y*this.datawidth]));
        }
        o.map.push(l.join(""));
    }
    for (var i=0; i<this.demos.length; i++)
    {   o.demos.push(this.demos[i].toJSON());
    }
    
    return o;
};
    
    
Level.prototype.getTitle = function()
{
    return this.title;
};

Level.prototype.setTitle = function(t)
{
    this.title = t;
};
    
Level.prototype.getAuthor = function()
{
    return this.author;  
};

Level.prototype.setAuthor = function(a)
{
    this.author = a; 
};

Level.prototype.getHint = function()
{
    return this.hint;
};

Level.prototype.setHint = function(h)
{
    this.hint = h;
};
    
Level.prototype.getDifficulty = function()
{
    return this.difficulty;
};

Level.prototype.setDifficulty = function(d)
{
    this.difficulty = d;
};

Level.prototype.getCategory = function()
{
    return this.category;
};
    
Level.prototype.setCategory = function(c)
{
    this.category = c;
};
    
Level.prototype.getSwampRate = function()
{
    return this.swamprate;
};

Level.prototype.setSwampRate = function(r)
{
    this.swamprate = r;
};

Level.prototype.getRobotSpeed = function()
{
    return this.robotspeed;
};
    
Level.prototype.setRobotSpeed = function(s)
{
    this.robotspeed = s;
};
    
Level.prototype.getLoot = function()
{
    return this.loot;
};
    
Level.prototype.setLoot = function(l)
{
    this.loot = l;
};
        
Level.prototype.numberOfDemos = function ()
{
    return this.demos.length;
};

Level.prototype.getDemo = function(index)
{   
    return this.demos[index];
};

Level.prototype.setDemo = function(walk)
{
    this.demos = [ new Walk().$original(walk) ];
};

Level.prototype.getWidth = function()
{
    return this.datawidth;
};
    
Level.prototype.getHeight = function()
{
    return this.dataheight;
};
    
Level.prototype.getPiece = function(x,y)
{
    return this.mapdata[x+y*this.datawidth];  
};

Level.prototype.setPiece = function(x,y,p)
{
    this.mapdata[x+y*this.datawidth] = p;  
};
    
Level.prototype.insertMapColumn = function(x)
{
    for (var i=this.dataheight-1; i>=0; i--)
    {   this.mapdata.splice(i*this.datawidth+x, 0, AIR);
    }
    this.datawidth++;
};
Level.prototype.insertMapRow = function(y)
{
    for (var i=0; i<this.datawidth; i++)
    {   this.mapdata.splice(y*this.datawidth, 0, AIR);
    }
    this.dataheight++;
};

Level.prototype.isMapColumnOnlyAir = function(x)
{
    if (x<0 || x>=this.datawidth) return false;
    for (var i=0; i<this.dataheight; i++)
    {   if (this.mapdata[i*this.datawidth+x]!=AIR) { return false; }
    }
    return true;
}
Level.prototype.isMapRowOnlyAir = function(y)
{
    if (y<0 || y>=this.dataheight) return false;
    for (var i=0; i<this.datawidth; i++)
    {   if (this.mapdata[y*this.datawidth+i]!=AIR) { return false; }
    }
    return true;
}

Level.prototype.shrink = function()
{
    while (this.isMapRowOnlyAir(0))
    {   this.mapdata.splice(0,this.datawidth);
        this.dataheight--;
    }
    while (this.isMapRowOnlyAir(this.getHeight()-1))
    {   this.mapdata.splice(this.datawidth*(this.dataheight-1),this.datawidth);
        this.dataheight--;
    }
    while (this.isMapColumnOnlyAir(0))
    {   for (var i=this.dataheight-1; i>=0; i--)
        {   this.mapdata.splice(this.datawidth*i,1);
        }
        this.datawidth--;
    }
    while (this.isMapColumnOnlyAir(this.getWidth()-1))
    {   for (var i=this.dataheight-1; i>=0; i--)
        {   this.mapdata.splice((this.datawidth+1)*i-1,1);
        }
        this.datawidth--;
    }    
}
    
Level.prototype.determineLongestString = function(a)
{
    var max=1;
    for (var i=0; i<a.length; i++)
    {   var l = a[i];
        if (l && l.constructor==String && l.length>max)
        {   max = l.length;
        }
    }
    return max;
};
    
    
Level.prototype.calculateMaximumLoot = function(considerconverters)
{
    var count0=0;
    var count1=0;
    var count2=0;
    var count3=0;
    var haveconverter=false;
        
    for (var i=0; i<this.mapdata.length; i++)
    {
            switch (this.mapdata[i])
            {   case ROCK:
                    count0++;
                    break;
                case WALLEMERALD:
                case EMERALD:
//                case ROCKEMERALD:
//                case SAND_FULLEMERALD:
                case BAG:
                case BOX:
                case RUBY:
                    count1++;
                    break;
                case SAPPHIRE:
                    count2++;
                    break;
                case CITRINE:
                    count3++;
                    break;
                case LORRYLEFT:
                case LORRYRIGHT:
                case LORRYUP:
                case LORRYDOWN:
                    count1+=8;
                    count2++;
                    break;
                case YAMYAM:
                case YAMYAMLEFT:
                case YAMYAMUP:
                case YAMYAMRIGHT:
                case YAMYAMDOWN:
                {   for (var j=0; j<this.yamyamremainders.length; j++)
                    switch (this.yamyamremainders[j])
                    {   case BAG:
                        case RUBY:
                        case EMERALD: { count1++; break; }
                        case SAPPHIRE: { count2++; break; }
                        case CITRINE: { count3++; break; }                        
                    }
                    break;
                }
                case CONVERTER:
                    haveconverter=true;
                    break;           
            }           
    }
    if (haveconverter && considerconverters) // when a converter is present any gem or stone could count 3
    {   return 3*(count0+count1+count2+count3);
    }
    else
    {   return count1+2*count2+3*count3;
    }
};

    