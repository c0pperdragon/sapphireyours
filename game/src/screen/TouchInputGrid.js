"use strict";
var TouchInputGrid = function()
{
    this.game = null;
    this.color = 0;
    
    this.screenscrollx = 0;
    this.screenscrolly = 0;
    this.screentilesize = 0;

    this.isDragging = false;
    this.dragpointx = 0;
    this.dragpointy = 0;
    this.current_drag_caused_grab = false;
    this.current_drag_did_move = false;

    this.playerx = 0;
    this.playery = 0;
    this.playerdropsbomb = false;
    this.positionscount = 0;        // number of positions in buffer
    this.positionx = null;
    this.positiony = null;
    this.positiontype = null;
    this.generatingmovements = false;
};
    
TouchInputGrid.TYPE_GRABAT            = 1;
TouchInputGrid.TYPE_MOVETO            = 2;
TouchInputGrid.TYPE_MOVETO_LEAVEBOMB  = 3;

TouchInputGrid.shape_grabmarker = [ -50,-50, 50,-50, -50,50, 50,50 ];
TouchInputGrid.shape_bombmarker = [ -50,0, 0,-50, 0,50, 50,0 ];


    
TouchInputGrid.prototype.$ = function(game,color)
{
    this.game = game;
    this.color = color;
    this.isDragging = false;
    this.playerx = 0;
    this.playery = 0;
    this.playerdropsbomb = false;
    this.positionscount = 0;
    this.positionx = new Array(200); for (var i=0; i<200; i++) this.positionx[i] = 0;
    this.positiony = new Array(200); for (var i=0; i<200; i++) this.positiony[i] = 0;
    this.positiontype = new Array(200); for (var i=0; i<200; i++) this.positiontype[i] = 0;
    
    return this;
};

// forget any stored state and reset to start values 
TouchInputGrid.prototype.reset = function()
{
    this.isDragging = false;
    this.playerdropsbomb = false;
    this.positionscount = 0; 
};

    //-------------------- let input handler know sufficient things about game ------------------- 
TouchInputGrid.prototype.synchronizeWithGame = function(screenscrollx, screenscrolly, screentilesize, playerposx, playerposy) 
{
    this.screenscrollx = screenscrollx;
    this.screenscrolly = screenscrolly;
    this.screentilesize = screentilesize;
                
    // force begin of trail to player position (possibly resetting the trail)
    while (this.playerx!=playerposx || this.playery!=playerposy)
    {   if (this.positionscount<1)
        {   this.playerx = playerposx;
            this.playery = playerposy;
            this.playerdropsbomb = false;
            return; 
        }
        else
        {   this.removeFirstPosition();
            this.playerdropsbomb = false;
        }               
    }       
};

TouchInputGrid.prototype.draw = function(screenwidth, screenheight) 
{   
    // quick short-cut if nothing needs to be drawn
    if (this.positionscount<1 && !this.playerdropsbomb)
    {   return;
    }               
            
    var vr = this.game.vectorRenderer;
    vr.startDrawing(screenwidth,screenheight);
        
    var color = this.color;
    var ts = this.screentilesize;
    var tsh = Math.floor(ts/2);
    var thickh = Math.floor(ts/6);
        
    // draw the path of movements as an arrow 
    // count how many movement actions are there
    var countmoves=0;
    for (var i=0; i<this.positionscount; i++)
    {   if (this.positiontype[i]!=TouchInputGrid.TYPE_GRABAT)
        {   countmoves++;
        }
    }
    // when there are indeed moves, draw the arrow
    if (countmoves>0)
    {   vr.startStrip();

        // iterate over all movement actions (ignoring the grabs)
        var partsdrawn = 0;
        var prevx = this.playerx;
        var prevy = this.playery;
        for (var i=0; i<this.positionscount; i++)
        {   // ignore grab actions
            if (this.positiontype[i]==TouchInputGrid.TYPE_GRABAT)
            {   continue;
            }       
                        
            // draw the tail of the arrow
            if (partsdrawn==0)
            {   vr.setStripCornerTransformation (this.positionx[i]-prevx,this.positiony[i]-prevy, 
                        this.screenscrollx+tsh+prevx*ts, this.screenscrolly+tsh+prevy*ts);
                vr.addStripCorner(0,-thickh, color);
                vr.addStripCorner(0, thickh, color);
            }               
            // draw a middle part of the arrow
            if (partsdrawn<countmoves-1)                
            {   // look ahead to find next move position
                var j=i+1;
                while (this.positiontype[j]==TouchInputGrid.TYPE_GRABAT && j+1<this.positionscount)
                {   j++;
                }
                    
                var px = this.positionx[i];
                var py = this.positiony[i];
                var dx1 = px-prevx;
                var dy1 = py-prevy;
                var dx2 = this.positionx[j] - px;
                var dy2 = this.positiony[j] - py;
                // a straight part  
                if (dx1==dx2 && dy1==dy2)
                {   // no need to insert additional corners
                }
                // turning back  
                else if (dx1==-dx2 && dy1==-dy2)
                {   var wx = Math.floor(ts*3/8);
                    vr.setStripCornerTransformation(dx1,dy1, this.screenscrollx+tsh+px*ts, this.screenscrolly+tsh+py*ts);
                    vr.addStripCorner(wx,-thickh,color);
                    vr.addStripCorner(wx,thickh,color);
                    vr.addStripCorner(wx,thickh,color);                             
                    vr.addStripCorner(wx,-thickh,color);
                }
                // turning to the left
                else if (dy2==-dx1 && dx2==dy1) // 
                {   vr.setStripCornerTransformation(dx1,dy1, this.screenscrollx+tsh+px*ts, this.screenscrolly+tsh+py*ts);
                    vr.addStripCorner(-thickh,-thickh,color);
                    vr.addStripCorner(thickh,thickh,color);
                }
                // turning to the right
                else 
                {   vr.setStripCornerTransformation(dx1,dy1, this.screenscrollx+tsh+px*ts, this.screenscrolly+tsh+py*ts);
                    vr.addStripCorner(thickh, -thickh, color);
                    vr.addStripCorner(-thickh, thickh, color);
                }
            }
            // draw the point of the arrow
            else
            {           
                var px = this.positionx[i];
                var py = this.positiony[i];
                var headthickh = Math.floor(ts*4/10);
                var headpointx = Math.floor(ts*3/8);
                vr.setStripCornerTransformation(px-prevx,py-prevy, this.screenscrollx+tsh+px*ts,this.screenscrolly+tsh+py*ts);            
                vr.addStripCorner(headpointx-headthickh,-thickh,color);
                vr.addStripCorner(headpointx-headthickh,+thickh,color);
                vr.addStripCorner(headpointx,0,color);
                vr.addStripCorner(headpointx-headthickh,headthickh,color);
                vr.addStripCorner(headpointx-headthickh,headthickh,color);
                vr.addStripCorner(headpointx-headthickh,-headthickh,color);
                vr.addStripCorner(headpointx-headthickh,-thickh,color);
                vr.addStripCorner(headpointx-headthickh,-headthickh,color);
                vr.addStripCorner(headpointx,0,color);
            }               
            // memorize drawn point to calculate the connection to the next
            partsdrawn++; 
            prevx = this.positionx[i];
            prevy = this.positiony[i];
        }
    }       
        
    // paint overlays for grab actions
    var prevx=this.playerx;
    var prevy=this.playery;
    for (var i=0; i<this.positionscount; i++)
    {   switch (this.positiontype[i])
        {   case TouchInputGrid.TYPE_GRABAT:
                vr.addShape(this.screenscrollx+tsh+this.positionx[i]*ts, this.screenscrolly+tsh+this.   positiony[i]*ts, TouchInputGrid.shape_grabmarker, ts, color);
            break;
            case TouchInputGrid.TYPE_MOVETO:
                prevx = this.positionx[i];
                prevy = this.positiony[i];
            break;
            case TouchInputGrid.TYPE_MOVETO_LEAVEBOMB:
                vr.addShape(this.screenscrollx+tsh+prevx*ts, this.screenscrolly+tsh+prevy*ts, 
                            TouchInputGrid.shape_bombmarker, ts, color);           
                prevx = this.positionx[i];
                prevy = this.positiony[i];   
                break;
        }
    }
    if (this.playerdropsbomb)
    {   vr.addShape(this.screenscrollx+tsh+prevx*ts, this.screenscrolly+tsh+prevy*ts, 
                TouchInputGrid.shape_bombmarker, ts, color);           
    }       
        
    // add shine below finger while dragging
    if (this.isDragging)
    {   var r = 50;
        vr.addRoundedRect(this.screenscrollx+this.dragpointx-r, 
                          this.screenscrolly+this.dragpointy-r, 2*r,2*r, r,r+1.0, 0x44ffffff);
    }
        
    vr.flush();
};
    
   
TouchInputGrid.prototype.isTouchInProgress = function()
{
    return this.isDragging;
};
        
TouchInputGrid.prototype.hasDestination = function()
{
    return (this.positionscount>1) || this.generatingmovements;
};
    
TouchInputGrid.prototype.getDestinationX = function()
{
    for (var i=this.positionscount-1; i>=0; i--)
    {   if (this.positiontype[i]!=TouchInputGrid.TYPE_GRABAT) 
        {   return this.positionx[i];
        }
    }
    return this.playerx; 
};

TouchInputGrid.prototype.getDestinationY = function()
{
    for (var i=this.positionscount-1; i>=0; i--)
    {   if (this.positiontype[i]!=TouchInputGrid.TYPE_GRABAT) 
        {   return this.positiony[i];
        }
    }
    return this.playery; 
};
    
    
    /**
     * Retrieve the next command to be used for a player.
     */
TouchInputGrid.prototype.nextMovement = function()
{   
    // do the move actions from the trail  
    if (this.hasNextMovement())
    {   // check if there are grab-actions at the begin of the trail - consume directly
        if (this.positiontype[0]==TouchInputGrid.TYPE_GRABAT)
        {   var dx = this.positionx[0]-this.playerx;
            var dy = this.positiony[0]-this.playery;
            this.removeFirstPosition();  
            if (dx==0 && dy==-1)
            {   return Walk.GRAB_UP;
            }
            else if (dx==0 && dy==1)
            {   return Walk.GRAB_DOWN;
            }
            else if (dx==-1 && dy==0)
            {   return Walk.GRAB_LEFT;
            }
            else if (dx==1 && dy==0)
            {   return Walk.GRAB_RIGHT;
            }               
        }
        else if (this.positionscount>0)
        {   var dx = this.positionx[0]-this.playerx;
            var dy = this.positiony[0]-this.playery;
            var dropbomb = this.positiontype[0]==TouchInputGrid.TYPE_MOVETO_LEAVEBOMB;          
            this.removeFirstPosition();                  
            if (dx==0 && dy==-1)
            {   return dropbomb ? Walk.BOMB_UP : Walk.MOVE_UP;
            }
            else if (dx==0 && dy==1)
            {   return dropbomb ? Walk.BOMB_DOWN : Walk.MOVE_DOWN;
            }
            else if (dx==-1 && dy==0)
            {   return dropbomb ? Walk.BOMB_LEFT : Walk.MOVE_LEFT;
            }
            else if (dx==1 && dy==0)
            {   return dropbomb ? Walk.BOMB_RIGHT : Walk.MOVE_RIGHT;
            }               
        }       
    }                
    return Walk.MOVE_REST;
};
    
TouchInputGrid.prototype.hasNextMovement = function()
{
    if (this.positionscount<=0)
    {   this.generatingmovements=false;
    }
    else if (this.positionscount>4)
    {   this.generatingmovements=true;
    }
    return this.generatingmovements;
};
        
TouchInputGrid.prototype.removeFirstPosition = function()
{
    if (this.positiontype[0]!=TouchInputGrid.TYPE_GRABAT)
    {   this.playerx = this.positionx[0];
        this.playery = this.positiony[0];
    }
    this.positionscount--;
    for (var i=0; i<this.positionscount; i++)
    {   this.positionx[i] = this.positionx[i+1];
        this.positiony[i] = this.positiony[i+1];
        this.positiontype[i] = this.positiontype[i+1];
    }
}
    
    // ------------------- handle touch input commands ------------
TouchInputGrid.prototype.onPointerDown = function(x, y, firstpass)
{
    if (this.isDragging)   // already have a pointer in possession       
    {   return false;
    }

    this.dragpointx = (x - this.screenscrollx);
    this.dragpointy = (y - this.screenscrolly);
    var targetx = Math.floor(this.dragpointx / this.screentilesize);
    var targety = Math.floor(this.dragpointy / this.screentilesize);

    // determine the end of the current position chain (ignoring the grabs)
    var endx = this.playerx;
    var endy = this.playery;
    for (var i=this.positionscount-1; i>=0; i--)
    {   if (this.positiontype[i]!=TouchInputGrid.TYPE_GRABAT)
        {   endx = this.positionx[i];
            endy = this.positiony[i];
            break;
        }
    }
        
    // 1. case: extend the existing path at the end (leaving everything else in place)
    if (targetx==endx && targety==endy)
    {   this.isDragging = true;
        this.current_drag_caused_grab = false;
        this.current_drag_did_move = false;
        return true;
    }
    // 1. case: extend the existing path from the middle
    for (var i=this.positionscount-1; i>=0; i--)
    {   if (targetx==this.positionx[i] && targety==this.positiony[i] && positiontype[i]!=TouchInputGrid.TYPE_GRABAT)
        {   this.positionscount = i+1;
            this.isDragging = true;
            this.current_drag_caused_grab = false;
            this.current_drag_did_move = false;
            return true;
        }
    }
    // 2. case: begin a new path at the player position
    if (targetx==this.playerx && targety==this.playery)
    {   this.positionscount = 0;
        this.isDragging = true;
        this.current_drag_caused_grab = false;
        this.current_drag_did_move = false;
        return true;
    }
                                    
    // 3. case: insert a grab action next to the end of the trail       
    if (Math.abs(targetx-endx)+Math.abs(targety-endy)==1 && this.positionscount<this.positionx.length)
    {   this.positiontype[this.positionscount] = TouchInputGrid.TYPE_GRABAT;
        this.positionx[this.positionscount] = targetx;
        this.positiony[this.positionscount] = targety;
        this.positionscount++;
        this.isDragging = true;
        this.current_drag_caused_grab = true;
        this.current_drag_did_move = true;
        return true;
    }
                        
    // when this was just the first call, do not consume the event yet - let the other player also get a chance     
    if (firstpass)
    {   return false;
    }
        
    return false;
};
    
TouchInputGrid.prototype.onPointerUp = function()
{
    if (this.isDragging)
    {   this.isDragging = false;
        this.generatingmovements = true;
                        
        if (!this.current_drag_did_move)
        {   this.playerdropsbomb = !this.playerdropsbomb;
        }       

        return;
    }
    return;
};
    
TouchInputGrid.prototype.onPointerMove = function(x,y)
{
    if ( (!this.isDragging))
    {   return;
    }
        
    this.dragpointx = (x - this.screenscrollx);
    this.dragpointy = (y - this.screenscrolly);
    var targetx = Math.floor(this.dragpointx / this.screentilesize);
    var targety = Math.floor(this.dragpointy / this.screentilesize);

    // suppress drawing the path if still touching the grab action 
    if (this.current_drag_caused_grab && this.positionscount>0 
        && this.positionx[this.positionscount-1]==targetx 
        && this.positiony[this.positionscount-1]==targety 
        && this.positiontype[this.positionscount-1]==TouchInputGrid.TYPE_GRABAT
    )
    {   return;
    }

    // determine the end of the current position chain (ignoring the grabs)
    var endx = this.playerx;
    var endy = this.playery;
    for (var i=this.positionscount-1; i>=0; i--)
    {   if (this.positiontype[i]!=TouchInputGrid.TYPE_GRABAT)
        {   endx = this.positionx[i];
            endy = this.positiony[i];
            break;
        }
    }
        
    // move through raster from last point to current target    
    while (targetx!=endx || targety!=endy)
    {   var dx = targetx-endx;
        var dy = targety-endy;
        if (Math.abs(dx) >= Math.abs(dy))
        {   endx += (dx>0) ? 1 : -1;
        }
        else 
        {   endy += (dy>0) ? 1 : -1;
        }
        // try to extend the line
        if (this.positionscount<this.positionx.length)
        {   this.positionx[this.positionscount] = endx;
            this.positiony[this.positionscount] = endy;
            this.positiontype[this.positionscount] = this.playerdropsbomb ? TouchInputGrid.TYPE_MOVETO_LEAVEBOMB : TouchInputGrid.TYPE_MOVETO;
            this.positionscount++;
            this.playerdropsbomb = false;
        }
        this.current_drag_did_move = true;
    }
    return;
};