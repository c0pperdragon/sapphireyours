var LevelPack = function()
{
	this.name = null
	this.levels = null;
};

Levelpack.prototype.$ = function(name, data)
{   
    this.name = name;
    this.levels = [];

    for (int i=0; i<data.length; i++)
    {   this.levels.push(new Level(data[i]));        
    }
    
    //Arrays.sort(this.levels,new Level.TitleComparator());
    //Arrays.sort(this.levels,new Level.DifficultyComparator());    
    return this;
};
        
    public void print() 
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
