package android.opengl;

import java.nio.Buffer;

import com.jogamp.opengl.GL2;

public abstract class GLES20 
{
	public static GL2 gl;   // the JOGL library
	private static void errcheck()
	{   int e = gl. glGetError(); 
		if (e != 0)
		{	throw new IllegalStateException("GL error: "+e);
		}
	}
	
	public static final int GL_ACTIVE_ATTRIBUTES = 35721;
	public static final int GL_ACTIVE_ATTRIBUTE_MAX_LENGTH = 35722;
	public static final int GL_ACTIVE_TEXTURE = 34016;
	public static final int GL_ACTIVE_UNIFORMS = 35718;
	public static final int GL_ACTIVE_UNIFORM_MAX_LENGTH = 35719;
	public static final int GL_ALIASED_LINE_WIDTH_RANGE = 33902;
	public static final int GL_ALIASED_POINT_SIZE_RANGE = 33901;
	public static final int GL_ALPHA = 6406;
	public static final int GL_ALPHA_BITS = 3413;
	public static final int GL_ALWAYS = 519;
	public static final int GL_ARRAY_BUFFER = 34962;
	public static final int GL_ARRAY_BUFFER_BINDING = 34964;
	public static final int GL_ATTACHED_SHADERS = 35717;
	public static final int GL_BACK = 1029;
	public static final int GL_BLEND = 3042;
	public static final int GL_BLEND_COLOR = 32773;
	public static final int GL_BLEND_DST_ALPHA = 32970;
	public static final int GL_BLEND_DST_RGB = 32968;
	public static final int GL_BLEND_EQUATION = 32777;
	public static final int GL_BLEND_EQUATION_ALPHA = 34877;
	public static final int GL_BLEND_EQUATION_RGB = 32777;
	public static final int GL_BLEND_SRC_ALPHA = 32971;
	public static final int GL_BLEND_SRC_RGB = 32969;
	public static final int GL_BLUE_BITS = 3412;
	public static final int GL_BOOL = 35670;
	public static final int GL_BOOL_VEC2 = 35671;
	public static final int GL_BOOL_VEC3 = 35672;
	public static final int GL_BOOL_VEC4 = 35673;
	public static final int GL_BUFFER_SIZE = 34660;
	public static final int GL_BUFFER_USAGE = 34661;
	public static final int GL_BYTE = 5120;
	public static final int GL_CCW = 2305;
	public static final int GL_CLAMP_TO_EDGE = 33071;
	public static final int GL_COLOR_ATTACHMENT0 = 36064;
	public static final int GL_COLOR_BUFFER_BIT = 16384;
	public static final int GL_COLOR_CLEAR_VALUE = 3106;
	public static final int GL_COLOR_WRITEMASK = 3107;
	public static final int GL_COMPILE_STATUS = 35713;
	public static final int GL_COMPRESSED_TEXTURE_FORMATS = 34467;
	public static final int GL_CONSTANT_ALPHA = 32771;
	public static final int GL_CONSTANT_COLOR = 32769;
	public static final int GL_CULL_FACE = 2884;
	public static final int GL_CULL_FACE_MODE = 2885;
	public static final int GL_CURRENT_PROGRAM = 35725;
	public static final int GL_CURRENT_VERTEX_ATTRIB = 34342;
	public static final int GL_CW = 2304;
	public static final int GL_DECR = 7683;
	public static final int GL_DECR_WRAP = 34056;
	public static final int GL_DELETE_STATUS = 35712;
	public static final int GL_DEPTH_ATTACHMENT = 36096;
	public static final int GL_DEPTH_BITS = 3414;
	public static final int GL_DEPTH_BUFFER_BIT = 256;
	public static final int GL_DEPTH_CLEAR_VALUE = 2931;
	public static final int GL_DEPTH_COMPONENT = 6402;
	public static final int GL_DEPTH_COMPONENT16 = 33189;
	public static final int GL_DEPTH_FUNC = 2932;
	public static final int GL_DEPTH_RANGE = 2928;
	public static final int GL_DEPTH_TEST = 2929;
	public static final int GL_DEPTH_WRITEMASK = 2930;
	public static final int GL_DITHER = 3024;
	public static final int GL_DONT_CARE = 4352;
	public static final int GL_DST_ALPHA = 772;
	public static final int GL_DST_COLOR = 774;
	public static final int GL_DYNAMIC_DRAW = 35048;
	public static final int GL_ELEMENT_ARRAY_BUFFER = 34963;
	public static final int GL_ELEMENT_ARRAY_BUFFER_BINDING = 34965;
	public static final int GL_EQUAL = 514;
	public static final int GL_EXTENSIONS = 7939;
	public static final int GL_FALSE = 0;
	public static final int GL_FASTEST = 4353;
	public static final int GL_FIXED = 5132;
	public static final int GL_FLOAT = 5126;
	public static final int GL_FLOAT_MAT2 = 35674;
	public static final int GL_FLOAT_MAT3 = 35675;
	public static final int GL_FLOAT_MAT4 = 35676;
	public static final int GL_FLOAT_VEC2 = 35664;
	public static final int GL_FLOAT_VEC3 = 35665;
	public static final int GL_FLOAT_VEC4 = 35666;
	public static final int GL_FRAGMENT_SHADER = 35632;
	public static final int GL_FRAMEBUFFER = 36160;
	public static final int GL_FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 36049;
	public static final int GL_FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 36048;
	public static final int GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 36051;
	public static final int GL_FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 36050;
	public static final int GL_FRAMEBUFFER_BINDING = 36006;
	public static final int GL_FRAMEBUFFER_COMPLETE = 36053;
	public static final int GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 36054;
	public static final int GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 36057;
	public static final int GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 36055;
	public static final int GL_FRAMEBUFFER_UNSUPPORTED = 36061;
	public static final int GL_FRONT = 1028;
	public static final int GL_FRONT_AND_BACK = 1032;
	public static final int GL_FRONT_FACE = 2886;
	public static final int GL_FUNC_ADD = 32774;
	public static final int GL_FUNC_REVERSE_SUBTRACT = 32779;
	public static final int GL_FUNC_SUBTRACT = 32778;
	public static final int GL_GENERATE_MIPMAP_HINT = 33170;
	public static final int GL_GEQUAL = 518 ;
	public static final int GL_GREATER = 516 ;
	public static final int GL_GREEN_BITS = 3411 ;
	public static final int GL_HIGH_FLOAT = 36338;
	public static final int GL_HIGH_INT = 36341;
	public static final int GL_IMPLEMENTATION_COLOR_READ_FORMAT = 35739;
	public static final int GL_IMPLEMENTATION_COLOR_READ_TYPE = 35738;
	public static final int GL_INCR = 7682 ;
	public static final int GL_INCR_WRAP = 34055;
	public static final int GL_INFO_LOG_LENGTH = 35716;
	public static final int GL_INT = 5124 ;
	public static final int GL_INT_VEC2 = 35667;
	public static final int GL_INT_VEC3 = 35668;
	public static final int GL_INT_VEC4 = 35669;
	public static final int GL_INVALID_ENUM = 1280 ;
	public static final int GL_INVALID_FRAMEBUFFER_OPERATION = 1286 ;
	public static final int GL_INVALID_OPERATION = 1282 ;
	public static final int GL_INVALID_VALUE = 1281 ;
	public static final int GL_INVERT = 5386 ;
	public static final int GL_KEEP = 7680 ;
	public static final int GL_LEQUAL = 515 ;
	public static final int GL_LESS = 513 ;
	public static final int GL_LINEAR = 9729 ;
	public static final int GL_LINEAR_MIPMAP_LINEAR = 9987 ;
	public static final int GL_LINEAR_MIPMAP_NEAREST = 9985 ;
	public static final int GL_LINES = 1 ;
	public static final int GL_LINE_LOOP = 2 ;
	public static final int GL_LINE_STRIP = 3 ;
	public static final int GL_LINE_WIDTH = 2849 ;
	public static final int GL_LINK_STATUS = 35714;
	public static final int GL_LOW_FLOAT = 36336;
	public static final int GL_LOW_INT = 36339;
	public static final int GL_LUMINANCE = 6409 ;
	public static final int GL_LUMINANCE_ALPHA = 6410 ;
	public static final int GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 35661;
	public static final int GL_MAX_CUBE_MAP_TEXTURE_SIZE = 34076;
	public static final int GL_MAX_FRAGMENT_UNIFORM_VECTORS = 36349;
	public static final int GL_MAX_RENDERBUFFER_SIZE = 34024;
	public static final int GL_MAX_TEXTURE_IMAGE_UNITS = 34930;
	public static final int GL_MAX_TEXTURE_SIZE = 3379 ;
	public static final int GL_MAX_VARYING_VECTORS = 36348;
	public static final int GL_MAX_VERTEX_ATTRIBS = 34921;
	public static final int GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS = 35660;
	public static final int GL_MAX_VERTEX_UNIFORM_VECTORS = 36347;
	public static final int GL_MAX_VIEWPORT_DIMS = 3386 ;
	public static final int GL_MEDIUM_FLOAT = 36337;
	public static final int GL_MEDIUM_INT = 36340;
	public static final int GL_MIRRORED_REPEAT = 33648;
	public static final int GL_NEAREST = 9728 ;
	public static final int GL_NEAREST_MIPMAP_LINEAR = 9986 ;
	public static final int GL_NEAREST_MIPMAP_NEAREST = 9984 ;
	public static final int GL_NEVER = 512 ;
	public static final int GL_NICEST = 4354 ;
	public static final int GL_NONE = 0 ;
	public static final int GL_NOTEQUAL = 517 ;
	public static final int GL_NO_ERROR = 0 ;
	public static final int GL_NUM_COMPRESSED_TEXTURE_FORMATS = 34466;
	public static final int GL_NUM_SHADER_BINARY_FORMATS = 36345;
	public static final int GL_ONE = 1 ;
	public static final int GL_ONE_MINUS_CONSTANT_ALPHA = 32772;
	public static final int GL_ONE_MINUS_CONSTANT_COLOR = 32770;
	public static final int GL_ONE_MINUS_DST_ALPHA = 773 ;
	public static final int GL_ONE_MINUS_DST_COLOR = 775 ;
	public static final int GL_ONE_MINUS_SRC_ALPHA = 771 ;
	public static final int GL_ONE_MINUS_SRC_COLOR = 769 ;
	public static final int GL_OUT_OF_MEMORY = 1285 ;
	public static final int GL_PACK_ALIGNMENT = 3333 ;
	public static final int GL_POINTS = 0 ;
	public static final int GL_POLYGON_OFFSET_FACTOR = 32824;
	public static final int GL_POLYGON_OFFSET_FILL = 32823;
	public static final int GL_POLYGON_OFFSET_UNITS = 10752;
	public static final int GL_RED_BITS = 3410 ;
	public static final int GL_RENDERBUFFER = 36161;
	public static final int GL_RENDERBUFFER_ALPHA_SIZE = 36179;
	public static final int GL_RENDERBUFFER_BINDING = 36007;
	public static final int GL_RENDERBUFFER_BLUE_SIZE = 36178;
	public static final int GL_RENDERBUFFER_DEPTH_SIZE = 36180;
	public static final int GL_RENDERBUFFER_GREEN_SIZE = 36177;
	public static final int GL_RENDERBUFFER_HEIGHT = 36163;
	public static final int GL_RENDERBUFFER_INTERNAL_FORMAT = 36164;
	public static final int GL_RENDERBUFFER_RED_SIZE = 36176;
	public static final int GL_RENDERBUFFER_STENCIL_SIZE = 36181;
	public static final int GL_RENDERBUFFER_WIDTH = 36162;
	public static final int GL_RENDERER = 7937 ;
	public static final int GL_REPEAT = 10497;
	public static final int GL_REPLACE = 7681 ;
	public static final int GL_RGB = 6407 ;
	public static final int GL_RGB565 = 36194;
	public static final int GL_RGB5_A1 = 32855;
	public static final int GL_RGBA = 6408 ;
	public static final int GL_RGBA4 = 32854;
	public static final int GL_SAMPLER_2D = 35678;
	public static final int GL_SAMPLER_CUBE = 35680;
	public static final int GL_SAMPLES = 32937;
	public static final int GL_SAMPLE_ALPHA_TO_COVERAGE = 32926;
	public static final int GL_SAMPLE_BUFFERS = 32936;
	public static final int GL_SAMPLE_COVERAGE = 32928;
	public static final int GL_SAMPLE_COVERAGE_INVERT = 32939;
	public static final int GL_SAMPLE_COVERAGE_VALUE = 32938;
	public static final int GL_SCISSOR_BOX = 3088 ;
	public static final int GL_SCISSOR_TEST = 3089 ;
	public static final int GL_SHADER_BINARY_FORMATS = 36344;
	public static final int GL_SHADER_COMPILER = 36346;
	public static final int GL_SHADER_SOURCE_LENGTH = 35720;
	public static final int GL_SHADER_TYPE = 35663;
	public static final int GL_SHADING_LANGUAGE_VERSION = 35724;
	public static final int GL_SHORT = 5122 ;
	public static final int GL_SRC_ALPHA = 770 ;
	public static final int GL_SRC_ALPHA_SATURATE = 776 ;
	public static final int GL_SRC_COLOR = 768 ;
	public static final int GL_STATIC_DRAW = 35044;
	public static final int GL_STENCIL_ATTACHMENT = 36128;
	public static final int GL_STENCIL_BACK_FAIL = 34817;
	public static final int GL_STENCIL_BACK_FUNC = 34816;
	public static final int GL_STENCIL_BACK_PASS_DEPTH_FAIL = 34818;
	public static final int GL_STENCIL_BACK_PASS_DEPTH_PASS = 34819;
	public static final int GL_STENCIL_BACK_REF = 36003;
	public static final int GL_STENCIL_BACK_VALUE_MASK = 36004;
	public static final int GL_STENCIL_BACK_WRITEMASK = 36005;
	public static final int GL_STENCIL_BITS = 3415 ;
	public static final int GL_STENCIL_BUFFER_BIT = 1024 ;
	public static final int GL_STENCIL_CLEAR_VALUE = 2961 ;
	public static final int GL_STENCIL_FAIL = 2964 ;
	public static final int GL_STENCIL_FUNC = 2962 ;
	public static final int GL_STENCIL_INDEX = 6401 ;
	public static final int GL_STENCIL_INDEX8 = 36168;
	public static final int GL_STENCIL_PASS_DEPTH_FAIL = 2965 ;
	public static final int GL_STENCIL_PASS_DEPTH_PASS = 2966 ;
	public static final int GL_STENCIL_REF = 2967 ;
	public static final int GL_STENCIL_TEST = 2960 ;
	public static final int GL_STENCIL_VALUE_MASK = 2963 ;
	public static final int GL_STENCIL_WRITEMASK = 2968 ;
	public static final int GL_STREAM_DRAW = 35040;
	public static final int GL_SUBPIXEL_BITS = 3408 ;
	public static final int GL_TEXTURE = 5890 ;
	public static final int GL_TEXTURE0 = 33984;
	public static final int GL_TEXTURE1 = 33985;
	public static final int GL_TEXTURE10 = 33994;
	public static final int GL_TEXTURE11 = 33995;
	public static final int GL_TEXTURE12 = 33996;
	public static final int GL_TEXTURE13 = 33997;
	public static final int GL_TEXTURE14 = 33998;
	public static final int GL_TEXTURE15 = 33999;
	public static final int GL_TEXTURE16 = 34000;
	public static final int GL_TEXTURE17 = 34001;
	public static final int GL_TEXTURE18 = 34002;
	public static final int GL_TEXTURE19 = 34003;
	public static final int GL_TEXTURE2 = 33986;
	public static final int GL_TEXTURE20 = 34004;
	public static final int GL_TEXTURE21 = 34005;
	public static final int GL_TEXTURE22 = 34006;
	public static final int GL_TEXTURE23 = 34007;
	public static final int GL_TEXTURE24 = 34008;
	public static final int GL_TEXTURE25 = 34009;
	public static final int GL_TEXTURE26 = 34010;
	public static final int GL_TEXTURE27 = 34011;
	public static final int GL_TEXTURE28 = 34012;
	public static final int GL_TEXTURE29 = 34013;
	public static final int GL_TEXTURE3 = 33987;
	public static final int GL_TEXTURE30 = 34014;
	public static final int GL_TEXTURE31 = 34015;
	public static final int GL_TEXTURE4 = 33988;
	public static final int GL_TEXTURE5 = 33989;
	public static final int GL_TEXTURE6 = 33990;
	public static final int GL_TEXTURE7 = 33991;
	public static final int GL_TEXTURE8 = 33992;
	public static final int GL_TEXTURE9 = 33993;
	public static final int GL_TEXTURE_2D = 3553 ;
	public static final int GL_TEXTURE_BINDING_2D = 32873;
	public static final int GL_TEXTURE_BINDING_CUBE_MAP = 34068;
	public static final int GL_TEXTURE_CUBE_MAP = 34067;
	public static final int GL_TEXTURE_CUBE_MAP_NEGATIVE_X = 34070;
	public static final int GL_TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072;
	public static final int GL_TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074;
	public static final int GL_TEXTURE_CUBE_MAP_POSITIVE_X = 34069;
	public static final int GL_TEXTURE_CUBE_MAP_POSITIVE_Y = 34071;
	public static final int GL_TEXTURE_CUBE_MAP_POSITIVE_Z = 34073;
	public static final int GL_TEXTURE_MAG_FILTER = 10240;
	public static final int GL_TEXTURE_MIN_FILTER = 10241;
	public static final int GL_TEXTURE_WRAP_S = 10242;
	public static final int GL_TEXTURE_WRAP_T = 10243;
	public static final int GL_TRIANGLES = 4 ;
	public static final int GL_TRIANGLE_FAN = 6 ;
	public static final int GL_TRIANGLE_STRIP = 5 ;
	public static final int GL_TRUE = 1 ;
	public static final int GL_UNPACK_ALIGNMENT = 3317 ;
	public static final int GL_UNSIGNED_BYTE = 5121 ;
	public static final int GL_UNSIGNED_INT = 5125 ;
	public static final int GL_UNSIGNED_SHORT = 5123 ;
	public static final int GL_UNSIGNED_SHORT_4_4_4_4 = 32819;
	public static final int GL_UNSIGNED_SHORT_5_5_5_1 = 32820;
	public static final int GL_UNSIGNED_SHORT_5_6_5 = 33635;
	public static final int GL_VALIDATE_STATUS = 35715;
	public static final int GL_VENDOR = 7936 ;
	public static final int GL_VERSION = 7938 ;
	public static final int GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 34975;
	public static final int GL_VERTEX_ATTRIB_ARRAY_ENABLED = 34338;
	public static final int GL_VERTEX_ATTRIB_ARRAY_NORMALIZED = 34922;
	public static final int GL_VERTEX_ATTRIB_ARRAY_POINTER = 34373;
	public static final int GL_VERTEX_ATTRIB_ARRAY_SIZE = 34339;
	public static final int GL_VERTEX_ATTRIB_ARRAY_STRIDE = 34340;
	public static final int GL_VERTEX_ATTRIB_ARRAY_TYPE = 34341;
	public static final int GL_VERTEX_SHADER = 35633;
	public static final int GL_VIEWPORT = 2978 ;
	public static final int GL_ZERO = 0 ;
	
	// -- methods as defined by OPENGL ES 2.0 	
	public static void glActiveTexture (int texture)
	{	gl.glActiveTexture(texture);
		errcheck();
	}
	public static void glAttachShader (int program, int shader)
	{	gl.glAttachShader(program, shader);
		errcheck();
	}
	public static void glBindAttribLocation (int program, int index, String name)
	{	gl.glBindAttribLocation(program,index,name);
		errcheck();
	}
	public static void glBindBuffer (int target, int buffer)
	{	gl.glBindBuffer(target,buffer);
		errcheck();
	}
	public static void glBindFramebuffer (int target, int framebuffer)
	{	gl.glBindFramebuffer (target,  framebuffer);
		errcheck();
	}
	public static void glBindRenderbuffer (int target, int renderbuffer)
	{	gl.glBindRenderbuffer ( target,  renderbuffer);
		errcheck();
	}
	public static void glBindTexture (int target, int texture)
	{	gl.glBindTexture ( target,  texture);
		errcheck();
	}
	public static void glBlendColor (float red, float green, float blue, float alpha)
	{	gl.glBlendColor ( red,  green,  blue,  alpha);
		errcheck();
	}
	public static void glBlendEquation (int mode)
	{	gl.glBlendEquation (mode);
		errcheck();
	}
	public static void glBlendEquationSeparate (int modeRGB, int modeAlpha)
	{	gl.glBlendEquationSeparate ( modeRGB,  modeAlpha);
		errcheck();
	}
	public static void glBlendFunc (int sfactor, int dfactor)
	{	gl.glBlendFunc ( sfactor,  dfactor);
		errcheck();
	}
	public static void glBlendFuncSeparate (int srcRGB, int dstRGB, int srcAlpha, int dstAlpha)
	{	gl.glBlendFuncSeparate ( srcRGB,  dstRGB,  srcAlpha,  dstAlpha);
		errcheck();
	}
	public static void glBufferData (int target, int size, Buffer data, int usage)
	{	gl.glBufferData(target,size,data,usage);
		errcheck();
	}
	public static void glBufferSubData (int target, int offset, int size, Buffer data)
	{	gl. glBufferSubData ( target,  offset,  size,  data);
		errcheck();
	}
	public static int glCheckFramebufferStatus (int target)
	{	int r = gl.glCheckFramebufferStatus ( target);
		errcheck();
		return r;
	}
	public static void glClear (int mask)
	{	gl.glClear(mask);
		errcheck();
	}
	public static void glClearColor (float red, float green, float blue, float alpha)
	{	gl.glClearColor(red,green,blue,alpha);
		errcheck();
	}
	public static void glClearDepthf (float depth)
	{	gl.glClearDepthf ( depth);
		errcheck();
	}
	public static void glClearStencil (int s)
	{	gl.glClearStencil ( s);
		errcheck();
	}
	public static void glColorMask (boolean red, boolean green, boolean blue, boolean alpha)
	{	gl.glColorMask (red,  green,  blue,  alpha);
		errcheck();
	}
	public static void glCompileShader (int shader)
	{	gl.glCompileShader(shader);
		errcheck();
	}
	public static void glCompressedTexImage2D (int target, int level, int internalformat, int width, int height, int border, int imageSize, Buffer data)
	{	gl.glCompressedTexImage2D ( target,  level,  internalformat,  width,  height,  border,  imageSize,  data);
		errcheck();
	}
	public static void glCompressedTexSubImage2D (int target, int level, int xoffset, int yoffset, int width, int height, int format, int imageSize, Buffer data)
	{	gl.glCompressedTexSubImage2D ( target,  level,  xoffset,  yoffset,  width,  height,  format,  imageSize,  data);
		errcheck();
	}
	public static void glCopyTexImage2D (int target, int level, int internalformat, int x, int y, int width, int height, int border)
	{	gl.glCopyTexImage2D ( target,  level,  internalformat,  x,  y,  width,  height,  border);
		errcheck();
	}
	public static void glCopyTexSubImage2D (int target, int level, int xoffset, int yoffset, int x, int y, int width, int height)
	{	gl.glCopyTexSubImage2D ( target,  level,  xoffset,  yoffset,  x,  y,  width,  height);
		errcheck();
	}
	public static int glCreateProgram ()
	{ 	int r = gl.glCreateProgram();
		errcheck();
		return r;
	}
	public static int glCreateShader (int type)
	{ 	int r = gl.glCreateShader(type);
		errcheck();
		return r;
	}
	public static void glCullFace (int mode)
	{	gl.glCullFace(mode);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:    public abstract static void glDeleteBuffers (int n, IntBuffer buffers);
	public static void glDeleteBuffers (int n, int[] buffers, int offset)
	{	gl.glDeleteBuffers ( n,  buffers,  offset);
		errcheck();
	}	
	// NOT SUPPORTED - use arrays:   public abstract void glDeleteFramebuffers (int n, IntBuffer framebuffers);
	public static void glDeleteFramebuffers (int n, int[] framebuffers, int offset)
	{	gl.glDeleteFramebuffers ( n, framebuffers,  offset);
		errcheck();
	}	
	public static void glDeleteProgram (int program){
		gl.glDeleteProgram(program);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glDeleteRenderbuffers (int n, IntBuffer renderbuffers);	
	public static void glDeleteRenderbuffers (int n, int[] renderbuffers, int offset)
	{	gl.glDeleteRenderbuffers ( n, renderbuffers,  offset);
		errcheck();
	}
	public static void glDeleteShader (int shader)
	{	gl.glDeleteShader ( shader);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:    public abstract void glDeleteTextures (int n, IntBuffer textures);
	public static void glDeleteTextures (int n, int[] textures, int offset)
	{	gl.glDeleteTextures ( n, textures,  offset);
		errcheck();
	}	
	public static void glDepthFunc (int func)
	{	gl.glDepthFunc ( func);
		errcheck();
	}
	public static void glDepthMask (boolean flag)
	{	gl. glDepthMask ( flag);
		errcheck();
	}
	public static void glDepthRangef (float zNear, float zFar)
	{	gl.glDepthRangef ( zNear,  zFar);
		errcheck();
	}
	public static void glDetachShader (int program, int shader)
	{	gl.glDetachShader ( program,  shader);
		errcheck();
	}
	public static void glDisable (int cap)
	{	gl.glDisable ( cap);
		errcheck();
	}
	public static void glDisableVertexAttribArray (int index)
	{	gl.glDisableVertexAttribArray(index);
		errcheck();
	}
	public static void glDrawArrays (int mode, int first, int count)
	{	gl.glDrawArrays ( mode,  first,  count);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:  	public static void glDrawElements (int mode, int count, int type, Buffer indices);
	public static void glDrawElements (int mode, int count, int type, int offset)
    {	gl.glDrawElements(mode,count,type,offset);
		errcheck();
    }	
	public static void glEnable (int cap)
	{	gl.glEnable ( cap);
		errcheck();
	}
	public static void glEnableVertexAttribArray (int index)
	{	gl.glEnableVertexAttribArray (index);
		errcheck();
	}
	public static void glFinish ()
	{	gl.glFinish();
		errcheck();
	}
	public static void glFlush ()
	{	gl.glFlush();
		errcheck();
	}
	public static void glFramebufferRenderbuffer (int target, int attachment, int renderbuffertarget, int renderbuffer)
	{	gl.glFramebufferRenderbuffer ( target,  attachment,  renderbuffertarget,  renderbuffer);
		errcheck();
	}
	public static void glFramebufferTexture2D (int target, int attachment, int textarget, int texture, int level)
	{	gl.glFramebufferTexture2D ( target,  attachment,  textarget,  texture,  level);
		errcheck();
	}
	public static void glFrontFace (int mode)
	{	gl.glFrontFace ( mode);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:    public static void glGenBuffers (int n, IntBuffer buffers)	
	public static void glGenBuffers (int n, int[] buffers, int offset)
	{	gl.glGenBuffers(n,buffers,offset);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:    public static void glGenFramebuffers (int n, IntBuffer framebuffers)
	public static void glGenFramebuffers (int n, int[] framebuffers, int offset)
	{	gl.glGenFramebuffers ( n, framebuffers,  offset);
		errcheck();
	}	
	// NOT SUPPORTED - use arrays:    public static void glGenRenderbuffers (int n, IntBuffer renderbuffers)
	public static void glGenRenderbuffers (int n, int[] renderbuffers, int offset)
	{	gl.glGenRenderbuffers ( n, renderbuffers,  offset);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:    public static void glGenTextures (int n, IntBuffer textures)
	public static void glGenTextures (int n, int[] textures, int offset)
	{	gl.glGenTextures ( n, textures,  offset);
		errcheck();
	}	
	public static void glGenerateMipmap (int target)
	{	gl.glGenerateMipmap ( target);
		errcheck();
	}
	
	// NOT SUPPORTED until API level 17 	
	//  public static String glGetActiveAttrib (int program, int index, IntBuffer size, IntBuffer type)
	//  public static String glGetActiveAttrib (int program, int index, int[] size, int sizeOffset, int[] type, int typeOffset);

	// NOT SUPPORTED - use arrays:    public static void glGetActiveAttrib (int program, int index, int bufsize, IntBuffer length, IntBuffer size, IntBuffer type, byte name);
	public static void glGetActiveAttrib (int program, int index, int bufsize, int[] length, int lengthOffset, int[] size, int sizeOffset, int[] type, int typeOffset, byte[] name, int nameOffset)
	{	gl.glGetActiveAttrib ( program,  index,  bufsize, length,  lengthOffset, size,  sizeOffset,  type,  typeOffset, name,  nameOffset);
		errcheck();
	}

	// NOT SUPPORTED until API level 17 	
	// public abstract String glGetActiveUniform (int program, int index, IntBuffer size, IntBuffer type);
	// public static String glGetActiveUniform (int program, int index, int[] size, int sizeOffset, int[] type, int typeOffset);
	
	// NOT SUPPORTED - use arrays:   public abstract void glGetActiveUniform (int program, int index, int bufsize, IntBuffer length, IntBuffer size, IntBuffer type, byte name);    
	public static void glGetActiveUniform (int program, int index, int bufsize, int[] length, int lengthOffset, int[] size, int sizeOffset, int[] type, int typeOffset, byte[] name, int nameOffset)
	{	gl.glGetActiveUniform(program, index, bufsize, length, lengthOffset, size, sizeOffset, type, typeOffset, name, nameOffset);
		errcheck();
	}
	
	// NOT SUPPORTED - use arrays:   public abstract void glGetAttachedShaders (int program, int maxcount, IntBuffer count, IntBuffer shaders);	
	public static void glGetAttachedShaders (int program, int maxcount, int[] count, int countOffset, int[] shaders, int shadersOffset)
	{	gl.glGetAttachedShaders(program,maxcount,count,countOffset,shaders,shadersOffset);
		errcheck();
	}
	public static int glGetAttribLocation (int program, String name)
	{   int r = gl.glGetAttribLocation ( program,  name);
		errcheck();
		return r;
	}	

	// NOT SUPPORTED YET - INCOMPATIBLE TYPES BETWEEN JOGL AND ANDROID
	// public static void glGetBooleanv (int pname, boolean[] params, int offset)

	// NOT SUPPORTED - use arrays:    public abstract void glGetBufferParameteriv (int target, int pname, IntBuffer params);
	public static void glGetBufferParameteriv (int target, int pname, int[] params, int offset)
	{	gl.glGetBufferParameteriv(target,pname,params,offset);
		errcheck();		
	}	
	
	public static int glGetError ()
	{	return gl.glGetError();	
	}
	
	// NOT SUPPORTED - use arrays:   public abstract void glGetFloatv (int pname, FloatBuffer params);	
	public static void glGetFloatv (int pname, float[] params, int offset)
	{	gl.glGetFloatv(pname,params,offset);
		errcheck();
	}	
	// NOT SUPPORTED - use arrays:  public abstract void glGetFramebufferAttachmentParameteriv (int target, int attachment, int pname, IntBuffer params);
	public static void glGetFramebufferAttachmentParameteriv (int target, int attachment, int pname, int[] params, int offset)
	{	gl.glGetFramebufferAttachmentParameteriv(target, attachment, pname,params,offset);
		errcheck();
	}	
	// NOT SUPPORTED - use arrays:   public abstract void glGetIntegerv (int pname, IntBuffer params);	
	public static void glGetIntegerv (int pname, int[] params, int offset)
	{	gl.glGetIntegerv(pname,params,offset);
		errcheck();
	}	
	public static String glGetProgramInfoLog (int program)
	{	byte[] infoLog = new byte[10000];
		int[] l = new int[1];
		gl.glGetProgramInfoLog(program, infoLog.length, l,0, infoLog, 0);
		errcheck();
		return new String(infoLog,0,l[0]);
	}	
	// NOT SUPPORTED - use arrays:   public abstract void glGetProgramiv (int program, int pname, IntBuffer params);	
	public static void glGetProgramiv (int program, int pname, int[] params, int offset)
	{	gl.glGetProgramiv(program,pname,params,offset);
		errcheck();
	}	
	// NOT SUPPORTED - use arrays:   public abstract void glGetRenderbufferParameteriv (int target, int pname, IntBuffer params);	
	public static void glGetRenderbufferParameteriv (int target, int pname, int[] params, int offset)
	{	gl.glGetRenderbufferParameteriv(target, pname, params,offset);
		errcheck();
	}	
	public static String glGetShaderInfoLog (int shader)
	{	byte[] infoLog = new byte[10000];
		int[] l = new int[1];	
		gl.glGetShaderInfoLog(shader, infoLog.length, l,0, infoLog, 0);
		errcheck();
		return new String(infoLog,0,l[0]);
	}
    
	// NOT SUPPORTED - use arrays:    public abstract void glGetShaderPrecisionFormat (int shadertype, int precisiontype, IntBuffer range, IntBuffer precision);
	public static void glGetShaderPrecisionFormat (int shadertype, int precisiontype, int[] range, int rangeOffset, int[] precision, int precisionOffset)
	{	gl.glGetShaderPrecisionFormat(shadertype, precisiontype, range,rangeOffset, precision, precisionOffset);
    	errcheck();
	}
	
	// NOT SUPPORTED until API level 17   
	// public static String glGetShaderSource (int shader);
	
	// NOT SUPPORTED - use arrays:   public abstract void glGetShaderSource (int shader, int bufsize, IntBuffer length, byte source);
	public static void glGetShaderSource (int shader, int bufsize, int[] length, int lengthOffset, byte[] source, int sourceOffset)
	{	gl.glGetShaderSource(shader,bufsize,length,lengthOffset,source,sourceOffset);
		errcheck();
	}	
	// NOT SUPPORTED - use arrays:   public static void glGetShaderiv (int shader, int pname, IntBuffer params)
	public static void glGetShaderiv (int shader, int pname, int[] params, int offset)
	{	gl.glGetShaderiv ( shader,  pname,  params,  offset);
		errcheck();
	}	
	public static String glGetString (int name)
	{	String s = gl.glGetString(name);
		errcheck();
		return s;
	}
	// NOT SUPPORTED - use arrays:    public abstract void glGetTexParameterfv (int target, int pname, FloatBuffer params);
	public static void glGetTexParameterfv (int target, int pname, float[] params, int offset)
	{	gl.glGetTexParameterfv(target,pname,params,offset);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:    public abstract void glGetTexParameteriv (int target, int pname, IntBuffer params);
	public static void glGetTexParameteriv (int target, int pname, int[] params, int offset)
	{	gl.glGetTexParameteriv(target, pname,params,offset);
		errcheck();
	}
	public static int glGetUniformLocation (int program, String name)
	{	int i = gl.glGetUniformLocation ( program,  name);
		errcheck();
		return i;
	}
	// NOT SUPPORTED - use arrays:  public abstract void glGetUniformfv (int program, int location, FloatBuffer params);
	public static void glGetUniformfv (int program, int location, float[] params, int offset)
	{	gl.glGetUniformfv(program,location,params,offset);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:  public abstract void glGetUniformiv (int program, int location, IntBuffer params);
	public static void glGetUniformiv (int program, int location, int[] params, int offset)
	{	gl.glGetUniformiv(program, location, params, offset);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:  public abstract void glGetVertexAttribfv (int index, int pname, FloatBuffer params);
	public static void glGetVertexAttribfv (int index, int pname, float[] params, int offset)
	{	gl.glGetVertexAttribfv (index,pname,params,offset);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:  public abstract void glGetVertexAttribiv (int index, int pname, IntBuffer params);
	public static void glGetVertexAttribiv (int index, int pname, int[] params, int offset)
	{	gl.glGetVertexAttribiv (index,pname,params,offset);
		errcheck();
	}
	public static void glHint (int target, int mode)
	{	gl.glHint (target,mode);
		errcheck();
	}
	public static boolean glIsBuffer (int buffer)
	{	boolean b = gl.glIsBuffer(buffer);
		errcheck();
		return b;
	}
	public static boolean glIsEnabled (int cap)
	{	boolean b = gl.glIsEnabled(cap);
		errcheck();
		return b;
	}
	public static boolean glIsFramebuffer (int framebuffer)
	{	boolean b = gl.glIsFramebuffer(framebuffer);
		errcheck();
		return b;
	}
	public static boolean glIsProgram (int program)
	{	boolean b = gl.glIsProgram(program);
		errcheck();
		return b;
	}
	public static boolean glIsRenderbuffer (int renderbuffer)
	{	boolean b = gl.glIsRenderbuffer(renderbuffer);
		errcheck();
		return b;
	}
	public static boolean glIsShader (int shader)
	{	boolean b = glIsShader(shader);
		errcheck();
		return b;
	}
	public static boolean glIsTexture (int texture)
	{	boolean b = glIsTexture(texture);
		errcheck();
		return b;
	}
	public static void glLineWidth (float width)
	{	gl.glLineWidth(width);
		errcheck();
	}
	public static void glLinkProgram (int program)
	{	gl.glLinkProgram ( program);
		errcheck();
	}
	public static void glPixelStorei (int pname, int param)
	{	gl.glPixelStorei(pname,param);
		errcheck();
	}
	public static void glPolygonOffset (float factor, float units)
	{	gl.glPolygonOffset(factor,units);
		errcheck();
	}	
	public static void glReadPixels (int x, int y, int width, int height, int format, int type, Buffer pixels)
	{	gl.glReadPixels (x,y,width,height,format,type,pixels);
		errcheck();
	}
	public static void glReleaseShaderCompiler ()
	{	gl.glReleaseShaderCompiler();
		errcheck();
	}	
	public static void glRenderbufferStorage (int target, int internalformat, int width, int height)
	{	gl.glRenderbufferStorage (target,internalformat,width,height);
		errcheck();
	}		
	public static void glSampleCoverage (float value, boolean invert)
	{	gl.glSampleCoverage (value,invert);
		errcheck();
	}
	public static void glScissor (int x, int y, int width, int height)
	{	gl.glScissor (x,y,width,height);
		errcheck();
	}

	// BINARY SHADERS ARE NOT SUPPORTED
	// public abstract void glShaderBinary (int n, int[] shaders, int offset, int binaryformat, Buffer binary, int length);
	// public abstract void glShaderBinary (int n, IntBuffer shaders, int binaryformat, Buffer binary, int length);
	
	public static void glShaderSource (int shader, String source)
	{	if(gl.isGL3core())
		{	source = "#version 130\n" + source;
        }        
        source = "#define mediump\n#define highp\n#define lowp\n"+source;
		String[] vlines = new String[] { source };
    	int[] vlengths = new int[] { vlines[0].length() };
    	gl.glShaderSource(shader, vlines.length, vlines, vlengths, 0);
    	errcheck();
	}
	public static void glStencilFunc (int func, int ref, int mask)
	{	gl.glStencilFunc(func,ref,mask);
		errcheck();
	}
	public static void glStencilFuncSeparate (int face, int func, int ref, int mask)
	{	gl.glStencilFuncSeparate (face,func,ref,mask);
		errcheck();
	}
	public static void glStencilMask (int mask)
	{	gl.glStencilMask(mask);
		errcheck();
	}
	public static void glStencilMaskSeparate (int face, int mask)
	{	gl.glStencilMaskSeparate (face,mask);
		errcheck();
	}
	public static void glStencilOp (int fail, int zfail, int zpass)
	{	gl.glStencilOp (fail,zfail,zpass);
		errcheck();
	}
	public static void glStencilOpSeparate (int face, int fail, int zfail, int zpass)
	{	gl.glStencilOpSeparate (face,fail,zfail,zpass);
		errcheck();
	}
	public static void glTexImage2D (int target, int level, int internalformat, int width, int height, int border, int format, int type, Buffer pixels)
	{	gl.glTexImage2D (target,level,internalformat,width,height,border,format,type,pixels);
		errcheck();
	}
	public static void glTexParameterf (int target, int pname, float param)
	{	gl.glTexParameterf(target,pname,param);		
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glTexParameterfv (int target, int pname, FloatBuffer params);
	public static void glTexParameterfv (int target, int pname, float[] params, int offset)
	{	gl.glTexParameterfv (target, pname, params, offset);
		errcheck();
	}
	public static void glTexParameteri (int target, int pname, int param)
	{	gl.glTexParameteri(target,pname,param);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glTexParameteriv (int target, int pname, IntBuffer params);
	public static void glTexParameteriv (int target, int pname, int[] params, int offset)
	{	gl.glTexParameteriv (target, pname, params, offset);
		errcheck();
	}
	public static void glTexSubImage2D (int target, int level, int xoffset, int yoffset, int width, int height, int format, int type, Buffer pixels)
	{	gl.glTexSubImage2D (target, level, xoffset, yoffset, width, height, format, type, pixels);
		errcheck();
	}
	public static void glUniform1f (int location, float x)
	{	gl.glUniform1f ( location,  x);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glUniform1fv (int location, int count, FloatBuffer v);
	public static void glUniform1fv (int location, int count, float[] v, int offset)
	{	gl.glUniform1fv(location,count,v,offset);
		errcheck();
	}
	public static void glUniform1i (int location, int x)
	{	gl.glUniform1i (location, x);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glUniform1iv (int location, int count, IntBuffer v);
	public static void glUniform1iv (int location, int count, int[] v, int offset)
	{	gl.glUniform1iv(location,count,v,offset);
		errcheck();
	}
	public static void glUniform2f (int location, float x, float y)
	{	gl.glUniform2f (location, x, y);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glUniform2fv (int location, int count, FloatBuffer v);
	public static void glUniform2fv (int location, int count, float[] v, int offset)
	{	gl.glUniform2fv ( location, count, v, offset);
		errcheck();
	}
	public static void glUniform2i (int location, int x, int y)
	{	gl.glUniform2i ( location, x, y);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glUniform2iv (int location, int count, IntBuffer v);
	public static void glUniform2iv (int location, int count, int[] v, int offset)
	{	gl.glUniform2iv (location, count, v, offset);
		errcheck();
	}	
	public static void glUniform3f (int location, float x, float y, float z)
	{	gl.glUniform3f (location, x, y, z);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glUniform3fv (int location, int count, FloatBuffer v);
	public static void glUniform3fv (int location, int count, float[] v, int offset)
	{	gl.glUniform3fv (location,  count, v, offset);
		errcheck();
	}
	public static void glUniform3i (int location, int x, int y, int z)
	{	gl.glUniform3i (location, x, y, z);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glUniform3iv (int location, int count, IntBuffer v);
	public static void glUniform3iv (int location, int count, int[] v, int offset)
	{	gl.glUniform3iv (location, count, v, offset);
		errcheck();
	}
	public static void glUniform4f (int location, float x, float y, float z, float w)
	{	gl.glUniform4f (location, x, y, z, w);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glUniform4fv (int location, int count, FloatBuffer v);
	public static void glUniform4fv (int location, int count, float[] v, int offset)
	{	gl.glUniform4fv ( location,  count,  v,  offset);
		errcheck();
	}
	public static void glUniform4i (int location, int x, int y, int z, int w)
	{	gl.glUniform4i (location, x, y, z, w);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glUniform4iv (int location, int count, IntBuffer v);
	public static void glUniform4iv (int location, int count, int[] v, int offset)
	{	gl.glUniform4iv (location, count, v, offset);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glUniformMatrix2fv (int location, int count, boolean transpose, FloatBuffer value);
	public static void glUniformMatrix2fv (int location, int count, boolean transpose, float[] value, int offset)
	{	gl.glUniformMatrix2fv ( location, count, transpose, value, offset);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glUniformMatrix3fv (int location, int count, boolean transpose, FloatBuffer value);
	public static void glUniformMatrix3fv (int location, int count, boolean transpose, float[] value, int offset)
	{	gl.glUniformMatrix3fv (location, count, transpose, value, offset);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glUniformMatrix4fv (int location, int count, boolean transpose, FloatBuffer value);
	public static void glUniformMatrix4fv (int location, int count, boolean transpose, float[] value, int offset)
	{	gl.glUniformMatrix4fv ( location,  count,  transpose, value,  offset);
		errcheck();
	}
	public static void glUseProgram (int program)
	{	gl.glUseProgram ( program);
		errcheck();
	}
	public static void glValidateProgram (int program)
	{	gl.glValidateProgram(program);
		errcheck();
	}
	public static void glVertexAttrib1f (int indx, float x)
	{	gl.glVertexAttrib1f (indx, x);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glVertexAttrib1fv (int indx, FloatBuffer values);
    public static void glVertexAttrib1fv (int indx, float[] values, int offset)
    {	gl.glVertexAttrib1fv (indx, values, offset);
    	errcheck();
    }
	public static void glVertexAttrib2f (int indx, float x, float y)
	{	gl.glVertexAttrib2f (indx, x, y);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glVertexAttrib2fv (int indx, FloatBuffer values);
	public static void glVertexAttrib2fv (int indx, float[] values, int offset)
	{	gl.glVertexAttrib2fv (indx,values,offset);
		errcheck();
	}
	public static void glVertexAttrib3f (int indx, float x, float y, float z)
	{	gl.glVertexAttrib3f (indx, x, y, z);
		errcheck();
	}
	// NOT SUPPORTED - use arrays:   public abstract void glVertexAttrib3fv (int indx, FloatBuffer values);
	public static void glVertexAttrib3fv (int indx, float[] values, int offset)
	{	gl.glVertexAttrib3fv(indx,values,offset);
		errcheck();	
	}
	public static void glVertexAttrib4f (int indx, float x, float y, float z, float w)
	{	gl.glVertexAttrib4f(indx,x,y,z,w);
		errcheck();
	}	
	// NOT SUPPORTED - use arrays:   public abstract void glVertexAttrib4fv (int indx, FloatBuffer values);
	public static void glVertexAttrib4fv (int indx, float[] values, int offset)
	{	gl.glVertexAttrib4fv(indx, values,offset);
		errcheck();
	}

	// NOT SUPPORTED  - can not use client side buffers
	//  public static void glVertexAttribPointer (int indx, int size, int type, boolean normalized, int stride, Buffer ptr);
	//
	
	public static void glVertexAttribPointer (int indx, int size, int type, boolean normalized, int stride, int offset)
	{	gl.glVertexAttribPointer ( indx,  size,  type,  normalized,  stride,  offset);
		errcheck();
	}
		
	public static void glViewport (int x, int y, int width, int height)
	{	gl.glViewport(x,y,width,height);
		errcheck();
	}
	
}
