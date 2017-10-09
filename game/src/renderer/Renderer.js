
var Renderer = function() 
{   this.gl = null;
    this.error = false;
};

Renderer.prototype.$ = function(gl) 
{   this.gl = gl;
    this.error = false;
    return this;
};

Renderer.prototype.hasError = function()
{   return this.error;
};

Renderer.prototype.setError = function(reason)
{   console.log(reason);
    this.error = true;
};


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
 Renderer.prototype.loadShader = function(type,shaderCode)
 {  var gl = this.gl;
    
    // create a vertex shader type (GLES20.GL_VERTEX_SHADER)
    // or a fragment shader type (GLES20.GL_FRAGMENT_SHADER)
    var shader = gl.createShader(type);

    // add the source code to the shader and compile it
    gl.shaderSource(shader, shaderCode);
    gl.compileShader(shader);
        
    //Check compile status.
    var log = gl.getShaderInfoLog(shader);
    if(log.length>0)
    {
        console.log("Error compiling the shader: " + log);
    }
    return shader;
};

Renderer.prototype.createProgram = function(vertexShaderCode, fragmentShaderCode)
{   var gl = this.gl;

    // prepare shaders and OpenGL program
    var vertexShader = this.loadShader(gl.VERTEX_SHADER, vertexShaderCode);
    var fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fragmentShaderCode);

    var program = gl.createProgram();             // create empty OpenGL Program
    gl.attachShader(program, vertexShader);   // add the vertex shader to program
    gl.attachShader(program, fragmentShader); // add the fragment shader to program

    gl.linkProgram(program);                  // create OpenGL program executables
        
    return program;
};


	/**
	 * Directly loads a image into a opengl texture.
	 * @Return Array holding width,height
	 */
/*     
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
	*/

