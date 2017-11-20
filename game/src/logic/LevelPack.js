var LevelPack = function()
{
    this.name = null
    this.levels = null;
};

LevelPack.prototype.$ = function(name, json)
{   
    this.name = name;
    this.levels = [];

    for (var i=0; i<json.length; i++)
    {   this.levels.push(new Level().$(json[i]));
    }
    
    //Arrays.sort(this.levels,new Level.TitleComparator());
    //Arrays.sort(this.levels,new Level.DifficultyComparator());    
    return this;
};
        
LevelPack.prototype.toJSON = function()
{
    var p = [];
    for (var i=0; i<this.levels.length; i++)
    {   p.push( this.levels[i].toJSON() );
    }
    return p;
}
    
LevelPack.prototype.addLevel = function(level)
{
    this.levels.push(level);
};
    
LevelPack.prototype.findLevel = function(title)
{
    for (var i=0; i<this.levels.length; i++)
    {   var l = this.levels[i];
        if (l.title.equals(title))  
        {   return l;
        }
    }
    return null;
};
   
/*
   LevelPack.prototype.containsLevel = functoi(Level l)
    {
        for (int i=0; i<levels.length; i++)
        {
            if (levels[i]==l)
            {   return true;
            }
        }
        return false;           
    }
    */
    
LevelPack.prototype.numberOfLevels = function()
{
    return this.levels.length;
};

LevelPack.prototype.getLevel = function(index)
{
    return this.levels[index];
};
    
LevelPack.prototype.isWriteable = function()
{
    return this.filename;
};
    
LevelPack.prototype.getName = function()
{
    return name;    
};
