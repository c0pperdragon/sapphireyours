// constant values
var MAPWIDTH  = 64;
var MAPHEIGHT = 64; 
var DEFAULTSWAMPRATE = 30;
    

// pieces in static level definition
var OUTSIDE           = 0;
var MAN1              = '1'.charCodeAt(0);
var MAN2              = '2'.charCodeAt(0);
var AIR               = ' '.charCodeAt(0);
var EARTH             = '.'.charCodeAt(0);
var SAND              = 's'.charCodeAt(0);
var SAND_FULL         = 'S'.charCodeAt(0);
var SAND_FULLEMERALD  = '}'.charCodeAt(0);
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
var ROCKEMERALD       = 'e'.charCodeAt(0);
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
var LORRYLEFT         = '5'.charCodeAt(0);
var LORRYUP           = '6'.charCodeAt(0);
var LORRYRIGHT        = '7'.charCodeAt(0);
var LORRYDOWN         = '8'.charCodeAt(0);
var BUGLEFT           = 'h'.charCodeAt(0);
var BUGUP             = 'u'.charCodeAt(0);
var BUGRIGHT          = 'k'.charCodeAt(0);
var BUGDOWN           = 'j'.charCodeAt(0);
var YAMYAMLEFT        = '<'.charCodeAt(0);
var YAMYAMUP          = '^'.charCodeAt(0);
var YAMYAMRIGHT       = '>'.charCodeAt(0);
var YAMYAMDOWN        = 'V'.charCodeAt(0);
var ROBOT             = 'o'.charCodeAt(0);
var ELEVATOR_TOLEFT   = '3'.charCodeAt(0);
var ELEVATOR_TORIGHT  = '4'.charCodeAt(0);
var GUN0              = '\''.charCodeAt(0);
var GUN1              = 'C'.charCodeAt(0);
var GUN2              = 'D'.charCodeAt(0);
var GUN3              = 'F'.charCodeAt(0);


var Level = function()
{
    this.title = null;
    this.author = null;
    this.hint = null;
    this.difficulty = 0;
    this.category = 0;
    this.players = 0;                // number of players
    this.loot = 0;                   // number of emeralds to collect
    this.swamprate = 0;         // swamp spreading speed
    
    this.datawidth = 0;
    this.dataheight = 0;
    this.mapdata = null;        // contains datawidth*dataheight pieces
    
    this.demos = null;          // contains the stored demos
};
    

Level.prototype.$ = function(json) 
{
    this.title = json.title ? json.title : "";
    this.author = json.author ? json.author : "";
    this.hint = json.hint ? json.hint : "";
    this.difficulty = Number.isInteger(json.difficulty) ? Number(json.difficulty) : 1;
    this.category = Number.isInteger(json.category) ? Number(json.category) : 0;    
    this.loot = Number.isInteger(json.loot) ? Number(json.loot) : 0;    
    this.swamprate = Number.isInteger(json.swamprate) ? Number(json.swamprate) : DEFAULTSWAMPRATE;
    
    this.demos = [];
    for (var i=0; Array.isArray(json.demos) && i<json.demos.length; i++) 
    {   this.demos.push(new Walk().$(json.demos[i]));
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
            {   var p = ((l && l.length>x) ? l.charCodeAt(x) : AIR);
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
    {   o.swaprate = this.swamprate;
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
    
/*    
    public void copyFrom(Level l)
    {
        title = l.title;
        author = l.author;
        hint = l.hint;
        difficulty = l.difficulty;              
        category = l.category;               
        players = l.players;
        loot = l.loot;
        swamprate = l.swamprate;    
        datawidth = l.datawidth;
        dataheight = l.dataheight;
        mapdata = new byte[l.mapdata.length];
        System.arraycopy (l.mapdata,0,mapdata,0,mapdata.length);
        demos = new Walk[l.demos.length];
        for (int i=0; i<demos.length; i++)  
        {   demos[i] = new Walk(l.demos[i]);
        }
    }   
*/    
    
    
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
    return author;  
};

Level.prototype.setAuthor = function(a)
{
    author = a; 
};

Level.prototype.getHint = function()
{
    return hint;
};

Level.prototype.setHint = function(h)
{
    hint = h;
};
    
Level.prototype.getDifficulty = function()
{
    return difficulty;
};

Level.prototype.setDifficulty = function(d)
{
    this.difficulty = d;
};

Level.prototype.getCategory = function()
{
    return category;
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
    demos = [ new Walk().$2(walk) ];
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
    
Level.prototype.determineLongestString = function(a)
{
    var max=1;
    for (var i=0; i<a.length; i++)
    {   var l = a[i];
        if (l && l.length>max)
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
                case ROCKEMERALD:
                case SAND_FULLEMERALD:
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
                case BUGLEFT:
                case BUGRIGHT:
                case BUGUP:
                case BUGDOWN:
                    count1+=8;
                    count2++;
                    break;
                case YAMYAMLEFT:
                case YAMYAMUP:
                case YAMYAMRIGHT:
                case YAMYAMDOWN:
                    count1+=1;
                    break;
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

/*    
    public boolean containsPiece(byte piece)
    {
        for (int i=0; i<mapdata.length; i++)
        {   if (mapdata[i]==piece)
            {   return true;
            }
        }
        return false;
    }
    
    public int lengthOfShortestDemo()
    {
        int shortest = 1000000;
        for (int i=0; i<demos.length; i++)
        {   int t = demos[i].getTurns();
            if (t<shortest)
            {   shortest=t;
            }
        }
        return shortest;
    }
        
    public int[] setPieceAndAdjustLoot(int x, int y, byte piece)
    {
        if (piece<=0)       // these pieces must not be used in level map 
        {   return null;
        }
        // placing air may lead to the map shrinking
        else if (piece==Logic.AIR)
        {
            // only delete elements if indeed inside bounds and if not already air
            if (x>=0 && y>=0 && x<datawidth && y<dataheight && mapdata[y*datawidth+x]!=Logic.AIR)
            {
                loot = Math.max(loot - valueForLoot(mapdata[y*datawidth+x]), 0);
                mapdata[y*datawidth+x] = Logic.AIR;
                return shrinkwrap(); // check if it is possible to shrink the map
            }
            else
            {   return null;
            }       
        }
        // there is nothing yet in the map - new map gets size 1x1
        else if (datawidth==0 && dataheight==0)
        {   loot = loot + valueForLoot(piece);
            mapdata = new byte[]{piece};
            datawidth=1;
            dataheight=1;
            return new int[]{x,y};
        }
        // can put element in current bounds
        else if (x>=0 && y>=0 && x<datawidth && y<dataheight)
        {   
            if (mapdata[y*datawidth+x]==piece)
            {   return null;    // nothing changed
            }
            else
            {   loot = Math.max(loot - valueForLoot(mapdata[y*datawidth+x]) + valueForLoot(piece), 0);              
                mapdata[y*datawidth+x] = piece;
                return new int[]{0,0};
            }           
        }
        // check if enlargement is possible within the given limits  
        else if (x>=Logic.MAPWIDTH || y>=Logic.MAPHEIGHT || x<datawidth-Logic.MAPWIDTH || y<dataheight-Logic.MAPHEIGHT)
        {   return null;
        }
        // must grow bounds (either x or y or both)
        else
        {
            int neww = x<0 ? datawidth-x : Math.max(datawidth,x+1);
            int newh = y<0 ? dataheight-y : Math.max(dataheight,y+1);
            byte[] m = new byte[neww*newh];
            Arrays.fill(m,Logic.AIR);
            for (int i=0; i<dataheight; i++)
            {   int targetx = x<0 ? -x : 0;
                int targety = y<0 ? -y : 0; 
                System.arraycopy(mapdata,i*datawidth, m,(targety+i)*neww+targetx, datawidth);
            }
            mapdata = m;
            datawidth = neww;
            dataheight = newh;      
            
            loot = loot + valueForLoot(piece);
            mapdata[Math.max(x,0)+Math.max(y,0)*datawidth]=piece;
            return new int[]{Math.min(x,0), Math.min(y,0)};
        }
    }
    
    private int[] shrinkwrap()
    {
        // determine where in the map there are non-air pieces 
        int left=100;
        int top=100;
        int bottom=-1;
        int right=-1;
        for (int y=0; y<dataheight; y++)
        {   for (int x=0; x<datawidth; x++)
            {   if (mapdata[x+y*datawidth]!=Logic.AIR)
                {   if (x<left) left=x;
                    if (x>right) right=x;
                    if (y<top) top=y;
                    if (y>bottom) bottom=y;
                }
            }
        }
        // check if nothing needs to be changed
        if (left==0 && top==0 && right==datawidth-1 && bottom==dataheight-1)
        {   return new int[]{0,0};
        } 
        // check if nothing is left 
        if (left>right || top>bottom)
        {
            mapdata = new byte[0];
            datawidth = 0;
            dataheight = 0;     
            return new int[]{0,0};
        }
        // need to shrink the map
        else
        {
            int nw = right-left+1;
            int nh = bottom-top+1;
            byte[] m = new byte[nw*nh];
            for (int i=0; i<nh; i++)
            {
                System.arraycopy(mapdata,(top+i)*datawidth+left, m,i*nw, nw);           
            }
            mapdata = m;
            datawidth = nw;
            dataheight = nh;
            return new int[]{left,top};
        }       
    }
    
    
    public void print(PrintStream ps)
    {
        ps.print("{   ");
        ps.print("\"title\": \"");
        ps.print(title);
        ps.println("\",");
        if (author.length()>0)
        {   ps.print("    \"author\": \"");
            ps.print(author);
            ps.println("\",");
        }
        if (hint.length()>0)
        {   ps.print("    \"hint\": \"");
            ps.print(hint);
            ps.println("\",");
        }
        ps.print("    \"difficulty\": ");
        ps.print(difficulty);
        ps.println(",");
        ps.print("    \"category\": ");
        ps.print(category);
        ps.println(",");
        ps.print("    \"loot\": ");
        ps.print(loot);
        ps.println(",");
        if (swamprate!=DEFAULTSWAMPRATE)
        {   ps.print("    \"swamprate\": ");
            ps.print(swamprate);
            ps.println(",");
        }
        
        ps.println("    \"map\":");
        ps.print("    [   ");
        for (int y=0; y<dataheight; y++)
        {   ps.print("\"");
            for (int x=0; x<datawidth; x++)
            {   ps.print((char) mapdata[x+y*datawidth]);
            }
            ps.print("\"");
            if (y<dataheight-1)
            {   ps.println(",");
                ps.print("        ");
            }
            else
            {   ps.println();
            }
        }
        ps.println("    ],");
        
        ps.println("    \"demos\":");
        ps.print("    [   ");
        for (int i=0; i<demos.length; i++)
        {   demos[i].print(ps);
            if (i!=demos.length-1)
            {   ps.println(",");
                ps.print("        ");
            }
            else
            {   ps.println();
            }
        }
        ps.println("    ]");
        ps.println("}");
    }
    
    
    private static Walk[] extractDemos(JSONArray a_or_null)
    {   
        if (a_or_null==null)
        {   return new Walk[0];
        }
        Walk[] w = new Walk[a_or_null.length()];
        for (int i=0; i<w.length; i++)
        {   JSONObject o = a_or_null.optJSONObject(i);
            w[i] = (o!=null) ? new Walk(o) : new Walk(0);
        }
        return w;
    }
    
    
    private static int valueForLoot(byte piece)
    {
        switch (piece)
        {       case Logic.WALLEMERALD:
                case Logic.EMERALD:
                case Logic.ROCKEMERALD:
                case Logic.SAND_FULLEMERALD:
                case Logic.BAG:
                case Logic.BOX:
                case Logic.RUBY:
                    return 1;
                case Logic.SAPPHIRE:
                    return 2;
                case Logic.CITRINE:
                    return 3;
                case Logic.BUGLEFT:
                case Logic.BUGRIGHT:
                case Logic.BUGUP:
                case Logic.BUGDOWN:
                    return 10;
                case Logic.YAMYAMLEFT:
                case Logic.YAMYAMUP:
                case Logic.YAMYAMRIGHT:
                case Logic.YAMYAMDOWN:
                    return 1;
                default:
                    return 0;
        }
    }
        


    public static class CategoryComparator implements Comparator<Level>
    {
        public int compare(Level a, Level b)
        {
            return a.category - b.category;
        }
    }
    public static class DifficultyComparator implements Comparator<Level>
    {
        public int compare(Level a, Level b)
        {
            return a.difficulty - b.difficulty;
        }
    }
    public static class TitleComparator implements Comparator<Level>
    {
        public int compare(Level a, Level b)
        {
            return makeTitleComparable(a.getTitle()).compareTo(makeTitleComparable(b.getTitle()));
        }
        
        private static String makeTitleComparable(String n)
        {
            if (n.endsWith("IX"))
            {   n = n.substring(0,n.length()-2).concat("VIIII");
            }
            if (n.startsWith("The "))
            {   n = n.substring(4);
            }
            return n;
        } 
    }
    */
    
