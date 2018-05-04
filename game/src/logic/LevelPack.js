"use strict";
var LevelPack = function()
{
    this.name = null
    this.levels = null;
};

LevelPack.prototype.$ = function(name, json, sortit)
{   
    this.name = name;
    this.levels = [];

    for (var i=0; i<json.length; i++)
    {   this.levels.push(new Level().$(json[i]));
    }
    
    if (sortit)
    {   this.levels.sort( function(l1,l2) 
        {   var d = l1.getDifficulty() - l2.getDifficulty();
            if (d!==0) return d;
            if (l1.getTitle() < l2.getTitle()) return -1;
            if (l1.getTitle() > l2.getTitle()) return 1;
            return 0;
        });
    }
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
    return this.name;    
};
