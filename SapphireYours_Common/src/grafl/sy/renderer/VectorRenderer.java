package grafl.sy.renderer;


import static android.opengl.GLES20.*;
import android.content.Context;
import android.opengl.Matrix;

import java.nio.ByteBuffer;
import java.nio.FloatBuffer;



public class VectorRenderer extends Renderer
{
    final static int MAXCORNERS = 10000;  // number of vertices in the buffer
    	    
    private final static String vertexShaderCode =
            "uniform mat4 uMVPMatrix;                  "+
            "attribute vec2 aCorner;                   "+   // location on screen (before transformation)
            "attribute vec4 aColor;                    "+   // color to apply to texture before rendering   
            "varying vec4 vColor;                      "+   // color to apply to the image (to be given to fragment shader)
            "void main() {                             "+
            "  vec4 p;                                 "+
            "  p[0] = aCorner[0];                      "+
            "  p[1] = aCorner[1];                      "+
            "  p[2] = 0.0;                             "+
            "  p[3] = 1.0;                             "+
            "  gl_Position = uMVPMatrix * p;           "+
            "  vColor = aColor/255.0;                  "+
            "}                                         "+
            "";    
    private final static String fragmentShaderCode =
    		"varying mediump vec4 vColor;                     "+  // color to apply to texture before rendering
            "void main() {                                    "+
			"   gl_FragColor = vColor; "+
            "}                                                "+
            "";
            
    private final static float sinustable[] =
    	{ 0.0f, 0.17364817766693033f, 0.3420201433256687f, 0.5f, 
    	  0.6427876096865393f, 0.766044443118978f, 0.8660254037844386f, 0.9396926207859083f, 
    	  0.984807753012208f, 1.0f, 0.984807753012208f, 0.9396926207859084f, 
    	  0.8660254037844387f, 0.766044443118978f, 0.6427876096865395f, 0.5f,
    	  0.3420201433256689f, 0.1736481776669307f, 0.0f, -0.17364817766693047f,
    	  -0.34202014332566866f, -0.5f, -0.6427876096865393f, -0.7660444431189779f,
    	  -0.8660254037844384f, -0.9396926207859082f, -0.984807753012208f, -1.0f, 
    	  -0.9848077530122081f, -0.9396926207859083f, -0.8660254037844386f, -0.7660444431189781f, 
    	  -0.6427876096865396f, -0.5f, -0.34202014332566943f, -0.1736481776669304f  	}; 
    
    private final int program;
    private final int uMVPMatrix;
    private final int aCorner;
    private final int aColor;  
        
    private final int vboCorner;             // buffer holding float[2] - destination coordinates (in pixel)
    private final int vboColor;              // buffer holding int[1] - color to by applied to image (also for color area rendering)
    
    // client-side buffers to prepare the data before moving it into their gl counterparts
	private final FloatBuffer bufferCorner;   
	private final ByteBuffer  bufferColor;  
	// temporary data for appending corners to triangle strips 
	private boolean mustDublicateNextCorner;
	private float rotsin;
	private float rotcos;
	private float translatex;
	private float translatey;
			
    private final float[] matrix;       // projection matrix
//	private int viewportx;
//	private int viewporty;
//	private int viewportwidth;
//	private int viewportheight;

	// --------- locations of images inside the atlas -------------
	
	// set up opengl  and load textures
	public VectorRenderer(Context context)
	{
		super();

        // create shaders and link together
        program = createProgram(vertexShaderCode,fragmentShaderCode);
        // extract the bindings for the uniforms and attributes
        uMVPMatrix = glGetUniformLocation(program, "uMVPMatrix");
        aCorner = glGetAttribLocation(program, "aCorner");
		aColor = glGetAttribLocation(program, "aColor");
				
    	// create buffers (gl and client) for the vertices
    	bufferCorner = FloatBuffer.allocate(2*MAXCORNERS);
	    vboCorner = genBuffer();
    	glBindBuffer(GL_ARRAY_BUFFER, vboCorner);
    	glBufferData(GL_ARRAY_BUFFER, 4*2*MAXCORNERS, null, GL_DYNAMIC_DRAW);

    	bufferColor = ByteBuffer.allocate(4*MAXCORNERS);
	    vboColor = genBuffer();
    	glBindBuffer(GL_ARRAY_BUFFER, vboColor);
    	glBufferData(GL_ARRAY_BUFFER, 4*MAXCORNERS, null, GL_DYNAMIC_DRAW);
       	
		// allocate memory for projection matrix
        matrix = new float[16];      
        
        // check if any error has occured
        if (glGetError()!=0)
        {	setError("Error on creating VectorRenderer");
        }
	}

	
	public void startDrawing(int viewportwidth, int viewportheight)
	{
    	// clear client-side buffer
    	bufferCorner.clear();
    	bufferColor.clear();
    	mustDublicateNextCorner = false;
    	
    	// transfer coordinate system from the opengl-standard to a pixel system (0,0 is top left)
		Matrix.setIdentityM(matrix,0);     
		Matrix.translateM(matrix,0, -1.0f,1.0f, 0);		
		Matrix.scaleM(matrix,0, 2.0f/viewportwidth, -2.0f/viewportheight, 1.0f);
	}
	
	private void addCorner(float x, float y, int argb)
	{
		bufferCorner.put (x);	
		bufferCorner.put (y);
		bufferColor.put( (byte)(argb>>16) );	
		bufferColor.put( (byte)(argb>>8) );	
		bufferColor.put( (byte)(argb>>0) );	
		bufferColor.put( (byte)(argb>>24) );	
	
	}
	
	public void startStrip()
	{
		int numcorners = bufferCorner.position() / 2;	
		if (numcorners>0)
		{	bufferCorner.put (bufferCorner.get(2*numcorners-2));	
			bufferCorner.put (bufferCorner.get(2*numcorners-1));
			bufferColor.put (bufferColor.get(4*numcorners-4));
			bufferColor.put (bufferColor.get(4*numcorners-3));
			bufferColor.put (bufferColor.get(4*numcorners-2));
			bufferColor.put (bufferColor.get(4*numcorners-1));
			mustDublicateNextCorner = true;
		}	
		this.rotsin = 0;
		this.rotcos = 1;
		this.translatex = 0;
		this.translatey = 0;
	}
	
	public void setStripCornerTransformation(float rotcos, float rotsin, float translatex, float translatey)
	{
		this.rotsin = rotsin;
		this.rotcos = rotcos;
		this.translatex = translatex;
		this.translatey = translatey;	
	}
		
	public void addStripCorner(float x, float y, int argb)
	{
		float tx = (x*rotcos - y*rotsin + translatex);
		float ty = (x*rotsin + y*rotcos + translatey);
		addCorner (tx,ty, argb);				
		if (mustDublicateNextCorner)
		{	addCorner(tx,ty,argb);
			mustDublicateNextCorner = false;
		}		
	}
		
	
	public void addRectangle(float x, float y, float w, float h, int argb)
	{
		short x1 = (short) x;
		short x2 = (short) (x+w);
		short y1 = (short) y;
		short y2 = (short) (y+h);
		
		startStrip();
		addStripCorner(x1,y1, argb);
		addStripCorner(x2,y1, argb);
		addStripCorner(x1,y2, argb);
		addStripCorner(x2,y2, argb);
	}
	
	
	public void addFrame(float x, float y, float w, float h, float border, int argb)
	{		
		float x1 = x;
		float x2 = x+w;
		float y1 = y;
		float y2 = y+h;
		float x1_i = x+border;
		float x2_i = x+w-border;
		float y1_i = y+border;
		float y2_i = y+h-border;

		startStrip();
		addStripCorner(x1,y1,argb);
		addStripCorner(x1_i,y1_i,argb);		
		addStripCorner(x2,y1,argb);
		addStripCorner(x2_i,y1_i,argb);
		addStripCorner(x2,y2,argb);
		addStripCorner(x2_i,y2_i,argb);
		addStripCorner(x1,y2,argb);
		addStripCorner(x1_i,y2_i,argb);
		addStripCorner(x1,y1,argb);
		addStripCorner(x1_i,y1_i,argb);		
	}
	
	
	public void addCircle(float x, float y, float radius, int argb)
	{		
		startStrip();
		addCorner (x,y, argb);
		
		for (int d=0; d<sinustable.length; d++)
		{	float nx = x + sinustable[(d+9)%36] * radius;
			float ny = y - sinustable[d] * radius;
		    addCorner(x,y,argb);
		    addCorner(nx,ny, argb);
		}		
		addCorner (x,y, argb);
		addCorner (x+radius,y, argb);
		mustDublicateNextCorner=true;			
	}
	
	
	public void addShape(float x, float y, int[] xypairs, float scaling, int argb)
	{
		float sc = scaling/100.0f;
		startStrip();
		for (int i=0; i+1<xypairs.length; i+=2)
		{	addStripCorner(x+xypairs[i]*sc, y+xypairs[i+1]*sc, argb);
		}
	}

	public void addShape(float x, float y, int[] xypairs, float scaling, int argb, int alternateargb)
	{
		float sc = scaling/100.0f;
		startStrip();
		for (int i=0; i+1<xypairs.length; i+=2)
		{	addStripCorner(x+xypairs[i]*sc, y+xypairs[i+1]*sc, ((i&2)==0) ? argb : alternateargb);
		}
	}
		
	
	public void addRoundedRect(float x, float y, float width, float height, float radius, float outerradius, int argb)
	{		
		int argb2 = argb & 0x00ffffff; 
		
		float xc=x+width/2;
		float yc=y+height/2;
		float x1=x+width;
		float y1=y+radius;
		float x2=x+width-radius+outerradius;
		float y2=y1;
	
		startStrip();
		
		// 1. quadrant
		for (int d=1; d<sinustable.length/4; d++)
		{
			float nx1 = x+width-radius + sinustable[(d+9)%36] * radius;
			float ny1 = y+radius - sinustable[d] * radius;
			float nx2 = x+width-radius + sinustable[(d+9)%36] * outerradius;
			float ny2 = y+radius - sinustable[d] * outerradius;
			
			addCorner(xc,yc, argb);					
			addCorner(xc,yc, argb);					
			addCorner(x1,y1, argb);
			addCorner(nx1,ny1, argb);
			addCorner(x2,y2, argb2);
			addCorner(nx2,ny2, argb2);
			addCorner(nx2,ny2, argb2);
			
			x1=nx1;
			y1=ny1;
			x2=nx2;
			y2=ny2;								
		}
		// 2. quadrant
		for (int d=sinustable.length/4; d<sinustable.length/2; d++)
		{
			float nx1 = x+radius + sinustable[(d+9)%36] * radius;
			float ny1 = y+radius - sinustable[d] * radius;
			float nx2 = x+radius + sinustable[(d+9)%36] * outerradius;
			float ny2 = y+radius - sinustable[d] * outerradius;
			
			addCorner(xc,yc, argb);					
			addCorner(xc,yc, argb);					
			addCorner(x1,y1, argb);
			addCorner(nx1,ny1, argb);
			addCorner(x2,y2, argb2);
			addCorner(nx2,ny2, argb2);
			addCorner(nx2,ny2, argb2);
			
			x1=nx1;
			y1=ny1;
			x2=nx2;
			y2=ny2;								
		}
		// 3. quadrant
		for (int d=sinustable.length/2; d<sinustable.length*3/4; d++)
		{
			float nx1 = x+radius + sinustable[(d+9)%36] * radius;
			float ny1 = y+height-radius - sinustable[d] * radius;
			float nx2 = x+radius + sinustable[(d+9)%36] * outerradius;
			float ny2 = y+height-radius - sinustable[d] * outerradius;
			
			addCorner(xc,yc, argb);					
			addCorner(xc,yc, argb);					
			addCorner(x1,y1, argb);
			addCorner(nx1,ny1, argb);
			addCorner(x2,y2, argb2);
			addCorner(nx2,ny2, argb2);
			addCorner(nx2,ny2, argb2);
			
			x1=nx1;
			y1=ny1;
			x2=nx2;
			y2=ny2;								
		}
		// 4. quadrant
		for (int d=sinustable.length*3/4; d<sinustable.length; d++)
		{
			float nx1 = x+width-radius + sinustable[(d+9)%36] * radius;
			float ny1 = y+height-radius - sinustable[d] * radius;
			float nx2 = x+width-radius + sinustable[(d+9)%36] * outerradius;
			float ny2 = y+height-radius - sinustable[d] * outerradius;
			
			addCorner(xc,yc, argb);					
			addCorner(xc,yc, argb);					
			addCorner(x1,y1, argb);
			addCorner(nx1,ny1, argb);
			addCorner(x2,y2, argb2);
			addCorner(nx2,ny2, argb2);
			addCorner(nx2,ny2, argb2);
			
			x1=nx1;
			y1=ny1;
			x2=nx2;
			y2=ny2;								
		}
		// last part
		float nx1=x+width;
		float ny1=y+radius;
		float nx2=x+width-radius+outerradius;
		float ny2=ny1;
		addCorner(xc,yc, argb);					
		addCorner(xc,yc, argb);					
		addCorner(x1,y1, argb);
		addCorner(nx1,ny1, argb);
		addCorner(x2,y2, argb2);
		addCorner(nx2,ny2, argb2);
		addCorner(nx2,ny2, argb2);	
	} 
	
	public void addPlayArrow(float x, float y, float width, float height, int orientation, int argb)
	{	
		startStrip();		
		setStripCornerTransformation(orientation*(width/2)/100,0, 
			x+width/2+orientation*width*0.04f,y+width/2);
		addStripCorner(-35,-85, argb);
		addStripCorner(-20,-50, argb);
		addStripCorner(50,0, argb);
		addStripCorner(30,0, argb);
		addStripCorner(-35,85, argb);
		addStripCorner(-20,50, argb);
		addStripCorner(-35,-85, argb);
		addStripCorner(-20,-50, argb);	
	}
	
	public void addForwardArrow(float x, float y, float width, float height, int orientation, int argb)
	{	
		startStrip();		
		setStripCornerTransformation(orientation*(width/2)/100,0, 
			x+width/2+orientation*width*0.04f,y+width/2);
		addStripCorner(-30,-70, argb);
		addStripCorner(40,0, argb);
		addStripCorner(-30,70, argb);
	}
	
	public void addFastForwardArrow(float x, float y, float width, float height, int orientation, int argb)
	{
		startStrip();
		setStripCornerTransformation(orientation*(width/2)/100,0, 
			x+width/2-orientation*width*0.04f,y+width/2);
		addStripCorner(-30,-70, argb);
		addStripCorner(-30,70, argb);
		addStripCorner(10,-30, argb);
		addStripCorner(10,30, argb);
		addStripCorner(10,30, argb);
		addStripCorner(10,70, argb);
		addStripCorner(10,70, argb);
		addStripCorner(10,-70, argb);
		addStripCorner(80,0, argb);
	}

	public void addSlowMotionArrow(float x, float y, float width, float height, int orientation, int argb)
	{	
		startStrip();		
		setStripCornerTransformation(orientation*(width/2)/100,0, 
			x+width/2+orientation*width*0.08f,y+width/2);
		addStripCorner(-70,-70,argb);			
		addStripCorner(-70,70,argb);			
		addStripCorner(-45,-70,argb);			
		addStripCorner(-45,70,argb);			
		addStripCorner(-45,70,argb);						
		addStripCorner(-30,-70, argb);
		addStripCorner(-30,-70, argb);
		addStripCorner(40,0, argb);
		addStripCorner(-30,70, argb);
	}
	
	public void addCross(float x, float y, float width, float height, int argb)
	{
		startStrip();		
		setStripCornerTransformation((width*0.40f)/100,0, x+width/2,y+width/2);
		addStripCorner(0,10, argb);
		addStripCorner(-70,80,argb);
		addStripCorner(0,0, argb);
		addStripCorner(-80,70, argb);
		addStripCorner(-10,0, argb);
		addStripCorner(-10,0, argb);
		addStripCorner(-80,-70, argb);
		addStripCorner(0,0, argb);
		addStripCorner(-70,-80, argb);
		addStripCorner(0,-10, argb);
		addStripCorner(0,-10, argb);
		addStripCorner(70,-80, argb);
		addStripCorner(0,0, argb);
		addStripCorner(80,-70, argb);
		addStripCorner(10,0, argb);
		addStripCorner(10,0, argb);
		addStripCorner(80,70, argb);
		addStripCorner(0,0, argb);
		addStripCorner(70,80, argb);
		addStripCorner(0,10, argb);		 	
	}

	public void addSquare(float x, float y, float width, float height, int argb)	
	{	
		startStrip();		
		setStripCornerTransformation((width*0.43f)/100,0, x+width/2,y+width/2);
		addStripCorner(-70,-70,argb);
		addStripCorner(-70,70,argb);
		addStripCorner(70,-70,argb);
		addStripCorner(70,70,argb);
	}

	public void addNextLevelArrow(float x, float y, float width, float height, int argb)	
	{	
		startStrip();		
		setStripCornerTransformation((width*0.5f)/100,0, x+width/2-width*0.06f,y+width/2);		
		addStripCorner(-50,-25,argb);
		addStripCorner(-50,25,argb);
		addStripCorner(25,-25,argb);
		addStripCorner(25,25,argb);
		addStripCorner(85,0,argb);
		addStripCorner(25,60,argb);
		addStripCorner(85,0,argb);
		addStripCorner(85,0,argb);
		addStripCorner(25,-25,argb);
		addStripCorner(25,-60,argb);
	}
	
	public void addInputFocusMarker(float x, float y, float width, float height, int argb)
	{
		float b = width/30;
		addFrame(x-b,y-b,width+2*b,height+2*b, b, argb);
	}

	public void addCrossArrows(float x, float y, float width, float height, int argb)	
	{	
		startStrip();		
		setStripCornerTransformation(width/200.0f,0, x+width/2,y+width/2);
		addStripCorner(-30,-50,argb);
		addStripCorner(-10,-50,argb);
		addStripCorner(0,-80,argb);
		addStripCorner(10,-50,argb);
		addStripCorner(30,-50,argb);		
		addStripCorner(-10,-50,argb);
		addStripCorner(10,-50,argb);
		addStripCorner(-10,0,argb);
		addStripCorner(10,0,argb);
		addStripCorner(10,0,argb);
		addStripCorner(-30,50,argb);
		addStripCorner(-30,50,argb);
		addStripCorner(-10,50,argb);
		addStripCorner(0,80,argb);
		addStripCorner(10,50,argb);
		addStripCorner(30,50,argb);		
		addStripCorner(-10,50,argb);
		addStripCorner(10,50,argb);
		addStripCorner(-10,0,argb);
		addStripCorner(10,0,argb);	
		addStripCorner(10,0,argb);	
		addStripCorner(-50,-30,argb);			
		addStripCorner(-50,-30,argb);
		addStripCorner(-50,-10,argb);
		addStripCorner(-80,0,argb);
		addStripCorner(-50,10,argb);
		addStripCorner(-50,30,argb);		
		addStripCorner(-50,-10,argb);
		addStripCorner(-50,10,argb);
		addStripCorner(0,-10,argb);
		addStripCorner(0,10,argb);
		addStripCorner(0,10,argb);
		addStripCorner(50,-30,argb);
		addStripCorner(50,-30,argb);
		addStripCorner(50,-10,argb);
		addStripCorner(80,0,argb);
		addStripCorner(50,10,argb);
		addStripCorner(50,30,argb);		
		addStripCorner(50,-10,argb);
		addStripCorner(50,10,argb);
		addStripCorner(0,-10,argb);
		addStripCorner(0,10,argb);		
	}

	public void addZoomArrows(float x, float y, float width, float height, int argb)	
	{	
		startStrip();		
		setStripCornerTransformation(width/200.0f,0, x+width/2,y+width/2);
		addStripCorner(-30,-60,argb);
		addStripCorner(-10,-60,argb);
		addStripCorner(0,-90,argb);
		addStripCorner(10,-60,argb);
		addStripCorner(30,-60,argb);		
		addStripCorner(-10,-60,argb);
		addStripCorner(10,-60,argb);
		addStripCorner(-10,-40,argb);
		addStripCorner(10,-40,argb);
		addStripCorner(10,-40,argb);
		addStripCorner(-30,60,argb);
		addStripCorner(-30,60,argb);
		addStripCorner(-10,60,argb);
		addStripCorner(0,90,argb);
		addStripCorner(10,60,argb);
		addStripCorner(30,60,argb);		
		addStripCorner(-10,60,argb);
		addStripCorner(10,60,argb);
		addStripCorner(-10,40,argb);
		addStripCorner(10,40,argb);
	}

	public void addCheckMark(float x, float y, float width, float height, int argb)	
	{	
		startStrip();		
		setStripCornerTransformation(width/200.0f,0, x+width/2,y+width/2);
		addStripCorner(-60,0,argb);
		addStripCorner(-80,20,argb);
		addStripCorner(-20,40,argb);
		addStripCorner(-20,80,argb);
		addStripCorner(60,-40,argb);		
		addStripCorner(80,-20,argb);
	}
	
	public void flush()
	{
		int numcorners = bufferCorner.position() / 2;	
		if (numcorners == 0) 
		{	return;
		}
		
    	// transfer buffers into opengl 
		bufferCorner.limit(2*numcorners);
    	bufferCorner.position(0);
		glBindBuffer(GL_ARRAY_BUFFER, vboCorner);		
    	glBufferSubData(GL_ARRAY_BUFFER,0, 4*2*numcorners, bufferCorner);	
    		
		bufferColor.limit(4*numcorners);
    	bufferColor.position(0);
		glBindBuffer(GL_ARRAY_BUFFER, vboColor);		
    	glBufferSubData(GL_ARRAY_BUFFER,0, 4*numcorners, bufferColor);	

		// Prepare buffers for future use
		bufferCorner.clear();
		bufferColor.clear();

//    	// termination if screen is too small to draw anything
//		if (viewportwidth<1 || viewportheight<1)
//		{	return;
//		}
		
		// set up gl for painting all triangles
    	glUseProgram(program);
//		glViewport (viewportx,viewporty,viewportwidth,viewportheight);
		
    	// enable all vertex attribute arrays and set pointers
        glEnableVertexAttribArray(aCorner);
    	glBindBuffer(GL_ARRAY_BUFFER, vboCorner);
        glVertexAttribPointer(aCorner, 2, GL_FLOAT, false, 0, 0);

        glEnableVertexAttribArray(aColor);
    	glBindBuffer(GL_ARRAY_BUFFER, vboColor);
        glVertexAttribPointer(aColor, 4, GL_UNSIGNED_BYTE, false, 0, 0);

		// set matrix and draw all triangles
        glUniformMatrix4fv(uMVPMatrix, 1, false, matrix, 0);

        // Draw all triangles
        glDrawArrays(GL_TRIANGLE_STRIP,0,numcorners);

		// disable arrays
        glDisableVertexAttribArray(aCorner);
        glDisableVertexAttribArray(aColor);

	}

	
	
	
 }


