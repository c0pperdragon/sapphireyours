package grafl.sy.renderer;

import static android.opengl.GLES20.*;

import java.io.InputStream;
import java.nio.ByteBuffer;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

public class Renderer
{
	boolean hasError;
	
	public Renderer()
	{
	}
	
	public boolean hasError()
	{
		return hasError;
	}
	
	public void setError(String reason)
	{
		System.out.println(reason);
		hasError = true;
	}
	
    // ------------------ static utility methods ----------------------
	
    /**
     * Utility method for compiling a OpenGL shader.
     *
     * <p><strong>Note:</strong> When developing shaders, use the checkGlError()
     * method to debug shader coding errors.</p>
     *
     * @param type - Vertex or fragment shader type.
     * @param shaderCode - String containing the shader code.
     * @return - Returns an id for the shader.
     */
    public static int loadShader(int type, String shaderCode){

        // create a vertex shader type (GLES20.GL_VERTEX_SHADER)
        // or a fragment shader type (GLES20.GL_FRAGMENT_SHADER)
        int shader = glCreateShader(type);

        // add the source code to the shader and compile it
        glShaderSource(shader, shaderCode);
        glCompileShader(shader);
        
        //Check compile status.
        int[] compiled = new int[1];
        glGetShaderiv(shader, GL_COMPILE_STATUS, compiled,0);
        if(compiled[0]!=0)
        {
//        	 System.out.println("Horray! shader compiled");
        }
        else {
//           int[] logLength = new int[1];
//           glGetShaderiv(shader, GL_INFO_LOG_LENGTH, logLength, 0);

            String log = glGetShaderInfoLog(shader);

            System.err.println("Error compiling the shader: " + log);
            System.exit(1);
        }
        return shader;
    }

    public static int createProgram(String vertexShaderCode, String fragmentShaderCode)
    {	// prepare shaders and OpenGL program
    	int vertexShader = loadShader(
    			GL_VERTEX_SHADER, vertexShaderCode);
    	int fragmentShader = loadShader(
    			GL_FRAGMENT_SHADER, fragmentShaderCode);

    	int program = glCreateProgram();             // create empty OpenGL Program
    	glAttachShader(program, vertexShader);   // add the vertex shader to program
    	glAttachShader(program, fragmentShader); // add the fragment shader to program

    	glLinkProgram(program);                  // create OpenGL program executables

    	return program;
    }

    public static int genBuffer()
	{	int[] ib = new int[1];
		glGenBuffers(1,ib,0);
		return ib[0];
	}

    public static int genTexture()
	{	int[] ib = new int[1];
		glGenTextures(1,ib,0);
		return ib[0];
	}


	/**
	 * Directly loads a image into a opengl texture.
	 * @Return Array holding width,height
	 */
	public int[] loadImageToTexture(InputStream is, int texturehandle, boolean onlyalpha)
	{
    	// try to load the image
    	Bitmap bmp = null;
    	try
    	{	bmp = (is==null) ? null : BitmapFactory.decodeStream (is);
    	} 
    	catch (Exception e) 	{}
    	    	
    	if (bmp==null)
    	{	setError("Bitmap could not be loaded");
    		return null;    		
    	}
    	if (bmp.getConfig()!=Bitmap.Config.ARGB_8888)
    	{	setError("Can not decode format: "+bmp.getConfig());
    		return null;
    	}
    	
    	// extract the pixel data
    	int iw = bmp.getWidth();
    	int ih = bmp.getHeight();
		
		ByteBuffer pb = null;
		int gl_type = GL_RGBA;
		// when only using the alpha value, convert to a bitmap that has only the alpha
		if (onlyalpha)
		{	Bitmap alphabmp = bmp.extractAlpha();
			bmp = null;  // try to early release bitmap
			if (alphabmp.getConfig()!=Bitmap.Config.ALPHA_8 )
    		{	setError("Could not convert bitmap to alpha-only");    		
	    		return null;
    		}
			pb = ByteBuffer.allocate(1*iw*ih);
	    	alphabmp.copyPixelsToBuffer(pb);
    		pb.flip();
    		alphabmp = null; // try to early release bitmap
    		gl_type = GL_ALPHA;		
		}
		// normal operation uses r,g,b,a
		else
    	{	pb = ByteBuffer.allocate(4*iw*ih);
	    	bmp.copyPixelsToBuffer(pb);
    		pb.flip();
    		bmp = null; // try to early release bitmap
    	}
    	
		// transfer pixels into GL
       	glBindTexture(GL_TEXTURE_2D, texturehandle);
        glTexImage2D(GL_TEXTURE_2D, 0, gl_type, iw,ih, 0, gl_type, GL_UNSIGNED_BYTE, pb);
        if (glGetError()!=0)
        {	setError("Can not allocate texture for image");
        	return null;
        }
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        
        // tell caller how big the image is
        return new int[]{iw,ih};
	}
	
	
}

