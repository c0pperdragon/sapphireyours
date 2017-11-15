package grafl.sy.logic;

import grafl.util.Util;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.util.Arrays;
import java.util.Comparator;
import java.util.StringTokenizer;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;

public class Level
{
	final static int DEFAULTSWAMPRATE = 30;
	
	String title;		
	String author;
	String hint;
	int difficulty;				
	int category;				 
	int players;                // number of players
	int loot;					// number of emeralds to collect
	int swamprate;              // swamp spreading speed
	
	int datawidth;
	int dataheight;
	byte[] mapdata;		        // contains datawidth*dataheight pieces
	
	Walk[] demos;               // contains the stored demos
	
	/**
	 * Create an empty level by just providing a dummy JSON string to the constructor
	 */
	public Level()
	{
		this(new ByteArrayInputStream("{ \"title\":\"untitled\" }".getBytes()));	
	}
	/** 
	 * Load a level definition from a stream.
	 * The stream must contain an utf-8 encoded JSON representation of the level.
	 * The stream object will not be closed.
	 * 	 * @param stream
	 */
	public Level(InputStream stream) 
	{
		String leveldata = Util.readStringFromStream(stream);
		JSONObject json = null;
		try {
			json = (JSONObject) (new JSONTokener(leveldata).nextValue());
		}
		catch (Exception e)	{}	
		if (json!=null)
		{	readFromJSON(json);		
		}
		else
		{	StringTokenizer t = new StringTokenizer(leveldata, "\n\r");
			String[] lines = new String[t.countTokens()];
			for (int i=0; i<lines.length; i++)
			{	lines[i] = t.nextToken();			
			}
			readFromTextLines(lines);
		}
	}
	
	public Level (JSONObject json)
	{
		readFromJSON(json);	
	}
	
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
		{	demos[i] = new Walk(l.demos[i]);
		}
	}	
	
	
	private void readFromJSON(JSONObject json)
	{
		title = json.optString("title");
		author = json.optString("author");
		hint = json.optString("hint");
		difficulty = json.optInt("difficulty",1);
		category = json.optInt("category",0);
		loot = json.optInt("loot",0);
		swamprate = json.optInt("swamprate",DEFAULTSWAMPRATE);
		demos = extractDemos(json.optJSONArray("demos"));
		
		JSONArray a = json.optJSONArray("map");
		// fallback to a 1x1 map if no mapdata is present
		if (a==null || a.length()<1)
		{	datawidth=1;
			dataheight=1;
			mapdata = new byte[]{ '1' };
			players=1;
		}
		else
		{	dataheight = Math.min(a.length(), Logic.MAPHEIGHT);
			datawidth = Math.min(determineLongestString(a), Logic.MAPWIDTH);
			mapdata = new byte[datawidth*dataheight];
			boolean foundp1=false;
			boolean foundp2=false;
			for (int y=0; y<dataheight; y++)
			{	String l = a.optString(y);
				for (int x=0; x<datawidth; x++)
				{	byte p = (byte) ((l!=null && l.length()>x) ? l.charAt(x) : '.');
					if (p==Logic.MAN1) 
					{	if (foundp1) 
						{	p=Logic.AIR;
						}
						foundp1=true;
					}
					if (p==Logic.MAN2) 
					{	if (foundp2) 
						{	p=Logic.AIR;
						}
						foundp2=true;
					}
					mapdata[x+y*datawidth] =  p;
				}
			}
			players = (foundp2) ? 2 : 1;
		}
		if (category>=7)
		{	category = 1;  // Fun
		}
	}
	
	// loading legacy level files
	private void readFromTextLines(String[] lines)
	{
		title = "";
		author = "";
		hint = "";
		difficulty = 0;
		category = 0;
		players = -1;
		loot = -1;
		swamprate = DEFAULTSWAMPRATE;
		demos = new Walk[0];
		
		for (int i=0; i<lines.length; i++)
		{	String l = lines[i];
			if (l==null || l.length()<1) 
			{	continue;
			}
			char cmd = l.charAt(0);
			l = l.substring(1).trim();
			switch (cmd)
			{	
				case 'n':	 
					title = l;
					break;
				case 'a':	 
					author = l;
					break;
				case 'i': 
					if (hint.length()==0)
					{	hint = l;
					}
					else
					{	hint = hint + " " +l;
					}	
					break;									
				case 'D':
					difficulty = Integer.parseInt(l);
					break;
				case 'C':
					category = Integer.parseInt(l);
					break;
				case 'e':
					loot = Integer.parseInt(l);
					break;
				case 's':
					swamprate = Integer.parseInt(l);
					break;  					
					
				case 'm':
				{	int sp1 = l.indexOf(' ');
					datawidth = Integer.parseInt(l.substring(0,sp1));
					dataheight = Integer.parseInt(l.substring(sp1+1));
					mapdata = new byte[datawidth*dataheight];

					boolean foundp1=false;
					for (int y=0; y<dataheight; y++)
					{	i++;
						l = lines[i];
						for (int x=0; x<datawidth; x++)
						{	byte p = (byte) ((l!=null && l.length()>x) ? l.charAt(x) : '.');
							if (p==Logic.MAN1) 
							{	if (foundp1) 
								{	p=Logic.AIR;
								}
								foundp1=true;
							}
							if (p==Logic.MAN2) 
							{	p=Logic.AIR;
							}
							if (p=='~')
							{	p=' ';							
							}
							else if (p=='"')
							{	p=']';							
							}
							mapdata[x+y*datawidth] =  p;
						}
					}
					break;
				}					

				case 'R':
					Walk w = new Walk(10000);
					w.initialize(Integer.parseInt(l));			
					Walk[] d2 = new Walk[demos.length+1];
					System.arraycopy(demos,0,d2,0,demos.length);
					demos = d2;
					demos[demos.length-1] = w;					
					break;

				case '1':	 // walkthrough title
					// demos[demos.length-1].setTitle(l);
					break;
				case '2':
					for (int j=0; j<l.length(); j++)
					{	demos[demos.length-1].recordMovement(Walk.char2move(l.charAt(j))); 
					}
					break;
					
				case 'l':	
					break;    // no support for multi-language				
				case 'E':
					break;   // no support for "emeralds destructable" feature
				case 'T':
					break;   // no support for time limit
				case 't':
					break;   // no support for turn limit
				case 'p':
					break;   // no support for push probability
				case 'd':
					break;   // no support for dispenserspeed
				case 'v': 
					break;   // no support for elevatorspeed
				case 'o':
					break;   // no support for robotspeed
				case 'w':
					break;   // no support for wheelturntime
				case 'Y':    
					break;   // no support for silentyamyam
				case 'L': 
					break;   // no support for silentlaser					
				case 'A': 
					break;   // no support for artwork					
				case 'O': 
					break;   // no support for movie set					
				case 'S': 
					break;   // no support for soundwork					
				case 'M': 
					break;   // no support for music selection					
				case 'N': 
					break;   // no support for level sequence definition					
				case 'f': 
					break;   // no support for first finisher
				case 'y': 
					break;   // no support for yamyam info
					
				case '0':	 // no support for walkthrough flags
					break;
					
				default: 
					System.out.println("Can not decode line in level file: "+l);
			}			
		}
		
		if (loot<0)
		{	loot = calculateMaximumLoot(true);		
		}
	}
	
	public String getTitle()
	{
		return title;
	}
	public void setTitle(String t)
	{
		title = t;
	}
	
	public String getAuthor()
	{
		return author;	
	}
	public void setAuthor(String a)
	{
		author = a;	
	}

	public String getHint()
	{
		return hint;
	}
	public void setHint(String h)
	{
		hint = h;
	}
	
	public int getDifficulty()
	{
		return difficulty;
	}

	public void setDifficulty(int d)
	{
		difficulty = d;
	}

	public int getCategory()
	{
		return category;
	}
	
	public void setCategory(int c)
	{
		category = c;
	}
	
	public int getSwampRate()
	{
		return swamprate;
	}
	
	public void setSwampRate(int r)
	{
		swamprate = r;
	}
	
	public int getLoot()
	{
		return loot;
	}
	
	public void setLoot(int l)
	{
		loot = l;
	}
		
	public int numberOfDemos()
	{
		return demos.length;
	}
	public Walk getDemo(int index)
	{	
		return demos[index];
	}

	public void setDemo(Walk walk)
	{
		demos = new Walk[]{ new Walk(walk) };
	}

	public int getWidth()
	{
		return datawidth;
	}
	
	public int getHeight()
	{
		return dataheight;
	}
	
	public byte getPiece(int x, int y)
	{
		return mapdata[x+y*datawidth];	
	}
	
	public int calculateMaximumLoot(boolean considerconverters)
	{
		int count0=0;
		int count1=0;
		int count2=0;
		int count3=0;
		boolean haveconverter=false;
		
		for (int i=0; i<mapdata.length; i++)
		{
			switch (mapdata[i])
			{	case Logic.ROCK:
					count0++;
					break;
				case Logic.WALLEMERALD:
				case Logic.EMERALD:
				case Logic.ROCKEMERALD:
				case Logic.SAND_FULLEMERALD:
				case Logic.BAG:
				case Logic.BOX:
				case Logic.RUBY:
					count1++;
					break;
				case Logic.SAPPHIRE:
					count2++;
					break;
				case Logic.CITRINE:
					count3++;
					break;
				case Logic.BUGLEFT:
				case Logic.BUGRIGHT:
				case Logic.BUGUP:
				case Logic.BUGDOWN:
					count1+=8;
					count2++;
					break;
				case Logic.YAMYAMLEFT:
				case Logic.YAMYAMUP:
				case Logic.YAMYAMRIGHT:
				case Logic.YAMYAMDOWN:
					count1+=1;
					break;
				case Logic.CONVERTER:
					haveconverter=true;
					break;			 
			}			
		}
		if (haveconverter && considerconverters) // when a converter is present any gem or stone could count 3
		{	return 3*(count0+count1+count2+count3);
		}
		else
		{	return count1+2*count2+3*count3;
		}
	}
	
	public boolean containsPiece(byte piece)
	{
		for (int i=0; i<mapdata.length; i++)
		{	if (mapdata[i]==piece)
			{	return true;
			}
		}
		return false;
	}
	
	public int lengthOfShortestDemo()
	{
		int shortest = 1000000;
		for (int i=0; i<demos.length; i++)
		{	int t = demos[i].getTurns();
			if (t<shortest)
			{	shortest=t;
			}
		}
		return shortest;
	}
	
	
	public int[] setPieceAndAdjustLoot(int x, int y, byte piece)
	{
		if (piece<=0)		// these pieces must not be used in level map 
		{	return null;
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
			{	return null;
			}		
		}
		// there is nothing yet in the map - new map gets size 1x1
		else if (datawidth==0 && dataheight==0)
		{	loot = loot + valueForLoot(piece);
			mapdata = new byte[]{piece};
			datawidth=1;
			dataheight=1;
			return new int[]{x,y};
		}
		// can put element in current bounds
		else if (x>=0 && y>=0 && x<datawidth && y<dataheight)
		{	
			if (mapdata[y*datawidth+x]==piece)
			{	return null;	// nothing changed
			}
			else
			{	loot = Math.max(loot - valueForLoot(mapdata[y*datawidth+x]) + valueForLoot(piece), 0);				
				mapdata[y*datawidth+x] = piece;
				return new int[]{0,0};
			} 			
		}
		// check if enlargement is possible within the given limits  
		else if (x>=Logic.MAPWIDTH || y>=Logic.MAPHEIGHT || x<datawidth-Logic.MAPWIDTH || y<dataheight-Logic.MAPHEIGHT)
		{	return null;
		}
		// must grow bounds (either x or y or both)
		else
		{
			int neww = x<0 ? datawidth-x : Math.max(datawidth,x+1);
			int newh = y<0 ? dataheight-y : Math.max(dataheight,y+1);
			byte[] m = new byte[neww*newh];
			Arrays.fill(m,Logic.AIR);
			for (int i=0; i<dataheight; i++)
			{	int targetx = x<0 ? -x : 0;
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
		{	for (int x=0; x<datawidth; x++)
			{	if (mapdata[x+y*datawidth]!=Logic.AIR)
				{	if (x<left) left=x;
				    if (x>right) right=x;
				    if (y<top) top=y;
				    if (y>bottom) bottom=y;
				}
			}
		}
		// check if nothing needs to be changed
		if (left==0 && top==0 && right==datawidth-1 && bottom==dataheight-1)
		{	return new int[]{0,0};
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
		{	ps.print("    \"author\": \"");
			ps.print(author);
			ps.println("\",");
		}
		if (hint.length()>0)
		{	ps.print("    \"hint\": \"");
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
		{	ps.print("    \"swamprate\": ");
			ps.print(swamprate);
			ps.println(",");
		}
		
		ps.println("    \"map\":");
		ps.print("    [   ");
		for (int y=0; y<dataheight; y++)
		{	ps.print("\"");
			for (int x=0; x<datawidth; x++)
			{	ps.print((char) mapdata[x+y*datawidth]);
			}
			ps.print("\"");
			if (y<dataheight-1)
			{	ps.println(",");
				ps.print("        ");
			}
			else
			{	ps.println();
			}
		}
		ps.println("    ],");
		
		ps.println("    \"demos\":");
		ps.print("    [   ");
		for (int i=0; i<demos.length; i++)
		{	demos[i].print(ps);
			if (i!=demos.length-1)
			{	ps.println(",");
				ps.print("        ");
			}
			else
			{	ps.println();
			}
		}
		ps.println("    ]");
		ps.println("}");
	}
	
	
	private static Walk[] extractDemos(JSONArray a_or_null)
	{	
		if (a_or_null==null)
		{	return new Walk[0];
		}
		Walk[] w = new Walk[a_or_null.length()];
		for (int i=0; i<w.length; i++)
		{	JSONObject o = a_or_null.optJSONObject(i);
			w[i] = (o!=null) ? new Walk(o) : new Walk(0);
		}
		return w;
	}
	
	private static int determineLongestString(JSONArray a)
	{
		int max=1;
		for (int i=0; i<a.length(); i++)
		{	String l = a.optString(i);
			if (l!=null && l.length()>max)
			{	max = l.length();
			}
		}
		return max;
	}
	
	private static int valueForLoot(byte piece)
	{
		switch (piece)
		{		case Logic.WALLEMERALD:
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
			{	n = n.substring(0,n.length()-2).concat("VIIII");
			}
			if (n.startsWith("The "))
			{	n = n.substring(4);
			}
			return n;
		} 
	}
	
	
	
}
