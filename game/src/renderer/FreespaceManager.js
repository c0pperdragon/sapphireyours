// allocator function
var FreespaceManager = function()
{
    this.totalarea = null;
    this.spaces = null;       // array of spaces, each is a  [x,y,w,h]
};

FreespaceManager.prototype.$ = function(width, height)
{
    this.totalarea = width*height;
    this.spaces = [ [0,0,width,height] ];
    return this;
};
        
FreespaceManager.prototype.allocateArea = function (w, h) 
{   
        var bestarea=null;
        var bestwaste=1000000000;
        
        // find a space that is big enough for the request, but will lead to smallest waste
        for (var i=0; i<this.spaces.length; i++)
        {   var test = this.spaces[i];
            if (w>test[2] || h>test[3])
            {   continue;       // does not fit
            }
            var waste = Math.min((test[2]-w)*h, (test[3]-h)*w);
            if (waste<bestwaste)
            {   bestarea = test;
                waste = bestwaste;
            }
        }
        // when nothing could be found, this is an error condition
        if (bestarea==null)
        {   console.log("Can not allocate space of size "+w+","+h);
            return [0,0,0,0];
        }
        
        // allocate the description for the newly allocated area
        var allocated = [bestarea[0],bestarea[1],w,h];
        
        // the waste is smaller when cutting along a horizontal line 
        if ((bestarea[2]-w)*h < (bestarea[3]-h)*w)
        {   // have produced some waste which will nevertheless be keept
            if (w<bestarea[2])  
            {   var wastearea = [ bestarea[0]+w, bestarea[1], bestarea[2]-w, h ];
//                System.out.println ("Produced waste area: "+area2string(wastearea));
                this.spaces.push(wastearea);
            }
            // reduce size of the best area for further use
//          System.out.print("Cut away "+h+" from top side of "+area2string(bestarea));         
            bestarea[1] += h;
            bestarea[3] -= h;
//          System.out.println(" -> "+area2string(bestarea));
        }
        // the waste is smaller when cutting along a vertical line 
        else
        {   
            // have produced some waste which will nevertheless be keep
            if (h<bestarea[3])  
            {   var wastearea = [ bestarea[0], bestarea[1]+h, w, bestarea[3]-h ];
//              System.out.println ("Produced waste area: "+area2string(wastearea));
                this.spaces.push(wastearea);
            }
            // reduce size of the best area for further use
//          System.out.print("Cut away "+w+" from left side of "+area2string(bestarea));            
            bestarea[0] += w;
            bestarea[2] -= w;       
//          System.out.println(" -> "+area2string(bestarea));
        }
                
        console.log("Allocated area:",allocated);
        return allocated;
};
/*        
    public float calculateUsage()
    {
        int unused=0;
        for (int i=0; i<spaces.size(); i++)
        {   int[] space = spaces.elementAt(i);
            unused += space[2]*space[3];
        }
        return (totalarea-unused)/(float)totalarea;
    }
    
*/


