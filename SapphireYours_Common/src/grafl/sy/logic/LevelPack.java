package grafl.sy.logic;

import grafl.util.Util;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.util.Arrays;

import org.json.JSONArray;
import org.json.JSONTokener;

public class LevelPack 
{
	public final String name;
	public final String filename;
	public Level[] levels;

	public LevelPack(String name, String filename)
	{
    	this.name = name;
		this.filename = filename;
    	this.levels = new Level[0];
	}
	
	
    public LevelPack(String name, InputStream stream, boolean sort, String filename) throws Exception
    {
    	this.name = name;
		this.filename = filename;
    	
    	String packdata = Util.readStringFromStream(stream);
    	Object o = null;
		o = new JSONTokener(packdata).nextValue();
		
		if (! (o instanceof JSONArray))
		{	throw new IOException("JSONArray expected");
		}		
			
		JSONArray a = (JSONArray) o;
		this.levels = new Level[a.length()];
		for (int i=0; i<a.length(); i++)			
		{
			this.levels[i] = new Level(a.getJSONObject(i));
		}
		
		if (sort)
		{
			Arrays.sort(this.levels,new Level.TitleComparator());
			Arrays.sort(this.levels,new Level.DifficultyComparator());
		}		
    }
    
    public void print(PrintStream stream) 
    {
		stream.println("[");
		for (int i=0; i<levels.length; i++)
		{
			levels[i].print(stream);
			if (i<levels.length-1)
			{	stream.println(",");
			}					
		}
		stream.println("]");    
    }
    
    public void addLevel(Level l)
    {
		Level[] n= new Level[levels.length + 1];
		System.arraycopy(levels,0, n,0, levels.length);
		n[n.length-1] = l;
		levels = n;
    }
	
	public Level findLevel(String title)
	{
		for (Level l:levels)
		{
			if (l.title.equals(title))	
			{	return l;
			}
		}
		return null;
	}
	
	public boolean containsLevel(Level l)
	{
		for (int i=0; i<levels.length; i++)
		{
			if (levels[i]==l)
			{	return true;
			}
		}
		return false;			
	}
	
	public int numberOfLevels()
	{
		return levels.length;
	}
	
	public boolean isWriteable()
	{
		return filename!=null;
	}
	
	public String getName()
	{
		return name;	
	}
}
