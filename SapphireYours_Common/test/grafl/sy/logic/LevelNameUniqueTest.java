package grafl.sy.logic;

import grafl.sy.game.Game;

import java.io.File;
import java.io.FileInputStream;
import java.util.Collections;
import java.util.Hashtable;
import java.util.Vector;

import org.junit.Test; 
import static org.junit.Assert.*; 

public class LevelNameUniqueTest 
{	
	@Test
	public void testUniqueNames() throws Exception
	{
		Vector<String> names = new Vector<String>();
		Hashtable<String,String> data = new Hashtable<String,String>();
		
		loadLevels(names,data, "tutorial1");
		loadLevels(names,data, "tutorial2");
		loadLevels(names,data, "tutorial3");
		loadLevels(names,data, "tutorial4");
		loadLevels(names,data, "tutorial5");
		loadLevels(names,data, "advanced1");
		loadLevels(names,data, "advanced2");
		loadLevels(names,data, "mission");
		loadLevels(names,data, "extended1");
		loadLevels(names,data, "extended2");
		loadLevels(names,data, "extended3");
		loadLevels(names,data, "extended4");
		loadLevels(names,data, "extended5");
		loadLevels(names,data, "extended6");
				
		
		Collections.sort(names);
		System.out.println("Total number of levels: "+names.size());

		for (String s:names)
		{	System.out.println(data.get(s));
		}
	}

	
	public void loadLevels(Vector<String> names, Hashtable<String,String> data, String name) throws Exception
	{
		loadLevels(names,data, new File("c:/users/reinhard/google drive/workspace/sapphireyours/res/levels/"+name+".json"));
	}
	
	public void loadLevels(Vector<String> names, Hashtable<String,String> data, File file) throws Exception
	{
		if (file.isFile())
		{	String p = file.getAbsolutePath();
			if (p.endsWith(".json"))
			{	FileInputStream is = new FileInputStream(p);
				LevelPack lp = new LevelPack(file.getName(), is, false, "unnamed");
				is.close();	
				System.out.println("pack "+file+" contains "+(lp.levels.length)+" levels");
				for (Level l:lp.levels)
				{	String name = l.getTitle();
					assertTrue("Level name must not appear twice", names.indexOf(name)<0);					
					names.addElement(name);
					data.put(name, expand(name,30)+expand(""+l.getDifficulty(),3)+expand(Game.getNameForCategory(l.getCategory()),10)+" "+l.getWidth()+","+l.getHeight()+" "+file);
				}			
			}
		}
		else if (file.isDirectory())
		{	File[] children = file.listFiles();
			for (int i=0; i<children.length; i++)
			{	loadLevels(names,data,children[i]);			
			}
		}
	}
	
	private static String expand(String s, int len)
	{
		while (s.length()<len)
		{	s = s + " ";
		}
		return s;	
	}
	
}


