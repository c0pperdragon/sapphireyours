package grafl.sy.renderer;


import static android.opengl.GLES20.*;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.opengl.Matrix;

import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.FloatBuffer;
import java.nio.ShortBuffer;



public class GfxRenderer extends Renderer
{
	public short[] TITLEPICTURE; 	
	public short[] FINISHEDMARKER_VISITED; 	
	public short[] FINISHEDMARKER_SOLVED; 	
	public short[] FINISHEDMARKER_PERFECT; 	
	
	final static int ATLASWIDTH = 512;
	final static int ATLASHEIGHT = 512; 
	
	
    private final String vertexShaderCode =
            "uniform mat4 uMVPMatrix;      "+
            "uniform vec2 uTextureSize;    "+   // width/height of texture in pixels
            "attribute vec2 aCorner;       "+   // location on screen (before transformation)
            "attribute vec2 aTextureCoordinates;  "+   // coordinate in texture (in pixels)   
            "varying vec2 vTextureCoordinates;    "+      // coordinate in texture (in 0.0 - 1.0) to be passed to fragment shader
            "void main() {                        "+
            "  vec4 p;                            "+
            "  p[0] = aCorner[0];                 "+
            "  p[1] = aCorner[1];                 "+
            "  p[2] = 0.0;                        "+
            "  p[3] = 1.0;                        "+
            "  gl_Position = uMVPMatrix * p;      "+
            "  vTextureCoordinates[0] = aTextureCoordinates[0]/uTextureSize[0]; "+
            "  vTextureCoordinates[1] = aTextureCoordinates[1]/uTextureSize[1]; "+
            "}                                         "+
            "";    
    private final String fragmentShaderCode =
            "uniform sampler2D uTexture;                      "+  // uniform specifying the texture 
    		"varying mediump vec2 vTextureCoordinates;        "+  // input from vertex shader
            "void main() {                                    "+
			"   gl_FragColor = texture2D(uTexture,vTextureCoordinates);               "+
            "}                                                                        "+
            "";
    
    private final static int MAXRECTANGLES = 500;  // number of rectangles that can be rendered in one call
    	    
    private final int program;
    private final int uMVPMatrix;
    private final int uTexture;
    private final int uTextureSize;
    private final int aCorner;		
    private final int aTextureCoordinates;
        
    private final int iboIndex;              // buffer holding short
    private final int vboCorner;             // buffer holding float[2] - destination coordinates (in pixel)
    private final int vboTextureCoordinates; // buffer holding short[2] - font texture coordinates (in pixel)    
    private final int txTexture;             // texture buffer
    
    // client-side buffers to prepare the data before moving it into their gl counterparts
	private final FloatBuffer bufferCorner;   
	private final ShortBuffer bufferTextureCoordinates;	
			
    private final float[] matrix;       // projection matrix
	
	// set up opengl  and load textures
	public GfxRenderer(Context context)
	{
		super();

        // create shaders and link together
        program = createProgram(vertexShaderCode,fragmentShaderCode);
        // extract the bindings for the uniforms and attributes
        uMVPMatrix = glGetUniformLocation(program, "uMVPMatrix");
        uTexture = glGetUniformLocation(program, "uTexture");
        uTextureSize = glGetUniformLocation(program, "uTextureSize");
        aCorner = glGetAttribLocation(program, "aCorner");
		aTextureCoordinates = glGetAttribLocation(program, "aTextureCoordinates");
		
		// create index buffer
	    iboIndex = genBuffer();
		ShortBuffer sb = ShortBuffer.allocate(6*4*MAXRECTANGLES);
		for (int i=0; i<MAXRECTANGLES; i++)
		{	sb.put((short) (4*i+0)); 
    		sb.put((short) (4*i+1)); 
    		sb.put((short) (4*i+2)); 
    		sb.put((short) (4*i+1)); 
    		sb.put((short) (4*i+3)); 
    		sb.put((short) (4*i+2)); 
    	}
    	sb.flip();
    	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, iboIndex);
    	glBufferData(GL_ELEMENT_ARRAY_BUFFER, 2*sb.limit(), sb, GL_STATIC_DRAW);
		sb = null;
		
    	// create buffers (gl and client) that hold 4 entries for every rectangle
    	bufferCorner = FloatBuffer.allocate(2*4*MAXRECTANGLES);
	    vboCorner = genBuffer();
    	glBindBuffer(GL_ARRAY_BUFFER, vboCorner);
    	glBufferData(GL_ARRAY_BUFFER, 2*4*4*MAXRECTANGLES, null, GL_DYNAMIC_DRAW);

    	bufferTextureCoordinates = ShortBuffer.allocate(2*4*MAXRECTANGLES);
	    vboTextureCoordinates = genBuffer();
    	glBindBuffer(GL_ARRAY_BUFFER, vboTextureCoordinates);
    	glBufferData(GL_ARRAY_BUFFER, 2*4*2*MAXRECTANGLES, null, GL_DYNAMIC_DRAW);

		// allocate memory for projection matrix
        matrix = new float[16];        

		// allocate memory for texture atlas
       	txTexture = genTexture();
       	glBindTexture(GL_TEXTURE_2D, txTexture);
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, ATLASWIDTH,ATLASHEIGHT, 0, GL_RGBA, GL_UNSIGNED_BYTE, null);
        if (hasError())
        {	setError("Can not allocate texture for graphics");
        	return;
        }
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR); // NEAREST);       			

		// load the graphics files and put into texture atlas
		FreespaceManager freespace = new FreespaceManager(ATLASWIDTH,ATLASHEIGHT);
		try 
		{	
			TITLEPICTURE = loadGfx(context,freespace, "title");
			FINISHEDMARKER_VISITED = loadGfx(context, freespace, "CompletionNO"); 	
			FINISHEDMARKER_SOLVED = loadGfx(context, freespace, "CompletionFINISHED"); 	
			FINISHEDMARKER_PERFECT = loadGfx(context, freespace, "CompletionPERFECT"); 	
		}
		catch (IOException e) 
        {	setError(e.getMessage());
			return;
       	}
       	
		// check if any error has occured
        if (hasError())
        {	setError("Error on creating GfxRenderer");
        }

        
        // give statistical info
        System.out.println("Using " + (freespace.calculateUsage()*100) + "% of gfx texture atlas");
	}
	
	private short[] loadGfx(Context context, FreespaceManager freespace, String name) throws IOException
	{
    	// try to load the image
    	Bitmap bmp = null;
    	try {
    		InputStream is = context.getAssets().open("gfx/"+name+".png");
    		bmp = BitmapFactory.decodeStream (is);
    		is.close();
    	} catch (IOException e) {
    		setError("Bitmap not found: "+e.toString());
    		return new short[4];	
    	}
    	if (bmp==null)
    	{	setError("Gfx "+name+" could not be decoded");
    		return new short[4];	
    	}

    	if (bmp.getConfig()!=Bitmap.Config.ARGB_8888)
    	{	setError("Can not decode format: "+bmp.getConfig());
    		return null;
    	}
    	
    	// extract the pixel size and data
    	int iw = bmp.getWidth();
    	int ih = bmp.getHeight();
		
		ByteBuffer pb = ByteBuffer.allocate(4*iw*ih);
	    bmp.copyPixelsToBuffer(pb);
    	pb.flip();
    	bmp = null; // try to early release bitmap    	
    	
    	// find a suitable position in the texture atlas
    	int[] area;
    	try {
    		area = freespace.allocateArea(iw,ih);
    	}
    	catch (Exception e)
    	{	
    		System.out.println("Can not alloc area in texture atlas for: "+name);
			return new short[4];    	
    	}
    	
		// transfer pixels into GL
       	glBindTexture(GL_TEXTURE_2D, txTexture);
	    glTexSubImage2D(GL_TEXTURE_2D,0, area[0],area[1],iw,ih, GL_RGBA,GL_UNSIGNED_BYTE, pb);
	                    
        // tell caller where in texture atlas the image is
        return new short[] {(short)area[0], (short)area[1], (short)area[2], (short)area[3]};	
	} 
	
	
	
	
	public void startDrawing(int viewportwidth, int viewportheight)
	{
    	// clear client-side buffer
    	bufferCorner.clear();
    	bufferTextureCoordinates.clear();
    	
    	// transfer coordinate system from the opengl-standard to a pixel system (0,0 is top left)
		Matrix.setIdentityM(matrix,0);     
		Matrix.translateM(matrix,0, -1.0f,1.0f, 0);		
		Matrix.scaleM(matrix,0, 2.0f/viewportwidth, -2.0f/viewportheight, 1.0f);
	}
	
	
	public void addGraphic(short[] source, float x1, float y1, float width, float height)
	{
		if (!bufferCorner.hasRemaining())
		{	flush();
		}		
				
		float x2 = x1+width;
		float y2 = y1+height;
		
		short sx1 = source[0];
		short sy1 = source[1];
		short sx2 = (short) (sx1 + source[2]);
		short sy2 = (short) (sy1 + source[3]);
			
		// top-left corner
		bufferCorner.put(x1);                 
		bufferCorner.put(y1);		
		bufferTextureCoordinates.put(sx1);   
		bufferTextureCoordinates.put(sy1);
		// top-right corner
		bufferCorner.put(x2);                 
		bufferCorner.put(y1);		
		bufferTextureCoordinates.put(sx2);    
		bufferTextureCoordinates.put(sy1);
		// bottom-left corner
		bufferCorner.put(x1);                 
		bufferCorner.put(y2);		
		bufferTextureCoordinates.put(sx1);    
		bufferTextureCoordinates.put(sy2);
		// bottom-right corner
		bufferCorner.put(x2);                 
		bufferCorner.put(y2);		
		bufferTextureCoordinates.put(sx2);    
		bufferTextureCoordinates.put(sy2);
	}
	
	public void flush()
	{
		int numrectangles = bufferCorner.position() / (2*4);	
		if (numrectangles<=0)
		{	return;
		}
		
    	// transfer buffers into opengl 
		glBindBuffer(GL_ARRAY_BUFFER, vboCorner);		
		bufferCorner.limit(2*4*numrectangles);
    	bufferCorner.position(0);
    	glBufferSubData(GL_ARRAY_BUFFER,0, 4*4*2*numrectangles, bufferCorner);	
    	
		glBindBuffer(GL_ARRAY_BUFFER, vboTextureCoordinates);		
		bufferTextureCoordinates.limit(2*4*numrectangles);
    	bufferTextureCoordinates.position(0);
    	glBufferSubData(GL_ARRAY_BUFFER,0, 2*4*2*numrectangles, bufferTextureCoordinates);	

		// Prepare buffers for future use
		bufferCorner.clear();
		bufferTextureCoordinates.clear();

		// set up gl for painting all triangles
    	glUseProgram(program);
		
    	// set texture unit 0 to use the texture and tell shader to use texture unit 0
    	glActiveTexture(GL_TEXTURE0);
    	glBindTexture(GL_TEXTURE_2D, txTexture);
    	glUniform1i(uTexture, 0);
        
    	// enable all vertex attribute arrays and set pointers
        glEnableVertexAttribArray(aCorner);
    	glBindBuffer(GL_ARRAY_BUFFER, vboCorner);
        glVertexAttribPointer(aCorner, 2, GL_FLOAT, false, 0, 0);

        glEnableVertexAttribArray(aTextureCoordinates);
    	glBindBuffer(GL_ARRAY_BUFFER, vboTextureCoordinates);
        glVertexAttribPointer(aTextureCoordinates, 2, GL_SHORT, false, 0, 0);

		// set uniform data 
        glUniformMatrix4fv(uMVPMatrix, 1, false, matrix, 0);
        glUniform2f (uTextureSize, (float)ATLASWIDTH, (float)ATLASHEIGHT);

        // Draw all quads in one big call
    	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, iboIndex);
        glDrawElements(GL_TRIANGLES,numrectangles*6, GL_UNSIGNED_SHORT, 0);

		// disable arrays
        glDisableVertexAttribArray(aCorner);
        glDisableVertexAttribArray(aTextureCoordinates);
	}
}


