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
var CONVEYORLEFT      = '3'.charCodeAt(0);
var CONVEYORRIGHT     = '4'.charCodeAt(0);
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
    this.filename = null;
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
    
    this.hash = null;           // a hash value (as string) for all game-relevant settings
    
    this.demos = null;          // contains the stored demos
};
    

Level.prototype.$ = function(filename,json) 
{
    // initialize with default values
    this.filename = filename;
    this.title = "";
    this.author = "";
    this.hint = "";
    this.difficulty = 2;
    this.category = 0;
    this.loot = 0;
    this.swamprate = DEFAULTSWAMPRATE;
    this.robotspeed = DEFAULTROBOTSPEED;
    this.yamyamremainders = DEFAULTYAMYAMREMAINDERS.slice();
    this.demos = [];
    this.datawidth=1;
    this.dataheight=1;
    this.mapdata = [49];
    this.players=1;
    
    // if data is given, use it for populate level
    if (json)
    {   if (json.title && json.title.constructor == String) { this.title = json.title; }
        if (json.author && json.author.constructor == String) { this.author = json.author; }
        if (json.hint && json.author.constructor == String) { this.hint = json.hint; }
        if (isInteger(json.difficulty)) { this.difficulty = Number(json.difficulty); }
        if (isInteger(json.category)) { this.category = Number(json.category); }
        if (isInteger(json.loot)) { this.loot = Number(json.loot); }    
        if (isInteger(json.swamprate)) { this.swamprate = Number(json.swamprate); }
        if (isInteger(json.robotspeed)) { this.robotspeed = Number(json.robotspeed); }
        if (json.yamyamremainders && json.yamyamremainders.constructor==String) 
        { this.yamyamremainders = parseremainders(json.yamyamremainders); }
    
        for (var i=0; Array.isArray(json.demos) && i<json.demos.length; i++) 
        {   var dj = json.demos[i];
            if (dj) this.demos.push(new Walk().$(dj));
        }
    
        if (Array.isArray(json.map))
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
    }
    
    this.makeHash();
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

Level.prototype.makeHash = function()
{
    // collect all relevant data
    var all = 
    [   this.players, 
        this.loot, 
        this.swamprate, 
        this.robotspeed, 
        this.datawidth, 
        this.dataheight 
    ]
    .concat(this.yamyamremainders)
    .concat(this.mapdata);
    
    this.hash = md5(all.join("/"));
}

Level.prototype.getHash = function()
{
    return this.hash;
}

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
    
Level.prototype.getNumberOfPlayers = function()
{
    return this.players;
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
        {   this.mapdata.splice(this.datawidth*(i+1)-1,1);
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

// toolbox functions
function isInteger(value)
{
    if (typeof(value)!="number") { return false; }
    return Math.round(value) === value;    
};

// MD5 hash function
function md5(str)
{
  var _rotateLeft = function (lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
  }

  var _addUnsigned = function (lX, lY) {
    var lX4, lY4, lX8, lY8, lResult
    lX8 = (lX & 0x80000000)
    lY8 = (lY & 0x80000000)
    lX4 = (lX & 0x40000000)
    lY4 = (lY & 0x40000000)
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8)
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8)
      }
    } else {
      return (lResult ^ lX8 ^ lY8)
    }
  }

  var _F = function (x, y, z) {
    return (x & y) | ((~x) & z)
  }
  var _G = function (x, y, z) {
    return (x & z) | (y & (~z))
  }
  var _H = function (x, y, z) {
    return (x ^ y ^ z)
  }
  var _I = function (x, y, z) {
    return (y ^ (x | (~z)))
  }

  var _FF = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_F(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _GG = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_G(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _HH = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_H(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _II = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_I(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _convertToWordArray = function (str) {
    var lWordCount
    var lMessageLength = str.length
    var lNumberOfWordsTemp1 = lMessageLength + 8
    var lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64
    var lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16
    var lWordArray = new Array(lNumberOfWords - 1)
    var lBytePosition = 0
    var lByteCount = 0
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4
      lBytePosition = (lByteCount % 4) * 8
      lWordArray[lWordCount] = (lWordArray[lWordCount] |
        ( (str.charCodeAt(lByteCount) & 0xff) << lBytePosition))
      lByteCount++
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4
    lBytePosition = (lByteCount % 4) * 8
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
    return lWordArray
  }

  var _wordToHex = function (lValue) {
    var wordToHexValue = ''
    var wordToHexValueTemp = ''
    var lByte
    var lCount

    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255
      wordToHexValueTemp = '0' + lByte.toString(16)
      wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2)
    }
    return wordToHexValue
  }

  var x = []
  var k
  var AA
  var BB
  var CC
  var DD
  var a
  var b
  var c
  var d
  var S11 = 7
  var S12 = 12
  var S13 = 17
  var S14 = 22
  var S21 = 5
  var S22 = 9
  var S23 = 14
  var S24 = 20
  var S31 = 4
  var S32 = 11
  var S33 = 16
  var S34 = 23
  var S41 = 6
  var S42 = 10
  var S43 = 15
  var S44 = 21

  x = _convertToWordArray(str)
  a = 0x67452301
  b = 0xEFCDAB89
  c = 0x98BADCFE
  d = 0x10325476

  var xl = x.length
  for (k = 0; k < xl; k += 16) {
    AA = a
    BB = b
    CC = c
    DD = d
    a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478)
    d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB)
    b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
    a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A)
    c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613)
    b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501)
    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8)
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
    c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
    b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122)
    d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193)
    c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E)
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821)
    a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562)
    d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340)
    c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51)
    b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
    a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D)
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453)
    c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
    b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
    d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6)
    c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
    b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED)
    a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
    d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
    c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9)
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)
    a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681)
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
    b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
    a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
    c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
    b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
    a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
    d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
    c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05)
    a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
    d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
    b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665)
    a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244)
    d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97)
    c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
    b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039)
    a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3)
    d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
    c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
    b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1)
    a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
    d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
    c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314)
    b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
    a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82)
    d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
    c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
    b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391)
    a = _addUnsigned(a, AA)
    b = _addUnsigned(b, BB)
    c = _addUnsigned(c, CC)
    d = _addUnsigned(d, DD)
  }

  var temp = _wordToHex(a) + _wordToHex(b) + _wordToHex(c) + _wordToHex(d)

  return temp.toLowerCase()
}
    