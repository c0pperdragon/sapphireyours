
var Walk = function()
{
    this.buffer = null;
    this.randomseed = 0;
    this.numturns = 0;
};
Walk.prototype.constructor = Walk;

    public final static int MOVE_REST  = 0;
    public final static int MOVE_UP    = 1;
    public final static int MOVE_DOWN  = 2;
    public final static int MOVE_LEFT  = 3;
    public final static int MOVE_RIGHT = 4;
    public final static int GRAB_UP    = 5;
    public final static int GRAB_DOWN  = 6;
    public final static int GRAB_LEFT  = 7;
    public final static int GRAB_RIGHT = 8;
    public final static int BOMB_UP    = 9;
    public final static int BOMB_DOWN  = 10;
    public final static int BOMB_LEFT  = 11;
    public final static int BOMB_RIGHT = 12;
    
Walk.prototype.$ = function(JSONObject json)
    {
        this(countMovements(json.optJSONArray("moves"), json.optString("moves")) / json.optInt("players",1));  // estimate buffer size needed
        initialize(json.optInt("randomseed"));

        if (json.optInt("players",1)>1)     // having 2 moves for each turn
        {   JSONArray a = json.optJSONArray("moves");
            if (a!=null)
            {   for (int i=0; i<a.length(); i++)
                {   String s = a.optString(i);
                    for (int j=0; s!=null && j+1<s.length(); j+=2)
                    {   recordMovement(char2move(s.charAt(j)), char2move(s.charAt(j+1)));
                    }
                }
            }
            else
            {   String s = json.optString("moves");
                for (int j=0; s!=null && j+1<s.length(); j+=2)
                {   recordMovement(char2move(s.charAt(j)), char2move(s.charAt(j+1)));
                }
            }
        }
        else                            // only one move for each turn
        {   JSONArray a = json.optJSONArray("moves");
            if (a!=null)
            {   for (int i=0; i<a.length(); i++)
                {   String s = a.optString(i);
                    for (int j=0; s!=null && j<s.length(); j++)
                    {   recordMovement(char2move(s.charAt(j)));
                    }
                }
            }
            else
            {   String s = json.optString("moves");
                for (int j=0; s!=null && j<s.length(); j++)
                {   recordMovement(char2move(s.charAt(j)));
                }
            }       
        }
    }   
    
    public Walk(String walkdata) throws JSONException
    {   
        this((JSONObject) (new JSONTokener(walkdata).nextValue()));
    }
    
    public Walk(int turns_to_store)
    {
        randomseed = 0;
        numturns = 0;
        buffer = new byte[turns_to_store];
    }
    
    public Walk(Walk original)
    {
        buffer = new byte[original.buffer.length];
        System.arraycopy(original.buffer,0,buffer,0,buffer.length);
        randomseed = original.randomseed;
        numturns = original.numturns;
    }
    
    public void print(PrintStream ps)
    {
        boolean hassecond = hasMovementsForSecondPlayer();
        ps.println("{   ");
        if (hassecond)
        {   ps.println("            \"players\": 2,");
        }
        ps.print("            \"randomseed\": ");
        ps.print(randomseed);
        ps.println(",");
        
        ps.println("            \"moves\":");
        ps.print("            [   \"");
        for (int i=0; i<numturns; i++)
        {   if (i>0 && i%40==0)
            {   ps.println("\",");
                ps.print("                \"");
            }
            ps.print(move2char(getMovement(0,i)));
            if (hassecond)
            {   ps.print(move2char(getMovement(1,i)));
            }
        }
        ps.println("\"");
        ps.println("            ]");
        ps.print("        }");
    }
    
    public String toJSON()
    {
        boolean hassecond = hasMovementsForSecondPlayer();
        StringBuffer b = new StringBuffer();
        b.append("{");
        if (hassecond)
        {   b.append("\"players\":2,");
        }
        b.append("\"randomseed\":");
        b.append(randomseed);
        b.append(",");
        b.append("\"moves\":\"");
        for (int i=0; i<numturns; i++)
        {   b.append((char)move2char(getMovement(0,i)));
            if (hassecond)
            {   b.append((char)move2char(getMovement(1,i)));
            }
        }
        b.append("\"");
        b.append("}");      
        return b.toString();    
    }
    
    public void initialize(int randomseed)
    {
        this.randomseed = randomseed;
        this.numturns=0;
    }
    
    public int getTurns()
    {
        return numturns;
    }
    
    public void trimRecord(int turns)
    {
        if (turns<numturns)
        {   numturns=turns;
        }
    }
    
    public void recordMovement(int movement1)
    {
        recordMovement(movement1, MOVE_REST);
    }
    
    public void recordMovement(int movement1, int movement2)
    {
        // enlarge buffer if necessary
        if (numturns>=buffer.length)
        {   byte[] b2 = new byte[Math.max(buffer.length*2, 50)];
            System.arraycopy(buffer,0,b2,0,buffer.length);
            buffer = b2;
        }
        buffer[numturns] = (byte) ((movement2<<4) | movement1);
        numturns++;
    }

    public int getRandomSeed()
    {
        return randomseed;
    }
    
    public int getMovement(int player, int turn)
    {
        if (turn<0 || turn>=numturns)
        {   return MOVE_REST;
        }
        return (buffer[turn] >> (player*4)) & 0xf;
    }
    
    public int currentNumberOfCompleteTurns()
    {
        return numturns;
    }
    
    public boolean hasMovementsForSecondPlayer()
    {
        for (int i=0; i<numturns; i++)
        {   if ( ((buffer[i]>>4) & 0xf) != 0)
            {   return true;
            }
        }
        return false;
    }
    
//  public boolean hasNonRestMovements()
//  {
//      for (int i=0; i<numturns; i++)
//      {   if (buffer[i]!=0)
//          {   return true;
//          }
//      }
//      return false;
//  }
    
    private static int countMovements(JSONArray a, String s)
    {
        int c = (s==null) ? 0 : s.length();     
        for (int i=0; a!=null && i<a.length(); i++)
        {   c = c + a.optString(i).length();
        }       
        return c;
    }
    public static int char2move(char c)
    {
        switch (c)
        {   default:  return MOVE_REST;
            case 't': return MOVE_UP;
            case 'b': return MOVE_DOWN;
            case 'l': return MOVE_LEFT;
            case 'r': return MOVE_RIGHT;
            case 'T': return GRAB_UP;
            case 'B': return GRAB_DOWN;
            case 'L': return GRAB_LEFT;
            case 'R': return GRAB_RIGHT;
            case 'u': return BOMB_UP;
            case 'c': return BOMB_DOWN;
            case 'm': return BOMB_LEFT;
            case 's': return BOMB_RIGHT;
//          case '2': return CALL_ASSISTANT;
        }
    }
    private static char move2char(int m)
    {
        return ".tblrTBLRucms".charAt(m);
    }
}
