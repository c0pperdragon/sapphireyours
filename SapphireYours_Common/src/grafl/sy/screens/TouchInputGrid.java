package grafl.sy.screens;

import grafl.sy.game.Game;
import grafl.sy.logic.Walk;
import grafl.sy.renderer.VectorRenderer;

public class TouchInputGrid
{
	final static int TYPE_GRABAT            = 1;
	final static int TYPE_MOVETO            = 2;
	final static int TYPE_MOVETO_LEAVEBOMB  = 3;

	final static int[] shape_grabmarker = { -50,-50, 50,-50, -50,50, 50,50 };
	final static int[] shape_bombmarker = { -50,0, 0,-50, 0,50, 50,0 };


	Game game;
	int color;
	
	int screenscrollx;
	int screenscrolly;
	int screentilesize;

	private boolean isDragging;	
	private int dragpointx;
	private int dragpointy;
	private boolean current_drag_caused_grab;
	private boolean current_drag_did_move;

	private int playerx;
	private int playery;
	private boolean playerdropsbomb;
	private int positionscount;		// number of positions in buffer
	private int positionx[];
	private int positiony[];
	private int positiontype[];
	private boolean generatingmovements;

	public TouchInputGrid(Game game, int color)
	{
		this.game = game;
		this.color = color;
		isDragging = false;
		playerx = 0;
		playery = 0;
		playerdropsbomb = false;
		positionscount = 0;
		positionx = new int[200];
		positiony = new int[200];
		positiontype = new int[200];
	}

	// forget any stored state and reset to start values 
	public void reset()
	{
		isDragging = false;
		playerdropsbomb = false;
		positionscount = 0;	
	}

	//-------------------- let input handler know sufficient things about game ------------------- 
	public void synchronizeWithGame(int screenscrollx, int screenscrolly, int screentilesize, int playerposx, int playerposy) 
	{
		this.screenscrollx = screenscrollx;
		this.screenscrolly = screenscrolly;
		this.screentilesize = screentilesize;
				
		// force begin of trail to player position (possibly resetting the trail)
		while (playerx!=playerposx || playery!=playerposy)
		{	if (positionscount<1)
			{	playerx = playerposx;
				playery = playerposy;
				playerdropsbomb = false;
				return;	
			}
			else
			{	removeFirstPosition();
				playerdropsbomb = false;
			}				
		}		
	}

	public void draw(int screenwidth, int screenheight)	
	{	
		// quick short-cut if nothing needs to be drawn
		if (positionscount<1 && !playerdropsbomb)
        {	return;
        }	        	
        	
    	VectorRenderer vr = game.vectorRenderer;
    	vr.startDrawing(screenwidth,screenheight);
    	
		int ts = screentilesize;
		int tsh = ts/2;
		int thickh = ts/6;
		
		// draw the path of movements as an arrow 
		// count how many movement actions are there
		int countmoves=0;
		for (int i=0; i<positionscount; i++)
		{	if (positiontype[i]!=TYPE_GRABAT)
			{	countmoves++;
			}
		}
		// when there are indeed moves, draw the arrow
		if (countmoves>0)
		{	vr.startStrip();

			// iterate over all movement actions (ignoring the grabs)
			int partsdrawn = 0;
			int prevx = playerx;
			int prevy = playery;
			for (int i=0; i<positionscount; i++)
			{	// ignore grab actions
				if (positiontype[i]==TYPE_GRABAT)
				{	continue;
				}		
						
				// draw the tail of the arrow
				if (partsdrawn==0)
				{	vr.setStripCornerTransformation (positionx[i]-prevx,positiony[i]-prevy, screenscrollx+tsh+prevx*ts, screenscrolly+tsh+prevy*ts);
					vr.addStripCorner(0,-thickh, color);
					vr.addStripCorner(0, thickh, color);
				}				
				// draw a middle part of the arrow
				if (partsdrawn<countmoves-1)				
				{	// look ahead to find next move position
					int j=i+1;
					while (positiontype[j]==TYPE_GRABAT && j+1<positionscount)
					{	j++;
					}
					
					int px = positionx[i];
					int py = positiony[i];
					int dx1 = px-prevx;
					int dy1 = py-prevy;
					int dx2 = positionx[j] - px;
					int dy2 = positiony[j] - py;
					// a straight part  
					if (dx1==dx2 && dy1==dy2)
					{	// no need to insert additional corners
					}
					// turning back  
					else if (dx1==-dx2 && dy1==-dy2)
					{	int wx = ts*3/8;
						vr.setStripCornerTransformation(dx1,dy1, screenscrollx+tsh+px*ts, screenscrolly+tsh+py*ts);
						vr.addStripCorner(wx,-thickh,color);
						vr.addStripCorner(wx,thickh,color);
						vr.addStripCorner(wx,thickh,color);								
						vr.addStripCorner(wx,-thickh,color);
					}
					// turning to the left
					else if (dy2==-dx1 && dx2==dy1) // 
					{	vr.setStripCornerTransformation(dx1,dy1, screenscrollx+tsh+px*ts, screenscrolly+tsh+py*ts);
						vr.addStripCorner(-thickh,-thickh,color);
						vr.addStripCorner(thickh,thickh,color);
					}
					// turning to the right
					else 
					{	vr.setStripCornerTransformation(dx1,dy1, screenscrollx+tsh+px*ts, screenscrolly+tsh+py*ts);
						vr.addStripCorner(thickh, -thickh, color);
						vr.addStripCorner(-thickh, thickh, color);
					}
				}
				// draw the point of the arrow
				else
				{			
					int px = positionx[i];
					int py = positiony[i];
					int headthickh = ts*4/10;
					int headpointx = ts*3/8;
					vr.setStripCornerTransformation(px-prevx,py-prevy, screenscrollx+tsh+px*ts,screenscrolly+tsh+py*ts); 			
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
				prevx = positionx[i];
				prevy = positiony[i];
			}
		}		
		
		// paint overlays for grab actions
		int prevx=playerx;
		int prevy=playery;
		for (int i=0; i<positionscount; i++)
		{	switch (positiontype[i])
			{	case TYPE_GRABAT:
					vr.addShape(screenscrollx+tsh+positionx[i]*ts, screenscrolly+tsh+positiony[i]*ts, shape_grabmarker, ts, color);
					break;
				case TYPE_MOVETO:
					prevx = positionx[i];
					prevy = positiony[i];
					break;
				case TYPE_MOVETO_LEAVEBOMB:
					vr.addShape(screenscrollx+tsh+prevx*ts, screenscrolly+tsh+prevy*ts, shape_bombmarker, ts, color);			
					prevx = positionx[i];
					prevy = positiony[i];	
					break;
			}
		}
		if (playerdropsbomb)
		{	vr.addShape(screenscrollx+tsh+prevx*ts, screenscrolly+tsh+prevy*ts, shape_bombmarker, ts, color);			
		}		
    	
    	// add shine below finger while dragging
    	if (isDragging)
    	{	float r = 50*game.detailScale;
    		vr.addRoundedRect(screenscrollx+dragpointx-r, screenscrolly+dragpointy-r, 2*r,2*r, r,r+1.0f, 0x44ffffff);
    		// vr.addCircle(screenscrollx+dragpointx, screenscrolly+dragpointy, (int)(50*game.detailScale), 0x44ffffff);
    	}
    	
    	vr.flush();
	}
	
	
	public boolean isTouchInProgress()
	{
		return isDragging;
	}
		
	public boolean hasDestination()
	{
		return (positionscount>1) || generatingmovements;
	}
	
	public int getDestinationX()
	{
		for (int i=positionscount-1; i>=0; i--)
		{	if (positiontype[i]!=TYPE_GRABAT) 
			{	return positionx[i];
			}
		}
		return playerx;	
	}
	public int getDestinationY()
	{
		for (int i=positionscount-1; i>=0; i--)
		{	if (positiontype[i]!=TYPE_GRABAT) 
			{	return positiony[i];
			}
		}
		return playery;	
	}
	
	
	/**
	 * Retrieve the next command to be used for a player.
	 */
	public int nextMovement()
	{	
		// do the move actions from the trail  
		if (hasNextMovement())
		{	// check if there are grab-actions at the begin of the trail - consume directly
			if (positiontype[0]==TYPE_GRABAT)
			{	int dx = positionx[0]-playerx;
				int dy = positiony[0]-playery;
				removeFirstPosition();	
				if (dx==0 && dy==-1)
				{	return Walk.GRAB_UP;
				}
				else if (dx==0 && dy==1)
				{	return Walk.GRAB_DOWN;
				}
				else if (dx==-1 && dy==0)
				{	return Walk.GRAB_LEFT;
				}
				else if (dx==1 && dy==0)
				{	return Walk.GRAB_RIGHT;
				}				
			}
			else if (positionscount>0)
			{	int dx = positionx[0]-playerx;
				int dy = positiony[0]-playery;
				boolean dropbomb = positiontype[0]==TYPE_MOVETO_LEAVEBOMB;			
				removeFirstPosition();					
				if (dx==0 && dy==-1)
				{	return dropbomb ? Walk.BOMB_UP : Walk.MOVE_UP;
				}
				else if (dx==0 && dy==1)
				{	return dropbomb ? Walk.BOMB_DOWN : Walk.MOVE_DOWN;
				}
				else if (dx==-1 && dy==0)
				{	return dropbomb ? Walk.BOMB_LEFT : Walk.MOVE_LEFT;
				}
				else if (dx==1 && dy==0)
				{	return dropbomb ? Walk.BOMB_RIGHT : Walk.MOVE_RIGHT;
				}				
			}		
		}
				
		return Walk.MOVE_REST;
	}
	
	public boolean hasNextMovement()
	{
		if (positionscount<=0)
		{	generatingmovements=false;
		}
		else if (positionscount>4)
		{	generatingmovements=true;
		}
		return generatingmovements;
	}
		
	private void removeFirstPosition()
	{
		if (positiontype[0]!=TYPE_GRABAT)
		{	playerx = positionx[0];
			playery = positiony[0];
		}
		positionscount--;
		System.arraycopy (positionx,1,positionx,0, positionscount);
		System.arraycopy (positiony,1,positiony,0, positionscount);	
		System.arraycopy (positiontype,1,positiontype,0, positionscount);	
	}
		
	
	// ------------------- handle touch input commands ------------
	public boolean onPointerDown(int x, int y, boolean firstpass)
	{
		if (isDragging)   // already have a pointer in possession		
		{	return false;
		}

		dragpointx = (x - screenscrollx);
		dragpointy = (y - screenscrolly);
		int targetx = dragpointx / screentilesize;
		int targety = dragpointy / screentilesize;

		// determine the end of the current position chain (ignoring the grabs)
		int endx = playerx;
		int endy = playery;
		for (int i=positionscount-1; i>=0; i--)
		{	if (positiontype[i]!=TYPE_GRABAT)
			{	endx = positionx[i];
				endy = positiony[i];
				break;
			}
		}
		
		// 1. case: extend the existing path at the end (leaving everything else in place)
		if (targetx==endx && targety==endy)
		{	isDragging = true;
			current_drag_caused_grab = false;
			current_drag_did_move = false;
			return true;
		}
		// 1. case: extend the existing path from the middle
		for (int i=positionscount-1; i>=0; i--)
		{	if (targetx==positionx[i] && targety==positiony[i] && positiontype[i]!=TYPE_GRABAT)
			{	positionscount = i+1;
				isDragging = true;
				current_drag_caused_grab = false;
				current_drag_did_move = false;
				return true;
			}
		}
		// 2. case: begin a new path at the player position
		if (targetx==playerx && targety==playery)
		{	positionscount = 0;
			isDragging = true;
			current_drag_caused_grab = false;
			current_drag_did_move = false;
			return true;
		}
									
		// 3. case: insert a grab action next to the end of the trail		
		if (Math.abs(targetx-endx)+Math.abs(targety-endy)==1 && positionscount<positionx.length)
		{	positiontype[positionscount] = TYPE_GRABAT;
			positionx[positionscount] = targetx;
			positiony[positionscount] = targety;
			positionscount++;
			isDragging = true;
			current_drag_caused_grab = true;
			current_drag_did_move = true;
			return true;
		}
						
		// when this was just the first call, do not consume the event yet - let the other player also get a chance		
		if (firstpass)
		{	return false;
		}
		
		return false;
	}
	
    public void onPointerUp()
	{
		if (isDragging)
		{	isDragging = false;
			generatingmovements = true;
						
			if (!current_drag_did_move)
			{	playerdropsbomb = !playerdropsbomb;
			}		

			return;
		}
		
		return;
	}
	
	public void onPointerMove(int x, int y)
	{
		if ( (!isDragging))
		{	return;
		}
		
		dragpointx = (x - screenscrollx);
		dragpointy = (y - screenscrolly);
		int targetx = dragpointx / screentilesize;
		int targety = dragpointy / screentilesize;

		// suppress drawing the path if still touching the grab action 
		if (current_drag_caused_grab && positionscount>0 && positionx[positionscount-1]==targetx && positiony[positionscount-1]==targety && positiontype[positionscount-1]==TYPE_GRABAT)
		{	return;
		}

		// determine the end of the current position chain (ignoring the grabs)
		int endx = playerx;
		int endy = playery;
		for (int i=positionscount-1; i>=0; i--)
		{	if (positiontype[i]!=TYPE_GRABAT)
			{	endx = positionx[i];
				endy = positiony[i];
				break;
			}
		}
		
		// move through raster from last point to current target	
		while (targetx!=endx || targety!=endy)
		{	int dx = targetx-endx;
			int dy = targety-endy;
			if (Math.abs(dx) >= Math.abs(dy))
			{	endx += (dx>0) ? 1 : -1;
			}
			else 
			{	endy += (dy>0) ? 1 : -1;
			}
			// try to extend the line
			if (positionscount<positionx.length)
			{	positionx[positionscount] = endx;
				positiony[positionscount] = endy;
				positiontype[positionscount] = playerdropsbomb ? TYPE_MOVETO_LEAVEBOMB : TYPE_MOVETO;
				positionscount++;
				playerdropsbomb = false;
			}
			current_drag_did_move = true;
		}
		return;
	}	

}
