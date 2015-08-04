package grafl.sy.renderer;


import static android.opengl.GLES20.*;
import android.content.Context;
import android.opengl.Matrix;

import grafl.util.Util;

import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.FloatBuffer;
import java.nio.ShortBuffer;
import java.util.Vector;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;



public class TextRenderer extends Renderer
{
	public final static int WEIGHT_THIN = 135;
	public final static int WEIGHT_PLAIN = 120;
	public final static int WEIGHT_BOLD = 100;

	
    private final String vertexShaderCode =
            "uniform mat4 uMVPMatrix;      "+
            "uniform vec2 uTextureSize;    "+   // width/height of texture in pixels
            "attribute vec2 aCorner;       "+   // location on screen (before transformation)
            "attribute vec4 aColor;               "+   // color to apply to font  
            "attribute vec2 aTextureCoordinates;  "+   // coordinate in texture (in pixels)   
            "attribute float aDistanceThreshold;  "+   // threshold for inside outside decision
            "varying vec2 vTextureCoordinates;    "+      // coordinate in texture (in 0.0 - 1.0) to be passed to fragment shader
            "varying vec4 vColor;                 "+                   // color to be passed to fragment shader
            "varying float vDistanceThreshold;    "+ // distance threshold to be passed to fragment shader
            "void main() {                        "+
            "  vec4 p;                            "+
            "  p[0] = aCorner[0];                 "+
            "  p[1] = aCorner[1];                 "+
            "  p[2] = 0.0;                        "+
            "  p[3] = 1.0;                        "+
            "  gl_Position = uMVPMatrix * p;      "+
            "  vTextureCoordinates[0] = aTextureCoordinates[0]/uTextureSize[0]; "+
            "  vTextureCoordinates[1] = aTextureCoordinates[1]/uTextureSize[1]; "+
            "  vDistanceThreshold = aDistanceThreshold/255.0;                   "+
            "  vColor = aColor / 255.0;                                         "+
            "}                                         "+
            "";    
    private final String fragmentShaderCode =
            "uniform sampler2D uTexture;                      "+  // uniform specifying the texture 
    		"varying mediump vec2 vTextureCoordinates;        "+  // input from vertex shader
            "varying mediump vec4 vColor;                     "+  // input from vertex shader
            "varying mediump float vDistanceThreshold;        "+  // input from vertex shader
            "void main() {                                    "+
            "   mediump float distance = texture2D(uTexture,vTextureCoordinates)[3];  "+ 
			"   gl_FragColor = vColor;                                                "+
            "   gl_FragColor[3] = vColor[3] * smoothstep(vDistanceThreshold-0.08,vDistanceThreshold+0.08,distance); "+
            "}                                                                        "+
            "";
    
    private final static int MAXGLYPHS = 2000;  // number of glyphs that can be rendered in one call
    	    
    private final int program;
    private final int uMVPMatrix;
    private final int uTexture;
    private final int uTextureSize;
    private final int aCorner;		
    private final int aColor;
    private final int aTextureCoordinates;
    private final int aDistanceThreshold;
        
    private final int iboIndex;              // buffer holding short
    private final int vboCorner;             // buffer holding float[2] - destination coordinates (in pixel)
    private final int vboColor;              // buffer holding byte[4] - color 
    private final int vboTextureCoordinates; // buffer holding short[2] - font texture coordinates (in pixel)    
    private final int vboDistanceThreshold;  // buffer holding float  - distance field threshold value
    private final int txFont;                // texture buffer for the distance field representation of the font
    
    // client-side buffers to prepare the data before moving it into their gl counterparts
	private final FloatBuffer bufferCorner;   
	private final ByteBuffer  bufferColor;   
	private final ShortBuffer bufferTextureCoordinates;	
	private final FloatBuffer bufferDistanceThreshold;	
			
	private int[] textureSize; 	
	private short[][] glyph_coordinates;
	private int kerning;
	
    private final float[] matrix;       // projection matrix
	
	// set up opengl  and load textures
	public TextRenderer(Context context)
	{
		super();

        // create shaders and link together
        program = createProgram(vertexShaderCode,fragmentShaderCode);
        // extract the bindings for the uniforms and attributes
        uMVPMatrix = glGetUniformLocation(program, "uMVPMatrix");
        uTexture = glGetUniformLocation(program, "uTexture");
        uTextureSize = glGetUniformLocation(program, "uTextureSize");
        aCorner = glGetAttribLocation(program, "aCorner");
        aColor = glGetAttribLocation(program, "aColor");
		aTextureCoordinates = glGetAttribLocation(program, "aTextureCoordinates");
		aDistanceThreshold = glGetAttribLocation(program, "aDistanceThreshold");
		
		// create index buffer
	    iboIndex = genBuffer();
		ShortBuffer sb = ShortBuffer.allocate(6*4*MAXGLYPHS);
		for (int i=0; i<MAXGLYPHS; i++)
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
		
    	// create buffers (gl and client) that hold 4 entries for every glyph
    	bufferCorner = FloatBuffer.allocate(2*4*MAXGLYPHS);
	    vboCorner = genBuffer();
    	glBindBuffer(GL_ARRAY_BUFFER, vboCorner);
    	glBufferData(GL_ARRAY_BUFFER, 2*4*4*MAXGLYPHS, null, GL_DYNAMIC_DRAW);

    	bufferColor = ByteBuffer.allocate(4*4*MAXGLYPHS);
	    vboColor = genBuffer();
    	glBindBuffer(GL_ARRAY_BUFFER, vboColor);
    	glBufferData(GL_ARRAY_BUFFER, 4*4*MAXGLYPHS, null, GL_DYNAMIC_DRAW);

    	bufferTextureCoordinates = ShortBuffer.allocate(2*4*MAXGLYPHS);
	    vboTextureCoordinates = genBuffer();
    	glBindBuffer(GL_ARRAY_BUFFER, vboTextureCoordinates);
    	glBufferData(GL_ARRAY_BUFFER, 2*4*2*MAXGLYPHS, null, GL_DYNAMIC_DRAW);

    	bufferDistanceThreshold = FloatBuffer.allocate(4*MAXGLYPHS);
	    vboDistanceThreshold = genBuffer();
    	glBindBuffer(GL_ARRAY_BUFFER, vboDistanceThreshold);
    	glBufferData(GL_ARRAY_BUFFER, 4*4*MAXGLYPHS, null, GL_DYNAMIC_DRAW);

		// allocate memory for projection matrix
        matrix = new float[16];        

       	txFont = genTexture();

		// load the font image and store in GL texture (this method automatically closes the stream)
		try 
		{	InputStream is = context.getAssets().open("gfx/font.png");
	       	textureSize = loadImageToTexture(is, txFont, true);		
	       	is.close();	    
			if (hasError())
			{	return;
			}
		}
		catch (IOException e) 
        {	setError(e.getMessage());
			return;
       	}
       	
       	// load the font description file
        glyph_coordinates = new short[256][];
        try 
        {	InputStream is = context.getAssets().open("gfx/fontdesc.json");
            String s = Util.readStringFromStream(is);
        	is.close();
//            System.out.println(s.substring(0,10190));
        	JSONObject o = (JSONObject) (new JSONTokener(s).nextValue());
        	JSONArray glyphs = o.getJSONArray("glyphs");
        	for (int i=0; i<glyphs.length(); i++)
        	{	JSONObject g = glyphs.getJSONObject(i);
        		int code = g.getInt("code");
        		if (code>=0 && code<glyph_coordinates.length)
        		{	glyph_coordinates[code] = new short[]{ (short)g.getInt("x"), (short)g.getInt("y"), (short)g.getInt("width"), (short)g.getInt("height") };	
        		}
        	}
        	kerning = o.getInt("kerning");
        }
        catch (Exception e) 
        {	setError(e.getMessage());
			return;
       	}
       	// create coordinate for space in case it is not already defined to avoid crash
       	if (glyph_coordinates[32]==null)
       	{	glyph_coordinates[32] = new short[]{0,0,10,01};
       	}
       	
        // check if any error has occured
        if (glGetError()!=0)
        {	setError("Error on creating VectorRenderer");
        }
	}
	
	
	public float determineStringWidth(String string, int start, int length, float height)
	{
		float total = 0;
		for (int i=start; i<start+length; i++)
		{	total += determineGlyphWidth(string.charAt(i), height);			
		}
		return total;	
	}
	
	public float determineStringWidth(String string, float height)
	{
		float total = 0;
		int len = string.length();
		for (int i=0; i<len; i++)
		{	total += determineGlyphWidth(string.charAt(i), height);			
		}
		return total;
	}
	
	public float determineNumberWidth(int number, float height)
	{
		float total = 0;
		if (number<0)
		{	total = determineGlyphWidth(' ',height);  
			number = -number;
		}
		do
		{	int lastdigit = number % 10;
			total += determineGlyphWidth('0'+lastdigit,height);
			number = number/10;
		} while (number>0);
		return total;
	}
	
	public float determineGlyphWidth(int c, float height)
	{
		if (c<glyph_coordinates.length)
		{	short[] coordinates = glyph_coordinates[c];
			if (coordinates!=null)
			{	int twidth = coordinates[2];
				int theight = coordinates[3];								
				float magnification = height / (float)theight;
				return ((twidth*magnification) - (kerning*magnification));
			}
		}	
		return 0;			
	} 
	
	
	public String[] wordWrap(String string, float height, float pagewidth)
	{
		Vector<String> v = new Vector<String>();
	
		int start = 0;
		int len = string.length();
		while (start<string.length())
		{	// skip spaces at start of lines
			if (string.charAt(start)==' ')
			{	start++;
			}			
			else
			{	// search until find the biggest still fitting string
				int endthatfits = start;
				int endofwords = string.indexOf(' ',start);
				if (endofwords<0) endofwords=len;
				while (determineStringWidth(string, start,endofwords-start, height)<pagewidth)
				{	endthatfits = endofwords;
					if (endofwords==len)
					{	break;
					}
					else
					{	endofwords = string.indexOf(' ',endofwords+1);
						if (endofwords<0)
						{	endofwords=len;
						}
					}					
				}
				// if some fitting text was found, put it into line
				if (endthatfits>start)
				{	v.addElement(string.substring(start,endthatfits));
					start=endthatfits;
				}				
				// otherwise use the whole next word even if it does not fit
				else
				{	v.addElement(string.substring(start,endofwords));
					start=endofwords;
				}
			}
		}			
	
		String[] a = new String[v.size()];
		v.copyInto(a);
		return a;		
	}
	
	
	public void startDrawing(int viewportwidth, int viewportheight)
	{
    	// clear client-side buffer
    	bufferCorner.clear();
    	bufferColor.clear();
    	bufferTextureCoordinates.clear();
    	bufferDistanceThreshold.clear();
    	
    	// transfer coordinate system from the opengl-standard to a pixel system (0,0 is top left)
		Matrix.setIdentityM(matrix,0);     
		Matrix.translateM(matrix,0, -1.0f,1.0f, 0);		
		Matrix.scaleM(matrix,0, 2.0f/viewportwidth, -2.0f/viewportheight, 1.0f);
	}
	
	
	
	
	public float addString(String string, float x, float y, float height, boolean rightaligned, int argb, float weight)
	{
		float x2 = x;
		if (rightaligned)
		{	for (int i=string.length()-1; i>=0; i--)
			{	x2 -= addGlyph(string.charAt(i), x2,y,height, rightaligned, argb, weight);	
			}		
		}
		else
		{	for (int i=0; i<string.length(); i++)
			{	x2 += addGlyph(string.charAt(i), x2,y,height, rightaligned, argb, weight);	
			}
		}
		return x2;
	}
	
	public float addNumber(int number, float x, float y, float height, boolean rightaligned, int argb, float weight)
	{
		float x2 = x;
		boolean minussign=false;
		if (number<0)
		{	minussign = true;
			number = -number;
		}
		if (rightaligned)
		{	do
			{	int lastdigit = number % 10;
				x2 -= addGlyph('0'+lastdigit, x2,y,height, rightaligned, argb, weight);
				number = number/10;
			} while (number>0);
			if (minussign)
			{	x2 -= addGlyph ('-', x2,y,height, rightaligned, argb, weight);
			}
		}
		else		
		{	if (minussign)
			{	x2 += addGlyph ('-', x2,y,height, rightaligned, argb, weight);
			}
			int highestdigit = 1;
			while (number>=highestdigit*10)
			{	highestdigit*=10;
			} 
			while (highestdigit>0)
			{	
				int digit = (number / highestdigit) % 10;
				x2 += addGlyph('0' + digit, x2,y,height,rightaligned, argb, weight);
				highestdigit = highestdigit/10;			
			}
		}
		return x2;
	}	
	
	private float addGlyph(int code, float x, float y, float height, boolean rightaligned, int argb, float weight)
	{
		short[] coordinates = code<glyph_coordinates.length ? glyph_coordinates[code] : null;
		if (coordinates==null)
		{	coordinates = glyph_coordinates[32];  // unknown letter default to space
		}
		
		if (!bufferCorner.hasRemaining())
		{	flush();
		}		
		
			short tx1 = coordinates[0];
			short ty1 = coordinates[1];
			short twidth = coordinates[2]; 
			short theight = coordinates[3]; 	
			short tx2 = (short) (tx1+twidth);
			short ty2 = (short) (ty1+theight);			
			
			float magnification = height / (float)theight;
			float width = twidth * magnification;			
			float x1 = x - kerning*magnification;
			float x2 = (x1 + width);
			if (rightaligned)
			{	x2 = x + kerning*magnification;
				x1 = x2-width;				
			}
			float y1 = (short) y;
			float y2 = (short) (y + height);
			byte c0 = (byte)(argb>>16);
			byte c1 =((byte)(argb>>8));	
			byte c2 = ((byte)(argb>>0));	
			byte c3 = ((byte)(argb>>24));	
			
			// top-left corner
			bufferCorner.put(x1);                 
			bufferCorner.put(y1);		
			bufferTextureCoordinates.put(tx1);   
			bufferTextureCoordinates.put(ty1);
			bufferColor.put(c0);	
			bufferColor.put(c1);	
			bufferColor.put(c2);	
			bufferColor.put(c3);	
			bufferDistanceThreshold.put(weight);
			// top-right corner
			bufferCorner.put(x2);                 
			bufferCorner.put(y1);		
			bufferTextureCoordinates.put(tx2);    
			bufferTextureCoordinates.put(ty1);
			bufferColor.put(c0);	
			bufferColor.put(c1);	
			bufferColor.put(c2);	
			bufferColor.put(c3);	
			bufferDistanceThreshold.put(weight);
			// bottom-left corner
			bufferCorner.put(x1);                 
			bufferCorner.put(y2);		
			bufferTextureCoordinates.put(tx1);    
			bufferTextureCoordinates.put(ty2);
			bufferColor.put(c0);	
			bufferColor.put(c1);	
			bufferColor.put(c2);	
			bufferColor.put(c3);	
			bufferDistanceThreshold.put(weight);
			// bottom-right corner
			bufferCorner.put(x2);                 
			bufferCorner.put(y2);		
			bufferTextureCoordinates.put(tx2);    
			bufferTextureCoordinates.put(ty2);
			bufferColor.put(c0);	
			bufferColor.put(c1);	
			bufferColor.put(c2);	
			bufferColor.put(c3);	
			bufferDistanceThreshold.put(weight);

			return width - 1*kerning*magnification; 		
	}
	
	public void flush()
	{
		int numglyphs = bufferCorner.position() / (2*4);	
		if (numglyphs<=0)
		{	return;
		}
		
    	// transfer buffers into opengl 
		glBindBuffer(GL_ARRAY_BUFFER, vboCorner);		
		bufferCorner.limit(2*4*numglyphs);
    	bufferCorner.position(0);
    	glBufferSubData(GL_ARRAY_BUFFER,0, 4*4*2*numglyphs, bufferCorner);	

		glBindBuffer(GL_ARRAY_BUFFER, vboColor);		
		bufferColor.limit(4*4*numglyphs);
    	bufferColor.position(0);
    	glBufferSubData(GL_ARRAY_BUFFER,0, 4*4*numglyphs, bufferColor);	
    	
		glBindBuffer(GL_ARRAY_BUFFER, vboTextureCoordinates);		
		bufferTextureCoordinates.limit(2*4*numglyphs);
    	bufferTextureCoordinates.position(0);
    	glBufferSubData(GL_ARRAY_BUFFER,0, 2*4*2*numglyphs, bufferTextureCoordinates);	

		glBindBuffer(GL_ARRAY_BUFFER, vboDistanceThreshold);		
		bufferDistanceThreshold.limit(4*numglyphs);
    	bufferDistanceThreshold.position(0);
    	glBufferSubData(GL_ARRAY_BUFFER,0, 4*4*numglyphs, bufferDistanceThreshold);	
	
		// Prepare buffers for future use
		bufferCorner.clear();
		bufferColor.clear();
		bufferTextureCoordinates.clear();
		bufferDistanceThreshold.clear();

		// set up gl for painting all triangles
    	glUseProgram(program);
		
    	// set texture unit 0 to use the texture and tell shader to use texture unit 0
    	glActiveTexture(GL_TEXTURE0);
    	glBindTexture(GL_TEXTURE_2D, txFont);
    	glUniform1i(uTexture, 0);
        
    	// enable all vertex attribute arrays and set pointers
        glEnableVertexAttribArray(aCorner);
    	glBindBuffer(GL_ARRAY_BUFFER, vboCorner);
        glVertexAttribPointer(aCorner, 2, GL_FLOAT, false, 0, 0);

        glEnableVertexAttribArray(aColor);
    	glBindBuffer(GL_ARRAY_BUFFER, vboColor);
        glVertexAttribPointer(aColor, 4, GL_UNSIGNED_BYTE, false, 0, 0);

        glEnableVertexAttribArray(aTextureCoordinates);
    	glBindBuffer(GL_ARRAY_BUFFER, vboTextureCoordinates);
        glVertexAttribPointer(aTextureCoordinates, 2, GL_SHORT, false, 0, 0);

        glEnableVertexAttribArray(aDistanceThreshold);
    	glBindBuffer(GL_ARRAY_BUFFER, vboDistanceThreshold);
        glVertexAttribPointer(aDistanceThreshold, 1, GL_FLOAT, false, 0, 0);

		// set uniform data 
        glUniformMatrix4fv(uMVPMatrix, 1, false, matrix, 0);
        glUniform2f (uTextureSize, (float)textureSize[0], (float)textureSize[1]);

        // Draw all quads in one big call
    	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, iboIndex);
        glDrawElements(GL_TRIANGLES,numglyphs*6, GL_UNSIGNED_SHORT, 0);

		// disable arrays
        glDisableVertexAttribArray(aCorner);
        glDisableVertexAttribArray(aColor);
        glDisableVertexAttribArray(aTextureCoordinates);
        glDisableVertexAttribArray(aDistanceThreshold);
	}
}


